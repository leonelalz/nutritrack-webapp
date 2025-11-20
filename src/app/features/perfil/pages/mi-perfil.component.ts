import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../../../core/services/perfil.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mi-perfil-container">
      <div class="page-header">
        <h1 class="page-title">
          <span class="icon">👤</span>
          Mi Perfil de Salud
        </h1>
        <p class="page-subtitle">Gestiona tu información de salud y objetivos nutricionales</p>
      </div>

      @if (cargando()) {
        <div class="loading-state">
          <p>Cargando perfil...</p>
        </div>
      } @else {
        <div class="content-layout">
          <div class="content-card">
            <div class="card-header">
              <h3>Perfil de Salud</h3>
              <button class="btn-edit" (click)="toggleEdit()">
                {{ editando() ? 'Guardar Cambios' : 'Editar' }}
              </button>
            </div>
            <div class="card-content">
              <div class="form-grid">
                <div class="form-field">
                  <label>Objetivo Nutricional</label>
                  @if (editando()) {
                    <select [(ngModel)]="perfilSalud().objetivoActual">
                      <option value="PERDER_PESO">Perder Peso</option>
                      <option value="GANAR_MUSCULO">Ganar Músculo</option>
                      <option value="MANTENER_PESO">Mantener Peso</option>
                      <option value="MEJORAR_SALUD">Mejorar Salud</option>
                    </select>
                  } @else {
                    <p>{{ formatearObjetivo(perfilSalud().objetivoActual) }}</p>
                  }
                </div>

                <div class="form-field">
                  <label>Nivel de Actividad</label>
                  @if (editando()) {
                    <select [(ngModel)]="perfilSalud().nivelActividadActual">
                      <option value="SEDENTARIO">Sedentario</option>
                      <option value="LIGERO">Ligeramente Activo</option>
                      <option value="MODERADO">Moderadamente Activo</option>
                      <option value="ACTIVO">Muy Activo</option>
                      <option value="MUY_ACTIVO">Extremadamente Activo</option>
                    </select>
                  } @else {
                    <p>{{ formatearNivelActividad(perfilSalud().nivelActividadActual) }}</p>
                  }
                </div>

                <div class="form-field full-width">
                  <label>Notas Adicionales</label>
                  @if (editando()) {
                    <textarea [(ngModel)]="perfilSalud().notas" rows="3" 
                              placeholder="Ingresa notas sobre tu salud"></textarea>
                  } @else {
                    <p>{{ perfilSalud().notas || 'No hay notas adicionales' }}</p>
                  }
                </div>
              </div>
            </div>
          </div>

          <div class="content-card">
            <div class="card-header">
              <h3>Alergias y Condiciones Médicas</h3>
            </div>
            <div class="card-content">
              @if (perfilSalud().etiquetas && perfilSalud().etiquetas.length > 0) {
                <div class="etiquetas-list">
                  @for (etiqueta of perfilSalud().etiquetas; track etiqueta.id) {
                    <div class="etiqueta-item">
                      <div class="etiqueta-info">
                        <span class="etiqueta-badge" [class]="'badge-' + etiqueta.tipoEtiqueta.toLowerCase()">
                          {{ etiqueta.tipoEtiqueta }}
                        </span>
                        <div>
                          <h4>{{ etiqueta.nombre }}</h4>
                          <p>{{ etiqueta.descripcion }}</p>
                        </div>
                      </div>
                      <button class="btn-remove" (click)="eliminarEtiqueta(etiqueta.id)" 
                              title="Eliminar etiqueta">
                        ✕
                      </button>
                    </div>
                  }
                </div>
              } @else {
                <div class="empty-state">
                  <span class="empty-icon">🏷️</span>
                  <p>No tienes alergias o condiciones médicas registradas</p>
                </div>
              }
            </div>
          </div>

          <div class="content-card">
            <div class="card-header">
              <h3>Información de Usuario</h3>
            </div>
            <div class="card-content">
              <div class="info-grid">
                <div class="info-field">
                  <label>Nombre de Usuario</label>
                  <p>{{ currentUser()?.username || 'No disponible' }}</p>
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
    </div>
  `,
  styles: [`
    .mi-perfil-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
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
      flex-direction: column;
      gap: 1rem;
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
    }
  `]
})
export class MiPerfilComponent implements OnInit {
  private perfilService = inject(PerfilService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private mockData = inject(MockDataService);

  cargando = signal(true);
  editando = signal(false);

  // Usar perfil compartido del mockData
  perfilSalud = this.mockData.perfilSalud;

  currentUser = signal<any>(null);

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadPerfilSalud();
  }

  loadCurrentUser(): void {
    const user = this.authService.currentUser();
    this.currentUser.set(user);
  }

  loadPerfilSalud(): void {
    this.cargando.set(true);
    this.perfilService.obtenerPerfilCompleto().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          const data = response.data;
          this.perfilSalud.set({
            id: data.perfilSalud.id,
            objetivoActual: data.perfilSalud.objetivoActual,
            nivelActividadActual: data.perfilSalud.nivelActividadActual,
            notas: null,
            etiquetas: data.perfilSalud.etiquetas
          });
          this.currentUser.set({
            username: data.nombreCompleto,
            email: data.email,
            role: data.rol
          });
          this.cargando.set(false);
        } else {
          this.cargarDatosDemo();
        }
      },
      error: () => {
        // Modo demo offline
        this.cargarDatosDemo();
        this.notificationService.showSuccess('Modo demo: perfil cargado sin conexión');
      }
    });
  }

  cargarDatosDemo(): void {
    this.perfilSalud.set({
      id: 1,
      objetivoActual: 'PERDER_PESO',
      nivelActividadActual: 'MODERADO',
      notas: 'Perfil de demostración',
      etiquetas: [
        { id: 1, nombre: 'Sin Gluten', tipoEtiqueta: 'ALERGIA', descripcion: 'Alergia al gluten' },
        { id: 2, nombre: 'Lactosa', tipoEtiqueta: 'ALERGIA', descripcion: 'Intolerancia a la lactosa' }
      ]
    });
    this.currentUser.set({
      username: 'Usuario Demo',
      email: 'demo@nutritrack.com',
      role: 'USER'
    });
    this.cargando.set(false);
  }

  toggleEdit(): void {
    if (this.editando()) {
      this.guardarCambios();
    } else {
      this.editando.set(true);
    }
  }

  guardarCambios(): void {
    const perfil = this.perfilSalud();
    
    // Actualizar mockData primero (siempre funciona)
    this.mockData.actualizarPerfilSalud({
      objetivoActual: perfil.objetivoActual,
      nivelActividadActual: perfil.nivelActividadActual,
      notas: perfil.notas
    });
    
    // Intentar actualizar en API (opcional)
    this.perfilService.actualizarPerfilSalud({
      objetivoActual: perfil.objetivoActual,
      nivelActividadActual: perfil.nivelActividadActual,
      notas: perfil.notas
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notificationService.showSuccess('Perfil actualizado correctamente');
        } else {
          this.notificationService.showSuccess('Perfil actualizado (demo)');
        }
        this.editando.set(false);
      },
      error: () => {
        // API falló pero ya actualizamos mockData
        this.notificationService.showSuccess('Perfil actualizado (demo)');
        this.editando.set(false);
      }
    });
  }

  eliminarEtiqueta(etiquetaId: number): void {
    if (confirm('¿Estás seguro de eliminar esta etiqueta?')) {
      // Eliminar de mockData primero (siempre funciona)
      this.mockData.eliminarEtiqueta(etiquetaId);
      
      // Intentar eliminar en API (opcional)
      this.perfilService.eliminarEtiqueta(etiquetaId).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notificationService.showSuccess('Etiqueta eliminada');
          } else {
            this.notificationService.showSuccess('Etiqueta eliminada (demo)');
          }
        },
        error: () => {
          // API falló pero ya actualizamos mockData
          this.notificationService.showSuccess('Etiqueta eliminada (demo)');
        }
      });
    }
  }

  formatearObjetivo(objetivo: string): string {
    const objetivos: Record<string, string> = {
      'PERDER_PESO': 'Perder Peso',
      'GANAR_MUSCULO': 'Ganar Músculo',
      'MANTENER_PESO': 'Mantener Peso',
      'MEJORAR_SALUD': 'Mejorar Salud'
    };
    return objetivos[objetivo] || objetivo;
  }

  formatearNivelActividad(nivel: string): string {
    const niveles: Record<string, string> = {
      'SEDENTARIO': 'Sedentario',
      'LIGERO': 'Ligeramente Activo',
      'MODERADO': 'Moderadamente Activo',
      'ACTIVO': 'Muy Activo',
      'MUY_ACTIVO': 'Extremadamente Activo'
    };
    return niveles[nivel] || nivel;
  }
}
