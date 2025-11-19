import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MetasService } from "../../../core/services/metas.service";
import { NotificationService } from "../../../core/services/notification.service";

@Component({
  selector: 'app-mis-asignaciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="mis-asignaciones-container">
      <div class="header">
        <h1>Mis Planes y Rutinas</h1>
        <p class="subtitle">Gestiona tus asignaciones activas</p>
      </div>

      @if (loading()) {
        <div class="loading">
          <p>Cargando tus asignaciones...</p>
        </div>
      }

      @if (!loading()) {
        <!-- Planes Activos -->
        <section class="planes-section">
          <div class="section-header">
            <h2>Planes Nutricionales Activos</h2>
            <button class="btn-view-all" [routerLink]="['/metas/planes']">
              Ver todos los planes
            </button>
          </div>

          @if (planesActivos().length === 0) {
            <div class="empty-state">
              <p>No tienes planes activos</p>
              <button class="btn-link" [routerLink]="['/metas/planes']">
                Explorar planes disponibles
              </button>
            </div>
          }

          @if (planesActivos().length > 0) {
            <div class="asignaciones-grid">
              @for (plan of planesActivos(); track plan.id) {
                <div class="asignacion-card">
                  <div class="card-header">
                    <h3>{{ plan.planNombre }}</h3>
                    <span class="estado-badge" [class]="'estado-' + plan.estado.toLowerCase()">
                      {{ formatearEstado(plan.estado) }}
                    </span>
                  </div>

                  <div class="progress-info">
                    <div class="progress-text">
                      <span>Día {{ plan.diaActual }} de {{ plan.diasTotales }}</span>
                      <span class="percentage">{{ plan.porcentajeCompletado }}%</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="plan.porcentajeCompletado"></div>
                    </div>
                  </div>

                  <div class="card-info">
                    <div class="info-item">
                      <span class="label">Fecha Inicio:</span>
                      <span class="value">{{ formatearFecha(plan.fechaInicio) }}</span>
                    </div>
                  </div>

                  <div class="card-actions">
                    @if (plan.estado === 'ACTIVO') {
                      <button
                        class="btn-secondary"
                        (click)="pausarPlan(plan.id)"
                      >
                        Pausar
                      </button>
                    }

                    @if (plan.estado === 'PAUSADO') {
                      <button
                        class="btn-secondary"
                        (click)="reanudarPlan(plan.id)"
                      >
                        Reanudar
                      </button>
                    }

                    <button
                      class="btn-danger"
                      (click)="cancelarPlan(plan.id)"
                    >
                      Cancelar
                    </button>

                    @if (plan.estado === 'ACTIVO' || plan.estado === 'PAUSADO') {
                      <button
                        class="btn-success"
                        (click)="completarPlan(plan.id)"
                      >
                        Marcar Completado
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </section>

        <!-- Rutinas Activas -->
        <section class="rutinas-section">
          <div class="section-header">
            <h2>Rutinas Activas</h2>
            <button class="btn-view-all" [routerLink]="['/metas/rutinas']">
              Ver todas las rutinas
            </button>
          </div>

          @if (rutinasActivas().length === 0) {
            <div class="empty-state">
              <p>No tienes rutinas activas</p>
              <button class="btn-link" [routerLink]="['/metas/rutinas']">
                Explorar rutinas disponibles
              </button>
            </div>
          }

          @if (rutinasActivas().length > 0) {
            <div class="asignaciones-grid">
              @for (rutina of rutinasActivas(); track rutina.id) {
                <div class="asignacion-card">
                  <div class="card-header">
                    <h3>{{ rutina.rutinaNombre }}</h3>
                    <span class="estado-badge" [class]="'estado-' + rutina.estado.toLowerCase()">
                      {{ formatearEstado(rutina.estado) }}
                    </span>
                  </div>

                  <div class="progress-info">
                    <div class="progress-text">
                      <span>Día {{ rutina.diaActual }} de {{ rutina.diasTotales }}</span>
                      <span class="percentage">{{ rutina.porcentajeCompletado }}%</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="rutina.porcentajeCompletado"></div>
                    </div>
                  </div>

                  <div class="card-info">
                    <div class="info-item">
                      <span class="label">Fecha Inicio:</span>
                      <span class="value">{{ formatearFecha(rutina.fechaInicio) }}</span>
                    </div>
                  </div>

                  <div class="card-actions">
                    @if (rutina.estado === 'ACTIVO') {
                      <button
                        class="btn-secondary"
                        (click)="pausarRutina(rutina.id)"
                      >
                        Pausar
                      </button>
                    }

                    @if (rutina.estado === 'PAUSADO') {
                      <button
                        class="btn-secondary"
                        (click)="reanudarRutina(rutina.id)"
                      >
                        Reanudar
                      </button>
                    }

                    <button
                      class="btn-danger"
                      (click)="cancelarRutina(rutina.id)"
                    >
                      Cancelar
                    </button>

                    @if (rutina.estado === 'ACTIVO' || rutina.estado === 'PAUSADO') {
                      <button
                        class="btn-success"
                        (click)="completarRutina(rutina.id)"
                      >
                        Marcar Completado
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </section>
      }
    </div>
  `,
  styles: [`
    .mis-asignaciones-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 3rem;
      text-align: center;
    }

    h1 {
      font-size: 2.5rem;
      color: #2d3748;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: #718096;
      font-size: 1.125rem;
      margin: 0;
    }

    section {
      margin-bottom: 3rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    section h2 {
      color: #2d3748;
      margin: 0;
      font-size: 1.5rem;
    }

    .btn-view-all {
      padding: 0.625rem 1.25rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .btn-view-all:hover {
      background: #764ba2;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }

    .asignaciones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .asignacion-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .asignacion-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .card-header h3 {
      margin: 0;
      color: #2d3748;
      font-size: 1.25rem;
      flex: 1;
    }

    .estado-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .estado-badge.estado-activo {
      background: #c6f6d5;
      color: #22543d;
    }

    .estado-badge.estado-pausado {
      background: #bee3f8;
      color: #2c5282;
    }

    .estado-badge.estado-completado {
      background: #c6f6d5;
      color: #22543d;
    }

    .estado-badge.estado-cancelado {
      background: #fed7d7;
      color: #742a2a;
    }

    .progress-info {
      margin-bottom: 1rem;
    }

    .progress-text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #718096;
    }

    .percentage {
      font-weight: 600;
      color: #2d3748;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #48bb78, #38a169);
      transition: width 0.3s ease;
    }

    .card-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
    }

    .info-item .label {
      color: #718096;
    }

    .info-item .value {
      color: #2d3748;
      font-weight: 600;
    }

    .card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: auto;
    }

    .btn-secondary, .btn-danger, .btn-success {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.75rem;
      transition: all 0.2s;
      flex: 1;
      min-width: 80px;
    }

    .btn-secondary {
      background: #edf2f7;
      color: #4a5568;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
    }

    .btn-danger {
      background: #fed7d7;
      color: #742a2a;
    }

    .btn-danger:hover {
      background: #fc8181;
    }

    .btn-success {
      background: #c6f6d5;
      color: #22543d;
    }

    .btn-success:hover {
      background: #9ae6b4;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      background: #f7fafc;
      border-radius: 12px;
      color: #718096;
    }

    .empty-state p {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
    }

    .btn-link {
      background: none;
      border: none;
      color: #667eea;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
      font-size: 1rem;
    }

    .btn-link:hover {
      color: #764ba2;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: #718096;
    }
  `]
})
export class MisAsignacionesComponent implements OnInit {
  loading = signal(false);
  planesActivos = signal<any[]>([]);
  rutinasActivas = signal<any[]>([]);

  constructor(
    private readonly metasService: MetasService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarAsignaciones();
  }

  cargarAsignaciones(): void {
    this.loading.set(true);

    Promise.all([
      this.metasService.obtenerPlanesActivos().toPromise(),
      this.metasService.obtenerRutinasActivas().toPromise()
    ])
      .then(([respPlanes, respRutinas]: any) => {
        this.loading.set(false);
        if (respPlanes?.success) {
          this.planesActivos.set(respPlanes.data || []);
        }
        if (respRutinas?.success) {
          this.rutinasActivas.set(respRutinas.data || []);
        }
      })
      .catch(() => {
        this.loading.set(false);
        this.notificationService.showError('Error al cargar asignaciones');
      });
  }

  // Plan Actions
  pausarPlan(planId: number): void {
    this.metasService.pausarPlan(planId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Plan pausado');
        this.cargarAsignaciones();
      },
      error: () => this.notificationService.showError('Error al pausar plan')
    });
  }

  reanudarPlan(planId: number): void {
    this.metasService.reanudarPlan(planId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Plan reanudado');
        this.cargarAsignaciones();
      },
      error: () => this.notificationService.showError('Error al reanudar plan')
    });
  }

  completarPlan(planId: number): void {
    this.metasService.completarPlan(planId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Plan completado');
        this.cargarAsignaciones();
      },
      error: () => this.notificationService.showError('Error al completar plan')
    });
  }

  cancelarPlan(planId: number): void {
    this.metasService.cancelarPlan(planId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Plan cancelado');
        this.cargarAsignaciones();
      },
      error: () => this.notificationService.showError('Error al cancelar plan')
    });
  }

  // Rutina Actions
  pausarRutina(rutinaId: number): void {
    this.metasService.pausarRutina(rutinaId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Rutina pausada');
        this.cargarAsignaciones();
      },
      error: () => this.notificationService.showError('Error al pausar rutina')
    });
  }

  reanudarRutina(rutinaId: number): void {
    this.metasService.reanudarRutina(rutinaId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Rutina reanudada');
        this.cargarAsignaciones();
      },
      error: () => this.notificationService.showError('Error al reanudar rutina')
    });
  }

  completarRutina(rutinaId: number): void {
    this.metasService.completarRutina(rutinaId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Rutina completada');
        this.cargarAsignaciones();
      },
      error: () => this.notificationService.showError('Error al completar rutina')
    });
  }

  cancelarRutina(rutinaId: number): void {
    this.metasService.cancelarRutina(rutinaId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Rutina cancelada');
        this.cargarAsignaciones();
      },
      error: () => this.notificationService.showError('Error al cancelar rutina')
    });
  }

  formatearEstado(estado: string): string {
    const estados: Record<string, string> = {
      ACTIVO: 'Activo',
      PAUSADO: 'Pausado',
      COMPLETADO: 'Completado',
      CANCELADO: 'Cancelado'
    };
    return estados[estado] || estado;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}