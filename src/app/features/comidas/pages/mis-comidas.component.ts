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
    selector: 'app-mis-comidas',
    standalone: true,
    imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatCheckboxModule, FormsModule],
    template: `
    <div class="mis-comidas-container">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">🔥</span>
            <span class="stat-label">Calorías Hoy</span>
          </div>
          <div class="stat-value">{{ caloriasHoy() }}</div>
          <div class="stat-footer">
            <span class="stat-meta">de {{ caloriasMeta() }} kcal</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">✅</span>
            <span class="stat-label">Completadas</span>
          </div>
          <div class="stat-value">{{ comidasRegistradas() }}/{{ comidasProgramadas().length }}</div>
          <div class="stat-footer">
            <span class="stat-meta">comidas del plan</span>
          </div>
        </div>
      </div>

      <!-- Comidas Programadas -->
      <div class="content-card">
        <div class="card-header">
          <h2>🎯 Comidas Programadas</h2>
          <p class="page-subtitle">{{ fechaHoy }}</p>
          @if (planActivo()) {
            <span class="badge-success">{{ planActivo().nombre }}</span>
          } @else {
            <a [routerLink]="['/metas/planes']" class="link-primary">Activar Plan</a>
          }
        </div>
        <div class="card-content">
          @if (cargando()) {
            <div class="loading-state">
              <p>Cargando...</p>
            </div>
          } @else if (comidasProgramadas().length === 0) {
            <div class="empty-state">
              <span class="empty-icon">🍽️</span>
              <p>No tienes comidas programadas</p>
              <button class="btn-secondary" [routerLink]="['/metas/planes']">Activar un Plan</button>
            </div>
          } @else {
            <div class="meals-list">
              @for (comida of comidasProgramadas(); track comida.id) {
                <div class="meal-item" [class.completada]="comida.completada">
                  <div class="meal-checkbox">
                    <mat-checkbox 
                      [(ngModel)]="comida.completada"
                      (change)="marcarComidaCompletada(comida)"
                      color="primary">
                    </mat-checkbox>
                  </div>
                  <div class="meal-info">
                    <div class="meal-header">
                      <span class="type-badge tipo-{{ comida.tipoComida.toLowerCase() }}">
                        {{ formatearTipoComida(comida.tipoComida) }}
                      </span>
                      @if (comida.horaSugerida) {
                        <span class="time">{{ comida.horaSugerida }}</span>
                      }
                    </div>
                    <h4>{{ comida.comidaNombre }}</h4>
                    <div class="meal-details">
                      @if (comida.porciones) {
                        <span class="detail">{{ comida.porciones }} porción(es)</span>
                      }
                      @if (comida.calorias) {
                        <span class="detail">🔥 {{ comida.calorias }} kcal</span>
                      }
                    </div>
                    @if (comida.notas) {
                      <p class="notas">{{ comida.notas }}</p>
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
    .mis-comidas-container {
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
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(72, 187, 120, 0.3);
    }

    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(72, 187, 120, 0.4);
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
      background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
      transition: width 0.3s ease;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 1.5rem;
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
      color: #48bb78;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }

    .link-see-all:hover {
      color: #38a169;
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

    .meals-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .meal-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
      border-left: 4px solid #48bb78;
    }

    .meal-time {
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
      background: #48bb78;
      color: white;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-align: center;
    }

    .meal-info {
      flex: 1;
    }

    .meal-info h4 {
      margin: 0 0 0.5rem 0;
      color: #2d3748;
      font-size: 1.1rem;
    }

    .meal-nutrients {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .nutrient {
      padding: 0.25rem 0.75rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-size: 0.875rem;
      color: #4a5568;
    }

    .plan-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 1rem;
    }

    .plan-header h3 {
      margin: 0;
      color: #2d3748;
      font-size: 1.25rem;
    }

    .plan-badge {
      padding: 0.25rem 0.75rem;
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .plan-description {
      margin: 0;
      color: #718096;
      line-height: 1.6;
    }

    .plan-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
    }

    .plan-stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .plan-stat .label {
      color: #718096;
      font-size: 0.875rem;
    }

    .plan-stat .value {
      color: #2d3748;
      font-weight: 700;
    }

    .plan-macros h4 {
      margin: 0 0 1rem 0;
      color: #2d3748;
      font-size: 1rem;
    }

    .macro-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .macro-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.75rem;
      background: #f7fafc;
      border-radius: 6px;
    }

    .macro-label {
      color: #718096;
      font-size: 0.875rem;
    }

    .macro-value {
      color: #2d3748;
      font-weight: 700;
    }

    .meal-checkbox {
      display: flex;
      align-items: center;
      margin-right: 1rem;
    }

    .meal-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .meal-item.completada {
      opacity: 0.6;
      background: #f0fff4;
    }

    .meal-item.completada h4 {
      text-decoration: line-through;
    }

    .tipo-desayuno { background: #fef5e7; color: #d68910; }
    .tipo-almuerzo { background: #ebf5fb; color: #2e86de; }
    .tipo-cena { background: #f4ecf7; color: #8e44ad; }
    .tipo-snack { background: #fef9e7; color: #f39c12; }
    .tipo-merienda { background: #fdecea; color: #e74c3c; }
    .tipo-colacion { background: #e8f8f5; color: #16a085; }

    .porciones {
      margin: 0.25rem 0;
      color: #718096;
      font-size: 0.875rem;
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
      .mis-comidas-container {
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
export class MisComidasComponent implements OnInit {
    fechaHoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Signals para el estado
    cargando = signal(false);
    caloriasHoy = signal(0);
    caloriasMeta = signal(2200);
    comidasRegistradas = signal(0);
    hidratacion = signal(0);

    // Comidas programadas del plan activo
    comidasProgramadas = signal<any[]>([]);
    
    // Comidas registradas manualmente (extras)
    comidasRegistradasHoy = signal<any[]>([]);

    planActivo: any;

    constructor(
        private metasService: MetasService,
        private notificationService: NotificationService,
        private mockData: MockDataService
    ) {
        // Usar datos compartidos del mockData
        this.comidasProgramadas = this.mockData.comidasProgramadas;
        this.planActivo = computed(() => this.mockData.planActivo());
    }

    ngOnInit(): void {
        this.cargarComidasProgramadas();
        this.cargarPlanActivo();
    }

    cargarComidasProgramadas(): void {
        this.cargando.set(true);
        this.metasService.obtenerComidasProgramadasHoy().subscribe({
          next: (response) => {
            if (response.success && response.data) {
              const comidasConEstado = response.data.map(comida => ({
                ...comida,
                completada: false
              }));
              this.mockData.comidasProgramadas.set(comidasConEstado);
              this.actualizarEstadisticas();
              this.cargando.set(false);
            } else {
              // Ya tiene datos mock por defecto, solo actualizar UI
              this.actualizarEstadisticas();
              this.cargando.set(false);
            }
          },
          error: () => {
            // Usar datos compartidos que ya existen en mockData
            this.actualizarEstadisticas();
            this.notificationService.showSuccess('Modo demo: comidas cargadas sin conexión');
            this.cargando.set(false);
          }
        });
    }

    cargarPlanActivo(): void {
        this.metasService.obtenerPlanesActivos().subscribe({
            next: (response) => {
                if (response.success && response.data && response.data.length > 0) {
                    const plan = response.data[0];
                    this.planActivo.set({
                        nombre: plan.planNombre || 'Plan Nutricional',
                        descripcion: plan.planDescripcion || '',
                        duracion: plan.diasTotales || 0,
                        diaActual: plan.diaActual || 0,
                        caloriasObjetivo: plan.caloriasObjetivo || 0,
                        proteinasObjetivo: plan.proteinasObjetivo || 0,
                        carbohidratosObjetivo: plan.carbohidratosObjetivo || 0,
                        grasasObjetivo: plan.grasasObjetivo || 0
                    });
                    
                    if (plan.caloriasObjetivo) {
                        this.caloriasMeta.set(plan.caloriasObjetivo);
                    }
                }
            },
            error: (error) => {
                console.error('Error al cargar plan activo:', error);
            }
        });
    }

    marcarComidaCompletada(comida: any): void {
        if (comida.completada) {
            // Actualizar en el servicio compartido
            this.mockData.marcarComidaCompletada(comida.id);
            
            // Intentar registrar en API (opcional)
            const fechaHoy = new Date().toISOString().split('T')[0];
            const horaActual = new Date().toTimeString().split(' ')[0].substring(0, 5);
            this.metasService.registrarComidaConsumida({
                planComidaId: comida.id,
                fecha: fechaHoy,
                hora: horaActual
            }).subscribe({
                next: (response) => {
                    const nombre = comida.comida?.nombre || comida.comidaNombre || 'Comida';
                    this.notificationService.showSuccess(`✓ ${nombre} registrada`);
                },
                error: () => {
                    const nombre = comida.comida?.nombre || comida.comidaNombre || 'Comida';
                    this.notificationService.showSuccess(`✓ ${nombre} registrada (demo)`);
                }
            });
            
            this.actualizarEstadisticas();
        }
    }

    actualizarEstadisticas(): void {
        const comidas = this.comidasProgramadas();
        const completadas = comidas.filter(c => c.completada).length;
        this.comidasRegistradas.set(completadas);
        
        // Calcular calorías consumidas
        const caloriasConsumidas = comidas
            .filter(c => c.completada)
            .reduce((sum, c) => sum + (c.calorias || 0), 0);
        this.caloriasHoy.set(caloriasConsumidas);
    }

    formatearTipoComida(tipo: string): string {
        const tipos: any = {
            'DESAYUNO': 'Desayuno',
            'ALMUERZO': 'Almuerzo',
            'CENA': 'Cena',
            'SNACK': 'Snack',
            'MERIENDA': 'Merienda',
            'COLACION': 'Colación',
            'PRE_ENTRENAMIENTO': 'Pre-Entrenamiento',
            'POST_ENTRENAMIENTO': 'Post-Entrenamiento'
        };
        return tipos[tipo] || tipo;
    }

    loadComidasHoy(): void {
        // TODO: Implement API call
    }

    loadPlanActivo(): void {
        // TODO: Implement API call
    }
}
