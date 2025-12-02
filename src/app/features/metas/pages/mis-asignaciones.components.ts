import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MetasService } from "../../../core/services/metas.service";
import { NotificationService } from "../../../core/services/notification.service";

@Component({
  selector: 'app-mis-asignaciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="mis-asignaciones-container">
      @if (loading()) {
        <div class="loading">
          <p>Cargando tus asignaciones...</p>
        </div>
      }

      @if (!loading()) {
        <!-- Planes Activos -->
        <section class="planes-section">
          <div class="section-header">
            <h2>Planes Nutricionales Activos</h2>
            <button class="btn-view-all" [routerLink]="['/metas/planes']">
              Ver todos los planes
            </button>
          </div>

          @if (planesActivos().length === 0) {
            <div class="empty-state">
              <p>No tienes planes activos</p>
              <button class="btn-link" [routerLink]="['/metas/planes']">
                Explorar planes disponibles
              </button>
            </div>
          }

          @if (planesActivos().length > 0) {
            <div class="asignaciones-grid">
              @for (plan of planesActivos(); track plan.id) {
                <div class="asignacion-card">
                  <div class="card-header">
                    <h3>{{ plan.planNombre }}</h3>
                    <span class="estado-badge" [class]="'estado-' + plan.estado.toLowerCase()">
                      {{ formatearEstado(plan.estado) }}
                    </span>
                  </div>

                  <div class="progress-info">
                    <div class="progress-text">
                      <span>Día {{ plan.diaActual }} de {{ plan.diasTotales }}</span>
                      <span class="percentage">{{ plan.porcentajeCompletado }}%</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="plan.porcentajeCompletado"></div>
                    </div>
                    @if (plan.comidasTotalHoy > 0) {
                      <div class="activity-stats">
                        <span class="stat-item" [class.completed]="plan.diaCompletadoHoy">
                          @if (plan.diaCompletadoHoy) {
                            ✅ Día completado
                          } @else {
                            🍽️ {{ plan.comidasCompletadasHoy }}/{{ plan.comidasTotalHoy }} comidas hoy
                          }
                        </span>
                      </div>
                    }
                  </div>

                  <div class="card-info">
                    <div class="info-item">
                      <span class="label">Fecha Inicio:</span>
                      <span class="value">{{ formatearFecha(plan.fechaInicio) }}</span>
                    </div>
                    @if (plan.fechaFin) {
                      <div class="info-item">
                        <span class="label">Fecha Fin:</span>
                        <span class="value">{{ formatearFecha(plan.fechaFin) }}</span>
                      </div>
                    }
                  </div>

                  <div class="card-actions">
                    <!-- Si está listo para completar (100%), solo mostrar botón de completar con estilo especial -->
                    @if (plan.porcentajeCompletado >= 100) {
                      <div class="ready-to-complete">
                        <p class="congrats-text">🎉 ¡Has completado todos los días!</p>
                        <button
                          class="btn-complete-final"
                          (click)="completarPlan(plan.id)"
                        >
                          🏆 Finalizar Plan
                        </button>
                      </div>
                    } @else {
                      <!-- Acciones normales cuando no está al 100% -->
                      @if (plan.estado === 'ACTIVO') {
                        <button
                          class="btn-secondary"
                          (click)="pausarPlan(plan.id)"
                        >
                          Pausar
                        </button>
                      }

                      @if (plan.estado === 'PAUSADO') {
                        <button
                          class="btn-secondary"
                          (click)="reanudarPlan(plan.id)"
                        >
                          Reanudar
                        </button>
                      }

                      <button
                        class="btn-danger"
                        (click)="cancelarPlan(plan.id)"
                      >
                        Cancelar
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </section>

        <!-- Rutinas Activas -->
        <section class="rutinas-section">
          <div class="section-header">
            <h2>Rutinas Activas</h2>
            <button class="btn-view-all" [routerLink]="['/metas/rutinas']">
              Ver todas las rutinas
            </button>
          </div>

          @if (rutinasActivas().length === 0) {
            <div class="empty-state">
              <p>No tienes rutinas activas</p>
              <button class="btn-link" [routerLink]="['/metas/rutinas']">
                Explorar rutinas disponibles
              </button>
            </div>
          }

          @if (rutinasActivas().length > 0) {
            <div class="asignaciones-grid">
              @for (rutina of rutinasActivas(); track rutina.id) {
                <div class="asignacion-card">
                  <div class="card-header">
                    <h3>{{ rutina.rutinaNombre }}</h3>
                    <span class="estado-badge" [class]="'estado-' + rutina.estado.toLowerCase()">
                      {{ formatearEstado(rutina.estado) }}
                    </span>
                  </div>

                  <div class="progress-info">
                    <div class="progress-text">
                      <span>Día {{ rutina.diaActualTotal || rutina.diaActual }} de {{ rutina.diasTotales }}</span>
                      <span class="percentage">{{ rutina.porcentajeCompletado }}%</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="rutina.porcentajeCompletado"></div>
                    </div>
                    @if (rutina.ejerciciosTotalHoy > 0) {
                      <div class="activity-stats">
                        <span class="stat-item" [class.completed]="rutina.diaCompletadoHoy">
                          @if (rutina.diaCompletadoHoy) {
                            ✅ Día completado
                          } @else {
                            💪 {{ rutina.ejerciciosCompletadosHoy }}/{{ rutina.ejerciciosTotalHoy }} ejercicios hoy
                          }
                        </span>
                      </div>
                    }
                  </div>

                  <div class="card-info">
                    <div class="info-item">
                      <span class="label">Fecha Inicio:</span>
                      <span class="value">{{ formatearFecha(rutina.fechaInicio) }}</span>
                    </div>
                    @if (rutina.semanaActual) {
                      <div class="info-item">
                        <span class="label">Semana actual:</span>
                        <span class="value">Semana {{ rutina.semanaActual }}</span>
                      </div>
                    }
                  </div>

                  <div class="card-actions">
                    <!-- Si está listo para completar (100%), solo mostrar botón de completar con estilo especial -->
                    @if (rutina.porcentajeCompletado >= 100) {
                      <div class="ready-to-complete">
                        <p class="congrats-text">🎉 ¡Has completado toda la rutina!</p>
                        <button
                          class="btn-complete-final"
                          (click)="completarRutina(rutina.id)"
                        >
                          🏆 Finalizar Rutina
                        </button>
                      </div>
                    } @else {
                      <!-- Acciones normales cuando no está al 100% -->
                      @if (rutina.estado === 'ACTIVO') {
                        <button
                          class="btn-secondary"
                          (click)="pausarRutina(rutina.id)"
                        >
                          Pausar
                        </button>
                      }

                      @if (rutina.estado === 'PAUSADO') {
                        <button
                          class="btn-secondary"
                          (click)="reanudarRutina(rutina.id)"
                        >
                          Reanudar
                        </button>
                      }

                      <button
                        class="btn-danger"
                        (click)="cancelarRutina(rutina.id)"
                      >
                        Cancelar
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </section>
      }
    </div>
  `,
  styles: [`
    .mis-asignaciones-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 3rem;
      text-align: center;
    }

    h1 {
      font-size: 2.5rem;
      color: #2d3748;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: #718096;
      font-size: 1.125rem;
      margin: 0;
    }

    section {
      margin-bottom: 3rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    section h2 {
      color: #2d3748;
      margin: 0;
      font-size: 1.5rem;
    }

    .btn-view-all {
      padding: 0.625rem 1.25rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .btn-view-all:hover {
      background: #764ba2;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }

    .asignaciones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .asignacion-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .asignacion-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .card-header h3 {
      margin: 0;
      color: #2d3748;
      font-size: 1.25rem;
      flex: 1;
    }

    .estado-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .estado-badge.estado-activo {
      background: #c6f6d5;
      color: #22543d;
    }

    .estado-badge.estado-pausado {
      background: #bee3f8;
      color: #2c5282;
    }

    .estado-badge.estado-completado {
      background: #c6f6d5;
      color: #22543d;
    }

    .estado-badge.estado-cancelado {
      background: #fed7d7;
      color: #742a2a;
    }

    .progress-info {
      margin-bottom: 1rem;
    }

    .progress-text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #718096;
    }

    .percentage {
      font-weight: 600;
      color: #2d3748;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #48bb78, #38a169);
      transition: width 0.3s ease;
    }

    .activity-stats {
      margin-top: 0.5rem;
      display: flex;
      justify-content: center;
    }

    .stat-item {
      font-size: 0.75rem;
      color: #718096;
      background: #f0fff4;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      border: 1px solid #c6f6d5;
    }

    .stat-item.completed {
      background: #48bb78;
      color: white;
      border-color: #38a169;
      font-weight: 600;
    }

    .card-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
    }

    .info-item .label {
      color: #718096;
    }

    .info-item .value {
      color: #2d3748;
      font-weight: 600;
    }

    .card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: auto;
    }

    .btn-secondary, .btn-danger, .btn-success {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.75rem;
      transition: all 0.2s;
      flex: 1;
      min-width: 80px;
    }

    .btn-secondary {
      background: #edf2f7;
      color: #4a5568;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
    }

    .btn-danger {
      background: #fed7d7;
      color: #742a2a;
    }

    .btn-danger:hover {
      background: #fc8181;
    }

    .btn-success {
      background: #c6f6d5;
      color: #22543d;
    }

    .btn-success:hover {
      background: #9ae6b4;
    }

    /* Estilos para el estado "listo para completar" */
    .ready-to-complete {
      width: 100%;
      text-align: center;
      padding: 1rem;
      background: linear-gradient(135deg, #f6e05e 0%, #ecc94b 100%);
      border-radius: 12px;
      animation: pulse-glow 2s ease-in-out infinite;
    }

    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 5px rgba(236, 201, 75, 0.5);
      }
      50% {
        box-shadow: 0 0 20px rgba(236, 201, 75, 0.8);
      }
    }

    .congrats-text {
      margin: 0 0 0.75rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #744210;
    }

    .btn-complete-final {
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.125rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4);
    }

    .btn-complete-final:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 6px 20px rgba(72, 187, 120, 0.6);
    }

    .btn-complete-final:active {
      transform: translateY(0);
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      background: #f7fafc;
      border-radius: 12px;
      color: #718096;
    }

    .empty-state p {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
    }

    .btn-link {
      background: none;
      border: none;
      color: #667eea;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
      font-size: 1rem;
    }

    .btn-link:hover {
      color: #764ba2;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: #718096;
    }
  `]
})
export class MisAsignacionesComponent implements OnInit {
  loading = signal(false);
  planesActivos = signal<any[]>([]);
  rutinasActivas = signal<any[]>([]);

  constructor(
    private readonly metasService: MetasService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.cargarAsignaciones();
  }

  cargarAsignaciones(): void {
    this.loading.set(true);

    Promise.all([
      this.metasService.obtenerPlanesActivos().toPromise(),
      this.metasService.obtenerRutinasActivas().toPromise(),
      this.metasService.obtenerPlanHoyConEstado().toPromise(),
      this.metasService.obtenerRutinaHoyConEstado().toPromise()
    ])
      .then(([respPlanes, respRutinas, respPlanHoy, respRutinaHoy]: any) => {
        this.loading.set(false);
        
        // Extraer datos de hoy (comidas/ejercicios completados hoy)
        const planHoy = respPlanHoy?.data || respPlanHoy || {};
        const rutinaHoy = respRutinaHoy?.data || respRutinaHoy || {};
        
        console.log('📊 Plan Hoy:', planHoy);
        console.log('📊 Rutina Hoy:', rutinaHoy);
        
        // Calcular comidas completadas hoy
        const comidasHoy = planHoy.comidas || [];
        const comidasCompletadasHoy = comidasHoy.filter((c: any) => c.registrada).length;
        const comidasTotalHoy = comidasHoy.length;
        
        // Calcular ejercicios completados hoy
        const ejerciciosHoy = rutinaHoy.ejercicios || [];
        const ejerciciosCompletadosHoy = ejerciciosHoy.filter((e: any) => e.registrado).length;
        const ejerciciosTotalHoy = ejerciciosHoy.length;
        
        // Procesar planes
        if (respPlanes?.success) {
          const planesData = respPlanes.data || [];
          console.log('=== PLANES ACTIVOS DEL API ===');
          
          const planesProcessed = planesData.map((plan: any) => {
            const diasTotales = plan.planDuracionDias || this.calcularDiasTotales(plan.fechaInicio, plan.fechaFin);
            const diaActual = plan.diaActual || 1;
            
            // El progreso se basa en:
            // - Días anteriores: se asumen completados (diaActual - 1)
            // - Día actual: proporción de comidas completadas hoy
            const diasCompletados = diaActual - 1; // Días anteriores al actual
            const progresoHoy = comidasTotalHoy > 0 ? (comidasCompletadasHoy / comidasTotalHoy) : 0;
            
            // Progreso total = (días completados + fracción de hoy) / días totales
            const progresoTotal = ((diasCompletados + progresoHoy) / diasTotales) * 100;
            const porcentajeReal = Math.min(100, Math.round(progresoTotal));
            
            console.log(`Plan "${plan.planNombre}": día ${diaActual}/${diasTotales}, comidas hoy ${comidasCompletadasHoy}/${comidasTotalHoy}, progreso=${porcentajeReal}%`);
            
            return {
              ...plan,
              diasTotales,
              porcentajeCompletado: porcentajeReal,
              comidasCompletadasHoy,
              comidasTotalHoy,
              diaCompletadoHoy: comidasTotalHoy > 0 && comidasCompletadasHoy === comidasTotalHoy
            };
          });
          this.planesActivos.set(planesProcessed);
        } else {
          console.warn('Respuesta de planes no exitosa:', respPlanes);
          this.planesActivos.set([]);
        }
        
        // Procesar rutinas
        if (respRutinas?.success) {
          const rutinasData = respRutinas.data || [];
          console.log('Rutinas activas del API:', rutinasData);
          
          const rutinasProcessed = rutinasData.map((rutina: any) => {
            const semanasTotal = rutina.rutinaDuracionSemanas || 4;
            const diasTotales = semanasTotal * 7;
            
            const diaActualTotal = rutina.semanaActual 
              ? ((rutina.semanaActual - 1) * 7) + 1
              : 1;
            
            // El progreso se basa en días + ejercicios de hoy
            const diasCompletados = diaActualTotal - 1;
            const progresoHoy = ejerciciosTotalHoy > 0 ? (ejerciciosCompletadosHoy / ejerciciosTotalHoy) : 0;
            
            const progresoTotal = ((diasCompletados + progresoHoy) / diasTotales) * 100;
            const porcentajeReal = Math.min(100, Math.round(progresoTotal));
            
            console.log(`Rutina "${rutina.rutinaNombre}": día ${diaActualTotal}/${diasTotales}, ejercicios hoy ${ejerciciosCompletadosHoy}/${ejerciciosTotalHoy}, progreso=${porcentajeReal}%`);
            
            return {
              ...rutina,
              diasTotales,
              diaActualTotal,
              porcentajeCompletado: porcentajeReal,
              ejerciciosCompletadosHoy,
              ejerciciosTotalHoy,
              diaCompletadoHoy: ejerciciosTotalHoy > 0 && ejerciciosCompletadosHoy === ejerciciosTotalHoy
            };
          });
          this.rutinasActivas.set(rutinasProcessed);
        } else {
          console.warn('Respuesta de rutinas no exitosa:', respRutinas);
          this.rutinasActivas.set([]);
        }
      })
      .catch((error) => {
        this.loading.set(false);
        console.error('Error al cargar asignaciones:', error);
        this.notificationService.showError('Error al cargar tus asignaciones. Verifica tu conexión.');
      });
  }
            
  /**
   * Calcula días totales entre dos fechas
   */
  private calcularDiasTotales(fechaInicio: string, fechaFin: string): number {
    if (!fechaInicio || !fechaFin) return 7; // Default 7 días
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = fin.getTime() - inicio.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días
    return diffDays > 0 ? diffDays : 7;
  }

  private calcularPorcentaje(diaActual: number, diasTotales: number): number {
    if (diasTotales === 0) return 0;
    return Math.round((diaActual / diasTotales) * 100);
  }

  // Plan Actions - Usa el ID de la asignación (UsuarioPlan), NO el planId
  pausarPlan(usuarioPlanId: number): void {
    console.log('Pausando plan con ID de asignación:', usuarioPlanId);
    this.metasService.pausarPlan(usuarioPlanId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Plan pausado');
        this.cargarAsignaciones();
      },
      error: (err) => {
        console.error('Error al pausar plan:', err);
        this.notificationService.showError('Error al pausar plan');
      }
    });
  }

  reanudarPlan(usuarioPlanId: number): void {
    console.log('Reanudando plan con ID de asignación:', usuarioPlanId);
    this.metasService.reanudarPlan(usuarioPlanId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Plan reanudado');
        this.cargarAsignaciones();
      },
      error: (err) => {
        console.error('Error al reanudar plan:', err);
        this.notificationService.showError('Error al reanudar plan');
      }
    });
  }

  completarPlan(usuarioPlanId: number): void {
    console.log('Completando plan con ID de asignación:', usuarioPlanId);
    this.metasService.completarPlan(usuarioPlanId).subscribe({
      next: () => {
        // Mostrar felicitación especial
        this.mostrarFelicitacion('plan');
        this.cargarAsignaciones();
      },
      error: (err) => {
        console.error('Error al completar plan:', err);
        this.notificationService.showError('Error al completar plan');
      }
    });
  }

  cancelarPlan(usuarioPlanId: number): void {
    console.log('Cancelando plan con ID de asignación:', usuarioPlanId);
    this.metasService.cancelarPlan(usuarioPlanId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Plan cancelado');
        this.cargarAsignaciones();
      },
      error: (err) => {
        console.error('Error al cancelar plan:', err);
        this.notificationService.showError('Error al cancelar plan');
      }
    });
  }

  // Rutina Actions - Usa el ID de la asignación (UsuarioRutina), NO el rutinaId
  pausarRutina(usuarioRutinaId: number): void {
    console.log('Pausando rutina con ID de asignación:', usuarioRutinaId);
    this.metasService.pausarRutina(usuarioRutinaId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Rutina pausada');
        this.cargarAsignaciones();
      },
      error: (err) => {
        console.error('Error al pausar rutina:', err);
        this.notificationService.showError('Error al pausar rutina');
      }
    });
  }

  reanudarRutina(usuarioRutinaId: number): void {
    console.log('Reanudando rutina con ID de asignación:', usuarioRutinaId);
    this.metasService.reanudarRutina(usuarioRutinaId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Rutina reanudada');
        this.cargarAsignaciones();
      },
      error: (err) => {
        console.error('Error al reanudar rutina:', err);
        this.notificationService.showError('Error al reanudar rutina');
      }
    });
  }

  completarRutina(usuarioRutinaId: number): void {
    console.log('Completando rutina con ID de asignación:', usuarioRutinaId);
    this.metasService.completarRutina(usuarioRutinaId).subscribe({
      next: () => {
        // Mostrar felicitación especial
        this.mostrarFelicitacion('rutina');
        this.cargarAsignaciones();
      },
      error: (err) => {
        console.error('Error al completar rutina:', err);
        this.notificationService.showError('Error al completar rutina');
      }
    });
  }

  cancelarRutina(usuarioRutinaId: number): void {
    console.log('Cancelando rutina con ID de asignación:', usuarioRutinaId);
    this.metasService.cancelarRutina(usuarioRutinaId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Rutina cancelada');
        this.cargarAsignaciones();
      },
      error: (err) => {
        console.error('Error al cancelar rutina:', err);
        this.notificationService.showError('Error al cancelar rutina');
      }
    });
  }

  /**
   * Muestra una notificación de felicitación especial al completar
   */
  mostrarFelicitacion(tipo: 'plan' | 'rutina'): void {
    const mensajes = {
      plan: {
        titulo: '🏆 ¡Felicitaciones!',
        mensaje: '¡Has completado tu plan nutricional con éxito! Tu dedicación y compromiso han dado frutos. ¡Sigue así!'
      },
      rutina: {
        titulo: '💪 ¡Excelente trabajo!',
        mensaje: '¡Has completado tu rutina de ejercicios! Tu esfuerzo y constancia te han llevado al éxito. ¡Eres increíble!'
      }
    };
    
    const msg = mensajes[tipo];
    this.notificationService.success(msg.titulo, msg.mensaje, 8000);
  }

  formatearEstado(estado: string): string {
    const estados: Record<string, string> = {
      ACTIVO: 'Activo',
      PAUSADO: 'Pausado',
      COMPLETADO: 'Completado',
      CANCELADO: 'Cancelado'
    };
    return estados[estado] || estado;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}