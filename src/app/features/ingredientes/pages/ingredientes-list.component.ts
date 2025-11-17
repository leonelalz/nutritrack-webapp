// src/app/features/ingredientes/pages/ingredientes-list.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { IngredienteService } from '../../../core/services/ingrediente.service';
import { EtiquetaService } from '../../../core/services/etiqueta.service';
import {
  Ingrediente,
  CategoriaAlimento,
  CATEGORIA_ALIMENTO_LABELS,
  CATEGORIA_ALIMENTO_ICONS
} from '../../../core/models/ingrediente.model';
import { Etiqueta, ApiResponse, PageResponse } from '../../../core/models/etiqueta.model';

@Component({
  selector: 'app-ingredientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ingredientes-container">
      
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>Gestión de Ingredientes</h1>
          <p>Administración de ingredientes con información nutricional completa</p>
        </div>
        <button (click)="abrirModalCrear()" class="btn-primary">
          <span>+</span>
          Nuevo Ingrediente
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card green-border">
          <div class="stat-header">
            <span class="stat-title">Total Ingredientes</span>
            <div class="stat-icon green">🥗</div>
          </div>
          <div class="stat-value">{{ totalElements }}</div>
          <div class="stat-footer">
            <span class="stat-subtitle">registrados</span>
          </div>
        </div>

        <div class="stat-card yellow-border">
          <div class="stat-header">
            <span class="stat-title">Categorías</span>
            <div class="stat-icon yellow">📊</div>
          </div>
          <div class="stat-value">{{ categorias.length }}</div>
          <div class="stat-footer">
            <span class="stat-subtitle">disponibles</span>
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
            <span class="stat-title">Etiquetas</span>
            <div class="stat-icon red">🏷️</div>
          </div>
          <div class="stat-value">{{ etiquetasDisponibles().length }}</div>
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
              placeholder="Buscar ingredientes por nombre..."
              class="search-input"
            />
          </div>
        </div>

        <div class="filter-section">
          <label class="filter-label">Filtrar por categoría:</label>
          <div class="filter-buttons">
            <button
              (click)="filtrarPorCategoria('')"
              [class.active]="categoriaFiltro === ''"
              class="filter-btn"
            >
              Todas
            </button>
            @for (categoria of categorias; track categoria) {
              <button
                (click)="filtrarPorCategoria(categoria)"
                [class.active]="categoriaFiltro === categoria"
                class="filter-btn"
              >
                {{ getCategoriaIcon(categoria) }} {{ getCategoriaLabel(categoria) }}
              </button>
            }
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-card">
          <div class="spinner"></div>
          <p>Cargando ingredientes...</p>
        </div>
      }

      <!-- Desktop Table -->
      @if (!loading() && ingredientes().length > 0) {
        <div class="table-card desktop-only">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Energía</th>
                <th>Proteínas</th>
                <th>Carbohidratos</th>
                <th>Grasas</th>
                <th>Etiquetas</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (ingrediente of ingredientes(); track ingrediente.id) {
                <tr>
                  <td>
                    <span class="table-id">#{{ ingrediente.id }}</span>
                  </td>
                  <td>
                    <div class="table-name">
                      <span class="name-icon">{{ getCategoriaIcon(ingrediente.categoriaAlimento) }}</span>
                      <span>{{ ingrediente.nombre }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-category">
                      {{ getCategoriaLabel(ingrediente.categoriaAlimento) }}
                    </span>
                  </td>
                  <td>
                    <span class="nutrition-value">{{ ingrediente.energia }}</span>
                    <span class="nutrition-unit">kcal</span>
                  </td>
                  <td>
                    <span class="nutrition-value">{{ ingrediente.proteinas }}</span>
                    <span class="nutrition-unit">g</span>
                  </td>
                  <td>
                    <span class="nutrition-value">{{ ingrediente.carbohidratos }}</span>
                    <span class="nutrition-unit">g</span>
                  </td>
                  <td>
                    <span class="nutrition-value">{{ ingrediente.grasas }}</span>
                    <span class="nutrition-unit">g</span>
                  </td>
                  <td>
                    <div class="tags-container">
                      @for (etiqueta of ingrediente.etiquetas.slice(0, 2); track etiqueta.id) {
                        <span class="tag">{{ etiqueta.nombre }}</span>
                      }
                      @if (ingrediente.etiquetas.length > 2) {
                        <span class="tag-more">+{{ ingrediente.etiquetas.length - 2 }}</span>
                      }
                    </div>
                  </td>
                  <td class="text-right">
                    <div class="action-buttons">
                      <button
                        (click)="abrirModalEditar(ingrediente)"
                        class="btn-action edit"
                        title="Editar"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        (click)="confirmarEliminar(ingrediente)"
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
                Mostrando <strong>{{ ingredientes().length }}</strong> de <strong>{{ totalElements }}</strong> resultados
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
          @for (ingrediente of ingredientes(); track ingrediente.id) {
            <div class="mobile-card">
              <div class="mobile-card-header">
                <div class="mobile-card-title">
                  <span class="mobile-icon">{{ getCategoriaIcon(ingrediente.categoriaAlimento) }}</span>
                  <div>
                    <div class="mobile-name">{{ ingrediente.nombre }}</div>
                    <div class="mobile-id">#{{ ingrediente.id }}</div>
                  </div>
                </div>
                <span class="badge badge-category">
                  {{ getCategoriaLabel(ingrediente.categoriaAlimento) }}
                </span>
              </div>

              <div class="mobile-nutrition">
                <div class="nutrition-item">
                  <span class="nutrition-label">Energía</span>
                  <span class="nutrition-data">{{ ingrediente.energia }} kcal</span>
                </div>
                <div class="nutrition-item">
                  <span class="nutrition-label">Proteínas</span>
                  <span class="nutrition-data">{{ ingrediente.proteinas }}g</span>
                </div>
                <div class="nutrition-item">
                  <span class="nutrition-label">Carbohidratos</span>
                  <span class="nutrition-data">{{ ingrediente.carbohidratos }}g</span>
                </div>
                <div class="nutrition-item">
                  <span class="nutrition-label">Grasas</span>
                  <span class="nutrition-data">{{ ingrediente.grasas }}g</span>
                </div>
              </div>

              @if (ingrediente.etiquetas.length > 0) {
                <div class="mobile-tags">
                  @for (etiqueta of ingrediente.etiquetas; track etiqueta.id) {
                    <span class="tag">{{ etiqueta.nombre }}</span>
                  }
                </div>
              }

              <div class="mobile-card-actions">
                <button
                  (click)="abrirModalEditar(ingrediente)"
                  class="btn-mobile edit"
                >
                  ✏️ Editar
                </button>
                <button
                  (click)="confirmarEliminar(ingrediente)"
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
                <span>({{ ingredientes().length }} de {{ totalElements }} resultados)</span>
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
      @if (!loading() && ingredientes().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🥗</div>
          <h3>No hay ingredientes registrados</h3>
          <p>Comienza creando tu primer ingrediente con información nutricional</p>
          <button (click)="abrirModalCrear()" class="btn-primary">
            <span>+</span>
            Nuevo Ingrediente
          </button>
        </div>
      }

      <!-- Modal Crear/Editar -->
      @if (mostrarModal) {
        <div class="modal-overlay" (click)="cerrarModal()">
          <div class="modal-content large" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ ingredienteEditando ? 'Editar Ingrediente' : 'Nuevo Ingrediente' }}</h2>
            </div>

            <div class="modal-body">
              <!-- Nombre -->
              <div class="form-group">
                <label>
                  Nombre <span class="required">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="formulario.nombre"
                  class="form-input"
                  placeholder="Ej: Pechuga de pollo"
                />
              </div>

              <!-- Categoría -->
              <div class="form-group">
                <label>
                  Categoría <span class="required">*</span>
                </label>
                <select
                  [(ngModel)]="formulario.categoriaAlimento"
                  class="form-input"
                >
                  <option value="">Selecciona una categoría</option>
                  @for (categoria of categorias; track categoria) {
                    <option [value]="categoria">
                      {{ getCategoriaIcon(categoria) }} {{ getCategoriaLabel(categoria) }}
                    </option>
                  }
                </select>
              </div>

              <!-- Información Nutricional -->
              <div class="form-section-title">Información Nutricional (por 100g)</div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Energía (kcal) <span class="required">*</span></label>
                  <input
                    type="number"
                    [(ngModel)]="formulario.energia"
                    class="form-input"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div class="form-group">
                  <label>Proteínas (g) <span class="required">*</span></label>
                  <input
                    type="number"
                    [(ngModel)]="formulario.proteinas"
                    class="form-input"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Carbohidratos (g) <span class="required">*</span></label>
                  <input
                    type="number"
                    [(ngModel)]="formulario.carbohidratos"
                    class="form-input"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div class="form-group">
                  <label>Grasas (g) <span class="required">*</span></label>
                  <input
                    type="number"
                    [(ngModel)]="formulario.grasas"
                    class="form-input"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Fibra (g)</label>
                <input
                  type="number"
                  [(ngModel)]="formulario.fibra"
                  class="form-input"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <!-- Descripción -->
              <div class="form-group">
                <label>Descripción</label>
                <textarea
                  [(ngModel)]="formulario.descripcion"
                  rows="3"
                  class="form-input"
                  placeholder="Descripción opcional del ingrediente..."
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
              <h3>¿Eliminar Ingrediente?</h3>
              <p>
                ¿Estás seguro de eliminar el ingrediente <strong>"{{ ingredienteAEliminar?.nombre }}"</strong>?
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

    </div>
  `,
  styles: [`
    /* Estilos base iguales a etiquetas */
    .ingredientes-container {
      padding: 30px;
      background: #F8F9FA;
      min-height: 100vh;
    }

    /* Header */
    .page-header {
      background: white;
      border-radius: 16px;
      padding: 25px 30px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .page-header h1 {
      color: #333333;
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 5px 0;
    }

    .page-header p {
      color: #6C757D;
      font-size: 14px;
      margin: 0;
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

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    .stat-card.green-border::before {
      background: linear-gradient(179deg, #28A745 0%, #20C997 100%);
    }

    .stat-card.yellow-border::before {
      background: linear-gradient(179deg, #FFC107 0%, #FD7E14 100%);
    }

    .stat-card.red-border::before {
      background: linear-gradient(179deg, #DC3545 0%, #E83E8C 100%);
    }

    .stat-card.purple-border::before {
      background: linear-gradient(179deg, #6F42C1 0%, #007BFF 100%);
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
    }

    .search-input-wrapper {
      position: relative;
      max-width: 500px;
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

    .badge-category {
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

    .mobile-nutrition {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: 12px 0;
      border-top: 1px solid #F1F3F4;
      border-bottom: 1px solid #F1F3F4;
      margin-bottom: 12px;
    }

    .nutrition-item {
      display: flex;
      flex-direction: column;
    }

    .nutrition-label {
      color: #6C757D;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .nutrition-data {
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
      display: flex;
      gap: 8px;
    }

    .btn-mobile {
      flex: 1;
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

    .form-section-title {
      color: #333333;
      font-size: 16px;
      font-weight: 700;
      margin: 25px 0 15px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #28A745;
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
      .ingredientes-container {
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

      .mobile-nutrition {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class IngredientesListComponent implements OnInit {
  private ingredienteService = inject(IngredienteService);
  private etiquetaService = inject(EtiquetaService);

  // Signals
  loading = signal(false);
  ingredientes = signal<Ingrediente[]>([]);
  etiquetasDisponibles = signal<Etiqueta[]>([]);
  
  // Paginación
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;
  
  // Búsqueda y filtros
  searchTerm = '';
  categoriaFiltro: CategoriaAlimento | '' = '';
  searchTimeout: any;
  
  // Modal
  mostrarModal = false;
  ingredienteEditando: Ingrediente | null = null;
  
  // Confirmación
  mostrarConfirmacion = false;
  ingredienteAEliminar: Ingrediente | null = null;
  
  // Formulario
  formulario = {
    nombre: '',
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
    energia: 0,
    fibra: 0,
    categoriaAlimento: '' as CategoriaAlimento | '',
    descripcion: '',
    etiquetaIds: [] as number[]
  };
  
  // Estados
  guardando = false;
  eliminando = false;
  
  // Listas para selects
  categorias = Object.values(CategoriaAlimento);

  ngOnInit(): void {
    this.cargarIngredientes();
    this.cargarEtiquetas();
  }

  /**
   * Carga la lista de ingredientes
   */
  cargarIngredientes(): void {
    this.loading.set(true);
    
    let request: Observable<ApiResponse<PageResponse<Ingrediente>>>;
    
    if (this.searchTerm) {
      request = this.ingredienteService.buscarPorNombre(this.searchTerm, this.currentPage, this.pageSize);
    } else if (this.categoriaFiltro) {
      request = this.ingredienteService.filtrarPorCategoria(this.categoriaFiltro, this.currentPage, this.pageSize);
    } else {
      request = this.ingredienteService.listar(this.currentPage, this.pageSize);
    }
    
    request.subscribe({
      next: (response) => {
        this.ingredientes.set(response.data.content);
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar ingredientes:', error);
        this.mostrarError('Error al cargar ingredientes');
        this.loading.set(false);
      }
    });
  }

  /**
   * Carga las etiquetas disponibles para asignar
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
      this.cargarIngredientes();
    }, 500);
  }

  /**
   * Filtrar por categoría
   */
  filtrarPorCategoria(categoria: CategoriaAlimento | ''): void {
    this.categoriaFiltro = categoria;
    this.currentPage = 0;
    this.cargarIngredientes();
  }

  /**
   * Cambiar página
   */
  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.cargarIngredientes();
    }
  }

  /**
   * Abre el modal para crear
   */
  abrirModalCrear(): void {
    this.ingredienteEditando = null;
    this.formulario = {
      nombre: '',
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
      energia: 0,
      fibra: 0,
      categoriaAlimento: '',
      descripcion: '',
      etiquetaIds: []
    };
    this.mostrarModal = true;
  }

  /**
   * Abre el modal para editar
   */
  abrirModalEditar(ingrediente: Ingrediente): void {
    this.ingredienteEditando = ingrediente;
    this.formulario = {
      nombre: ingrediente.nombre,
      proteinas: ingrediente.proteinas,
      carbohidratos: ingrediente.carbohidratos,
      grasas: ingrediente.grasas,
      energia: ingrediente.energia,
      fibra: ingrediente.fibra || 0,
      categoriaAlimento: ingrediente.categoriaAlimento,
      descripcion: ingrediente.descripcion || '',
      etiquetaIds: ingrediente.etiquetas.map((e: Etiqueta) => e.id)
    };
    this.mostrarModal = true;
  }

  /**
   * Cierra el modal
   */
  cerrarModal(): void {
    this.mostrarModal = false;
    this.ingredienteEditando = null;
  }

  /**
   * Guarda un ingrediente
   */
  guardar(): void {
    if (!this.formulario.nombre || !this.formulario.categoriaAlimento) {
      this.mostrarError('Por favor completa los campos obligatorios');
      return;
    }

    this.guardando = true;
    const request = {
      nombre: this.formulario.nombre.trim(),
      proteinas: this.formulario.proteinas,
      carbohidratos: this.formulario.carbohidratos,
      grasas: this.formulario.grasas,
      energia: this.formulario.energia,
      fibra: this.formulario.fibra || undefined,
      categoriaAlimento: this.formulario.categoriaAlimento as CategoriaAlimento,
      descripcion: this.formulario.descripcion?.trim() || undefined,
      etiquetaIds: this.formulario.etiquetaIds.length > 0 ? this.formulario.etiquetaIds : undefined
    };

    const observable = this.ingredienteEditando
      ? this.ingredienteService.actualizar(this.ingredienteEditando.id, request)
      : this.ingredienteService.crear(request);

    observable.subscribe({
      next: (response) => {
        this.mostrarExito(response.message);
        this.cerrarModal();
        this.cargarIngredientes();
        this.guardando = false;
      },
      error: (error) => {
        console.error('Error al guardar:', error);
        this.mostrarError(error.error?.message || 'Error al guardar el ingrediente');
        this.guardando = false;
      }
    });
  }

  /**
   * Confirmar eliminación
   */
  confirmarEliminar(ingrediente: Ingrediente): void {
    this.ingredienteAEliminar = ingrediente;
    this.mostrarConfirmacion = true;
  }

  /**
   * Cerrar confirmación
   */
  cerrarConfirmacion(): void {
    this.mostrarConfirmacion = false;
    this.ingredienteAEliminar = null;
  }

  /**
   * Eliminar ingrediente
   */
  eliminar(): void {
    if (!this.ingredienteAEliminar) return;

    this.eliminando = true;
    this.ingredienteService.eliminar(this.ingredienteAEliminar.id).subscribe({
      next: (response) => {
        this.mostrarExito(response.message);
        this.cerrarConfirmacion();
        this.cargarIngredientes();
        this.eliminando = false;
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
        this.mostrarError(error.error?.message || 'Error al eliminar el ingrediente');
        this.eliminando = false;
      }
    });
  }

  /**
   * Toggle etiqueta en el formulario
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
   * Obtiene el label de la categoría
   */
  getCategoriaLabel(categoria: CategoriaAlimento): string {
    return CATEGORIA_ALIMENTO_LABELS[categoria];
  }

  /**
   * Obtiene el icono de la categoría
   */
  getCategoriaIcon(categoria: CategoriaAlimento): string {
    return CATEGORIA_ALIMENTO_ICONS[categoria];
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