import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RutinaService } from '../../../../core/services/rutina.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EjercicioRutinaResponse } from '../../../../core/models';

/**
 * Gestionar Ejercicios de Rutina (US-15)
 * RN13: Series y repeticiones positivas
 */
@Component({
  selector: 'app-gestionar-ejercicios-rutina',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="gestionar-ejercicios-container">
      <div class="header">
        <h1>Gestionar Ejercicios - {{ nombreRutina() }}</h1>
        <button class="btn-link" routerLink="/admin/rutinas">← Volver</button>
      </div>

      @if (cargando()) {
        <div class="loading">Cargando ejercicios...</div>
      }

      @if (!cargando()) {
        <div class="content">
          <!-- Agregar ejercicio -->
          <div class="add-section">
            <h2>Agregar Ejercicio a la Rutina</h2>
            <form [formGroup]="formulario" (ngSubmit)="agregarEjercicio()" class="add-form">
              <div class="form-grid">
                <div class="form-group">
                  <label>ID Ejercicio <span class="req">*</span></label>
                  <input type="number" formControlName="ejercicioId" min="1" />
                </div>

                <div class="form-group">
                  <label>Día <span class="req">*</span></label>
                  <select formControlName="diaSemana">
                    <option value="LUNES">Lunes</option>
                    <option value="MARTES">Martes</option>
                    <option value="MIERCOLES">Miércoles</option>
                    <option value="JUEVES">Jueves</option>
                    <option value="VIERNES">Viernes</option>
                    <option value="SABADO">Sábado</option>
                    <option value="DOMINGO">Domingo</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Series <span class="req">*</span></label>
                  <input type="number" formControlName="series" min="1" />
                  <small>Debe ser positivo (RN13)</small>
                </div>

                <div class="form-group">
                  <label>Repeticiones <span class="req">*</span></label>
                  <input type="number" formControlName="repeticiones" min="1" />
                  <small>Debe ser positivo (RN13)</small>
                </div>

                <div class="form-group">
                  <label>Peso (kg)</label>
                  <input type="number" formControlName="peso" min="0" step="0.5" />
                </div>

                <div class="form-group">
                  <label>Duración (min)</label>
                  <input type="number" formControlName="duracionMinutos" min="1" />
                </div>

                <div class="form-group">
                  <label>Descanso (seg)</label>
                  <input type="number" formControlName="tiempoDescanso" min="0" />
                </div>

                <div class="form-group">
                  <label>Orden</label>
                  <input type="number" formControlName="orden" min="1" />
                </div>
              </div>

              <button type="submit" class="btn-primary" [disabled]="formulario.invalid || guardando()">
                {{ guardando() ? 'Agregando...' : '+ Agregar Ejercicio' }}
              </button>
            </form>
          </div>

          <!-- Lista de ejercicios por día -->
          <div class="ejercicios-section">
            <h2>Ejercicios por Día</h2>

            @if (ejerciciosAgrupados().length === 0) {
              <div class="empty-state">
                <p>No hay ejercicios asignados. Comienza agregando ejercicios para cada día.</p>
              </div>
            }

            @for (grupo of ejerciciosAgrupados(); track grupo.dia) {
              <div class="dia-card">
                <div class="dia-header">
                  <h3>{{ grupo.dia }}</h3>
                  <span class="count">{{ grupo.ejercicios.length }} ejercicio(s)</span>
                </div>

                <div class="ejercicios-list">
                  @for (ejercicio of grupo.ejercicios; track ejercicio.id) {
                    <div class="ejercicio-item">
                      <div class="ejercicio-info">
                        <span class="orden">{{ ejercicio.orden }}.</span>
                        <div class="ejercicio-details">
                          <strong>{{ ejercicio.ejercicio.nombre }}</strong>
                          <div class="ejercicio-meta">
                            <span>{{ ejercicio.series }} series × {{ ejercicio.repeticiones }} reps</span>
                            @if (ejercicio.peso) {
                              <span>{{ ejercicio.peso }} kg</span>
                            }
                            @if (ejercicio.duracionMinutos) {
                              <span>{{ ejercicio.duracionMinutos }} min</span>
                            }
                            @if (ejercicio.descansoSegundos) {
                              <span>Descanso: {{ ejercicio.descansoSegundos }}s</span>
                            }
                          </div>
                          @if (ejercicio.notas) {
                            <p class="notas">{{ ejercicio.notas }}</p>
                          }
                        </div>
                      </div>
                      <button class="btn-delete" (click)="eliminarEjercicio(ejercicio.id)">
                        Eliminar
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .gestionar-ejercicios-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h1 { font-size: 2rem; color: #2d3748; margin: 0; }
    .btn-link { background: none; border: none; color: #667eea; font-weight: 600; cursor: pointer; }
    
    .add-section { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .add-section h2 { font-size: 1.25rem; margin-bottom: 1rem; }
    
    .form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1rem; }
    .form-group { display: flex; flex-direction: column; }
    .form-group label { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem; color: #4a5568; }
    .form-group input, .form-group select { padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.875rem; }
    .form-group small { font-size: 0.75rem; color: #718096; margin-top: 0.25rem; }
    .req { color: #e53e3e; }
    
    .ejercicios-section h2 { font-size: 1.25rem; margin-bottom: 1rem; }
    .dia-card { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .dia-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 2px solid #e2e8f0; }
    .dia-header h3 { font-size: 1.125rem; color: #2d3748; margin: 0; }
    .count { background: #edf2f7; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem; color: #4a5568; }
    
    .ejercicios-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .ejercicio-item { display: flex; justify-content: space-between; align-items: start; padding: 1rem; background: #f7fafc; border-radius: 8px; }
    .ejercicio-info { display: flex; gap: 1rem; flex: 1; }
    .orden { font-weight: 700; color: #667eea; font-size: 1.125rem; }
    .ejercicio-details { flex: 1; }
    .ejercicio-details strong { display: block; color: #2d3748; margin-bottom: 0.25rem; }
    .ejercicio-meta { display: flex; gap: 1rem; font-size: 0.875rem; color: #718096; flex-wrap: wrap; }
    .notas { margin-top: 0.5rem; font-size: 0.875rem; color: #718096; font-style: italic; }
    
    .btn-primary { padding: 0.75rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .btn-delete { padding: 0.5rem 1rem; background: #fc8181; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.875rem; white-space: nowrap; }
    .btn-delete:hover { background: #f56565; }
    
    .loading, .empty-state { text-align: center; padding: 3rem; color: #718096; }
  `]
})
export class GestionarEjerciciosRutinaComponent implements OnInit {
  formulario!: FormGroup;
  rutinaId!: number;
  nombreRutina = signal('');
  cargando = signal(true);
  guardando = signal(false);
  ejercicios = signal<EjercicioRutinaResponse[]>([]);
  ejerciciosAgrupados = signal<{ dia: string; ejercicios: EjercicioRutinaResponse[] }[]>([]);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rutinaService: RutinaService,
    private notificationService: NotificationService
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.rutinaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarRutina();
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      ejercicioId: ['', [Validators.required, Validators.min(1)]],
      diaSemana: ['LUNES', Validators.required],
      series: [3, [Validators.required, Validators.min(1)]],
      repeticiones: [12, [Validators.required, Validators.min(1)]],
      peso: [null],
      duracionMinutos: [null],
      tiempoDescanso: [60],
      orden: [1, [Validators.required, Validators.min(1)]],
      notas: ['']
    });
  }

  cargarRutina(): void {
    this.rutinaService.obtenerRutinaPorId(this.rutinaId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.nombreRutina.set(response.data.nombre);
          this.ejercicios.set(response.data.ejercicios || []);
          this.agruparEjercicios();
          this.cargando.set(false);
        }
      },
      error: () => {
        this.notificationService.showError('Error al cargar rutina');
        this.router.navigate(['/admin/rutinas']);
      }
    });
  }

  agruparEjercicios(): void {
    // Como la API no devuelve diaSemana, simplemente mostramos todos los ejercicios
    // en un solo grupo ordenados por orden
    const agrupados = [{
      dia: 'Ejercicios de la rutina',
      ejercicios: [...this.ejercicios()].sort((a, b) => a.orden - b.orden)
    }];

    this.ejerciciosAgrupados.set(agrupados);
  }

  agregarEjercicio(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.notificationService.showError('Completa los campos requeridos');
      return;
    }

    // Validación RN13: Series y repeticiones positivas
    const series = this.formulario.get('series')?.value;
    const repeticiones = this.formulario.get('repeticiones')?.value;
    
    if (series <= 0 || repeticiones <= 0) {
      this.notificationService.showError('Series y repeticiones deben ser positivas (RN13)');
      return;
    }

    this.guardando.set(true);
    
    this.rutinaService.agregarEjercicio(this.rutinaId, this.formulario.value).subscribe({
      next: (response) => {
        this.guardando.set(false);
        if (response.success) {
          this.notificationService.showSuccess('Ejercicio agregado');
          this.formulario.reset({
            diaSemana: 'LUNES',
            series: 3,
            repeticiones: 12,
            tiempoDescanso: 60,
            orden: 1
          });
          this.cargarRutina();
        }
      },
      error: (error) => {
        this.guardando.set(false);
        this.notificationService.showError(error.error?.message || 'Error al agregar ejercicio');
      }
    });
  }

  eliminarEjercicio(ejercicioId: number): void {
    if (!confirm('¿Eliminar este ejercicio de la rutina?')) return;

    this.rutinaService.eliminarEjercicio(this.rutinaId, ejercicioId).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Ejercicio eliminado');
          this.cargarRutina();
        }
      },
      error: () => {
        this.notificationService.showError('Error al eliminar');
      }
    });
  }

  formatearDia(dia: string): string {
    const dias: Record<string, string> = {
      'LUNES': 'Lunes',
      'MARTES': 'Martes',
      'MIERCOLES': 'Miércoles',
      'JUEVES': 'Jueves',
      'VIERNES': 'Viernes',
      'SABADO': 'Sábado',
      'DOMINGO': 'Domingo'
    };
    return dias[dia] || dia;
  }
}
