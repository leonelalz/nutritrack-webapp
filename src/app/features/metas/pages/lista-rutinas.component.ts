import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MetasService } from "../../../core/services/metas.service";
import { CatalogoService } from "../../../core/services/catalogo.service";
import { NotificationService } from "../../../core/services/notification.service";
import { MockDataService } from "../../../core/services/mock-data.service";

@Component({
  selector: 'app-catalogo-lista-rutinas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="catalogo-rutinas-container">
      <div class="header">
        <button class="btn-back" [routerLink]="['/metas/mis-asignaciones']">
          ← Volver a Mis Asignaciones
        </button>
        <h1>🏋️‍♂️ Catálogo de Rutinas de Ejercicio</h1>
        <p class="subtitle">Explora y activa rutinas personalizadas según tu objetivo y nivel</p>
      </div>

      <div class="filters">
        <div class="search-box">
          <input
            type="text"
            [(ngModel)]="filtroNombre"
            (ngModelChange)="filtrarRutinas()"
            placeholder="Buscar por nombre..."
          />
        </div>
        <div class="filter-nivel">
          <select [(ngModel)]="filtroNivel" (ngModelChange)="filtrarRutinas()">
            <option value="">Todos los niveles</option>
            <option value="PRINCIPIANTE">Principiante</option>
            <option value="INTERMEDIO">Intermedio</option>
            <option value="AVANZADO">Avanzado</option>
          </select>
        </div>
        <div class="filter-sugeridos">
          <label>
            <input type="checkbox" [(ngModel)]="soloSugeridos" (ngModelChange)="cargarRutinas()">
            Solo rutinas sugeridas para mi objetivo
          </label>
        </div>
      </div>

      @if (loading()) {
        <div class="loading">
          <p>Cargando rutinas...</p>
        </div>
      }

      @if (!loading() && rutinasFiltradas().length === 0) {
        <div class="empty-state">
          <p>No se encontraron rutinas con los filtros seleccionados</p>
        </div>
      }

      @if (!loading() && rutinasFiltradas().length > 0) {
        <div class="rutinas-grid">
          @for (rutina of rutinasFiltradas(); track rutina.id) {
            <div class="rutina-card">
              <div class="rutina-header">
                <h3>{{ rutina.nombre }}</h3>
                <div class="badges">
                  <span class="badge-nivel" [class]="'nivel-' + rutina.nivelDificultad.toLowerCase()">
                    {{ formatearNivel(rutina.nivelDificultad) }}
                  </span>
                  @if (rutina.activo) {
                    <span class="estado-badge estado-disponible">Disponible</span>
                  } @else {
                    <span class="estado-badge estado-inactivo">No Disponible</span>
                  }
                </div>
              </div>

              <p class="rutina-description">{{ rutina.descripcion }}</p>

              <div class="rutina-stats">
                <div class="stat">
                  <span class="stat-label">Duración:</span>
                  <span class="stat-value">{{ rutina.duracionSemanas }} semanas</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Ejercicios:</span>
                  <span class="stat-value">{{ rutina.totalEjerciciosProgramados || 0 }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Patrón:</span>
                  <span class="stat-value">{{ rutina.patronSemanas }} semana(s)</span>
                </div>
              </div>

              @if (rutina.etiquetas && rutina.etiquetas.length > 0) {
                <div class="rutina-tags">
                  @for (etiqueta of rutina.etiquetas; track etiqueta.id) {
                    <span class="tag">{{ etiqueta.nombre }}</span>
                  }
                </div>
              }

              <div class="rutina-actions">
                @if (rutina.activo) {
                  <button
                    class="btn-activate"
                    (click)="activarRutina(rutina)"
                    [disabled]="activandoRutina() === rutina.id"
                  >
                    {{ activandoRutina() === rutina.id ? 'Activando...' : '🚀 Activar Rutina' }}
                  </button>
                  <button
                    class="btn-primary"
                    [routerLink]="['/metas/rutinas', rutina.id]"
                  >
                    👁️ Ver Detalle
                  </button>
                } @else {
                  <button class="btn-disabled" disabled>
                    No Disponible
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .catalogo-rutinas-container {
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

    .filter-nivel, .filter-estado {
      min-width: 200px;
    }

    .filter-nivel select, .filter-estado select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      background-color: white;
    }

    .rutinas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .rutina-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
    }

    .rutina-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .rutina-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .rutina-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #2d3748;
      flex: 1;
    }

    .badges {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-end;
    }

    .badge-nivel, .estado-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .badge-nivel.nivel-principiante {
      background: #c6f6d5;
      color: #22543d;
    }

    .badge-nivel.nivel-intermedio {
      background: #bee3f8;
      color: #2c5282;
    }

    .badge-nivel.nivel-avanzado {
      background: #fbd38d;
      color: #7c2d12;
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

    .estado-badge.estado-disponible {
      background: #48bb78;
      color: white;
    }

    .rutina-description {
      color: #718096;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .rutina-stats {
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

    .progress-section {
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

    .rutina-etiquetas {
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

    .rutina-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: auto;
    }

    .btn-primary, .btn-secondary, .btn-danger, .btn-activate {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.75rem;
      flex: 1;
      min-width: 90px;
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

    .btn-activate:hover {
      background: #38a169;
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

    .loading, .empty-state {
      text-align: center;
      padding: 3rem;
      color: #718096;
    }

    .empty-state p {
      font-size: 1.125rem;
    }

    .rutina-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .tag {
      padding: 0.25rem 0.75rem;
      background: #e6f7ff;
      color: #0066cc;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .btn-disabled {
      padding: 0.75rem 1.5rem;
      background: #cbd5e0;
      color: #718096;
      border: none;
      border-radius: 8px;
      cursor: not-allowed;
    }

    .estado-inactivo {
      background: #fed7d7;
      color: #c53030;
    }

    .filter-sugeridos {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .filter-sugeridos label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.95rem;
      color: #4a5568;
    }

    .filter-sugeridos input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  `]
})
export class MetasListaRutinasComponent implements OnInit {
  loading = signal(false);
  activandoRutina = signal<number | null>(null);
  filtroNombre = '';
  filtroNivel = '';
  soloSugeridos = false;
  rutinas = signal<any[]>([]);
  rutinasFiltradas = signal<any[]>([]);
  rutinasActivasIds = signal<Set<number>>(new Set()); // IDs de rutinas ya activas

  constructor(
    private readonly catalogoService: CatalogoService,
    private readonly metasService: MetasService,
    private readonly notificationService: NotificationService,
    private readonly mockData: MockDataService
  ) {}

  ngOnInit(): void {
    this.cargarRutinasActivas();
    this.cargarRutinas();
  }

  /**
   * Carga las rutinas activas del usuario para filtrarlas del catálogo
   */
  cargarRutinasActivas(): void {
    this.metasService.obtenerRutinasActivas().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          // Extraer los rutinaId (no el id de asignación) de las rutinas activas
          const idsActivos = new Set<number>(
            response.data.map((r: any) => r.rutinaId)
          );
          this.rutinasActivasIds.set(idsActivos);
          // Re-filtrar para aplicar el filtro de activas
          this.filtrarRutinas();
        }
      },
      error: (err) => {
        console.warn('No se pudieron cargar rutinas activas:', err);
      }
    });
  }

  cargarRutinas(): void {
    this.loading.set(true);
    
    // Intentar cargar desde API primero
    this.catalogoService.verCatalogoRutinas(this.soloSugeridos, 0, 100).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        if (response.success && response.data) {
          const data = response.data.content || response.data || [];
          if (data.length > 0) {
            this.rutinas.set(data);
            this.filtrarRutinas();
          } else {
            // API conectado pero sin datos, usar mock como fallback
            this.rutinas.set(this.mockData.rutinasDisponibles());
            this.filtrarRutinas();
            this.notificationService.showInfo('No hay rutinas en el catálogo. Mostrando ejemplos.');
          }
        } else {
          // Respuesta no exitosa, usar mock
          this.rutinas.set(this.mockData.rutinasDisponibles());
          this.filtrarRutinas();
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error cargando catálogo de rutinas:', err);
        // Fallback a datos mock
        this.rutinas.set(this.mockData.rutinasDisponibles());
        this.filtrarRutinas();
        this.notificationService.showWarning('Sin conexión al servidor. Mostrando datos de ejemplo.');
      }
    });
  }

  filtrarRutinas(): void {
    let filtrados = this.rutinas();

    // Filtrar rutinas que ya están activas (no mostrarlas)
    const idsActivos = this.rutinasActivasIds();
    filtrados = filtrados.filter(rutina => !idsActivos.has(rutina.id));

    if (this.filtroNombre) {
      const filtro = this.filtroNombre.toLowerCase();
      filtrados = filtrados.filter(
        (rutina) =>
          rutina.nombre.toLowerCase().includes(filtro) ||
          rutina.descripcion.toLowerCase().includes(filtro)
      );
    }

    if (this.filtroNivel) {
      filtrados = filtrados.filter((rutina) => rutina.nivelDificultad === this.filtroNivel);
    }

    this.rutinasFiltradas.set(filtrados);
  }

  activarRutina(rutina: any): void {
    this.activandoRutina.set(rutina.id);
    
    // Intentar activar en API
    this.metasService.activarRutina({ rutinaId: rutina.id }).subscribe({
      next: (response: any) => {
        this.activandoRutina.set(null);
        if (response.success) {
          this.notificationService.showSuccess(
            `Rutina "${rutina.nombre}" activada exitosamente`
          );
          // Recargar rutinas activas para que desaparezca del catálogo
          this.cargarRutinasActivas();
        } else {
          this.notificationService.showError(
            response.message || 'Error al activar la rutina'
          );
        }
      },
      error: (err) => {
        this.activandoRutina.set(null);
        const mensaje = err?.message || 'Error al activar la rutina';
        this.notificationService.showError(mensaje);
      }
    });
  }

  formatearNivel(nivel: string): string {
    const niveles: Record<string, string> = {
      PRINCIPIANTE: 'Principiante',
      INTERMEDIO: 'Intermedio',
      AVANZADO: 'Avanzado'
    };
    return niveles[nivel] || nivel;
  }
}