import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-mis-ejercicios',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="mis-ejercicios-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <span class="icon">🏃‍♂️</span>
            Mis Ejercicios
          </h1>
          <p class="page-subtitle">Registra y monitorea tu actividad física</p>
        </div>
        <button class="btn-add">
          <span class="icon">+</span>
          Registrar Ejercicio
        </button>
      </div>

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
            <span class="stat-meta">de {{ tiempoMeta() }} min objetivo</span>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="(tiempoActivo() / tiempoMeta()) * 100"></div>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">💪</span>
            <span class="stat-label">Sesiones Semanales</span>
          </div>
          <div class="stat-value">{{ sesionesSemanales() }}</div>
          <div class="stat-footer">
            <span class="stat-meta">{{ racha() }} días de racha</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-grid">
        <!-- Today's Exercises -->
        <div class="content-card">
          <div class="card-header">
            <h2>Ejercicios de Hoy</h2>
            <span class="date">{{ fechaHoy }}</span>
          </div>
          <div class="card-content">
            @if (ejerciciosHoy().length === 0) {
              <div class="empty-state">
                <span class="empty-icon">🏋️</span>
                <p>No has registrado ejercicios hoy</p>
                <button class="btn-secondary">Registrar Primer Ejercicio</button>
              </div>
            } @else {
              <div class="exercises-list">
                @for (ejercicio of ejerciciosHoy(); track ejercicio.id) {
                  <div class="exercise-item">
                    <div class="exercise-time">
                      <span class="time">{{ ejercicio.hora }}</span>
                      <span class="type-badge">{{ ejercicio.tipo }}</span>
                    </div>
                    <div class="exercise-info">
                      <h4>{{ ejercicio.nombre }}</h4>
                      <div class="exercise-details">
                        <span class="detail">{{ ejercicio.duracion }} min</span>
                        <span class="detail">{{ ejercicio.calorias }} kcal</span>
                        @if (ejercicio.series) {
                          <span class="detail">{{ ejercicio.series }} series</span>
                        }
                        @if (ejercicio.repeticiones) {
                          <span class="detail">{{ ejercicio.repeticiones }} reps</span>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Active Routine -->
        <div class="content-card">
          <div class="card-header">
            <h2>Rutina Activa</h2>
            <a [routerLink]="['/metas']" class="link-see-all">Ver Todo</a>
          </div>
          <div class="card-content">
            @if (rutinaActiva()) {
              <div class="routine-info">
                <div class="routine-header">
                  <h3>{{ rutinaActiva().nombre }}</h3>
                  <span class="routine-badge">Activa</span>
                </div>
                <p class="routine-description">{{ rutinaActiva().descripcion }}</p>
                <div class="routine-stats">
                  <div class="routine-stat">
                    <span class="label">Duración:</span>
                    <span class="value">{{ rutinaActiva().duracion }} semanas</span>
                  </div>
                  <div class="routine-stat">
                    <span class="label">Progreso:</span>
                    <span class="value">Semana {{ rutinaActiva().semanaActual }}/{{ rutinaActiva().duracion }}</span>
                  </div>
                  <div class="routine-stat">
                    <span class="label">Frecuencia:</span>
                    <span class="value">{{ rutinaActiva().frecuencia }}x por semana</span>
                  </div>
                  <div class="routine-stat">
                    <span class="label">Objetivo:</span>
                    <span class="value">{{ rutinaActiva().objetivo }}</span>
                  </div>
                </div>
                <div class="weekly-schedule">
                  <h4>Programación Semanal</h4>
                  <div class="days-list">
                    @for (dia of rutinaActiva().programacion; track dia.dia) {
                      <div class="day-item" [class.completed]="dia.completado">
                        <span class="day-name">{{ dia.dia }}</span>
                        <span class="day-focus">{{ dia.enfoque }}</span>
                        @if (dia.completado) {
                          <span class="check-icon">✓</span>
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            } @else {
              <div class="empty-state">
                <span class="empty-icon">📅</span>
                <p>No tienes una rutina activa</p>
                <button class="btn-secondary" [routerLink]="['/metas/rutinas']">Explorar Rutinas</button>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Progress Section -->
      <div class="progress-section">
        <div class="content-card">
          <div class="card-header">
            <h2>Progreso Semanal</h2>
          </div>
          <div class="card-content">
            <div class="weekly-chart">
              <div class="chart-bars">
                @for (dia of progresoSemanal(); track dia.dia) {
                  <div class="chart-day">
                    <div class="bar-container">
                      <div class="bar" [style.height.%]="(dia.calorias / maxCaloriasSemana()) * 100">
                        <span class="bar-value">{{ dia.calorias }}</span>
                      </div>
                    </div>
                    <span class="day-label">{{ dia.dia }}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    }
  `]
})
export class MisEjerciciosComponent implements OnInit {
    fechaHoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Mock data - replace with API calls
    caloriasQuemadas = signal(450);
    tiempoActivo = signal(45);
    tiempoMeta = signal(60);
    sesionesSemanales = signal(4);
    racha = signal(5);

    ejerciciosHoy = signal([
        { id: 1, hora: '07:00', tipo: 'Cardio', nombre: 'Correr', duracion: 30, calorias: 300, series: null, repeticiones: null },
        { id: 2, hora: '18:00', tipo: 'Fuerza', nombre: 'Press de banca', duracion: 15, calorias: 150, series: 4, repeticiones: 12 }
    ]);

    rutinaActiva = signal({
        nombre: 'Rutina de Ganancia Muscular',
        descripcion: 'Programa enfocado en hipertrofia y ganancia de fuerza',
        duracion: 12,
        semanaActual: 3,
        frecuencia: 5,
        objetivo: 'Ganancia Muscular',
        programacion: [
            { dia: 'Lunes', enfoque: 'Pecho y Tríceps', completado: true },
            { dia: 'Martes', enfoque: 'Espalda y Bíceps', completado: true },
            { dia: 'Miércoles', enfoque: 'Descanso', completado: true },
            { dia: 'Jueves', enfoque: 'Piernas', completado: false },
            { dia: 'Viernes', enfoque: 'Hombros y Abdomen', completado: false },
            { dia: 'Sábado', enfoque: 'Cardio Ligero', completado: false },
            { dia: 'Domingo', enfoque: 'Descanso', completado: false }
        ]
    });

    progresoSemanal = signal([
        { dia: 'L', calorias: 520 },
        { dia: 'M', calorias: 480 },
        { dia: 'X', calorias: 0 },
        { dia: 'J', calorias: 550 },
        { dia: 'V', calorias: 450 },
        { dia: 'S', calorias: 200 },
        { dia: 'D', calorias: 0 }
    ]);

    maxCaloriasSemana = signal(600);

    ngOnInit(): void {
        // TODO: Load data from API
        this.loadEjerciciosHoy();
        this.loadRutinaActiva();
        this.loadProgresoSemanal();
    }

    loadEjerciciosHoy(): void {
        // TODO: Implement API call
    }

    loadRutinaActiva(): void {
        // TODO: Implement API call
    }

    loadProgresoSemanal(): void {
        // TODO: Implement API call
    }
}
