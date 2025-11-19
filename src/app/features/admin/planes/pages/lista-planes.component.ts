import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { PlanService } from '../../../../core/services/plan.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PlanResponse } from '../../../../core/models';

/**
 * Lista de Planes Nutricionales (Admin)
 * US-11: Ver todos los planes con filtros
 * RN14: Muestra número de usuarios activos
 */
@Component({
  selector: 'app-lista-planes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon>restaurant_menu</mat-icon>
            Gestión de Planes Nutricionales
          </h1>
          <p class="page-subtitle">Crea, edita y gestiona todos los planes nutricionales desde aquí.</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/admin/planes/crear">
          <mat-icon>add</mat-icon>
          Crear Nuevo Plan
        </button>
      </div>

      <!-- Search & Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters">
            <mat-form-field class="search-field" appearance="outline">
              <mat-label>Buscar planes</mat-label>
              <input
                matInput
                [(ngModel)]="filtroNombre"
                (ngModelChange)="filtrarPlanes()"
                placeholder="Buscar por nombre..."
              />
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>
            <mat-checkbox
              [(ngModel)]="mostrarInactivos"
              (ngModelChange)="cargarPlanes()"
            >
              Mostrar planes inactivos
            </mat-checkbox>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Loading State -->
      @if (loading()) {
        <div class="loading-state">
          <mat-icon>hourglass_empty</mat-icon>
          <p>Cargando planes...</p>
        </div>
      }

      <!-- Empty State -->
      @if (!loading() && planesFiltrados().length === 0) {
        <mat-card>
          <mat-card-content>
            <div class="empty-state">
              <mat-icon class="empty-icon">restaurant_menu</mat-icon>
              <h3>No hay planes registrados</h3>
              <p>Comienza creando tu primer plan nutricional para el sistema</p>
              <button mat-raised-button color="primary" routerLink="/admin/planes/crear">
                <mat-icon>add</mat-icon>
                Crear Primer Plan
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      }

      <!-- Table View -->
      @if (!loading() && planesFiltrados().length > 0) {
        <div class="table-container">
          <table class="plans-table">
            <thead>
              <tr>
                <th>Nombre del Plan</th>
                <th>Duración</th>
                <th>Objetivo</th>
                <th>Estado</th>
                <th>Fecha de Creación</th>
                <th class="actions-column"></th>
              </tr>
            </thead>
            <tbody>
              @for (plan of planesFiltrados(); track plan.id) {
                <tr class="plan-row" [class.inactive]="!plan.activo">
                  <td class="plan-name-cell">
                    <div class="plan-name">{{ plan.nombre }}</div>
                  </td>
                  <td>
                    <span class="duration-badge">{{ plan.duracionDias }} Semanas</span>
                  </td>
                  <td>
                    @if (plan.objetivo) {
                      <div class="objetivo-info">
                        <span class="objetivo-calorias">{{ plan.objetivo.caloriasObjetivo }} kcal</span>
                        @if (plan.objetivo.descripcion) {
                          <span class="objetivo-desc">{{ plan.objetivo.descripcion }}</span>
                        }
                      </div>
                    } @else {
                      <span class="text-muted">Sin objetivo</span>
                    }
                  </td>
                  <td>
                    <span class="status-badge" [class.active]="plan.activo" [class.inactive]="!plan.activo">
                      {{ plan.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="date-cell">
                    {{ formatearFecha(plan.createdAt) }}
                  </td>
                  <td class="actions-cell">
                    <button class="btn-icon" [routerLink]="['/admin/planes', plan.id]" title="Ver detalles">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button class="btn-icon btn-comidas" [routerLink]="['/admin/planes', plan.id, 'comidas']" title="Gestionar comidas">
                      <mat-icon>restaurant_menu</mat-icon>
                    </button>
                    <button class="btn-icon" [routerLink]="['/admin/planes', plan.id, 'editar']" title="Editar">
                      <mat-icon>edit</mat-icon>
                    </button>
                    @if (plan.activo) {
                      <button
                        class="btn-icon btn-delete"
                        (click)="confirmarDesactivar(plan)"
                        [disabled]="plan.numeroUsuariosActivos && plan.numeroUsuariosActivos > 0"
                        title="Desactivar plan"
                      >
                        <mat-icon>toggle_off</mat-icon>
                      </button>
                    } @else {
                      <button
                        class="btn-icon btn-success"
                        (click)="activarPlan(plan)"
                        title="Activar plan"
                      >
                        <mat-icon>toggle_on</mat-icon>
                      </button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button class="btn-pagination" (click)="paginaAnterior()" [disabled]="paginaActual() === 0">
            <mat-icon>chevron_left</mat-icon>
            Anterior
          </button>
          
          <div class="page-numbers">
            @for (pagina of paginasVisibles(); track pagina) {
              @if (pagina === '...') {
                <span class="page-ellipsis">{{ pagina }}</span>
              } @else {
                <button
                  class="page-number"
                  [class.active]="pagina === paginaActual() + 1"
                  (click)="irAPagina(Number(pagina) - 1)"
                >
                  {{ pagina }}
                </button>
              }
            }
          </div>

          <button class="btn-pagination" (click)="paginaSiguiente()" [disabled]="paginaActual() >= totalPaginas() - 1">
            Siguiente
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      background: #f5f5f5;
      min-height: 100vh;
    }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .header-content {
      flex: 1;
    }

    .page-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      color: #333;
    }

    .page-title mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: var(--primary-color, #00A859);
    }

    .page-subtitle {
      margin: 0;
      color: #666;
      font-size: 1rem;
    }

    /* Filters */
    .filters-card {
      margin-bottom: 2rem;
    }

    .filters {
      display: flex;
      gap: 1.5rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 300px;
    }

    mat-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    /* Table */
    .table-container {
      background: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
    }

    .plans-table {
      width: 100%;
      border-collapse: collapse;
    }

    .plans-table thead {
      background: #f8f9fa;
      border-bottom: 2px solid #e2e8f0;
    }

    .plans-table th {
      padding: 1rem 1.5rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .plans-table tbody tr {
      border-bottom: 1px solid #e2e8f0;
      transition: background 0.15s;
    }

    .plans-table tbody tr:hover {
      background: #f8f9fa;
    }

    .plans-table tbody tr:last-child {
      border-bottom: none;
    }

    .plans-table tbody tr.inactive {
      opacity: 0.6;
    }

    .plans-table td {
      padding: 1rem 1.5rem;
      font-size: 0.875rem;
      color: #212529;
    }

    .plan-name-cell {
      font-weight: 500;
    }

    .plan-name {
      color: #2d3748;
      font-size: 0.95rem;
    }

    .duration-badge {
      padding: 0.375rem 0.875rem;
      background: #edf2f7;
      color: #2d3748;
      border-radius: 6px;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    .objetivo-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .objetivo-calorias {
      font-weight: 600;
      color: #00A859;
      font-size: 0.9rem;
    }

    .objetivo-desc {
      font-size: 0.75rem;
      color: #718096;
      font-style: italic;
    }

    .text-muted {
      color: #718096;
      font-style: italic;
    }

    .status-badge {
      display: inline-block;
      padding: 0.375rem 0.875rem;
      border-radius: 16px;
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .date-cell {
      color: #718096;
    }

    .actions-cell {
      text-align: right;
    }

    .actions-column {
      text-align: right;
      width: 150px;
    }

    .btn-icon {
      background: transparent;
      border: none;
      color: #718096;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: all 0.2s;
      margin-left: 0.25rem;
    }

    .btn-icon:hover {
      background: #edf2f7;
      color: #2d3748;
    }

    .btn-icon.btn-delete:hover {
      background: #fff5f5;
      color: #e53e3e;
    }

    .btn-icon.btn-success {
      color: #38a169;
    }

    .btn-icon.btn-success:hover {
      background: #f0fff4;
      color: #38a169;
    }

    .btn-icon:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .btn-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-top: 2rem;
      padding: 1rem;
    }

    .btn-pagination {
      min-width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.75rem;
      background: white;
      color: #00A859;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
      font-weight: 500;
      gap: 0.25rem;
    }

    .btn-pagination:hover:not(:disabled) {
      background: #00A859;
      color: white;
      border-color: #00A859;
    }

    .btn-pagination:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      color: #6c757d;
      background: #f8f9fa;
    }

    .page-numbers {
      display: flex;
      gap: 0.25rem;
      align-items: center;
    }

    .page-number {
      min-width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      color: #00A859;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .page-number:hover {
      background: #00A859;
      color: white;
      border-color: #00A859;
    }

    .page-number.active {
      background: #00A859;
      color: white;
      border-color: #00A859;
    }

    .page-ellipsis {
      color: #6c757d;
      padding: 0 0.25rem;
      font-weight: 500;
    }

    /* Loading State */
    .loading-state {
      text-align: center;
      padding: 4rem;
      color: #718096;
    }

    .loading-state mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;
      color: #00A859;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 3rem;
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 1.5rem;
    }
  `]
})
export class ListaPlanesComponent implements OnInit {
  loading = signal(false);
  mostrarInactivos = signal(false);
  filtroNombre = signal('');
  planesFiltrados = signal<PlanResponse[]>([]);
  filtrosActivos = signal<string[]>([]);
  paginaActual = signal(0);
  totalPaginas = signal(1);
  tamañoPagina = 20;
  
  // Helper para template
  Number = Number;

  constructor(
    private planService: PlanService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPlanes();
  }

  toggleFiltros(): void {
    // TODO: Implementar panel de filtros avanzados
    this.mostrarInactivos.update(val => !val);
    if (this.mostrarInactivos()) {
      this.filtrosActivos.set(['Mostrar inactivos']);
    } else {
      this.filtrosActivos.set([]);
    }
    this.cargarPlanes();
  }

  removerFiltro(filtro: string): void {
    this.filtrosActivos.update(filtros => filtros.filter(f => f !== filtro));
    if (filtro === 'Mostrar inactivos') {
      this.mostrarInactivos.set(false);
      this.cargarPlanes();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 0) {
      this.paginaActual.update(p => p - 1);
      this.cargarPlanes();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual() < this.totalPaginas() - 1) {
      this.paginaActual.update(p => p + 1);
      this.cargarPlanes();
    }
  }

  irAPagina(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargarPlanes();
  }

  paginasVisibles(): (number | string)[] {
    const total = this.totalPaginas();
    const actual = this.paginaActual() + 1;
    const paginas: (number | string)[] = [];

    if (total <= 7) {
      // Mostrar todas las páginas si son 7 o menos
      for (let i = 1; i <= total; i++) {
        paginas.push(i);
      }
    } else {
      // Siempre mostrar primera página
      paginas.push(1);

      if (actual > 3) {
        paginas.push('...');
      }

      // Páginas alrededor de la actual
      for (let i = Math.max(2, actual - 1); i <= Math.min(total - 1, actual + 1); i++) {
        paginas.push(i);
      }

      if (actual < total - 2) {
        paginas.push('...');
      }

      // Siempre mostrar última página
      if (total > 1) {
        paginas.push(total);
      }
    }

    return paginas;
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  cargarPlanes(): void {
    this.loading.set(true);
    
    // Si mostrarInactivos está activado, obtener todos los planes, sino solo activos
    const observable = this.mostrarInactivos() 
      ? this.planService.obtenerPlanes(this.paginaActual(), this.tamañoPagina)
      : this.planService.obtenerPlanesActivos(this.paginaActual(), this.tamañoPagina);

    observable.subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.planesFiltrados.set(this.planService.planes());
          const totalElements = this.planService.totalElements();
          this.totalPaginas.set(Math.ceil(totalElements / this.tamañoPagina));
        }
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.showError('Error al cargar planes');
      }
    });
  }

  filtrarPlanes(): void {
    const filtro = this.filtroNombre().trim();
    
    if (!filtro) {
      this.paginaActual.set(0);
      this.cargarPlanes();
      return;
    }

    // Buscar por nombre usando el endpoint del API
    this.loading.set(true);
    this.planService.buscarPlanes(filtro, this.paginaActual(), this.tamañoPagina).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.planesFiltrados.set(this.planService.planes());
          const totalElements = this.planService.totalElements();
          this.totalPaginas.set(Math.ceil(totalElements / this.tamañoPagina));
        }
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.showError('Error al buscar planes');
      }
    });
  }

  confirmarDesactivar(plan: PlanResponse): void {
    // Validar RN14: No desactivar si tiene usuarios activos
    // Nota: El backend validará esto también

    const confirmado = confirm(
      `¿Estás seguro de desactivar el plan "${plan.nombre}"?\n\nEl plan quedará inactivo pero podrás reactivarlo más tarde.`
    );

    if (confirmado) {
      this.planService.desactivarPlan(plan.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.showSuccess('Plan desactivado exitosamente');
            this.cargarPlanes();
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

  activarPlan(plan: PlanResponse): void {
    if (!plan) return;

    this.planService.activarPlan(plan.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Plan activado exitosamente');
          this.cargarPlanes();
        }
      },
      error: (error) => {
        const mensaje = error.error?.message || error.error?.error || error.message || 'Error al activar el plan';
        this.notificationService.showError(mensaje);
      }
    });
  }

  formatearObjetivo(tipo: string | null): string {
    if (!tipo) return 'Sin objetivo';
    
    const objetivos: Record<string, string> = {
      'PERDER_PESO': 'Pérdida de Peso',
      'GANAR_MASA_MUSCULAR': 'Ganancia Muscular',
      'MANTENER_FORMA': 'Mantenimiento',
      'REHABILITACION': 'Rehabilitación',
      'CONTROLAR_ESTRES': 'Control de Estrés',
      'SALUD_GENERAL': 'Salud General'
    };
    return objetivos[tipo] || tipo;
  }
}
