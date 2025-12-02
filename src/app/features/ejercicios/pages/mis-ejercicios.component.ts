import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MetasService } from '../../../core/services/metas.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';

// Constantes MET para cálculo de calorías por tipo de ejercicio
const MET_VALUES: { [key: string]: number } = {
  'FUERZA': 6.0,
  'CARDIO': 8.0,
  'HIIT': 10.0,
  'FLEXIBILIDAD': 2.5,
  'EQUILIBRIO': 3.0,
  'FUNCIONAL': 5.0,
  'DEFAULT': 5.0
};

@Component({
    selector: 'app-mis-ejercicios',
    standalone: true,
    imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatCheckboxModule, MatProgressBarModule, FormsModule],
    template: `
    <div class="mis-ejercicios-container">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">🔥</span>
            <span class="stat-label">Calorías Quemadas</span>
          </div>
          <div class="stat-value">{{ caloriasQuemadas() }}</div>
          <div class="stat-footer">
            <span class="stat-meta">Hoy</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">⏱️</span>
            <span class="stat-label">Tiempo Activo</span>
          </div>
          <div class="stat-value">{{ tiempoActivo() }} min</div>
          <div class="stat-footer">
            <span class="stat-meta">objetivo</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">✅</span>
            <span class="stat-label">Completados</span>
          </div>
          <div class="stat-value">{{ sesionesSemanales() }}/{{ ejerciciosProgramados().length }}</div>
          <div class="stat-footer">
            <span class="stat-meta">ejercicios hoy</span>
          </div>
        </div>
      </div>

      <!-- Ejercicios Programados -->
      <div class="content-card">
        <div class="card-header">
          <h2>🎯 Ejercicios Programados</h2>
          <p class="page-subtitle">{{ fechaHoy }}</p>
          @if (rutinaActiva()) {
            <span class="badge-success">{{ rutinaActiva().nombre }}</span>
          } @else {
            <a [routerLink]="['/metas/rutinas']" class="link-primary">Activar Rutina</a>
          }
        </div>
        <div class="card-content">
          @if (cargando()) {
            <div class="loading-state">
              <p>Cargando...</p>
            </div>
          } @else if (ejerciciosProgramados().length === 0) {
            <div class="empty-state">
              <span class="empty-icon">🏋️</span>
              <p>No tienes ejercicios programados</p>
              <button class="btn-secondary" [routerLink]="['/metas/rutinas']">Activar una Rutina</button>
            </div>
          } @else {
            <div class="exercises-list">
              @for (ejercicio of ejerciciosProgramados(); track ejercicio.id) {
                <div class="exercise-item" 
                     [class.completado]="ejercicio.completado"
                     (click)="abrirEntrenamiento(ejercicio)">
                  <div class="exercise-checkbox" (click)="$event.stopPropagation()">
                    <mat-checkbox 
                      [(ngModel)]="ejercicio.completado"
                      (change)="marcarEjercicioCompletado(ejercicio)"
                      color="primary">
                    </mat-checkbox>
                  </div>
                  <div class="exercise-info">
                    <h4>{{ ejercicio.ejercicioNombre }}</h4>
                    <div class="exercise-details">
                      @if (ejercicio.series) {
                        <span class="detail">🔁 {{ ejercicio.series }} series</span>
                      }
                      @if (ejercicio.repeticiones) {
                        <span class="detail">🔢 {{ ejercicio.repeticiones }} reps</span>
                      }
                      @if (ejercicio.peso) {
                        <span class="detail">⚖️ {{ ejercicio.peso }} kg</span>
                      }
                      @if (ejercicio.duracionMinutos) {
                        <span class="detail">⏱️ {{ ejercicio.duracionMinutos }} min</span>
                      }
                      @if (ejercicio.descansoSegundos) {
                        <span class="detail">🛑 {{ ejercicio.descansoSegundos }}s</span>
                      }
                    </div>
                    @if (ejercicio.notas) {
                      <p class="notas">{{ ejercicio.notas }}</p>
                    }
                  </div>
                  <div class="exercise-action">
                    <button class="btn-start" (click)="$event.stopPropagation(); abrirEntrenamiento(ejercicio)">
                      <mat-icon>play_arrow</mat-icon>
                      Iniciar
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Modal de Entrenamiento Interactivo -->
    @if (modalEntrenamiento()) {
      <div class="modal-overlay">
        <div class="modal-entrenamiento" (click)="$event.stopPropagation()">
          <!-- Header del Modal -->
          <div class="modal-header">
            <div class="header-info">
              <h2>{{ ejercicioActivo()?.ejercicioNombre }}</h2>
              <span class="badge-tipo">{{ ejercicioActivo()?.tipoEjercicio || 'Ejercicio' }}</span>
            </div>
            <button class="btn-close" (click)="cerrarModal()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- Progreso General -->
          <div class="progreso-general">
            <div class="progreso-bar">
              <div class="progreso-fill" [style.width.%]="progresoTotal()"></div>
            </div>
            <span class="progreso-texto">{{ serieActual() }} de {{ ejercicioActivo()?.series || 1 }} series</span>
          </div>

          <!-- Contenido Principal del Modal -->
          <div class="modal-body">
            <!-- Estado: EN EJERCICIO -->
            @if (estadoEntrenamiento() === 'ejercicio') {
              <div class="estado-ejercicio">
                <!-- Cronómetro Principal -->
                <div class="cronometro-container">
                  <div class="cronometro">
                    <span class="tiempo">{{ formatearTiempo(tiempoEjercicio()) }}</span>
                    <span class="label">Tiempo de ejercicio</span>
                  </div>
                </div>

                <!-- Info de la Serie Actual -->
                <div class="serie-info">
                  <div class="serie-card activa">
                    <span class="serie-numero">Serie {{ serieActual() }}</span>
                    <div class="serie-detalles">
                      @if (ejercicioActivo()?.repeticiones) {
                        <span class="meta">🎯 {{ ejercicioActivo()?.repeticiones }} repeticiones</span>
                      }
                      @if (ejercicioActivo()?.peso) {
                        <span class="meta">⚖️ {{ ejercicioActivo()?.peso }} kg</span>
                      }
                    </div>
                  </div>
                </div>

                <!-- Guía del Ejercicio -->
                <div class="guia-ejercicio">
                  <h4>📋 Guía de Ejecución</h4>
                  <div class="pasos">
                    @for (paso of obtenerPasosEjercicio(); track $index) {
                      <div class="paso" [class.activo]="$index === pasoActual()">
                        <span class="paso-numero">{{ $index + 1 }}</span>
                        <span class="paso-texto">{{ paso }}</span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Calorías Estimadas -->
                <div class="calorias-estimadas">
                  <div class="calorias-icon">🔥</div>
                  <div class="calorias-info">
                    <span class="calorias-valor">{{ caloriasEstimadas() }}</span>
                    <span class="calorias-label">kcal estimadas</span>
                  </div>
                </div>

                <!-- Botones de Control -->
                <div class="controles-ejercicio">
                  @if (ejercicioActivo()?.repeticiones) {
                    <button class="btn-completar-serie" (click)="completarSerie()">
                      <mat-icon>check_circle</mat-icon>
                      Completar Serie
                    </button>
                  } @else {
                    <!-- Para ejercicios de tiempo (cardio, plancha, etc) -->
                    <button class="btn-completar-serie" (click)="completarSerie()">
                      <mat-icon>timer</mat-icon>
                      Terminar
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Estado: DESCANSO -->
            @if (estadoEntrenamiento() === 'descanso') {
              <div class="estado-descanso">
                <div class="descanso-container">
                  <div class="descanso-icon">😮‍💨</div>
                  <h3>¡Descansa!</h3>
                  
                  <!-- Timer de Descanso -->
                  <div class="timer-descanso">
                    <svg class="timer-circle" viewBox="0 0 100 100">
                      <circle class="timer-bg" cx="50" cy="50" r="45"/>
                      <circle class="timer-progress" cx="50" cy="50" r="45"
                        [style.stroke-dashoffset]="calcularCircunferencia()"/>
                    </svg>
                    <div class="timer-texto">
                      <span class="tiempo-restante">{{ tiempoDescanso() }}</span>
                      <span class="label">segundos</span>
                    </div>
                  </div>

                  <p class="siguiente-serie">
                    @if (serieActual() < (ejercicioActivo()?.series || 1)) {
                      Próxima: Serie {{ serieActual() + 1 }} de {{ ejercicioActivo()?.series }}
                    } @else {
                      ¡Última serie completada!
                    }
                  </p>

                  <div class="controles-descanso">
                    <button class="btn-saltar" (click)="saltarDescanso()">
                      <mat-icon>skip_next</mat-icon>
                      Saltar descanso
                    </button>
                    <button class="btn-mas-tiempo" (click)="agregarTiempoDescanso()">
                      <mat-icon>add</mat-icon>
                      +30s
                    </button>
                  </div>
                </div>
              </div>
            }

            <!-- Estado: COMPLETADO -->
            @if (estadoEntrenamiento() === 'completado') {
              <div class="estado-completado">
                <div class="completado-container">
                  <div class="completado-icon">🎉</div>
                  <h3>¡Ejercicio Completado!</h3>
                  
                  <!-- Resumen del Entrenamiento -->
                  <div class="resumen-entrenamiento">
                    <div class="resumen-item">
                      <span class="resumen-icon">⏱️</span>
                      <div class="resumen-info">
                        <span class="resumen-valor">{{ formatearTiempo(tiempoTotalEjercicio()) }}</span>
                        <span class="resumen-label">Tiempo total</span>
                      </div>
                    </div>
                    <div class="resumen-item">
                      <span class="resumen-icon">🔁</span>
                      <div class="resumen-info">
                        <span class="resumen-valor">{{ seriesCompletadas() }}</span>
                        <span class="resumen-label">Series completadas</span>
                      </div>
                    </div>
                    <div class="resumen-item destacado">
                      <span class="resumen-icon">🔥</span>
                      <div class="resumen-info">
                        <span class="resumen-valor">{{ caloriasFinales() }}</span>
                        <span class="resumen-label">Calorías quemadas</span>
                      </div>
                    </div>
                  </div>

                  <!-- Opciones Post-Ejercicio -->
                  <div class="post-ejercicio">
                    <h4>Registrar datos reales (opcional)</h4>
                    <div class="input-group">
                      <label>Series realizadas</label>
                      <input type="number" [(ngModel)]="seriesReales" [max]="ejercicioActivo()?.series" min="1">
                    </div>
                    @if (ejercicioActivo()?.repeticiones) {
                      <div class="input-group">
                        <label>Repeticiones por serie</label>
                        <input type="number" [(ngModel)]="repsReales" min="1">
                      </div>
                    }
                    @if (ejercicioActivo()?.peso) {
                      <div class="input-group">
                        <label>Peso utilizado (kg)</label>
                        <input type="number" [(ngModel)]="pesoReal" step="0.5" min="0">
                      </div>
                    }
                  </div>

                  <div class="controles-completado">
                    <button class="btn-guardar" (click)="guardarYCerrar()">
                      <mat-icon>save</mat-icon>
                      Guardar y Continuar
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Footer con Info Rápida -->
          <div class="modal-footer">
            <div class="footer-stats">
              <span>🔁 {{ ejercicioActivo()?.series || 0 }} series</span>
              @if (ejercicioActivo()?.repeticiones) {
                <span>🔢 {{ ejercicioActivo()?.repeticiones }} reps</span>
              }
              @if (ejercicioActivo()?.descansoSegundos) {
                <span>⏸️ {{ ejercicioActivo()?.descansoSegundos }}s descanso</span>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
    styles: [`
    .mis-ejercicios-container {
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
      flex-wrap: wrap;
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

    .page-title .icon {
      font-size: 2.5rem;
    }

    .page-subtitle {
      margin: 0;
      color: #718096;
      font-size: 1.1rem;
    }

    .btn-add {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(229, 62, 62, 0.3);
    }

    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(229, 62, 62, 0.4);
    }

    .btn-add .icon {
      font-size: 1.25rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .stat-icon {
      font-size: 1.75rem;
    }

    .stat-label {
      color: #718096;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    .stat-footer {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-meta {
      color: #a0aec0;
      font-size: 0.875rem;
    }

    .progress-bar {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #e53e3e 0%, #c53030 100%);
      transition: width 0.3s ease;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .content-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #2d3748;
    }

    .date {
      color: #718096;
      font-size: 0.95rem;
    }

    .link-see-all {
      color: #e53e3e;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }

    .link-see-all:hover {
      color: #c53030;
    }

    .card-content {
      padding: 1.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: #a0aec0;
    }

    .empty-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 0 0 1.5rem 0;
      font-size: 1.1rem;
    }

    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: #edf2f7;
      color: #4a5568;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
      transform: translateY(-2px);
    }

    .exercises-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .exercise-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
      border-left: 4px solid #e53e3e;
    }

    .exercise-time {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 80px;
    }

    .time {
      font-weight: 700;
      color: #2d3748;
    }

    .type-badge {
      padding: 0.25rem 0.5rem;
      background: #e53e3e;
      color: white;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-align: center;
    }

    .exercise-info {
      flex: 1;
    }

    .exercise-info h4 {
      margin: 0 0 0.5rem 0;
      color: #2d3748;
      font-size: 1.1rem;
    }

    .exercise-details {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .detail {
      padding: 0.25rem 0.75rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-size: 0.875rem;
      color: #4a5568;
    }

    .routine-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .routine-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 1rem;
    }

    .routine-header h3 {
      margin: 0;
      color: #2d3748;
      font-size: 1.25rem;
    }

    .routine-badge {
      padding: 0.25rem 0.75rem;
      background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
      color: white;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .routine-description {
      margin: 0;
      color: #718096;
      line-height: 1.6;
    }

    .routine-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
    }

    .routine-stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .routine-stat .label {
      color: #718096;
      font-size: 0.875rem;
    }

    .routine-stat .value {
      color: #2d3748;
      font-weight: 700;
    }

    .weekly-schedule h4 {
      margin: 0 0 1rem 0;
      color: #2d3748;
      font-size: 1rem;
    }

    .days-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .day-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      background: #f7fafc;
      border-radius: 6px;
      border-left: 3px solid #e2e8f0;
    }

    .day-item.completed {
      background: #f0fdf4;
      border-left-color: #48bb78;
    }

    .day-name {
      font-weight: 700;
      color: #2d3748;
      min-width: 80px;
    }

    .day-focus {
      flex: 1;
      color: #718096;
      font-size: 0.95rem;
    }

    .check-icon {
      color: #48bb78;
      font-weight: 700;
      font-size: 1.25rem;
    }

    .progress-section {
      margin-top: 1.5rem;
    }

    .weekly-chart {
      padding: 1rem 0;
    }

    .chart-bars {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      height: 200px;
      gap: 1rem;
    }

    .chart-day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
    }

    .bar-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .bar {
      width: 60%;
      background: linear-gradient(180deg, #e53e3e 0%, #c53030 100%);
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 20px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 0.25rem;
    }

    .bar-value {
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .day-label {
      color: #718096;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .exercise-checkbox {
      display: flex;
      align-items: center;
      margin-right: 1rem;
    }

    .exercise-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .exercise-item.completado {
      opacity: 0.6;
      background: #f0fff4;
    }

    .exercise-item.completado h4 {
      text-decoration: line-through;
    }

    .notas {
      margin: 0.5rem 0 0 0;
      padding: 0.5rem;
      background: #f7fafc;
      border-radius: 6px;
      color: #4a5568;
      font-size: 0.875rem;
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: #718096;
    }

    /* ========================================
       ESTILOS DEL MODAL DE ENTRENAMIENTO
    ======================================== */
    
    .exercise-item {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .exercise-item:hover {
      transform: translateX(4px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .exercise-action {
      display: flex;
      align-items: center;
    }
    
    .btn-start {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-start:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
      backdrop-filter: blur(4px);
    }

    .modal-entrenamiento {
      background: white;
      border-radius: 20px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
      color: white;
      border-radius: 20px 20px 0 0;
    }

    .header-info h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .badge-tipo {
      padding: 0.25rem 0.75rem;
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      font-size: 0.8rem;
    }

    .btn-close {
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
      transition: background 0.2s;
    }

    .btn-close:hover {
      background: rgba(255,255,255,0.3);
    }

    .progreso-general {
      padding: 1rem 1.5rem;
      background: #f7fafc;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .progreso-bar {
      flex: 1;
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progreso-fill {
      height: 100%;
      background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
      transition: width 0.3s ease;
    }

    .progreso-texto {
      font-size: 0.875rem;
      color: #718096;
      white-space: nowrap;
    }

    .modal-body {
      padding: 1.5rem;
    }

    /* Estado: Ejercicio */
    .estado-ejercicio {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .cronometro-container {
      display: flex;
      justify-content: center;
    }

    .cronometro {
      text-align: center;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      width: 180px;
      height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .cronometro .tiempo {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
    }

    .cronometro .label {
      font-size: 0.875rem;
      color: rgba(255,255,255,0.8);
      margin-top: 0.5rem;
    }

    .serie-info {
      display: flex;
      justify-content: center;
    }

    .serie-card {
      padding: 1rem 2rem;
      background: #f7fafc;
      border-radius: 12px;
      text-align: center;
      border: 2px solid #e2e8f0;
    }

    .serie-card.activa {
      background: #ebf8ff;
      border-color: #4299e1;
    }

    .serie-numero {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2d3748;
    }

    .serie-detalles {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
      justify-content: center;
    }

    .serie-detalles .meta {
      font-size: 0.875rem;
      color: #718096;
    }

    .guia-ejercicio {
      background: #f7fafc;
      padding: 1rem;
      border-radius: 12px;
    }

    .guia-ejercicio h4 {
      margin: 0 0 1rem 0;
      color: #2d3748;
    }

    .pasos {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .paso {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .paso.activo {
      background: #ebf8ff;
    }

    .paso-numero {
      width: 24px;
      height: 24px;
      background: #e2e8f0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: #718096;
      flex-shrink: 0;
    }

    .paso.activo .paso-numero {
      background: #4299e1;
      color: white;
    }

    .paso-texto {
      font-size: 0.875rem;
      color: #4a5568;
      line-height: 1.5;
    }

    .calorias-estimadas {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
      border-radius: 12px;
      color: white;
    }

    .calorias-icon {
      font-size: 2rem;
    }

    .calorias-info {
      display: flex;
      flex-direction: column;
    }

    .calorias-valor {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .calorias-label {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .controles-ejercicio {
      display: flex;
      justify-content: center;
    }

    .btn-completar-serie {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4);
    }

    .btn-completar-serie:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(72, 187, 120, 0.5);
    }

    /* Estado: Descanso */
    .estado-descanso {
      display: flex;
      justify-content: center;
    }

    .descanso-container {
      text-align: center;
      padding: 2rem;
    }

    .descanso-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .descanso-container h3 {
      margin: 0 0 1.5rem 0;
      color: #2d3748;
      font-size: 1.5rem;
    }

    .timer-descanso {
      position: relative;
      width: 180px;
      height: 180px;
      margin: 0 auto 1.5rem;
    }

    .timer-circle {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .timer-bg {
      fill: none;
      stroke: #e2e8f0;
      stroke-width: 8;
    }

    .timer-progress {
      fill: none;
      stroke: #4299e1;
      stroke-width: 8;
      stroke-linecap: round;
      stroke-dasharray: 283;
      transition: stroke-dashoffset 1s linear;
    }

    .timer-texto {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .tiempo-restante {
      font-size: 3rem;
      font-weight: 700;
      color: #2d3748;
      display: block;
    }

    .timer-texto .label {
      font-size: 0.875rem;
      color: #718096;
    }

    .siguiente-serie {
      color: #718096;
      margin-bottom: 1.5rem;
    }

    .controles-descanso {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn-saltar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #4299e1;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-saltar:hover {
      background: #3182ce;
    }

    .btn-mas-tiempo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #edf2f7;
      color: #4a5568;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-mas-tiempo:hover {
      background: #e2e8f0;
    }

    /* Estado: Completado */
    .estado-completado {
      display: flex;
      justify-content: center;
    }

    .completado-container {
      text-align: center;
      padding: 1rem;
      width: 100%;
    }

    .completado-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .completado-container h3 {
      margin: 0 0 1.5rem 0;
      color: #2d3748;
      font-size: 1.5rem;
    }

    .resumen-entrenamiento {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .resumen-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 12px;
    }

    .resumen-item.destacado {
      background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
      border: 2px solid #9f7aea;
    }

    .resumen-icon {
      font-size: 1.5rem;
    }

    .resumen-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .resumen-valor {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2d3748;
    }

    .resumen-label {
      font-size: 0.875rem;
      color: #718096;
    }

    .post-ejercicio {
      background: #f7fafc;
      padding: 1rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }

    .post-ejercicio h4 {
      margin: 0 0 1rem 0;
      color: #4a5568;
      font-size: 0.9rem;
    }

    .input-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .input-group label {
      font-size: 0.875rem;
      color: #4a5568;
    }

    .input-group input {
      width: 80px;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      text-align: center;
      font-size: 1rem;
    }

    .controles-completado {
      display: flex;
      justify-content: center;
    }

    .btn-guardar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4);
    }

    .btn-guardar:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(72, 187, 120, 0.5);
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      background: #f7fafc;
      border-radius: 0 0 20px 20px;
      border-top: 1px solid #e2e8f0;
    }

    .footer-stats {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      font-size: 0.875rem;
      color: #718096;
    }

    @media (max-width: 768px) {
      .mis-ejercicios-container {
        padding: 1rem;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .modal-entrenamiento {
        max-height: 95vh;
        border-radius: 16px;
      }
      
      .cronometro {
        width: 150px;
        height: 150px;
      }
      
      .cronometro .tiempo {
        font-size: 2rem;
      }
    }
  `]
})
export class MisEjerciciosComponent implements OnInit, OnDestroy {
    fechaHoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Signals para el estado
    cargando = signal(false);
    caloriasQuemadas = signal(0);
    tiempoActivo = signal(0);
    tiempoMeta = signal(60);
    sesionesSemanales = signal(0);
    racha = signal(0);

    // Ejercicios programados de la rutina activa
    ejerciciosProgramados = signal<any[]>([]);
    rutinaActiva = signal<any>(null);

    progresoSemanal = signal([
        { dia: 'L', calorias: 0 },
        { dia: 'M', calorias: 0 },
        { dia: 'X', calorias: 0 },
        { dia: 'J', calorias: 0 },
        { dia: 'V', calorias: 0 },
        { dia: 'S', calorias: 0 },
        { dia: 'D', calorias: 0 }
    ]);

    maxCaloriasSemana = signal(600);

    // ========================================
    // MODAL DE ENTRENAMIENTO INTERACTIVO
    // ========================================
    modalEntrenamiento = signal(false);
    ejercicioActivo = signal<any>(null);
    estadoEntrenamiento = signal<'ejercicio' | 'descanso' | 'completado'>('ejercicio');
    
    // Cronómetro y timers
    tiempoEjercicio = signal(0);  // segundos
    tiempoDescanso = signal(60);  // segundos
    tiempoDescansoInicial = signal(60);
    tiempoTotalEjercicio = signal(0);
    
    // Series
    serieActual = signal(1);
    seriesCompletadas = signal(0);
    
    // Guía paso a paso
    pasoActual = signal(0);
    
    // Calorías
    caloriasEstimadas = signal(0);
    caloriasFinales = signal(0);
    pesoUsuario = 70; // kg - TODO: obtener del perfil
    
    // Datos reales para registrar
    seriesReales = 0;
    repsReales = 0;
    pesoReal = 0;
    
    // Intervals
    private cronometroInterval: any = null;
    private descansoInterval: any = null;
    private caloriasInterval: any = null;
    
    // Progreso total (computed)
    progresoTotal = computed(() => {
      const series = this.ejercicioActivo()?.series || 1;
      return ((this.serieActual() - 1) / series) * 100;
    });

    constructor(
        private metasService: MetasService,
        private notificationService: NotificationService,
        private mockData: MockDataService
    ) {}

    ngOnInit(): void {
        this.cargarEjerciciosProgramados();
        this.cargarRutinaActiva();
    }

    cargarEjerciciosProgramados(): void {
        this.cargando.set(true);
        console.log('🏋️ [MisEjercicios] Cargando ejercicios programados para hoy...');
        
        // Usar el endpoint que ya trae ejercicios del día con estado registrado
        this.metasService.obtenerRutinaHoyConEstado().subscribe({
          next: (response: any) => {
            this.cargando.set(false);
            console.log('📦 [MisEjercicios] Respuesta de /registros/rutina/hoy:', response);
            
            // La respuesta puede venir directamente o envuelta en data
            const data = response.data || response;
            const ejerciciosData = data.ejercicios || [];
            
            if (ejerciciosData && ejerciciosData.length > 0) {
              // Mapear los ejercicios con el estado correcto
              const ejerciciosConEstado = ejerciciosData.map((ejercicio: any) => ({
                id: ejercicio.ejercicioId,
                ejercicioId: ejercicio.ejercicioId,
                ejercicioNombre: ejercicio.nombre,
                series: ejercicio.seriesObjetivo,
                repeticiones: ejercicio.repeticionesObjetivo,
                peso: ejercicio.pesoSugerido,
                duracionMinutos: ejercicio.duracionMinutos,
                descansoSegundos: ejercicio.descansoSegundos || 60,
                // Estado de completitud del backend
                completado: ejercicio.registrado === true,
                registroId: ejercicio.registroId
              }));
              
              console.log('✅ [MisEjercicios] Ejercicios de HOY:', ejerciciosConEstado.length);
              ejerciciosConEstado.forEach((ej: any, idx: number) => {
                console.log(`   ${idx + 1}. ${ej.ejercicioNombre} - ${ej.completado ? '✅ Completado' : '⏳ Pendiente'}`);
              });
              
              this.ejerciciosProgramados.set(ejerciciosConEstado);
              this.actualizarEstadisticas();
            } else {
              console.log('⚠️ [MisEjercicios] No hay ejercicios para hoy (día de descanso)');
              this.ejerciciosProgramados.set([]);
              this.actualizarEstadisticas();
            }
          },
          error: (err) => {
            this.cargando.set(false);
            console.error('❌ [MisEjercicios] Error en /registros/rutina/hoy:', err);
            // Fallback al método alternativo
            this.cargarEjerciciosFallback();
          }
        });
    }

    // Método de fallback usando el cálculo manual de día
    private cargarEjerciciosFallback(): void {
        this.metasService.obtenerEjerciciosProgramadosHoy().subscribe({
          next: (response) => {
            this.cargando.set(false);
            if (response.success && response.data && response.data.length > 0) {
              const ejerciciosConEstado = response.data.map(ejercicio => ({
                id: ejercicio.id,
                ejercicioId: ejercicio.ejercicioId || ejercicio.ejercicio?.id,
                ejercicioNombre: ejercicio.ejercicioNombre || ejercicio.ejercicio?.nombre,
                series: ejercicio.series,
                repeticiones: ejercicio.repeticiones,
                peso: ejercicio.peso,
                duracionMinutos: ejercicio.duracionMinutos,
                descansoSegundos: ejercicio.descansoSegundos || 60,
                completado: false,
                registroId: null
              }));
              this.ejerciciosProgramados.set(ejerciciosConEstado);
              this.actualizarEstadisticas();
            } else {
              this.ejerciciosProgramados.set([]);
              this.actualizarEstadisticas();
            }
          },
          error: () => {
            this.cargando.set(false);
            this.ejerciciosProgramados.set([]);
            this.notificationService.showWarning('No se pudieron cargar los ejercicios');
          }
        });
    }

    cargarRutinaActiva(): void {
        this.metasService.obtenerRutinasActivas().subscribe({
            next: (response) => {
                if (response.success && response.data && response.data.length > 0) {
                    const rutinaData = response.data[0];
                    // Puede venir como rutina anidada o directamente
                    const rutina = rutinaData.rutina || rutinaData;
                    this.rutinaActiva.set({
                        id: rutinaData.id,
                        rutinaId: rutina.id || rutinaData.rutinaId,
                        nombre: rutina.nombre || rutinaData.rutinaNombre || 'Rutina de Ejercicios',
                        descripcion: rutina.descripcion || rutinaData.rutinaDescripcion || '',
                        duracionSemanas: rutina.duracionSemanas || 0,
                        patronSemanas: rutina.patronSemanas || 1,
                        nivelDificultad: rutina.nivelDificultad || '',
                        fechaInicio: rutinaData.fechaInicio,
                        estado: rutinaData.estado || 'ACTIVO'
                    });
                    console.log('✅ Rutina activa cargada:', this.rutinaActiva());
                }
            },
            error: (error) => {
                console.error('Error al cargar rutina activa:', error);
            }
        });
    }

    marcarEjercicioCompletado(ejercicio: any): void {
        // Actualizar estado en mockData (siempre funciona como backup)
        this.mockData.marcarEjercicioCompletado(ejercicio.id);
        
        if (ejercicio.completado) {
          // MARCAR como completado - POST /registros/ejercicios
          const fechaHoy = new Date().toISOString().split('T')[0];
          const horaActual = new Date().toTimeString().split(' ')[0].substring(0, 5) + ':00';
          
          const requestBody = {
            ejercicioId: ejercicio.ejercicioId || ejercicio.id,
            usuarioRutinaId: this.rutinaActiva()?.id,
            fecha: fechaHoy,
            hora: horaActual,
            series: ejercicio.series || 1,
            repeticiones: ejercicio.repeticiones || 1,
            pesoKg: ejercicio.peso || 0,
            duracionMinutos: ejercicio.duracionMinutos || 0  // Backend requiere NOT NULL
          };
          
          console.log('📤 [MisEjercicios] Registrando ejercicio:', requestBody);
          
          this.metasService.registrarEjercicioCompletado(requestBody).subscribe({
            next: (response: any) => {
              console.log('✅ [MisEjercicios] Ejercicio registrado:', response);
              // Guardar el registroId para poder desmarcar después
              const registroId = response.id || response.data?.id;
              if (registroId) {
                ejercicio.registroId = registroId;
              }
              this.notificationService.showSuccess(`✓ ${ejercicio.ejercicioNombre} completado`);
              this.actualizarEstadisticas();
            },
            error: (err) => {
              console.error('❌ [MisEjercicios] Error registrando ejercicio:', err);
              console.error('   Status:', err.status);
              console.error('   Message:', err.error?.message || err.message);
              // Aún así mostramos éxito local ya que el checkbox está marcado
              this.notificationService.showSuccess(`✓ ${ejercicio.ejercicioNombre} completado (local)`);
              this.actualizarEstadisticas();
            }
          });
        } else {
          // DESMARCAR - DELETE /registros/ejercicios/{registroId}
          if (ejercicio.registroId) {
            this.metasService.eliminarRegistroEjercicio(ejercicio.registroId).subscribe({
              next: () => {
                ejercicio.registroId = null;
                this.notificationService.showInfo(`${ejercicio.ejercicioNombre} desmarcado`);
                this.actualizarEstadisticas();
              },
              error: (err) => {
                console.error('Error eliminando registro:', err);
                this.notificationService.showInfo(`${ejercicio.ejercicioNombre} desmarcado (local)`);
                this.actualizarEstadisticas();
              }
            });
          } else {
            this.actualizarEstadisticas();
          }
        }
    }

    actualizarEstadisticas(): void {
        const ejercicios = this.ejerciciosProgramados();
        const completados = ejercicios.filter(e => e.completado).length;
        this.sesionesSemanales.set(completados);
        
        // Calcular tiempo activo
        const tiempoTotal = ejercicios
            .filter(e => e.completado)
            .reduce((sum, e) => sum + (e.duracionMinutos || 0), 0);
        this.tiempoActivo.set(tiempoTotal);
    }

    loadEjerciciosHoy(): void {
        // Deprecated - usar cargarEjerciciosProgramados
    }

    loadRutinaActiva(): void {
        // TODO: Implement API call
    }

    loadProgresoSemanal(): void {
        // TODO: Implement API call
    }

    // ========================================
    // MÉTODOS DEL MODAL DE ENTRENAMIENTO
    // ========================================

    ngOnDestroy(): void {
        this.limpiarIntervals();
    }

    private limpiarIntervals(): void {
        if (this.cronometroInterval) {
            clearInterval(this.cronometroInterval);
            this.cronometroInterval = null;
        }
        if (this.descansoInterval) {
            clearInterval(this.descansoInterval);
            this.descansoInterval = null;
        }
        if (this.caloriasInterval) {
            clearInterval(this.caloriasInterval);
            this.caloriasInterval = null;
        }
    }

    abrirEntrenamiento(ejercicio: any): void {
        if (ejercicio.completado) {
            this.notificationService.showInfo('Este ejercicio ya está completado');
            return;
        }
        
        console.log('🏋️ Iniciando entrenamiento:', ejercicio);
        
        // Resetear estado
        this.ejercicioActivo.set(ejercicio);
        this.estadoEntrenamiento.set('ejercicio');
        this.tiempoEjercicio.set(0);
        this.tiempoTotalEjercicio.set(0);
        this.serieActual.set(1);
        this.seriesCompletadas.set(0);
        this.pasoActual.set(0);
        this.caloriasEstimadas.set(0);
        this.caloriasFinales.set(0);
        
        // Configurar descanso
        const descanso = ejercicio.descansoSegundos || 60;
        this.tiempoDescanso.set(descanso);
        this.tiempoDescansoInicial.set(descanso);
        
        // Inicializar datos reales con los valores objetivo
        this.seriesReales = ejercicio.series || 1;
        this.repsReales = ejercicio.repeticiones || 0;
        this.pesoReal = ejercicio.peso || 0;
        
        // Abrir modal
        this.modalEntrenamiento.set(true);
        
        // Iniciar cronómetro
        this.iniciarCronometro();
    }

    cerrarModal(): void {
        this.limpiarIntervals();
        this.modalEntrenamiento.set(false);
        this.ejercicioActivo.set(null);
    }

    private iniciarCronometro(): void {
        this.limpiarIntervals();
        
        this.cronometroInterval = setInterval(() => {
            this.tiempoEjercicio.update(t => t + 1);
            this.tiempoTotalEjercicio.update(t => t + 1);
            
            // Actualizar calorías cada 5 segundos
            if (this.tiempoEjercicio() % 5 === 0) {
                this.actualizarCaloriasEstimadas();
            }
            
            // Rotar pasos de la guía cada 10 segundos
            if (this.tiempoEjercicio() % 10 === 0) {
                const pasos = this.obtenerPasosEjercicio();
                if (pasos.length > 0) {
                    this.pasoActual.update(p => (p + 1) % pasos.length);
                }
            }
        }, 1000);
    }

    private actualizarCaloriasEstimadas(): void {
        const ejercicio = this.ejercicioActivo();
        if (!ejercicio) return;
        
        // Fórmula: Calorías = MET × peso(kg) × tiempo(horas)
        const tipo = ejercicio.tipoEjercicio || 'DEFAULT';
        const met = MET_VALUES[tipo] || MET_VALUES['DEFAULT'];
        const tiempoHoras = this.tiempoTotalEjercicio() / 3600;
        const calorias = Math.round(met * this.pesoUsuario * tiempoHoras);
        
        this.caloriasEstimadas.set(calorias);
    }

    completarSerie(): void {
        const ejercicio = this.ejercicioActivo();
        if (!ejercicio) return;
        
        const seriesTotal = ejercicio.series || 1;
        const serieCompletada = this.serieActual();
        
        console.log(`✅ Serie ${serieCompletada}/${seriesTotal} completada`);
        
        this.seriesCompletadas.update(s => s + 1);
        
        // Reproducir sonido/vibración
        this.reproducirFeedback();
        
        if (serieCompletada < seriesTotal) {
            // Hay más series: ir a descanso
            this.serieActual.update(s => s + 1);
            this.iniciarDescanso();
        } else {
            // Última serie: completar ejercicio
            this.finalizarEjercicio();
        }
    }

    private iniciarDescanso(): void {
        this.estadoEntrenamiento.set('descanso');
        this.tiempoDescanso.set(this.tiempoDescansoInicial());
        
        this.limpiarIntervals();
        
        this.descansoInterval = setInterval(() => {
            const tiempo = this.tiempoDescanso();
            
            if (tiempo <= 1) {
                // Descanso terminado
                this.finalizarDescanso();
            } else {
                this.tiempoDescanso.update(t => t - 1);
            }
        }, 1000);
    }

    private finalizarDescanso(): void {
        this.limpiarIntervals();
        this.reproducirFeedback();
        this.estadoEntrenamiento.set('ejercicio');
        this.tiempoEjercicio.set(0);
        this.iniciarCronometro();
    }

    saltarDescanso(): void {
        this.finalizarDescanso();
    }

    agregarTiempoDescanso(): void {
        this.tiempoDescanso.update(t => t + 30);
    }

    private finalizarEjercicio(): void {
        this.limpiarIntervals();
        this.estadoEntrenamiento.set('completado');
        
        // Calcular calorías finales
        const ejercicio = this.ejercicioActivo();
        const tipo = ejercicio?.tipoEjercicio || 'DEFAULT';
        const met = MET_VALUES[tipo] || MET_VALUES['DEFAULT'];
        const tiempoHoras = this.tiempoTotalEjercicio() / 3600;
        const caloriasFinales = Math.round(met * this.pesoUsuario * tiempoHoras);
        
        this.caloriasFinales.set(caloriasFinales);
        
        // Reproducir feedback de éxito
        this.reproducirFeedback();
    }

    guardarYCerrar(): void {
        const ejercicio = this.ejercicioActivo();
        if (!ejercicio) {
            this.cerrarModal();
            return;
        }
        
        // Marcar como completado
        ejercicio.completado = true;
        
        // Registrar en API con los datos reales
        const fechaHoy = new Date().toISOString().split('T')[0];
        const horaActual = new Date().toTimeString().split(' ')[0].substring(0, 5) + ':00';
        
        const requestBody = {
            ejercicioId: ejercicio.ejercicioId || ejercicio.id,
            usuarioRutinaId: this.rutinaActiva()?.id,
            fecha: fechaHoy,
            hora: horaActual,
            series: this.seriesReales || ejercicio.series || 1,
            repeticiones: this.repsReales || ejercicio.repeticiones || 1,
            pesoKg: this.pesoReal || ejercicio.peso || 0,
            duracionMinutos: Math.ceil(this.tiempoTotalEjercicio() / 60) || ejercicio.duracionMinutos || 0
        };
        
        console.log('📤 Guardando entrenamiento:', requestBody);
        
        this.metasService.registrarEjercicioCompletado(requestBody).subscribe({
            next: (response: any) => {
                console.log('✅ Entrenamiento guardado:', response);
                const registroId = response.id || response.data?.id;
                if (registroId) {
                    ejercicio.registroId = registroId;
                }
                
                // Actualizar calorías quemadas del día
                this.caloriasQuemadas.update(c => c + this.caloriasFinales());
                
                this.notificationService.showSuccess(
                    `🎉 ¡${ejercicio.ejercicioNombre} completado! +${this.caloriasFinales()} kcal`
                );
                this.actualizarEstadisticas();
            },
            error: (err) => {
                console.error('Error guardando entrenamiento:', err);
                this.notificationService.showSuccess(
                    `🎉 ¡${ejercicio.ejercicioNombre} completado! (guardado local)`
                );
                this.actualizarEstadisticas();
            }
        });
        
        this.cerrarModal();
    }

    formatearTiempo(segundos: number): string {
        const mins = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    calcularCircunferencia(): number {
        // Circunferencia del círculo SVG (2 * PI * radio)
        const circunferencia = 2 * Math.PI * 45; // radio = 45
        const progreso = this.tiempoDescanso() / this.tiempoDescansoInicial();
        return circunferencia * (1 - progreso);
    }

    obtenerPasosEjercicio(): string[] {
        const ejercicio = this.ejercicioActivo();
        if (!ejercicio) return [];
        
        // Guías genéricas basadas en el nombre del ejercicio
        const nombre = (ejercicio.ejercicioNombre || '').toLowerCase();
        
        if (nombre.includes('sentadilla')) {
            return [
                'Párate con los pies al ancho de los hombros',
                'Mantén el pecho erguido y la espalda recta',
                'Baja flexionando rodillas y caderas',
                'Llega hasta que los muslos estén paralelos al suelo',
                'Empuja con los talones para volver arriba'
            ];
        } else if (nombre.includes('plancha') || nombre.includes('plank')) {
            return [
                'Colócate boca abajo apoyando antebrazos y punta de pies',
                'Mantén el cuerpo en línea recta de cabeza a talones',
                'Activa el core contrayendo el abdomen',
                'No dejes que la cadera suba o baje',
                'Respira de forma controlada'
            ];
        } else if (nombre.includes('flexion') || nombre.includes('push')) {
            return [
                'Coloca las manos al ancho de los hombros',
                'Mantén el cuerpo recto como una tabla',
                'Baja el pecho hacia el suelo flexionando codos',
                'Los codos deben ir a 45° del cuerpo',
                'Empuja fuerte para volver a la posición inicial'
            ];
        } else if (nombre.includes('peso muerto') || nombre.includes('deadlift')) {
            return [
                'Párate frente a la barra con pies al ancho de caderas',
                'Agarra la barra con agarre prono o mixto',
                'Mantén la espalda recta y el pecho arriba',
                'Levanta empujando con las piernas y extendiendo cadera',
                'Baja controladamente manteniendo la espalda recta'
            ];
        } else if (nombre.includes('press') || nombre.includes('banco')) {
            return [
                'Acuéstate en el banco con los pies firmes en el suelo',
                'Agarra la barra un poco más ancho que los hombros',
                'Baja la barra hasta tocar el pecho',
                'Mantén los codos a 45° del cuerpo',
                'Empuja la barra hacia arriba hasta extender los brazos'
            ];
        } else if (nombre.includes('curl') || nombre.includes('bicep')) {
            return [
                'Párate derecho con una mancuerna en cada mano',
                'Mantén los codos pegados al cuerpo',
                'Sube las mancuernas contrayendo los bíceps',
                'Aprieta en la parte superior del movimiento',
                'Baja de forma controlada'
            ];
        } else if (nombre.includes('zancada') || nombre.includes('lunge')) {
            return [
                'Párate derecho con los pies juntos',
                'Da un paso largo hacia adelante',
                'Baja hasta que ambas rodillas formen 90°',
                'La rodilla trasera casi toca el suelo',
                'Empuja con el pie delantero para volver'
            ];
        } else {
            // Guía genérica
            return [
                'Adopta la posición inicial correcta',
                'Respira profundo antes de comenzar',
                'Realiza el movimiento de forma controlada',
                'Mantén la concentración en el músculo trabajado',
                'Completa todas las repeticiones con buena forma'
            ];
        }
    }

    private reproducirFeedback(): void {
        // Vibración si está disponible
        if ('vibrate' in navigator) {
            navigator.vibrate(200);
        }
        
        // Sonido (opcional - se puede agregar un audio simple)
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.15);
        } catch (e) {
            // Audio no disponible, ignorar
        }
    }
}
