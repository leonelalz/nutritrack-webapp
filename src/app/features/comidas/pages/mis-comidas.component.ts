import { Component, OnInit, signal, computed } from '@angular/core';
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

@Component({
    selector: 'app-mis-comidas',
    standalone: true,
    imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatCheckboxModule, MatProgressBarModule, FormsModule],
    template: `
    <div class="mis-comidas-container">
      <!-- Header con Toggle de Vista -->
      <div class="page-header">
        <div class="header-left">
          <h1>🍽️ Mis Comidas</h1>
          <p class="subtitle">{{ fechaHoy }}</p>
        </div>
        <div class="header-right">
          <div class="view-toggle">
            <button [class.active]="vistaActual() === 'lista'" (click)="cambiarVista('lista')">
              <mat-icon>list</mat-icon>
              Lista
            </button>
            <button [class.active]="vistaActual() === 'calendario'" (click)="cambiarVista('calendario')">
              <mat-icon>calendar_month</mat-icon>
              Calendario
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards con Macros -->
      <div class="stats-grid">
        <div class="stat-card calorias">
          <div class="stat-header">
            <span class="stat-icon">🔥</span>
            <span class="stat-label">Calorías</span>
          </div>
          <div class="stat-value">{{ caloriasHoy() }}</div>
          <div class="stat-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="progresoCaloriasPct()"></div>
            </div>
            <span class="stat-meta">de {{ caloriasMeta() }} kcal</span>
          </div>
        </div>

        <div class="stat-card proteinas">
          <div class="stat-header">
            <span class="stat-icon">🥩</span>
            <span class="stat-label">Proteínas</span>
          </div>
          <div class="stat-value">{{ proteinasHoy() }}g</div>
          <div class="stat-progress">
            <div class="progress-bar proteinas">
              <div class="progress-fill" [style.width.%]="progresoProteinasPct()"></div>
            </div>
            <span class="stat-meta">de {{ proteinasMeta() }}g</span>
          </div>
        </div>

        <div class="stat-card carbos">
          <div class="stat-header">
            <span class="stat-icon">🍞</span>
            <span class="stat-label">Carbohidratos</span>
          </div>
          <div class="stat-value">{{ carbohidratosHoy() }}g</div>
          <div class="stat-progress">
            <div class="progress-bar carbos">
              <div class="progress-fill" [style.width.%]="progresoCarbohidratosPct()"></div>
            </div>
            <span class="stat-meta">de {{ carbohidratosMeta() }}g</span>
          </div>
        </div>

        <div class="stat-card grasas">
          <div class="stat-header">
            <span class="stat-icon">🥑</span>
            <span class="stat-label">Grasas</span>
          </div>
          <div class="stat-value">{{ grasasHoy() }}g</div>
          <div class="stat-progress">
            <div class="progress-bar grasas">
              <div class="progress-fill" [style.width.%]="progresoGrasasPct()"></div>
            </div>
            <span class="stat-meta">de {{ grasasMeta() }}g</span>
          </div>
        </div>
      </div>

      <!-- Indicador de Hora de Comer -->
      @if (proximaComida()) {
        <div class="reminder-banner" [class.urgente]="esHoraDeComida()">
          <div class="reminder-icon">{{ esHoraDeComida() ? '🔔' : '⏰' }}</div>
          <div class="reminder-info">
            <span class="reminder-title">
              {{ esHoraDeComida() ? '¡Es hora de comer!' : 'Próxima comida' }}
            </span>
            <span class="reminder-detail">
              {{ proximaComida().tipoComida }} - {{ proximaComida().comidaNombre || proximaComida().comida?.nombre }}
              @if (!esHoraDeComida() && proximaComida().horaSugerida) {
                <span class="hora">a las {{ proximaComida().horaSugerida }}</span>
              }
            </span>
          </div>
          <button class="btn-registrar" (click)="abrirDetalleComida(proximaComida())">
            Registrar
          </button>
        </div>
      }

      <!-- VISTA LISTA -->
      @if (vistaActual() === 'lista') {
        <div class="content-card">
          <div class="card-header">
            <div class="header-info">
              <h2>🎯 Comidas del Día</h2>
              @if (planActivo()) {
                <span class="badge-success">{{ planActivo().nombre }}</span>
              }
            </div>
            <div class="header-actions">
              <span class="progress-text">{{ comidasRegistradas() }}/{{ comidasProgramadas().length }}</span>
              <button class="btn-add-extra" (click)="abrirModalComidaExtra()">
                <mat-icon>add</mat-icon>
                Agregar Extra
              </button>
            </div>
          </div>
          <div class="card-content">
            @if (cargando()) {
              <div class="loading-state">
                <div class="spinner"></div>
                <p>Cargando comidas...</p>
              </div>
            } @else if (comidasProgramadas().length === 0) {
              <div class="empty-state">
                <span class="empty-icon">🍽️</span>
                <p>No tienes comidas programadas</p>
                <button class="btn-secondary" [routerLink]="['/metas/planes']">Activar un Plan</button>
              </div>
            } @else {
              <div class="meals-timeline">
                @for (comida of comidasProgramadas(); track comida.id) {
                  <div class="meal-card" 
                       [class.completada]="comida.completada"
                       [class.proxima]="esProximaComida(comida)"
                       (click)="abrirDetalleComida(comida)">
                    <div class="meal-time-indicator">
                      <span class="time-dot" [class.done]="comida.completada"></span>
                      <span class="time-line"></span>
                    </div>
                    <div class="meal-content">
                      <div class="meal-header">
                        <div class="meal-type-time">
                          <span class="type-badge tipo-{{ comida.tipoComida?.toLowerCase() }}">
                            {{ formatearTipoComida(comida.tipoComida) }}
                          </span>
                          @if (comida.horaSugerida) {
                            <span class="time">{{ comida.horaSugerida }}</span>
                          }
                        </div>
                        <div class="meal-checkbox" (click)="$event.stopPropagation()">
                          <mat-checkbox 
                            [(ngModel)]="comida.completada"
                            (change)="marcarComidaCompletada(comida)"
                            color="primary">
                          </mat-checkbox>
                        </div>
                      </div>
                      <h4>{{ comida.comidaNombre || comida.comida?.nombre || 'Comida' }}</h4>
                      <div class="meal-macros">
                        <span class="macro cal">🔥 {{ comida.calorias || comida.comida?.calorias || 0 }} kcal</span>
                        <span class="macro prot">🥩 {{ comida.proteinas || comida.comida?.proteinas || 0 }}g</span>
                        <span class="macro carb">🍞 {{ comida.carbohidratos || comida.comida?.carbohidratos || 0 }}g</span>
                        <span class="macro fat">🥑 {{ comida.grasas || comida.comida?.grasas || 0 }}g</span>
                      </div>
                      @if (comida.porciones && comida.porciones !== 1) {
                        <span class="porciones">{{ comida.porciones }} porciones</span>
                      }
                    </div>
                    <div class="meal-action">
                      <mat-icon>chevron_right</mat-icon>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- VISTA CALENDARIO -->
      @if (vistaActual() === 'calendario') {
        <div class="calendario-container">
          <!-- Navegación del Calendario -->
          <div class="calendario-nav">
            <button class="nav-btn" (click)="semanaAnterior()">
              <mat-icon>chevron_left</mat-icon>
            </button>
            <h3>{{ mesActual() }}</h3>
            <button class="nav-btn" (click)="semanaSiguiente()">
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>

          <!-- Días de la Semana -->
          <div class="calendario-grid">
            @for (dia of diasSemana(); track dia.fecha) {
              <div class="calendario-dia" 
                   [class.hoy]="dia.esHoy"
                   [class.seleccionado]="dia.fecha === fechaSeleccionada()"
                   [class.fuera-plan]="dia.numeroDiaPlan <= 0 || dia.numeroDiaPlan > (planInfo()?.diasTotales || 999)"
                   (click)="seleccionarDia(dia)">
                <div class="dia-header">
                  <span class="dia-nombre">{{ dia.nombreCorto }}</span>
                  <span class="dia-numero">{{ dia.numero }}</span>
                  @if (dia.numeroDiaPlan > 0 && dia.numeroDiaPlan <= (planInfo()?.diasTotales || 999)) {
                    <span class="dia-plan">Día {{ dia.numeroDiaPlan }}</span>
                  }
                </div>
                <div class="dia-indicadores">
                  @if (dia.comidas.length > 0) {
                    <div class="comidas-mini">
                      @for (comida of dia.comidas.slice(0, 4); track comida.id) {
                        <span class="mini-dot" 
                              [class.completada]="comida.completada"
                              [class]="'tipo-' + comida.tipoComida?.toLowerCase()"
                              [title]="formatearTipoComida(comida.tipoComida)">
                        </span>
                      }
                      @if (dia.comidas.length > 4) {
                        <span class="mini-more">+{{ dia.comidas.length - 4 }}</span>
                      }
                    </div>
                  } @else if (dia.numeroDiaPlan > 0) {
                    <span class="sin-comidas-mini">Sin comidas</span>
                  }
                  <div class="dia-stats">
                    @if (dia.comidas.length > 0) {
                      <span class="dia-calorias">{{ calcularCaloriasDia(dia) }} kcal</span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Detalle del Día Seleccionado -->
          <div class="dia-detalle">
            <h4>{{ formatearFechaCompleta(fechaSeleccionada()) }}</h4>
            <div class="comidas-dia">
              @for (comida of comidasDiaSeleccionado(); track comida.id) {
                <div class="comida-mini-card" 
                     [class.completada]="comida.completada"
                     (click)="abrirDetalleComida(comida)">
                  <span class="tipo-mini tipo-{{ comida.tipoComida?.toLowerCase() }}">
                    {{ formatearTipoComida(comida.tipoComida).substring(0, 3) }}
                  </span>
                  <span class="nombre-mini">{{ comida.comidaNombre || comida.comida?.nombre }}</span>
                  <span class="calorias-mini">{{ comida.calorias || comida.comida?.calorias || 0 }} kcal</span>
                  @if (comida.completada) {
                    <mat-icon class="check-mini">check_circle</mat-icon>
                  }
                </div>
              } @empty {
                <p class="sin-comidas">No hay comidas programadas para este día</p>
              }
            </div>
          </div>
        </div>
      }
    </div>

    <!-- MODAL: Detalle de Comida -->
    @if (modalDetalleAbierto()) {
      <div class="modal-overlay">
        <div class="modal-detalle">
          <div class="modal-header" [style.background]="getColorTipoComida(comidaSeleccionada()?.tipoComida)">
            <div class="header-info">
              <span class="tipo-badge-large">{{ formatearTipoComida(comidaSeleccionada()?.tipoComida) }}</span>
              <h2>{{ comidaSeleccionada()?.comidaNombre || comidaSeleccionada()?.comida?.nombre }}</h2>
            </div>
            <button class="btn-close" (click)="cerrarModalDetalle()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="modal-body">
            <!-- Macros Principales -->
            <div class="macros-grid">
              <div class="macro-card calorias">
                <span class="macro-icon">🔥</span>
                <span class="macro-value">{{ comidaSeleccionada()?.calorias || comidaSeleccionada()?.comida?.calorias || 0 }}</span>
                <span class="macro-label">Calorías</span>
              </div>
              <div class="macro-card proteinas">
                <span class="macro-icon">🥩</span>
                <span class="macro-value">{{ comidaSeleccionada()?.proteinas || comidaSeleccionada()?.comida?.proteinas || 0 }}g</span>
                <span class="macro-label">Proteínas</span>
              </div>
              <div class="macro-card carbos">
                <span class="macro-icon">🍞</span>
                <span class="macro-value">{{ comidaSeleccionada()?.carbohidratos || comidaSeleccionada()?.comida?.carbohidratos || 0 }}g</span>
                <span class="macro-label">Carbos</span>
              </div>
              <div class="macro-card grasas">
                <span class="macro-icon">🥑</span>
                <span class="macro-value">{{ comidaSeleccionada()?.grasas || comidaSeleccionada()?.comida?.grasas || 0 }}g</span>
                <span class="macro-label">Grasas</span>
              </div>
            </div>

            <!-- Información de la Comida -->
            @if (comidaSeleccionada()?.comida?.descripcion || comidaSeleccionada()?.descripcion) {
              <div class="seccion">
                <h4>📝 Descripción</h4>
                <p>{{ comidaSeleccionada()?.comida?.descripcion || comidaSeleccionada()?.descripcion }}</p>
              </div>
            }

            <!-- Ingredientes -->
            @if (comidaSeleccionada()?.comida?.ingredientes?.length > 0) {
              <div class="seccion">
                <h4>🥗 Ingredientes</h4>
                <ul class="ingredientes-list">
                  @for (ing of comidaSeleccionada()?.comida?.ingredientes; track ing.id) {
                    <li>
                      <span class="cantidad">{{ ing.cantidad }} {{ ing.unidad }}</span>
                      <span class="nombre">{{ ing.ingredienteNombre || ing.nombre }}</span>
                    </li>
                  }
                </ul>
              </div>
            }

            <!-- Instrucciones de Preparación -->
            @if (comidaSeleccionada()?.comida?.instrucciones) {
              <div class="seccion">
                <h4>👨‍🍳 Preparación</h4>
                <p class="instrucciones">{{ comidaSeleccionada()?.comida?.instrucciones }}</p>
              </div>
            }

            <!-- Ajustar Porciones -->
            <div class="seccion porciones-section">
              <h4>🍽️ Porciones a Registrar</h4>
              <div class="porciones-control">
                <button class="btn-porcion" (click)="ajustarPorciones(-0.5)" [disabled]="porcionesRegistrar() <= 0.5">
                  <mat-icon>remove</mat-icon>
                </button>
                <span class="porciones-valor">{{ porcionesRegistrar() }}</span>
                <button class="btn-porcion" (click)="ajustarPorciones(0.5)">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
              <div class="calorias-ajustadas">
                <span>Total: {{ caloriasAjustadas() }} kcal</span>
              </div>
            </div>

            @if (comidaSeleccionada()?.notas) {
              <div class="seccion">
                <h4>📋 Notas</h4>
                <p class="notas">{{ comidaSeleccionada()?.notas }}</p>
              </div>
            }
          </div>

          <div class="modal-footer">
            @if (comidaSeleccionada()?.completada) {
              <button class="btn-desmarcar" (click)="desmarcarComida()">
                <mat-icon>undo</mat-icon>
                Desmarcar
              </button>
            } @else {
              <button class="btn-registrar-full" (click)="registrarComida()">
                <mat-icon>check_circle</mat-icon>
                Registrar Comida
              </button>
            }
          </div>
        </div>
      </div>
    }

    <!-- MODAL: Agregar Comida Extra -->
    @if (modalExtraAbierto()) {
      <div class="modal-overlay">
        <div class="modal-extra">
          <div class="modal-header extra">
            <h2>➕ Agregar Comida Extra</h2>
            <button class="btn-close" (click)="cerrarModalExtra()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label>Tipo de Comida</label>
              <select [(ngModel)]="comidaExtra.tipoComida">
                <option value="DESAYUNO">Desayuno</option>
                <option value="ALMUERZO">Almuerzo</option>
                <option value="CENA">Cena</option>
                <option value="SNACK">Snack</option>
                <option value="MERIENDA">Merienda</option>
              </select>
            </div>

            <div class="form-group">
              <label>Nombre de la Comida</label>
              <input type="text" [(ngModel)]="comidaExtra.nombre" placeholder="Ej: Ensalada César">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Calorías</label>
                <input type="number" [(ngModel)]="comidaExtra.calorias" placeholder="0">
              </div>
              <div class="form-group">
                <label>Proteínas (g)</label>
                <input type="number" [(ngModel)]="comidaExtra.proteinas" placeholder="0">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Carbohidratos (g)</label>
                <input type="number" [(ngModel)]="comidaExtra.carbohidratos" placeholder="0">
              </div>
              <div class="form-group">
                <label>Grasas (g)</label>
                <input type="number" [(ngModel)]="comidaExtra.grasas" placeholder="0">
              </div>
            </div>

            <div class="form-group">
              <label>Notas (opcional)</label>
              <textarea [(ngModel)]="comidaExtra.notas" rows="2" placeholder="Ej: En restaurante"></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancelar" (click)="cerrarModalExtra()">Cancelar</button>
            <button class="btn-guardar" (click)="guardarComidaExtra()" [disabled]="!comidaExtra.nombre">
              <mat-icon>save</mat-icon>
              Guardar
            </button>
          </div>
        </div>
      </div>
    }
  `,
    styles: [`
    .mis-comidas-container {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-left h1 {
      margin: 0;
      font-size: 1.75rem;
      color: #2d3748;
    }

    .header-left .subtitle {
      margin: 0.25rem 0 0;
      color: #718096;
      font-size: 0.95rem;
    }

    .view-toggle {
      display: flex;
      background: #e2e8f0;
      border-radius: 8px;
      padding: 4px;
    }

    .view-toggle button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      color: #718096;
      transition: all 0.2s;
    }

    .view-toggle button.active {
      background: white;
      color: #48bb78;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .stat-icon { font-size: 1.25rem; }
    .stat-label { color: #718096; font-size: 0.85rem; font-weight: 500; }
    .stat-value { font-size: 1.75rem; font-weight: 700; color: #2d3748; }

    .stat-progress { margin-top: 0.5rem; }

    .progress-bar {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.25rem;
    }

    .progress-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s;
    }

    .stat-card.calorias .progress-fill { background: linear-gradient(90deg, #f6ad55, #ed8936); }
    .stat-card.proteinas .progress-fill { background: linear-gradient(90deg, #fc8181, #e53e3e); }
    .stat-card.carbos .progress-fill { background: linear-gradient(90deg, #63b3ed, #3182ce); }
    .stat-card.grasas .progress-fill { background: linear-gradient(90deg, #68d391, #38a169); }

    .stat-meta { font-size: 0.75rem; color: #a0aec0; }

    /* Reminder Banner */
    .reminder-banner {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #ebf8ff, #e6fffa);
      border-radius: 12px;
      margin-bottom: 1.5rem;
      border: 1px solid #bee3f8;
    }

    .reminder-banner.urgente {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border-color: #fbbf24;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }

    .reminder-icon { font-size: 2rem; }
    .reminder-info { flex: 1; }
    .reminder-title { font-weight: 600; color: #2d3748; display: block; }
    .reminder-detail { color: #718096; font-size: 0.9rem; }
    .reminder-detail .hora { color: #48bb78; font-weight: 600; }

    .btn-registrar {
      padding: 0.5rem 1.25rem;
      background: #48bb78;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-registrar:hover { background: #38a169; transform: scale(1.02); }

    /* Content Card */
    .content-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .header-info { display: flex; align-items: center; gap: 1rem; }
    .header-info h2 { margin: 0; font-size: 1.25rem; color: #2d3748; }

    .badge-success {
      padding: 0.25rem 0.75rem;
      background: #c6f6d5;
      color: #22543d;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .progress-text { color: #718096; font-weight: 600; }

    .btn-add-extra {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #edf2f7;
      color: #4a5568;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-add-extra:hover { background: #e2e8f0; }

    .card-content { padding: 1.5rem; }

    /* Meals Timeline */
    .meals-timeline {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .meal-card {
      display: flex;
      align-items: stretch;
      background: #f7fafc;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid transparent;
    }

    .meal-card:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .meal-card.proxima { border-color: #48bb78; background: #f0fff4; }
    .meal-card.completada { opacity: 0.7; }
    .meal-card.completada h4 { text-decoration: line-through; }

    .meal-time-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 0.75rem;
      background: rgba(72, 187, 120, 0.1);
    }

    .time-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #e2e8f0;
      border: 2px solid #a0aec0;
    }

    .time-dot.done { background: #48bb78; border-color: #48bb78; }

    .time-line {
      flex: 1;
      width: 2px;
      background: #e2e8f0;
      margin-top: 4px;
    }

    .meal-content {
      flex: 1;
      padding: 1rem;
    }

    .meal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .meal-type-time {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .tipo-desayuno { background: #fef5e7; color: #d68910; }
    .tipo-almuerzo { background: #ebf5fb; color: #2e86de; }
    .tipo-cena { background: #f4ecf7; color: #8e44ad; }
    .tipo-snack { background: #fef9e7; color: #f39c12; }
    .tipo-merienda { background: #fdecea; color: #e74c3c; }
    .tipo-colacion { background: #e8f8f5; color: #16a085; }

    .time { color: #718096; font-size: 0.85rem; }

    .meal-content h4 {
      margin: 0 0 0.5rem;
      color: #2d3748;
      font-size: 1.1rem;
    }

    .meal-macros {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .macro {
      font-size: 0.8rem;
      color: #718096;
    }

    .porciones {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: #a0aec0;
    }

    .meal-action {
      display: flex;
      align-items: center;
      padding: 0 0.75rem;
      color: #a0aec0;
    }

    /* Calendario */
    .calendario-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .calendario-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
    }

    .calendario-nav h3 { margin: 0; font-size: 1.25rem; }

    .nav-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
      transition: background 0.2s;
    }

    .nav-btn:hover { background: rgba(255,255,255,0.3); }

    .calendario-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
      padding: 1rem;
    }

    .calendario-dia {
      background: #f7fafc;
      border-radius: 10px;
      padding: 0.75rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      min-height: 100px;
    }

    .calendario-dia:hover { background: #edf2f7; }
    .calendario-dia.fuera-plan { opacity: 0.5; background: #f0f0f0; }
    .calendario-dia.hoy { border: 2px solid #48bb78; background: #f0fff4; }
    .calendario-dia.seleccionado { background: #c6f6d5; }

    .dia-header { margin-bottom: 0.5rem; }
    .dia-nombre { display: block; font-size: 0.7rem; color: #a0aec0; text-transform: uppercase; }
    .dia-numero { font-size: 1.25rem; font-weight: 700; color: #2d3748; display: block; }
    .dia-plan { 
      display: block; 
      font-size: 0.6rem; 
      color: #48bb78; 
      font-weight: 600;
      margin-top: 2px;
    }

    .comidas-mini {
      display: flex;
      justify-content: center;
      gap: 4px;
      margin: 0.5rem 0;
      flex-wrap: wrap;
    }

    .mini-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #e2e8f0;
    }

    .mini-dot.completada { background: #48bb78 !important; }
    .mini-dot.tipo-desayuno { background: #f6ad55; }
    .mini-dot.tipo-almuerzo { background: #63b3ed; }
    .mini-dot.tipo-cena { background: #b794f4; }
    .mini-dot.tipo-snack { background: #fbd38d; }
    .mini-dot.tipo-merienda { background: #fc8181; }
    .mini-more { font-size: 0.65rem; color: #718096; }
    .sin-comidas-mini { font-size: 0.6rem; color: #a0aec0; }

    .dia-stats { margin-top: 0.5rem; }
    .dia-calorias { font-size: 0.7rem; color: #718096; }

    .dia-detalle {
      padding: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    .dia-detalle h4 {
      margin: 0 0 1rem;
      color: #2d3748;
    }

    .comidas-dia {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .comida-mini-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f7fafc;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .comida-mini-card:hover { background: #edf2f7; }
    .comida-mini-card.completada { opacity: 0.6; }

    .tipo-mini {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .nombre-mini { flex: 1; font-size: 0.9rem; color: #2d3748; }
    .calorias-mini { font-size: 0.8rem; color: #718096; }
    .check-mini { color: #48bb78; font-size: 1rem !important; }
    .sin-comidas { text-align: center; color: #a0aec0; padding: 2rem; }

    /* Modal Overlay */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
      backdrop-filter: blur(4px);
    }

    /* Modal Detalle */
    .modal-detalle {
      background: white;
      border-radius: 20px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .modal-header {
      padding: 1.5rem;
      color: white;
      border-radius: 20px 20px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-info h2 { margin: 0.5rem 0 0; font-size: 1.5rem; }

    .tipo-badge-large {
      padding: 0.25rem 0.75rem;
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      font-size: 0.85rem;
    }

    .btn-close {
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
    }

    .modal-body { padding: 1.5rem; }

    .macros-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .macro-card {
      text-align: center;
      padding: 1rem 0.5rem;
      background: #f7fafc;
      border-radius: 12px;
    }

    .macro-card .macro-icon { font-size: 1.5rem; display: block; margin-bottom: 0.25rem; }
    .macro-card .macro-value { font-size: 1.25rem; font-weight: 700; color: #2d3748; display: block; }
    .macro-card .macro-label { font-size: 0.75rem; color: #718096; }

    .seccion {
      margin-bottom: 1.5rem;
    }

    .seccion h4 {
      margin: 0 0 0.75rem;
      color: #2d3748;
      font-size: 1rem;
    }

    .seccion p {
      margin: 0;
      color: #4a5568;
      line-height: 1.6;
    }

    .ingredientes-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .ingredientes-list li {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .ingredientes-list .cantidad { color: #48bb78; font-weight: 600; min-width: 80px; }
    .ingredientes-list .nombre { color: #4a5568; }

    .porciones-section { text-align: center; }

    .porciones-control {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      margin: 1rem 0;
    }

    .btn-porcion {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid #e2e8f0;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-porcion:hover:not(:disabled) { border-color: #48bb78; color: #48bb78; }
    .btn-porcion:disabled { opacity: 0.5; cursor: not-allowed; }

    .porciones-valor { font-size: 2rem; font-weight: 700; color: #2d3748; }

    .calorias-ajustadas {
      color: #718096;
      font-size: 0.9rem;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 1rem;
    }

    .btn-registrar-full {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-registrar-full:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(72,187,120,0.4); }

    .btn-desmarcar {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #fed7d7;
      color: #c53030;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    /* Modal Extra */
    .modal-extra {
      background: white;
      border-radius: 20px;
      width: 100%;
      max-width: 450px;
      animation: slideUp 0.3s ease;
    }

    .modal-header.extra {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #4a5568;
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #48bb78;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .btn-cancelar {
      padding: 0.75rem 1.5rem;
      background: #edf2f7;
      color: #4a5568;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-guardar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-guardar:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Loading & Empty States */
    .loading-state {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e2e8f0;
      border-top-color: #48bb78;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state {
      text-align: center;
      padding: 3rem;
    }

    .empty-icon { font-size: 4rem; display: block; margin-bottom: 1rem; opacity: 0.5; }

    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: #edf2f7;
      color: #4a5568;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .notas {
      background: #f7fafc;
      padding: 0.75rem;
      border-radius: 8px;
      color: #4a5568;
      font-size: 0.9rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .mis-comidas-container { padding: 1rem; }
      .stats-grid { grid-template-columns: 1fr; }
      .calendario-grid { gap: 4px; }
      .calendario-dia { min-height: 80px; padding: 0.5rem; }
      .macros-grid { grid-template-columns: repeat(2, 1fr); }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class MisComidasComponent implements OnInit {
    fechaHoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Vista actual
    vistaActual = signal<'lista' | 'calendario'>('lista');

    // Signals para el estado
    cargando = signal(false);
    caloriasHoy = signal(0);
    caloriasMeta = signal(2200);
    comidasRegistradas = signal(0);

    // Macros
    proteinasHoy = signal(0);
    proteinasMeta = signal(150);
    carbohidratosHoy = signal(0);
    carbohidratosMeta = signal(250);
    grasasHoy = signal(0);
    grasasMeta = signal(70);

    // Progreso computado
    progresoCaloriasPct = computed(() => Math.min((this.caloriasHoy() / this.caloriasMeta()) * 100, 100));
    progresoProteinasPct = computed(() => Math.min((this.proteinasHoy() / this.proteinasMeta()) * 100, 100));
    progresoCarbohidratosPct = computed(() => Math.min((this.carbohidratosHoy() / this.carbohidratosMeta()) * 100, 100));
    progresoGrasasPct = computed(() => Math.min((this.grasasHoy() / this.grasasMeta()) * 100, 100));

    // Comidas programadas del plan activo
    comidasProgramadas = signal<any[]>([]);
    
    // Calendario
    fechaSeleccionada = signal(new Date().toISOString().split('T')[0]);
    semanaOffset = signal(0);
    diasSemana = signal<any[]>([]);
    
    // Plan info para calendario
    planInfo = signal<any>(null);
    todasLasComidas = signal<any[]>([]);  // Todas las comidas del plan
    
    // Modal detalle
    modalDetalleAbierto = signal(false);
    comidaSeleccionada = signal<any>(null);
    porcionesRegistrar = signal(1);
    
    // Modal extra
    modalExtraAbierto = signal(false);
    comidaExtra = {
        tipoComida: 'SNACK',
        nombre: '',
        calorias: 0,
        proteinas: 0,
        carbohidratos: 0,
        grasas: 0,
        notas: ''
    };

    planActivo: any;

    // Computed para calorías ajustadas
    caloriasAjustadas = computed(() => {
        const comida = this.comidaSeleccionada();
        if (!comida) return 0;
        const calBase = comida.calorias || comida.comida?.calorias || 0;
        return Math.round(calBase * this.porcionesRegistrar());
    });

    // Computed para próxima comida
    proximaComida = computed(() => {
        const ahora = new Date();
        const horaActual = ahora.getHours() * 60 + ahora.getMinutes();
        
        const comidasPendientes = this.comidasProgramadas()
            .filter(c => !c.completada)
            .sort((a, b) => {
                const horaA = this.horaAMinutos(a.horaSugerida);
                const horaB = this.horaAMinutos(b.horaSugerida);
                return horaA - horaB;
            });
        
        // Buscar la próxima comida por hora
        for (const comida of comidasPendientes) {
            const horaComida = this.horaAMinutos(comida.horaSugerida);
            if (horaComida >= horaActual - 30) {
                return comida;
            }
        }
        
        return comidasPendientes[0] || null;
    });

    // Computed para comidas del día seleccionado
    comidasDiaSeleccionado = computed(() => {
        const fecha = this.fechaSeleccionada();
        const hoy = new Date().toISOString().split('T')[0];
        const planData = this.planInfo();
        const todasComidas = this.todasLasComidas();
        
        // Si es hoy, usar las comidas programadas de hoy
        if (fecha === hoy) {
            return this.comidasProgramadas();
        }
        
        // Si tenemos datos del plan, calcular el día correspondiente
        if (planData?.fechaInicio && todasComidas.length > 0) {
            const fechaInicio = new Date(planData.fechaInicio);
            const fechaSelec = new Date(fecha + 'T12:00:00');
            const diffTime = fechaSelec.getTime() - fechaInicio.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const numeroDia = diffDays + 1;
            
            if (numeroDia > 0 && numeroDia <= (planData.diasTotales || 999)) {
                const comidas = todasComidas.filter(c => c.numeroDia === numeroDia);
                
                // Marcar como completadas si el día ya pasó
                if (fecha < hoy) {
                    return comidas.map(c => ({...c, completada: true}));
                }
                return comidas;
            }
        }
        
        return [];
    });

    // Computed para mes actual
    mesActual = computed(() => {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + this.semanaOffset() * 7);
        return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    });

    constructor(
        private metasService: MetasService,
        private notificationService: NotificationService,
        private mockData: MockDataService
    ) {
        this.comidasProgramadas = this.mockData.comidasProgramadas;
        this.planActivo = computed(() => this.mockData.planActivo());
    }

    ngOnInit(): void {
        this.cargarComidasProgramadas();
        this.cargarPlanActivo();
        this.generarDiasSemana();
    }

    // ========================================
    // MÉTODOS DE VISTA
    // ========================================

    cambiarVista(vista: 'lista' | 'calendario'): void {
        this.vistaActual.set(vista);
        if (vista === 'calendario') {
            this.cargarTodasLasComidasDelPlan();
        }
    }

    // ========================================
    // CARGAR TODAS LAS COMIDAS DEL PLAN
    // ========================================
    
    cargarTodasLasComidasDelPlan(): void {
        // Usar el nuevo endpoint de calendario semanal
        this.metasService.obtenerCalendarioSemanal().subscribe({
            next: (response: any) => {
                console.log('📥 [MisComidas] Calendario semanal:', response);
                
                // Manejar respuesta directa o envuelta en ApiResponse
                const data = response.data || response;
                
                if (data && data.dias) {
                    // El endpoint devuelve datos por día
                    const diasCalendario = data.dias;
                    
                    // Convertir a formato plano de comidas con fecha y numeroDia
                    const todasLasComidas: any[] = [];
                    
                    if (Array.isArray(diasCalendario)) {
                        diasCalendario.forEach((dia: any) => {
                            const comidas = dia.comidas || [];
                            comidas.forEach((comida: any) => {
                                todasLasComidas.push({
                                    ...comida,
                                    numeroDia: dia.diaPlan || dia.numeroDia,
                                    fecha: dia.fecha,
                                    completada: comida.registrada || false,
                                    registroId: comida.registroId,
                                    comidaNombre: comida.nombre || comida.comidaNombre,
                                    calorias: comida.calorias || 0
                                });
                            });
                        });
                    }
                    
                    console.log('📥 [MisComidas] Comidas del calendario:', todasLasComidas);
                    this.todasLasComidas.set(todasLasComidas);
                    
                    // Información del plan
                    this.planInfo.set({
                        planId: data.planId || this.planActivo()?.planId,
                        fechaInicio: data.fechaInicio,
                        fechaFin: data.fechaFin,
                        diasTotales: data.duracionPlanDias || 7,
                        planNombre: data.nombrePlan || this.planActivo()?.nombre || 'Plan Nutricional'
                    });
                    
                    this.generarDiasSemana();
                } else {
                    console.log('⚠️ [MisComidas] Respuesta de calendario sin días, usando fallback');
                    this.cargarCalendarioFallback();
                }
            },
            error: (err) => {
                console.log('⚠️ [MisComidas] Error cargando calendario semanal:', err);
                // Fallback al método anterior
                this.cargarCalendarioFallback();
            }
        });
    }
    
    private cargarCalendarioFallback(): void {
        // Intentar con el endpoint de todas las comidas del plan base
        this.metasService.obtenerTodasLasComidasDelPlan().subscribe({
            next: (response: any) => {
                console.log('📥 [MisComidas] Fallback - Comidas del plan:', response);
                
                // Manejar respuesta directa o envuelta
                const data = response.data || response;
                
                if (data && (data.comidas || Array.isArray(data))) {
                    const comidas = data.comidas || data;
                    this.todasLasComidas.set(comidas);
                    
                    if (data.planInfo) {
                        this.planInfo.set(data.planInfo);
                    }
                    
                    this.generarDiasSemana();
                } else {
                    // Último fallback: usar las comidas de hoy
                    this.usarComidasMockParaCalendario();
                }
            },
            error: () => {
                // Último fallback: usar las comidas de hoy como template
                this.usarComidasMockParaCalendario();
            }
        });
    }
    
    private usarComidasMockParaCalendario(): void {
        // Generar comidas mock para el calendario basadas en las comidas de hoy
        const comidasHoy = this.comidasProgramadas();
        const diasPlan = 7; // Por defecto 7 días
        
        const todasLasComidas: any[] = [];
        
        for (let dia = 1; dia <= diasPlan; dia++) {
            comidasHoy.forEach(comida => {
                todasLasComidas.push({
                    ...comida,
                    id: comida.id * 100 + dia,
                    numeroDia: dia,
                    completada: false
                });
            });
        }
        
        this.todasLasComidas.set(todasLasComidas);
        this.planInfo.set({
            planId: 1,
            fechaInicio: new Date().toISOString().split('T')[0],
            diasTotales: diasPlan,
            planNombre: 'Plan de Ejemplo'
        });
        
        this.generarDiasSemana();
    }

    // ========================================
    // CALENDARIO
    // ========================================

    generarDiasSemana(): void {
        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1 + this.semanaOffset() * 7);
        
        const dias = [];
        const nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        
        const planData = this.planInfo();
        const todasComidas = this.todasLasComidas();
        const fechaInicioPlan = planData?.fechaInicio ? new Date(planData.fechaInicio) : null;
        
        for (let i = 0; i < 7; i++) {
            const fecha = new Date(inicioSemana);
            fecha.setDate(inicioSemana.getDate() + i);
            
            const fechaStr = fecha.toISOString().split('T')[0];
            const esHoy = fechaStr === hoy.toISOString().split('T')[0];
            
            // Buscar comidas del día
            let comidasDelDia: any[] = [];
            
            // Primero intentar buscar por fecha exacta (nuevo formato de calendario semanal)
            comidasDelDia = todasComidas.filter(c => c.fecha === fechaStr);
            
            // Si no hay por fecha, intentar por número de día del plan (formato antiguo)
            if (comidasDelDia.length === 0 && fechaInicioPlan && todasComidas.length > 0) {
                const diffTime = fecha.getTime() - fechaInicioPlan.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const numeroDia = diffDays + 1; // 1-based
                
                if (numeroDia > 0 && numeroDia <= (planData?.diasTotales || 999)) {
                    comidasDelDia = todasComidas.filter(c => c.numeroDia === numeroDia);
                }
            }
            
            // Si es hoy y no hay comidas, usar las programadas de hoy
            if (comidasDelDia.length === 0 && esHoy) {
                comidasDelDia = this.comidasProgramadas();
            }
            
            dias.push({
                fecha: fechaStr,
                numero: fecha.getDate(),
                nombreCorto: nombresDias[i],
                esHoy,
                comidas: comidasDelDia,
                numeroDiaPlan: this.calcularNumeroDiaPlan(fecha)
            });
        }
        
        this.diasSemana.set(dias);
    }
    
    private calcularNumeroDiaPlan(fecha: Date): number {
        const planData = this.planInfo();
        if (!planData?.fechaInicio) return 0;
        
        const fechaInicio = new Date(planData.fechaInicio);
        const diffTime = fecha.getTime() - fechaInicio.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1;
    }

    semanaAnterior(): void {
        this.semanaOffset.update(o => o - 1);
        this.generarDiasSemana();
    }

    semanaSiguiente(): void {
        this.semanaOffset.update(o => o + 1);
        this.generarDiasSemana();
    }

    seleccionarDia(dia: any): void {
        this.fechaSeleccionada.set(dia.fecha);
    }

    calcularCaloriasDia(dia: any): number {
        return dia.comidas
            .filter((c: any) => c.completada)
            .reduce((sum: number, c: any) => sum + (c.calorias || c.comida?.calorias || 0), 0);
    }

    formatearFechaCompleta(fecha: string): string {
        const d = new Date(fecha + 'T12:00:00');
        return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    }

    // ========================================
    // RECORDATORIOS
    // ========================================

    esHoraDeComida(): boolean {
        const proxima = this.proximaComida();
        if (!proxima?.horaSugerida) return false;
        
        const ahora = new Date();
        const horaActual = ahora.getHours() * 60 + ahora.getMinutes();
        const horaComida = this.horaAMinutos(proxima.horaSugerida);
        
        return Math.abs(horaActual - horaComida) <= 15;
    }

    esProximaComida(comida: any): boolean {
        const proxima = this.proximaComida();
        return proxima && proxima.id === comida.id;
    }

    private horaAMinutos(hora: string): number {
        if (!hora) return 0;
        const [h, m] = hora.split(':').map(Number);
        return h * 60 + (m || 0);
    }

    // ========================================
    // MODAL DETALLE
    // ========================================

    abrirDetalleComida(comida: any): void {
        this.comidaSeleccionada.set(comida);
        this.porcionesRegistrar.set(comida.porciones || 1);
        this.modalDetalleAbierto.set(true);
    }

    cerrarModalDetalle(): void {
        this.modalDetalleAbierto.set(false);
        this.comidaSeleccionada.set(null);
    }

    ajustarPorciones(delta: number): void {
        this.porcionesRegistrar.update(p => Math.max(0.5, p + delta));
    }

    getColorTipoComida(tipo: string): string {
        const colores: any = {
            'DESAYUNO': 'linear-gradient(135deg, #f6ad55, #ed8936)',
            'ALMUERZO': 'linear-gradient(135deg, #63b3ed, #3182ce)',
            'CENA': 'linear-gradient(135deg, #b794f4, #805ad5)',
            'SNACK': 'linear-gradient(135deg, #fbd38d, #f6ad55)',
            'MERIENDA': 'linear-gradient(135deg, #fc8181, #e53e3e)',
            'COLACION': 'linear-gradient(135deg, #68d391, #38a169)'
        };
        return colores[tipo] || 'linear-gradient(135deg, #48bb78, #38a169)';
    }

    registrarComida(): void {
        const comida = this.comidaSeleccionada();
        if (!comida) return;
        
        comida.completada = true;
        comida.porciones = this.porcionesRegistrar();
        this.marcarComidaCompletada(comida);
        this.cerrarModalDetalle();
    }

    desmarcarComida(): void {
        const comida = this.comidaSeleccionada();
        if (!comida) return;
        
        comida.completada = false;
        this.marcarComidaCompletada(comida);
        this.cerrarModalDetalle();
    }

    // ========================================
    // MODAL COMIDA EXTRA
    // ========================================

    abrirModalComidaExtra(): void {
        this.comidaExtra = {
            tipoComida: 'SNACK',
            nombre: '',
            calorias: 0,
            proteinas: 0,
            carbohidratos: 0,
            grasas: 0,
            notas: ''
        };
        this.modalExtraAbierto.set(true);
    }

    cerrarModalExtra(): void {
        this.modalExtraAbierto.set(false);
    }

    guardarComidaExtra(): void {
        const horaActual = new Date().toTimeString().split(' ')[0].substring(0, 5) + ':00';
        
        // Construir objeto según el API spec
        const dataExtra: any = {
            nombreComida: this.comidaExtra.nombre,
            tipoComidaNombre: this.comidaExtra.tipoComida,
            calorias: this.comidaExtra.calorias || 0,
            proteinas: this.comidaExtra.proteinas || 0,
            carbohidratos: this.comidaExtra.carbohidratos || 0,
            grasas: this.comidaExtra.grasas || 0,
            notas: this.comidaExtra.notas,
            fecha: new Date().toISOString().split('T')[0],
            hora: horaActual,
            porciones: 1
        };
        
        console.log('📤 [MisComidas] Registrando comida extra:', dataExtra);
        
        // Guardar en el API
        this.metasService.registrarComidaExtra(dataExtra).subscribe({
            next: (response: any) => {
                console.log('✅ [MisComidas] Comida extra registrada:', response);
                
                // Manejar respuesta directa o envuelta
                const data = response.data || response;
                
                // Agregar a la lista local
                const nuevaComida = {
                    id: data.id || data.comidaId || Date.now(),
                    comidaId: data.comidaId,
                    registroId: data.id,
                    tipoComida: this.comidaExtra.tipoComida,
                    comidaNombre: this.comidaExtra.nombre,
                    calorias: dataExtra.calorias,
                    proteinas: dataExtra.proteinas,
                    carbohidratos: dataExtra.carbohidratos,
                    grasas: dataExtra.grasas,
                    notas: dataExtra.notas,
                    completada: true,
                    esExtra: true,
                    porciones: 1
                };
                
                const comidas = [...this.comidasProgramadas(), nuevaComida];
                this.mockData.comidasProgramadas.set(comidas);
                
                this.actualizarEstadisticas();
                this.notificationService.showSuccess(`✓ ${nuevaComida.comidaNombre} agregada`);
                this.cerrarModalExtra();
            },
            error: (err) => {
                console.error('❌ [MisComidas] Error registrando comida extra:', err);
                
                // Fallback: agregar solo localmente
                const nuevaComida = {
                    id: Date.now(),
                    tipoComida: this.comidaExtra.tipoComida,
                    comidaNombre: this.comidaExtra.nombre,
                    calorias: dataExtra.calorias,
                    proteinas: dataExtra.proteinas,
                    carbohidratos: dataExtra.carbohidratos,
                    grasas: dataExtra.grasas,
                    notas: dataExtra.notas,
                    completada: true,
                    esExtra: true,
                    porciones: 1
                };
                
                const comidas = [...this.comidasProgramadas(), nuevaComida];
                this.mockData.comidasProgramadas.set(comidas);
                
                this.actualizarEstadisticas();
                this.notificationService.showSuccess(`✓ ${nuevaComida.comidaNombre} agregada (local)`);
                this.cerrarModalExtra();
            }
        });
    }

    // ========================================
    // CARGA DE DATOS
    // ========================================

    cargarComidasProgramadas(): void {
        this.cargando.set(true);
        
        // Usar el endpoint que ya incluye macros completos e ingredientes
        this.metasService.obtenerPlanHoyConEstado().subscribe({
          next: (response: any) => {
            console.log('📥 [MisComidas] Plan hoy con estado y macros:', response);
            
            // Manejar respuesta directa o envuelta en ApiResponse
            const data = response.data || response;
            
            if (data && (data.comidas || data.nombrePlan)) {
              // Actualizar información del plan
              if (data.nombrePlan) {
                this.mockData.planActivo.set({
                  id: data.usuarioPlanId || this.planActivo()?.id,
                  nombre: data.nombrePlan,
                  diaActual: data.diaActual,
                  diaPlan: data.diaPlan,
                  duracionDias: data.duracionDias
                });
              }
              
              // Actualizar metas desde la respuesta si vienen incluidas
              if (data.caloriasObjetivo) this.caloriasMeta.set(data.caloriasObjetivo);
              if (data.proteinasObjetivo) this.proteinasMeta.set(data.proteinasObjetivo);
              if (data.carbohidratosObjetivo) this.carbohidratosMeta.set(data.carbohidratosObjetivo);
              if (data.grasasObjetivo) this.grasasMeta.set(data.grasasObjetivo);
              
              // Actualizar consumo actual si viene incluido
              if (data.caloriasConsumidas !== undefined) this.caloriasHoy.set(data.caloriasConsumidas);
              if (data.proteinasConsumidas !== undefined) this.proteinasHoy.set(data.proteinasConsumidas);
              // Nota: el API usa "carbohidratosConsumidos" (no "carbohidratosConsumidas")
              if (data.carbohidratosConsumidos !== undefined) this.carbohidratosHoy.set(data.carbohidratosConsumidos);
              if (data.carbohidratosConsumidas !== undefined) this.carbohidratosHoy.set(data.carbohidratosConsumidas);
              if (data.grasasConsumidas !== undefined) this.grasasHoy.set(data.grasasConsumidas);
              
              // Mapear comidas con todos los datos
              const comidas = data.comidas || [];
              const comidasMapeadas = comidas.map((comida: any) => ({
                id: comida.comidaId || comida.id,
                comidaId: comida.comidaId || comida.id,
                comidaNombre: comida.nombre || comida.comidaNombre,
                tipoComida: comida.tipoComida,
                tipoComidaId: comida.tipoComidaId,
                // Macronutrientes
                calorias: comida.calorias || 0,
                proteinas: comida.proteinas || 0,
                carbohidratos: comida.carbohidratos || 0,
                grasas: comida.grasas || 0,
                // Descripción
                descripcion: comida.descripcion,
                tiempoPreparacionMinutos: comida.tiempoPreparacionMinutos,
                // Estado
                completada: comida.registrada || false,
                registroId: comida.registroId || null,
                porciones: comida.porciones || 1,
                notas: comida.notas,
                // Datos adicionales para el modal
                comida: {
                  id: comida.comidaId || comida.id,
                  nombre: comida.nombre || comida.comidaNombre,
                  tipoComida: comida.tipoComida,
                  descripcion: comida.descripcion,
                  instrucciones: comida.instrucciones,
                  ingredientes: comida.ingredientes || [],
                  calorias: comida.calorias || 0,
                  proteinas: comida.proteinas || 0,
                  carbohidratos: comida.carbohidratos || 0,
                  grasas: comida.grasas || 0
                },
                ingredientes: comida.ingredientes || []
              }));
              
              console.log('📥 [MisComidas] Comidas mapeadas:', comidasMapeadas);
              this.mockData.comidasProgramadas.set(comidasMapeadas);
              this.actualizarEstadisticas();
            } else {
              console.warn('⚠️ [MisComidas] No hay comidas en el plan de hoy');
              this.mockData.comidasProgramadas.set([]);
            }
            this.cargando.set(false);
          },
          error: (err) => {
            console.error('❌ [MisComidas] Error cargando comidas:', err);
            this.notificationService.showError('Error al cargar comidas del plan');
            this.cargando.set(false);
          }
        });
    }

    cargarPlanActivo(): void {
        this.metasService.obtenerPlanesActivos().subscribe({
            next: (response) => {
                if (response.success && response.data && response.data.length > 0) {
                    const plan = response.data[0];
                    
                    // Los objetivos nutricionales pueden venir del objeto plan.objetivo
                    const objetivo = plan.plan?.objetivo || plan.objetivo;
                    
                    const planData = {
                        id: plan.id,
                        planId: plan.plan?.id || plan.planId,
                        nombre: plan.planNombre || plan.plan?.nombre || 'Plan Nutricional',
                        descripcion: plan.planDescripcion || plan.plan?.descripcion || '',
                        fechaInicio: plan.fechaInicio,
                        diasTotales: plan.planDuracionDias || plan.plan?.duracionDias || plan.diasTotales || 7,
                        // Objetivos nutricionales desde el objeto objetivo del plan
                        caloriasObjetivo: objetivo?.caloriasObjetivo || plan.caloriasObjetivo || 2200,
                        proteinasObjetivo: objetivo?.proteinasObjetivo || plan.proteinasObjetivo || 150,
                        carbohidratosObjetivo: objetivo?.carbohidratosObjetivo || plan.carbohidratosObjetivo || 250,
                        grasasObjetivo: objetivo?.grasasObjetivo || plan.grasasObjetivo || 70
                    };
                    
                    console.log('📋 [MisComidas] Plan activo cargado:', planData);
                    
                    this.mockData.planActivo.set(planData);
                    this.planInfo.set(planData);
                    
                    // Actualizar metas
                    if (planData.caloriasObjetivo) this.caloriasMeta.set(planData.caloriasObjetivo);
                    if (planData.proteinasObjetivo) this.proteinasMeta.set(planData.proteinasObjetivo);
                    if (planData.carbohidratosObjetivo) this.carbohidratosMeta.set(planData.carbohidratosObjetivo);
                    if (planData.grasasObjetivo) this.grasasMeta.set(planData.grasasObjetivo);
                }
            },
            error: (error) => console.error('Error al cargar plan activo:', error)
        });
    }

    // ========================================
    // MARCAR COMIDA
    // ========================================

    marcarComidaCompletada(comida: any): void {
        const nombre = comida.comida?.nombre || comida.comidaNombre || comida.nombre || 'Comida';
        
        if (comida.completada) {
            this.mockData.marcarComidaCompletada(comida.id);
            
            const fechaHoy = new Date().toISOString().split('T')[0];
            const horaActual = new Date().toTimeString().split(' ')[0].substring(0, 5) + ':00';
            
            // Construir requestBody según la especificación del API
            const requestBody: any = {
                comidaId: comida.comidaId || comida.comida?.id || comida.id,
                fecha: fechaHoy,
                hora: horaActual,
                porciones: comida.porciones || 1
            };
            
            // Agregar usuarioPlanId si está disponible
            const planId = this.planActivo()?.id || comida.usuarioPlanId;
            if (planId) {
                requestBody.usuarioPlanId = planId;
            }
            
            // Agregar tipoComidaId o tipoComidaNombre según lo disponible
            if (comida.tipoComidaId) {
                requestBody.tipoComidaId = comida.tipoComidaId;
            } else if (comida.tipoComida) {
                requestBody.tipoComidaNombre = comida.tipoComida;
            }
            
            console.log('📤 [MisComidas] Registrando comida:', requestBody);
            
            this.metasService.registrarComidaConsumida(requestBody).subscribe({
                next: (response: any) => {
                    // Manejar respuesta directa o envuelta
                    const data = response.data || response;
                    if (data.id) {
                        comida.registroId = data.id;
                    }
                    console.log('✅ [MisComidas] Comida registrada:', data);
                    this.notificationService.showSuccess(`✓ ${nombre} registrada`);
                    this.actualizarEstadisticas();
                },
                error: (err) => {
                    console.error('❌ [MisComidas] Error registrando comida:', err);
                    this.notificationService.showSuccess(`✓ ${nombre} registrada (local)`);
                    this.actualizarEstadisticas();
                }
            });
        } else {
            if (comida.registroId) {
                console.log('📤 [MisComidas] Eliminando registro:', comida.registroId);
                this.metasService.eliminarRegistroComida(comida.registroId).subscribe({
                    next: () => {
                        comida.registroId = null;
                        this.mockData.desmarcarComidaCompletada?.(comida.id);
                        this.notificationService.showSuccess(`${nombre} desmarcada`);
                        this.actualizarEstadisticas();
                    },
                    error: (err) => {
                        console.error('❌ [MisComidas] Error desmarcando comida:', err);
                        comida.completada = true;
                        this.notificationService.showError('Error al desmarcar');
                    }
                });
            } else {
                this.mockData.desmarcarComidaCompletada?.(comida.id);
                this.actualizarEstadisticas();
            }
        }
    }

    actualizarEstadisticas(): void {
        const comidas = this.comidasProgramadas();
        const completadas = comidas.filter(c => c.completada);
        this.comidasRegistradas.set(completadas.length);
        
        // Calcular macros consumidos
        this.caloriasHoy.set(completadas.reduce((sum, c) => sum + (c.calorias || c.comida?.calorias || 0), 0));
        this.proteinasHoy.set(completadas.reduce((sum, c) => sum + (c.proteinas || c.comida?.proteinas || 0), 0));
        this.carbohidratosHoy.set(completadas.reduce((sum, c) => sum + (c.carbohidratos || c.comida?.carbohidratos || 0), 0));
        this.grasasHoy.set(completadas.reduce((sum, c) => sum + (c.grasas || c.comida?.grasas || 0), 0));
    }

    formatearTipoComida(tipo: string): string {
        const tipos: any = {
            'DESAYUNO': 'Desayuno',
            'ALMUERZO': 'Almuerzo',
            'CENA': 'Cena',
            'SNACK': 'Snack',
            'MERIENDA': 'Merienda',
            'COLACION': 'Colación',
            'PRE_ENTRENAMIENTO': 'Pre-Entreno',
            'POST_ENTRENAMIENTO': 'Post-Entreno'
        };
        return tipos[tipo] || tipo || 'Comida';
    }
}
