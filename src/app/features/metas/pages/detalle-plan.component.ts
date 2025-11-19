import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MetasService } from "../../../core/services/metas.service";
import { NotificationService } from "../../../core/services/notification.service";

@Component({
  selector: 'app-catalogo-detalle-plan',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (loading()) {
      <div class="loading">
        <p>Cargando detalles del plan...</p>
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
            <span class="badge">{{ formatearObjetivo(plan().objetivo.tipoObjetivo) }}</span>
          </div>

          <p class="description">{{ plan().descripcion }}</p>

          <div class="plan-info-grid">
            <div class="info-card">
              <h3>Duración</h3>
              <p class="value">{{ plan().duracionDias }} días</p>
            </div>

            <div class="info-card">
              <h3>Calorías Diarias</h3>
              <p class="value">{{ plan().objetivo.caloriasObjetivo }} kcal</p>
            </div>

            <div class="info-card">
              <h3>Proteína</h3>
              <p class="value">{{ plan().objetivo.proteinaGramos }}g/día</p>
            </div>

            <div class="info-card">
              <h3>Carbohidratos</h3>
              <p class="value">{{ plan().objetivo.carbohidratosGramos }}g/día</p>
            </div>

            <div class="info-card">
              <h3>Grasas</h3>
              <p class="value">{{ plan().objetivo.grasasGramos }}g/día</p>
            </div>
          </div>

          <div class="macronutrients-section">
            <h2>Distribución Macronutrientes</h2>
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

          <div class="features-section">
            <h2>Características</h2>
            <div class="features-list">
              @for (etiqueta of plan().etiquetas; track etiqueta.id) {
                <div class="feature-tag">✓ {{ etiqueta.nombre }}</div>
              }
            </div>
          </div>

          <div class="cta-section">
            <button class="btn-primary" (click)="activarPlan()" [disabled]="plan().activoParaUsuario">
              {{ plan().activoParaUsuario ? 'Ya Activado' : 'Activar Plan' }}
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

    .btn-back {
      background: none;
      border: none;
      color: #667eea;
      font-size: 1rem;
      cursor: pointer;
      margin-bottom: 2rem;
      font-weight: 600;
    }

    .btn-back:hover {
      text-decoration: underline;
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
      align-items: center;
      margin-bottom: 1rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .plan-header h1 {
      margin: 0;
      color: #2d3748;
      font-size: 2rem;
    }

    .badge {
      padding: 0.5rem 1rem;
      background: #667eea;
      color: white;
      border-radius: 20px;
      font-weight: 600;
      white-space: nowrap;
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
      background: #f7fafc;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
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
    }

    .macros-bars {
      display: flex;
      flex-direction: column;
      gap: 2rem;
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
      margin-bottom: 0.5rem;
    }

    .label-text {
      font-weight: 600;
      color: #2d3748;
    }

    .percentage {
      font-size: 0.875rem;
      color: #718096;
      font-weight: 500;
    }

    .progress-bar {
      width: 100%;
      height: 10px;
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
      margin-bottom: 1rem;
    }

    .features-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .feature-tag {
      background: #e6f0ff;
      color: #667eea;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-weight: 500;
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

    .loading {
      text-align: center;
      padding: 4rem;
      color: #718096;
    }
  `]
})
export class MetasDetallePlanComponent implements OnInit {
  loading = signal(false);
  planId = 0;
  plan = signal<any>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly metasService: MetasService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.planId = +params['id'];
        this.cargarPlan();
    });
  }

  cargarPlan(): void {
    this.loading.set(true);
      this.metasService.obtenerTodosLosPlanesDeUsuario().subscribe({
      next: (response: any) => {
        this.loading.set(false);
        if (response.success) {
          const planes = response.data || [];
          const planEncontrado = planes.find((p: any) => p.id === this.planId);
          if (planEncontrado) {
            this.plan.set(planEncontrado);
          }
        }
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.showError('Error al cargar el plan');
      }
    });
  }

  activarPlan(): void {
    if (!this.plan()) return;
    this.metasService.activarPlan({ planId: this.planId }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notificationService.showSuccess('Plan activado exitosamente');
          this.cargarPlan();
        }
      },
      error: (error: any) => {
        this.notificationService.showError(
          error.error?.message || 'Error al activar el plan'
        );
      }
    });
  }

  calcularPorcentajeMacro(tipo: 'protein' | 'carbs' | 'fats'): number {
    const plan = this.plan();
    if (!plan) return 0;

    const proteina = plan.objetivo.proteinaGramos * 4;
    const carbos = plan.objetivo.carbohidratosGramos * 4;
    const grasas = plan.objetivo.grasasGramos * 9;
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