// src/app/features/etiquetas/pages/etiquetas-list.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EtiquetaService } from '../../../../core/services/etiqueta.service';
import {
  Etiqueta,
  EtiquetaRequest,
  TipoEtiqueta,
  TIPO_ETIQUETA_LABELS,
  TIPO_ETIQUETA_COLORS,
  TIPO_ETIQUETA_ICONS,
  ApiResponse,
  PageResponse
} from '../../../../core/models/etiqueta.model';

@Component({
  selector: 'app-etiquetas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="etiquetas-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon>label</mat-icon>
            Gestión de Etiquetas
          </h1>
          <p class="page-subtitle">Crea, edita y gestiona todas las etiquetas desde aquí.</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card green-border">
          <div class="stat-header">
            <span class="stat-title">Total Etiquetas</span>
            <div class="stat-icon green">🏷️</div>
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
          <div class="stat-value">{{ tiposEtiqueta.length }}</div>
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
            <span class="stat-title">Resultados</span>
            <div class="stat-icon red">📚</div>
          </div>
          <div class="stat-value">{{ etiquetas().length }}</div>
          <div class="stat-footer">
            <span class="stat-subtitle">mostrando ahora</span>
          </div>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="search-card">
        <div class="search-filters-wrapper">
          <div class="search-input-wrapper">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              placeholder="Buscar etiquetas por nombre..."
              class="search-input"
            />
          </div>
          
          <div class="filter-wrapper">
            <svg class="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
            <select
              [(ngModel)]="tipoFiltro"
              (change)="onFiltrar()"
              class="filter-select"
              [class.active-filter]="tipoFiltro"
            >
              <option value="">Todos los tipos</option>
              @for (tipo of tiposEtiqueta; track tipo) {
                <option [value]="tipo">{{ getTipoIcon(tipo) }} {{ getTipoLabel(tipo) }}</option>
              }
            </select>
          </div>

          @if (searchTerm || tipoFiltro) {
            <button (click)="limpiarFiltros()" class="btn-clear-filters" title="Limpiar filtros">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Limpiar
            </button>
          }
        </div>
        
        <button (click)="abrirModalCrear()" class="btn-primary">
          <span>+</span>
          Nueva Etiqueta
        </button>
      </div>

      @if (loading()) {
        <div class="loading-card">
          <div class="spinner"></div>
          <p>Cargando etiquetas...</p>
        </div>
      }

      <!-- Desktop Table -->
      @if (!loading() && etiquetas().length > 0) {
        <div class="table-card desktop-only">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (etiqueta of etiquetas(); track etiqueta.id) {
                <tr>
                  <td>
                    <span class="table-id">#{{ etiqueta.id }}</span>
                  </td>
                  <td>
                    <div class="table-name">
                      <span class="name-icon">{{ getTipoIcon(etiqueta.tipoEtiqueta) }}</span>
                      <span>{{ etiqueta.nombre }}</span>
                    </div>
                  </td>
                  <td>
                    <span [class]="'badge ' + getTipoColor(etiqueta.tipoEtiqueta)">
                      {{ getTipoLabel(etiqueta.tipoEtiqueta) }}
                    </span>
                  </td>
                  <td>
                    <span class="table-description">{{ etiqueta.descripcion || 'Sin descripción' }}</span>
                  </td>
                  <td class="text-right">
                    <div class="action-buttons">
                      <button
                        (click)="abrirModalEditar(etiqueta)"
                        class="btn-action edit"
                        title="Editar"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        (click)="confirmarEliminar(etiqueta)"
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
                Mostrando <strong>{{ etiquetas().length }}</strong> de <strong>{{ totalElements }}</strong> resultados
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
          @for (etiqueta of etiquetas(); track etiqueta.id) {
            <div class="mobile-card">
              <div class="mobile-card-header">
                <div class="mobile-card-title">
                  <span class="mobile-icon">{{ getTipoIcon(etiqueta.tipoEtiqueta) }}</span>
                  <div>
                    <div class="mobile-name">{{ etiqueta.nombre }}</div>
                    <div class="mobile-id">#{{ etiqueta.id }}</div>
                  </div>
                </div>
                <span [class]="'badge ' + getTipoColor(etiqueta.tipoEtiqueta)">
                  {{ getTipoLabel(etiqueta.tipoEtiqueta) }}
                </span>
              </div>

              @if (etiqueta.descripcion) {
                <div class="mobile-card-description">
                  {{ etiqueta.descripcion }}
                </div>
              }

              <div class="mobile-card-actions">
                <button
                  (click)="abrirModalEditar(etiqueta)"
                  class="btn-mobile edit"
                >
                  ✏️ Editar
                </button>
                <button
                  (click)="confirmarEliminar(etiqueta)"
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
                <span>({{ etiquetas().length }} de {{ totalElements }} resultados)</span>
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
      @if (!loading() && etiquetas().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🏷️</div>
          <h3>No hay etiquetas registradas</h3>
          <p>Comienza creando tu primera etiqueta para organizar tu sistema</p>
          <button (click)="abrirModalCrear()" class="btn-primary">
            <span>+</span>
            Nueva Etiqueta
          </button>
        </div>
      }

      <!-- Modal Crear/Editar -->
      @if (mostrarModal) {
        <div class="modal-overlay" (click)="cerrarModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ etiquetaEditando ? 'Editar Etiqueta' : 'Nueva Etiqueta' }}</h2>
            </div>

            <div class="modal-body">
              <div class="form-group">
                <label>
                  Nombre <span class="required">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="formulario.nombre"
                  class="form-input"
                  placeholder="Ej: Sin Gluten"
                />
              </div>

              <div class="form-group">
                <label>
                  Tipo de Etiqueta <span class="required">*</span>
                </label>
                <select
                  [(ngModel)]="formulario.tipoEtiqueta"
                  (change)="onTipoChange()"
                  class="form-input"
                >
                  <option value="">Selecciona un tipo</option>
                  @for (tipo of tiposEtiqueta; track tipo) {
                    <option [value]="tipo">{{ getTipoIcon(tipo) }} {{ getTipoLabel(tipo) }}</option>
                  }
                  <option value="__CUSTOM__">➕ Agregar nuevo tipo...</option>
                </select>
              </div>

              <!-- Campo para tipo personalizado -->
              @if (mostrarCampoTipoPersonalizado) {
                <div class="form-group custom-type-group">
                  <label>
                    Nombre del Nuevo Tipo <span class="required">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="tipoPersonalizado"
                    class="form-input"
                    placeholder="Ej: CATEGORIA_ALIMENTO"
                    (input)="onTipoPersonalizadoChange()"
                  />
                  <small class="help-text">
                    💡 Usa MAYÚSCULAS y guiones bajos (Ej: MI_TIPO_PERSONALIZADO)
                  </small>
                </div>
              }

              <div class="form-group">
                <label>Descripción</label>
                <textarea
                  [(ngModel)]="formulario.descripcion"
                  rows="3"
                  class="form-input"
                  placeholder="Descripción opcional de la etiqueta..."
                ></textarea>
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
              <h3>¿Eliminar Etiqueta?</h3>
              <p>
                ¿Estás seguro de eliminar la etiqueta <strong>"{{ etiquetaAEliminar?.nombre }}"</strong>?
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
    .etiquetas-container {
      padding: 30px;
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

    /* Search Card */
    .search-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      background: white;
      border-radius: 16px;
      padding: 20px 25px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      margin-bottom: 30px;
    }

    .search-filters-wrapper {
      display: flex;
      gap: 12px;
      flex: 1;
      max-width: 800px;
    }

    .search-input-wrapper {
      position: relative;
      flex: 1;
      min-width: 250px;
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

    .filter-wrapper {
      position: relative;
      min-width: 250px;
    }

    .filter-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: #6C757D;
      pointer-events: none;
    }

    .filter-select {
      width: 100%;
      padding: 12px 12px 12px 40px;
      border: 1px solid #DEE2E6;
      border-radius: 8px;
      font-size: 14px;
      color: #333333;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236C757D' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
    }

    .filter-select:focus {
      outline: none;
      border-color: #28A745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }

    .filter-select:hover {
      border-color: #ADB5BD;
    }

    .filter-select.active-filter {
      border-color: #28A745;
      background-color: #F0FFF4;
    }

    .btn-clear-filters {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      border: 1px solid #DEE2E6;
      background: white;
      border-radius: 8px;
      color: #6C757D;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .btn-clear-filters:hover {
      background: #F8F9FA;
      border-color: #DC3545;
      color: #DC3545;
    }

    .btn-clear-filters svg {
      flex-shrink: 0;
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

    .table-description {
      color: #6C757D;
      max-width: 300px;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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

    .badge.bg-green-100 {
      background: #E8F5E8;
      color: #28A745;
    }

    .badge.bg-blue-100 {
      background: #D1ECF1;
      color: #007BFF;
    }

    .badge.bg-yellow-100 {
      background: #FFF3CD;
      color: #FFC107;
    }

    .badge.bg-red-100 {
      background: #F8D7DA;
      color: #DC3545;
    }

    .badge.bg-purple-100 {
      background: #E2E3F1;
      color: #6F42C1;
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

    .mobile-card-description {
      color: #6C757D;
      font-size: 13px;
      margin-bottom: 12px;
      padding-top: 12px;
      border-top: 1px solid #F1F3F4;
    }

    .mobile-card-actions {
      display: flex;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid #F1F3F4;
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

    /* Campo de tipo personalizado */
    .custom-type-group {
      background: #F8F9FA;
      padding: 16px;
      border-radius: 8px;
      border-left: 3px solid #28A745;
    }

    .help-text {
      display: block;
      margin-top: 6px;
      font-size: 12px;
      color: #6C757D;
      font-style: italic;
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
      .etiquetas-container {
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

      .search-card {
        flex-direction: column;
        padding: 16px;
        margin-bottom: 20px;
        gap: 12px;
      }

      .search-filters-wrapper {
        flex-direction: column;
        width: 100%;
        max-width: 100%;
      }

      .search-input-wrapper,
      .filter-wrapper {
        width: 100%;
        min-width: 100%;
      }

      .btn-primary {
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
  `]
})
export class EtiquetasListComponent implements OnInit {
  private etiquetaService: EtiquetaService = inject(EtiquetaService);

  // Signals para estado reactivo
  loading = signal(false);
  etiquetas = signal<Etiqueta[]>([]);
  
  // Paginación
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;
  
  // Búsqueda y filtros
  searchTerm = '';
  tipoFiltro = '';
  searchTimeout: any;
  
  // Modal
  mostrarModal = false;
  etiquetaEditando: Etiqueta | null = null;
  
  // Confirmación
  mostrarConfirmacion = false;
  etiquetaAEliminar: Etiqueta | null = null;
  
  // Formulario
  formulario = {
    nombre: '',
    tipoEtiqueta: '',
    descripcion: ''
  };
  
  // Estados de guardado/eliminado
  guardando = false;
  eliminando = false;
  
  // Lista de tipos para el select
  tiposEtiqueta = Object.values(TipoEtiqueta);

  // Tipo personalizado
  mostrarCampoTipoPersonalizado = false;
  tipoPersonalizado = '';

  ngOnInit(): void {
    this.cargarEtiquetas();
  }

  /**
   * Carga la lista de etiquetas desde el backend
   */
  cargarEtiquetas(): void {
    this.loading.set(true);
    
    const request = this.searchTerm 
      ? this.etiquetaService.buscarPorNombre(this.searchTerm, this.currentPage, this.pageSize)
      : this.etiquetaService.listar(this.currentPage, this.pageSize);
    
    request.subscribe({
      next: (response: ApiResponse<PageResponse<Etiqueta>>) => {
        let etiquetas = response.data.content;
        
        // Aplicar filtro por tipo si está seleccionado
        if (this.tipoFiltro) {
          etiquetas = etiquetas.filter(e => e.tipoEtiqueta === this.tipoFiltro);
        }
        
        this.etiquetas.set(etiquetas);
        this.totalPages = response.data.totalPages;
        this.totalElements = this.tipoFiltro 
          ? etiquetas.length // Cuando hay filtro, mostrar solo los filtrados
          : response.data.totalElements;
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error al cargar etiquetas:', error);
        this.mostrarError('Error al cargar etiquetas');
        this.loading.set(false);
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
      this.cargarEtiquetas();
    }, 500);
  }

  /**
   * Filtrar por tipo de etiqueta
   */
  onFiltrar(): void {
    this.currentPage = 0;
    this.cargarEtiquetas();
  }

  /**
   * Limpiar filtros
   */
  limpiarFiltros(): void {
    this.searchTerm = '';
    this.tipoFiltro = '';
    this.currentPage = 0;
    this.cargarEtiquetas();
  }

  /**
   * Cambiar página
   */
  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.cargarEtiquetas();
    }
  }

  /**
   * Abre el modal para crear una nueva etiqueta
   */
  abrirModalCrear(): void {
    this.etiquetaEditando = null;
    this.formulario = {
      nombre: '',
      tipoEtiqueta: '',
      descripcion: ''
    };
    this.mostrarModal = true;
  }

  /**
   * Abre el modal para editar una etiqueta existente
   */
  abrirModalEditar(etiqueta: Etiqueta): void {
    this.etiquetaEditando = etiqueta;
    this.formulario = {
      nombre: etiqueta.nombre,
      tipoEtiqueta: etiqueta.tipoEtiqueta,
      descripcion: etiqueta.descripcion || ''
    };
    this.mostrarModal = true;
  }

  /**
   * Cierra el modal de formulario
   */
  cerrarModal(): void {
    this.mostrarModal = false;
    this.etiquetaEditando = null;
    this.mostrarCampoTipoPersonalizado = false;
    this.tipoPersonalizado = '';
  }

  /**
   * Guarda una etiqueta (crear o actualizar)
   */
  guardar(): void {
    // Validar campos obligatorios
    if (!this.formulario.nombre) {
      this.mostrarError('El nombre es obligatorio');
      return;
    }

    // Determinar el tipo a usar
    let tipoFinal = this.formulario.tipoEtiqueta;
    
    if (this.mostrarCampoTipoPersonalizado) {
      if (!this.tipoPersonalizado || this.tipoPersonalizado.trim().length === 0) {
        this.mostrarError('Por favor ingresa el nombre del nuevo tipo');
        return;
      }
      tipoFinal = this.tipoPersonalizado.trim();
    } else if (!tipoFinal) {
      this.mostrarError('Por favor selecciona un tipo de etiqueta');
      return;
    }

    this.guardando = true;
    const request: EtiquetaRequest = {
      nombre: this.formulario.nombre.trim(),
      tipoEtiqueta: tipoFinal as any,
      descripcion: this.formulario.descripcion?.trim() || undefined
    };

    const observable = this.etiquetaEditando
      ? this.etiquetaService.actualizar(this.etiquetaEditando.id, request)
      : this.etiquetaService.crear(request);

    observable.subscribe({
      next: (response: ApiResponse<Etiqueta>) => {
        this.mostrarExito(response.message);
        this.cerrarModal();
        this.cargarEtiquetas();
        this.guardando = false;
        
        // Resetear campos personalizados
        this.mostrarCampoTipoPersonalizado = false;
        this.tipoPersonalizado = '';
      },
      error: (error: any) => {
        console.error('Error al guardar:', error);
        this.mostrarError(error.error?.message || 'Error al guardar la etiqueta');
        this.guardando = false;
      }
    });
  }

  /**
   * Abre el modal de confirmación para eliminar
   */
  confirmarEliminar(etiqueta: Etiqueta): void {
    this.etiquetaAEliminar = etiqueta;
    this.mostrarConfirmacion = true;
  }

  /**
   * Cierra el modal de confirmación
   */
  cerrarConfirmacion(): void {
    this.mostrarConfirmacion = false;
    this.etiquetaAEliminar = null;
  }

  /**
   * Elimina una etiqueta
   */
  eliminar(): void {
    if (!this.etiquetaAEliminar) return;

    this.eliminando = true;
    this.etiquetaService.eliminar(this.etiquetaAEliminar.id).subscribe({
      next: (response: ApiResponse<void>) => {
        this.mostrarExito(response.message);
        this.cerrarConfirmacion();
        this.cargarEtiquetas();
        this.eliminando = false;
      },
      error: (error: any) => {
        console.error('Error al eliminar:', error);
        this.mostrarError(error.error?.message || 'Error al eliminar la etiqueta');
        this.eliminando = false;
      }
    });
  }

  /**
   * Maneja el cambio de tipo de etiqueta
   */
  onTipoChange(): void {
    if (this.formulario.tipoEtiqueta === '__CUSTOM__') {
      this.mostrarCampoTipoPersonalizado = true;
      this.tipoPersonalizado = '';
    } else {
      this.mostrarCampoTipoPersonalizado = false;
      this.tipoPersonalizado = '';
    }
  }

  /**
   * Maneja el cambio en el campo de tipo personalizado
   */
  onTipoPersonalizadoChange(): void {
    // Convertir a mayúsculas y reemplazar espacios con guiones bajos
    this.tipoPersonalizado = this.tipoPersonalizado
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '');
  }

  /**
   * Obtiene la etiqueta en español del tipo
   */
  getTipoLabel(tipo: string): string {
    // Primero intenta obtener del enum predefinido
    const label = TIPO_ETIQUETA_LABELS[tipo as TipoEtiqueta];
    if (label) return label;
    
    // Si no existe, formatea el tipo personalizado a un formato legible
    return tipo
      .split('_')
      .map(palabra => palabra.charAt(0) + palabra.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Obtiene el color del badge según el tipo
   */
  getTipoColor(tipo: string): string {
    return TIPO_ETIQUETA_COLORS[tipo as TipoEtiqueta] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Obtiene el icono según el tipo
   */
  getTipoIcon(tipo: string): string {
    return TIPO_ETIQUETA_ICONS[tipo as TipoEtiqueta] || '🏷️';
  }

  /**
   * Agrupa las etiquetas por tipo (para CA 2 - Vista agrupada)
   */
  agruparPorTipo(): Map<string, Etiqueta[]> {
    const grupos = new Map<string, Etiqueta[]>();
    
    this.etiquetas().forEach(etiqueta => {
      if (!grupos.has(etiqueta.tipoEtiqueta)) {
        grupos.set(etiqueta.tipoEtiqueta, []);
      }
      grupos.get(etiqueta.tipoEtiqueta)?.push(etiqueta);
    });
    
    return grupos;
  }

  /**
   * Muestra un mensaje de éxito
   */
  private mostrarExito(mensaje: string): void {
    // TODO: Implementar con tu sistema de notificaciones (toast, snackbar, etc.)
    alert(mensaje);
  }

  /**
   * Muestra un mensaje de error
   */
  private mostrarError(mensaje: string): void {
    // TODO: Implementar con tu sistema de notificaciones (toast, snackbar, etc.)
    alert(mensaje);
  }
}