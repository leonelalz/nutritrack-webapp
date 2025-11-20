// src/app/features/seguimiento/pages/registrar-comida.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-registrar-comida',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Registrar comida</h1>
          <p class="page-subtitle">
            Registra una comida realizada para actualizar tu progreso diario.
          </p>
        </div>
      </div>

      <div class="card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-field">
              <label>Fecha</label>
              <input type="date" formControlName="fecha" />
            </div>

            <div class="form-field">
              <label>Hora</label>
              <input type="time" formControlName="hora" />
            </div>

            <div class="form-field">
              <label>Descripción / Comida</label>
              <input type="text" formControlName="descripcion" placeholder="Ej: Desayuno - Avena con frutas" />
            </div>

            <div class="form-field">
              <label>Porciones</label>
              <input type="number" formControlName="porciones" min="0.1" step="0.1" />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-outline" (click)="volver()">Cancelar</button>
            <button type="submit" class="btn-primary" [disabled]="form.invalid">
              Guardar registro (placeholder)
            </button>
          </div>
        </form>

        <p class="helper-text">
          💡 En esta primera versión solo mostramos el flujo de UI.
          Luego puedes conectar esto con el endpoint de <strong>registros_comidas</strong>
          y aplicar las RN21, RN33 y RN34.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .page-header {
      margin-bottom: 1.5rem;
    }

    .page-title {
      font-size: 1.8rem;
      margin: 0;
      color: #1f2933;
    }

    .page-subtitle {
      margin: 0.35rem 0 0 0;
      color: #64748b;
    }

    .card {
      background: #ffffff;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 1rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .form-field label {
      font-size: 0.9rem;
      color: #475569;
      font-weight: 500;
    }

    .form-field input {
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      padding: 0.5rem 0.75rem;
      font-size: 0.95rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .helper-text {
      margin-top: 1rem;
      font-size: 0.85rem;
      color: #64748b;
    }
  `]
})
export class RegistrarComidaComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  form = this.fb.group({
    fecha: [new Date().toISOString().substring(0, 10), Validators.required],
    hora: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
    porciones: [1, [Validators.required, Validators.min(0.1)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.showError('Revisa los campos del formulario.');
      return;
    }

    // Aquí luego llamas al servicio real de registros_comidas
    console.log('Registro de comida (placeholder):', this.form.value);
    this.notificationService.showSuccess('Comida registrada (simulado).');

    this.router.navigate(['/seguimiento/hoy']);
  }

  volver(): void {
    this.router.navigate(['/seguimiento/hoy']);
  }
}
