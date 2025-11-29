import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import 'chart.js/auto';

import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardData, WeeklyTab } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  template: `
    <div class="dashboard-container">
      <!-- Loading -->
      <ng-container *ngIf="loading(); else loaded">
        <p class="loading-text">Cargando tu resumen...</p>
      </ng-container>

      <ng-template #loaded>
        <!-- Error -->
        <ng-container *ngIf="error() as err">
          <div class="error-message">{{ err }}</div>
        </ng-container>

        <!-- Contenido principal (solo si hay datos y no hay error) -->
        <ng-container *ngIf="!error() && data() as d">
          <!-- Stats Cards -->
          <div class="stats-grid">
            <!-- Calorías hoy -->
            <div class="stat-card green-border">
              <div class="stat-header">
                <span class="stat-title">Calorías Hoy</span>
                <div class="stat-icon green">🔥</div>
              </div>
              <div class="stat-value">
                {{ d.summary.caloriesToday | number:'1.0-0' }}
              </div>
              <div class="stat-footer">
                <span
                  class="stat-change"
                  [ngClass]="d.summary.caloriesToday <= d.summary.caloriesTarget ? 'positive' : 'negative'"
                >
                  {{ d.summary.caloriesProgressPercent | number:'1.0-1' }}%
                </span>
                <span class="stat-subtitle">
                  {{ d.summary.caloriesRemaining | number:'1.0-0' }} cal restantes
                </span>
              </div>
            </div>

            <!-- Metas completadas -->
            <div class="stat-card yellow-border">
              <div class="stat-header">
                <span class="stat-title">Metas Completadas</span>
                <div class="stat-icon yellow">🎯</div>
              </div>
              <div class="stat-value">
                {{ d.summary.mealsCompletedToday }}/{{ d.summary.mealsPlannedToday }}
              </div>
              <div class="stat-footer">
                <span class="stat-change positive">
                  {{
                    (d.summary.mealsPlannedToday
                      ? (d.summary.mealsCompletedToday / d.summary.mealsPlannedToday) * 100
                      : 0
                    ) | number:'1.0-0'
                  }}%
                </span>
                <span class="stat-subtitle">progreso hoy</span>
              </div>
            </div>

            <!-- Entrenamientos -->
            <div class="stat-card red-border">
              <div class="stat-header">
                <span class="stat-title">Entrenamientos</span>
                <div class="stat-icon red">🏃‍♂️</div>
              </div>
              <div class="stat-value">
                {{ d.summary.workoutsCompletedToday }}
              </div>
              <div class="stat-footer">
                <span class="stat-change positive">
                  {{ d.summary.workoutsCaloriesToday | number:'1.0-0' }}
                </span>
                <span class="stat-subtitle">calorías quemadas</span>
              </div>
            </div>

            <!-- Racha activa -->
            <div class="stat-card purple-border">
              <div class="stat-header">
                <span class="stat-title">Racha Activa</span>
                <div class="stat-icon purple">🔥</div>
              </div>
              <div class="stat-value">
                {{ d.summary.activeStreakDays }}
              </div>
              <div class="stat-footer">
                <span class="stat-change positive">
                  +{{ d.summary.activeStreakDays > 0 ? 1 : 0 }}
                </span>
                <span class="stat-subtitle">días consecutivos</span>
              </div>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="content-section">
            <!-- Weekly Analysis Chart -->
            <div class="chart-card">
              <div class="chart-header">
                <h2>Análisis Semanal</h2>
                <div class="chart-tabs">
                  <button
                    class="tab-btn"
                    [class.active]="activeTab() === 'nutrition'"
                    (click)="setTab('nutrition')">
                    Nutrición
                  </button>
                  <button
                    class="tab-btn"
                    [class.active]="activeTab() === 'exercise'"
                    (click)="setTab('exercise')">
                    Ejercicio
                  </button>
                  <button
                    class="tab-btn"
                    [class.active]="activeTab() === 'goals'"
                    (click)="setTab('goals')">
                    Metas
                  </button>
                </div>
              </div>

              <div class="chart-body">
                <!-- Nutrición -->
                <div *ngIf="activeTab() === 'nutrition' && nutritionChartData()">
                  <div class="chart-wrapper">
                    <canvas
                      baseChart
                      [data]="nutritionChartData()!"
                      [options]="chartOptions"
                      [type]="'bar'">
                    </canvas>
                  </div>
                  <div class="chart-summary">
                    Promedio diario:
                    {{ d.weekly.nutrition.averageCalories | number:'1.0-0' }} cal
                  </div>
                </div>

                <!-- Ejercicio -->
                <div *ngIf="activeTab() === 'exercise' && exerciseChartData()">
                  <div class="chart-wrapper">
                    <canvas
                      baseChart
                      [data]="exerciseChartData()!"
                      [options]="chartOptions"
                      [type]="'bar'">
                    </canvas>
                  </div>
                </div>

                <!-- Metas (peso) -->
                <div *ngIf="activeTab() === 'goals' && goalsChartData()">
                  <div class="chart-wrapper">
                    <canvas
                      baseChart
                      [data]="goalsChartData()!"
                      [options]="chartOptions"
                      [type]="'line'">
                    </canvas>
                  </div>
                  <div class="chart-summary" *ngIf="d.weekly.goals.weight.length === 0">
                    Aún no tienes mediciones suficientes para mostrar el gráfico.
                  </div>
                </div>
              </div>
            </div>

            <!-- Two Column Layout (ahora conectado al backend) -->
            <div class="two-column-section">
              <!-- Daily Goals -->
              <div class="goals-card" *ngIf="d.dailyGoals && d.dailyGoals.length">
                <h2>Metas de Hoy</h2>
                
                <div class="progress-circle">
                  <div class="circle-container">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" class="circle-bg"></circle>
                      <circle
                        cx="50" cy="50" r="40"
                        class="circle-progress"
                        [style.strokeDashoffset]="251.2 - (251.2 * d.dailyGoalsCompletionPercent / 100)">
                      </circle>
                    </svg>
                    <div class="circle-text">
                      <div class="circle-percent">
                        {{ d.dailyGoalsCompletionPercent | number:'1.0-0' }}%
                      </div>
                      <div class="circle-label">completado</div>
                    </div>
                  </div>
                </div>

                <div class="goals-list">
                  <div class="goal-item" *ngFor="let goal of d.dailyGoals">
                    <div class="goal-info">
                      <div class="goal-name">{{ goal.name }}</div>
                      <div class="goal-progress">
                        {{ goal.current }}/{{ goal.target }} {{ goal.unit }}
                      </div>
                    </div>
                    <div
                      class="goal-badge"
                      [ngClass]="goal.completed ? 'completed' : 'progress'">
                      {{
                        goal.completed
                          ? '✓'
                          : (goal.target
                              ? ((goal.current / goal.target * 100) | number:'1.0-0')
                              : 0
                        )
                      }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="activity-card" *ngIf="d.recentActivity && d.recentActivity.length">
                <h2>Actividad Reciente</h2>
                
                <div class="activity-list">
                  <div class="activity-item" *ngFor="let a of d.recentActivity">
                    <div class="activity-icon" [ngClass]="a.color">
                      {{ a.icon }}
                    </div>
                    <div class="activity-info">
                      <div class="activity-name">{{ a.title }}</div>
                      <div class="activity-time">{{ a.timeAgo }}</div>
                    </div>
                    <div class="activity-value">{{ a.value }}</div>
                  </div>
                </div>
              </div>

              <!-- Exercise Summary -->
              <div class="exercise-card" *ngIf="d.exerciseSummary">
                <div class="exercise-header">
                  <h2>Resumen de Ejercicios</h2>
                  <!-- Cambia la ruta si tienes una propia -->
                  <a routerLink="/usuario/ejercicios" class="view-all">Ver todos</a>
                </div>

                <div class="exercise-grid">
                  <div class="exercise-stat">
                    <div class="exercise-value">
                      {{ d.exerciseSummary.workoutsThisMonth }}
                    </div>
                    <div class="exercise-label">ESTE MES</div>
                  </div>
                  <div class="exercise-stat">
                    <div class="exercise-value">
                      {{ d.exerciseSummary.totalHours | number:'1.0-1' }}h
                    </div>
                    <div class="exercise-label">TIEMPO TOTAL</div>
                  </div>
                  <div class="exercise-stat">
                    <div class="exercise-value">
                      {{ d.exerciseSummary.caloriesBurned | number:'1.0-0' }}
                    </div>
                    <div class="exercise-label">CAL QUEMADAS</div>
                  </div>
                  <div class="exercise-stat">
                    <div class="exercise-value">
                      {{ d.exerciseSummary.workoutsThisWeek }}
                    </div>
                    <div class="exercise-label">ESTA SEMANA</div>
                  </div>
                </div>

                <div class="exercise-icon-box">
                  <div class="exercise-icon">💪</div>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </ng-template>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 30px;
      min-height: 100vh;
    }

    .loading-text {
      color: #6C757D;
      font-size: 14px;
    }

    .error-message {
      background: #F8D7DA;
      border-radius: 8px;
      padding: 12px 16px;
      color: #721C24;
      font-size: 13px;
      margin-bottom: 16px;
    }

    /* Stats Grid */
    .stats-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      flex: 1 1 260px;
      max-width: 100%;
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      overflow: hidden;
    }

    .stat-card.green-border {
      border-top: solid 5px #24B86F;
    }

    .stat-card.yellow-border {
      border-top: solid 5px #FEA00D;
    }
    
    .stat-card.red-border {
      border-top: solid 5px #E23A69;
    }

    .stat-card.purple-border {
      border-top: solid 5px #385EE0;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .stat-title {
      color: #6C757D;
      font-size: 14px;
      font-weight: 500;
    }

    .stat-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .stat-icon.green {
      background: #E8F5E8;
    }

    .stat-icon.yellow {
      background: #FFF3CD;
    }

    .stat-icon.red {
      background: #F8D7DA;
    }

    .stat-icon.purple {
      background: #E2E3F1;
    }

    .stat-value {
      color: #333333;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .stat-footer {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .stat-change {
      font-size: 12px;
    }

    .stat-change.positive {
      color: #28A745;
    }

    .stat-change.negative {
      color: #E23A69;
    }

    .stat-subtitle {
      color: #6C757D;
      font-size: 12px;
    }

    /* Content Section */
    .content-section {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    /* Chart Card */
    .chart-card {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .chart-header h2 {
      color: #333333;
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }

    .chart-tabs {
      display: flex;
      gap: 2px;
      background: #F8F9FA;
      border-radius: 8px;
      padding: 2px;
    }

    .tab-btn {
      padding: 8px 16px;
      border: none;
      background: transparent;
      border-radius: 6px;
      color: #6C757D;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tab-btn.active {
      background: white;
      color: #28A745;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
    }

    .chart-body {
      min-height: 260px;
    }

    .chart-wrapper {
      width: 100%;
      height: 260px;
    }

    .chart-wrapper canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .chart-summary {
      margin-top: 12px;
      font-size: 12px;
      color: #6C757D;
      text-align: center;
    }

    /* Two Column Section */
    .two-column-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    /* Goals Card */
    .goals-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
    }

    .goals-card h2 {
      color: #333333;
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 20px 0;
    }

    .progress-circle {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .circle-container {
      position: relative;
      width: 100px;
      height: 100px;
    }

    .circle-container svg {
      transform: rotate(-90deg);
      width: 100%;
      height: 100%;
    }

    .circle-bg {
      fill: none;
      stroke: #F1F3F4;
      stroke-width: 20;
    }

    .circle-progress {
      fill: none;
      stroke: #16A34A;
      stroke-width: 20;
      stroke-dasharray: 251.2;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.5s ease;
    }

    .circle-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .circle-percent {
      color: #28A745;
      font-size: 18px;
      font-weight: 700;
    }

    .circle-label {
      color: #6C757D;
      font-size: 10px;
    }

    .goals-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .goal-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #F1F3F4;
    }

    .goal-item:last-child {
      border-bottom: none;
    }

    .goal-name {
      color: #333333;
      font-size: 13px;
      font-weight: 700;
    }

    .goal-progress {
      color: #6C757D;
      font-size: 10px;
      margin-top: 2px;
    }

    .goal-badge {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
    }

    .goal-badge.completed {
      background: #28A745;
      color: white;
    }

    .goal-badge.progress {
      background: #FFC107;
      color: white;
    }

    /* Activity Card */
    .activity-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
    }

    .activity-card h2 {
      color: #333333;
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 20px 0;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #F1F3F4;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .activity-icon.green {
      background: #E8F5E8;
    }

    .activity-icon.red {
      background: #F8D7DA;
    }

    .activity-icon.yellow {
      background: #FFF3CD;
    }

    .activity-icon.blue {
      background: #D1ECF1;
    }

    .activity-info {
      flex: 1;
    }

    .activity-name {
      color: #333333;
      font-size: 13px;
      font-weight: 700;
    }

    .activity-time {
      color: #6C757D;
      font-size: 11px;
      margin-top: 2px;
    }

    .activity-value {
      color: #28A745;
      font-size: 12px;
      font-weight: 700;
    }

    /* Exercise Card */
    .exercise-card {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      max-width: 550px;
    }

    .exercise-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .exercise-header h2 {
      color: #333333;
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }

    .view-all {
      color: #28A745;
      font-size: 12px;
      text-decoration: none;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .exercise-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }

    .exercise-stat {
      background: #F8F9FA;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }

    .exercise-value {
      color: #333333;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .exercise-label {
      color: #6C757D;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .exercise-icon-box {
      background: #F8F9FA;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      align-items: center;
    }

    .exercise-icon {
      width: 32px;
      height: 32px;
      background: #D1ECF1;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        flex-direction: column;
      }

      .two-column-section {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  loading = signal(true);
  error = signal<string | null>(null);

  data = signal<DashboardData | null>(null);
  activeTab = signal<WeeklyTab>('nutrition');

  nutritionChartData = signal<ChartConfiguration['data'] | null>(null);
  exerciseChartData = signal<ChartConfiguration['data'] | null>(null);
  goalsChartData = signal<ChartConfiguration['data'] | null>(null);

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.data.set(data);
        this.buildCharts(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el dashboard. Inténtalo más tarde.');
        this.loading.set(false);
      }
    });
  }

  setTab(tab: WeeklyTab): void {
    this.activeTab.set(tab);
  }

  private buildCharts(data: DashboardData): void {
    const n = data.weekly.nutrition;
    this.nutritionChartData.set({
      labels: n.labels,
      datasets: [
        { label: 'Calorías consumidas', data: n.calories },
        { label: 'Objetivo calórico', data: n.targetCalories }
      ]
    });

    const e = data.weekly.exercise;
    this.exerciseChartData.set({
      labels: e.labels,
      datasets: [
        { label: 'Calorías quemadas', data: e.caloriesBurned }
      ]
    });

    const g = data.weekly.goals;
    this.goalsChartData.set({
      labels: g.labels,
      datasets: [
        { label: `Peso (${g.unit})`, data: g.weight }
      ]
    });
  }
}
