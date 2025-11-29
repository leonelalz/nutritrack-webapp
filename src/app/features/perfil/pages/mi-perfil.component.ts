import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../../../core/services/perfil.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { EtiquetaService } from '../../../core/services/etiqueta.service';
import { ApiResponse, Etiqueta, HistorialMedidasRequest, HistorialMedidasResponse, NivelActividad, ObjetivoSalud, PerfilSaludRequest, PerfilSaludResponse } from '../../../core/models';
import { Observable } from 'rxjs';
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
      <!-- Perfil de Salud -->
      <div class="content-card">
        <div class="card-header">
          <h3>Perfil de Salud</h3>
          <button class="btn-edit" (click)="abrirModalEditarSalud(perfilSalud())">
            Editar
          </button>
        </div>
        <div class="card-content">
          <div class="form-grid">
            <div class="form-field">
              <label>Objetivo Nutricional</label>
              <p>{{ perfilSalud()?.objetivoActual }}</p>
            </div>
            <div class="form-field">
              <label>Nivel de Actividad</label>
              <p>{{ perfilSalud()?.nivelActividadActual }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Alergias y Condiciones -->
      <div class="content-card">
        <div class="card-header">
          <h3>Alergias y Condiciones Médicas</h3>
          <button class="btn-edit" (click)="abrirModalEditarSalud(perfilSalud())">
           Editar etiquetas
         </button>
        </div>
        <div class="card-content">
          @if (perfilAlergias().length > 0) {
            <div class="etiquetas-list">
              @for (etiqueta of perfilAlergias(); track etiqueta.id) {
                <button
                      type="button"
                      (click)="toggleEtiquetaSeleccionada(etiqueta.id)"
                      [class.selected]="isEtiquetaSeleccionada(etiqueta.id)"
                      class="etiqueta-chip"
                    >
                      {{ etiqueta.nombre }}
                    </button>
              }
            </div>
          } @else {
            <div class="empty-state">
              <span class="empty-icon">🏷️</span>
              <p>No tienes alergias registradas</p>
            </div>
          }
        </div>
      </div>

      <!-- Historial de Medidas -->
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
                    <div class="medida-fecha">{{ medida.fechaMedicion | date:'dd/MM/yyyy' }}</div>
                    <div class="medida-datos">
                      <span><strong>Peso:</strong> {{ medida.peso }} kg</span>
                      <span><strong>Altura:</strong> {{ medida.altura }} cm</span>
                      @if (medida.imc) {
                        <span><strong>IMC:</strong> {{ medida.imc | number:'1.1-1' }}</span>
                      }
                    </div>
                  </div>
                  <div class="medida-actions">
                    <button class="btn-icon" (click)="abrirModalEditarMedida(medida)" title="Editar">
                      ✏️
                    </button>
                    <button class="btn-icon btn-danger" (click)="confirmarEliminarMedida(medida)" title="Eliminar">
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

      <!-- Información de Usuario -->
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
        </div>
      </div>
    </div>
  }

  <!-- Modal Editar Perfil de Salud -->
  @if (mostrarModalSalud) {
    <div class="modal-overlay" (click)="cerrarModalSalud()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Editar Perfil de Salud</h3>
          <button class="btn-close" (click)="cerrarModalSalud()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label>Objetivo Nutricional</label>
            <select [(ngModel)]="formularioSalud.objetivoActual">
              @for (objetivo of tiposObjetivo; track objetivo) {
                <option [ngValue]="objetivo">{{ objetivo }}</option>
              }
            </select>
          </div>
          <div class="form-field">
            <label>Nivel de Actividad</label>
            <select [(ngModel)]="formularioSalud.nivelActividadActual">
              @for (nivel of tiposNivelActividad; track nivel) {
                <option [ngValue]="nivel">{{ nivel }}</option>
              }
            </select>
          </div>
          <div class="form-field full-width">
            <label>Etiquetas (Alergias y Condiciones)</label>
            @if (etiquetasAlergia().length > 0) {
              <div class="etiquetas-checkboxes">
                @for (etiqueta of etiquetasAlergia(); track etiqueta.id) {
                  <label class="checkbox-item">
                    <input type="checkbox"
                      [checked]="isEtiquetaSeleccionada(etiqueta.id)"
                      (change)="toggleEtiquetaSeleccionada(etiqueta.id)">
                    {{ etiqueta.nombre }} <small>({{ etiqueta.tipoEtiqueta }})</small>
                  </label>
                }
              </div>
            } @else {
              <p class="empty-state">No hay etiquetas de alergia disponibles</p>
            }
          </div>

        </div>
        <div class="modal-footer">
          <button class="btn-secondary" (click)="cerrarModalSalud()">Cancelar</button>
          <button class="btn-primary" (click)="guardarPerfilSalud()" [disabled]="guardandoSalud">
            {{ guardandoSalud ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  }

  <!-- Modal Crear/Editar Medida -->
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
            <input type="number" [(ngModel)]="formularioMedidas.peso" placeholder="Ej: 70.5">
          </div>
          <div class="form-field">
            <label>Altura (cm)</label>
            <input type="number" [(ngModel)]="formularioMedidas.altura" placeholder="Ej: 175">
          </div>
          <div class="form-field">
            <label>Fecha de Medición</label>
            <input type="date" [(ngModel)]="formularioMedidas.fechaMedicion">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" (click)="cerrarModalMedida()">Cancelar</button>
          <button class="btn-primary" (click)="guardarMedida()" [disabled]="guardandoMedida">
            {{ guardandoMedida ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  }

  <!-- Modal Confirmación Eliminar Medida -->
  @if (mostrarConfirmacionEliminarMedida) {
    <div class="modal-overlay" (click)="cerrarConfirmacionEliminarMedida()">
      <div class="modal-content modal-small" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Confirmar Eliminación</h3>
          <button class="btn-close" (click)="cerrarConfirmacionEliminarMedida()">✕</button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar esta medida?</p>
          @if (MedidaAEliminar) {
            <div class="confirmacion-datos">
              <p><strong>Fecha:</strong> {{ MedidaAEliminar.fechaMedicion | date:'dd/MM/yyyy' }}</p>
              <p><strong>Peso:</strong> {{ MedidaAEliminar.peso }} kg</p>
              <p><strong>Altura:</strong> {{ MedidaAEliminar.altura }} cm</p>
            </div>
          }
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" (click)="cerrarConfirmacionEliminarMedida()">Cancelar</button>
          <button class="btn-danger" (click)="eliminarMedida()" [disabled]="eliminandoMedida">
            {{ eliminandoMedida ? 'Eliminando...' : 'Eliminar' }}
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

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
}

.page-title .icon {
  font-size: 2.5rem;
}

.page-subtitle {
  margin: 0;
  color: #718096;
  font-size: 1.1rem;
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

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  color: #718096;
  font-size: 0.875rem;
  font-weight: 600;
}

.form-field p {
  margin: 0;
  color: #2d3748;
  font-size: 1rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 6px;
}

.form-field select,
.form-field textarea {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  color: #2d3748;
  background: white;
}

.form-field select:focus,
.form-field textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.etiquetas-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: #F8F9FA;
  border-radius: 8px;
  min-height: 60px;
}

.etiqueta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #667eea;
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

.etiqueta-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.etiqueta-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  flex-shrink: 0;
}

.badge-alergia {
  background: #fee;
  color: #c53030;
}

.badge-condicion {
  background: #fef3c7;
  color: #92400e;
}

.etiqueta-info h4 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1rem;
}

.etiqueta-info p {
  margin: 0;
  color: #718096;
  font-size: 0.875rem;
  padding: 0;
  background: none;
}

.btn-remove {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #fed7d7;
  color: #c53030;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #c53030;
  color: white;
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

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
  padding: 0;
  background: none;
}

/* Estilos para Historial de Medidas */
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

/* Estilos de Modales */
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

.modal-body input[type="number"],
.modal-body input[type="date"] {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  color: #2d3748;
  width: 100%;
}

.modal-body input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Estilos de Botones */
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

  .modal-content {
    margin: 1rem;
  }
}
  `]
})
export class MiPerfilComponent implements OnInit {
  //injects
  private perfilService = inject(PerfilService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private etiquetaService = inject(EtiquetaService);


  //signals y variables
  cargando = signal(true);
  editando = signal(false);
  perfilSalud = signal<PerfilSaludResponse | null>(null);
  historialMedidas = signal<HistorialMedidasResponse[]>([]);
  currentUser = signal<UserResponse | null>(null);
  etiquetasDisponibles = signal<Etiqueta[]>([]);
  
  //modales y formularios
  mostrarModalSalud = false;
  mostrarModalMedida = false;
  saludEditando: PerfilSaludResponse | null = null;
  medidaEditando: HistorialMedidasResponse | null = null;

  formularioSalud = {
    objetivoActual: '' as ObjetivoSalud | undefined,
    nivelActividadActual: '' as NivelActividad | undefined,
    etiquetaIds: [] as number[] | undefined
  };

  formularioMedidas = {
    peso: null as number | null,
    altura: null as number | null,
    fechaMedicion: ''
  };
  
  mostrarConfirmacionEliminarCuenta = false;
  mostrarConfirmacionCambiosSalud = false;
  mostrarConfirmacionEliminarMedida = false;
  mostrarConfirmacionCambiosMedida = false;
  MedidaAEliminar: HistorialMedidasResponse | null = null;


  //estados de acciones
  guardandoSalud = false;
  guardandoMedida = false;
  eliminandoMedida = false;

  //listas y enums
  tiposObjetivo = Object.values(ObjetivoSalud);
  tiposNivelActividad = Object.values(NivelActividad);


  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarPerfilSalud();
    this.cargarEtiquetas();
    this.cargarHistorialMedidas();
    console.log('etiquetas disponibles', this.etiquetasDisponibles());
  }

  /**
   * Devuelve solo las etiquetas cuyo tipo es 'ALERGIA' (insensible a mayúsculas)
   */
  etiquetasAlergia(): Etiqueta[] {
    const tipos = ['ALERGIA', 'CONDICION_MEDICA'];
    return (this.etiquetasDisponibles() || []).filter(e => tipos.includes(String(e.tipoEtiqueta ?? '').toUpperCase()));
  }

  /**
   * Devuelve solo las etiquetas de alergia presentes en el perfil
   */
  perfilAlergias(): Etiqueta[] {
    const tipos = ['ALERGIA', 'CONDICION_MEDICA'];
    return (this.perfilSalud()?.etiquetas ?? []).filter(e => tipos.includes(String(e.tipoEtiqueta ?? '').toUpperCase()));
  }
  
  cargarUsuario(): void {
    let request: UserResponse | null;

    request = this.authService.getcurrentUserValue();
    if (request) {
      this.currentUser.set(request);
      return;
    } else {
      this.notificationService.error('Usuario','No se pudo cargar la información del usuario.');
    }
  }

  cargarPerfilSalud(): void {
    this.perfilService.obtenerPerfilSalud().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.perfilSalud.set(response.data);
        } else {
          this.notificationService.error('Perfil Salud','Error al cargar el perfil de salud.');
        }
        this.cargando.set(false);
      },
      error: () => {
        this.notificationService.error('Perfil Salud','Error al cargar el perfil de salud.');
        this.cargando.set(false);
      }
    });
  }

  cargarEtiquetas(): void {
    this.etiquetaService.obtenerTodas().subscribe({
    next: (res) => {
      const lista = Array.isArray(res.data) ? res.data : [];

      console.log("Etiquetas cargadas:", lista);
      this.etiquetasDisponibles.set(lista);
    },
    error: (err) => {
      console.error("Error cargando etiquetas:", err);
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
          this.notificationService.error('Historial de Medidas','Error al cargar el historial de medidas.');
        }
      },
      error: () => {
        this.notificationService.error('Historial de Medidas','Error al cargar el historial de medidas.');
      }
    });
  }


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
      //actualizar
      this.perfilService.actualizarMedicion(this.medidaEditando.id, medidaRequest).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.notificationService.success('Medida Actualizada','La medición corporal ha sido actualizada exitosamente.');
            this.cargarHistorialMedidas();
            this.cerrarModalMedida();
          }
          else {
            this.notificationService.error('Medida Actualizada','Error al actualizar la medición corporal.');
          }
          this.guardandoMedida = false;
        },
        error: () => {
          this.notificationService.error('Medida Actualizada','Error al actualizar la medición corporal.');
          this.guardandoMedida = false;
        }
      });
    } else {
      //crear
      this.perfilService.registrarMedicion(medidaRequest).subscribe({
        next: (response) => { 
          if (response.success && response.data) {
            this.notificationService.success('Medida Registrada','La medición corporal ha sido registrada exitosamente.');
            this.cargarHistorialMedidas();
            this.cerrarModalMedida();
          } else {
            this.notificationService.error('Medida Registrada','Error al registrar la medición corporal.');
          }
          this.guardandoMedida = false;
        },
        error: () => {
          this.notificationService.error('Medida Registrada','Error al registrar la medición corporal.');
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
          this.notificationService.success('Medida Eliminada','La medición corporal ha sido eliminada exitosamente.');
          this.cargarHistorialMedidas();
          this.cerrarConfirmacionEliminarMedida();
        } else {
          this.notificationService.error('Medida Eliminada','Error al eliminar la medición corporal.');
        }
        this.eliminandoMedida = false;
      },
      error: () => {
        this.notificationService.error('Medida Eliminada','Error al eliminar la medición corporal.');
        this.eliminandoMedida = false;
      }
    });
  }

  abrirModalEditarSalud(perfilSalud: PerfilSaludResponse | null): void {
    // intentar recargar etiquetas para asegurarnos que estén disponibles en el modal
    this.cargarEtiquetas();

    this.saludEditando = perfilSalud;
    this.formularioSalud = {
      objetivoActual: perfilSalud?.objetivoActual,
      nivelActividadActual: perfilSalud?.nivelActividadActual,
      // asegurar array aunque perfilSalud sea null
      // asegurar array con ids de ALERGIA y CONDICION_MEDICA
      etiquetaIds: (perfilSalud?.etiquetas ?? [])
        .filter(e => {
          const t = String(e.tipoEtiqueta ?? '').toUpperCase();
          return t === 'ALERGIA' || t === 'CONDICION_MEDICA';
        })
        .map(e => e.id)
    };
    console.log('[MiPerfil] abrir modal salud, etiquetas seleccionadas:', this.formularioSalud.etiquetaIds);
    this.mostrarModalSalud = true;
  }

  cerrarModalSalud(): void {
    this.mostrarModalSalud = false;
    this.saludEditando = null;
    this.formularioSalud = {
      objetivoActual: undefined,
      nivelActividadActual: undefined,
      etiquetaIds: []
    };
  }

  guardarPerfilSalud(): void {
    if (this.guardandoSalud) return;
    this.guardandoSalud = true;

    const availableIds = this.etiquetasAlergia().map(e => e.id);
    const selected = (this.formularioSalud.etiquetaIds ?? []).filter(id => availableIds.includes(id));

    const payload: PerfilSaludRequest = {
      objetivoActual: this.formularioSalud.objetivoActual,
      nivelActividadActual: this.formularioSalud.nivelActividadActual,
      etiquetasId: selected
    };

    const svc: any = this.perfilService;
    let obs: Observable<any> | null = null;
    if (typeof svc.actualizarPerfilSalud === 'function') obs = svc.actualizarPerfilSalud(payload);
    else if (typeof svc.guardarPerfilSalud === 'function') obs = svc.guardarPerfilSalud(payload);
    else if (typeof svc.actualizar === 'function') obs = svc.actualizar(payload);
    else if (typeof svc.guardar === 'function') obs = svc.guardar(payload);

    if (!obs) {
      this.notificationService.error('Perfil Salud', 'Operación de guardado no disponible en el servicio.');
      this.guardandoSalud = false;
      return;
    }

    obs.subscribe({
      next: (res: any) => {
        if (res?.success) {
          // actualizar señal local con la respuesta del servidor si viene
          const nueva = res.data ?? {
            objetivoActual: payload.objetivoActual,
            nivelActividadActual: payload.nivelActividadActual,
            etiquetas: this.etiquetasAlergia().filter(e => (payload.etiquetasId || []).includes(e.id))
          } as PerfilSaludResponse;

          this.perfilSalud.set(nueva);
          this.notificationService.success('Perfil Salud', res.message ?? 'Perfil guardado correctamente.');
          this.cerrarModalSalud();
        } else {
          this.notificationService.error('Perfil Salud', res?.message ?? 'No se pudo guardar el perfil.');
        }
        this.guardandoSalud = false;
      },
      error: () => {
        this.notificationService.error('Perfil Salud', 'Error al guardar el perfil.');
        this.guardandoSalud = false;
      }
    });
  }

  isEtiquetaSeleccionada(etiquetaId: number): boolean {
    const ids = this.formularioSalud.etiquetaIds ?? [];
    return ids.includes(etiquetaId);
  }

  toggleEtiquetaSeleccionada(etiquetaId: number): void {
    if (!this.formularioSalud.etiquetaIds) this.formularioSalud.etiquetaIds = [];
    const index = this.formularioSalud.etiquetaIds.indexOf(etiquetaId);
    if (index > -1) this.formularioSalud.etiquetaIds.splice(index, 1);
    else this.formularioSalud.etiquetaIds.push(etiquetaId);
    console.log('[MiPerfil] etiquetas ahora:', this.formularioSalud.etiquetaIds);
  }
}
