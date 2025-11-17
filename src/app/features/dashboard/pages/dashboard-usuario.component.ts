import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card green-border">
          <div class="stat-header">
            <span class="stat-title">Calorías Hoy</span>
            <div class="stat-icon green">🔥</div>
          </div>
          <div class="stat-value">1,847</div>
          <div class="stat-footer">
            <span class="stat-change positive">↗ 5.2%</span>
            <span class="stat-subtitle">353 cal restantes</span>
          </div>
        </div>

        <div class="stat-card yellow-border">
          <div class="stat-header">
            <span class="stat-title">Metas Completadas</span>
            <div class="stat-icon yellow">🎯</div>
          </div>
          <div class="stat-value">4/6</div>
          <div class="stat-footer">
            <span class="stat-change positive">↗ 67%</span>
            <span class="stat-subtitle">progreso hoy</span>
          </div>
        </div>

        <div class="stat-card red-border">
          <div class="stat-header">
            <span class="stat-title">Entrenamientos</span>
            <div class="stat-icon red">🏃‍♂️</div>
          </div>
          <div class="stat-value">2</div>
          <div class="stat-footer">
            <span class="stat-change positive">↗ 605</span>
            <span class="stat-subtitle">calorías quemadas</span>
          </div>
        </div>

        <div class="stat-card purple-border">
          <div class="stat-header">
            <span class="stat-title">Racha Activa</span>
            <div class="stat-icon purple">🔥</div>
          </div>
          <div class="stat-value">15</div>
          <div class="stat-footer">
            <span class="stat-change positive">↗ +1</span>
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
            <p>Promedio diario: 2,100 cal | Proteínas: 95g | Carbohidratos: 245g | Grasas: 78g</p>
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
                  <circle cx="50" cy="50" r="40" class="circle-bg"/>
                  <circle cx="50" cy="50" r="40" class="circle-progress" 
                          [style.strokeDashoffset]="100 - 67"/>
                </svg>
                <div class="circle-text">
                  <div class="circle-percent">67%</div>
                  <div class="circle-label">completado</div>
                </div>
              </div>
            </div>

            <div class="goals-list">
              <div class="goal-item">
                <div class="goal-info">
                  <div class="goal-name">5 porciones vegetales</div>
                  <div class="goal-progress">5/5 completado</div>
                </div>
                <div class="goal-badge completed">✓</div>
              </div>

              <div class="goal-item">
                <div class="goal-info">
                  <div class="goal-name">2.5L de agua</div>
                  <div class="goal-progress">2.5/2.5L</div>
                </div>
                <div class="goal-badge completed">✓</div>
              </div>

              <div class="goal-item">
                <div class="goal-info">
                  <div class="goal-name">10,000 pasos</div>
                  <div class="goal-progress">7,200/10,000</div>
                </div>
                <div class="goal-badge progress">72</div>
              </div>

              <div class="goal-item">
                <div class="goal-info">
                  <div class="goal-name">3 frutas al día</div>
                  <div class="goal-progress">2/3 frutas</div>
                </div>
                <div class="goal-badge progress">67</div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="activity-card">
            <h2>Actividad Reciente</h2>
            
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon green">🥗</div>
                <div class="activity-info">
                  <div class="activity-name">Almuerzo registrado</div>
                  <div class="activity-time">Hace 30 min</div>
                </div>
                <div class="activity-value">650 cal</div>
              </div>

              <div class="activity-item">
                <div class="activity-icon red">🏃‍♂️</div>
                <div class="activity-info">
                  <div class="activity-name">Correr completado</div>
                  <div class="activity-time">Hace 1 hora</div>
                </div>
                <div class="activity-value">30 min</div>
              </div>

              <div class="activity-item">
                <div class="activity-icon yellow">🎯</div>
                <div class="activity-info">
                  <div class="activity-name">Meta completada</div>
                  <div class="activity-time">Hace 2 horas</div>
                </div>
                <div class="activity-value">5/5</div>
              </div>

              <div class="activity-item">
                <div class="activity-icon blue">💧</div>
                <div class="activity-info">
                  <div class="activity-name">Hidratación actualizada</div>
                  <div class="activity-time">Hace 3 horas</div>
                </div>
                <div class="activity-value">+500ml</div>
              </div>
            </div>
          </div>

          <!-- Exercise Summary -->
          <div class="exercise-card">
            <div class="exercise-header">
              <h2>Resumen de Ejercicios</h2>
              <a href="#" class="view-all">Ver todos</a>
            </div>

            <div class="exercise-grid">
              <div class="exercise-stat">
                <div class="exercise-value">24</div>
                <div class="exercise-label">ESTE MES</div>
              </div>
              <div class="exercise-stat">
                <div class="exercise-value">18.5h</div>
                <div class="exercise-label">TIEMPO TOTAL</div>
              </div>
              <div class="exercise-stat">
                <div class="exercise-value">3,240</div>
                <div class="exercise-label">CAL QUEMADAS</div>
              </div>
              <div class="exercise-stat">
                <div class="exercise-value">4</div>
                <div class="exercise-label">ESTA SEMANA</div>
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

    /* Welcome Card */
    .welcome-card {
      background: white;
      border-radius: 16px;
      padding: 25px 30px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .welcome-content h1 {
      color: #333333;
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 5px 0;
    }

    .welcome-content p {
      color: #6C757D;
      font-size: 14px;
      margin: 0;
    }

    .welcome-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .quick-buttons {
      display: flex;
      gap: 10px;
    }

    .quick-btn {
      background: linear-gradient(159deg, #28A745 0%, #20C997 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .quick-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #28A745 0%, #20C997 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      font-weight: 700;
    }

    .user-name {
      color: #333333;
      font-size: 14px;
      font-weight: 700;
    }

    .user-plan {
      color: #6C757D;
      font-size: 12px;
    }

    /* Stats Grid */
    .stats-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      flex: 1 1 260px;       /* min = 260px, grow = 1 */
      max-width: 100%;       /* evita overflow */
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
    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .welcome-card {
        flex-direction: column;
        gap: 20px;
        align-items: flex-start;
      }

      .welcome-actions {
        width: 100%;
        flex-direction: column;
        gap: 16px;
      }

      .quick-buttons {
        width: 100%;
        justify-content: space-between;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .two-column-section {
        grid-template-columns: 1fr;
      }

      .welcome-content h1 {
        font-size: 24px;
      }
    }
  `]
})
export class DashboardComponent {
  // Aquí puedes agregar lógica de datos cuando integres con tu backend
}