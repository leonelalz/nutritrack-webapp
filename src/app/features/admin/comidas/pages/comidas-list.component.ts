// src/app/features/comidas/pages/comidas-list.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { ComidaService } from '../../../../core/services/comida.service';
import { EtiquetaService } from '../../../../core/services/etiqueta.service';
import { IngredienteService } from '../../../../core/services/ingrediente.service';
import {
  Comida,
  TipoComida,
  TIPO_COMIDA_LABELS,
  TIPO_COMIDA_ICONS,
  RecetaIngrediente
} from '../../../../core/models/comida.model';
import { Etiqueta, ApiResponse, PageResponse } from '../../../../core/models/etiqueta.model';
import { Ingrediente } from '../../../../core/models/ingrediente.model';

@Component({
  selector: 'app-comidas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="comidas-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon>restaurant</mat-icon>
            Gestión de Comidas
          </h1>
          <p class="page-subtitle">Crea, edita y gestiona todas las comidas desde aquí.</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card green-border">
          <div class="stat-header">
            <span class="stat-title">Total Comidas</span>
            <div class="stat-icon green">🍽️</div>
          </div>
          <div class="stat-value">{{ totalElements }}</div>
          <div class="stat-footer">
            <span class="stat-subtitle">registradas</span>
          </div>
        </div>

        <div class="stat-card yellow-border">
          <div class="stat-header">
            <span class="stat-title">Tipos</span>
            <div class="stat-icon yellow">📊</div>
          </div>
          <div class="stat-value">{{ tiposComida.length }}</div>
          <div class="stat-footer">
            <span class="stat-subtitle">categorías</span>
          </div>
        </div>

        <div class="stat-card purple-border">
          <div class="stat-header">
            <span class="stat-title">Página Actual</span>
            <div class="stat-icon purple">📄</div>
          </div>
          <div class="stat-value">{{ currentPage + 1 }}</div>
          <div class="stat-footer">
            <span class="stat-subtitle">de {{ totalPages || 0 }}</span>
          </div>
        </div>

        <div class="stat-card red-border">
          <div class="stat-header">
            <span class="stat-title">Ingredientes</span>
            <div class="stat-icon red">🥗</div>
          </div>
          <div class="stat-value">{{ ingredientesDisponibles().length }}</div>
          <div class="stat-footer">
            <span class="stat-subtitle">disponibles</span>
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
              placeholder="Buscar comidas por nombre..."
              class="search-input"
            />
          </div>
          <button (click)="abrirModalCrear()" class="btn-primary">
            <span>+</span>
            Nueva Comida
          </button>
        </div>

        <div class="filter-section">
          <label class="filter-label">Filtrar por tipo:</label>
          <div class="filter-buttons">
            <button
              (click)="filtrarPorTipo('')"
              [class.active]="tipoFiltro === ''"
              class="filter-btn"
            >
              Todas
            </button>
            @for (tipo of tiposComida; track tipo) {
              <button
                (click)="filtrarPorTipo(tipo)"
                [class.active]="tipoFiltro === tipo"
                class="filter-btn"
              >
                {{ getTipoIcon(tipo) }} {{ getTipoLabel(tipo) }}
              </button>
            }
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-card">
          <div class="spinner"></div>
          <p>Cargando comidas...</p>
        </div>
      }

      <!-- Desktop Table -->
      @if (!loading() && comidas().length > 0) {
        <div class="table-card desktop-only">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Energía</th>
                <th>Ingredientes</th>
                <th>Porciones</th>
                <th>Tiempo</th>
                <th>Etiquetas</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (comida of comidas(); track comida.id) {
                <tr>
                  <td>
                    <span class="table-id">#{{ comida.id }}</span>
                  </td>
                  <td>
                    <div class="table-name">
                      <span class="name-icon">{{ getTipoIcon(comida.tipoComida) }}</span>
                      <span>{{ comida.nombre }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-type">
                      {{ getTipoLabel(comida.tipoComida) }}
                    </span>
                  </td>
                  <td>
                    <span class="nutrition-value">{{ comida.nutricionTotal.energiaTotal }}</span>
                    <span class="nutrition-unit">kcal</span>
                  </td>
                  <td>
                    <span class="ingredient-count">{{ comida.ingredientes.length }}</span>
                  </td>
                  <td>
                    <span class="portion-text">{{ comida.porciones || '-' }}</span>
                  </td>
                  <td>
                    <span class="time-text">{{ comida.tiempoPreparacionMinutos || '-' }} min</span>
                  </td>
                  <td>
                    <div class="tags-container">
                      @for (etiqueta of comida.etiquetas.slice(0, 2); track etiqueta.id) {
                        <span class="tag">{{ etiqueta.nombre }}</span>
                      }
                      @if (comida.etiquetas.length > 2) {
                        <span class="tag-more">+{{ comida.etiquetas.length - 2 }}</span>
                      }
                    </div>
                  </td>
                  <td class="text-right">
                    <div class="action-buttons">
                      <button
                        (click)="abrirModalReceta(comida)"
                        class="btn-action recipe"
                        title="Ver Receta"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </button>
                      <button
                        (click)="abrirModalEditar(comida)"
                        class="btn-action edit"
                        title="Editar"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        (click)="confirmarEliminar(comida)"
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
                Mostrando <strong>{{ comidas().length }}</strong> de <strong>{{ totalElements }}</strong> resultados
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
          @for (comida of comidas(); track comida.id) {
            <div class="mobile-card">
              <div class="mobile-card-header">
                <div class="mobile-card-title">
                  <span class="mobile-icon">{{ getTipoIcon(comida.tipoComida) }}</span>
                  <div>
                    <div class="mobile-name">{{ comida.nombre }}</div>
                    <div class="mobile-id">#{{ comida.id }}</div>
                  </div>
                </div>
                <span class="badge badge-type">
                  {{ getTipoLabel(comida.tipoComida) }}
                </span>
              </div>

              <div class="mobile-info-grid">
                <div class="info-item">
                  <span class="info-label">Energía</span>
                  <span class="info-value">{{ comida.nutricionTotal.energiaTotal }} kcal</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Ingredientes</span>
                  <span class="info-value">{{ comida.ingredientes.length }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Porciones</span>
                  <span class="info-value">{{ comida.porciones || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Tiempo</span>
                  <span class="info-value">{{ comida.tiempoPreparacionMinutos || '-' }} min</span>
                </div>
              </div>

              @if (comida.etiquetas.length > 0) {
                <div class="mobile-tags">
                  @for (etiqueta of comida.etiquetas; track etiqueta.id) {
                    <span class="tag">{{ etiqueta.nombre }}</span>
                  }
                </div>
              }

              <div class="mobile-card-actions">
                <button
                  (click)="abrirModalReceta(comida)"
                  class="btn-mobile recipe"
                >
                  📋 Receta
                </button>
                <button
                  (click)="abrirModalEditar(comida)"
                  class="btn-mobile edit"
                >
                  ✏️ Editar
                </button>
                <button
                  (click)="confirmarEliminar(comida)"
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
                <span>({{ comidas().length }} de {{ totalElements }} resultados)</span>
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
      @if (!loading() && comidas().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🍽️</div>
          <h3>No hay comidas registradas</h3>
          <p>Comienza creando tu primera comida con su receta e ingredientes</p>
          <button (click)="abrirModalCrear()" class="btn-primary">
            <span>+</span>
            Nueva Comida
          </button>
        </div>
      }

      <!-- Modal Crear/Editar Comida -->
      @if (mostrarModal) {
        <div class="modal-overlay" (click)="cerrarModal()">
          <div class="modal-content large" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ comidaEditando ? 'Editar Comida' : 'Nueva Comida' }}</h2>
            </div>

            <div class="modal-body">
              <!-- Información básica -->
              <div class="form-group">
                <label>
                  Nombre <span class="required">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="formulario.nombre"
                  class="form-input"
                  placeholder="Ej: Ensalada César"
                />
              </div>

              <div class="form-group">
                <label>
                  Tipo de Comida <span class="required">*</span>
                </label>
                <select
                  [(ngModel)]="formulario.tipoComida"
                  class="form-input"
                  (change)="onTipoComidaChange()"
                >
                  <option value="">Selecciona un tipo</option>
                  @for (tipo of tiposComida; track tipo) {
                    <option [value]="tipo">
                      {{ getTipoIcon(tipo) }} {{ getTipoLabel(tipo) }}
                    </option>
                  }
                  <option value="__CUSTOM__">➕ Agregar nuevo tipo...</option>
                </select>
              </div>

              @if (mostrarCampoTipoComidaPersonalizado) {
                <div class="form-group custom-type-group">
                  <label>
                    Nuevo Tipo de Comida <span class="required">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="tipoComidaPersonalizado"
                    (input)="onTipoComidaPersonalizadoChange()"
                    class="form-input"
                    placeholder="Ej: BRUNCH"
                  />
                  <span class="help-text">
                    Se formateará automáticamente a MAYÚSCULAS_CON_GUIONES_BAJOS
                  </span>
                </div>
              }

              <div class="form-group">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Porciones</label>
                  <input
                    type="number"
                    [(ngModel)]="formulario.porciones"
                    class="form-input"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div class="form-group">
                  <label>Tiempo de Preparación (min)</label>
                  <input
                    type="number"
                    [(ngModel)]="formulario.tiempoPreparacionMinutos"
                    class="form-input"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Descripción</label>
                <textarea
                  [(ngModel)]="formulario.descripcion"
                  rows="3"
                  class="form-input"
                  placeholder="Descripción breve de la comida..."
                ></textarea>
              </div>

              <div class="form-group">
                <label>Instrucciones de Preparación</label>
                <textarea
                  [(ngModel)]="formulario.instrucciones"
                  rows="5"
                  class="form-input"
                  placeholder="Paso a paso de cómo preparar la comida..."
                ></textarea>
              </div>

              <!-- Etiquetas -->
              <div class="form-group">
                <label>Etiquetas</label>
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

              <!-- Ingredientes -->
              <div class="form-section-title">Ingredientes de la Receta</div>
              
              <div class="ingredients-form-section">
                <div class="ingredients-form-header">
                  <span>Ingredientes agregados ({{ formulario.ingredientes.length }})</span>
                  <button 
                    type="button"
                    (click)="mostrarFormIngrediente = !mostrarFormIngrediente" 
                    class="btn-add-ingredient"
                  >
                    {{ mostrarFormIngrediente ? '✕ Cancelar' : '+ Agregar Ingrediente' }}
                  </button>
                </div>

                @if (mostrarFormIngrediente) {
                  <div class="ingredient-form">
                    <div class="form-row">
                      <div class="form-group">
                        <label>Ingrediente <span class="required">*</span></label>
                        <select
                          [(ngModel)]="formularioIngrediente.ingredienteId"
                          class="form-input"
                        >
                          <option value="0">Selecciona un ingrediente</option>
                          @for (ingrediente of ingredientesDisponibles(); track ingrediente.id) {
                            <option [value]="ingrediente.id">{{ ingrediente.nombre }}</option>
                          }
                        </select>
                      </div>
                      <div class="form-group">
                        <label>Cantidad (gramos) <span class="required">*</span></label>
                        <input
                          type="number"
                          [(ngModel)]="formularioIngrediente.cantidadGramos"
                          class="form-input"
                          placeholder="0"
                          min="0"
                          step="1"
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <label>Notas</label>
                      <input
                        type="text"
                        [(ngModel)]="formularioIngrediente.notas"
                        class="form-input"
                        placeholder="Ej: En trozos pequeños"
                      />
                    </div>
                    <button 
                      type="button"
                      (click)="agregarIngredienteALista()" 
                      class="btn-primary"
                      [disabled]="!formularioIngrediente.ingredienteId || !formularioIngrediente.cantidadGramos"
                    >
                      Agregar a la lista
                    </button>
                  </div>
                }

                @if (formulario.ingredientes.length > 0) {
                  <div class="ingredients-preview-list">
                    @for (ing of formulario.ingredientes; track ing.ingredienteId) {
                      <div class="ingredient-preview-item">
                        <div class="ingredient-preview-info">
                          <span class="ingredient-preview-name">{{ getIngredienteNombre(ing.ingredienteId) }}</span>
                          <span class="ingredient-preview-amount">{{ ing.cantidadGramos }}g</span>
                          @if (ing.notas) {
                            <span class="ingredient-preview-notes">{{ ing.notas }}</span>
                          }
                        </div>
                        <button
                          type="button"
                          (click)="quitarIngredienteDeLista(ing.ingredienteId)"
                          class="btn-remove-preview"
                          title="Quitar"
                        >
                          ✕
                        </button>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="empty-ingredients-preview">
                    <p>No hay ingredientes agregados. Usa el botón "+ Agregar Ingrediente" para comenzar.</p>
                  </div>
                }
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

      <!-- Modal Ver/Editar Receta (US-10) -->
      @if (mostrarModalReceta && comidaReceta) {
        <div class="modal-overlay" (click)="cerrarModalReceta()">
          <div class="modal-content extra-large" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div>
                <h2>📋 Receta: {{ comidaReceta.nombre }}</h2>
                <p class="modal-subtitle">{{ getTipoLabel(comidaReceta.tipoComida) }}</p>
              </div>
            </div>

            <div class="modal-body">
              <!-- Resumen Nutricional -->
              <div class="nutrition-summary">
                <div class="summary-title">Información Nutricional Total</div>
                <div class="summary-grid">
                  <div class="summary-item">
                    <span class="summary-label">Energía</span>
                    <span class="summary-value">{{ comidaReceta.nutricionTotal.energiaTotal }} kcal</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Proteínas</span>
                    <span class="summary-value">{{ comidaReceta.nutricionTotal.proteinasTotales }}g</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Carbohidratos</span>
                    <span class="summary-value">{{ comidaReceta.nutricionTotal.carbohidratosTotales }}g</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Grasas</span>
                    <span class="summary-value">{{ comidaReceta.nutricionTotal.grasasTotales }}g</span>
                  </div>
                </div>
              </div>

              <!-- Lista de Ingredientes -->
              <div class="ingredients-section">
                <div class="section-header">
                  <h3>Ingredientes ({{ comidaReceta.ingredientes.length }})</h3>
                  <button (click)="abrirModalAgregarIngrediente()" class="btn-add-small">
                    + Agregar
                  </button>
                </div>

                @if (comidaReceta.ingredientes.length > 0) {
                  <div class="ingredients-list">
                    @for (ingrediente of comidaReceta.ingredientes; track ingrediente.ingredienteId) {
                      <div class="ingredient-item">
                        <div class="ingredient-info">
                          <div class="ingredient-name">{{ getIngredienteNombre(ingrediente.ingredienteId) }}</div>
                          <div class="ingredient-details">
                            <span class="ingredient-amount">{{ ingrediente.cantidadGramos }}g</span>
                            @if (ingrediente.notas) {
                              <span class="ingredient-notes">• {{ ingrediente.notas }}</span>
                            }
                          </div>
                        </div>
                        <button
                          (click)="eliminarIngrediente(ingrediente.ingredienteId)"
                          class="btn-remove-ingredient"
                          title="Eliminar"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="empty-ingredients">
                    <p>No hay ingredientes en esta receta</p>
                    <button (click)="abrirModalAgregarIngrediente()" class="btn-primary">
                      Agregar primer ingrediente
                    </button>
                  </div>
                }
              </div>

              <!-- Instrucciones -->
              @if (comidaReceta.instrucciones) {
                <div class="instructions-section">
                  <h3>Instrucciones de Preparación</h3>
                  <div class="instructions-text">{{ comidaReceta.instrucciones }}</div>
                </div>
              }
            </div>

            <div class="modal-footer">
              <button
                (click)="cerrarModalReceta()"
                class="btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modal Agregar Ingrediente -->
      @if (mostrarModalIngrediente) {
        <div class="modal-overlay" (click)="cerrarModalIngrediente()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Agregar Ingrediente</h2>
            </div>

            <div class="modal-body">
              <div class="form-group">
                <label>
                  Ingrediente <span class="required">*</span>
                </label>
                <select
                  [(ngModel)]="formularioIngrediente.ingredienteId"
                  class="form-input"
                >
                  <option [value]="0">Selecciona un ingrediente</option>
                  @for (ingrediente of ingredientesDisponibles(); track ingrediente.id) {
                    <option [value]="ingrediente.id">
                      {{ ingrediente.nombre }} ({{ ingrediente.energia }}kcal/100g)
                    </option>
                  }
                </select>
              </div>

              <div class="form-group">
                <label>
                  Cantidad (gramos) <span class="required">*</span>
                </label>
                <input
                  type="number"
                  [(ngModel)]="formularioIngrediente.cantidadGramos"
                  class="form-input"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div class="form-group">
                <label>Notas (opcional)</label>
                <textarea
                  [(ngModel)]="formularioIngrediente.notas"
                  rows="2"
                  class="form-input"
                  placeholder="Ej: picado, cocido, al gusto..."
                ></textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button
                (click)="cerrarModalIngrediente()"
                [disabled]="guardandoIngrediente"
                class="btn-secondary"
              >
                Cancelar
              </button>
              <button
                (click)="agregarIngrediente()"
                [disabled]="guardandoIngrediente"
                class="btn-primary"
              >
                {{ guardandoIngrediente ? 'Agregando...' : 'Agregar' }}
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
              <h3>¿Eliminar Comida?</h3>
              <p>
                ¿Estás seguro de eliminar la comida <strong>"{{ comidaAEliminar?.nombre }}"</strong>?
                Esta acción no se puede deshacer y eliminará también su receta.
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

    </div>
  `,
  styles: [`
    /* Base styles (iguales a ingredientes) */
    .comidas-container {
      padding: 30px;
      min-height: 100vh;
    }

    /* Header */
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

    .btn-add-small {
      background: #E8F5E8;
      color: #28A745;
      border: none;
      border-radius: 6px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-add-small:hover {
      background: #28A745;
      color: white;
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

    .filter-section {
      padding-top: 20px;
      border-top: 1px solid #F1F3F4;
    }

    .filter-label {
      display: block;
      color: #333333;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .filter-btn {
      padding: 8px 16px;
      border: 1px solid #DEE2E6;
      background: white;
      border-radius: 20px;
      color: #6C757D;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-btn:hover {
      border-color: #28A745;
      color: #28A745;
      background: #E8F5E8;
    }

    .filter-btn.active {
      background: linear-gradient(159deg, #28A745 0%, #20C997 100%);
      color: white;
      border-color: transparent;
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

    .nutrition-value {
      color: #333333;
      font-weight: 700;
    }

    .nutrition-unit {
      color: #6C757D;
      font-size: 12px;
      margin-left: 2px;
    }

    .ingredient-count {
      background: #E8F5E8;
      color: #28A745;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
    }

    .portion-text,
    .time-text {
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

    .btn-action.recipe {
      background: #FFF3CD;
      color: #FFC107;
    }

    .btn-action.recipe:hover {
      background: #FFE69C;
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

    .mobile-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }

    .mobile-card-actions {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
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

    .btn-mobile.recipe {
      background: #FFF3CD;
      color: #FFC107;
    }

    .btn-mobile.recipe:hover {
      background: #FFE69C;
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

    .modal-content.extra-large {
      max-width: 900px;
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

    .modal-subtitle {
      color: #6C757D;
      font-size: 14px;
      margin: 5px 0 0 0;
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

    .info-note {
      background: #E8F5E8;
      border-left: 4px solid #28A745;
      padding: 12px 16px;
      border-radius: 8px;
      color: #28A745;
      font-size: 13px;
      margin-top: 20px;
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

    /* Sección de Ingredientes en Formulario */
    .ingredients-form-section {
      background: #F8F9FA;
      border-radius: 12px;
      padding: 20px;
      margin-top: 20px;
    }

    .ingredients-form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .ingredients-form-header span {
      font-weight: 600;
      color: #333333;
      font-size: 14px;
    }

    .btn-add-ingredient {
      background: #28A745;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-add-ingredient:hover {
      background: #218838;
      transform: translateY(-2px);
    }

    .ingredient-form {
      background: white;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 15px;
      border: 2px solid #28A745;
      animation: slideDown 0.3s ease;
    }

    .ingredients-preview-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .ingredient-preview-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #DEE2E6;
    }

    .ingredient-preview-info {
      display: flex;
      gap: 12px;
      align-items: center;
      flex: 1;
    }

    .ingredient-preview-name {
      font-weight: 600;
      color: #333333;
      font-size: 14px;
    }

    .ingredient-preview-amount {
      color: #28A745;
      font-weight: 600;
      font-size: 13px;
    }

    .ingredient-preview-notes {
      color: #6C757D;
      font-size: 12px;
      font-style: italic;
    }

    .btn-remove-preview {
      background: #DC3545;
      color: white;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .btn-remove-preview:hover {
      background: #C82333;
      transform: scale(1.1);
    }

    .empty-ingredients-preview {
      text-align: center;
      padding: 20px;
      color: #6C757D;
      font-size: 13px;
      font-style: italic;
    }

    /* Nutrition Summary */
    .nutrition-summary {
      background: linear-gradient(135deg, #E8F5E8 0%, #D1ECF1 100%);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 25px;
    }

    .summary-title {
      color: #333333;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 15px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 15px;
    }

    .summary-item {
      background: white;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }

    .summary-label {
      display: block;
      color: #6C757D;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .summary-value {
      display: block;
      color: #28A745;
      font-size: 18px;
      font-weight: 700;
    }

    /* Ingredients Section */
    .ingredients-section {
      background: #F8F9FA;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .section-header h3 {
      color: #333333;
      font-size: 18px;
      font-weight: 700;
      margin: 0;
    }

    .ingredients-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .ingredient-item {
      background: white;
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
    }

    .ingredient-item:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .ingredient-info {
      flex: 1;
    }

    .ingredient-name {
      color: #333333;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .ingredient-details {
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 12px;
    }

    .ingredient-amount {
      color: #28A745;
      font-weight: 700;
    }

    .ingredient-notes {
      color: #6C757D;
    }

    .btn-remove-ingredient {
      width: 28px;
      height: 28px;
      border: none;
      background: #F8D7DA;
      color: #DC3545;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-remove-ingredient:hover {
      background: #DC3545;
      color: white;
    }

    .btn-remove-ingredient svg {
      width: 14px;
      height: 14px;
    }

    .empty-ingredients {
      text-align: center;
      padding: 30px 20px;
    }

    .empty-ingredients p {
      color: #6C757D;
      font-size: 14px;
      margin: 0 0 15px 0;
    }

    /* Instructions Section */
    .instructions-section {
      background: #F8F9FA;
      border-radius: 12px;
      padding: 20px;
    }

    .instructions-section h3 {
      color: #333333;
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 12px 0;
    }

    .instructions-text {
      color: #333333;
      font-size: 14px;
      line-height: 1.7;
      white-space: pre-wrap;
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
      .comidas-container {
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

      .filter-buttons {
        gap: 6px;
      }

      .filter-btn {
        font-size: 12px;
        padding: 6px 12px;
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

      .modal-content.large,
      .modal-content.extra-large {
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

      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
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

      .summary-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ComidasListComponent implements OnInit {
  private comidaService = inject(ComidaService);
  private etiquetaService = inject(EtiquetaService);
  private ingredienteService = inject(IngredienteService);

  // Signals
  loading = signal(false);
  comidas = signal<Comida[]>([]);
  etiquetasDisponibles = signal<Etiqueta[]>([]);
  ingredientesDisponibles = signal<Ingrediente[]>([]);
  
  // Paginación
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;
  
  // Búsqueda y filtros
  searchTerm = '';
  tipoFiltro: TipoComida | '' = '';
  searchTimeout: any;
  
  // Modal comida
  mostrarModal = false;
  comidaEditando: Comida | null = null;
  
  // Modal receta (US-10)
  mostrarModalReceta = false;
  comidaReceta: Comida | null = null;
  
  // Modal agregar ingrediente
  mostrarModalIngrediente = false;
  
  // Confirmación
  mostrarConfirmacion = false;
  comidaAEliminar: Comida | null = null;
  
  // Formulario comida
  formulario = {
    nombre: '',
    tipoComida: '' as TipoComida | '' | '__CUSTOM__',
    descripcion: '',
    tiempoPreparacionMinutos: 0,
    porciones: 0,
    instrucciones: '',
    etiquetaIds: [] as number[],
    ingredientes: [] as { ingredienteId: number; cantidadGramos: number; notas?: string }[]
  };
  
  // Formulario ingrediente (US-10)
  formularioIngrediente = {
    ingredienteId: 0,
    cantidadGramos: 0,
    notas: ''
  };
  
  // Estados
  guardando = false;
  eliminando = false;
  guardandoIngrediente = false;
  
  // Listas para selects
  tiposComida = Object.values(TipoComida);

  // Tipos personalizados
  mostrarCampoTipoComidaPersonalizado = false;
  tipoComidaPersonalizado = '';

  // Control de formulario de ingrediente en modal principal
  mostrarFormIngrediente = false;

  ngOnInit(): void {
    this.cargarComidas();
    this.cargarEtiquetas();
    this.cargarIngredientes();
  }

  /**
   * Carga la lista de comidas
   */
  cargarComidas(): void {
    this.loading.set(true);
    
    let request: Observable<ApiResponse<PageResponse<Comida>>>;
    
    if (this.searchTerm) {
      request = this.comidaService.buscarPorNombre(this.searchTerm, this.currentPage, this.pageSize);
    } else if (this.tipoFiltro) {
      request = this.comidaService.filtrarPorTipo(this.tipoFiltro, this.currentPage, this.pageSize);
    } else {
      request = this.comidaService.listar(this.currentPage, this.pageSize);
    }
    
    request.subscribe({
      next: (response) => {
        this.comidas.set(response.data.content);
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar comidas:', error);
        this.mostrarError('Error al cargar comidas');
        this.loading.set(false);
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
   * Carga los ingredientes disponibles
   */
  cargarIngredientes(): void {
    this.ingredienteService.listar(0, 1000).subscribe({
      next: (response) => {
        this.ingredientesDisponibles.set(response.data.content);
      },
      error: (error) => {
        console.error('Error al cargar ingredientes:', error);
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
      this.cargarComidas();
    }, 500);
  }

  /**
   * Filtrar por tipo
   */
  filtrarPorTipo(tipo: TipoComida | ''): void {
    this.tipoFiltro = tipo;
    this.currentPage = 0;
    this.cargarComidas();
  }

  /**
   * Cambiar página
   */
  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.cargarComidas();
    }
  }

  // ========== CRUD COMIDA ==========

  /**
   * Abre el modal para crear comida
   */
  abrirModalCrear(): void {
    this.comidaEditando = null;
    this.formulario = {
      nombre: '',
      tipoComida: '',
      descripcion: '',
      tiempoPreparacionMinutos: 0,
      porciones: 0,
      instrucciones: '',
      etiquetaIds: [],
      ingredientes: []
    };
    this.mostrarFormIngrediente = false;
    this.mostrarModal = true;
  }

  /**
   * Abre el modal para editar comida
   */
  abrirModalEditar(comida: Comida): void {
    this.comidaEditando = comida;
    this.formulario = {
      nombre: comida.nombre,
      tipoComida: comida.tipoComida,
      descripcion: comida.descripcion || '',
      tiempoPreparacionMinutos: comida.tiempoPreparacionMinutos || 0,
      porciones: comida.porciones || 0,
      instrucciones: comida.instrucciones || '',
      etiquetaIds: comida.etiquetas.map(e => e.id),
      ingredientes: comida.ingredientes.map(ing => ({
        ingredienteId: ing.ingredienteId,
        cantidadGramos: ing.cantidadGramos,
        notas: ing.notas
      }))
    };
    this.mostrarModal = true;
  }

  /**
   * Cierra el modal de comida
   */
  cerrarModal(): void {
    this.mostrarModal = false;
    this.comidaEditando = null;
    this.mostrarCampoTipoComidaPersonalizado = false;
    this.tipoComidaPersonalizado = '';
    this.mostrarFormIngrediente = false;
    this.formularioIngrediente = {
      ingredienteId: 0,
      cantidadGramos: 0,
      notas: ''
    };
  }

  /**
   * Guarda una comida
   */
  guardar(): void {
    // Validar tipo personalizado si está activo
    if (this.mostrarCampoTipoComidaPersonalizado && !this.tipoComidaPersonalizado.trim()) {
      this.mostrarError('Por favor ingresa el nuevo tipo de comida');
      return;
    }

    const tipoFinal = this.mostrarCampoTipoComidaPersonalizado 
      ? this.tipoComidaPersonalizado 
      : this.formulario.tipoComida;

    if (!this.formulario.nombre || !tipoFinal) {
      this.mostrarError('Por favor completa los campos obligatorios');
      return;
    }

    this.guardando = true;
    const request = {
      nombre: this.formulario.nombre.trim(),
      tipoComida: tipoFinal as TipoComida,
      descripcion: this.formulario.descripcion?.trim() || undefined,
      tiempoPreparacionMinutos: this.formulario.tiempoPreparacionMinutos || undefined,
      porciones: this.formulario.porciones || undefined,
      instrucciones: this.formulario.instrucciones?.trim() || undefined,
      etiquetaIds: this.formulario.etiquetaIds.length > 0 ? this.formulario.etiquetaIds : undefined
    };

    const observable = this.comidaEditando
      ? this.comidaService.actualizar(this.comidaEditando.id, request)
      : this.comidaService.crear(request);

    observable.subscribe({
      next: (response) => {
        const comidaCreada = response.data;
        
        // Si hay ingredientes para agregar y es una creación nueva
        if (!this.comidaEditando && this.formulario.ingredientes.length > 0) {
          // Enviar ingredientes uno por uno
          this.enviarIngredientes(comidaCreada.id, this.formulario.ingredientes);
        } else if (this.comidaEditando && this.formulario.ingredientes.length > 0) {
          // Para edición, sincronizar ingredientes
          this.sincronizarIngredientes(comidaCreada.id, this.formulario.ingredientes);
        } else {
          this.mostrarExito(response.message);
          this.cerrarModal();
          this.cargarComidas();
          this.guardando = false;
        }
      },
      error: (error) => {
        console.error('Error al guardar:', error);
        this.mostrarError(error.error?.message || 'Error al guardar la comida');
        this.guardando = false;
      }
    });
  }

  /**
   * Confirmar eliminación
   */
  confirmarEliminar(comida: Comida): void {
    this.comidaAEliminar = comida;
    this.mostrarConfirmacion = true;
  }

  /**
   * Cerrar confirmación
   */
  cerrarConfirmacion(): void {
    this.mostrarConfirmacion = false;
    this.comidaAEliminar = null;
  }

  /**
   * Eliminar comida
   */
  eliminar(): void {
    if (!this.comidaAEliminar) return;

    this.eliminando = true;
    this.comidaService.eliminar(this.comidaAEliminar.id).subscribe({
      next: (response) => {
        this.mostrarExito(response.message);
        this.cerrarConfirmacion();
        this.cargarComidas();
        this.eliminando = false;
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
        this.mostrarError(error.error?.message || 'Error al eliminar la comida');
        this.eliminando = false;
      }
    });
  }

  // ========== US-10: GESTIÓN DE RECETA ==========

  /**
   * Abre el modal de receta (ingredientes)
   */
  abrirModalReceta(comida: Comida): void {
    this.comidaReceta = comida;
    this.mostrarModalReceta = true;
  }

  /**
   * Cierra el modal de receta
   */
  cerrarModalReceta(): void {
    this.mostrarModalReceta = false;
    this.comidaReceta = null;
  }

  /**
   * Abre el modal para agregar ingrediente
   */
  abrirModalAgregarIngrediente(): void {
    this.formularioIngrediente = {
      ingredienteId: 0,
      cantidadGramos: 0,
      notas: ''
    };
    this.mostrarModalIngrediente = true;
  }

  /**
   * Cierra el modal de ingrediente
   */
  cerrarModalIngrediente(): void {
    this.mostrarModalIngrediente = false;
  }

  /**
   * Agrega ingrediente a la receta
   */
  agregarIngrediente(): void {
    if (!this.comidaReceta || !this.formularioIngrediente.ingredienteId || 
        this.formularioIngrediente.cantidadGramos <= 0) {
      this.mostrarError('Por favor completa los campos obligatorios');
      return;
    }

    this.guardandoIngrediente = true;
    const request = {
      ingredienteId: this.formularioIngrediente.ingredienteId,
      cantidadGramos: this.formularioIngrediente.cantidadGramos,
      notas: this.formularioIngrediente.notas?.trim() || undefined
    };

    this.comidaService.agregarIngrediente(this.comidaReceta.id, request).subscribe({
      next: (response) => {
        this.mostrarExito(response.message);
        this.comidaReceta = response.data;
        this.cerrarModalIngrediente();
        this.cargarComidas();
        this.guardandoIngrediente = false;
      },
      error: (error) => {
        console.error('Error al agregar ingrediente:', error);
        this.mostrarError(error.error?.message || 'Error al agregar ingrediente');
        this.guardandoIngrediente = false;
      }
    });
  }

  /**
   * Elimina un ingrediente de la receta
   */
  eliminarIngrediente(ingredienteId: number): void {
    if (!this.comidaReceta) return;

    if (!confirm('¿Eliminar este ingrediente de la receta?')) return;

    this.comidaService.eliminarIngrediente(this.comidaReceta.id, ingredienteId).subscribe({
      next: (response) => {
        this.mostrarExito(response.message);
        this.comidaReceta = response.data;
        this.cargarComidas();
      },
      error: (error) => {
        console.error('Error al eliminar ingrediente:', error);
        this.mostrarError(error.error?.message || 'Error al eliminar ingrediente');
      }
    });
  }

  // ========== UTILIDADES ==========

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
  getTipoLabel(tipo: TipoComida): string {
    const label = TIPO_COMIDA_LABELS[tipo];
    if (label) return label;
    
    // Para tipos personalizados, formatear de MAYUSCULAS_CON_GUIONES a "Mayúsculas Con Guiones"
    return tipo.split('_').map(palabra => 
      palabra.charAt(0) + palabra.slice(1).toLowerCase()
    ).join(' ');
  }

  /**
   * Obtiene el icono del tipo
   */
  getTipoIcon(tipo: TipoComida): string {
    return TIPO_COMIDA_ICONS[tipo] || '🍽️';
  }

  /**
   * Maneja el cambio en el select de tipo de comida
   */
  onTipoComidaChange(): void {
    if (this.formulario.tipoComida === '__CUSTOM__') {
      this.mostrarCampoTipoComidaPersonalizado = true;
      this.tipoComidaPersonalizado = '';
    } else {
      this.mostrarCampoTipoComidaPersonalizado = false;
      this.tipoComidaPersonalizado = '';
    }
  }

  /**
   * Maneja cambios en el campo de tipo personalizado
   */
  onTipoComidaPersonalizadoChange(): void {
    // Convertir a mayúsculas y reemplazar espacios por guiones bajos
    this.tipoComidaPersonalizado = this.tipoComidaPersonalizado
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '');
  }

  /**
   * Agrega un ingrediente a la lista temporal del formulario
   */
  agregarIngredienteALista(): void {
    if (!this.formularioIngrediente.ingredienteId || !this.formularioIngrediente.cantidadGramos) {
      this.mostrarError('Por favor selecciona un ingrediente y especifica la cantidad');
      return;
    }

    // Verificar si el ingrediente ya está en la lista
    const yaExiste = this.formulario.ingredientes.some(
      ing => ing.ingredienteId === this.formularioIngrediente.ingredienteId
    );

    if (yaExiste) {
      this.mostrarError('Este ingrediente ya fue agregado. Quítalo primero si deseas modificarlo.');
      return;
    }

    // Agregar a la lista
    this.formulario.ingredientes.push({
      ingredienteId: this.formularioIngrediente.ingredienteId,
      cantidadGramos: this.formularioIngrediente.cantidadGramos,
      notas: this.formularioIngrediente.notas?.trim() || undefined
    });

    // Resetear formulario de ingrediente
    this.formularioIngrediente = {
      ingredienteId: 0,
      cantidadGramos: 0,
      notas: ''
    };

    // Ocultar formulario
    this.mostrarFormIngrediente = false;
  }

  /**
   * Quita un ingrediente de la lista temporal
   */
  quitarIngredienteDeLista(ingredienteId: number): void {
    this.formulario.ingredientes = this.formulario.ingredientes.filter(
      ing => ing.ingredienteId !== ingredienteId
    );
  }

  /**
   * Envía ingredientes a una comida recién creada
   */
  private enviarIngredientes(comidaId: number, ingredientes: any[]): void {
    let ingredientesEnviados = 0;
    let errores: string[] = [];

    ingredientes.forEach((ing) => {
      this.comidaService.agregarIngrediente(comidaId, {
        ingredienteId: ing.ingredienteId,
        cantidadGramos: ing.cantidadGramos,
        notas: ing.notas
      }).subscribe({
        next: () => {
          ingredientesEnviados++;
          if (ingredientesEnviados + errores.length === ingredientes.length) {
            this.finalizarGuardadoConIngredientes(errores);
          }
        },
        error: (error) => {
          errores.push(`Error al agregar ingrediente ${ing.ingredienteId}`);
          if (ingredientesEnviados + errores.length === ingredientes.length) {
            this.finalizarGuardadoConIngredientes(errores);
          }
        }
      });
    });
  }

  /**
   * Sincroniza ingredientes de una comida editada
   */
  private sincronizarIngredientes(comidaId: number, ingredientes: any[]): void {
    // Para simplificar, usar los ingredientes tal como están
    // Una implementación más sofisticada haría diff de ingredientes
    this.enviarIngredientes(comidaId, ingredientes);
  }

  /**
   * Finaliza el guardado después de procesar ingredientes
   */
  private finalizarGuardadoConIngredientes(errores: string[]): void {
    if (errores.length === 0) {
      this.mostrarExito('Comida guardada exitosamente con todos sus ingredientes');
    } else {
      this.mostrarError(`Comida guardada pero con errores en ingredientes: ${errores.join(', ')}`);
    }
    this.cerrarModal();
    this.cargarComidas();
    this.guardando = false;
  }

  /**
   * Obtiene el nombre del ingrediente por ID
   */
  getIngredienteNombre(id: number): string {
    const ingrediente = this.ingredientesDisponibles().find(i => i.id === id);
    return ingrediente?.nombre || 'Desconocido';
  }

  /**
   * Muestra mensaje de éxito
   */
  private mostrarExito(mensaje: string): void {
    alert(mensaje);
  }

  /**
   * Muestra mensaje de error
   */
  private mostrarError(mensaje: string): void {
    alert(mensaje);
  }
}