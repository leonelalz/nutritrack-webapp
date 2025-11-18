import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';

interface DashboardStat {
  title: string;
  value: number | string;
  change: string;
  icon: string;
}

interface QuickAccessItem {
  title: string;
  icon: string;
  route: string;
}

interface ActivityItem {
  type: string;
  title: string;
  description: string;
  time: string;
  icon: string;
}

/**
 * Dashboard principal de administración con diseño moderno usando Angular Material
 * Punto de entrada para módulos 2 y 3
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatRippleModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header Section -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="welcome-text">
            <h1 class="page-title">¡Bienvenido, Admin!</h1>
            <p class="page-subtitle">Aquí hay un resumen de tu biblioteca de contenido.</p>
          </div>
          
          <!-- Time Filter Chips -->
          <div class="time-filter">
            <mat-chip-listbox [value]="selectedTimeFilter">
              <mat-chip-option 
                *ngFor="let filter of timeFilters" 
                [value]="filter.value"
                (click)="selectedTimeFilter = filter.value"
              >
                {{ filter.label }}
              </mat-chip-option>
            </mat-chip-listbox>
          </div>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <mat-card *ngFor="let stat of stats" class="stat-card">
          <mat-card-content>
            <p class="stat-label">{{ stat.title }}</p>
            <h2 class="stat-value">{{ stat.value }}</h2>
            <p class="stat-change">{{ stat.change }}</p>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Left Column: Chart & Quick Access -->
        <div class="left-column">
          <!-- Activity Chart Card -->
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Resumen de Creación</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-container">
                <div class="chart-placeholder">
                  <mat-icon class="chart-icon">analytics</mat-icon>
                  <p class="chart-text">Gráfico de actividad</p>
                  <p class="chart-subtext">Aquí se mostrará un gráfico de líneas con la creación de contenido</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Quick Access -->
          <div class="quick-access-section">
            <h2 class="section-title">Acceso Rápido</h2>
            <div class="quick-access-grid">
              <a 
                *ngFor="let item of quickAccessItems" 
                [routerLink]="item.route" 
                class="quick-access-card"
                mat-ripple
              >
                <div class="quick-access-icon">
                  <mat-icon>{{ item.icon }}</mat-icon>
                </div>
                <p class="quick-access-title">{{ item.title }}</p>
              </a>
            </div>
          </div>
        </div>

        <!-- Right Column: Recent Activity -->
        <mat-card class="activity-card">
          <mat-card-header>
            <mat-card-title>Actividad Reciente</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div *ngFor="let activity of recentActivities" class="activity-item">
                <div class="activity-icon-wrapper">
                  <mat-icon class="activity-icon">{{ activity.icon }}</mat-icon>
                </div>
                <div class="activity-details">
                  <p class="activity-title">{{ activity.title }}</p>
                  <p class="activity-description">"{{ activity.description }}"</p>
                </div>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .dashboard-container {
      padding: 2rem;
      max-width: 1600px;
      margin: 0 auto;
    }

    /* Header Section */
    .dashboard-header {
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 900;
      color: var(--color-text-primary);
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.033em;
    }

    .page-subtitle {
      font-size: 1rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    /* Time Filter Chips */
    .time-filter ::ng-deep .mat-mdc-chip-listbox {
      background: var(--color-background-dark);
      border-radius: 8px;
      padding: 4px;
    }

    .time-filter ::ng-deep .mat-mdc-chip {
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .stat-card mat-card-content {
      padding: 1.5rem;
    }

    .stat-label {
      color: var(--color-text-secondary);
      font-size: 1rem;
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
    }

    .stat-change {
      color: var(--color-secondary);
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 1200px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Left Column */
    .left-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Chart Card */
    .chart-card {
      min-height: 400px;
    }

    .chart-container {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chart-placeholder {
      text-align: center;
      color: var(--color-text-muted);
    }

    .chart-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: var(--color-primary);
      margin-bottom: 1rem;
    }

    .chart-text {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0.5rem 0;
      color: var(--color-text-primary);
    }

    .chart-subtext {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    /* Quick Access */
    .quick-access-section {
      margin-top: 1rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 1.5rem 0;
      letter-spacing: -0.015em;
    }

    .quick-access-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .quick-access-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--color-background-light);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-lg);
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .quick-access-card:hover {
      background: var(--color-background-dark);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .quick-access-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: rgba(0, 168, 89, 0.1);
      border-radius: var(--border-radius-lg);
    }

    .quick-access-icon mat-icon {
      color: var(--color-secondary);
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .quick-access-title {
      flex: 1;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    /* Activity Card */
    .activity-card {
      height: fit-content;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 600px;
      overflow-y: auto;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--border-radius-md);
      transition: background 0.2s ease;
    }

    .activity-item:hover {
      background: var(--color-background-dark);
    }

    .activity-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(0, 168, 89, 0.1);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .activity-icon {
      color: var(--color-secondary);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .activity-details {
      flex: 1;
      min-width: 0;
    }

    .activity-title {
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
    }

    .activity-description {
      color: var(--color-text-secondary);
      margin: 0;
      font-size: 0.75rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .activity-time {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      white-space: nowrap;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .admin-dashboard-container {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .page-title {
        font-size: 2rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .quick-access-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  selectedTimeFilter = '7days';
  
  timeFilters = [
    { label: 'Últimos 7 días', value: '7days' },
    { label: 'Últimos 30 días', value: '30days' },
    { label: 'Todo el tiempo', value: 'all' }
  ];

  stats: DashboardStat[] = [
    {
      title: 'Planes Creados',
      value: 128,
      change: '+12%',
      icon: 'menu_book'
    },
    {
      title: 'Rutinas Creadas',
      value: 97,
      change: '+8%',
      icon: 'event_repeat'
    },
    {
      title: 'Comidas Registradas',
      value: 452,
      change: '+21%',
      icon: 'restaurant'
    },
    {
      title: 'Ingredientes Totales',
      value: 540,
      change: '+32 nuevos',
      icon: 'inventory_2'
    }
  ];

  quickAccessItems: QuickAccessItem[] = [
    {
      title: 'Gestionar Planes',
      icon: 'menu_book',
      route: '/admin/planes'
    },
    {
      title: 'Gestionar Rutinas',
      icon: 'event_repeat',
      route: '/admin/rutinas'
    },
    {
      title: 'Gestionar Comidas',
      icon: 'restaurant',
      route: '/admin/comidas'
    },
    {
      title: 'Gestionar Etiquetas',
      icon: 'label',
      route: '/admin/etiquetas'
    }
  ];

  recentActivities: ActivityItem[] = [
    {
      type: 'plan',
      title: 'Nuevo Plan Creado',
      description: 'Plan Pérdida Peso - 7 días',
      time: 'Ahora mismo',
      icon: 'menu_book'
    },
    {
      type: 'meal',
      title: 'Nueva Comida Añadida',
      description: 'Ensalada de pollo',
      time: 'Hace 2h',
      icon: 'restaurant'
    },
    {
      type: 'ingredient',
      title: 'Ingrediente Actualizado',
      description: 'Pollo',
      time: 'Hace 1d',
      icon: 'inventory_2'
    },
    {
      type: 'exercise',
      title: 'Nuevo Ejercicio Añadido',
      description: 'Sentadillas',
      time: 'Hace 2d',
      icon: 'fitness_center'
    }
  ];

  ngOnInit(): void {
    // Aquí se puede agregar lógica para cargar datos desde servicios
    console.log('Dashboard Admin inicializado');
  }
}
