import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MetasService } from "../../../core/services/metas.service";
import { CatalogoService} from "../../../core/services/catalogo.service";
import { NotificationService } from "../../../core/services/notification.service";
import { MockDataService } from "../../../core/services/mock-data.service";

@Component({
  selector: 'app-catalogo-lista-planes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="catalogo-planes-container">
      <div class="header">
        <button class="btn-back" [routerLink]="['/metas/mis-asignaciones']">
          ← Volver a Mis Asignaciones
        </button>
        <h1>Catálogo de Planes Nutricionales</h1>
        <p class="subtitle">Explora planes disponibles según tu perfil y objetivos</p>
      </div>

      <div class="filters">
        <div class="search-box">
          <input
            type="text"
            [(ngModel)]="filtroNombre"
            (ngModelChange)="filtrarPlanes()"
            placeholder="Buscar por nombre..."
          />
        </div>
        <div class="filter-objetivo">
          <select [(ngModel)]="filtroObjetivo" (ngModelChange)="filtrarPlanes()">
            <option value="">Todos los objetivos</option>
            <option value="PERDIDA_PESO">Pérdida de Peso</option>
            <option value="GANANCIA_MUSCULAR">Ganancia Muscular</option>
            <option value="MANTENIMIENTO">Mantenimiento</option>
            <option value="DEFINICION">Definición</option>
            <option value="SALUD_GENERAL">Salud General</option>
          </select>
        </div>
        <div class="filter-sugeridos">
          <label class="checkbox-label">
            <input
              type="checkbox"
              [(ngModel)]="soloSugeridos"
              (ngModelChange)="cargarPlanes()"
            />
            <span>Solo planes sugeridos para mi objetivo</span>
          </label>
        </div>
      </div>

      @if (loading()) {
        <div class="loading">
          <p>Cargando planes...</p>
        </div>
      }

      @if (!loading() && planesFiltrados().length === 0) {
        <div class="empty-state">
          <p>No se encontraron planes disponibles con los filtros seleccionados</p>
          @if (soloSugeridos) {
            <p class="hint">Intenta desactivar el filtro de planes sugeridos</p>
          }
        </div>
      }

      @if (!loading() && planesFiltrados().length > 0) {
        <div class="planes-grid">
          @for (plan of planesFiltrados(); track plan.id) {
            <div class="plan-card" [class.plan-sugerido]="plan.sugerido">
              <div class="plan-header">
                <h3>{{ plan.nombre }}</h3>
                @if (plan.sugerido) {
                  <span class="badge-sugerido">✨ Sugerido</span>
                }
              </div>

              <p class="plan-description">{{ plan.descripcion }}</p>

              <div class="plan-stats">
                <div class="stat">
                  <span class="stat-label">Duración:</span>
                  <span class="stat-value">{{ plan.duracionDias }} días</span>
                </div>
                @if (plan.objetivo) {
                  <div class="stat">
                    <span class="stat-label">Objetivo:</span>
                    <span class="stat-value">{{ formatearObjetivo(plan.objetivo.tipoObjetivo) }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Calorías:</span>
                    <span class="stat-value">{{ plan.objetivo.caloriasObjetivo }} kcal</span>
                  </div>
                } @else {
                  <div class="stat">
                    <span class="stat-label">Objetivo:</span>
                    <span class="stat-value text-muted">No especificado</span>
                  </div>
                }
              </div>

              @if (plan.etiquetas && plan.etiquetas.length > 0) {
                <div class="plan-etiquetas">
                  @for (etiqueta of plan.etiquetas; track etiqueta.id) {
                    <span class="etiqueta">{{ etiqueta.nombre }}</span>
                  }
                </div>
              }

              <div class="plan-actions">
                <button
                  class="btn-primary"
                  [routerLink]="['/metas/planes', plan.id]"
                >
                  Ver Detalles
                </button>
                
                <button
                  class="btn-activate"
                  (click)="activarPlan(plan)"
                  [disabled]="activandoPlan() === plan.id"
                >
                  {{ activandoPlan() === plan.id ? 'Activando...' : 'Activar Plan' }}
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .catalogo-planes-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;
      text-align: center;
      position: relative;
    }

    .btn-back {
      position: absolute;
      left: 0;
      top: 0;
      padding: 0.625rem 1.25rem;
      background: #edf2f7;
      color: #4a5568;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .btn-back:hover {
      background: #e2e8f0;
      transform: translateX(-2px);
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

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 250px;
    }

    .search-box input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
    }

    .filter-objetivo {
      min-width: 200px;
    }

    .filter-objetivo select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      background-color: white;
    }

    .filter-sugeridos {
      display: flex;
      align-items: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.95rem;
      color: #4a5568;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .planes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .plan-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      border: 2px solid transparent;
    }

    .plan-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .plan-card.plan-sugerido {
      border-color: #f6ad55;
      background: linear-gradient(to bottom, #fffaf0, white);
    }

    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .plan-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #2d3748;
      flex: 1;
    }

    .badge-sugerido {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      background: linear-gradient(135deg, #f6ad55, #ed8936);
      color: white;
      white-space: nowrap;
    }

    .plan-description {
      color: #718096;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .plan-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
    }

    .stat {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #718096;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 1rem;
      font-weight: 600;
      color: #2d3748;
    }

    .stat-value.text-muted {
      color: #a0aec0;
      font-style: italic;
    }

    .plan-etiquetas {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .etiqueta {
      padding: 0.25rem 0.75rem;
      background: #edf2f7;
      color: #4a5568;
      border-radius: 20px;
      font-size: 0.875rem;
    }

    .plan-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: auto;
    }

    .btn-primary, .btn-activate {
      padding: 0.625rem 1rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
      flex: 1;
      min-width: 120px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-activate {
      background: #48bb78;
      color: white;
    }

    .btn-activate:hover:not(:disabled) {
      background: #38a169;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
    }

    .btn-activate:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 3rem;
      color: #718096;
    }

    .empty-state p {
      font-size: 1.125rem;
    }

    .empty-state .hint {
      font-size: 0.95rem;
      color: #a0aec0;
      margin-top: 0.5rem;
    }
  `]
})
export class MetasListaPlanesComponent implements OnInit {
  loading = signal(false);
  activandoPlan = signal<number | null>(null);
  filtroNombre = '';
  filtroObjetivo = '';
  soloSugeridos = false;
  planes = signal<any[]>([]);
  planesFiltrados = signal<any[]>([]);
  planesActivosIds = signal<Set<number>>(new Set()); // IDs de planes ya activos

  constructor(
    private readonly catalogoService: CatalogoService,
    private readonly metasService: MetasService,
    private readonly notificationService: NotificationService,
    private readonly mockData: MockDataService
  ) {}

  ngOnInit(): void {
    this.cargarPlanesActivos();
    this.cargarPlanes();
  }

  /**
   * Carga los planes activos del usuario para filtrarlos del catálogo
   */
  cargarPlanesActivos(): void {
    this.metasService.obtenerPlanesActivos().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          // Extraer los planId (no el id de asignación) de los planes activos
          const idsActivos = new Set<number>(
            response.data.map((p: any) => p.planId)
          );
          this.planesActivosIds.set(idsActivos);
          // Re-filtrar para aplicar el filtro de activos
          this.filtrarPlanes();
        }
      },
      error: (err) => {
        console.warn('No se pudieron cargar planes activos:', err);
      }
    });
  }

  cargarPlanes(): void {
    this.loading.set(true);
    
    // Intentar cargar desde API primero
    this.catalogoService.verCatalogo(this.soloSugeridos).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        if (response.success) {
          const data = response.data?.content || response.data || [];
          if (data.length > 0) {
            this.planes.set(data);
            this.filtrarPlanes();
          } else {
            // API conectado pero sin datos, usar mock como fallback
            this.planes.set(this.mockData.planesDisponibles());
            this.filtrarPlanes();
            this.notificationService.showInfo('No hay planes en el catálogo. Mostrando ejemplos.');
          }
        } else {
          // Respuesta no exitosa, usar mock
          this.planes.set(this.mockData.planesDisponibles());
          this.filtrarPlanes();
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error cargando catálogo de planes:', err);
        // Fallback a datos mock
        this.planes.set(this.mockData.planesDisponibles());
        this.filtrarPlanes();
        this.notificationService.showWarning('Sin conexión al servidor. Mostrando datos de ejemplo.');
      }
    });
  }

  filtrarPlanes(): void {
    let filtrados = this.planes();

    // Filtrar planes que ya están activos (no mostrarlos)
    const idsActivos = this.planesActivosIds();
    filtrados = filtrados.filter(plan => !idsActivos.has(plan.id));

    if (this.filtroNombre) {
      const filtro = this.filtroNombre.toLowerCase();
      filtrados = filtrados.filter(
        (plan) =>
          plan.nombre.toLowerCase().includes(filtro) ||
          plan.descripcion.toLowerCase().includes(filtro)
      );
    }

    if (this.filtroObjetivo) {
      filtrados = filtrados.filter(
        (plan) => plan.objetivo?.tipoObjetivo === this.filtroObjetivo
      );
    }

    this.planesFiltrados.set(filtrados);
  }

  activarPlan(plan: any): void {
    this.activandoPlan.set(plan.id);
    
    // Intentar activar en API
    this.metasService.activarPlan({ planId: plan.id }).subscribe({
      next: (response: any) => {
        this.activandoPlan.set(null);
        if (response.success) {
          this.notificationService.showSuccess(
            `Plan "${plan.nombre}" activado exitosamente`
          );
          // Recargar planes activos para que desaparezca del catálogo
          this.cargarPlanesActivos();
        } else {
          this.notificationService.showError(
            response.message || 'Error al activar el plan'
          );
        }
      },
      error: (err) => {
        this.activandoPlan.set(null);
        const mensaje = err?.message || 'Error al activar el plan';
        this.notificationService.showError(mensaje);
      }
    });
  }

  formatearObjetivo(tipo: string): string {
    const objetivos: Record<string, string> = {
      PERDIDA_PESO: 'Pérdida de Peso',
      GANANCIA_MUSCULAR: 'Ganancia Muscular',
      MANTENIMIENTO: 'Mantenimiento',
      DEFINICION: 'Definición',
      SALUD_GENERAL: 'Salud General'
    };
    return objetivos[tipo] || tipo;
  }
}