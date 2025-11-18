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
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon>fitness_center</mat-icon>
            Gestión de Rutinas de Ejercicio
          </h1>
          <p class="page-subtitle">Administra las rutinas de ejercicio del sistema</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/admin/rutinas/crear">
          <mat-icon>add</mat-icon>
          Crear Rutina
        </button>
      </div>

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

      @if (loading()) {
        <div class="loading">Cargando rutinas...</div>
      }

      @if (!loading() && rutinasFiltradas().length === 0) {
        <mat-card>
          <mat-card-content>
            <div class="empty-state">
              <mat-icon class="empty-icon">event_repeat</mat-icon>
              <h3>No hay rutinas registradas</h3>
              <p>Comienza creando tu primera rutina para el sistema</p>
              <button mat-raised-button color="primary" routerLink="/admin/rutinas/crear">
                <mat-icon>add</mat-icon>
                Crear Primera Rutina
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      }

      @if (!loading() && rutinasFiltradas().length > 0) {
        <div class="rutinas-grid">
          @for (rutina of rutinasFiltradas(); track rutina.id) {
            <mat-card class="rutina-card" [class.inactiva]="!rutina.activo">
              <div class="rutina-header">
                <h3>{{ rutina.nombre }}</h3>
                <span class="estado-badge" [class.activo]="rutina.activo" [class.inactivo]="!rutina.activo">
                  {{ rutina.activo ? 'Activa' : 'Inactiva' }}
                </span>
              </div>

              <p class="rutina-descripcion">{{ rutina.descripcion }}</p>

              <div class="rutina-stats">
                <div class="stat">
                  <span class="stat-label">Duración:</span>
                  <span class="stat-value">{{ rutina.duracionSemanas }} semanas</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Nivel:</span>
                  <span class="stat-value">{{ formatearNivel(rutina.nivelDificultad) }}</span>
                </div>
                @if (rutina.totalEjerciciosProgramados !== undefined) {
                  <div class="stat">
                    <span class="stat-label">Ejercicios:</span>
                    <span class="stat-value">{{ rutina.totalEjerciciosProgramados }}</span>
                  </div>
                }
              </div>

              <mat-chip-set class="rutina-etiquetas">
                @for (etiqueta of rutina.etiquetas; track etiqueta.id) {
                  <mat-chip>{{ etiqueta.nombre }}</mat-chip>
                }
              </mat-chip-set>

              <div class="rutina-actions">
                <button mat-raised-button [routerLink]="['/admin/rutinas', rutina.id, 'editar']">
                  <mat-icon>edit</mat-icon>
                  Editar
                </button>
                <button mat-raised-button [routerLink]="['/admin/rutinas', rutina.id, 'ejercicios']">
                  <mat-icon>list</mat-icon>
                  Ejercicios
                </button>
                <button
                  mat-raised-button
                  color="warn"
                  (click)="confirmarEliminar(rutina)"
                  [disabled]="rutina.numeroUsuariosActivos && rutina.numeroUsuariosActivos > 0"
                >
                  <mat-icon>delete</mat-icon>
                  Eliminar
                </button>
              </div>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
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

    .rutinas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .rutina-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .rutina-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .rutina-card.inactiva {
      opacity: 0.6;
    }

    .rutina-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .rutina-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #333;
      flex: 1;
    }

    .estado-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .estado-badge.activo {
      background: #d4edda;
      color: #155724;
    }

    .estado-badge.inactivo {
      background: #f8d7da;
      color: #721c24;
    }

    .rutina-descripcion {
      color: #666;
      margin-bottom: 1rem;
      min-height: 3rem;
    }

    .rutina-stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stat {
      flex: 1;
      text-align: center;
    }

    .stat-label {
      display: block;
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      display: block;
      font-size: 1.25rem;
      font-weight: bold;
      color: #333;
    }

    .rutina-etiquetas {
      margin-bottom: 1rem;
    }

    .rutina-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .rutina-actions button {
      flex: 1;
      min-width: 120px;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

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
export class ListaRutinasComponent implements OnInit {
  loading = signal(false);
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
    // Validar RN14: No eliminar si tiene usuarios activos
    // Nota: El backend validará esto también

    const confirmado = confirm(
      `¿Estás seguro de eliminar la rutina "${rutina.nombre}"?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmado) {
      this.rutinaService.eliminarRutina(rutina.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.showSuccess('Rutina eliminada exitosamente');
            this.cargarRutinas();
          }
        },
        error: (error) => {
          if (error.status === 409) {
            this.notificationService.showError(error.error.message || 'La rutina tiene usuarios activos');
          } else {
            this.notificationService.showError('Error al eliminar rutina');
          }
        }
      });
    }
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

  formatearObjetivo(tipo: string | null): string {
    if (!tipo) return 'Sin objetivo';
    
    const objetivos: Record<string, string> = {
      'PERDER_PESO': 'Pérdida de Peso',
      'GANAR_MASA_MUSCULAR': 'Ganancia Muscular',
      'MANTENER_FORMA': 'Mantenimiento',
      'REHABILITACION': 'Rehabilitación',
      'CONTROLAR_ESTRES': 'Control de Estrés'
    };
    return objetivos[tipo] || tipo;
  }
}
