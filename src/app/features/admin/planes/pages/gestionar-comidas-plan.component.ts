import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { PlanService } from '../../../../core/services/plan.service';
import { ComidaService } from '../../../../core/services/comida.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TipoComida, DiaPlanRequest, DiaPlanResponse, ComidaInfo } from '../../../../core/models/plan.model';
import { Comida } from '../../../../core/models/comida.model';

interface ComidaEnPlan extends DiaPlanRequest {
  comida: ComidaInfo;
  tempId?: string;
  mostrarDetalles?: boolean;
}

interface DiaPlan {
  numeroDia: number;
  diaLabel: string;
  comidas: ComidaEnPlan[];
}

/**
 * Gestionar Comidas del Plan Nutricional
 * Similar a gestionar ejercicios en rutinas
 */
@Component({
  selector: 'app-gestionar-comidas-plan',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatExpansionModule,
    MatBadgeModule
  ],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon>restaurant_menu</mat-icon>
            Gestionar Comidas - {{ nombrePlan() }}
          </h1>
          <p class="page-subtitle">Agrega y configura las comidas para cada día del plan</p>
        </div>
        <button mat-raised-button routerLink="/admin/planes" color="primary">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </button>
      </div>

      @if (cargando()) {
        <div class="loading-state">
          <mat-icon>hourglass_empty</mat-icon>
          <p>Cargando comidas...</p>
        </div>
      } @else {
        <div class="layout-single">
          <!-- Planificación por días -->
          <div class="planificacion-dias">
            <mat-card class="planning-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>calendar_today</mat-icon>
                  Planificación por Días
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                @for (dia of diasPlan(); track dia.numeroDia) {
                  <mat-expansion-panel class="dia-panel" [expanded]="true">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <mat-icon>event</mat-icon>
                        <strong>{{ dia.diaLabel }}</strong>
                        <span class="comidas-count" [matBadge]="dia.comidas.length" matBadgeColor="accent">
                        </span>
                      </mat-panel-title>
                    </mat-expansion-panel-header>

                    <div class="day-content">
                      @if (dia.comidas.length === 0) {
                        <div class="empty-day">
                          <mat-icon>restaurant_menu</mat-icon>
                          <p>No hay comidas programadas para este día</p>
                        </div>
                      }

                      @for (comida of dia.comidas; track comida.tempId || comida.idComida; let idx = $index) {
                        <div class="comida-en-dia">
                          <!-- Vista compacta -->
                          <div class="comida-compact-view">
                            <span class="orden-numero">{{ idx + 1 }}</span>
                            <div class="comida-info-compact">
                              <h4>{{ comida.comida.nombre }}</h4>
                              <div class="comida-quick-info">
                                <span class="badge badge-tipo">{{ formatearTipoComida(comida.tipoComida) }}</span>
                                @if (comida.comida.calorias) {
                                  <span class="quick-detail">{{ comida.comida.calorias }} kcal</span>
                                }
                                @if (comida.comida.tiempoPreparacion) {
                                  <span class="quick-detail">{{ comida.comida.tiempoPreparacion }} min</span>
                                }
                              </div>
                            </div>
                            <div class="compact-actions">
                              <button mat-icon-button (click)="toggleDetalles(dia.numeroDia, idx)" [attr.aria-label]="comida.mostrarDetalles ? 'Ocultar detalles' : 'Mostrar detalles'">
                                <mat-icon>{{ comida.mostrarDetalles ? 'expand_less' : 'expand_more' }}</mat-icon>
                              </button>
                              <button mat-icon-button color="warn" (click)="eliminarComidaDia(dia.numeroDia, idx)">
                                <mat-icon>delete</mat-icon>
                              </button>
                            </div>
                          </div>

                          <!-- Detalles expandibles -->
                          @if (comida.mostrarDetalles) {
                            <div class="comida-detalles">
                              <mat-form-field appearance="outline" class="full-width">
                                <mat-label>Notas</mat-label>
                                <textarea matInput [(ngModel)]="comida.notas" rows="2" placeholder="Ej: Servir caliente, agregar limón"></textarea>
                              </mat-form-field>
                            </div>
                          }
                        </div>
                      }

                      <!-- Formulario para agregar comida -->
                      @if (mostrarFormAgregarComida() && diaSeleccionado() === dia.numeroDia) {
                        <div class="form-agregar-comida">
                          <h4>Agregar Comida</h4>
                          <mat-form-field appearance="outline" class="full-width">
                            <mat-label>Seleccionar Comida</mat-label>
                            <mat-select [(ngModel)]="comidaSeleccionadaId">
                              <mat-option [value]="null">-- Seleccionar --</mat-option>
                              @for (comida of comidasDisponibles(); track comida.id) {
                                <mat-option [value]="comida.id">
                                  {{ comida.nombre }} ({{ (comida.nutricionTotal && comida.nutricionTotal.energiaTotal) || 0 }} kcal)
                                </mat-option>
                              }
                            </mat-select>
                          </mat-form-field>

                          <mat-form-field appearance="outline" class="full-width">
                            <mat-label>Tipo de Comida</mat-label>
                            <mat-select [(ngModel)]="tipoComidaSeleccionado">
                              <mat-option value="DESAYUNO">Desayuno</mat-option>
                              <mat-option value="ALMUERZO">Almuerzo</mat-option>
                              <mat-option value="CENA">Cena</mat-option>
                              <mat-option value="SNACK">Snack</mat-option>
                              <mat-option value="MERIENDA">Merienda</mat-option>
                              <mat-option value="COLACION">Colación</mat-option>
                            </mat-select>
                          </mat-form-field>

                          <div class="form-actions">
                            <button mat-button (click)="cancelarAgregarComida()">
                              Cancelar
                            </button>
                            <button mat-raised-button color="primary" (click)="agregarComidaADia(dia.numeroDia)" [disabled]="!comidaSeleccionadaId || !tipoComidaSeleccionado">
                              <mat-icon>add</mat-icon>
                              Agregar
                            </button>
                          </div>
                        </div>
                      }

                      @if (!mostrarFormAgregarComida() || diaSeleccionado() !== dia.numeroDia) {
                        <button mat-raised-button color="accent" (click)="abrirFormAgregarComida(dia.numeroDia)" class="btn-add-comida">
                          <mat-icon>add</mat-icon>
                          Agregar Comida
                        </button>
                      }
                    </div>
                  </mat-expansion-panel>
                }
              </mat-card-content>
            </mat-card>

            <!-- Botón guardar -->
            <div class="action-buttons">
              <button mat-raised-button color="primary" (click)="guardarPlan()" [disabled]="guardando() || !hayComidas()" class="btn-save">
                <mat-icon>save</mat-icon>
                {{ guardando() ? 'Guardando...' : 'Guardar Plan Completo' }}
              </button>
              <p class="save-hint" *ngIf="totalComidas() > 0">{{ totalComidas() }} comida(s) en total</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 2rem;
    }

    .header-content {
      flex: 1;
    }

    .page-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #2d3748;
    }

    .page-title mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #f59e0b;
    }

    .page-subtitle {
      margin: 0;
      color: #718096;
      font-size: 1rem;
    }

    /* Layout */
    .layout-single {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Panel Planificación */
    .planning-card {
      width: 100%;
      max-height: calc(100vh - 200px);
      overflow-y: auto;
    }

    .planning-card mat-card-content {
      padding: 1rem !important;
    }

    .dia-panel {
      margin-bottom: 1rem !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
    }

    .dia-panel mat-panel-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.1rem;
    }

    .comidas-count {
      margin-left: auto;
    }

    .day-content {
      padding: 1rem 0;
    }

    .empty-day {
      text-align: center;
      padding: 2rem;
      color: #a0aec0;
    }

    .empty-day mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .comida-en-dia {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-bottom: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.2s;
    }

    .comida-en-dia:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      border-color: #cbd5e0;
    }

    /* Vista compacta */
    .comida-compact-view {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      min-height: 60px;
    }

    .orden-numero {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      flex-shrink: 0;
    }

    .comida-info-compact {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    .comida-info-compact h4 {
      margin: 0 0 0.375rem 0;
      font-size: 0.938rem;
      color: #2d3748;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .comida-quick-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .quick-detail {
      padding: 0.188rem 0.5rem;
      background: #f7fafc;
      color: #4a5568;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid #e2e8f0;
      white-space: nowrap;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge-tipo {
      background: #fef3c7;
      color: #92400e;
    }

    /* Formulario agregar comida */
    .form-agregar-comida {
      background: #f8f9fa;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .form-agregar-comida h4 {
      margin: 0 0 1rem 0;
      color: #2d3748;
    }

    .form-agregar-comida mat-form-field {
      width: 100%;
      margin-bottom: 0.75rem;
    }

    .form-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .btn-add-comida {
      width: 100%;
      margin-bottom: 1rem;
    }

    .compact-actions {
      display: flex;
      gap: 0.25rem;
      flex-shrink: 0;
      margin-left: auto;
    }

    .compact-actions button {
      width: 32px;
      height: 32px;
      padding: 0;
    }

    /* Detalles expandibles */
    .comida-detalles {
      padding: 0 1rem 1rem 4.5rem;
      background: #f8f9fa;
      border-top: 1px solid #e2e8f0;
    }

    .full-width {
      width: 100%;
    }

    /* Action Buttons */
    .action-buttons {
      margin-top: 2rem;
      text-align: center;
    }

    .btn-save {
      padding: 0.75rem 3rem;
      font-size: 1rem;
      font-weight: 600;
    }

    .save-hint {
      margin-top: 0.75rem;
      color: #718096;
      font-size: 0.875rem;
    }

    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .loading-state mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #cbd5e0;
      margin-bottom: 1rem;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .comida-compact-view {
        flex-wrap: wrap;
      }

      .comida-info-compact {
        width: 100%;
      }

      .comida-detalles {
        padding-left: 1rem;
      }
    }
  `]
})
export class GestionarComidasPlanComponent implements OnInit {
  planId!: number;
  nombrePlan = signal('');
  duracionDias = signal(7);
  cargando = signal(true);
  guardando = signal(false);

  // Comidas disponibles del catálogo
  comidasDisponibles = signal<Comida[]>([]);

  // Días del plan con comidas
  diasPlan = signal<DiaPlan[]>([]);

  mostrarFormAgregarComida = signal(false);
  diaSeleccionado = signal<number | null>(null);
  comidaSeleccionadaId: number | null = null;
  tipoComidaSeleccionado: TipoComida | null = null;

  totalComidas = computed(() =>
    this.diasPlan().reduce((total, dia) => total + dia.comidas.length, 0)
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private comidaService: ComidaService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.planId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);

    Promise.all([
      this.cargarPlan(),
      this.cargarComidasDisponibles()
    ]).finally(() => {
      this.cargando.set(false);
    });
  }

  async cargarPlan(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.planService.obtenerPlanPorId(this.planId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.nombrePlan.set(response.data.nombre);
            this.duracionDias.set(response.data.duracionDias);
            this.inicializarDias(response.data.duracionDias);
            this.cargarComidasExistentes();
          }
          resolve();
        },
        error: (error) => {
          this.notificationService.showError('Error al cargar plan');
          this.router.navigate(['/admin/planes']);
          reject(error);
        }
      });
    });
  }

  inicializarDias(duracion: number): void {
    const dias: DiaPlan[] = [];
    for (let i = 1; i <= duracion; i++) {
      dias.push({
        numeroDia: i,
        diaLabel: `Día ${i}`,
        comidas: []
      });
    }
    this.diasPlan.set(dias);
  }

  cargarComidasExistentes(): void {
    this.planService.obtenerDiasPlan(this.planId).subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.length > 0) {
          const dias = this.diasPlan();

          response.data.forEach(diaData => {
            const diaPlan = dias.find(d => d.numeroDia === diaData.numeroDia);
            if (diaPlan) {
              const comidaEnPlan: ComidaEnPlan = {
                idComida: diaData.comida.id,
                numeroDia: diaData.numeroDia,
                tipoComida: diaData.tipoComida,
                notas: diaData.notas,
                comida: {
                  id: diaData.comida.id,
                  nombre: diaData.comida.nombre,
                  tipo: diaData.comida.tipo,
                  tiempoPreparacion: diaData.comida.tiempoPreparacion,
                  calorias: diaData.comida.calorias
                },
                tempId: `existing-${diaData.id}`,
                mostrarDetalles: false
              };
              diaPlan.comidas.push(comidaEnPlan);
            }
          });

          this.diasPlan.set([...dias]);
          this.notificationService.showSuccess(`${response.data.length} comida(s) cargada(s)`);
        }
      },
      error: (error) => {
        console.error('Error al cargar comidas existentes:', error);
      }
    });
  }

  async cargarComidasDisponibles(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.comidaService.listar(0, 100).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.comidasDisponibles.set(response.data.content || []);
          }
          resolve();
        },
        error: (error) => {
          this.notificationService.showError('Error al cargar comidas');
          reject(error);
        }
      });
    });
  }

  abrirFormAgregarComida(numeroDia: number): void {
    this.mostrarFormAgregarComida.set(true);
    this.diaSeleccionado.set(numeroDia);
    this.comidaSeleccionadaId = null;
    this.tipoComidaSeleccionado = null;
  }

  cancelarAgregarComida(): void {
    this.mostrarFormAgregarComida.set(false);
    this.diaSeleccionado.set(null);
    this.comidaSeleccionadaId = null;
    this.tipoComidaSeleccionado = null;
  }

  agregarComidaADia(numeroDia: number): void {
    if (!this.comidaSeleccionadaId || !this.tipoComidaSeleccionado) return;

    const comida = this.comidasDisponibles().find(c => c.id === this.comidaSeleccionadaId);
    if (!comida) return;

    const dias = this.diasPlan();
    const diaData = dias.find(d => d.numeroDia === numeroDia);
    if (!diaData) return;

    // Transform Comida to ComidaInfo format
    const comidaInfo: ComidaInfo = {
      id: comida.id,
      nombre: comida.nombre,
      tipo: comida.tipoComida,
      tiempoPreparacion: comida.tiempoPreparacionMinutos || 0,
      calorias: comida.nutricionTotal?.energiaTotal || 0
    };

    const nuevaComida: ComidaEnPlan = {
      tempId: `temp-${Date.now()}-${Math.random()}`,
      idComida: comida.id,
      numeroDia: numeroDia,
      tipoComida: this.tipoComidaSeleccionado,
      comida: comidaInfo,
      mostrarDetalles: false
    };

    diaData.comidas.push(nuevaComida);
    this.diasPlan.set([...dias]);
    this.cancelarAgregarComida();
    this.notificationService.showSuccess(`Comida agregada a ${diaData.diaLabel}`);
  }

  eliminarComidaDia(numeroDia: number, index: number): void {
    const dias = this.diasPlan();
    const diaData = dias.find(d => d.numeroDia === numeroDia);
    if (diaData) {
      diaData.comidas.splice(index, 1);
      this.diasPlan.set([...dias]);
    }
  }

  toggleDetalles(numeroDia: number, index: number): void {
    const dias = this.diasPlan();
    const diaData = dias.find(d => d.numeroDia === numeroDia);
    if (diaData && diaData.comidas[index]) {
      diaData.comidas[index].mostrarDetalles = !diaData.comidas[index].mostrarDetalles;
      this.diasPlan.set([...dias]);
    }
  }

  hayComidas(): boolean {
    return this.totalComidas() > 0;
  }

  guardarPlan(): void {
    if (!this.hayComidas()) {
      this.notificationService.showError('Agrega al menos una comida');
      return;
    }

    this.guardando.set(true);

    // PASO 1: Obtener todas las comidas existentes para eliminarlas
    this.planService.obtenerDiasPlan(this.planId).subscribe({
      next: (response) => {
        const comidasExistentes = response.data || [];
        const promesasEliminar: Promise<any>[] = [];

        // Eliminar todas las comidas existentes
        comidasExistentes.forEach(comida => {
          const promesa = new Promise((resolve, reject) => {
            this.planService.eliminarDiaDelPlan(this.planId, comida.id).subscribe({
              next: () => resolve(true),
              error: (err) => reject(err)
            });
          });
          promesasEliminar.push(promesa);
        });

        // PASO 2: Después de eliminar, agregar todas las comidas actuales
        Promise.all(promesasEliminar)
          .then(() => {
            const promesasAgregar: Promise<any>[] = [];

            // Agregar TODAS las comidas
            this.diasPlan().forEach(dia => {
              dia.comidas.forEach(comida => {
                const request: DiaPlanRequest = {
                  numeroDia: comida.numeroDia,
                  tipoComida: comida.tipoComida,
                  idComida: comida.idComida,
                  notas: comida.notas
                };

                const promesa = new Promise((resolve, reject) => {
                  this.planService.agregarDiaAlPlan(this.planId, request).subscribe({
                    next: () => resolve(true),
                    error: (err) => reject(err)
                  });
                });

                promesasAgregar.push(promesa);
              });
            });

            return Promise.all(promesasAgregar);
          })
          .then(() => {
            this.notificationService.showSuccess('Plan guardado correctamente');
            this.router.navigate(['/admin/planes']);
          })
          .catch((error) => {
            console.error('Error al guardar:', error);
            this.notificationService.showError(
              error.error?.message || 'Error al guardar el plan'
            );
          })
          .finally(() => {
            this.guardando.set(false);
          });
      },
      error: (error) => {
        console.error('Error al obtener comidas:', error);
        this.notificationService.showError('Error al guardar el plan');
        this.guardando.set(false);
      }
    });
  }

  formatearTipoComida(tipo: TipoComida): string {
    const tipos: Record<string, string> = {
      'DESAYUNO': 'Desayuno',
      'ALMUERZO': 'Almuerzo',
      'CENA': 'Cena',
      'SNACK': 'Snack',
      'MERIENDA': 'Merienda',
      'COLACION': 'Colación',
      'PRE_ENTRENAMIENTO': 'Pre-Entrenamiento',
      'POST_ENTRENAMIENTO': 'Post-Entrenamiento'
    };
    return tipos[tipo] || tipo;
  }
}
