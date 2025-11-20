// src/app/features/seguimiento/pages/historial-registros.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-historial-registros',
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Historial de registros</h1>
          <p class="page-subtitle">
            Aquí verás el historial de comidas y ejercicios registrados.
          </p>
        </div>
      </div>

      <div class="card">
        <p class="helper-text">
          Pantalla pendiente de conectar con registros reales.
          Puedes listar aquí <strong>registros_comidas</strong> y <strong>registros_ejercicios</strong>
          con filtros por fecha.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; max-width: 1100px; margin: 0 auto; background: #f5f5f5; min-height: 100vh; }
    .page-header { margin-bottom: 1.5rem; }
    .page-title { font-size: 1.8rem; margin: 0; color: #1f2933; }
    .page-subtitle { margin: 0.35rem 0 0 0; color: #64748b; }
    .card { background: #ffffff; padding: 1.5rem; border-radius: 16px; box-shadow: 0 2px 6px rgba(15,23,42,0.06); }
    .helper-text { margin: 0; font-size: 0.95rem; color: #64748b; }
  `]
})
export class HistorialRegistrosComponent {}
