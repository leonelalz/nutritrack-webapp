import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MetasService } from '../../../core/services/metas.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-mis-ejercicios',
    standalone: true,
    imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatCheckboxModule, FormsModule],
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
                <div class="exercise-item" [class.completado]="ejercicio.completado">
                  <div class="exercise-checkbox">
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
                </div>
              }
            </div>
          }
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

    // Signals para el estado
    cargando = signal(false);
    caloriasQuemadas = signal(0);
    tiempoActivo = signal(0);
    tiempoMeta = signal(60);
    sesionesSemanales = signal(0);
    racha = signal(0);

    // Ejercicios programados de la rutina activa
    ejerciciosProgramados = signal<any[]>([]);
    rutinaActiva: any;

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

    constructor(
        private metasService: MetasService,
        private notificationService: NotificationService,
        private mockData: MockDataService
    ) {
        // Usar datos compartidos del mockData
        this.ejerciciosProgramados = this.mockData.ejerciciosProgramados;
        this.rutinaActiva = computed(() => this.mockData.rutinaActiva());
    }

    ngOnInit(): void {
        this.cargarEjerciciosProgramados();
        this.cargarRutinaActiva();
    }

    cargarEjerciciosProgramados(): void {
        this.cargando.set(true);
        
        // Intentar cargar desde API (opcional), pero usar datos del mockData siempre
        this.metasService.obtenerEjerciciosProgramadosHoy().subscribe({
          next: (response) => {
            if (response.success && response.data) {
              // Si hay datos de API, actualizar mockData
              const ejerciciosConEstado = response.data.map(ejercicio => ({
                ...ejercicio,
                completado: false
              }));
              this.ejerciciosProgramados.set(ejerciciosConEstado);
            }
            // Ya tenemos datos del mockData compartido
            this.actualizarEstadisticas();
            this.cargando.set(false);
          },
          error: () => {
            // Modo demo: ya tenemos datos del mockData compartido, no hacer nada
            this.actualizarEstadisticas();
            this.notificationService.showSuccess('Modo demo: ejercicios cargados sin conexión');
            this.cargando.set(false);
          }
        });
    }

    cargarRutinaActiva(): void {
        this.metasService.obtenerRutinasActivas().subscribe({
            next: (response) => {
                if (response.success && response.data && response.data.length > 0) {
                    const rutina = response.data[0];
                    this.rutinaActiva.set({
                        nombre: rutina.rutinaNombre || 'Rutina de Ejercicios',
                        descripcion: rutina.rutinaDescripcion || '',
                        duracion: rutina.semanasPatron || 0,
                        semanaActual: rutina.semanaActual || 0,
                        frecuencia: rutina.frecuenciaSemanal || 0,
                        objetivo: rutina.objetivo || '',
                        programacion: []
                    });
                }
            },
            error: (error) => {
                console.error('Error al cargar rutina activa:', error);
            }
        });
    }

    marcarEjercicioCompletado(ejercicio: any): void {
        // Actualizar estado en mockData primero (siempre funciona)
        this.mockData.marcarEjercicioCompletado(ejercicio.id);
        
        if (ejercicio.completado) {
          // Intentar registrar en API (opcional)
          const fechaHoy = new Date().toISOString().split('T')[0];
          this.metasService.registrarEjercicioCompletado({
            rutinaEjercicioId: ejercicio.id,
            fecha: fechaHoy,
            seriesRealizadas: ejercicio.series,
            repeticionesRealizadas: ejercicio.repeticiones,
            pesoUtilizado: ejercicio.peso,
            duracionMinutos: ejercicio.duracionMinutos
          }).subscribe({
            next: (response) => {
              if (response.success) {
                this.notificationService.showSuccess(`✓ ${ejercicio.ejercicioNombre} completado`);
              } else {
                this.notificationService.showSuccess(`✓ ${ejercicio.ejercicioNombre} completado (demo)`);
              }
              this.actualizarEstadisticas();
            },
            error: () => {
              // API falló pero ya actualizamos mockData
              this.notificationService.showSuccess(`✓ ${ejercicio.ejercicioNombre} completado (demo)`);
              this.actualizarEstadisticas();
            }
          });
        } else {
          this.actualizarEstadisticas();
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
}
