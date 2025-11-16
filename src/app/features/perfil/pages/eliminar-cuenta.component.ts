import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-eliminar-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="eliminar-cuenta-container">
      <div class="card">
        <div class="card-header danger">
          <div class="warning-icon">⚠️</div>
          <h2>Eliminar Cuenta</h2>
          <p>Esta acción es permanente e irreversible</p>
        </div>

        <div class="card-body">
          <div class="warning-box">
            <h3>⚠️ Advertencia Importante</h3>
            <p>Al eliminar tu cuenta se perderán <strong>permanentemente</strong>:</p>
            <ul>
              <li>Tu perfil de salud y configuración</li>
              <li>Todos tus planes nutricionales activos</li>
              <li>Tus rutinas de ejercicio</li>
              <li>Historial completo de registros de comidas y ejercicios</li>
              <li>Mediciones y progreso guardado</li>
              <li>Todas tus preferencias y datos personales</li>
            </ul>
          </div>

          <div class="info-box">
            <h4>📋 Alternativas</h4>
            <p>Si solo deseas hacer una pausa, considera:</p>
            <ul>
              <li><strong>Pausar tus planes:</strong> Puedes pausar y reanudar cuando quieras</li>
              <li><strong>Cancelar planes:</strong> Sin eliminar tu cuenta</li>
              <li><strong>Contactar soporte:</strong> Si tienes algún problema</li>
            </ul>
          </div>

          <div class="confirmation-section">
            <h3>Confirmación Requerida</h3>
            <p>Para confirmar que deseas eliminar tu cuenta, escribe exactamente:</p>
            <div class="confirmation-word">ELIMINAR</div>
            
            <div class="form-group">
              <label for="confirmacion">Escribe "ELIMINAR" para confirmar:</label>
              <input 
                type="text" 
                id="confirmacion"
                [(ngModel)]="confirmacionTexto"
                class="form-control"
                placeholder="ELIMINAR"
                [class.error]="mostrarError() && !esConfirmacionValida()"
              />
              @if (mostrarError() && !esConfirmacionValida()) {
                <span class="error-message">
                  Debes escribir exactamente "ELIMINAR" para continuar
                </span>
              }
            </div>

            <div class="checkbox-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="entiendeConsecuencias"
                />
                <span>Entiendo que esta acción es irreversible y acepto perder todos mis datos</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="cancelar()">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              [disabled]="!puedeEliminar() || eliminando()"
              (click)="confirmarEliminacion()"
            >
              @if (eliminando()) {
                <span class="spinner-small"></span>
                Eliminando...
              } @else {
                🗑️ Eliminar Mi Cuenta
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .eliminar-cuenta-container {
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
      padding: 2rem;
      text-align: center;
    }

    .card-header.danger {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: white;
    }

    .warning-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
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

    .warning-box {
      background: #fee;
      border-left: 4px solid #e74c3c;
      padding: 1.5rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
    }

    .warning-box h3 {
      margin: 0 0 1rem 0;
      color: #c0392b;
      font-size: 1.25rem;
    }

    .warning-box p {
      margin: 0 0 1rem 0;
      color: #721c24;
    }

    .warning-box ul {
      margin: 0;
      padding-left: 1.5rem;
      color: #721c24;
    }

    .warning-box li {
      margin-bottom: 0.5rem;
    }

    .info-box {
      background: #e7f3ff;
      border-left: 4px solid #2196f3;
      padding: 1.5rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
    }

    .info-box h4 {
      margin: 0 0 0.75rem 0;
      color: #1565c0;
      font-size: 1.1rem;
    }

    .info-box p {
      margin: 0 0 0.75rem 0;
      color: #0d47a1;
    }

    .info-box ul {
      margin: 0;
      padding-left: 1.5rem;
      color: #0d47a1;
    }

    .info-box li {
      margin-bottom: 0.5rem;
    }

    .confirmation-section {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .confirmation-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .confirmation-section > p {
      margin: 0 0 1rem 0;
      color: #666;
    }

    .confirmation-word {
      background: #fff;
      border: 2px dashed #e74c3c;
      padding: 1rem;
      text-align: center;
      font-size: 1.5rem;
      font-weight: bold;
      color: #e74c3c;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      letter-spacing: 2px;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #444;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }

    .checkbox-group {
      margin-top: 1rem;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      cursor: pointer;
      user-select: none;
    }

    .checkbox-label input[type="checkbox"] {
      margin-right: 0.75rem;
      margin-top: 0.25rem;
      width: 18px;
      height: 18px;
      cursor: pointer;
      flex-shrink: 0;
    }

    .checkbox-label span {
      color: #444;
      line-height: 1.5;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e0e0e0;
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

    .btn-danger {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
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
  `]
})
export class EliminarCuentaComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  confirmacionTexto = '';
  entiendeConsecuencias = false;
  mostrarError = signal(false);
  eliminando = signal(false);

  esConfirmacionValida(): boolean {
    return this.confirmacionTexto.trim() === 'ELIMINAR';
  }

  puedeEliminar(): boolean {
    return this.esConfirmacionValida() && this.entiendeConsecuencias;
  }

  async confirmarEliminacion(): Promise<void> {
    if (!this.puedeEliminar()) {
      this.mostrarError.set(true);
      this.notificationService.showWarning('Debes completar la confirmación para continuar');
      return;
    }

    // Mostrar diálogo de confirmación final
    const confirmado = await this.mostrarDialogoFinal();
    if (!confirmado) {
      return;
    }

    this.eliminarCuenta();
  }

  private mostrarDialogoFinal(): Promise<boolean> {
    return new Promise((resolve) => {
      const resultado = confirm(
        '⚠️ ÚLTIMA ADVERTENCIA ⚠️\n\n' +
        'Esta es tu última oportunidad para cancelar.\n\n' +
        '¿Estás ABSOLUTAMENTE SEGURO de que deseas eliminar tu cuenta?\n\n' +
        'Esta acción NO SE PUEDE DESHACER.\n\n' +
        'Presiona OK para eliminar tu cuenta permanentemente.\n' +
        'Presiona Cancelar para mantener tu cuenta.'
      );
      resolve(resultado);
    });
  }

  private eliminarCuenta(): void {
    this.eliminando.set(true);

    // Aquí llamaríamos al endpoint del backend
    // Por ahora simulamos con el logout
    setTimeout(() => {
      this.notificationService.showSuccess('Tu cuenta ha sido eliminada exitosamente');
      this.authService.logout();
      this.router.navigate(['/']);
    }, 2000);

    /* Implementación real cuando el endpoint esté listo:
    this.authService.eliminarCuenta(this.confirmacionTexto).subscribe({
      next: () => {
        this.notificationService.showSuccess('Tu cuenta ha sido eliminada exitosamente');
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al eliminar cuenta:', error);
        this.notificationService.showError('Error al eliminar la cuenta. Intenta nuevamente.');
        this.eliminando.set(false);
      }
    });
    */
  }

  cancelar(): void {
    this.router.navigate(['/perfil/salud']);
  }
}
