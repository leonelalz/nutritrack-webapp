import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// MODELOS REALES (ajusta los paths según tu proyecto)
import {
  Comida,
  InformacionNutricional,
} from '../../../core/models/comida.model';

import {
  Ejercicio,
} from '../../../core/models/ejercicio.model';



import {
  HistorialMedidasResponse,
  PerfilSaludResponse,
} from '../../../core/models/perfil.model';

import {
  ObjetivoNutricional,
} from '../../../core/models/plan.model';

// ====== INTERFACES AUXILIARES PARA EL DASHBOARD ======

interface MetaDiaResumen {
  id: number;
  nombre: string;
  actual: number;
  objetivo: number;
  unidad: string;
}

interface DashboardHoyResponse {
  perfil: PerfilSaludResponse;
  ultimaMedicion: HistorialMedidasResponse | null;
  comidas: Comida[];
  ejercicios: Ejercicio[];
  objetivoNutricional?: ObjetivoNutricional | null;
  metasDia: MetaDiaResumen[];
}

interface DashboardSemanalResponse {
  promedioCalorias: number;
  promedioProteinas: number;
  promedioCarbohidratos: number;
  promedioGrasas: number;
  rachaActivaDias: number;
  entrenamientosSemana: number;
  caloriasQuemadasSemana: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <!-- Calorías Hoy -->
        <div class="stat-card green-border">
          <div class="stat-header">
            <span class="stat-title">Calorías Hoy</span>
            <div class="stat-icon green">🔥</div>
          </div>
          <div class="stat-value">
            {{ caloriasHoy() | number:'1.0-0' }}
          </div>
          <div class="stat-footer">
            <span
              class="stat-change"
              [class.positive]="caloriasRestantes() >= 0"
              [class.negative]="caloriasRestantes() < 0"
            >
              {{
                caloriasObjetivo()
                  ? (caloriasPorcentaje() | number:'1.0-0') + '%'
                  : '--'
              }}
            </span>
            <span class="stat-subtitle">
              {{
                caloriasObjetivo()
                  ? (caloriasRestantes() >= 0
                      ? (caloriasRestantes() | number:'1.0-0') + ' cal restantes'
                      : ((caloriasRestantes() * -1) | number:'1.0-0') + ' cal por encima'
                    )
                  : 'sin objetivo configurado'
              }}
            </span>
          </div>
        </div>

        <!-- Metas Completadas -->
        <div class="stat-card yellow-border">
          <div class="stat-header">
            <span class="stat-title">Metas Completadas</span>
            <div class="stat-icon yellow">🎯</div>
          </div>
          <div class="stat-value">
            {{ metasCompletadasLabel() }}
          </div>
          <div class="stat-footer">
            <span class="stat-change positive">
              ↗ {{ metasProgresoPorcentaje() | number:'1.0-0' }}%
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
            {{ entrenamientosHoy() }}
          </div>
          <div class="stat-footer">
            <span class="stat-change positive">
              ↗ {{ caloriasQuemadasHoy() | number:'1.0-0' }}
            </span>
            <span class="stat-subtitle">calorías quemadas</span>
          </div>
        </div>

        <!-- Racha Activa -->
        <div class="stat-card purple-border">
          <div class="stat-header">
            <span class="stat-title">Racha Activa</span>
            <div class="stat-icon purple">🔥</div>
          </div>
          <div class="stat-value">
            {{ rachaActivaDias() }}
          </div>
          <div class="stat-footer">
            <span class="stat-change positive">
              ↗ {{ rachaActivaDias() > 0 ? '+1' : '0' }}
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
              <button class="tab-btn active">Nutrición</button>
              <button class="tab-btn">Ejercicio</button>
              <button class="tab-btn">Metas</button>
            </div>
          </div>
          <div class="chart-placeholder">
            <span class="chart-icon">📊</span>
            <h3>Análisis Nutricional Semanal</h3>
            <p *ngIf="dashboardSemana() as semana">
              Promedio diario:
              {{ semana.promedioCalorias | number:'1.0-0' }} cal |
              Proteínas:
              {{ semana.promedioProteinas | number:'1.0-0' }} g |
              Carbohidratos:
              {{ semana.promedioCarbohidratos | number:'1.0-0' }} g |
              Grasas:
              {{ semana.promedioGrasas | number:'1.0-0' }} g
            </p>
            <p *ngIf="!dashboardSemana()">
              Aún no hay datos suficientes para el análisis semanal.
            </p>
          </div>
        </div>

        <!-- Two Column Layout -->
        <div class="two-column-section">
          <!-- Daily Goals -->
          <div class="goals-card">
            <h2>Metas de Hoy</h2>

            <div class="progress-circle">
              <div class="circle-container">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" class="circle-bg" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    class="circle-progress"
                    [style.strokeDashoffset]="
                      251.2 * (1 - metasProgresoPorcentaje() / 100)
                    "
                  />
                </svg>
                <div class="circle-text">
                  <div class="circle-percent">
                    {{ metasProgresoPorcentaje() | number:'1.0-0' }}%
                  </div>
                  <div class="circle-label">completado</div>
                </div>
              </div>
            </div>

            <div class="goals-list">
              <div
                class="goal-item"
                *ngFor="let meta of metasDia()"
              >
                <div class="goal-info">
                  <div class="goal-name">{{ meta.nombre }}</div>
                  <div class="goal-progress">
                    {{ meta.actual | number:'1.0-1' }}/{{ meta.objetivo | number:'1.0-1' }}
                    {{ meta.unidad }}
                  </div>
                </div>
                <div
                  class="goal-badge"
                  [class.completed]="(meta.actual / meta.objetivo) >= 1"
                  [class.progress]="(meta.actual / meta.objetivo) < 1"
                >
                  {{
                    (meta.actual / meta.objetivo) >= 1
                      ? '✓'
                      : (meta.actual / meta.objetivo * 100) | number:'1.0-0'
                  }}
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="activity-card">
            <h2>Actividad Reciente</h2>

            <div class="activity-list">
              <div
                class="activity-item"
                *ngFor="let item of actividadReciente()"
              >
                <div class="activity-icon" [ngClass]="item.color">
                  {{ item.icono }}
                </div>
                <div class="activity-info">
                  <div class="activity-name">{{ item.titulo }}</div>
                  <div class="activity-time">{{ item.subtitulo }}</div>
                </div>
                <div class="activity-value">{{ item.valor }}</div>
              </div>
            </div>
          </div>

          <!-- Exercise Summary -->
          <div class="exercise-card">
            <div class="exercise-header">
              <h2>Resumen de Ejercicios</h2>
              <a href="#" class="view-all">Ver todos</a>
            </div>

            <div class="exercise-grid" *ngIf="dashboardSemana() as semana">
              <div class="exercise-stat">
                <div class="exercise-value">
                  {{ semana.entrenamientosSemana }}
                </div>
                <div class="exercise-label">ESTA SEMANA</div>
              </div>
              <div class="exercise-stat">
                <div class="exercise-value">
                  {{ entrenamientosHoy() }}
                </div>
                <div class="exercise-label">HOY</div>
              </div>
              <div class="exercise-stat">
                <div class="exercise-value">
                  {{ semana.caloriasQuemadasSemana | number:'1.0-0' }}
                </div>
                <div class="exercise-label">CAL SEMANA</div>
              </div>
              <div class="exercise-stat">
                <div class="exercise-value">
                  {{ caloriasQuemadasHoy() | number:'1.0-0' }}
                </div>
                <div class="exercise-label">CAL HOY</div>
              </div>
            </div>

            <div class="exercise-icon-box">
              <div class="exercise-icon">💪</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 30px;
      min-height: 100vh;
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

    .stat-card.green-border { border-top: solid 5px #24B86F; }
    .stat-card.yellow-border { border-top: solid 5px #FEA00D; }
    .stat-card.red-border { border-top: solid 5px #E23A69; }
    .stat-card.purple-border { border-top: solid 5px #385EE0; }

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

    .stat-icon.green { background: #E8F5E8; }
    .stat-icon.yellow { background: #FFF3CD; }
    .stat-icon.red { background: #F8D7DA; }
    .stat-icon.purple { background: #E2E3F1; }

    .stat-value {
      color: #333333;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .stat-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .stat-change {
      font-size: 12px;
    }
    .stat-change.positive { color: #28A745; }
    .stat-change.negative { color: #E23A69; }

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

    .chart-placeholder {
      background: linear-gradient(155deg, #F8F9FA 0%, #E9ECEF 100%);
      border-radius: 12px;
      height: 320px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 10px;
      padding: 0 16px;
    }

    .chart-icon {
      font-size: 48px;
      opacity: 0.5;
    }

    .chart-placeholder h3 {
      color: #6C757D;
      font-size: 14px;
      font-weight: 700;
      margin: 0;
    }

    .chart-placeholder p {
      color: #6C757D;
      font-size: 12px;
      margin: 0;
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
      width: 120px;
      height: 120px;
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

    .goal-item:last-child { border-bottom: none; }

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
      width: 28px;
      height: 28px;
      border-radius: 14px;
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
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #F1F3F4;
    }

    .activity-item:last-child { border-bottom: none; }

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

    .activity-icon.green { background: #E8F5E8; }
    .activity-icon.red { background: #F8D7DA; }
    .activity-icon.yellow { background: #FFF3CD; }
    .activity-icon.blue { background: #D1ECF1; }

    .activity-info { flex: 1; }

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

    .view-all:hover { text-decoration: underline; }

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
      .dashboard-container { padding: 16px; }
      .stats-grid { flex-direction: column; }
      .two-column-section { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  // ======= STATE PRINCIPAL =======
  dashboardHoy = signal<DashboardHoyResponse | null>(null);
  dashboardSemana = signal<DashboardSemanalResponse | null>(null);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);

  // ======= DATOS DERIVADOS CON SIGNALS / COMPUTED =======

  comidasHoy = computed<Comida[]>(() =>
    this.dashboardHoy()?.comidas ?? []
  );

  ejerciciosHoy = computed<Ejercicio[]>(() =>
    this.dashboardHoy()?.ejercicios ?? []
  );

  objetivo = computed<ObjetivoNutricional | null>(() =>
    this.dashboardHoy()?.objetivoNutricional ?? null
  );

  metasDia = signal<MetaDiaResumen[]>([]);

  // Nutrientes totales del día
  totalNutricionHoy = computed<InformacionNutricional | null>(() => {
    const comidas = this.comidasHoy();
    if (!comidas.length) {
      return null;
    }
    return comidas.reduce<InformacionNutricional>(
      (acc, comida) => {
        const n = comida.nutricionTotal;
        acc.proteinasTotales += n.proteinasTotales;
        acc.carbohidratosTotales += n.carbohidratosTotales;
        acc.grasasTotales += n.grasasTotales;
        acc.energiaTotal += n.energiaTotal;
        acc.fibraTotal += n.fibraTotal;
        acc.pesoTotal += n.pesoTotal;
        return acc;
      },
      {
        proteinasTotales: 0,
        carbohidratosTotales: 0,
        grasasTotales: 0,
        energiaTotal: 0,
        fibraTotal: 0,
        pesoTotal: 0,
      }
    );
  });

  // Calorías de hoy
  caloriasHoy = computed<number>(() =>
    this.totalNutricionHoy()?.energiaTotal ?? 0
  );

  caloriasObjetivo = computed<number | null>(() =>
    this.objetivo()?.caloriasObjetivo ?? null
  );

  caloriasRestantes = computed<number>(() => {
    const objetivo = this.caloriasObjetivo();
    if (!objetivo) return 0;
    return objetivo - this.caloriasHoy();
  });

  caloriasPorcentaje = computed<number>(() => {
    const objetivo = this.caloriasObjetivo();
    if (!objetivo || objetivo <= 0) return 0;
    return Math.min(200, (this.caloriasHoy() / objetivo) * 100);
  });

  // Metas del día
  metasProgresoPorcentaje = computed<number>(() => {
    const metas = this.metasDia();
    if (!metas.length) return 0;
    let sum = 0;
    metas.forEach((m) => {
      if (!m.objetivo || m.objetivo <= 0) return;
      sum += Math.min(1, m.actual / m.objetivo);
    });
    return (sum / metas.length) * 100;
  });

  metasCompletadasLabel = computed<string>(() => {
    const metas = this.metasDia();
    if (!metas.length) return '0/0';
    const completadas = metas.filter(
      (m) => m.objetivo > 0 && m.actual >= m.objetivo
    ).length;
    return `${completadas}/${metas.length}`;
  });

  // Entrenamientos
  entrenamientosHoy = computed<number>(() =>
    this.ejerciciosHoy().length
  );

  caloriasQuemadasHoy = computed<number>(() => {
    return this.ejerciciosHoy().reduce((acc, e) => {
      if (e.caloriasQuemadasPorMinuto && e.duracionEstimadaMinutos) {
        return (
          acc +
          e.caloriasQuemadasPorMinuto * e.duracionEstimadaMinutos
        );
      }
      return acc;
    }, 0);
  });

  rachaActivaDias = computed<number>(() =>
    this.dashboardSemana()?.rachaActivaDias ?? 0
  );

  // Actividad reciente (comidas + ejercicios)
  actividadReciente = computed(() => {
    const items: {
      icono: string;
      color: 'green' | 'red' | 'yellow' | 'blue';
      titulo: string;
      subtitulo: string;
      valor: string;
    }[] = [];

    // Últimas comidas
    this.comidasHoy()
      .slice(-2)
      .reverse()
      .forEach((c) => {
        items.push({
          icono: '🥗',
          color: 'green',
          titulo: `${c.nombre}`,
          subtitulo: 'Comida registrada hoy',
          valor: `${c.nutricionTotal.energiaTotal.toFixed(0)} cal`,
        });
      });

    // Últimos ejercicios
    this.ejerciciosHoy()
      .slice(-2)
      .reverse()
      .forEach((e) => {
        items.push({
          icono: '🏃‍♂️',
          color: 'red',
          titulo: e.nombre,
          subtitulo: 'Ejercicio de hoy',
          valor: e.duracionEstimadaMinutos
            ? `${e.duracionEstimadaMinutos} min`
            : '—',
        });
      });

    // Ordenamos por “reciente” aproximado (simplemente ya están en orden)
    return items.slice(0, 4);
  });

  // =============== CICLO DE VIDA ===============

  ngOnInit(): void {
    this.cargarDashboard();
  }

  private cargarDashboard(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    // Ajusta estas URLs a tus endpoints reales
    const hoy$ = this.http.get<DashboardHoyResponse>(
      '/api/v1/usuario/dashboard/hoy'
    );
    const semana$ = this.http.get<DashboardSemanalResponse>(
      '/api/v1/usuario/dashboard/semanal'
    );

    hoy$.subscribe({
      next: (data) => {
        this.dashboardHoy.set(data);
        this.metasDia.set(data.metasDia ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando dashboard hoy', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });

    semana$.subscribe({
      next: (data) => {
        this.dashboardSemana.set(data);
      },
      error: (err) => {
        console.error('Error cargando resumen semanal', err);
      },
    });
  }
}
