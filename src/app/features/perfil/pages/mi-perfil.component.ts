import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../../../core/services/perfil.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { EtiquetaService } from '../../../core/services/etiqueta.service';
import {
  Etiqueta,
  HistorialMedidasRequest,
  HistorialMedidasResponse,
  NivelActividad,
  ObjetivoSalud,
  PerfilSaludRequest,
  PerfilSaludResponse
} from '../../../core/models';
import { UserResponse } from '../../../core/models/user.model';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mi-perfil-container">
      @if (cargando()) {
        <div class="loading-state">
          <p>Cargando perfil...</p>
        </div>
      } @else {
        <div class="content-layout">
          <!-- PERFIL DE SALUD (INLINE) -->
          <div class="content-card">
            <div class="card-header">
              <h3>Perfil de Salud</h3>

              @if (cambiosPendientes.objetivo || cambiosPendientes.nivel) {
                <button class="btn-primary" (click)="guardarInlineSalud()">
                  Guardar Cambios
                </button>
              }
            </div>

            <div class="card-content form-grid">
              <!-- OBJETIVO NUTRICIONAL -->
              <div class="form-field">
                <label>Objetivo Nutricional</label>
                <select
                  [(ngModel)]="formInline.objetivoActual"
                  (change)="marcarCambio('objetivo')"
                >
                  @for (o of tiposObjetivo; track o) {
                    <option [ngValue]="o">{{ o }}</option>
                  }
                </select>
              </div>

              <!-- NIVEL DE ACTIVIDAD -->
              <div class="form-field">
                <label>Nivel de Actividad</label>
                <select
                  [(ngModel)]="formInline.nivelActividadActual"
                  (change)="marcarCambio('nivel')"
                >
                  @for (n of tiposNivelActividad; track n) {
                    <option [ngValue]="n">{{ n }}</option>
                  }
                </select>
              </div>
            </div>
          </div>

          <!-- ALERGIAS Y CONDICIONES -->
          <div class="content-card">
            <div class="card-header">
              <h3>Alergias y Condiciones Médicas</h3>
            </div>

            <div class="card-content">
              <div class="etiquetas-split">
                <!-- ALERGIAS -->
                <div class="tag-column">
                  <h4>Alergias</h4>
                  @if (alergias().length > 0) {
                    <div class="etiquetas-list">
                      @for (e of alergias(); track e.id) {
                        <button
                          class="etiqueta-chip"
                          [class.selected]="isEtiquetaInline(e.id)"
                          (click)="toggleEtiquetaInline(e.id)"
                        >
                          {{ e.nombre }}
                        </button>
                      }
                    </div>
                  } @else {
                    <p>No hay alergias registradas</p>
                  }
                </div>

                <!-- CONDICIONES MÉDICAS -->
                <div class="tag-column">
                  <h4>Condiciones Médicas</h4>
                  @if (condiciones().length > 0) {
                    <div class="etiquetas-list">
                      @for (e of condiciones(); track e.id) {
                        <button
                          class="etiqueta-chip"
                          [class.selected]="isEtiquetaInline(e.id)"
                          (click)="toggleEtiquetaInline(e.id)"
                        >
                          {{ e.nombre }}
                        </button>
                      }
                    </div>
                  } @else {
                    <p>No hay condiciones médicas registradas</p>
                  }
                </div>
              </div>

              @if (cambiosPendientes.etiquetas) {
                <button
                  class="btn-primary"
                  style="margin-top: 1rem"
                  (click)="guardarInlineEtiquetas()"
                >
                  Guardar Etiquetas
                </button>
              }
            </div>
          </div>

          <!-- HISTORIAL DE MEDIDAS -->
          <div class="content-card">
            <div class="card-header">
              <h3>Historial de Medidas</h3>
              <button class="btn-edit" (click)="abrirModalCrearMedida()">
                Nueva Medida
              </button>
            </div>
            <div class="card-content">
              @if (historialMedidas() && historialMedidas().length > 0) {
                <div class="medidas-list">
                  @for (medida of historialMedidas(); track medida.id) {
                    <div class="medida-item">
                      <div class="medida-info">
                        <div class="medida-fecha">
                          {{ medida.fechaMedicion | date: 'dd/MM/yyyy' }}
                        </div>
                        <div class="medida-datos">
                          <span><strong>Peso:</strong> {{ medida.peso }} kg</span>
                          <span><strong>Altura:</strong> {{ medida.altura }} cm</span>
                          @if (medida.imc) {
                            <span
                              ><strong>IMC:</strong>
                              {{ medida.imc | number: '1.1-1' }}</span
                            >
                          }
                        </div>
                      </div>
                      <div class="medida-actions">
                        <button
                          class="btn-icon"
                          (click)="abrirModalEditarMedida(medida)"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          class="btn-icon btn-danger"
                          (click)="confirmarEliminarMedida(medida)"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="empty-state">
                  <span class="empty-icon">📊</span>
                  <p>No tienes medidas registradas</p>
                </div>
              }
            </div>
          </div>

          <!-- INFORMACIÓN DE USUARIO -->
          <div class="content-card">
            <div class="card-header">
              <h3>Información de Usuario</h3>
            </div>
            <div class="card-content">
              <div class="info-grid">
                <div class="info-field">
                  <label>Nombre de Usuario</label>
                  <p>{{ currentUser()?.nombre || 'No disponible' }}</p>
                </div>
                <div class="info-field">
                  <label>Email</label>
                  <p>{{ currentUser()?.email || 'No disponible' }}</p>
                </div>
                <div class="info-field">
                  <label>Rol</label>
                  <p>{{ currentUser()?.role || 'Usuario' }}</p>
                </div>
              </div>

              <div class="separator"></div>

              <button
                class="btn-danger delete-account-btn"
                (click)="abrirConfirmacionEliminarUsuario()"
              >
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL CREAR/EDITAR MEDIDA -->
      @if (mostrarModalMedida) {
        <div class="modal-overlay" (click)="cerrarModalMedida()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>{{ medidaEditando ? 'Editar Medida' : 'Nueva Medida' }}</h3>
              <button class="btn-close" (click)="cerrarModalMedida()">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-field">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  [(ngModel)]="formularioMedidas.peso"
                  placeholder="Ej: 70.5"
                />
              </div>
              <div class="form-field">
                <label>Altura (cm)</label>
                <input
                  type="number"
                  [(ngModel)]="formularioMedidas.altura"
                  placeholder="Ej: 175"
                />
              </div>
              <div class="form-field">
                <label>Fecha de Medición</label>
                <input
                  type="date"
                  [(ngModel)]="formularioMedidas.fechaMedicion"
                />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" (click)="cerrarModalMedida()">
                Cancelar
              </button>
              <button
                class="btn-primary"
                (click)="guardarMedida()"
                [disabled]="guardandoMedida"
              >
                {{ guardandoMedida ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL CONFIRMAR ELIMINAR MEDIDA -->
      @if (mostrarConfirmacionEliminarMedida) {
        <div class="modal-overlay" (click)="cerrarConfirmacionEliminarMedida()">
          <div class="modal-content modal-small" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Confirmar Eliminación</h3>
              <button
                class="btn-close"
                (click)="cerrarConfirmacionEliminarMedida()"
              >
                ✕
              </button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que deseas eliminar esta medida?</p>
              @if (MedidaAEliminar) {
                <div class="confirmacion-datos">
                  <p>
                    <strong>Fecha:</strong>
                    {{ MedidaAEliminar.fechaMedicion | date: 'dd/MM/yyyy' }}
                  </p>
                  <p><strong>Peso:</strong> {{ MedidaAEliminar.peso }} kg</p>
                  <p><strong>Altura:</strong> {{ MedidaAEliminar.altura }} cm</p>
                </div>
              }
            </div>
            <div class="modal-footer">
              <button
                class="btn-secondary"
                (click)="cerrarConfirmacionEliminarMedida()"
              >
                Cancelar
              </button>
              <button
                class="btn-danger"
                (click)="eliminarMedida()"
                [disabled]="eliminandoMedida"
              >
                {{ eliminandoMedida ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL CONFIRMAR ELIMINAR USUARIO -->
      @if (mostrarConfirmacionEliminarUsuario) {
        <div class="modal-overlay" (click)="cerrarConfirmacionEliminarUsuario()">
          <div class="modal-content modal-small" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Eliminar Cuenta</h3>
              <button
                class="btn-close"
                (click)="cerrarConfirmacionEliminarUsuario()"
              >
                ✕
              </button>
            </div>
            <div class="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se
                puede deshacer.
              </p>
            </div>
            <div class="modal-footer">
              <button
                class="btn-secondary"
                (click)="cerrarConfirmacionEliminarUsuario()"
              >
                Cancelar
              </button>
              <button
                class="btn-danger"
                (click)="eliminarUsuario()"
                [disabled]="eliminandoUsuario"
              >
                {{ eliminandoUsuario ? 'Eliminando...' : 'Eliminar Cuenta' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .mi-perfil-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .content-layout {
      display: flex;
      flex-direction: column;
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

    .card-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #2d3748;
    }

    .card-content {
      padding: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field label {
      color: #718096;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .form-field select,
    .form-field input[type="number"],
    .form-field input[type="date"],
    .form-field textarea {
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 1rem;
      color: #2d3748;
      background: white;
    }

    .form-field select:focus,
    .form-field input:focus,
    .form-field textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    /* Etiquetas */
    .etiquetas-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .tag-column h4 {
      margin: 0 0 0.5rem 0;
      color: #2d3748;
    }

    .etiquetas-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      min-height: 60px;
    }

    .etiqueta-chip {
      padding: 8px 16px;
      border: 2px solid #dee2e6;
      background: white;
      border-radius: 20px;
      color: #6c757d;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .etiqueta-chip:hover {
      border-color: #28a745;
      color: #28a745;
      background: #e8f5e8;
    }

    .etiqueta-chip.selected {
      background: linear-gradient(159deg, #28a745 0%, #20c997 100%);
      color: white;
      border-color: transparent;
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

    /* Historial de Medidas */
    .medidas-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .medida-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
      border-left: 4px solid #48bb78;
    }

    .medida-info {
      flex: 1;
    }

    .medida-fecha {
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .medida-datos {
      display: flex;
      gap: 1.5rem;
      color: #718096;
      font-size: 0.875rem;
    }

    .medida-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      border: none;
      background: #e2e8f0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-size: 1rem;
    }

    .btn-icon:hover {
      background: #cbd5e0;
      transform: translateY(-2px);
    }

    .btn-icon.btn-danger {
      background: #fed7d7;
    }

    .btn-icon.btn-danger:hover {
      background: #fc8181;
    }

    /* Botones */
    .btn-primary,
    .btn-secondary,
    .btn-danger {
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #2d3748;
    }

    .btn-secondary:hover {
      background: #cbd5e0;
    }

    .btn-danger {
      background: #fc8181;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #f56565;
      transform: translateY(-2px);
    }

    .btn-danger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-edit {
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-edit:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .delete-account-btn {
      margin-top: 1rem;
    }

    .separator {
      height: 1px;
      width: 100%;
      background-color: #e2e8f0;
      margin: 1.5rem 0 1rem 0;
    }

    /* Modales */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-content.modal-small {
      max-width: 400px;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #2d3748;
    }

    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: #f7fafc;
      color: #718096;
      font-size: 1.25rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background: #e2e8f0;
      color: #2d3748;
    }

    .modal-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .confirmacion-datos {
      background: #f7fafc;
      padding: 1rem;
      border-radius: 6px;
      margin-top: 1rem;
    }

    .confirmacion-datos p {
      margin: 0.5rem 0;
      color: #2d3748;
      font-size: 0.875rem;
      padding: 0;
      background: none;
    }

    /* Información de Usuario */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .info-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-field label {
      color: #718096;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .info-field p {
      margin: 0;
      color: #2d3748;
      font-size: 1rem;
      padding: 0.75rem;
      background: #f7fafc;
      border-radius: 6px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .mi-perfil-container {
        padding: 1rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .medida-datos {
        flex-direction: column;
        gap: 0.5rem;
      }

      .etiquetas-split {
        grid-template-columns: 1fr;
      }

      .modal-content {
        margin: 1rem;
      }
    }
  `]
})
export class MiPerfilComponent implements OnInit {
  // inyecciones
  private perfilService = inject(PerfilService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private etiquetaService = inject(EtiquetaService);
  

  // signals
  cargando = signal(true);
  perfilSalud = signal<PerfilSaludResponse | null>(null);
  historialMedidas = signal<HistorialMedidasResponse[]>([]);
  currentUser = signal<UserResponse | null>(null);
  etiquetasDisponibles = signal<Etiqueta[]>([]);

  // enums
  tiposObjetivo = Object.values(ObjetivoSalud);
  tiposNivelActividad = Object.values(NivelActividad);

  // perfil inline
  formInline = {
    objetivoActual: undefined as ObjetivoSalud | undefined,
    nivelActividadActual: undefined as NivelActividad | undefined,
    etiquetas: [] as number[]
  };

  cambiosPendientes = {
    objetivo: false,
    nivel: false,
    etiquetas: false
  };

  // medidas
  mostrarModalMedida = false;
  mostrarConfirmacionEliminarMedida = false;
  medidaEditando: HistorialMedidasResponse | null = null;
  MedidaAEliminar: HistorialMedidasResponse | null = null;
  guardandoMedida = false;
  eliminandoMedida = false;

  formularioMedidas = {
    peso: null as number | null,
    altura: null as number | null,
    fechaMedicion: ''
  };

  // eliminar usuario
  mostrarConfirmacionEliminarUsuario = false;
  eliminandoUsuario = false;

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarPerfilSalud();
    this.cargarEtiquetas();
    this.cargarHistorialMedidas();
  }

  /* -------- PERFIL SALUD INLINE -------- */

  marcarCambio(tipo: 'objetivo' | 'nivel') {
    this.cambiosPendientes[tipo] = true;
  }

  guardarInlineSalud() {
    const payload: PerfilSaludRequest = {
      objetivoActual: this.formInline.objetivoActual,
      nivelActividadActual: this.formInline.nivelActividadActual,
      etiquetasId: this.formInline.etiquetas
    };

    this.perfilService.actualizarPerfilSalud(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.notificationService.success(
            'Perfil Salud',
            'Cambios guardados correctamente.'
          );
          this.cargarPerfilSalud();
          this.cambiosPendientes.objetivo = false;
          this.cambiosPendientes.nivel = false;
        } else {
          this.notificationService.error(
            'Perfil Salud',
            res.message || 'No se pudo guardar el perfil.'
          );
        }
      },
      error: () => {
        this.notificationService.error(
          'Perfil Salud',
          'Error al guardar el perfil.'
        );
      }
    });
  }

  guardarInlineEtiquetas() {
    const payload: PerfilSaludRequest = {
      objetivoActual: this.formInline.objetivoActual,
      nivelActividadActual: this.formInline.nivelActividadActual,
      etiquetasId: this.formInline.etiquetas
    };

    this.perfilService.actualizarPerfilSalud(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.notificationService.success(
            'Etiquetas',
            'Etiquetas guardadas correctamente.'
          );
          this.cargarPerfilSalud();
          this.cambiosPendientes.etiquetas = false;
        } else {
          this.notificationService.error(
            'Etiquetas',
            res.message || 'No se pudieron guardar las etiquetas.'
          );
        }
      },
      error: () => {
        this.notificationService.error(
          'Etiquetas',
          'Error al guardar las etiquetas.'
        );
      }
    });
  }

  alergias(): Etiqueta[] {
    return (this.etiquetasDisponibles() || []).filter(
      (e) => String(e.tipoEtiqueta ?? '').toUpperCase() === 'ALERGIA'
    );
  }

  condiciones(): Etiqueta[] {
    return (this.etiquetasDisponibles() || []).filter(
      (e) => String(e.tipoEtiqueta ?? '').toUpperCase() === 'CONDICION_MEDICA'
    );
  }

  isEtiquetaInline(id: number): boolean {
    return this.formInline.etiquetas.includes(id);
  }

  toggleEtiquetaInline(id: number): void {
    const arr = this.formInline.etiquetas;
    const idx = arr.indexOf(id);
    if (idx > -1) {
      arr.splice(idx, 1);
    } else {
      arr.push(id);
    }
    this.cambiosPendientes.etiquetas = true;
  }

  /* -------- CARGAS -------- */

  cargarUsuario(): void {
    const request = this.authService.getcurrentUserValue();
    if (request) {
      this.currentUser.set(request);
    } else {
      this.notificationService.error(
        'Usuario',
        'No se pudo cargar la información del usuario.'
      );
    }
  }

  cargarPerfilSalud(): void {
    this.perfilService.obtenerPerfilSalud().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const ps = response.data;
          this.perfilSalud.set(ps);

          this.formInline.objetivoActual = ps.objetivoActual;
          this.formInline.nivelActividadActual = ps.nivelActividadActual;
          this.formInline.etiquetas = ps.etiquetas.map((e) => e.id);
        } else {
          this.notificationService.error(
            'Perfil Salud',
            'Error al cargar el perfil de salud.'
          );
        }
        this.cargando.set(false);
      },
      error: () => {
        this.notificationService.error(
          'Perfil Salud',
          'Error al cargar el perfil de salud.'
        );
        this.cargando.set(false);
      }
    });
  }

  cargarEtiquetas(): void {
    this.etiquetaService.obtenerTodas().subscribe({
      next: (res) => {
        const lista = Array.isArray(res.data) ? res.data : [];
        this.etiquetasDisponibles.set(lista);
      },
      error: (err) => {
        console.error('Error cargando etiquetas:', err);
        this.etiquetasDisponibles.set([]);
      }
    });
  }

  cargarHistorialMedidas(): void {
    this.perfilService.obtenerMediciones().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.historialMedidas.set(response.data);
        } else {
          this.notificationService.error(
            'Historial de Medidas',
            'Error al cargar el historial de medidas.'
          );
        }
      },
      error: () => {
        this.notificationService.error(
          'Historial de Medidas',
          'Error al cargar el historial de medidas.'
        );
      }
    });
  }

  /* -------- MEDIDAS -------- */

  abrirModalCrearMedida(): void {
    this.medidaEditando = null;
    this.formularioMedidas = {
      peso: 0,
      altura: 0,
      fechaMedicion: ''
    };
    this.mostrarModalMedida = true;
  }

  abrirModalEditarMedida(medida: HistorialMedidasResponse): void {
    this.medidaEditando = medida;
    this.formularioMedidas = {
      peso: medida.peso,
      altura: medida.altura,
      fechaMedicion: medida.fechaMedicion
    };
    this.mostrarModalMedida = true;
  }

  cerrarModalMedida(): void {
    this.mostrarModalMedida = false;
    this.medidaEditando = null;
    this.formularioMedidas = {
      peso: 0,
      altura: 0,
      fechaMedicion: ''
    };
  }

  guardarMedida(): void {
    if (this.guardandoMedida) return;

    this.guardandoMedida = true;

    const medidaRequest: HistorialMedidasRequest = {
      peso: this.formularioMedidas.peso!,
      altura: this.formularioMedidas.altura!,
      fechaMedicion: this.formularioMedidas.fechaMedicion
    };

    if (this.medidaEditando) {
      this.perfilService
        .actualizarMedicion(this.medidaEditando.id, medidaRequest)
        .subscribe({
          next: (response) => {
            if (response.success && response.data) {
              this.notificationService.success(
                'Medida Actualizada',
                'La medición corporal ha sido actualizada exitosamente.'
              );
              this.cargarHistorialMedidas();
              this.cerrarModalMedida();
            } else {
              this.notificationService.error(
                'Medida Actualizada',
                'Error al actualizar la medición corporal.'
              );
            }
            this.guardandoMedida = false;
          },
          error: () => {
            this.notificationService.error(
              'Medida Actualizada',
              'Error al actualizar la medición corporal.'
            );
            this.guardandoMedida = false;
          }
        });
    } else {
      this.perfilService.registrarMedicion(medidaRequest).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.notificationService.success(
              'Medida Registrada',
              'La medición corporal ha sido registrada exitosamente.'
            );
            this.cargarHistorialMedidas();
            this.cerrarModalMedida();
          } else {
            this.notificationService.error(
              'Medida Registrada',
              'Error al registrar la medición corporal.'
            );
          }
          this.guardandoMedida = false;
        },
        error: () => {
          this.notificationService.error(
            'Medida Registrada',
            'Error al registrar la medición corporal.'
          );
          this.guardandoMedida = false;
        }
      });
    }
  }

  confirmarEliminarMedida(medida: HistorialMedidasResponse): void {
    this.MedidaAEliminar = medida;
    this.mostrarConfirmacionEliminarMedida = true;
  }

  cerrarConfirmacionEliminarMedida(): void {
    this.mostrarConfirmacionEliminarMedida = false;
    this.MedidaAEliminar = null;
  }

  eliminarMedida(): void {
    if (this.eliminandoMedida || !this.MedidaAEliminar) return;

    this.eliminandoMedida = true;

    this.perfilService.eliminarMedicion(this.MedidaAEliminar.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success(
            'Medida Eliminada',
            'La medición corporal ha sido eliminada exitosamente.'
          );
          this.cargarHistorialMedidas();
          this.cerrarConfirmacionEliminarMedida();
        } else {
          this.notificationService.error(
            'Medida Eliminada',
            'Error al eliminar la medición corporal.'
          );
        }
        this.eliminandoMedida = false;
      },
      error: () => {
        this.notificationService.error(
          'Medida Eliminada',
          'Error al eliminar la medición corporal.'
        );
        this.eliminandoMedida = false;
      }
    });
  }

  /* -------- ELIMINAR USUARIO -------- */

  abrirConfirmacionEliminarUsuario(): void {
    this.mostrarConfirmacionEliminarUsuario = true;
  }

  cerrarConfirmacionEliminarUsuario(): void {
    this.mostrarConfirmacionEliminarUsuario = false;
  }

  eliminarUsuario(): void {
  if (this.eliminandoUsuario) return;

  this.eliminandoUsuario = true;

  this.authService.eliminarCuenta().subscribe({
      next: (res) => {
        this.notificationService.success(
          "Cuenta eliminada",
          res?.message || "Tu cuenta ha sido eliminada exitosamente"
        );

        this.mostrarConfirmacionEliminarUsuario = false;
        this.eliminandoUsuario = false;
      },
      error: (err) => {
        this.notificationService.error(
          "Error",
          err.error?.message || "No se pudo eliminar la cuenta"
        );

        this.eliminandoUsuario = false;
      }
    });
  }

}
