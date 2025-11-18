import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../services/catalogo.service';
import { NotificationService } from '../../../core/services/notification.service';

/**
 * Lista de Planes Disponibles en el Catálogo
 * US-16: Ver todos los planes disponibles
 */
@Component({
  selector: 'app-catalogo-lista-planes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="catalogo-planes-container">
      <div class="header">
        <h1>Planes Nutricionales Disponibles</h1>
        <p class="subtitle">Explora nuestros planes y activa el que mejor se ajuste a tus objetivos</p>
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
      </div>

      @if (loading()) {
        <div class="loading">
          <p>Cargando planes...</p>
        </div>
      }

      @if (!loading() && planesFiltrados().length === 0) {
        <div class="empty-state">
          <p>No hay planes disponibles en este momento</p>
        </div>
      }

      @if (!loading() && planesFiltrados().length > 0) {
        <div class="planes-grid">
          @for (plan of planesFiltrados(); track plan.id) {
            <div class="plan-card">
              <div class="plan-header">
                <h3>{{ plan.nombre }}</h3>
                <span class="badge-active">Disponible</span>
              </div>

              <p class="plan-description">{{ plan.descripcion }}</p>

              <div class="plan-stats">
                <div class="stat">
                  <span class="stat-label">Duración:</span>
                  <span class="stat-value">{{ plan.duracionDias }} días</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Objetivo:</span>
                  <span class="stat-value">{{ formatearObjetivo(plan.objetivo.tipoObjetivo) }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Calorías:</span>
                  <span class="stat-value">{{ plan.objetivo.caloriasObjetivo }} kcal</span>
                </div>
              </div>

              <div class="plan-etiquetas">
                @for (etiqueta of plan.etiquetas; track etiqueta.id) {
                  <span class="etiqueta">{{ etiqueta.nombre }}</span>
                }
              </div>

              <div class="plan-actions">
                <button
                  class="btn-primary"
                  [routerLink]="['/catalogo/planes', plan.id]"
                >
                  Ver Detalles
                </button>
                <button
                  class="btn-secondary"
                  (click)="activarPlan(plan)"
                  [disabled]="plan.activoParaUsuario"
                >
                  {{ plan.activoParaUsuario ? 'Activado' : 'Activar' }}
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
    }

    .plan-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
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

    .badge-active {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      background: #48bb78;
      color: white;
      white-space: nowrap;
    }

    .plan-description {
      color: #718096;
      margin-bottom: 1rem;
      line-height: 1.5;
      flex: 1;
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
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-top: auto;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1rem;
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

    .btn-secondary {
      background: #edf2f7;
      color: #4a5568;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #e2e8f0;
    }

    .btn-secondary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: #cbd5e0;
      color: #2d3748;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 3rem;
      color: #718096;
    }

    .empty-state p {
      font-size: 1.125rem;
    }
  `]
})
export class CatalogoListaPlanesComponent implements OnInit {
  loading = signal(false);
  filtroNombre = '';
  filtroObjetivo = '';
  planes = signal<any[]>([]);
  planesFiltrados = signal<any[]>([]);

  constructor(
    private readonly catalogoService: CatalogoService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarPlanes();
  }

    cargarPlanes(): void {
      this.loading.set(true);
      this.catalogoService.obtenerTodosLosPlanesDeUsuario().subscribe({
        next: (response: any) => {
          this.loading.set(false);
          if (response.success) {
            this.planes.set(response.data || []);
            this.filtrarPlanes();
          }
        },
        error: () => {
          this.loading.set(false);
          this.notificationService.showError('Error al cargar los planes');
        }
      });
    }

  filtrarPlanes(): void {
    let filtrados = this.planes();

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
        (plan) => plan.objetivo.tipoObjetivo === this.filtroObjetivo
      );
    }

    this.planesFiltrados.set(filtrados);
  }

  activarPlan(plan: any): void {
    this.catalogoService.activarPlan({ planId: plan.id }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notificationService.showSuccess(
            `Plan "${plan.nombre}" activado exitosamente`
          );
          this.cargarPlanes();
        }
      },
      error: (error: any) => {
        this.notificationService.showError(
          error.error?.message || 'Error al activar el plan'
        );
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
