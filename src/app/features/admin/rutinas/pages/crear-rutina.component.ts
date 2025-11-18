import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RutinaService } from '../../../../core/services/rutina.service';
import { EtiquetaService } from '../../../../core/services/etiqueta.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { NivelDificultad, EtiquetaResponse } from '../../../../core/models';

/**
 * Crear Rutina de Ejercicio (Admin)
 * US-12: Crear nueva rutina
 * RN11: Nombre único
 */
@Component({
  selector: 'app-crear-rutina',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="crear-rutina-container">
      <div class="header">
        <h1>Crear Rutina de Ejercicio</h1>
        <button class="btn-link" routerLink="/admin/rutinas">← Volver a rutinas</button>
      </div>

      <form [formGroup]="formulario" (ngSubmit)="guardar()" class="rutina-form">
        <!-- Información básica -->
        <div class="form-section">
          <h2>Información Básica</h2>
          
          <div class="form-group">
            <label for="nombre">Nombre de la Rutina <span class="required">*</span></label>
            <input
              id="nombre"
              type="text"
              formControlName="nombre"
              placeholder="Ej: Rutina Principiante - 4 semanas"
              [class.error]="formulario.get('nombre')?.invalid && formulario.get('nombre')?.touched"
            />
            @if (formulario.get('nombre')?.hasError('required') && formulario.get('nombre')?.touched) {
              <span class="error-text">El nombre es obligatorio</span>
            }
            <small class="help-text">El nombre debe ser único (RN11)</small>
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción <span class="required">*</span></label>
            <textarea
              id="descripcion"
              formControlName="descripcion"
              rows="4"
              placeholder="Describe los objetivos y características de la rutina..."
              [class.error]="formulario.get('descripcion')?.invalid && formulario.get('descripcion')?.touched"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="duracionSemanas">Duración (semanas) <span class="required">*</span></label>
              <input
                id="duracionSemanas"
                type="number"
                formControlName="duracionSemanas"
                min="1"
                max="52"
              />
            </div>

            <div class="form-group">
              <label for="frecuenciaSemanal">Frecuencia Semanal <span class="required">*</span></label>
              <input
                id="frecuenciaSemanal"
                type="number"
                formControlName="frecuenciaSemanal"
                min="1"
                max="7"
              />
              <small class="help-text">Días de entrenamiento por semana</small>
            </div>
          </div>

          <div class="form-group">
            <label for="nivelDificultad">Nivel de Dificultad <span class="required">*</span></label>
            <select id="nivelDificultad" formControlName="nivelDificultad">
              <option value="">Selecciona un nivel</option>
              <option value="PRINCIPIANTE">Principiante</option>
              <option value="INTERMEDIO">Intermedio</option>
              <option value="AVANZADO">Avanzado</option>
            </select>
          </div>
        </div>

        <!-- Etiquetas -->
        <div class="form-section">
          <h2>Etiquetas</h2>
          <p class="section-description">Selecciona las etiquetas que aplican a esta rutina</p>
          
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
        </div>

        <!-- Acciones -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" routerLink="/admin/rutinas">
            Cancelar
          </button>
          <button
            type="submit"
            class="btn-primary"
            [disabled]="formulario.invalid || guardando()"
          >
            {{ guardando() ? 'Guardando...' : 'Crear Rutina' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .crear-rutina-container {
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

    .rutina-form {
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
export class CrearRutinaComponent implements OnInit {
  formulario!: FormGroup;
  guardando = signal(false);
  cargandoEtiquetas = signal(false);
  etiquetas = signal<EtiquetaResponse[]>([]);
  etiquetasSeleccionadas = signal<number[]>([]);

  constructor(
    private fb: FormBuilder,
    private rutinaService: RutinaService,
    private etiquetaService: EtiquetaService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    //this.cargarEtiquetas();
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      duracionSemanas: [4, [Validators.required, Validators.min(1), Validators.max(52)]],
      frecuenciaSemanal: [3, [Validators.required, Validators.min(1), Validators.max(7)]],
      nivelDificultad: ['', Validators.required]
    });
  }


  
  //cargarEtiquetas(): void {
  //  this.cargandoEtiquetas.set(true);
  //  this.etiquetaService.obtenerTodas().subscribe({
  //    next: (etiquetas) => {
  //      this.cargandoEtiquetas.set(false);
  //      this.etiquetas.set(etiquetas);
  //    },
  //    error: () => {
  //      this.cargandoEtiquetas.set(false);
  //      this.notificationService.showError('Error al cargar etiquetas');
  //    }
  //  });
  //}

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

    const rutinaData = {
      ...this.formulario.value,
      etiquetaIds: this.etiquetasSeleccionadas()
    };

    this.rutinaService.crearRutina(rutinaData).subscribe({
      next: (response) => {
        this.guardando.set(false);
        if (response.success) {
          this.notificationService.showSuccess('Rutina creada exitosamente');
          this.router.navigate(['/admin/rutinas']);
        }
      },
      error: (error) => {
        this.guardando.set(false);
        if (error.status === 409) {
          this.notificationService.showError('Ya existe una rutina con ese nombre (RN11)');
        } else {
          this.notificationService.showError('Error al crear rutina');
        }
      }
    });
  }
}
