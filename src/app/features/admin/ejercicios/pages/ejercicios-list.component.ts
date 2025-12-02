import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { EjercicioService } from '../../../../core/services/ejercicio.service';
import { EtiquetaService } from '../../../../core/services/etiqueta.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  Ejercicio,
  TipoEjercicio,
  GrupoMuscular,
  NivelDificultad,
  TIPO_EJERCICIO_LABELS,
  GRUPO_MUSCULAR_LABELS,
  NIVEL_DIFICULTAD_LABELS,
  TIPO_EJERCICIO_ICONS
} from '../../../../core/models/ejercicio.model';
import { Etiqueta, PageResponse } from '../../../../core/models/etiqueta.model';
import { ApiResponse } from '../../../../core/models/common.model';

@Component({
  selector: 'app-ejercicios-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="ejercicios-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon>fitness_center</mat-icon>
            Gestión de Ejercicios
          </h1>
          <p class="page-subtitle">Crea, edita y gestiona todos los ejercicios desde aquí.</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card green-border">
          <div class="stat-header">
            <span class="stat-title">Total Ejercicios</span>
            <div class="stat-icon green">💪</div>
          </div>
          <div class="stat-value">{{ totalElements }}</div>
          <div class="stat-footer">
            <span class="stat-subtitle">registrados</span>
          </div>
        </div>

        <div class="stat-card yellow-border">
          <div class="stat-header">
            <span class="stat-title">Tipos</span>
            <div class="stat-icon yellow">🎯</div>
          </div>
          <div class="stat-value">{{ tiposEjercicio.length }}</div>
          <div class="stat-footer">
            <span class="stat-subtitle">categorías</span>
          </div>
        </div>

        <div class="stat-card purple-border">
          <div class="stat-header">
            <span class="stat-title">Grupos Musculares</span>
            <div class="stat-icon purple">🏋️</div>
          </div>
          <div class="stat-value">{{ gruposMusculares.length }}</div>
          <div class="stat-footer">
            <span class="stat-subtitle">disponibles</span>
          </div>
        </div>

        <div class="stat-card red-border">
          <div class="stat-header">
            <span class="stat-title">Niveles</span>
            <div class="stat-icon red">⭐</div>
          </div>
          <div class="stat-value">{{ nivelesDificultad.length }}</div>
          <div class="stat-footer">
            <span class="stat-subtitle">dificultad</span>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="filters-card">
        <div class="search-section">
          <div class="search-input-wrapper">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              placeholder="Buscar ejercicios por nombre..."
              class="search-input"
            />
            
          </div>
          <button (click)="abrirModalCrear()" class="btn-primary">
          <span>+</span>
          Nuevo Ejercicio
          </button>
        </div>

        <div class="filters-row">
          <!-- Filtro Tipo -->
          <div class="filter-group">
            <label class="filter-label">Tipo:</label>
            <select
              [(ngModel)]="tipoFiltro"
              (change)="aplicarFiltros()"
              class="filter-select"
            >
              <option value="">Todos</option>
              @for (tipo of tiposEjercicio; track tipo) {
                <option [value]="tipo">{{ getTipoIcon(tipo) }} {{ getTipoLabel(tipo) }}</option>
              }
            </select>
          </div>

          <!-- Filtro Grupo Muscular -->
          <div class="filter-group">
            <label class="filter-label">Grupo Muscular:</label>
            <select
              [(ngModel)]="grupoFiltro"
              (change)="aplicarFiltros()"
              class="filter-select"
            >
              <option value="">Todos</option>
              @for (grupo of gruposMusculares; track grupo) {
                <option [value]="grupo">{{ getGrupoLabel(grupo) }}</option>
              }
            </select>
          </div>

          <!-- Filtro Nivel -->
          <div class="filter-group">
            <label class="filter-label">Nivel:</label>
            <select
              [(ngModel)]="nivelFiltro"
              (change)="aplicarFiltros()"
              class="filter-select"
            >
              <option value="">Todos</option>
              @for (nivel of nivelesDificultad; track nivel) {
                <option [value]="nivel">{{ getNivelLabel(nivel) }}</option>
              }
            </select>
          </div>

          <button
            (click)="limpiarFiltros()"
            class="btn-clear-filters"
            [disabled]="!tipoFiltro && !grupoFiltro && !nivelFiltro && !searchTerm"
          >
            🔄 Limpiar
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-card">
          <div class="spinner"></div>
          <p>Cargando ejercicios...</p>
        </div>
      }

      <!-- Desktop Table -->
      @if (!loading() && ejercicios().length > 0) {
        <div class="table-card desktop-only">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Grupo Muscular</th>
                <th>Nivel</th>
                <th>Calorías/min</th>
                <th>Duración</th>
                <th>Etiquetas</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (ejercicio of ejercicios(); track ejercicio.id) {
                <tr>
                  <td>
                    <span class="table-id">#{{ ejercicio.id }}</span>
                  </td>
                  <td>
                    <div class="table-name">
                      <span class="name-icon">{{ getTipoIcon(ejercicio.tipoEjercicio) }}</span>
                      <span>{{ ejercicio.nombre }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-type">
                      {{ getTipoLabel(ejercicio.tipoEjercicio) }}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-muscle">
                      {{ getGrupoLabel(ejercicio.grupoMuscular) }}
                    </span>
                  </td>
                  <td>
                    <span [class]="'badge badge-level badge-' + ejercicio.nivelDificultad.toLowerCase()">
                      {{ getNivelLabel(ejercicio.nivelDificultad) }}
                    </span>
                  </td>
                  <td>
                    <span class="calories-value">{{ ejercicio.caloriasQuemadasPorMinuto || '-' }}</span>
                  </td>
                  <td>
                    <span class="duration-text">{{ ejercicio.duracionEstimadaMinutos || '-' }} min</span>
                  </td>
                  <td>
                    <div class="tags-container">
                      @for (etiqueta of ejercicio.etiquetas.slice(0, 2); track etiqueta.id) {
                        <span class="tag">{{ etiqueta.nombre }}</span>
                      }
                      @if (ejercicio.etiquetas.length > 2) {
                        <span class="tag-more">+{{ ejercicio.etiquetas.length - 2 }}</span>
                      }
                    </div>
                  </td>
                  <td class="text-right">
                    <div class="action-buttons">
                      <button
                        (click)="abrirModalEditar(ejercicio)"
                        class="btn-action edit"
                        title="Editar"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        (click)="confirmarEliminar(ejercicio)"
                        class="btn-action delete"
                        title="Eliminar"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <!-- Pagination Desktop -->
          @if (totalPages > 1) {
            <div class="pagination">
              <div class="pagination-info">
                Mostrando <strong>{{ ejercicios().length }}</strong> de <strong>{{ totalElements }}</strong> resultados
              </div>
              <div class="pagination-controls">
                <button
                  (click)="cambiarPagina(currentPage - 1)"
                  [disabled]="currentPage === 0"
                  class="btn-pagination"
                >
                  Anterior
                </button>
                <span class="pagination-current">
                  Página {{ currentPage + 1 }} de {{ totalPages }}
                </span>
                <button
                  (click)="cambiarPagina(currentPage + 1)"
                  [disabled]="currentPage >= totalPages - 1"
                  class="btn-pagination"
                >
                  Siguiente
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Mobile Cards -->
        <div class="mobile-only">
          @for (ejercicio of ejercicios(); track ejercicio.id) {
            <div class="mobile-card">
              <div class="mobile-card-header">
                <div class="mobile-card-title">
                  <span class="mobile-icon">{{ getTipoIcon(ejercicio.tipoEjercicio) }}</span>
                  <div>
                    <div class="mobile-name">{{ ejercicio.nombre }}</div>
                    <div class="mobile-id">#{{ ejercicio.id }}</div>
                  </div>
                </div>
                <span class="badge badge-type">
                  {{ getTipoLabel(ejercicio.tipoEjercicio) }}
                </span>
              </div>

              <div class="mobile-badges">
                <span class="badge badge-muscle">
                  {{ getGrupoLabel(ejercicio.grupoMuscular) }}
                </span>
                <span [class]="'badge badge-level badge-' + ejercicio.nivelDificultad.toLowerCase()">
                  {{ getNivelLabel(ejercicio.nivelDificultad) }}
                </span>
              </div>

              <div class="mobile-info-grid">
                <div class="info-item">
                  <span class="info-label">Calorías/min</span>
                  <span class="info-value">{{ ejercicio.caloriasQuemadasPorMinuto || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Duración</span>
                  <span class="info-value">{{ ejercicio.duracionEstimadaMinutos || '-' }} min</span>
                </div>
              </div>

              @if (ejercicio.equipoNecesario) {
                <div class="mobile-equipment">
                  <span class="equipment-icon">🏋️</span>
                  <span class="equipment-text">{{ ejercicio.equipoNecesario }}</span>
                </div>
              }

              @if (ejercicio.etiquetas.length > 0) {
                <div class="mobile-tags">
                  @for (etiqueta of ejercicio.etiquetas; track etiqueta.id) {
                    <span class="tag">{{ etiqueta.nombre }}</span>
                  }
                </div>
              }

              <div class="mobile-card-actions">
                <button
                  (click)="abrirModalEditar(ejercicio)"
                  class="btn-mobile edit"
                >
                  ✏️ Editar
                </button>
                <button
                  (click)="confirmarEliminar(ejercicio)"
                  class="btn-mobile delete"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          }

          <!-- Pagination Mobile -->
          @if (totalPages > 1) {
            <div class="mobile-pagination">
              <div class="mobile-pagination-info">
                Página {{ currentPage + 1 }} de {{ totalPages }}
                <span>({{ ejercicios().length }} de {{ totalElements }} resultados)</span>
              </div>
              <div class="mobile-pagination-controls">
                <button
                  (click)="cambiarPagina(currentPage - 1)"
                  [disabled]="currentPage === 0"
                  class="btn-pagination"
                >
                  ← Anterior
                </button>
                <button
                  (click)="cambiarPagina(currentPage + 1)"
                  [disabled]="currentPage >= totalPages - 1"
                  class="btn-pagination"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Empty State -->
      @if (!loading() && ejercicios().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">💪</div>
          <h3>No hay ejercicios registrados</h3>
          <p>Comienza creando tu primer ejercicio para el catálogo</p>
          <button (click)="abrirModalCrear()" class="btn-primary">
            <span>+</span>
            Nuevo Ejercicio
          </button>
        </div>
      }

      <!-- Modal Crear/Editar -->
      @if (mostrarModal) {
        <div class="modal-overlay" (click)="cerrarModal()">
          <div class="modal-content large" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ ejercicioEditando ? 'Editar Ejercicio' : 'Nuevo Ejercicio' }}</h2>
            </div>

            <div class="modal-body">
              <!-- Información Básica -->
              <div class="form-section-title">Información Básica</div>

              <div class="form-group">
                <label>
                  Nombre <span class="required">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="formulario.nombre"
                  class="form-input"
                  placeholder="Ej: Sentadillas"
                />
              </div>

              <div class="form-group">
                <label>Descripción</label>
                <textarea
                  [(ngModel)]="formulario.descripcion"
                  rows="3"
                  class="form-input"
                  placeholder="Descripción del ejercicio y cómo realizarlo..."
                ></textarea>
              </div>

              <!-- Clasificación -->
              <div class="form-section-title">Clasificación</div>

              <div class="form-row">
                <div class="form-group">
                  <label>
                    Tipo de Ejercicio <span class="required">*</span>
                  </label>
                  <select
                    [(ngModel)]="formulario.tipoEjercicio"
                    class="form-input"
                    (change)="onTipoEjercicioChange()"
                  >
                    <option value="">Selecciona un tipo</option>
                    @for (tipo of tiposEjercicio; track tipo) {
                      <option [value]="tipo">
                        {{ getTipoIcon(tipo) }} {{ getTipoLabel(tipo) }}
                      </option>
                    }
                    <option value="__CUSTOM__">➕ Agregar nuevo tipo...</option>
                  </select>
                </div>

                @if (mostrarCampoTipoPersonalizado) {
                  <div class="form-group custom-type-group">
                    <label>
                      Nuevo Tipo de Ejercicio <span class="required">*</span>
                    </label>
                    <input
                      type="text"
                      [(ngModel)]="tipoPersonalizado"
                      (input)="onTipoPersonalizadoChange()"
                      class="form-input"
                      placeholder="Ej: CROSSFIT"
                    />
                    <span class="help-text">
                      Se formateará automáticamente a MAYÚSCULAS_CON_GUIONES_BAJOS
                    </span>
                  </div>
                }

                <div class="form-group">
                </div>

                <div class="form-group">
                  <label>
                    Grupo Muscular <span class="required">*</span>
                  </label>
                  <select
                    [(ngModel)]="formulario.grupoMuscular"
                    class="form-input"
                  >
                    <option value="">Selecciona un grupo</option>
                    @for (grupo of gruposMusculares; track grupo) {
                      <option [value]="grupo">{{ getGrupoLabel(grupo) }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>
                  Nivel de Dificultad <span class="required">*</span>
                </label>
                <select
                  [(ngModel)]="formulario.nivelDificultad"
                  class="form-input"
                >
                  <option value="">Selecciona un nivel</option>
                  @for (nivel of nivelesDificultad; track nivel) {
                    <option [value]="nivel">{{ getNivelLabel(nivel) }}</option>
                  }
                </select>
              </div>

              <!-- Datos Adicionales -->
              <div class="form-section-title">Datos Adicionales</div>

              <div class="form-row">
                <div class="form-group">
                  <label>Calorías Quemadas por Minuto</label>
                  <input
                    type="number"
                    [(ngModel)]="formulario.caloriasQuemadasPorMinuto"
                    class="form-input"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div class="form-group">
                  <label>Duración Estimada (minutos)</label>
                  <input
                    type="number"
                    [(ngModel)]="formulario.duracionEstimadaMinutos"
                    class="form-input"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Equipo Necesario</label>
                <input
                  type="text"
                  [(ngModel)]="formulario.equipoNecesario"
                  class="form-input"
                  placeholder="Ej: Mancuernas, Barra, Sin equipo..."
                />
              </div>

              <!-- Etiquetas -->
              <div class="form-section-title">Etiquetas</div>

              <div class="form-group">
                <div class="etiquetas-selector">
                  @for (etiqueta of etiquetasDisponibles(); track etiqueta.id) {
                    <button
                      type="button"
                      (click)="toggleEtiqueta(etiqueta.id)"
                      [class.selected]="isEtiquetaSeleccionada(etiqueta.id)"
                      class="etiqueta-chip"
                    >
                      {{ etiqueta.nombre }}
                    </button>
                  }
                  @if (etiquetasDisponibles().length === 0) {
                    <p class="no-etiquetas">No hay etiquetas disponibles</p>
                  }
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button
                (click)="cerrarModal()"
                [disabled]="guardando"
                class="btn-secondary"
              >
                Cancelar
              </button>
              <button
                (click)="guardar()"
                [disabled]="guardando"
                class="btn-primary"
              >
                {{ guardando ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </div>
        </div>
      }
      <!-- Modal Confirmación Eliminar -->
      @if (mostrarConfirmacion) {
        <div class="modal-overlay" (click)="cerrarConfirmacion()">
          <div class="modal-content small" (click)="$event.stopPropagation()">
            <div class="modal-body centered">
              <div class="warning-icon">⚠️</div>
              <h3>¿Eliminar Ejercicio?</h3>
              <p>
                ¿Estás seguro de eliminar el ejercicio <strong>"{{ ejercicioAEliminar?.nombre }}"</strong>?
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div class="modal-footer">
              <button
                (click)="cerrarConfirmacion()"
                [disabled]="eliminando"
                class="btn-secondary"
              >
                Cancelar
              </button>
              <button
                (click)="eliminar()"
                [disabled]="eliminando"
                class="btn-danger"
              >
                {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      }  

      @if (mostrarConfirmacionCerrar) {
       <div class="modal-overlay confirmation-overlay" (click)="cancelarCerrarModal()">
         <div class="modal-content small" (click)="$event.stopPropagation()">
           <div class="modal-body centered">
             <div class="warning-icon">⚠️</div>
             <h3>¿Salir sin guardar?</h3>
             <p>
               Tienes cambios sin guardar en el formulario.
               @if (formulario.etiquetaIds.length > 0) {
                 <strong>Incluye {{ formulario.etiquetaIds.length }} etiqueta(s).</strong>
               }
               Si sales ahora, perderás toda la información.
             </p>
           </div>
           <div class="modal-footer">
             <button (click)="cancelarCerrarModal()" class="btn-secondary">
               Seguir Editando
             </button>
             <button (click)="confirmarCerrarModal()" class="btn-danger">
               Descartar Cambios
             </button>
           </div>
         </div>
       </div>
     }
    </div>
    
  `,
  styles: [`
    /* Base styles iguales a los anteriores */
    .ejercicios-container {
      padding: 30px;
      background: #F8F9FA;
      min-height: 100vh;
    }

    /* Page Header */
    .page-header {
      margin-bottom: 2rem;
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
      color: #333;
    }

    .page-title mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: var(--primary-color, #00A859);
    }

    .page-subtitle {
      margin: 0;
      color: #666;
      font-size: 1rem;
    }

    /* Buttons */
    .btn-primary {
      background: linear-gradient(159deg, #28A745 0%, #20C997 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background: white;
      color: #6C757D;
      border: 1px solid #DEE2E6;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: #F8F9FA;
    }

    .btn-danger {
      background: linear-gradient(159deg, #DC3545 0%, #E83E8C 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-danger:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
    }

    .btn-clear-filters {
      padding: 8px 16px;
      border: 1px solid #DEE2E6;
      background: white;
      border-radius: 8px;
      color: #6C757D;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .btn-clear-filters:hover:not(:disabled) {
      background: #F8D7DA;
      color: #DC3545;
      border-color: #DC3545;
    }

    .btn-clear-filters:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      flex: 1 1 260px;       /* min = 260px, grow = 1 */
      max-width: 100%;       /* evita overflow */
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      overflow: hidden;
    }

    .stat-card.green-border {
      border-top: solid 5px #24B86F;
    }

    .stat-card.yellow-border {
      border-top: solid 5px #FEA00D;
    }
    
    .stat-card.red-border {
      border-top: solid 5px #E23A69;
    }

    .stat-card.purple-border {
      border-top: solid 5px #385EE0;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .stat-title {
      color: #6C757D;
      font-size: 14px;
      font-weight: 500;
    }

    .stat-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .stat-icon.green {
      background: #E8F5E8;
    }

    .stat-icon.yellow {
      background: #FFF3CD;
    }

    .stat-icon.red {
      background: #F8D7DA;
    }

    .stat-icon.purple {
      background: #E2E3F1;
    }

    .stat-value {
      color: #333333;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .stat-footer {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .stat-subtitle {
      color: #6C757D;
      font-size: 12px;
    }

    /* Filters Card */
    .filters-card {
      background: white;
      border-radius: 16px;
      padding: 25px 30px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      margin-bottom: 30px;
    }

    .search-section {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .search-input-wrapper {
      position: relative;
      width: 500px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #6C757D;
    }

    .search-input {
      width: 100%;
      padding: 12px 12px 12px 44px;
      border: 1px solid #DEE2E6;
      border-radius: 8px;
      font-size: 14px;
      color: #333333;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #28A745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }

    .filters-row {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      flex-wrap: wrap;
      padding-top: 20px;
      border-top: 1px solid #F1F3F4;
    }

    .filter-group {
      flex: 1;
      min-width: 180px;
    }

    .filter-label {
      display: block;
      color: #333333;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .filter-select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #DEE2E6;
      border-radius: 8px;
      font-size: 14px;
      color: #333333;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
    }

    .filter-select:focus {
      outline: none;
      border-color: #28A745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }

    /* Loading */
    .loading-card {
      background: white;
      border-radius: 16px;
      padding: 60px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      text-align: center;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #F1F3F4;
      border-top-color: #28A745;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-card p {
      color: #6C757D;
      font-size: 14px;
      margin: 0;
    }

    /* Table */
    .table-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead {
      background: #F8F9FA;
    }

    .data-table th {
      padding: 16px 20px;
      text-align: left;
      color: #6C757D;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .data-table td {
      padding: 20px;
      border-top: 1px solid #F1F3F4;
      color: #333333;
      font-size: 14px;
    }

    .data-table tbody tr:hover {
      background: #F8F9FA;
    }

    .table-id {
      color: #6C757D;
      font-weight: 500;
    }

    .table-name {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .name-icon {
      font-size: 24px;
    }

    .calories-value {
      color: #DC3545;
      font-weight: 700;
    }

    .duration-text {
      color: #6C757D;
      font-size: 13px;
    }

    .text-right {
      text-align: right;
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .badge-type {
      background: #D1ECF1;
      color: #007BFF;
    }

    .badge-muscle {
      background: #E8F5E8;
      color: #28A745;
    }

    .badge-level {
      background: #FFF3CD;
      color: #FFC107;
    }

    .badge-principiante {
      background: #D4EDDA;
      color: #155724;
    }

    .badge-intermedio {
      background: #FFF3CD;
      color: #856404;
    }

    .badge-avanzado {
      background: #F8D7DA;
      color: #721C24;
    }

    /* Tags Container */
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      max-width: 200px;
    }

    .tag {
      display: inline-block;
      padding: 4px 10px;
      background: #E8F5E8;
      color: #28A745;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .tag-more {
      display: inline-block;
      padding: 4px 10px;
      background: #F8F9FA;
      color: #6C757D;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .btn-action {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-action svg {
      width: 16px;
      height: 16px;
    }

    .btn-action.edit {
      background: #D1ECF1;
      color: #007BFF;
    }

    .btn-action.edit:hover {
      background: #B8DAFF;
    }

    .btn-action.delete {
      background: #F8D7DA;
      color: #DC3545;
    }

    .btn-action.delete:hover {
      background: #F5C6CB;
    }

    /* Pagination */
    .pagination {
      padding: 20px 25px;
      border-top: 1px solid #F1F3F4;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pagination-info {
      color: #6C757D;
      font-size: 14px;
    }

    .pagination-info strong {
      color: #333333;
      font-weight: 700;
    }

    .pagination-controls {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .pagination-current {
      color: #6C757D;
      font-size: 14px;
    }

    .btn-pagination {
      padding: 8px 16px;
      border: 1px solid #DEE2E6;
      background: white;
      border-radius: 6px;
      color: #333333;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-pagination:hover:not(:disabled) {
      background: #F8F9FA;
      border-color: #28A745;
      color: #28A745;
    }

    .btn-pagination:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* Mobile Cards */
    .mobile-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      margin-bottom: 12px;
    }

    .mobile-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .mobile-card-title {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .mobile-icon {
      font-size: 28px;
    }

    .mobile-name {
      color: #333333;
      font-size: 15px;
      font-weight: 700;
    }

    .mobile-id {
      color: #6C757D;
      font-size: 12px;
      margin-top: 2px;
    }

    .mobile-badges {
      display: flex;
      gap: 6px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .mobile-info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: 12px 0;
      border-top: 1px solid #F1F3F4;
      border-bottom: 1px solid #F1F3F4;
      margin-bottom: 12px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-label {
      color: #6C757D;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .info-value {
      color: #333333;
      font-size: 14px;
      font-weight: 700;
      margin-top: 4px;
    }

    .mobile-equipment {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #F8F9FA;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .equipment-icon {
      font-size: 16px;
    }

    .equipment-text {
      color: #6C757D;
      font-size: 13px;
    }

    .mobile-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }

    .mobile-card-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .btn-mobile {
      padding: 10px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-mobile.edit {
      background: #D1ECF1;
      color: #007BFF;
    }

    .btn-mobile.edit:hover {
      background: #B8DAFF;
    }

    .btn-mobile.delete {
      background: #F8D7DA;
      color: #DC3545;
    }

    .btn-mobile.delete:hover {
      background: #F5C6CB;
    }

    /* Mobile Pagination */
    .mobile-pagination {
      background: white;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      margin-top: 12px;
    }

    .mobile-pagination-info {
      text-align: center;
      margin-bottom: 12px;
      color: #333333;
      font-size: 14px;
      font-weight: 700;
    }

    .mobile-pagination-info span {
      display: block;
      color: #6C757D;
      font-size: 12px;
      font-weight: 400;
      margin-top: 4px;
    }

    .mobile-pagination-controls {
      display: flex;
      gap: 8px;
    }

    .mobile-pagination-controls .btn-pagination {
      flex: 1;
    }

    /* Empty State */
    .empty-state {
      background: white;
      border-radius: 16px;
      padding: 60px 30px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      text-align: center;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: #333333;
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 10px 0;
    }

    .empty-state p {
      color: #6C757D;
      font-size: 14px;
      margin: 0 0 30px 0;
    }

    /* Modals */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 1000;
      backdrop-filter: blur(2px);
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-content.large {
      max-width: 700px;
    }

    .modal-content.small {
      max-width: 400px;
    }

    .modal-header {
      padding: 25px 30px;
      border-bottom: 1px solid #F1F3F4;
    }

    .modal-header h2 {
      color: #333333;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .modal-body {
      padding: 25px 30px;
    }

    .modal-body.centered {
      text-align: center;
    }

    .modal-body.centered h3 {
      color: #333333;
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 10px 0;
    }

    .modal-body.centered p {
      color: #6C757D;
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
    }

    .warning-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .modal-footer {
      padding: 20px 30px;
      border-top: 1px solid #F1F3F4;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    /* Form Elements */
    .form-section-title {
      color: #333333;
      font-size: 16px;
      font-weight: 700;
      margin: 25px 0 15px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #E8F5E8;
    }

    .form-section-title:first-child {
      margin-top: 0;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group:last-child {
      margin-bottom: 0;
    }

    .form-group label {
      display: block;
      color: #333333;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .required {
      color: #DC3545;
    }

    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #DEE2E6;
      border-radius: 8px;
      font-size: 14px;
      color: #333333;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .form-input:focus {
      outline: none;
      border-color: #28A745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }

    .form-input::placeholder {
      color: #ADB5BD;
    }

    select.form-input {
      cursor: pointer;
    }

    textarea.form-input {
      resize: vertical;
      min-height: 80px;
    }

    input[type="number"].form-input {
      -moz-appearance: textfield;
    }

    input[type="number"].form-input::-webkit-outer-spin-button,
    input[type="number"].form-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Campos personalizados */
    .custom-type-group {
      border: 2px solid #28A745;
      border-radius: 8px;
      padding: 16px;
      background: #E8F5E8;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .custom-type-group label {
      color: #28A745;
    }

    .help-text {
      display: block;
      font-size: 12px;
      color: #6C757D;
      margin-top: 8px;
      font-style: italic;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    /* Etiquetas Selector */
    .etiquetas-selector {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px;
      background: #F8F9FA;
      border-radius: 8px;
      min-height: 60px;
    }

    .etiqueta-chip {
      padding: 8px 16px;
      border: 2px solid #DEE2E6;
      background: white;
      border-radius: 20px;
      color: #6C757D;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .etiqueta-chip:hover {
      border-color: #28A745;
      color: #28A745;
      background: #E8F5E8;
    }

    .etiqueta-chip.selected {
      background: linear-gradient(159deg, #28A745 0%, #20C997 100%);
      color: white;
      border-color: transparent;
    }

    .no-etiquetas {
      color: #6C757D;
      font-size: 13px;
      margin: 8px;
    }

    /* Responsive */
    .desktop-only {
      display: block;
    }

    .mobile-only {
      display: none;
    }

    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .ejercicios-container {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
        padding: 20px;
      }

      .page-header h1 {
        font-size: 24px;
      }

      .page-header p {
        font-size: 13px;
      }

      .btn-primary {
        width: 100%;
        justify-content: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 12px;
        margin-bottom: 20px;
      }

      .stat-card {
        padding: 20px;
      }

      .stat-value {
        font-size: 28px;
      }

      .filters-card {
        padding: 20px;
        margin-bottom: 20px;
      }

      .search-input-wrapper {
        max-width: 100%;
      }

      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-group {
        min-width: 100%;
      }

      .btn-clear-filters {
        width: 100%;
      }

      .desktop-only {
        display: none;
      }

      .mobile-only {
        display: block;
      }

      .modal-content {
        max-width: 100%;
        margin: 0;
        border-radius: 12px;
      }

      .modal-content.large {
        max-width: 100%;
      }

      .modal-header,
      .modal-body,
      .modal-footer {
        padding: 20px;
      }

      .modal-header h2 {
        font-size: 20px;
      }

      .modal-footer {
        flex-direction: column;
      }

      .modal-footer button {
        width: 100%;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .mobile-card-actions {
        grid-template-columns: 1fr;
        gap: 6px;
      }

      .empty-state {
        padding: 40px 20px;
      }

      .empty-icon {
        font-size: 48px;
      }

      .empty-state h3 {
        font-size: 18px;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
    .modal-header {
      padding: 25px 30px;
      border-bottom: 1px solid #F1F3F4;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .btn-close-modal {
      width: 32px;
      height: 32px;
      border: none;
      background: #F8F9FA;
      border-radius: 50%;
      color: #6C757D;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-close-modal:hover {
      background: #E9ECEF;
      color: #DC3545;
      transform: scale(1.1);
    }

    .modal-overlay {
      z-index: 1000;
    }

    .modal-overlay + .modal-overlay {
      z-index: 1001; 
    }

    .input-error {
      border-color: #DC3545 !important;
      background: #FFF5F5;
    }

    .input-error:focus {
      border-color: #DC3545 !important;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }

    .error-message {
      display: block;
      color: #DC3545;
      font-size: 12px;
      font-weight: 600;
      margin-top: 6px;
    }

    .preview-text {
      margin-top: 12px;
      padding: 10px;
      background: white;
      border: 1px solid #28A745;
      border-radius: 6px;
      font-size: 13px;
      color: #6C757D;
    }

    .preview-text strong {
      color: #28A745;
    }

    .btn-spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      margin-right: 6px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .confirmation-overlay {
      z-index: 1001 !important;
      background: rgba(0, 0, 0, 0.7);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .btn-close-modal {
      width: 32px;
      height: 32px;
      border: none;
      background: #F8F9FA;
      border-radius: 50%;
      color: #6C757D;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-close-modal:hover {
      background: #E9ECEF;
      color: #DC3545;
      transform: scale(1.1);
    }
  `]
})
export class EjerciciosListComponent implements OnInit {
  private ejercicioService = inject(EjercicioService);
  private etiquetaService = inject(EtiquetaService);
  private notificationService = inject(NotificationService);

  // Signals
  loading = signal(false);
  ejercicios = signal<Ejercicio[]>([]);
  etiquetasDisponibles = signal<Etiqueta[]>([]);
  
  // Paginación
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;
  
  // Búsqueda y filtros
  searchTerm = '';
  tipoFiltro: TipoEjercicio | '' = '';
  grupoFiltro: GrupoMuscular | '' = '';
  nivelFiltro: NivelDificultad | '' = '';
  searchTimeout: any;
  
  // Modal
  mostrarModal = false;
  ejercicioEditando: Ejercicio | null = null;
  
  // Confirmación
  mostrarConfirmacion = false;
  ejercicioAEliminar: Ejercicio | null = null;
  
  // Formulario
  formulario = {
    nombre: '',
    descripcion: '',
    tipoEjercicio: '' as TipoEjercicio | '' | '__CUSTOM__',
    grupoMuscular: '' as GrupoMuscular | '',
    nivelDificultad: '' as NivelDificultad | '',
    caloriasQuemadasPorMinuto: 0,
    duracionEstimadaMinutos: 0,
    equipoNecesario: '',
    etiquetaIds: [] as number[]
  };
  
  // Estados
  guardando = false;
  eliminando = false;
  
  // Listas para selects
  tiposEjercicio = Object.values(TipoEjercicio);
  gruposMusculares = Object.values(GrupoMuscular);
  nivelesDificultad = Object.values(NivelDificultad);

  // Tipos personalizados
  mostrarCampoTipoPersonalizado = false;
  tipoPersonalizado = '';
  
  mostrarConfirmacionCerrar = false;
  formularioInicial: any = null;

  ngOnInit(): void {
    this.cargarEjercicios();
    this.cargarEtiquetas();
  }

  cargarEjercicios(): void {
    this.loading.set(true);
    
    let request: Observable<ApiResponse<PageResponse<Ejercicio>>>;
    
    if (this.searchTerm) {
      request = this.ejercicioService.buscarPorNombre(this.searchTerm, this.currentPage, this.pageSize);
    } else if (this.tipoFiltro || this.grupoFiltro || this.nivelFiltro) {
      request = this.ejercicioService.filtrarEjercicios(
        this.tipoFiltro || undefined,
        this.grupoFiltro || undefined,
        this.nivelFiltro || undefined,
        this.currentPage,
        this.pageSize
      );
    } else {
      request = this.ejercicioService.listar(this.currentPage, this.pageSize);
    }
    
    request.subscribe({
      next: (response) => {
        this.ejercicios.set(response.data.content);
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar ejercicios:', error);
        this.loading.set(false);
        
        if (error.status) {
          this.notificationService.showHttpError(error.status, error.error?.message || 'Error al cargar los ejercicios');
        } else {
          this.notificationService.showError('No se pudieron cargar los ejercicios. Verifica tu conexión a internet.');
        }
      }
    });
  }

  /**
   * Carga las etiquetas disponibles
   */
  cargarEtiquetas(): void {
    this.etiquetaService.listar(0, 1000).subscribe({
      next: (response) => {
        this.etiquetasDisponibles.set(response.data.content);
      },
      error: (error) => {
        console.error('Error al cargar etiquetas:', error);
      }
    });
  }

  /**
   * Búsqueda con debounce
   */
  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 0;
      this.cargarEjercicios();
    }, 500);
  }

  /**
   * Aplicar filtros
   */
  aplicarFiltros(): void {
    this.currentPage = 0;
    this.cargarEjercicios();
  }

  /**
   * Limpiar filtros
   */
  limpiarFiltros(): void {
    this.tipoFiltro = '';
    this.grupoFiltro = '';
    this.nivelFiltro = '';
    this.searchTerm = '';
    this.currentPage = 0;
    this.cargarEjercicios();
  }

  /**
   * Cambiar página
   */
  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.cargarEjercicios();
    }
  }
  /**
   * Cierra el modal
   */
  cerrarModal(): void {
    if (this.hayaCambios()) {
      this.mostrarConfirmacionCerrar = true;
    } else {
      this.mostrarModal = false;
      this.ejercicioEditando = null;
      this.mostrarCampoTipoPersonalizado = false;
      this.tipoPersonalizado = '';
      this.formularioInicial = null;
    }
  }
  // 2. Agregar métodos para confirmar/cancelar cierre
  confirmarCerrarModal(): void {
    this.mostrarConfirmacionCerrar = false;
    this.mostrarModal = false;
    this.ejercicioEditando = null;
    this.mostrarCampoTipoPersonalizado = false;
    this.tipoPersonalizado = '';
    this.formularioInicial = null;
      if (this.formulario.etiquetaIds.length > 0) {
        this.notificationService.info(
          'Cambios descartados',
          `Se descartaron los cambios incluyendo ${this.formulario.etiquetaIds.length} etiqueta(s).`
        );
      } else {
        this.notificationService.info('Cambios descartados', 'Los cambios del formulario se descartaron.');
      }
  }

  cancelarCerrarModal(): void {
    this.mostrarConfirmacionCerrar = false;
  }


  private hayaCambios(): boolean {
   if (!this.formularioInicial) return false;
    
   const formularioActual = {
      nombre: this.formulario.nombre?.trim() || '',
      descripcion: this.formulario.descripcion?.trim() || '',
      tipoEjercicio: this.mostrarCampoTipoPersonalizado 
        ? this.tipoPersonalizado?.trim() || ''
        : this.formulario.tipoEjercicio || '',
      grupoMuscular: this.formulario.grupoMuscular || '',
      nivelDificultad: this.formulario.nivelDificultad || '',
      caloriasQuemadasPorMinuto: this.formulario.caloriasQuemadasPorMinuto || 0,
      duracionEstimadaMinutos: this.formulario.duracionEstimadaMinutos || 0,
      equipoNecesario: this.formulario.equipoNecesario?.trim() || '',
      etiquetaIds: JSON.stringify(this.formulario.etiquetaIds.sort())
    };

    const formularioInicial = {
      nombre: this.formularioInicial.nombre?.trim() || '',
      descripcion: this.formularioInicial.descripcion?.trim() || '',
      tipoEjercicio: this.formularioInicial.tipoEjercicio || '',
      grupoMuscular: this.formularioInicial.grupoMuscular || '',
      nivelDificultad: this.formularioInicial.nivelDificultad || '',
      caloriasQuemadasPorMinuto: this.formularioInicial.caloriasQuemadasPorMinuto || 0,
      duracionEstimadaMinutos: this.formularioInicial.duracionEstimadaMinutos || 0,
      equipoNecesario: this.formularioInicial.equipoNecesario?.trim() || '',
      etiquetaIds: JSON.stringify(this.formularioInicial.etiquetaIds.sort())
    };

    return JSON.stringify(formularioActual) !== JSON.stringify(formularioInicial);
  }
  abrirModalCrear(): void {
  this.ejercicioEditando = null; // era "this.editando"
  this.formulario = {
    nombre: '',
    descripcion: '',
    tipoEjercicio: '' as TipoEjercicio | '' | '__CUSTOM__',
    grupoMuscular: '' as GrupoMuscular | '',
    nivelDificultad: '' as NivelDificultad | '',
    caloriasQuemadasPorMinuto: 0,
    duracionEstimadaMinutos: 0,
    equipoNecesario: '',
    etiquetaIds: [] as number[]
  };
  
  this.formularioInicial = JSON.parse(JSON.stringify(this.formulario));
  this.mostrarModal = true;
}


abrirModalEditar(ejercicio: Ejercicio): void { // era "item: TuTipo"
  this.ejercicioEditando = ejercicio; // era "this.editando"
  
  // Verificar si el tipo es personalizado
  const esPersonalizado = !this.tiposEjercicio.includes(ejercicio.tipoEjercicio as TipoEjercicio);
  
  this.formulario = {
    nombre: ejercicio.nombre,
    descripcion: ejercicio.descripcion || '',
    tipoEjercicio: esPersonalizado ? '__CUSTOM__' : ejercicio.tipoEjercicio,
    grupoMuscular: ejercicio.grupoMuscular,
    nivelDificultad: ejercicio.nivelDificultad,
    caloriasQuemadasPorMinuto: ejercicio.caloriasQuemadasPorMinuto || 0,
    duracionEstimadaMinutos: ejercicio.duracionEstimadaMinutos || 0,
    equipoNecesario: ejercicio.equipoNecesario || '',
    etiquetaIds: ejercicio.etiquetas?.map(e => e.id) || []
  };
  
  if (esPersonalizado) {
    this.mostrarCampoTipoPersonalizado = true;
    this.tipoPersonalizado = ejercicio.tipoEjercicio;
  }
  this.formularioInicial = JSON.parse(JSON.stringify({
    ...this.formulario,
    tipoEjercicio: esPersonalizado ? this.tipoPersonalizado : this.formulario.tipoEjercicio
  }));
  
  this.mostrarModal = true;
}

  /**
   * Guarda un ejercicio
   */
  guardar(): void {
    // Validar tipo personalizado si está activo
    if (!this.formulario.nombre || this.formulario.nombre.trim().length === 0) {
      this.notificationService.showWarning('El campo "Nombre" es obligatorio.');
      return;
    }

    if (this.mostrarCampoTipoPersonalizado && !this.tipoPersonalizado.trim()){
      this.notificationService.showWarning('Por favor, ingresa el nombre del nuevo tipo de ejercicio.');
      return;
    }


    const tipoFinal = this.mostrarCampoTipoPersonalizado 
      ? this.tipoPersonalizado 
      : this.formulario.tipoEjercicio;
    if (!tipoFinal) {
      this.notificationService.showWarning('El campo "Tipo de Ejercicio" es obligatorio.');
      return;
    }

    if (!this.formulario.grupoMuscular) {
      this.notificationService.showWarning('El campo "Grupo Muscular" es obligatorio.');
      return;
    }

    if (!this.formulario.nivelDificultad) {
      this.notificationService.showWarning('El campo "Nivel de Dificultad" es obligatorio.');
      return;
    }

    if (this.formulario.caloriasQuemadasPorMinuto && this.formulario.caloriasQuemadasPorMinuto < 0) {
      this.notificationService.showWarning('Las calorías quemadas no pueden ser un valor negativo.');
      return;
    }

    if (this.formulario.duracionEstimadaMinutos && this.formulario.duracionEstimadaMinutos < 0) {
      this.notificationService.showWarning('La duración estimada no puede ser un valor negativo.');
      return;
    }
    this.guardando = true;
    const request = {
      nombre: this.formulario.nombre.trim(),
      descripcion: this.formulario.descripcion?.trim() || undefined,
      tipoEjercicio: tipoFinal as TipoEjercicio,
      grupoMuscular: this.formulario.grupoMuscular as GrupoMuscular,
      nivelDificultad: this.formulario.nivelDificultad as NivelDificultad,
      caloriasQuemadasPorMinuto: this.formulario.caloriasQuemadasPorMinuto || undefined,
      duracionEstimadaMinutos: this.formulario.duracionEstimadaMinutos || undefined,
      equipoNecesario: this.formulario.equipoNecesario?.trim() || undefined,
      etiquetaIds: this.formulario.etiquetaIds.length > 0 ? this.formulario.etiquetaIds : undefined
    };

    const observable = this.ejercicioEditando
      ? this.ejercicioService.actualizar(this.ejercicioEditando.id, request)
      : this.ejercicioService.crear(request);

    observable.subscribe({
      next: (response) => {
        if (this.ejercicioEditando) {
          this.notificationService.showSuccess(
            `El ejercicio "${response.data.nombre}" se actualizó correctamente.`
          );
        } else {
          this.notificationService.showSuccess(
            `El ejercicio "${response.data.nombre}" se creó exitosamente.`
          );
        }
        
        this.formularioInicial = null;
        this.cerrarModal();
        this.cargarEjercicios();
        this.guardando = false;
      },
      error: (error) => {
        console.error('Error al guardar:', error);
        this.guardando = false;
        
        if (error.status === 409) {
          this.notificationService.error(
            'No se puede guardar',
            `Ya existe un ejercicio con el nombre "${this.formulario.nombre}". Por favor, usa un nombre diferente.`
          );
        } else if (error.status === 400) {
          this.notificationService.error(
            'Datos inválidos',
            error.error?.message || 'Los datos ingresados no son válidos. Verifica que todos los campos estén correctos.'
          );
        } else if (error.status) {
          this.notificationService.showHttpError(error.status, error.error?.message);
        } else {
          this.notificationService.showError('No se pudo guardar el ejercicio. Verifica tu conexión a internet.');
        }
      }
    });
  }

  /**
   * Confirmar eliminación
   */
  confirmarEliminar(ejercicio: Ejercicio): void {
    this.ejercicioAEliminar = ejercicio;
    this.mostrarConfirmacion = true;
  }

  /**
   * Cerrar confirmación
   */
  cerrarConfirmacion(): void {
    this.mostrarConfirmacion = false;
    this.ejercicioAEliminar = null;
  }

  /**
   * Eliminar ejercicio
   */
  eliminar(): void {
    if (!this.ejercicioAEliminar) return;

    this.eliminando = true;
    const nombreEjercicio = this.ejercicioAEliminar.nombre;
    
    this.ejercicioService.eliminar(this.ejercicioAEliminar.id).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(
          `El ejercicio "${nombreEjercicio}" se eliminó correctamente.`
        );
        
        this.cerrarConfirmacion();
        this.cargarEjercicios();
        this.eliminando = false;
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
        this.eliminando = false;
        
        if (error.status === 409 || (error.error?.message && error.error.message.includes('en uso'))) {
          this.notificationService.error(
            'No se puede eliminar',
            `El ejercicio "${nombreEjercicio}" está siendo usado en rutinas. Primero debes eliminar esas referencias.`,
            10000
          );
        } else if (error.status === 404) {
          this.notificationService.error(
            'Ejercicio no encontrado',
            'El ejercicio que intentas eliminar ya no existe. La página se actualizará.'
          );
          this.cerrarConfirmacion();
          this.cargarEjercicios();
        } else if (error.status) {
          this.notificationService.showHttpError(error.status, error.error?.message);
        } else {
          this.notificationService.showError('No se pudo eliminar el ejercicio. Verifica tu conexión a internet.');
        }
      }
    });
  }

  /**
   * Toggle etiqueta
   */
  toggleEtiqueta(etiquetaId: number): void {
    const index = this.formulario.etiquetaIds.indexOf(etiquetaId);
    if (index > -1) {
      this.formulario.etiquetaIds.splice(index, 1);
    } else {
      this.formulario.etiquetaIds.push(etiquetaId);
    }
  }

  /**
   * Verifica si una etiqueta está seleccionada
   */
  isEtiquetaSeleccionada(etiquetaId: number): boolean {
    return this.formulario.etiquetaIds.includes(etiquetaId);
  }

  /**
   * Obtiene el label del tipo
   */
  getTipoLabel(tipo: TipoEjercicio): string {
    const label = TIPO_EJERCICIO_LABELS[tipo];
    if (label) return label;
    
    // Para tipos personalizados, formatear de MAYUSCULAS_CON_GUIONES a "Mayúsculas Con Guiones"
    return tipo.split('_').map(palabra => 
      palabra.charAt(0) + palabra.slice(1).toLowerCase()
    ).join(' ');
  }

  /**
   * Obtiene el label del grupo muscular
   */
  getGrupoLabel(grupo: GrupoMuscular): string {
    return GRUPO_MUSCULAR_LABELS[grupo];
  }

  /**
   * Obtiene el label del nivel
   */
  getNivelLabel(nivel: NivelDificultad): string {
    return NIVEL_DIFICULTAD_LABELS[nivel];
  }

  /**
   * Obtiene el icono del tipo
   */
  getTipoIcon(tipo: TipoEjercicio): string {
    return TIPO_EJERCICIO_ICONS[tipo] || '🎯';
  }

  /**
   * Maneja el cambio en el select de tipo de ejercicio
   */
  onTipoEjercicioChange(): void {
    if (this.formulario.tipoEjercicio === '__CUSTOM__') {
      this.mostrarCampoTipoPersonalizado = true;
      this.tipoPersonalizado = '';
    } else {
      this.mostrarCampoTipoPersonalizado = false;
      this.tipoPersonalizado = '';
    }
  }

  /**
   * Maneja cambios en el campo de tipo personalizado
   */
  onTipoPersonalizadoChange(): void {
    // Convertir a mayúsculas y reemplazar espacios por guiones bajos
    this.tipoPersonalizado = this.tipoPersonalizado
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '');
  }
}