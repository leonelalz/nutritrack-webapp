import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgresoService } from '../../../core/services/progreso.service';
import { ActividadesDiaResponse, ComidaDiaInfo } from '../../../core/models/seguimiento.model';

@Component({
  selector: 'app-actividades-hoy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Actividades de hoy</h1>
          <p class="page-subtitle">
            Revisa las comidas programadas para tu plan de hoy y marca las que ya realizaste.
          </p>
        </div>
      </header>

      <!-- Estado de carga / error -->
      <div *ngIf="cargando" class="info-card">Cargando actividades de hoy...</div>
      <div *ngIf="!cargando && error" class="info-card error">{{ error }}</div>

      <ng-container *ngIf="!cargando && !error && actividades">
        <!-- Resumen del día -->
        <section class="summary-card">
          <div class="summary-item">
            <span class="summary-label">Día actual del plan</span>
            <span class="summary-value">Día {{ actividades.diaActual }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Calorías objetivo</span>
            <span class="summary-value">{{ actividades.caloriasObjetivo | number: '1.0-0' }} cal</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Calorías consumidas</span>
            <span class="summary-value">{{ actividades.caloriasConsumidas | number: '1.0-0' }} cal</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Comidas completadas</span>
            <span class="summary-value">
              {{ comidasCompletadas }}/{{ actividades.comidas.length }}
            </span>
          </div>
        </section>

        <!-- Lista de actividades (RN20: check si registrada = true) -->
        <section class="card">
          <h2 class="section-title">Comidas del plan para hoy</h2>

          <ul class="activity-list">
            <li
              *ngFor="let comida of actividades.comidas"
              class="activity-item"
              [class.completed]="comida.registrada"
            >
              <div class="activity-main">
                <div class="activity-name">{{ comida.nombre }}</div>
                <div class="activity-meta">
                  {{ comida.tipoComida }} · {{ comida.calorias | number: '1.0-0' }} cal
                </div>
              </div>

              <div class="activity-status">
                <span *ngIf="comida.registrada" class="status-pill completed">
                  ✓ Completada
                </span>
                <span *ngIf="!comida.registrada" class="status-pill pending">
                  Pendiente
                </span>
              </div>
            </li>
          </ul>

          <p class="helper-text">
            Según RN20, el backend marca <strong>registrada=true</strong> cuando usas el flujo de
            <em>Registrar comida</em> (US-22). Aquí solo lo mostramos con un check visual.
          </p>
        </section>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 30px;
        min-height: 100vh;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .page-title {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .page-subtitle {
        color: #6b7280;
        font-size: 14px;
      }

      .info-card {
        background: #ffffff;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
        font-size: 14px;
        color: #4b5563;
      }

      .info-card.error {
        border-left: 4px solid #ef4444;
        color: #b91c1c;
      }

      .summary-card {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .summary-item {
        background: #ffffff;
        padding: 14px 16px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      }

      .summary-label {
        font-size: 12px;
        color: #9ca3af;
        display: block;
        margin-bottom: 4px;
      }

      .summary-value {
        font-weight: 600;
        font-size: 14px;
      }

      .card {
        background: #ffffff;
        border-radius: 16px;
        padding: 20px 24px;
        box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
      }

      .section-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
      }

      .activity-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .activity-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 14px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        background: #f9fafb;
      }

      .activity-item.completed {
        background: #ecfdf3;
        border-color: #bbf7d0;
      }

      .activity-main {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .activity-name {
        font-weight: 600;
        font-size: 14px;
      }

      .activity-meta {
        font-size: 12px;
        color: #6b7280;
      }

      .activity-status {
        display: flex;
        align-items: center;
      }

      .status-pill {
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 500;
      }

      .status-pill.completed {
        background: #22c55e1a;
        color: #16a34a;
      }

      .status-pill.pending {
        background: #fee2e2;
        color: #b91c1c;
      }

      .helper-text {
        margin-top: 12px;
        font-size: 12px;
        color: #9ca3af;
      }

      @media (max-width: 1024px) {
        .summary-card {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 640px) {
        .summary-card {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class ActividadesHoyComponent implements OnInit {
  private progresoService = inject(ProgresoService);

  cargando = true;
  error: string | null = null;
  actividades: ActividadesDiaResponse | null = null;

  ngOnInit(): void {
    this.progresoService.obtenerActividadesHoy().subscribe({
      next: (data) => {
        this.actividades = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudieron cargar las actividades de hoy.';
        this.cargando = false;
      }
    });
  }

  get comidasCompletadas(): number {
    if (!this.actividades) return 0;
    return this.actividades.comidas.filter((c) => c.registrada).length;
  }
}
