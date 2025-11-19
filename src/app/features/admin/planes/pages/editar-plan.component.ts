import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PlanService } from '../../../../core/services/plan.service';
import { EtiquetaService } from '../../../../core/services/etiqueta.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Etiqueta } from '../../../../core/models';

/**
 * Editar Plan Nutricional (Admin)
 * US-13: Editar plan existente
 * RN11: Nombre único
 * RN12: Etiquetas deben existir
 */
@Component({
  selector: 'app-editar-plan',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="editar-plan-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon>edit</mat-icon>
            Editar Plan Nutricional
          </h1>
          <p class="page-subtitle">Modifica los detalles del plan nutricional</p>
        </div>
        <button class="btn-link" routerLink="/admin/planes">← Volver a planes</button>
      </div>

      @if (cargando()) {
        <div class="loading">Cargando plan...</div>
      }

      @if (!cargando() && formulario) {
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
                <label for="descripcionObjetivo">Descripción del Objetivo</label>
                <textarea
                  id="descripcionObjetivo"
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
            
            @if (cargandoEtiquetas()) {
              <div class="loading-small">Cargando etiquetas...</div>
            } @else {
              <div class="etiquetas-grid">
                @for (etiqueta of etiquetasDisponibles(); track etiqueta.id) {
                  <label class="etiqueta-checkbox">
                    <input
                      type="checkbox"
                      [checked]="etiquetasSeleccionadas().includes(etiqueta.id)"
                      (change)="toggleEtiqueta(etiqueta.id)"
                    />
                    <span class="etiqueta-info">
                      <span class="etiqueta-nombre">{{ etiqueta.nombre }}</span>
                      <span class="etiqueta-tipo">{{ getTipoLabel(etiqueta.tipoEtiqueta) }}</span>
                    </span>
                  </label>
                }
              </div>
              <small class="help-text">Las etiquetas deben existir en el sistema (RN12)</small>
            }
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" routerLink="/admin/planes">Cancelar</button>
            <button type="submit" class="btn-primary" [disabled]="formulario.invalid || guardando()">
              {{ guardando() ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .editar-plan-container { padding: 2rem; max-width: 900px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h1 { font-size: 2rem; color: #2d3748; margin: 0; }
    h2 { font-size: 1.5rem; color: #2d3748; margin: 0 0 1.5rem 0; border-bottom: 2px solid #667eea; padding-bottom: 0.5rem; }
    .btn-link { background: none; border: none; color: #667eea; font-weight: 600; cursor: pointer; font-size: 1rem; }
    .btn-link:hover { color: #764ba2; }
    
    .plan-form { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .form-section { margin-bottom: 2.5rem; }
    .form-group { margin-bottom: 1.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    
    label { display: block; font-weight: 600; color: #4a5568; margin-bottom: 0.5rem; font-size: 0.95rem; }
    .required { color: #e53e3e; }
    input, textarea { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s; }
    input:focus, textarea:focus { outline: none; border-color: #667eea; }
    input.error, textarea.error { border-color: #e53e3e; }
    .error-text { color: #e53e3e; font-size: 0.85rem; display: block; margin-top: 0.25rem; }
    .help-text { color: #718096; font-size: 0.85rem; display: block; margin-top: 0.25rem; }
    
    .etiquetas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
    .etiqueta-checkbox { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.3s; }
    .etiqueta-checkbox:hover { border-color: #667eea; background: #f7fafc; }
    .etiqueta-checkbox input[type="checkbox"] { width: 20px; height: 20px; cursor: pointer; }
    .etiqueta-info { display: flex; flex-direction: column; }
    .etiqueta-nombre { font-weight: 600; color: #2d3748; }
    .etiqueta-tipo { font-size: 0.85rem; color: #718096; }
    
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e2e8f0; }
    .btn-primary, .btn-secondary { padding: 0.75rem 2rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem; transition: all 0.3s; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { background: #edf2f7; color: #4a5568; }
    .btn-secondary:hover { background: #e2e8f0; }
    
    .loading, .loading-small { text-align: center; padding: 2rem; color: #718096; }
    .loading-small { padding: 1rem; }
  `]
})
export class EditarPlanComponent implements OnInit {
  formulario!: FormGroup;
  cargando = signal(true);
  guardando = signal(false);
  cargandoEtiquetas = signal(true);
  planId!: number;
  etiquetasDisponibles = signal<Etiqueta[]>([]);
  etiquetasSeleccionadas = signal<number[]>([]);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private etiquetaService: EtiquetaService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.planId = Number(this.route.snapshot.paramMap.get('id'));
    this.inicializarFormulario();
    this.cargarEtiquetas();
    this.cargarPlan();
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', Validators.required],
      duracionDias: [7, [Validators.required, Validators.min(1), Validators.max(365)]],
      objetivo: this.fb.group({
        caloriasObjetivo: [2000, [Validators.required, Validators.min(1000), Validators.max(5000)]],
        proteinasObjetivo: [100, [Validators.required, Validators.min(0)]],
        carbohidratosObjetivo: [200, [Validators.required, Validators.min(0)]],
        grasasObjetivo: [60, [Validators.required, Validators.min(0)]],
        descripcion: ['']
      })
    });
  }

  cargarEtiquetas(): void {
    this.etiquetaService.obtenerTodas().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.etiquetasDisponibles.set(response.data);
        }
        this.cargandoEtiquetas.set(false);
      },
      error: () => {
        this.notificationService.showError('Error al cargar etiquetas');
        this.cargandoEtiquetas.set(false);
      }
    });
  }

  cargarPlan(): void {
    this.planService.obtenerPlanPorId(this.planId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const plan = response.data;
          
          // Cargar datos básicos
          this.formulario.patchValue({
            nombre: plan.nombre,
            descripcion: plan.descripcion,
            duracionDias: plan.duracionDias
          });

          // Cargar objetivo nutricional
          if (plan.objetivo) {
            this.formulario.patchValue({
              objetivo: {
                caloriasObjetivo: plan.objetivo.caloriasObjetivo,
                proteinasObjetivo: plan.objetivo.proteinasObjetivo,
                carbohidratosObjetivo: plan.objetivo.carbohidratosObjetivo,
                grasasObjetivo: plan.objetivo.grasasObjetivo,
                descripcion: plan.objetivo.descripcion || ''
              }
            });
          }

          // Cargar etiquetas seleccionadas
          if (plan.etiquetas && plan.etiquetas.length > 0) {
            this.etiquetasSeleccionadas.set(plan.etiquetas.map(e => e.id));
          }

          this.cargando.set(false);
        }
      },
      error: () => {
        this.notificationService.showError('Error al cargar plan');
        this.router.navigate(['/admin/planes']);
      }
    });
  }

  toggleEtiqueta(etiquetaId: number): void {
    const seleccionadas = [...this.etiquetasSeleccionadas()];
    const index = seleccionadas.indexOf(etiquetaId);
    
    if (index > -1) {
      seleccionadas.splice(index, 1);
    } else {
      seleccionadas.push(etiquetaId);
    }
    
    this.etiquetasSeleccionadas.set(seleccionadas);
  }

  getTipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      'ALERGIA': 'Alergia',
      'CONDICION_SALUD': 'Condición de Salud',
      'PREFERENCIA_ALIMENTARIA': 'Preferencia Alimentaria',
      'OBJETIVO_FISICO': 'Objetivo Físico',
      'NIVEL_ACTIVIDAD': 'Nivel de Actividad'
    };
    return labels[tipo] || tipo;
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.notificationService.showWarning('Por favor completa todos los campos requeridos');
      return;
    }

    this.guardando.set(true);
    const data = {
      ...this.formulario.value,
      etiquetaIds: this.etiquetasSeleccionadas().length > 0 ? this.etiquetasSeleccionadas() : undefined
    };

    this.planService.actualizarPlan(this.planId, data).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Plan actualizado exitosamente');
          this.router.navigate(['/admin/planes', this.planId]);
        }
      },
      error: (error) => {
        this.guardando.set(false);
        const mensaje = error.error?.message || 'Error al actualizar el plan';
        this.notificationService.showError(mensaje);
      }
    });
  }
}
