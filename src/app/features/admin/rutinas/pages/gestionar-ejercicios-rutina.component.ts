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
import { RutinaService } from '../../../../core/services/rutina.service';
import { EjercicioService } from '../../../../core/services/ejercicio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EjercicioRutinaResponse, Ejercicio, EjercicioRutinaRequest, DiaSemana } from '../../../../core/models';

interface EjercicioEnRutina extends EjercicioRutinaRequest {
  ejercicio: Ejercicio;
  tempId?: string; // ID temporal para tracking
  mostrarDetalles?: boolean; // Para expandir/colapsar detalles
}

interface DiaRutina {
  semanaBase: number;
  dia: DiaSemana;
  diaLabel: string;
  ejercicios: EjercicioEnRutina[];
}

/**
 * Gestionar Ejercicios de Rutina con Drag & Drop (US-15)
 * RN13: Series y repeticiones positivas
 */
@Component({
  selector: 'app-gestionar-ejercicios-rutina',
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
            <mat-icon>fitness_center</mat-icon>
            Gestionar Ejercicios - {{ nombreRutina() }}
          </h1>
          <p class="page-subtitle">Agrega y configura los ejercicios para cada día de la semana</p>
        </div>
        <button mat-raised-button routerLink="/admin/rutinas" color="primary">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </button>
      </div>

      @if (cargando()) {
        <div class="loading-state">
          <mat-icon>hourglass_empty</mat-icon>
          <p>Cargando ejercicios...</p>
        </div>
      } @else {
        <div class="layout-single">
          <!-- Planificación semanal -->
          <div class="planificacion-semanal">
            <mat-card class="planning-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>calendar_today</mat-icon>
                  Planificación Semanal
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                @for (dia of diasSemana(); track dia.dia) {
                  <mat-expansion-panel class="dia-panel" [expanded]="true" [hideToggle]="false">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <mat-icon>event</mat-icon>
                        <strong>{{ dia.diaLabel }}</strong>
                        <span class="ejercicios-count" [matBadge]="dia.ejercicios.length" matBadgeColor="accent">
                        </span>
                      </mat-panel-title>
                    </mat-expansion-panel-header>

                    <div class="day-content">
                      @if (dia.ejercicios.length === 0) {
                        <div class="empty-day">
                          <mat-icon>fitness_center</mat-icon>
                          <p>No hay ejercicios programados para este día</p>
                        </div>
                      }

                      @for (ejercicio of dia.ejercicios; track ejercicio.tempId || ejercicio.ejercicioId; let idx = $index) {
                        <div class="ejercicio-en-dia">
                          <!-- Vista compacta -->
                          <div class="ejercicio-compact-view">
                            <span class="orden-numero">{{ idx + 1 }}</span>
                            <div class="ejercicio-info-compact">
                              <h4>{{ ejercicio.ejercicio.nombre }}</h4>
                              <div class="ejercicio-quick-info">
                                <span class="badge badge-tipo">{{ formatearTipo(ejercicio.ejercicio.tipoEjercicio) }}</span>
                                @if (ejercicio.series && ejercicio.repeticiones) {
                                  <span class="quick-detail">{{ ejercicio.series }}x{{ ejercicio.repeticiones }}</span>
                                }
                                @if (ejercicio.duracionMinutos) {
                                  <span class="quick-detail">{{ ejercicio.duracionMinutos }} min</span>
                                }
                              </div>
                            </div>
                            <div class="compact-actions">
                              <button mat-icon-button (click)="toggleDetalles(dia.dia, idx)" [attr.aria-label]="ejercicio.mostrarDetalles ? 'Ocultar detalles' : 'Mostrar detalles'">
                                <mat-icon>{{ ejercicio.mostrarDetalles ? 'expand_less' : 'expand_more' }}</mat-icon>
                              </button>
                              <button mat-icon-button (click)="moverArriba(dia.dia, idx)" [disabled]="idx === 0" title="Mover arriba">
                                <mat-icon>arrow_upward</mat-icon>
                              </button>
                              <button mat-icon-button (click)="moverAbajo(dia.dia, idx)" [disabled]="idx === dia.ejercicios.length - 1" title="Mover abajo">
                                <mat-icon>arrow_downward</mat-icon>
                              </button>
                              <button mat-icon-button color="warn" (click)="eliminarEjercicioDia(dia.dia, idx)">
                                <mat-icon>delete</mat-icon>
                              </button>
                            </div>
                          </div>

                          <!-- Detalles expandibles -->
                          @if (ejercicio.mostrarDetalles) {
                            <div class="ejercicio-detalles">
                              <div class="config-row">
                                <mat-form-field appearance="outline" class="config-field">
                                  <mat-label>Series</mat-label>
                                  <input matInput type="number" [(ngModel)]="ejercicio.series" min="1" required>
                                  <mat-icon matPrefix>repeat</mat-icon>
                                </mat-form-field>

                                <mat-form-field appearance="outline" class="config-field">
                                  <mat-label>Repeticiones</mat-label>
                                  <input matInput type="number" [(ngModel)]="ejercicio.repeticiones" min="1" required>
                                  <mat-icon matPrefix>format_list_numbered</mat-icon>
                                </mat-form-field>

                                <mat-form-field appearance="outline" class="config-field">
                                  <mat-label>Peso (kg)</mat-label>
                                  <input matInput type="number" [(ngModel)]="ejercicio.peso" min="0" step="0.5">
                                  <mat-icon matPrefix>fitness_center</mat-icon>
                                </mat-form-field>
                              </div>

                              <div class="config-row">
                                <mat-form-field appearance="outline" class="config-field">
                                  <mat-label>Duración (min)</mat-label>
                                  <input matInput type="number" [(ngModel)]="ejercicio.duracionMinutos" min="0">
                                  <mat-icon matPrefix>timer</mat-icon>
                                </mat-form-field>

                                <mat-form-field appearance="outline" class="config-field">
                                  <mat-label>Descanso (seg)</mat-label>
                                  <input matInput type="number" [(ngModel)]="ejercicio.descansoSegundos" min="0">
                                  <mat-icon matPrefix>pause_circle</mat-icon>
                                </mat-form-field>
                              </div>

                              <mat-form-field appearance="outline" class="full-width">
                                <mat-label>Notas</mat-label>
                                <textarea matInput [(ngModel)]="ejercicio.notas" rows="2"></textarea>
                              </mat-form-field>
                            </div>
                          }
                        </div>
                      }

                      <!-- Formulario para agregar ejercicio -->
                      @if (mostrarFormAgregarEjercicio() && diaSeleccionado() === dia.dia) {
                        <div class="form-agregar-ejercicio">
                          <h4>Agregar Ejercicio</h4>
                          <mat-form-field appearance="outline" class="full-width">
                            <mat-label>Seleccionar Ejercicio</mat-label>
                            <mat-select [(ngModel)]="ejercicioSeleccionadoId">
                              <mat-option [value]="null">-- Seleccionar --</mat-option>
                              @for (ejercicio of ejerciciosDisponibles(); track ejercicio.id) {
                                <mat-option [value]="ejercicio.id">
                                  {{ ejercicio.nombre }} - {{ formatearTipo(ejercicio.tipoEjercicio) }}
                                </mat-option>
                              }
                            </mat-select>
                          </mat-form-field>

                          <div class="form-actions">
                            <button mat-button (click)="cancelarAgregarEjercicio()">
                              Cancelar
                            </button>
                            <button mat-raised-button color="primary" (click)="agregarEjercicioADia(dia.dia)" [disabled]="!ejercicioSeleccionadoId">
                              <mat-icon>add</mat-icon>
                              Agregar
                            </button>
                          </div>
                        </div>
                      }

                      @if (!mostrarFormAgregarEjercicio() || diaSeleccionado() !== dia.dia) {
                        <button mat-raised-button color="accent" (click)="abrirFormAgregarEjercicio(dia.dia)" class="btn-add-ejercicio">
                          <mat-icon>add</mat-icon>
                          Agregar Ejercicio
                        </button>
                      }
                    </div>
                  </mat-expansion-panel>
                }
              </mat-card-content>
            </mat-card>

            <!-- Botón guardar -->
            <div class="action-buttons">
              <button mat-raised-button color="primary" (click)="guardarRutina()" [disabled]="guardando() || !hayEjercicios()" class="btn-save">
                <mat-icon>save</mat-icon>
                {{ guardando() ? 'Guardando...' : 'Guardar Rutina Completa' }}
              </button>
              <p class="save-hint" *ngIf="totalEjercicios() > 0">{{ totalEjercicios() }} ejercicio(s) en total</p>
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
      color: #667eea;
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
      gap: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
    }

    .dia-panel mat-panel-title mat-icon {
      color: #667eea;
    }

    .ejercicios-count {
      margin-left: auto;
    }

    .day-content {
      padding: 0.75rem;
    }

    .btn-add-ejercicio {
      width: 100%;
      margin-top: 0.75rem;
    }

    .form-agregar-ejercicio {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 0.75rem;
      border: 2px solid #e2e8f0;
    }

    .form-agregar-ejercicio h4 {
      margin: 0 0 1rem 0;
      font-size: 0.938rem;
      color: #2d3748;
      font-weight: 600;
    }

    .form-actions-inline {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.75rem;
    }

    .empty-day {
      text-align: center;
      padding: 2rem 1rem;
      color: #a0aec0;
    }

    .empty-day mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .ejercicio-en-dia {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-bottom: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.2s;
      position: relative;
    }

    .ejercicio-en-dia:last-child {
      margin-bottom: 0;
    }

    .ejercicio-en-dia:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      border-color: #cbd5e0;
    }

    /* Vista compacta */
    .ejercicio-compact-view {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      position: relative;
      min-height: 60px;
    }

    .orden-numero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

    .ejercicio-info-compact {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    .ejercicio-info-compact h4 {
      margin: 0 0 0.375rem 0;
      font-size: 0.938rem;
      color: #2d3748;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ejercicio-quick-info {
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
      background: #e0e7ff;
      color: #4c51bf;
    }

    /* Formulario agregar ejercicio */
    .form-agregar-ejercicio {
      background: #f8f9fa;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .form-agregar-ejercicio mat-form-field {
      width: 100%;
      margin-bottom: 0.75rem;
    }

    .form-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .btn-add-ejercicio {
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

    .compact-actions button:disabled {
      opacity: 0.3;
    }

    /* Detalles expandibles */
    .ejercicio-detalles {
      padding: 0 1rem 1rem 4.5rem;
      background: #f8f9fa;
      border-top: 1px solid #e2e8f0;
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        max-height: 0;
      }
      to {
        opacity: 1;
        max-height: 500px;
      }
    }

    .config-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .config-field {
      font-size: 0.875rem;
      min-width: 0;
    }

    .config-field ::ng-deep .mat-mdc-form-field-infix {
      min-height: 48px;
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
    @media (max-width: 1200px) {
      .config-row {
        grid-template-columns: repeat(2, 1fr);
      }

      .ejercicio-detalles {
        padding-left: 1rem;
      }
    }

    @media (max-width: 768px) {
      .config-row {
        grid-template-columns: 1fr;
      }

      .ejercicio-compact-view {
        flex-wrap: wrap;
      }

      .ejercicio-info-compact {
        width: 100%;
      }
    }
  `]
})
export class GestionarEjerciciosRutinaComponent implements OnInit {
  rutinaId!: number;
  nombreRutina = signal('');
  cargando = signal(true);
  guardando = signal(false);

  // Ejercicios disponibles del catálogo
  ejerciciosDisponibles = signal<Ejercicio[]>([]);

  // Días de la semana con ejercicios (semana base 1 por defecto)
  diasSemana = signal<DiaRutina[]>([
    { semanaBase: 1, dia: DiaSemana.LUNES, diaLabel: 'Lunes', ejercicios: [] },
    { semanaBase: 1, dia: DiaSemana.MARTES, diaLabel: 'Martes', ejercicios: [] },
    { semanaBase: 1, dia: DiaSemana.MIERCOLES, diaLabel: 'Miércoles', ejercicios: [] },
    { semanaBase: 1, dia: DiaSemana.JUEVES, diaLabel: 'Jueves', ejercicios: [] },
    { semanaBase: 1, dia: DiaSemana.VIERNES, diaLabel: 'Viernes', ejercicios: [] },
    { semanaBase: 1, dia: DiaSemana.SABADO, diaLabel: 'Sábado', ejercicios: [] },
    { semanaBase: 1, dia: DiaSemana.DOMINGO, diaLabel: 'Domingo', ejercicios: [] }
  ]);

  diaExpandido = signal(DiaSemana.LUNES);
  mostrarFormAgregarEjercicio = signal(false);
  diaSeleccionado = signal<DiaSemana | null>(null);
  ejercicioSeleccionadoId: number | null = null;

  totalEjercicios = computed(() => 
    this.diasSemana().reduce((total, dia) => total + dia.ejercicios.length, 0)
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rutinaService: RutinaService,
    private ejercicioService: EjercicioService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.rutinaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);
    
    // Cargar rutina y ejercicios en paralelo
    Promise.all([
      this.cargarRutina(),
      this.cargarEjerciciosDisponibles()
    ]).finally(() => {
      this.cargando.set(false);
    });
  }

  async cargarRutina(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.rutinaService.obtenerRutinaPorId(this.rutinaId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.nombreRutina.set(response.data.nombre);
            // Cargar ejercicios existentes
            this.cargarEjerciciosExistentes();
          }
          resolve();
        },
        error: (error) => {
          this.notificationService.showError('Error al cargar rutina');
          this.router.navigate(['/admin/rutinas']);
          reject(error);
        }
      });
    });
  }

  cargarEjerciciosExistentes(): void {
    this.rutinaService.obtenerEjerciciosRutina(this.rutinaId).subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.length > 0) {
          const dias = this.diasSemana();
          
          // Agrupar ejercicios por día
          response.data.forEach(ejData => {
            const diaRutina = dias.find(d => d.dia === ejData.diaSemana);
            if (diaRutina) {
              const ejercicioEnRutina: EjercicioEnRutina = {
                ejercicioId: ejData.ejercicio.id,
                semanaBase: ejData.semanaBase,
                diaSemana: ejData.diaSemana,
                orden: ejData.orden,
                series: ejData.series,
                repeticiones: ejData.repeticiones,
                peso: ejData.peso,
                duracionMinutos: ejData.duracionMinutos,
                descansoSegundos: ejData.descansoSegundos,
                notas: ejData.notas,
                ejercicio: {
                  id: ejData.ejercicio.id,
                  nombre: ejData.ejercicio.nombre,
                  descripcion: ejData.ejercicio.descripcion,
                  tipoEjercicio: ejData.ejercicio.tipoEjercicio,
                  grupoMuscular: ejData.ejercicio.grupoMuscular,
                  nivelDificultad: ejData.ejercicio.nivelDificultad
                } as any,
                tempId: `existing-${ejData.id}`,
                mostrarDetalles: false
              };
              diaRutina.ejercicios.push(ejercicioEnRutina);
            }
          });
          
          // Ordenar ejercicios por orden
          dias.forEach(dia => {
            dia.ejercicios.sort((a, b) => a.orden - b.orden);
          });
          
          this.diasSemana.set([...dias]);
          this.notificationService.showSuccess(`${response.data.length} ejercicio(s) cargado(s)`);
        }
      },
      error: (error) => {
        console.error('Error al cargar ejercicios existentes:', error);
        this.notificationService.showError('Error al cargar ejercicios existentes');
      }
    });
  }

  async cargarEjerciciosDisponibles(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ejercicioService.listar(0, 100).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.ejerciciosDisponibles.set(response.data.content || []);
          }
          resolve();
        },
        error: (error) => {
          this.notificationService.showError('Error al cargar ejercicios');
          reject(error);
        }
      });
    });
  }



  abrirFormAgregarEjercicio(dia: DiaSemana): void {
    this.mostrarFormAgregarEjercicio.set(true);
    this.diaSeleccionado.set(dia);
    this.ejercicioSeleccionadoId = null;
  }

  cancelarAgregarEjercicio(): void {
    this.mostrarFormAgregarEjercicio.set(false);
    this.diaSeleccionado.set(null);
    this.ejercicioSeleccionadoId = null;
  }

  agregarEjercicioADia(dia: DiaSemana): void {
    if (!this.ejercicioSeleccionadoId) return;

    const ejercicio = this.ejerciciosDisponibles().find(e => e.id === this.ejercicioSeleccionadoId);
    if (!ejercicio) return;

    const dias = this.diasSemana();
    const diaData = dias.find(d => d.dia === dia);
    if (!diaData) return;

    const nuevoEjercicio: EjercicioEnRutina = {
      tempId: `temp-${Date.now()}-${Math.random()}`,
      ejercicioId: ejercicio.id,
      semanaBase: diaData.semanaBase,
      diaSemana: dia,
      orden: diaData.ejercicios.length + 1,
      series: 3,
      repeticiones: 12,
      descansoSegundos: 60,
      ejercicio: ejercicio,
      mostrarDetalles: false
    };

    diaData.ejercicios.push(nuevoEjercicio);
    this.diasSemana.set([...dias]); // Trigger signal update
    this.actualizarOrden(dia);
    this.cancelarAgregarEjercicio();
    this.notificationService.showSuccess(`Ejercicio agregado a ${diaData.diaLabel}`);
  }

  moverArriba(dia: DiaSemana, index: number): void {
    if (index === 0) return;
    const dias = this.diasSemana();
    const diaData = dias.find(d => d.dia === dia);
    if (!diaData) return;

    const temp = diaData.ejercicios[index];
    diaData.ejercicios[index] = diaData.ejercicios[index - 1];
    diaData.ejercicios[index - 1] = temp;
    this.diasSemana.set([...dias]);
    this.actualizarOrden(dia);
  }

  moverAbajo(dia: DiaSemana, index: number): void {
    const dias = this.diasSemana();
    const diaData = dias.find(d => d.dia === dia);
    if (!diaData || index === diaData.ejercicios.length - 1) return;

    const temp = diaData.ejercicios[index];
    diaData.ejercicios[index] = diaData.ejercicios[index + 1];
    diaData.ejercicios[index + 1] = temp;
    this.diasSemana.set([...dias]);
    this.actualizarOrden(dia);
  }

  actualizarOrden(dia: DiaSemana): void {
    const dias = this.diasSemana();
    const diaData = dias.find(d => d.dia === dia);
    if (diaData) {
      diaData.ejercicios.forEach((ej, idx) => {
        ej.orden = idx + 1;
        ej.diaSemana = dia;
        ej.semanaBase = diaData.semanaBase;
      });
      this.diasSemana.set([...dias]);
    }
  }

  eliminarEjercicioDia(dia: DiaSemana, index: number): void {
    const dias = this.diasSemana();
    const diaData = dias.find(d => d.dia === dia);
    if (diaData) {
      diaData.ejercicios.splice(index, 1);
      this.diasSemana.set([...dias]);
      this.actualizarOrden(dia);
    }
  }

  toggleDetalles(dia: DiaSemana, index: number): void {
    const dias = this.diasSemana();
    const diaData = dias.find(d => d.dia === dia);
    if (diaData && diaData.ejercicios[index]) {
      diaData.ejercicios[index].mostrarDetalles = !diaData.ejercicios[index].mostrarDetalles;
      this.diasSemana.set([...dias]);
    }
  }

  hayEjercicios(): boolean {
    return this.totalEjercicios() > 0;
  }

  guardarRutina(): void {
    if (!this.hayEjercicios()) {
      this.notificationService.showError('Agrega al menos un ejercicio');
      return;
    }

    // Validar series y repeticiones (RN13)
    for (const dia of this.diasSemana()) {
      for (const ej of dia.ejercicios) {
        if (!ej.series || ej.series <= 0) {
          this.notificationService.showError(`Series debe ser positivo en ${ej.ejercicio.nombre}`);
          return;
        }
        if (!ej.repeticiones || ej.repeticiones <= 0) {
          this.notificationService.showError(`Repeticiones debe ser positivo en ${ej.ejercicio.nombre}`);
          return;
        }
      }
    }

    this.guardando.set(true);

    // PASO 1: Obtener todos los ejercicios existentes para eliminarlos
    this.rutinaService.obtenerEjerciciosRutina(this.rutinaId).subscribe({
      next: (response) => {
        const ejerciciosExistentes = response.data || [];
        const promesasEliminar: Promise<any>[] = [];

        // Eliminar todos los ejercicios existentes
        ejerciciosExistentes.forEach(ej => {
          const promesa = new Promise((resolve, reject) => {
            this.rutinaService.eliminarEjercicio(this.rutinaId, ej.id).subscribe({
              next: () => resolve(true),
              error: (err) => reject(err)
            });
          });
          promesasEliminar.push(promesa);
        });

        // PASO 2: Después de eliminar, agregar todos los ejercicios actuales
        Promise.all(promesasEliminar)
          .then(() => {
            const promesasAgregar: Promise<any>[] = [];

            // Agregar TODOS los ejercicios (existentes modificados + nuevos)
            this.diasSemana().forEach(dia => {
              dia.ejercicios.forEach(ejercicio => {
                const request: EjercicioRutinaRequest = {
                  ejercicioId: ejercicio.ejercicioId,
                  semanaBase: ejercicio.semanaBase,
                  diaSemana: ejercicio.diaSemana,
                  orden: ejercicio.orden,
                  series: ejercicio.series,
                  repeticiones: ejercicio.repeticiones,
                  peso: ejercicio.peso,
                  duracionMinutos: ejercicio.duracionMinutos,
                  descansoSegundos: ejercicio.descansoSegundos,
                  notas: ejercicio.notas
                };

                const promesa = new Promise((resolve, reject) => {
                  this.rutinaService.agregarEjercicio(this.rutinaId, request).subscribe({
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
            this.notificationService.showSuccess('Rutina guardada correctamente');
            this.router.navigate(['/admin/rutinas']);
          })
          .catch((error) => {
            console.error('Error al guardar:', error);
            this.notificationService.showError(
              error.error?.message || 'Error al guardar la rutina'
            );
          })
          .finally(() => {
            this.guardando.set(false);
          });
      },
      error: (error) => {
        console.error('Error al obtener ejercicios:', error);
        this.notificationService.showError('Error al guardar la rutina');
        this.guardando.set(false);
      }
    });
  }

  formatearTipo(tipo: string): string {
    const tipos: Record<string, string> = {
      'FUERZA': 'Fuerza',
      'CARDIO': 'Cardio',
      'FLEXIBILIDAD': 'Flexibilidad',
      'EQUILIBRIO': 'Equilibrio'
    };
    return tipos[tipo] || tipo;
  }

  formatearGrupo(grupo: string): string {
    const grupos: Record<string, string> = {
      'PECHO': 'Pecho',
      'ESPALDA': 'Espalda',
      'HOMBROS': 'Hombros',
      'BRAZOS': 'Brazos',
      'PIERNAS': 'Piernas',
      'CORE': 'Core',
      'CARDIO': 'Cardio',
      'CUERPO_COMPLETO': 'Cuerpo Completo'
    };
    return grupos[grupo] || grupo;
  }

  formatearNivel(nivel: string): string {
    const niveles: Record<string, string> = {
      'PRINCIPIANTE': 'Principiante',
      'INTERMEDIO': 'Intermedio',
      'AVANZADO': 'Avanzado',
      'EXPERTO': 'Experto'
    };
    return niveles[nivel] || nivel;
  }
}
