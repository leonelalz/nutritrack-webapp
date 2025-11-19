import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PlanService } from '../../../../core/services/plan.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PlanResponse } from '../../../../core/models';

/**
 * Detalle de Plan Nutricional (Admin)
 * Muestra información completa del plan incluyendo objetivo, etiquetas y días programados
 */
@Component({
  selector: 'app-detalle-plan',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="detalle-container">
      @if (cargando()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Cargando plan...</p>
        </div>
      } @else if (plan()) {
        <!-- Header -->
        <div class="header">
          <button class="btn-back" routerLink="/admin/planes">
            ← Volver a planes
          </button>
          <div class="header-actions">
            <button class="btn-secondary" [routerLink]="['/admin/planes', plan()!.id, 'editar']">
              Editar Plan
            </button>
            <button class="btn-secondary" [routerLink]="['/admin/planes', plan()!.id, 'configurar']">
              Configurar Días
            </button>
            @if (plan()!.activo) {
              <button 
                class="btn-danger" 
                (click)="confirmarDesactivar()"
                [disabled]="plan()!.numeroUsuariosActivos && plan()!.numeroUsuariosActivos! > 0"
              >
                Desactivar Plan
              </button>
            } @else {
              <button 
                class="btn-success" 
                (click)="activarPlan()"
              >
                Activar Plan
              </button>
            }
          </div>
        </div>

        <!-- Título y estado -->
        <div class="title-section">
          <h1 class="page-title">
            <mat-icon>restaurant_menu</mat-icon>
            {{ plan()!.nombre }}
          </h1>
          <span class="status-badge" [class.active]="plan()!.activo" [class.inactive]="!plan()!.activo">
            {{ plan()!.activo ? 'Activo' : 'Inactivo' }}
          </span>
        </div>

        <!-- Grid de información -->
        <div class="info-grid">
          <!-- Información básica -->
          <div class="info-card">
            <h2>Información Básica</h2>
            <div class="info-item">
              <span class="label">Descripción:</span>
              <p class="value">{{ plan()!.descripcion }}</p>
            </div>
            <div class="info-item">
              <span class="label">Duración:</span>
              <span class="value">{{ plan()!.duracionDias }} días</span>
            </div>
            <div class="info-item">
              <span class="label">Días Programados:</span>
              <span class="value">{{ plan()!.totalDiasProgramados || 0 }} / {{ plan()!.duracionDias }}</span>
            </div>
            @if (plan()!.numeroUsuariosActivos !== undefined) {
              <div class="info-item">
                <span class="label">Usuarios Activos:</span>
                <span class="value">{{ plan()!.numeroUsuariosActivos }}</span>
              </div>
            }
          </div>

          <!-- Objetivo Nutricional -->
          @if (plan()!.objetivo) {
            <div class="info-card">
              <h2>Objetivo Nutricional</h2>
              @if (plan()!.objetivo!.descripcion) {
                <div class="info-item">
                  <span class="label">Descripción:</span>
                  <p class="value">{{ plan()!.objetivo!.descripcion }}</p>
                </div>
              }
              <div class="macros-grid">
                <div class="macro-item">
                  <span class="macro-label">Calorías</span>
                  <span class="macro-value">{{ plan()!.objetivo!.caloriasObjetivo }} kcal</span>
                </div>
                <div class="macro-item">
                  <span class="macro-label">Proteínas</span>
                  <span class="macro-value">{{ plan()!.objetivo!.proteinasObjetivo }} g</span>
                </div>
                <div class="macro-item">
                  <span class="macro-label">Carbohidratos</span>
                  <span class="macro-value">{{ plan()!.objetivo!.carbohidratosObjetivo }} g</span>
                </div>
                <div class="macro-item">
                  <span class="macro-label">Grasas</span>
                  <span class="macro-value">{{ plan()!.objetivo!.grasasObjetivo }} g</span>
                </div>
              </div>
            </div>
          }

          <!-- Etiquetas -->
          @if (plan()!.etiquetas && plan()!.etiquetas.length > 0) {
            <div class="info-card">
              <h2>Etiquetas</h2>
              <div class="etiquetas-list">
                @for (etiqueta of plan()!.etiquetas; track etiqueta.id) {
                  <div class="etiqueta-badge">
                    <span class="etiqueta-tipo">{{ etiqueta.tipoEtiqueta }}</span>
                    <span class="etiqueta-nombre">{{ etiqueta.nombre }}</span>
                    @if (etiqueta.descripcion) {
                      <span class="etiqueta-desc">{{ etiqueta.descripcion }}</span>
                    }
                  </div>
                }
              </div>
            </div>
          }

          <!-- Fechas -->
          <div class="info-card">
            <h2>Información de Registro</h2>
            @if (plan()!.createdAt) {
              <div class="info-item">
                <span class="label">Fecha de Creación:</span>
                <span class="value">{{ formatearFecha(plan()!.createdAt) }}</span>
              </div>
            }
            @if (plan()!.updatedAt) {
              <div class="info-item">
                <span class="label">Última Modificación:</span>
                <span class="value">{{ formatearFecha(plan()!.updatedAt) }}</span>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="error">
          <h2>Plan no encontrado</h2>
          <p>El plan solicitado no existe o fue eliminado.</p>
          <button class="btn-primary" routerLink="/admin/planes">Volver a planes</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .detalle-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      background: #f5f5f5;
      min-height: 100vh;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .btn-back {
      background: none;
      border: none;
      color: #667eea;
      font-weight: 600;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.5rem 0;
    }

    .btn-back:hover {
      text-decoration: underline;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-secondary, .btn-danger, .btn-primary, .btn-success {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .btn-secondary {
      background: #edf2f7;
      color: #4a5568;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
    }

    .btn-danger {
      background: #fc8181;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #f56565;
    }

    .btn-danger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-success {
      background: #48bb78;
      color: white;
    }

    .btn-success:hover {
      background: #38a169;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    /* Title Section */
    .title-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .title-section h1 {
      font-size: 2rem;
      color: #2d3748;
      margin: 0;
    }

    .status-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.inactive {
      background: #f8d7da;
      color: #721c24;
    }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .info-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .info-card h2 {
      font-size: 1.25rem;
      color: #2d3748;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #edf2f7;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 1rem;
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .label {
      font-size: 0.875rem;
      color: #718096;
      font-weight: 600;
    }

    .value {
      font-size: 1rem;
      color: #2d3748;
      margin: 0;
    }

    /* Macros Grid */
    .macros-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .macro-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
      border: 2px solid #e2e8f0;
    }

    .macro-label {
      font-size: 0.75rem;
      color: #718096;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .macro-value {
      font-size: 1.5rem;
      color: #00A859;
      font-weight: 700;
    }

    /* Etiquetas */
    .etiquetas-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .etiqueta-badge {
      display: flex;
      flex-direction: column;
      padding: 0.75rem;
      background: #f7fafc;
      border-radius: 8px;
      border-left: 4px solid #00A859;
    }

    .etiqueta-tipo {
      font-size: 0.625rem;
      color: #718096;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .etiqueta-nombre {
      font-size: 0.875rem;
      color: #2d3748;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .etiqueta-desc {
      font-size: 0.75rem;
      color: #718096;
      font-style: italic;
    }

    /* Loading */
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      color: #718096;
    }

    .spinner {
      width: 3rem;
      height: 3rem;
      border: 4px solid #edf2f7;
      border-top-color: #00A859;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Error */
    .error {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 12px;
    }

    .error h2 {
      color: #e53e3e;
      margin-bottom: 1rem;
    }

    .error p {
      color: #718096;
      margin-bottom: 1.5rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .header-actions {
        width: 100%;
        flex-direction: column;
      }

      .btn-secondary, .btn-danger {
        width: 100%;
      }

      .macros-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DetallePlanComponent implements OnInit {
  plan = signal<PlanResponse | null>(null);
  cargando = signal(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.cargarPlan(Number(id));
    }
  }

  cargarPlan(id: number): void {
    this.cargando.set(true);
    this.planService.obtenerPlanPorId(id).subscribe({
      next: (response) => {
        this.cargando.set(false);
        if (response.success && response.data) {
          this.plan.set(response.data);
        } else {
          this.plan.set(null);
        }
      },
      error: () => {
        this.cargando.set(false);
        this.plan.set(null);
        this.notificationService.showError('Error al cargar el plan');
      }
    });
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  confirmarDesactivar(): void {
    const planActual = this.plan();
    if (!planActual) return;

    const confirmado = confirm(
      `¿Estás seguro de desactivar el plan "${planActual.nombre}"?\n\nEl plan quedará inactivo pero podrás reactivarlo más tarde.`
    );

    if (confirmado) {
      this.planService.desactivarPlan(planActual.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.showSuccess('Plan desactivado exitosamente');
            this.router.navigate(['/admin/planes']);
          }
        },
        error: (error) => {
          console.log('Error completo:', error);
          console.log('Error.error:', error.error);
          console.log('Mensaje:', error.error?.message);
          
          // Extraer el mensaje del backend (puede venir en diferentes formatos)
          let mensaje = error.error?.message || error.error?.error || error.message || '';
          
          if (error.status === 409 || error.status === 400) {
            // El backend retorna 400 o 409 cuando hay usuarios activos
            if (!mensaje) {
              mensaje = 'El plan tiene usuarios activos y no puede ser desactivado';
            }
          } else if (error.status === 404) {
            if (!mensaje) {
              mensaje = 'Plan no encontrado';
            }
          } else {
            if (!mensaje) {
              mensaje = 'Error al desactivar el plan';
            }
          }
          
          this.notificationService.showError(mensaje);
        }
      });
    }
  }

  activarPlan(): void {
    const planActual = this.plan();
    if (!planActual) return;

    this.planService.activarPlan(planActual.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Plan activado exitosamente');
          this.cargarPlan(planActual.id);
        }
      },
      error: (error) => {
        const mensaje = error.error?.message || error.error?.error || error.message || 'Error al activar el plan';
        this.notificationService.showError(mensaje);
      }
    });
  }
}
