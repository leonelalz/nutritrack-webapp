import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MetasService } from "../../../core/services/metas.service";
import { NotificationService } from "../../../core/services/notification.service";


@Component({
  selector: 'app-catalogo-detalle-rutina',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (loading()) {
      <div class="loading">
        <p>Cargando detalles de la rutina...</p>
      </div>
    }

    @if (!loading() && rutina()) {
      <div class="detalle-rutina-container">
        <button class="btn-back" [routerLink]="['/metas/rutinas']">
          ← Volver a Rutinas
        </button>

        <div class="rutina-detail">
          <div class="rutina-header">
            <h1>{{ rutina().nombre }}</h1>
            <span class="badge" [class]="'nivel-' + rutina().nivel.toLowerCase()">
              {{ formatearNivel(rutina().nivel) }}
            </span>
          </div>

          <p class="description">{{ rutina().descripcion }}</p>

          <div class="rutina-info-grid">
            <div class="info-card">
              <h3>Duración por Sesión</h3>
              <p class="value">{{ rutina().duracionMinutos }} min</p>
            </div>

            <div class="info-card">
              <h3>Sesiones por Semana</h3>
              <p class="value">{{ rutina().sesionasSemanales }}</p>
            </div>

            <div class="info-card">
              <h3>Duración Total</h3>
              <p class="value">{{ calcularDuracionTotal() }} semanas</p>
            </div>
          </div>

          <div class="benefits-section">
            <h2>Beneficios</h2>
            <div class="benefits-list">
              @for (etiqueta of rutina().etiquetas; track etiqueta.id) {
                <div class="benefit-item">
                  <span class="checkmark">✓</span>
                  <span class="benefit-text">{{ etiqueta.nombre }}</span>
                </div>
              }
            </div>
          </div>

          <div class="cta-section">
            <button class="btn-primary" (click)="activarRutina()" [disabled]="rutina().activaParaUsuario">
              {{ rutina().activaParaUsuario ? 'Ya Activada' : 'Activar Rutina' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .detalle-rutina-container {
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

    .rutina-detail {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .rutina-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .rutina-header h1 {
      margin: 0;
      color: #2d3748;
      font-size: 2rem;
    }

    .badge {
      padding: 0.5rem 1rem;
      color: white;
      border-radius: 20px;
      font-weight: 600;
      white-space: nowrap;
    }

    .badge.nivel-principiante {
      background: #48bb78;
    }

    .badge.nivel-intermedio {
      background: #667eea;
    }

    .badge.nivel-avanzado {
      background: #f6ad55;
    }

    .description {
      color: #718096;
      font-size: 1.125rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .rutina-info-grid {
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

    .benefits-section {
      margin-bottom: 2rem;
    }

    .benefits-section h2 {
      color: #2d3748;
      margin-bottom: 1.5rem;
    }

    .benefits-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .benefit-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-left: 4px solid #48bb78;
      border-radius: 8px;
    }

    .checkmark {
      font-size: 1.5rem;
      color: #48bb78;
      font-weight: bold;
      flex-shrink: 0;
    }

    .benefit-text {
      color: #2d3748;
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
export class MetasDetalleRutinaComponent implements OnInit {
  loading = signal(false);
  rutinaId = 0;
  rutina = signal<any>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly metasService: MetasService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.rutinaId = +params['id'];
      this.cargarRutina();
    });
  }

    cargarRutina(): void {
      this.loading.set(true);
      this.metasService.obtenerTodasLasRutinasDeUsuario().subscribe({
        next: (response: any) => {
          this.loading.set(false);
          if (response.success) {
            const rutinas = response.data || [];
            const rutinaEncontrada = rutinas.find((r: any) => r.id === this.rutinaId);
            if (rutinaEncontrada) {
              this.rutina.set(rutinaEncontrada);
            }
          }
        },
        error: () => {
          this.loading.set(false);
          this.notificationService.showError('Error al cargar la rutina');
        }
      });
    }

  activarRutina(): void {
    if (!this.rutina()) return;
    this.metasService.activarRutina({ rutinaId: this.rutinaId }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notificationService.showSuccess('Rutina activada exitosamente');
          this.cargarRutina();
        }
      },
      error: (error: any) => {
        this.notificationService.showError(
          error.error?.message || 'Error al activar la rutina'
        );
      }
    });
  }

  calcularDuracionTotal(): number {
    const rutina = this.rutina();
    if (!rutina) return 0;
    return Math.ceil((rutina.duracionSemanas || 12) / 7);
  }

  formatearNivel(nivel: string): string {
    const niveles: Record<string, string> = {
      PRINCIPIANTE: 'Principiante',
      INTERMEDIO: 'Intermedio',
      AVANZADO: 'Avanzado'
    };
    return niveles[nivel] || nivel;
  }
}