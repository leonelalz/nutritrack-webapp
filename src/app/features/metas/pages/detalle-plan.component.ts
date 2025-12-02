import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MetasService } from "../../../core/services/metas.service";
import { CatalogoService } from "../../../core/services/catalogo.service";
import { NotificationService } from "../../../core/services/notification.service";

@Component({
  selector: 'app-catalogo-detalle-plan',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (loading()) {
      <div class="loading">
        <div class="loading-spinner"></div>
        <p>Cargando detalles del plan...</p>
      </div>
    }

    @if (!loading() && !plan()) {
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Plan no encontrado</h2>
        <p>No pudimos encontrar el plan solicitado.</p>
        <button class="btn-primary" [routerLink]="['/metas/planes']">
          Volver al Catálogo
        </button>
      </div>
    }

    @if (!loading() && plan()) {
      <div class="detalle-plan-container">
        <button class="btn-back" [routerLink]="['/metas/planes']">
          ← Volver a Planes
        </button>

        <div class="plan-detail">
          <div class="plan-header">
            <h1>{{ plan().nombre }}</h1>
            <div class="badges">
              <span class="badge-objetivo">{{ formatearObjetivo(plan().objetivo?.tipoObjetivo || plan().tipoObjetivo) }}</span>
              @if (plan().activo) {
                <span class="badge-estado disponible">Disponible</span>
              }
            </div>
          </div>

          <p class="description">{{ plan().descripcion }}</p>

          <div class="plan-info-grid">
            <div class="info-card">
              <div class="info-icon">📅</div>
              <h3>Duración</h3>
              <p class="value">{{ plan().duracionDias }} días</p>
            </div>

            <div class="info-card">
              <div class="info-icon">🔥</div>
              <h3>Calorías Diarias</h3>
              <p class="value">{{ obtenerCalorias() }} kcal</p>
            </div>

            <div class="info-card">
              <div class="info-icon">🥩</div>
              <h3>Proteína</h3>
              <p class="value">{{ obtenerProteinas() }}g/día</p>
            </div>

            <div class="info-card">
              <div class="info-icon">🍞</div>
              <h3>Carbohidratos</h3>
              <p class="value">{{ obtenerCarbohidratos() }}g/día</p>
            </div>

            <div class="info-card">
              <div class="info-icon">🥑</div>
              <h3>Grasas</h3>
              <p class="value">{{ obtenerGrasas() }}g/día</p>
            </div>
          </div>

          <div class="macronutrients-section">
            <h2>📊 Distribución de Macronutrientes</h2>
            <div class="macros-bars">
              <div class="macro-item">
                <div class="macro-label">
                  <span class="label-text">Proteína</span>
                  <span class="percentage">{{ calcularPorcentajeMacro('protein') }}%</span>
                </div>
                <div class="progress-bar protein">
                  <div class="progress-fill" [style.width.%]="calcularPorcentajeMacro('protein')"></div>
                </div>
              </div>

              <div class="macro-item">
                <div class="macro-label">
                  <span class="label-text">Carbohidratos</span>
                  <span class="percentage">{{ calcularPorcentajeMacro('carbs') }}%</span>
                </div>
                <div class="progress-bar carbs">
                  <div class="progress-fill" [style.width.%]="calcularPorcentajeMacro('carbs')"></div>
                </div>
              </div>

              <div class="macro-item">
                <div class="macro-label">
                  <span class="label-text">Grasas</span>
                  <span class="percentage">{{ calcularPorcentajeMacro('fats') }}%</span>
                </div>
                <div class="progress-bar fats">
                  <div class="progress-fill" [style.width.%]="calcularPorcentajeMacro('fats')"></div>
                </div>
              </div>
            </div>
          </div>

          @if (plan().etiquetas && plan().etiquetas.length > 0) {
            <div class="features-section">
              <h2>🎯 Características y Beneficios</h2>
              <div class="features-list">
                @for (etiqueta of plan().etiquetas; track etiqueta.id) {
                  <div class="feature-tag">
                    <span class="checkmark">✓</span>
                    <span>{{ etiqueta.nombre }}</span>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Vista previa de comidas por día -->
          @if (comidasPorDia() && comidasPorDia().length > 0) {
            <div class="comidas-preview-section">
              <div class="section-header">
                <h2>🍽️ Vista Previa del Plan de Alimentación</h2>
                <p class="section-subtitle">Esta es una vista previa de lo que verás en "Mis Comidas" cuando actives este plan</p>
              </div>
              
              <div class="dia-tabs">
                @for (dia of diasDisponibles(); track dia) {
                  <button 
                    class="dia-tab" 
                    [class.active]="diaSeleccionado() === dia"
                    (click)="seleccionarDia(dia)"
                  >
                    Día {{ dia }}
                  </button>
                }
              </div>

              <div class="comidas-del-dia">
                @for (comida of comidasPorDia(); track comida.id) {
                  <div class="comida-card">
                    <div class="comida-tipo-header" [class]="'tipo-' + comida.tipoComida?.toLowerCase()">
                      <span class="tipo-icon">{{ obtenerIconoTipoComida(comida.tipoComida) }}</span>
                      <span class="tipo-nombre">{{ formatearTipoComida(comida.tipoComida) }}</span>
                    </div>
                    
                    <div class="comida-content">
                      <div class="comida-header">
                        <h4>{{ comida.comida?.nombre || comida.nombreComida }}</h4>
                        @if (comida.comida?.calorias || comida.calorias) {
                          <span class="calorias-badge">{{ comida.comida?.calorias || comida.calorias }} kcal</span>
                        }
                      </div>
                      
                      <div class="comida-stats">
                        @if (comida.comida?.tiempoPreparacion) {
                          <div class="stat-item">
                            <span class="stat-icon">⏱️</span>
                            <span>{{ comida.comida.tiempoPreparacion }} min</span>
                          </div>
                        }
                        @if (comida.porcionesRecomendadas) {
                          <div class="stat-item">
                            <span class="stat-icon">🍽️</span>
                            <span>{{ comida.porcionesRecomendadas }} porción(es)</span>
                          </div>
                        }
                      </div>

                      @if (comida.notas) {
                        <p class="comida-notas">📝 {{ comida.notas }}</p>
                      }
                    </div>
                  </div>
                }
              </div>

              @if (comidasPorDia().length === 0) {
                <div class="no-comidas-dia">
                  <p>No hay comidas programadas para el día {{ diaSeleccionado() }}</p>
                </div>
              }
            </div>
          }

          <!-- Mensaje si no hay comidas -->
          @if (!plan().dias || plan().dias.length === 0) {
            <div class="no-comidas-section">
              <div class="no-comidas-icon">🍽️</div>
              <h3>Plan de alimentación</h3>
              <p>Las comidas específicas se asignarán cuando actives este plan.</p>
            </div>
          }

          <div class="cta-section">
            <button 
              class="btn-activate" 
              (click)="activarPlan()" 
              [disabled]="activando() || yaActivado()"
            >
              @if (activando()) {
                <span class="spinner"></span> Activando...
              } @else if (yaActivado()) {
                ✓ Ya Activado
              } @else {
                🚀 Activar Plan
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .detalle-plan-container {
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: #718096;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    .error-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      margin: 2rem auto;
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .error-state h2 {
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    .error-state p {
      color: #718096;
      margin-bottom: 1.5rem;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      padding: 0.625rem 1.25rem;
      background: #edf2f7;
      color: #4a5568;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
      margin-bottom: 1.5rem;
    }

    .btn-back:hover {
      background: #e2e8f0;
      transform: translateX(-2px);
    }

    .plan-detail {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .plan-header h1 {
      margin: 0;
      color: #2d3748;
      font-size: 2rem;
      flex: 1;
    }

    .badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .badge-objetivo {
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 20px;
      font-weight: 600;
      white-space: nowrap;
      font-size: 0.875rem;
    }

    .badge-estado {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      white-space: nowrap;
      font-size: 0.875rem;
    }

    .badge-estado.disponible {
      background: #c6f6d5;
      color: #22543d;
    }

    .description {
      color: #718096;
      font-size: 1.125rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .plan-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .info-card {
      background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
      border: 1px solid #e2e8f0;
    }

    .info-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .info-card h3 {
      margin: 0 0 0.5rem 0;
      color: #718096;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-card .value {
      margin: 0;
      color: #2d3748;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .macronutrients-section {
      margin-bottom: 2rem;
    }

    .macronutrients-section h2 {
      color: #2d3748;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
    }

    .macros-bars {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .macro-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .macro-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }

    .label-text {
      font-weight: 600;
      color: #2d3748;
    }

    .percentage {
      font-size: 0.875rem;
      color: #718096;
      font-weight: 600;
    }

    .progress-bar {
      width: 100%;
      height: 12px;
      background: #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
    }

    .progress-bar.protein .progress-fill {
      background: linear-gradient(90deg, #667eea, #764ba2);
    }

    .progress-bar.carbs .progress-fill {
      background: linear-gradient(90deg, #f093fb, #f5576c);
    }

    .progress-bar.fats .progress-fill {
      background: linear-gradient(90deg, #4facfe, #00f2fe);
    }

    .progress-fill {
      height: 100%;
      transition: width 0.3s ease;
    }

    .features-section {
      margin-bottom: 2rem;
    }

    .features-section h2 {
      color: #2d3748;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
    }

    .features-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .feature-tag {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #f7fafc;
      border-left: 4px solid #48bb78;
      color: #2d3748;
      padding: 1rem 1.25rem;
      border-radius: 8px;
      font-weight: 500;
    }

    .checkmark {
      color: #48bb78;
      font-weight: bold;
      font-size: 1.25rem;
    }

    /* Vista previa de comidas */
    .comidas-preview-section {
      margin-bottom: 2rem;
    }

    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      color: #2d3748;
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
    }

    .section-subtitle {
      color: #718096;
      font-size: 0.95rem;
      margin: 0;
    }

    .dia-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .dia-tab {
      padding: 0.5rem 1rem;
      border: 2px solid #e2e8f0;
      background: white;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: #4a5568;
    }

    .dia-tab:hover {
      border-color: #48bb78;
      color: #48bb78;
    }

    .dia-tab.active {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      border-color: #48bb78;
      color: white;
    }

    .comidas-del-dia {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .comida-card {
      background: #f7fafc;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    .comida-tipo-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      color: white;
      font-weight: 600;
    }

    .comida-tipo-header.tipo-desayuno {
      background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
    }

    .comida-tipo-header.tipo-almuerzo {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    }

    .comida-tipo-header.tipo-cena {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .comida-tipo-header.tipo-snack,
    .comida-tipo-header.tipo-colacion,
    .comida-tipo-header.tipo-merienda {
      background: linear-gradient(135deg, #ed64a6 0%, #d53f8c 100%);
    }

    .comida-tipo-header.tipo-pre_entrenamiento {
      background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
    }

    .comida-tipo-header.tipo-post_entrenamiento {
      background: linear-gradient(135deg, #38b2ac 0%, #319795 100%);
    }

    .tipo-icon {
      font-size: 1.25rem;
    }

    .tipo-nombre {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .comida-content {
      padding: 1rem 1.25rem;
    }

    .comida-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .comida-header h4 {
      margin: 0;
      color: #2d3748;
      font-size: 1rem;
      flex: 1;
    }

    .calorias-badge {
      font-size: 0.75rem;
      background: #fed7e2;
      color: #c53030;
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
      font-weight: 600;
      white-space: nowrap;
    }

    .comida-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .comida-stats .stat-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      color: #4a5568;
    }

    .comida-stats .stat-icon {
      font-size: 0.9rem;
    }

    .comida-notas {
      margin: 0.5rem 0 0 0;
      font-size: 0.85rem;
      color: #718096;
      font-style: italic;
    }

    .no-comidas-dia {
      text-align: center;
      padding: 2rem;
      color: #718096;
      background: #f7fafc;
      border-radius: 8px;
    }

    .no-comidas-section {
      text-align: center;
      padding: 2rem;
      background: #f7fafc;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .no-comidas-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .no-comidas-section h3 {
      color: #2d3748;
      margin: 0 0 0.5rem 0;
    }

    .no-comidas-section p {
      color: #718096;
      margin: 0;
    }

    .cta-section {
      display: flex;
      gap: 1rem;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    .btn-primary {
      flex: 1;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-activate {
      flex: 1;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-activate:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
    }

    .btn-activate:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      background: #a0aec0;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class MetasDetallePlanComponent implements OnInit {
  loading = signal(false);
  activando = signal(false);
  planId = 0;
  plan = signal<any>(null);
  yaActivado = signal(false);
  diaSeleccionado = signal(1);
  comidasPorDia = signal<any[]>([]);
  diasDisponibles = signal<number[]>([1]);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly metasService: MetasService,
    private readonly catalogoService: CatalogoService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.planId = +params['id'];
      this.cargarPlan();
      this.verificarSiYaActivado();
    });
  }

  cargarPlan(): void {
    this.loading.set(true);
    // Cargar desde el catálogo CON los días/comidas
    this.catalogoService.verDetallePlanCompleto(this.planId).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        console.log('📦 Respuesta completa del plan:', response);
        console.log('📊 Datos del plan:', response.data);
        if (response.data?.objetivo) {
          console.log('🎯 Objetivo nutricional:', response.data.objetivo);
        }
        if (response.success && response.data) {
          this.plan.set(response.data);
          this.procesarComidas();
        } else {
          this.notificationService.showError('Plan no encontrado');
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error cargando plan:', err);
        this.notificationService.showError('Error al cargar el plan');
      }
    });
  }

  procesarComidas(): void {
    const plan = this.plan();
    if (!plan || !plan.dias || plan.dias.length === 0) {
      this.diasDisponibles.set([1]);
      this.comidasPorDia.set([]);
      return;
    }

    // Obtener días disponibles
    const dias = new Set<number>();
    plan.dias.forEach((d: any) => {
      dias.add(d.numeroDia || 1);
    });
    this.diasDisponibles.set(Array.from(dias).sort((a, b) => a - b));
    
    // Filtrar comidas del día seleccionado
    this.filtrarComidasPorDia();
  }

  filtrarComidasPorDia(): void {
    const plan = this.plan();
    if (!plan || !plan.dias) {
      this.comidasPorDia.set([]);
      return;
    }

    const dia = this.diaSeleccionado();
    const comidasDia = plan.dias.filter(
      (c: any) => (c.numeroDia || 1) === dia
    );

    // Ordenar por tipo de comida
    const ordenTipos = ['DESAYUNO', 'SNACK', 'ALMUERZO', 'MERIENDA', 'COLACION', 'PRE_ENTRENAMIENTO', 'POST_ENTRENAMIENTO', 'CENA'];
    comidasDia.sort((a: any, b: any) => {
      const indexA = ordenTipos.indexOf(a.tipoComida || 'DESAYUNO');
      const indexB = ordenTipos.indexOf(b.tipoComida || 'DESAYUNO');
      return indexA - indexB;
    });

    this.comidasPorDia.set(comidasDia);
  }

  seleccionarDia(dia: number): void {
    this.diaSeleccionado.set(dia);
    this.filtrarComidasPorDia();
  }

  obtenerIconoTipoComida(tipo: string): string {
    const iconos: Record<string, string> = {
      'DESAYUNO': '🌅',
      'ALMUERZO': '🍽️',
      'CENA': '🌙',
      'SNACK': '🍎',
      'COLACION': '🥜',
      'MERIENDA': '☕',
      'PRE_ENTRENAMIENTO': '⚡',
      'POST_ENTRENAMIENTO': '💪'
    };
    return iconos[tipo] || '🍽️';
  }

  formatearTipoComida(tipo: string): string {
    const tipos: Record<string, string> = {
      'DESAYUNO': 'Desayuno',
      'ALMUERZO': 'Almuerzo',
      'CENA': 'Cena',
      'SNACK': 'Snack',
      'COLACION': 'Colación',
      'MERIENDA': 'Merienda',
      'PRE_ENTRENAMIENTO': 'Pre-entreno',
      'POST_ENTRENAMIENTO': 'Post-entreno'
    };
    return tipos[tipo] || tipo;
  }

  verificarSiYaActivado(): void {
    this.metasService.obtenerPlanesActivos().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          const yaActivo = response.data.some((p: any) => p.planId === this.planId);
          this.yaActivado.set(yaActivo);
        }
      },
      error: () => {
        // Si falla, simplemente permitimos activar
        this.yaActivado.set(false);
      }
    });
  }

  activarPlan(): void {
    if (!this.plan() || this.yaActivado()) return;
    
    this.activando.set(true);
    this.metasService.activarPlan({ planId: this.planId }).subscribe({
      next: (response: any) => {
        this.activando.set(false);
        if (response.success) {
          this.notificationService.showSuccess('¡Plan activado exitosamente! 🎉');
          this.yaActivado.set(true);
          // Navegar a mis asignaciones después de un momento
          setTimeout(() => {
            this.router.navigate(['/metas/mis-asignaciones']);
          }, 1500);
        } else {
          this.notificationService.showError(
            response.message || 'Error al activar el plan'
          );
        }
      },
      error: (error: any) => {
        this.activando.set(false);
        this.notificationService.showError(
          error.error?.message || 'Error al activar el plan'
        );
      }
    });
  }

  // Métodos helper para obtener valores nutricionales
  // La API puede devolver los campos de diferentes maneras
  obtenerCalorias(): number {
    const plan = this.plan();
    if (!plan) return 0;
    return plan.objetivo?.caloriasObjetivo || plan.caloriasObjetivo || plan.calorias || 0;
  }

  obtenerProteinas(): number {
    const plan = this.plan();
    if (!plan) return 0;
    return plan.objetivo?.proteinasObjetivo || plan.objetivo?.proteinaGramos || 
           plan.proteinasObjetivo || plan.proteinaGramos || plan.proteinas || 0;
  }

  obtenerCarbohidratos(): number {
    const plan = this.plan();
    if (!plan) return 0;
    return plan.objetivo?.carbohidratosObjetivo || plan.objetivo?.carbohidratosGramos || 
           plan.carbohidratosObjetivo || plan.carbohidratosGramos || plan.carbohidratos || 0;
  }

  obtenerGrasas(): number {
    const plan = this.plan();
    if (!plan) return 0;
    return plan.objetivo?.grasasObjetivo || plan.objetivo?.grasasGramos || 
           plan.grasasObjetivo || plan.grasasGramos || plan.grasas || 0;
  }

  calcularPorcentajeMacro(tipo: 'protein' | 'carbs' | 'fats'): number {
    const proteina = this.obtenerProteinas() * 4;
    const carbos = this.obtenerCarbohidratos() * 4;
    const grasas = this.obtenerGrasas() * 9;
    const total = proteina + carbos + grasas;

    if (total === 0) return 0;

    switch (tipo) {
      case 'protein':
        return Math.round((proteina / total) * 100);
      case 'carbs':
        return Math.round((carbos / total) * 100);
      case 'fats':
        return Math.round((grasas / total) * 100);
    }
  }

  formatearObjetivo(tipo: string): string {
    if (!tipo) return 'Objetivo General';
    const objetivos: Record<string, string> = {
      PERDIDA_PESO: 'Pérdida de Peso',
      GANANCIA_MUSCULAR: 'Ganancia Muscular',
      MANTENIMIENTO: 'Mantenimiento',
      DEFINICION: 'Definición',
      SALUD_GENERAL: 'Salud General'
    };
    return objetivos[tipo] || tipo;
  }
}