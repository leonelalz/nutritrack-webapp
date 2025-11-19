import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PlanService } from '../../../../core/services/plan.service';
import { EtiquetaService } from '../../../../core/services/etiqueta.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Etiqueta } from '../../../../core/models';

/**
 * Crear Plan Nutricional (Admin)
 * US-12: Crear nuevo plan
 * RN11: Nombre único
 * RN12: Etiquetas deben existir
 */
@Component({
  selector: 'app-crear-plan',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="crear-plan-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon>restaurant_menu</mat-icon>
            Crear Plan Nutricional
          </h1>
          <p class="page-subtitle">Crea un nuevo plan nutricional personalizado</p>
        </div>
        <button class="btn-link" routerLink="/admin/planes">← Volver a planes</button>
      </div>

      <form [formGroup]="formulario" (ngSubmit)="guardar()" class="plan-form">
        <!-- Información básica -->
        <div class="form-section">
          <h2>Información Básica</h2>
          
          <div class="form-group">
            <label for="nombre">Nombre del Plan <span class="required">*</span></label>
            <input
              id="nombre"
              type="text"
              formControlName="nombre"
              placeholder="Ej: Plan Pérdida de Peso - 7 días"
              [class.error]="formulario.get('nombre')?.invalid && formulario.get('nombre')?.touched"
            />
            @if (formulario.get('nombre')?.hasError('required') && formulario.get('nombre')?.touched) {
              <span class="error-text">El nombre es obligatorio</span>
            }
            @if (formulario.get('nombre')?.hasError('minlength')) {
              <span class="error-text">El nombre debe tener al menos 5 caracteres</span>
            }
            <small class="help-text">El nombre debe ser único (RN11)</small>
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción <span class="required">*</span></label>
            <textarea
              id="descripcion"
              formControlName="descripcion"
              rows="4"
              placeholder="Describe los beneficios y características del plan..."
              [class.error]="formulario.get('descripcion')?.invalid && formulario.get('descripcion')?.touched"
            ></textarea>
            @if (formulario.get('descripcion')?.hasError('required') && formulario.get('descripcion')?.touched) {
              <span class="error-text">La descripción es obligatoria</span>
            }
          </div>

          <div class="form-group">
            <label for="duracionDias">Duración (días) <span class="required">*</span></label>
            <input
              id="duracionDias"
              type="number"
              formControlName="duracionDias"
              min="1"
              max="365"
              [class.error]="formulario.get('duracionDias')?.invalid && formulario.get('duracionDias')?.touched"
            />
            @if (formulario.get('duracionDias')?.hasError('required') && formulario.get('duracionDias')?.touched) {
              <span class="error-text">La duración es obligatoria</span>
            }
            @if (formulario.get('duracionDias')?.hasError('min')) {
              <span class="error-text">La duración mínima es 1 día</span>
            }
          </div>
        </div>

        <!-- Objetivos nutricionales -->
        <div class="form-section">
          <h2>Objetivos Nutricionales</h2>
          
          <div formGroupName="objetivo">
            <div class="form-group">
              <label for="descripcion">Descripción del Objetivo <span class="required">*</span></label>
              <textarea
                id="descripcion"
                formControlName="descripcion"
                rows="2"
                placeholder="Ej: Déficit calórico moderado con alta proteína"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="calorias">Calorías Objetivo (kcal) <span class="required">*</span></label>
                <input
                  id="calorias"
                  type="number"
                  formControlName="caloriasObjetivo"
                  min="1000"
                  max="5000"
                  step="50"
                />
              </div>

              <div class="form-group">
                <label for="proteinas">Proteínas (g) <span class="required">*</span></label>
                <input
                  id="proteinas"
                  type="number"
                  formControlName="proteinasObjetivo"
                  min="0"
                  step="5"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="carbohidratos">Carbohidratos (g) <span class="required">*</span></label>
                <input
                  id="carbohidratos"
                  type="number"
                  formControlName="carbohidratosObjetivo"
                  min="0"
                  step="5"
                />
              </div>

              <div class="form-group">
                <label for="grasas">Grasas (g) <span class="required">*</span></label>
                <input
                  id="grasas"
                  type="number"
                  formControlName="grasasObjetivo"
                  min="0"
                  step="5"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Etiquetas -->
        <div class="form-section">
          <h2>Etiquetas</h2>
          <p class="section-description">Selecciona las etiquetas que aplican a este plan</p>
          
          @if (cargandoEtiquetas()) {
            <div class="loading">Cargando etiquetas...</div>
          }

          @if (!cargandoEtiquetas() && etiquetas().length > 0) {
            <div class="etiquetas-grid">
              @for (etiqueta of etiquetas(); track etiqueta.id) {
                <label class="checkbox-card">
                  <input
                    type="checkbox"
                    [checked]="etiquetasSeleccionadas().includes(etiqueta.id)"
                    (change)="toggleEtiqueta(etiqueta.id)"
                  />
                  <span class="checkbox-label">{{ etiqueta.nombre }}</span>
                </label>
              }
            </div>
          }
          
          <small class="help-text">Las etiquetas deben existir previamente (RN12)</small>
        </div>

        <!-- Acciones -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" routerLink="/admin/planes">
            Cancelar
          </button>
          <button
            type="submit"
            class="btn-primary"
            [disabled]="formulario.invalid || guardando()"
          >
            {{ guardando() ? 'Guardando...' : 'Crear Plan' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .crear-plan-container {
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 2rem;
      color: #2d3748;
      margin: 0;
    }

    .btn-link {
      background: none;
      border: none;
      color: #667eea;
      font-weight: 600;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-link:hover {
      text-decoration: underline;
    }

    .plan-form {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-section h2 {
      font-size: 1.25rem;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    .section-description {
      color: #718096;
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      font-weight: 600;
      color: #4a5568;
      margin-bottom: 0.5rem;
    }

    .required {
      color: #e53e3e;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    input.error, select.error, textarea.error {
      border-color: #fc8181;
    }

    .error-text {
      display: block;
      color: #e53e3e;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .help-text {
      display: block;
      color: #718096;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .etiquetas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
    }

    .checkbox-card {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .checkbox-card:hover {
      border-color: #667eea;
      background: #f7fafc;
    }

    .checkbox-card input[type="checkbox"] {
      width: auto;
      margin-right: 0.5rem;
    }

    .checkbox-card input[type="checkbox"]:checked + .checkbox-label {
      font-weight: 600;
      color: #667eea;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 2rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #edf2f7;
      color: #4a5568;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #718096;
    }
  `]
})
export class CrearPlanComponent implements OnInit {
  formulario!: FormGroup;
  guardando = signal(false);
  cargandoEtiquetas = signal(false);
  etiquetas = signal<Etiqueta[]>([]);
  etiquetasSeleccionadas = signal<number[]>([]);

  constructor(
    private fb: FormBuilder,
    private planService: PlanService,
    private etiquetaService: EtiquetaService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarEtiquetas();
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      duracionDias: [7, [Validators.required, Validators.min(1), Validators.max(365)]],
      objetivo: this.fb.group({
        caloriasObjetivo: [2000, [Validators.required, Validators.min(1000), Validators.max(5000)]],
        proteinasObjetivo: [150, [Validators.required, Validators.min(0)]],
        carbohidratosObjetivo: [200, [Validators.required, Validators.min(0)]],
        grasasObjetivo: [70, [Validators.required, Validators.min(0)]],
        descripcion: ['', Validators.required]
      })
    });
  }

  cargarEtiquetas(): void {
    this.cargandoEtiquetas.set(true);
    this.etiquetaService.obtenerTodas().subscribe({
      next: (response) => {
        this.cargandoEtiquetas.set(false);
        if (response.success && response.data) {
          this.etiquetas.set(response.data);
        }
      },
      error: () => {
        this.cargandoEtiquetas.set(false);
        this.notificationService.showError('Error al cargar etiquetas');
      }
    });
  }

  toggleEtiqueta(etiquetaId: number): void {
    const seleccionadas = this.etiquetasSeleccionadas();
    if (seleccionadas.includes(etiquetaId)) {
      this.etiquetasSeleccionadas.set(seleccionadas.filter(id => id !== etiquetaId));
    } else {
      this.etiquetasSeleccionadas.set([...seleccionadas, etiquetaId]);
    }
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.notificationService.showError('Por favor completa todos los campos requeridos');
      return;
    }

    this.guardando.set(true);

    const planData = {
      ...this.formulario.value,
      etiquetaIds: this.etiquetasSeleccionadas()
    };

    this.planService.crearPlan(planData).subscribe({
      next: (response) => {
        this.guardando.set(false);
        if (response.success) {
          this.notificationService.showSuccess('Plan creado exitosamente');
          this.router.navigate(['/admin/planes']);
        }
      },
      error: (error) => {
        this.guardando.set(false);
        if (error.status === 409) {
          this.notificationService.showError('Ya existe un plan con ese nombre (RN11)');
        } else if (error.status === 400) {
          this.notificationService.showError(error.error.message || 'Datos inválidos');
        } else {
          this.notificationService.showError('Error al crear plan');
        }
      }
    });
  }
}
