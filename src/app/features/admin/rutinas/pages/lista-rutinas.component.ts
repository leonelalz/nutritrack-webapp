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
import { RutinaService } from '../../../../core/services/rutina.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { RutinaResponse } from '../../../../core/models';

/**
 * Lista de Rutinas de Ejercicio (Admin)
 * US-11: Ver todas las rutinas
 */
@Component({
  selector: 'app-lista-rutinas',
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
            <mat-icon>fitness_center</mat-icon>
            Gestión de Rutinas de Ejercicio
          </h1>
          <p class="page-subtitle">Crea, edita y gestiona todas las rutinas de ejercicio desde aquí.</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/admin/rutinas/crear">
          <mat-icon>add</mat-icon>
          Crear Nueva Rutina
        </button>
      </div>

      <!-- Search & Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters">
            <mat-form-field class="search-field" appearance="outline">
              <mat-label>Buscar rutinas</mat-label>
              <input
                matInput
                [(ngModel)]="filtroNombre"
                (ngModelChange)="filtrarRutinas()"
                placeholder="Buscar por nombre..."
              />
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>
            <mat-checkbox
              [(ngModel)]="mostrarInactivas"
              (ngModelChange)="cargarRutinas()"
            >
              Mostrar rutinas inactivas
            </mat-checkbox>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Loading State -->
      @if (loading()) {
        <div class="loading-state">
          <mat-icon>hourglass_empty</mat-icon>
          <p>Cargando rutinas...</p>
        </div>
      }

      <!-- Empty State -->
      @if (!loading() && rutinasFiltradas().length === 0) {
        <mat-card>
          <mat-card-content>
            <div class="empty-state">
              <mat-icon class="empty-icon">fitness_center</mat-icon>
              <h3>No hay rutinas registradas</h3>
              <p>Comienza creando tu primera rutina de ejercicio para el sistema</p>
              <button mat-raised-button color="primary" routerLink="/admin/rutinas/crear">
                <mat-icon>add</mat-icon>
                Crear Primera Rutina
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      }

      <!-- Table View -->
      @if (!loading() && rutinasFiltradas().length > 0) {
        <div class="table-container">
          <table class="rutinas-table">
            <thead>
              <tr>
                <th>Nombre de la Rutina</th>
                <th>Duración</th>
                <th>Nivel</th>
                <th>Etiquetas</th>
                <th>Estado</th>
                <th>Creación</th>
                <th class="actions-column"></th>
              </tr>
            </thead>
            <tbody>
              @for (rutina of rutinasFiltradas(); track rutina.id) {
                <tr class="rutina-row" [class.inactive]="!rutina.activo">
                  <td class="rutina-name-cell">
                    <div class="rutina-name">{{ rutina.nombre }}</div>
                    @if (rutina.descripcion) {
                      <div class="rutina-desc">{{ rutina.descripcion }}</div>
                    }
                  </td>
                  <td>
                    <span class="duration-badge">{{ rutina.duracionSemanas }} Semanas</span>
                  </td>
                  <td>
                    <span class="nivel-badge" [attr.data-nivel]="rutina.nivelDificultad">
                      {{ formatearNivel(rutina.nivelDificultad) }}
                    </span>
                  </td>
                  <td>
                    @if (rutina.etiquetas && rutina.etiquetas.length > 0) {
                      <div class="etiquetas-cell">
                        @for (etiqueta of rutina.etiquetas.slice(0, 2); track etiqueta.id) {
                          <span class="etiqueta-badge">{{ etiqueta.nombre }}</span>
                        }
                        @if (rutina.etiquetas.length > 2) {
                          <span class="etiqueta-more">+{{ rutina.etiquetas.length - 2 }}</span>
                        }
                      </div>
                    } @else {
                      <span class="text-muted">Sin etiquetas</span>
                    }
                  </td>
                  <td>
                    <span class="status-badge" [class.active]="rutina.activo" [class.inactive]="!rutina.activo">
                      {{ rutina.activo ? 'Activa' : 'Inactiva' }}
                    </span>
                  </td>
                  <td class="date-cell">
                    {{ formatearFecha(rutina.createdAt) }}
                  </td>
                  <td class="actions-cell">
                    <button class="btn-icon" [routerLink]="['/admin/rutinas', rutina.id, 'editar']" title="Editar rutina">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button 
                      class="btn-icon btn-ejercicios" 
                      [routerLink]="['/admin/rutinas', rutina.id, 'ejercicios']" 
                      title="Agregar y organizar ejercicios (Drag & Drop)"
                    >
                      <mat-icon>fitness_center</mat-icon>
                    </button>
                    @if (rutina.activo) {
                      <button
                        class="btn-icon btn-delete"
                        (click)="confirmarEliminar(rutina)"
                        [disabled]="rutina.numeroUsuariosActivos && rutina.numeroUsuariosActivos > 0"
                        title="Eliminar rutina"
                      >
                        <mat-icon>delete</mat-icon>
                      </button>
                    } @else {
                      <button
                        class="btn-icon btn-success"
                        (click)="activarRutina(rutina)"
                        title="Activar rutina"
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
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      min-height: 100vh;
      background: #f8f9fa;
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
      font-size: 2rem;
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

    .filters-card {
      margin-bottom: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

    /* Table Styles */
    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .rutinas-table {
      width: 100%;
      border-collapse: collapse;
    }

    .rutinas-table thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .rutinas-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .rutinas-table tbody tr {
      border-bottom: 1px solid #e2e8f0;
      transition: background 0.2s;
    }

    .rutinas-table tbody tr:hover {
      background: #f7fafc;
    }

    .rutinas-table tbody tr.inactive {
      opacity: 0.6;
    }

    .rutinas-table td {
      padding: 1rem;
      color: #4a5568;
    }

    .rutina-name-cell {
      font-weight: 600;
      color: #2d3748;
      max-width: 300px;
    }

    .rutina-name {
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }

    .rutina-desc {
      font-size: 0.875rem;
      color: #718096;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .duration-badge {
      display: inline-block;
      padding: 0.375rem 0.75rem;
      background: #ebf8ff;
      color: #2c5282;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .nivel-badge {
      display: inline-block;
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .nivel-badge[data-nivel="PRINCIPIANTE"] {
      background: #c6f6d5;
      color: #22543d;
    }

    .nivel-badge[data-nivel="INTERMEDIO"] {
      background: #feebc8;
      color: #7c2d12;
    }

    .nivel-badge[data-nivel="AVANZADO"] {
      background: #fed7d7;
      color: #742a2a;
    }

    .nivel-badge[data-nivel="EXPERTO"] {
      background: #e9d8fd;
      color: #44337a;
    }

    .etiquetas-cell {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }

    .etiqueta-badge {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      background: #faf5ff;
      color: #6b46c1;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .etiqueta-more {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background: #e2e8f0;
      color: #4a5568;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-badge {
      display: inline-block;
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-badge.active {
      background: #c6f6d5;
      color: #22543d;
    }

    .status-badge.inactive {
      background: #fed7d7;
      color: #742a2a;
    }

    .date-cell {
      color: #718096;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    .text-muted {
      color: #a0aec0;
      font-style: italic;
    }

    .actions-column {
      width: 150px;
      text-align: right;
    }

    .actions-cell {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      align-items: center;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      min-width: 36px;
      padding: 0;
      border: none;
      background: transparent;
      color: #4a5568;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-icon:hover:not(:disabled) {
      background: #edf2f7;
      color: #2d3748;
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

    .btn-icon.btn-delete {
      color: #e53e3e;
    }

    .btn-icon.btn-delete:hover:not(:disabled) {
      background: #fff5f5;
    }

    .btn-icon.btn-success {
      color: #38a169;
    }

    .btn-icon.btn-success:hover:not(:disabled) {
      background: #f0fff4;
    }

    .btn-icon.btn-ejercicios {
      color: #667eea;
      background: #f0f4ff;
      font-weight: 600;
    }

    .btn-icon.btn-ejercicios:hover:not(:disabled) {
      background: #667eea;
      color: white;
      transform: scale(1.05);
    }

    .btn-icon.btn-ejercicios mat-icon {
      font-weight: bold;
    }

    /* Loading & Empty States */
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

    .loading-state p {
      color: #718096;
      font-size: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #cbd5e0;
      margin: 0 auto 1.5rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #2d3748;
    }

    .empty-state p {
      color: #718096;
      margin-bottom: 2rem;
      font-size: 1rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .table-container {
        overflow-x: auto;
      }

      .rutinas-table {
        min-width: 900px;
      }
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .page-title {
        font-size: 1.5rem;
      }

      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        width: 100%;
      }
    }
  `]
})
export class ListaRutinasComponent implements OnInit {
  loading = signal(false);
  isDeleting = signal(false);
  mostrarInactivas = signal(false);
  filtroNombre = signal('');
  rutinasFiltradas = signal<RutinaResponse[]>([]);

  constructor(
    private rutinaService: RutinaService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarRutinas();
  }

  cargarRutinas(): void {
    this.loading.set(true);
    
    // Si mostrarInactivas está activado, obtener todas las rutinas, sino solo activas
    const observable = this.mostrarInactivas() 
      ? this.rutinaService.obtenerRutinas()
      : this.rutinaService.obtenerRutinasActivas();

    observable.subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.data) {
          // response.data ya es la estructura paginada, y el servicio actualiza _rutinas
          this.rutinasFiltradas.set(this.rutinaService.rutinas());
        }
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.showError('Error al cargar rutinas');
      }
    });
  }

  filtrarRutinas(): void {
    const filtro = this.filtroNombre().trim();
    
    if (!filtro) {
      this.cargarRutinas();
      return;
    }

    // Buscar por nombre usando el endpoint del API
    this.loading.set(true);
    this.rutinaService.buscarRutinas(filtro).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.rutinasFiltradas.set(this.rutinaService.rutinas());
        }
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.showError('Error al buscar rutinas');
      }
    });
  }

  confirmarEliminar(rutina: RutinaResponse): void {
    const confirmation = confirm(
      `¿Estás seguro de que deseas desactivar la rutina "${rutina.nombre}"?\n\n` +
      `La rutina quedará inactiva pero podrás reactivarla más tarde.`
    );

    if (confirmation) {
      this.isDeleting.set(true);
      this.rutinaService.desactivarRutina(rutina.id).subscribe({
        next: (response) => {
          console.log('Rutina desactivada - Response:', response);
          this.notificationService.showSuccess('Rutina desactivada correctamente');
          this.cargarRutinas();
        },
        error: (error) => {
          console.error('Error al desactivar rutina:', error);
          const errorMessage = error.error?.message || error.error?.error || error.message || 'Error al desactivar la rutina';
          console.log('Error message extracted:', errorMessage);
          this.notificationService.showError(errorMessage);
        },
        complete: () => this.isDeleting.set(false)
      });
    }
  }

  activarRutina(rutina: RutinaResponse): void {
    this.isDeleting.set(true);
    this.rutinaService.activarRutina(rutina.id).subscribe({
      next: (response) => {
        console.log('Rutina activada - Response:', response);
        this.notificationService.showSuccess('Rutina activada correctamente');
        this.cargarRutinas();
      },
      error: (error) => {
        console.error('Error al activar rutina:', error);
        const errorMessage = error.error?.message || error.error?.error || error.message || 'Error al activar la rutina';
        console.log('Error message extracted:', errorMessage);
        this.notificationService.showError(errorMessage);
      },
      complete: () => this.isDeleting.set(false)
    });
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
