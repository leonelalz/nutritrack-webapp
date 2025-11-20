import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgresoService } from '../../../core/services/progreso.service';
import { HistorialMedidasResponse } from '../../../core/models/UsuarioHistorialMedidas.model';
import { ApiResponse } from '../../../core/models/etiqueta.model';

interface PuntoGrafico {
  x: number;
  y: number;
  fecha: string;
  peso: number;
}

@Component({
  selector: 'app-grafico-progreso',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Mi progreso</h1>
          <p class="page-subtitle">
            Visualiza la evolución de tus mediciones a lo largo del tiempo.
          </p>
        </div>
      </header>

      <div *ngIf="cargando" class="info-card">Cargando historial de mediciones...</div>
      <div *ngIf="!cargando && error" class="info-card error">{{ error }}</div>

      <ng-container *ngIf="!cargando && !error">
        <div *ngIf="!tieneDatosSuficientes" class="info-card warning">
          Para generar el gráfico de progreso (RN23), se necesitan al menos
          <strong>2 mediciones</strong> registradas en tu historial.
        </div>

        <section *ngIf="tieneDatosSuficientes" class="card">
          <h2 class="section-title">Evolución de tu peso</h2>
          <p class="section-subtitle">
            Cada punto representa una medición registrada. El gráfico solo se muestra porque
            tienes 2 o más registros (RN23).
          </p>

          <div class="chart-wrapper">
            <svg viewBox="0 0 640 260" class="chart-svg">
              <!-- Ejes -->
              <line x1="40" y1="20" x2="40" y2="230" class="axis" />
              <line x1="40" y1="230" x2="610" y2="230" class="axis" />

              <!-- Línea de progreso -->
              <polyline
                *ngIf="puntos.length > 1"
                [attr.points]="polylinePoints"
                class="line"
              ></polyline>

              <!-- Puntos -->
              <ng-container *ngFor="let p of puntos">
                <circle [attr.cx]="p.x" [attr.cy]="p.y" r="4" class="dot"></circle>
              </ng-container>

              <!-- Labels de fechas -->
              <ng-container *ngFor="let p of puntos">
                <text
                  [attr.x]="p.x"
                  y="248"
                  class="label-x"
                  text-anchor="middle"
                >
                  {{ p.fecha }}
                </text>
              </ng-container>

              <!-- Labels de pesos (min y max) -->
              <text x="8" y="235" class="label-y">
                {{ pesoMin | number: '1.0-1' }} kg
              </text>
              <text x="8" y="30" class="label-y">
                {{ pesoMax | number: '1.0-1' }} kg
              </text>
            </svg>
          </div>
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
        padding: 18px 20px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
        font-size: 14px;
        color: #4b5563;
        margin-bottom: 16px;
      }

      .info-card.error {
        border-left: 4px solid #ef4444;
        color: #b91c1c;
      }

      .info-card.warning {
        border-left: 4px solid #f59e0b;
        color: #92400e;
      }

      .card {
        background: #ffffff;
        border-radius: 16px;
        padding: 20px 24px;
        box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
      }

      .section-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .section-subtitle {
        font-size: 13px;
        color: #6b7280;
        margin-bottom: 16px;
      }

      .chart-wrapper {
        width: 100%;
        overflow-x: auto;
      }

      .chart-svg {
        width: 100%;
        max-width: 100%;
      }

      .axis {
        stroke: #e5e7eb;
        stroke-width: 1;
      }

      .line {
        fill: none;
        stroke: #16a34a;
        stroke-width: 2;
      }

      .dot {
        fill: #16a34a;
        stroke: #ffffff;
        stroke-width: 1.5;
      }

      .label-x {
        font-size: 10px;
        fill: #6b7280;
      }

      .label-y {
        font-size: 10px;
        fill: #6b7280;
      }
    `
  ]
})
export class GraficoProgresoComponent implements OnInit {
  private progresoService = inject(ProgresoService);

  cargando = true;
  error: string | null = null;

  historial: HistorialMedidasResponse[] = [];
  puntos: PuntoGrafico[] = [];

  pesoMin = 0;
  pesoMax = 0;

  ngOnInit(): void {
    this.progresoService.obtenerHistorialMedidas().subscribe({
      next: (resp: ApiResponse<HistorialMedidasResponse[]>) => {
        this.historial = (resp.data || []).sort((a, b) =>
          a.fechaMedicion.localeCompare(b.fechaMedicion)
        );
        this.cargando = false;
        this.prepararDatos();
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo cargar el historial de mediciones.';
        this.cargando = false;
      }
    });
  }

  get tieneDatosSuficientes(): boolean {
    return this.historial.length >= 2;
  }

  get polylinePoints(): string {
    return this.puntos.map((p) => `${p.x},${p.y}`).join(' ');
  }

  private prepararDatos(): void {
    if (!this.tieneDatosSuficientes) {
      this.puntos = [];
      return;
    }

    const pesos = this.historial.map((h) => h.peso);
    this.pesoMin = Math.min(...pesos);
    this.pesoMax = Math.max(...pesos);
    const rango = this.pesoMax - this.pesoMin || 1;

    const width = 640;
    const height = 260;
    const marginX = 40;
    const marginY = 30;

    const chartWidth = width - marginX - 30;
    const chartHeight = height - marginY - 40;

    const n = this.historial.length;

    this.puntos = this.historial.map((m, index) => {
      const x =
        marginX +
        (n === 1 ? chartWidth / 2 : (chartWidth * index) / (n - 1));
      const normalized = (m.peso - this.pesoMin) / rango;
      const y = height - 30 - normalized * chartHeight;

      return {
        x,
        y,
        peso: m.peso,
        fecha: m.fechaMedicion
      };
    });
  }
}
