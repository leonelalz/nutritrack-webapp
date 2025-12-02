import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MetasService } from "../../../core/services/metas.service";
import { CatalogoService } from "../../../core/services/catalogo.service";
import { NotificationService } from "../../../core/services/notification.service";


@Component({
  selector: 'app-catalogo-detalle-rutina',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (loading()) {
      <div class="loading">
        <div class="loading-spinner"></div>
        <p>Cargando detalles de la rutina...</p>
      </div>
    }

    @if (!loading() && !rutina()) {
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Rutina no encontrada</h2>
        <p>No pudimos encontrar la rutina solicitada.</p>
        <button class="btn-primary" [routerLink]="['/metas/rutinas']">
          Volver al Catálogo
        </button>
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
            <div class="badges">
              <span class="badge-nivel" [class]="'nivel-' + (rutina().nivelDificultad || rutina().nivel || 'principiante').toLowerCase()">
                {{ formatearNivel(rutina().nivelDificultad || rutina().nivel) }}
              </span>
              @if (rutina().activo) {
                <span class="badge-estado disponible">Disponible</span>
              }
            </div>
          </div>

          <p class="description">{{ rutina().descripcion }}</p>

          <div class="rutina-info-grid">
            <div class="info-card">
              <div class="info-icon">📅</div>
              <h3>Duración Total</h3>
              <p class="value">{{ rutina().duracionSemanas || calcularDuracionTotal() }} semanas</p>
            </div>

            <div class="info-card">
              <div class="info-icon">🔄</div>
              <h3>Patrón Semanal</h3>
              <p class="value">{{ rutina().patronSemanas || 1 }} semana(s)</p>
            </div>

            <div class="info-card">
              <div class="info-icon">💪</div>
              <h3>Ejercicios</h3>
              <p class="value">{{ rutina().totalEjerciciosProgramados || rutina().ejercicios?.length || 0 }}</p>
            </div>
          </div>

          @if (rutina().etiquetas && rutina().etiquetas.length > 0) {
            <div class="benefits-section">
              <h2>🎯 Objetivos y Beneficios</h2>
              <div class="benefits-list">
                @for (etiqueta of rutina().etiquetas; track etiqueta.id) {
                  <div class="benefit-item">
                    <span class="checkmark">✓</span>
                    <span class="benefit-text">{{ etiqueta.nombre }}</span>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Vista previa de ejercicios por día -->
          @if (ejerciciosPorDia() && ejerciciosPorDia().length > 0) {
            <div class="ejercicios-preview-section">
              <div class="section-header">
                <h2>🏋️ Vista Previa del Plan de Ejercicios</h2>
                <p class="section-subtitle">Esta es una vista previa de lo que verás en "Mis Ejercicios" cuando actives esta rutina</p>
              </div>
              
              <div class="semana-tabs">
                @for (semana of semanasDisponibles(); track semana) {
                  <button 
                    class="semana-tab" 
                    [class.active]="semanaSeleccionada() === semana"
                    (click)="seleccionarSemana(semana)"
                  >
                    Semana {{ semana }}
                  </button>
                }
              </div>

              <div class="dias-grid">
                @for (dia of ejerciciosPorDia(); track dia.dia) {
                  <div class="dia-card">
                    <div class="dia-header">
                      <span class="dia-icon">{{ obtenerIconoDia(dia.dia) }}</span>
                      <h3>{{ formatearDia(dia.dia) }}</h3>
                      <span class="ejercicios-count">{{ dia.ejercicios.length }} ejercicio(s)</span>
                    </div>
                    
                    <div class="ejercicios-del-dia">
                      @for (ejercicio of dia.ejercicios; track ejercicio.id; let i = $index) {
                        <div class="ejercicio-card">
                          <div class="ejercicio-orden">{{ i + 1 }}</div>
                          <div class="ejercicio-content">
                            <div class="ejercicio-header">
                              <span class="ejercicio-nombre">{{ ejercicio.ejercicio?.nombre || ejercicio.nombre }}</span>
                              @if (ejercicio.ejercicio?.grupoMuscular) {
                                <span class="grupo-muscular">{{ formatearGrupoMuscular(ejercicio.ejercicio.grupoMuscular) }}</span>
                              }
                            </div>
                            
                            <div class="ejercicio-stats">
                              <div class="stat-item">
                                <span class="stat-icon">🔄</span>
                                <span>{{ ejercicio.series }} series</span>
                              </div>
                              <div class="stat-item">
                                <span class="stat-icon">💪</span>
                                <span>{{ ejercicio.repeticiones }} reps</span>
                              </div>
                              @if (ejercicio.peso) {
                                <div class="stat-item">
                                  <span class="stat-icon">⚖️</span>
                                  <span>{{ ejercicio.peso }} kg</span>
                                </div>
                              }
                              @if (ejercicio.duracionMinutos) {
                                <div class="stat-item">
                                  <span class="stat-icon">⏱️</span>
                                  <span>{{ ejercicio.duracionMinutos }} min</span>
                                </div>
                              }
                              @if (ejercicio.descansoSegundos) {
                                <div class="stat-item">
                                  <span class="stat-icon">😮‍💨</span>
                                  <span>{{ ejercicio.descansoSegundos }}s descanso</span>
                                </div>
                              }
                            </div>

                            @if (ejercicio.ejercicio?.tipoEjercicio) {
                              <div class="ejercicio-tipo">
                                {{ formatearTipoEjercicio(ejercicio.ejercicio.tipoEjercicio) }}
                              </div>
                            }

                            @if (ejercicio.notas) {
                              <p class="ejercicio-notas">📝 {{ ejercicio.notas }}</p>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>

              @if (ejerciciosPorDia().length === 0) {
                <div class="no-ejercicios-semana">
                  <p>No hay ejercicios programados para la semana {{ semanaSeleccionada() }}</p>
                </div>
              }
            </div>
          }

          <!-- Mensaje si no hay ejercicios -->
          @if (!rutina().ejercicios || rutina().ejercicios.length === 0) {
            <div class="no-ejercicios-section">
              <div class="no-ejercicios-icon">📋</div>
              <h3>Plan de ejercicios</h3>
              <p>Los ejercicios específicos se asignarán cuando actives esta rutina.</p>
            </div>
          }

          <div class="cta-section">
            <button 
              class="btn-activate" 
              (click)="activarRutina()" 
              [disabled]="activando() || yaActivada()"
            >
              @if (activando()) {
                <span class="spinner"></span> Activando...
              } @else if (yaActivada()) {
                ✓ Ya Activada
              } @else {
                🚀 Activar Rutina
              }
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

    .rutina-detail {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .rutina-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .rutina-header h1 {
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

    .badge-nivel {
      padding: 0.5rem 1rem;
      color: white;
      border-radius: 20px;
      font-weight: 600;
      white-space: nowrap;
      font-size: 0.875rem;
    }

    .badge-nivel.nivel-principiante {
      background: #48bb78;
    }

    .badge-nivel.nivel-intermedio {
      background: #667eea;
    }

    .badge-nivel.nivel-avanzado {
      background: #f6ad55;
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

    .rutina-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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

    .benefits-section, .ejercicios-preview-section {
      margin-bottom: 2rem;
    }

    .benefits-section h2, .ejercicios-preview-section h2 {
      color: #2d3748;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
    }

    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-subtitle {
      color: #718096;
      font-size: 0.95rem;
      margin: 0.5rem 0 0 0;
    }

    .semana-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .semana-tab {
      padding: 0.5rem 1rem;
      border: 2px solid #e2e8f0;
      background: white;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: #4a5568;
    }

    .semana-tab:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .semana-tab.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
      color: white;
    }

    .dias-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .dia-card {
      background: #f7fafc;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    .dia-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .dia-icon {
      font-size: 1.25rem;
    }

    .dia-header h3 {
      margin: 0;
      flex: 1;
      font-size: 1rem;
    }

    .ejercicios-count {
      font-size: 0.75rem;
      background: rgba(255,255,255,0.2);
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
    }

    .ejercicios-del-dia {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .ejercicio-card {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .ejercicio-orden {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      flex-shrink: 0;
    }

    .ejercicio-content {
      flex: 1;
      min-width: 0;
    }

    .ejercicio-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
    }

    .ejercicio-nombre {
      font-weight: 600;
      color: #2d3748;
      font-size: 0.95rem;
    }

    .grupo-muscular {
      font-size: 0.75rem;
      background: #e6fffa;
      color: #047857;
      padding: 0.2rem 0.5rem;
      border-radius: 8px;
      font-weight: 500;
    }

    .ejercicio-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8rem;
      color: #4a5568;
    }

    .stat-icon {
      font-size: 0.9rem;
    }

    .ejercicio-tipo {
      display: inline-block;
      font-size: 0.75rem;
      background: #fef3c7;
      color: #92400e;
      padding: 0.2rem 0.5rem;
      border-radius: 8px;
      font-weight: 500;
      margin-top: 0.25rem;
    }

    .ejercicio-notas {
      margin: 0.5rem 0 0 0;
      font-size: 0.8rem;
      color: #718096;
      font-style: italic;
    }

    .no-ejercicios-semana {
      text-align: center;
      padding: 2rem;
      color: #718096;
      background: #f7fafc;
      border-radius: 8px;
    }

    .no-ejercicios-section {
      text-align: center;
      padding: 2rem;
      background: #f7fafc;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .no-ejercicios-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .no-ejercicios-section h3 {
      color: #2d3748;
      margin: 0 0 0.5rem 0;
    }

    .no-ejercicios-section p {
      color: #718096;
      margin: 0;
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
      font-size: 1.25rem;
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
export class MetasDetalleRutinaComponent implements OnInit {
  loading = signal(false);
  activando = signal(false);
  rutinaId = 0;
  rutina = signal<any>(null);
  yaActivada = signal(false);
  semanaSeleccionada = signal(1);
  ejerciciosPorDia = signal<any[]>([]);
  semanasDisponibles = signal<number[]>([1]);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly metasService: MetasService,
    private readonly catalogoService: CatalogoService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.rutinaId = +params['id'];
      this.cargarRutina();
      this.verificarSiYaActivada();
    });
  }

  cargarRutina(): void {
    this.loading.set(true);
    // Cargar desde el catálogo CON los ejercicios
    this.catalogoService.verDetalleRutinaCompleto(this.rutinaId).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        if (response.success && response.data) {
          this.rutina.set(response.data);
          this.procesarEjercicios();
        } else {
          this.notificationService.showError('Rutina no encontrada');
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error cargando rutina:', err);
        this.notificationService.showError('Error al cargar la rutina');
      }
    });
  }

  procesarEjercicios(): void {
    const rutina = this.rutina();
    if (!rutina || !rutina.ejercicios || rutina.ejercicios.length === 0) {
      this.semanasDisponibles.set([1]);
      this.ejerciciosPorDia.set([]);
      return;
    }

    // Obtener semanas disponibles
    const semanas = new Set<number>();
    rutina.ejercicios.forEach((e: any) => {
      semanas.add(e.semanaBase || 1);
    });
    this.semanasDisponibles.set(Array.from(semanas).sort((a, b) => a - b));
    
    // Filtrar ejercicios de la semana seleccionada
    this.filtrarEjerciciosPorSemana();
  }

  filtrarEjerciciosPorSemana(): void {
    const rutina = this.rutina();
    if (!rutina || !rutina.ejercicios) {
      this.ejerciciosPorDia.set([]);
      return;
    }

    const semana = this.semanaSeleccionada();
    const ejerciciosSemana = rutina.ejercicios.filter(
      (e: any) => (e.semanaBase || 1) === semana
    );

    // Agrupar por día - diaSemana viene como número (1-7) del API
    // 1=Lunes, 2=Martes, ..., 7=Domingo
    const diasMap = new Map<number, any[]>();
    const ordenDias = [1, 2, 3, 4, 5, 6, 7]; // 1=Lunes a 7=Domingo

    ejerciciosSemana.forEach((ejercicio: any) => {
      // diaSemana puede venir como número o como string enum
      let dia = ejercicio.diaSemana;
      // Convertir string enum a número si es necesario
      if (typeof dia === 'string') {
        const diaMap: Record<string, number> = {
          'LUNES': 1, 'MARTES': 2, 'MIERCOLES': 3, 'JUEVES': 4,
          'VIERNES': 5, 'SABADO': 6, 'DOMINGO': 7
        };
        dia = diaMap[dia] || 1;
      }
      dia = dia || 1;
      
      if (!diasMap.has(dia)) {
        diasMap.set(dia, []);
      }
      diasMap.get(dia)!.push(ejercicio);
    });

    // Ordenar ejercicios dentro de cada día
    diasMap.forEach((ejercicios) => {
      ejercicios.sort((a: any, b: any) => (a.orden || 0) - (b.orden || 0));
    });

    // Convertir a array ordenado por día
    const resultado = ordenDias
      .filter(dia => diasMap.has(dia))
      .map(dia => ({
        dia, // ahora es número
        ejercicios: diasMap.get(dia)!
      }));

    this.ejerciciosPorDia.set(resultado);
  }

  seleccionarSemana(semana: number): void {
    this.semanaSeleccionada.set(semana);
    this.filtrarEjerciciosPorSemana();
  }

  obtenerIconoDia(dia: number | string): string {
    // Mapeo de número a icono (1=Lunes, 7=Domingo)
    const iconosNum: Record<number, string> = {
      1: '📅', 2: '🔥', 3: '💪', 4: '⚡', 5: '🏆', 6: '🌟', 7: '🧘'
    };
    // Fallback para strings (compatibilidad)
    const iconosStr: Record<string, string> = {
      'LUNES': '📅', 'MARTES': '🔥', 'MIERCOLES': '💪', 'JUEVES': '⚡',
      'VIERNES': '🏆', 'SABADO': '🌟', 'DOMINGO': '🧘'
    };
    
    if (typeof dia === 'number') {
      return iconosNum[dia] || '📅';
    }
    return iconosStr[dia] || '📅';
  }

  formatearDia(dia: number | string): string {
    // Mapeo de número a nombre (1=Lunes, 7=Domingo)
    const diasNum: Record<number, string> = {
      1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves',
      5: 'Viernes', 6: 'Sábado', 7: 'Domingo'
    };
    // Fallback para strings (compatibilidad)
    const diasStr: Record<string, string> = {
      'LUNES': 'Lunes', 'MARTES': 'Martes', 'MIERCOLES': 'Miércoles',
      'JUEVES': 'Jueves', 'VIERNES': 'Viernes', 'SABADO': 'Sábado', 'DOMINGO': 'Domingo'
    };
    
    if (typeof dia === 'number') {
      return diasNum[dia] || `Día ${dia}`;
    }
    return diasStr[dia] || String(dia);
  }

  formatearGrupoMuscular(grupo: string): string {
    const grupos: Record<string, string> = {
      'PECHO': 'Pecho',
      'ESPALDA': 'Espalda',
      'HOMBROS': 'Hombros',
      'BICEPS': 'Bíceps',
      'TRICEPS': 'Tríceps',
      'PIERNAS': 'Piernas',
      'CUADRICEPS': 'Cuádriceps',
      'ISQUIOTIBIALES': 'Isquiotibiales',
      'GLUTEOS': 'Glúteos',
      'PANTORRILLAS': 'Pantorrillas',
      'ABDOMINALES': 'Abdominales',
      'CORE': 'Core',
      'CUERPO_COMPLETO': 'Cuerpo Completo',
      'CARDIO': 'Cardio'
    };
    return grupos[grupo] || grupo;
  }

  formatearTipoEjercicio(tipo: string): string {
    const tipos: Record<string, string> = {
      'FUERZA': '🏋️ Fuerza',
      'CARDIO': '🏃 Cardio',
      'FLEXIBILIDAD': '🧘 Flexibilidad',
      'RESISTENCIA': '💪 Resistencia',
      'HIIT': '⚡ HIIT',
      'FUNCIONAL': '🔄 Funcional',
      'EQUILIBRIO': '⚖️ Equilibrio'
    };
    return tipos[tipo] || tipo;
  }

  verificarSiYaActivada(): void {
    this.metasService.obtenerRutinasActivas().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          const yaActiva = response.data.some((r: any) => r.rutinaId === this.rutinaId);
          this.yaActivada.set(yaActiva);
        }
      },
      error: () => {
        // Si falla, simplemente permitimos activar
        this.yaActivada.set(false);
      }
    });
  }

  activarRutina(): void {
    if (!this.rutina() || this.yaActivada()) return;
    
    this.activando.set(true);
    this.metasService.activarRutina({ rutinaId: this.rutinaId }).subscribe({
      next: (response: any) => {
        this.activando.set(false);
        if (response.success) {
          this.notificationService.showSuccess('¡Rutina activada exitosamente! 🎉');
          this.yaActivada.set(true);
          // Navegar a mis asignaciones después de un momento
          setTimeout(() => {
            this.router.navigate(['/metas/mis-asignaciones']);
          }, 1500);
        } else {
          this.notificationService.showError(
            response.message || 'Error al activar la rutina'
          );
        }
      },
      error: (error: any) => {
        this.activando.set(false);
        this.notificationService.showError(
          error.error?.message || 'Error al activar la rutina'
        );
      }
    });
  }

  calcularDuracionTotal(): number {
    const rutina = this.rutina();
    if (!rutina) return 0;
    return rutina.duracionSemanas || 12;
  }

  formatearNivel(nivel: string): string {
    if (!nivel) return 'Principiante';
    const niveles: Record<string, string> = {
      PRINCIPIANTE: 'Principiante',
      INTERMEDIO: 'Intermedio',
      AVANZADO: 'Avanzado'
    };
    return niveles[nivel.toUpperCase()] || nivel;
  }
}