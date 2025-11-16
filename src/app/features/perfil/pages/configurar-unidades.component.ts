import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PerfilService } from '../services/perfil.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UnidadesMedida } from '../../../shared/models/perfil.model';

@Component({
  selector: 'app-configurar-unidades',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="unidades-container">
      <div class="card">
        <div class="card-header">
          <h2>Configurar Unidades de Medida</h2>
          <p>Elige cómo deseas ver tus medidas de peso</p>
        </div>

        <div class="card-body">
          @if (loading()) {
            <div class="loading-spinner">
              <div class="spinner"></div>
              <p>Cargando configuración...</p>
            </div>
          } @else {
            <div class="unidades-options">
              <div 
                class="unidad-card"
                [class.selected]="unidadSeleccionada() === 'KG'"
                (click)="seleccionarUnidad('KG')"
              >
                <div class="unidad-icon">⚖️</div>
                <h3>Kilogramos (KG)</h3>
                <p>Sistema métrico internacional</p>
                <div class="ejemplo">
                  <span class="ejemplo-label">Ejemplo:</span>
                  <span class="ejemplo-valor">70.5 kg</span>
                </div>
                @if (unidadSeleccionada() === 'KG') {
                  <div class="check-icon">✓</div>
                }
              </div>

              <div 
                class="unidad-card"
                [class.selected]="unidadSeleccionada() === 'LBS'"
                (click)="seleccionarUnidad('LBS')"
              >
                <div class="unidad-icon">📏</div>
                <h3>Libras (LBS)</h3>
                <p>Sistema imperial</p>
                <div class="ejemplo">
                  <span class="ejemplo-label">Ejemplo:</span>
                  <span class="ejemplo-valor">155.4 lbs</span>
                </div>
                @if (unidadSeleccionada() === 'LBS') {
                  <div class="check-icon">✓</div>
                }
              </div>
            </div>

            <div class="conversion-info">
              <h4>💡 Conversión</h4>
              <p>1 Kilogramo (kg) = 2.20462 Libras (lbs)</p>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="cancelar()">
                Cancelar
              </button>
              <button 
                type="button" 
                class="btn btn-primary" 
                [disabled]="saving() || !hayCambios()"
                (click)="guardar()"
              >
                @if (saving()) {
                  <span class="spinner-small"></span>
                  Guardando...
                } @else {
                  Guardar Cambios
                }
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unidades-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }

    .card-header h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
    }

    .card-header p {
      margin: 0;
      opacity: 0.9;
    }

    .card-body {
      padding: 2rem;
    }

    .loading-spinner {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    .unidades-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .unidad-card {
      position: relative;
      padding: 2rem;
      border: 3px solid #e0e0e0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    }

    .unidad-card:hover {
      border-color: #667eea;
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
    }

    .unidad-card.selected {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .unidad-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .unidad-card h3 {
      font-size: 1.5rem;
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .unidad-card p {
      color: #666;
      margin: 0 0 1rem 0;
      font-size: 0.95rem;
    }

    .ejemplo {
      background: #f8f9fa;
      padding: 0.75rem;
      border-radius: 6px;
      margin-top: 1rem;
    }

    .ejemplo-label {
      font-size: 0.875rem;
      color: #666;
      display: block;
      margin-bottom: 0.25rem;
    }

    .ejemplo-valor {
      font-size: 1.25rem;
      font-weight: 600;
      color: #667eea;
    }

    .check-icon {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 32px;
      height: 32px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: bold;
      animation: checkmark 0.3s ease;
    }

    @keyframes checkmark {
      0% {
        transform: scale(0);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }

    .conversion-info {
      background: #fff9e6;
      border-left: 4px solid #ffc107;
      padding: 1.5rem;
      border-radius: 6px;
      margin-bottom: 2rem;
    }

    .conversion-info h4 {
      margin: 0 0 0.5rem 0;
      color: #856404;
      font-size: 1.1rem;
    }

    .conversion-info p {
      margin: 0;
      color: #856404;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #666;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .spinner-small {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff80;
      border-top: 2px solid #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 640px) {
      .unidades-options {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ConfigurarUnidadesComponent implements OnInit {
  private perfilService = inject(PerfilService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  loading = signal(true);
  saving = signal(false);
  unidadSeleccionada = signal<UnidadesMedida>(UnidadesMedida.KG);
  unidadOriginal = signal<UnidadesMedida>(UnidadesMedida.KG);

  ngOnInit(): void {
    this.cargarUnidadActual();
  }

  private cargarUnidadActual(): void {
    this.perfilService.obtenerPerfil().subscribe({
      next: (perfil) => {
        this.unidadSeleccionada.set(perfil.unidadesMedida);
        this.unidadOriginal.set(perfil.unidadesMedida);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
        this.notificationService.showError('Error al cargar configuración');
        this.loading.set(false);
      }
    });
  }

  seleccionarUnidad(unidad: UnidadesMedida): void {
    this.unidadSeleccionada.set(unidad);
  }

  hayCambios(): boolean {
    return this.unidadSeleccionada() !== this.unidadOriginal();
  }

  guardar(): void {
    if (!this.hayCambios()) {
      this.notificationService.showWarning('No hay cambios para guardar');
      return;
    }

    this.saving.set(true);

    this.perfilService.actualizarUnidades({ 
      unidadesMedida: this.unidadSeleccionada() 
    }).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          `Unidad cambiada a ${this.unidadSeleccionada()} exitosamente`
        );
        this.unidadOriginal.set(this.unidadSeleccionada());
        this.router.navigate(['/perfil/salud']);
      },
      error: (error) => {
        console.error('Error al actualizar unidades:', error);
        this.notificationService.showError('Error al actualizar unidades');
        this.saving.set(false);
      },
      complete: () => {
        this.saving.set(false);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/perfil/salud']);
  }
}
