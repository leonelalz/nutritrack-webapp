import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { ProgresoService } from '../../../core/services/progreso.service';
import {
  HistorialMedidasRequest,
  HistorialMedidasResponse
} from '../../../core/models/UsuarioHistorialMedidas.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ApiResponse } from '../../../core/models/etiqueta.model';

@Component({
  standalone: true,
  selector: 'app-mediciones',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Mediciones</h1>
          <p class="page-subtitle">
            Registra tus mediciones de peso y altura para seguir tu progreso.
          </p>
        </div>
      </div>

      <!-- Formulario de nueva medición -->
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-field">
              <label>Fecha</label>
              <input
                type="date"
                formControlName="fecha"
                [max]="hoy"
              />
              <small *ngIf="form.controls.fecha.invalid && form.controls.fecha.touched" class="error-text">
                La fecha es obligatoria y no puede ser futura.
              </small>
            </div>

            <div class="form-field">
              <label>Peso (kg)</label>
              <input
                type="number"
                formControlName="peso"
                min="20"
                max="600"
                step="0.1"
              />
              <small *ngIf="form.controls.peso.invalid && form.controls.peso.touched" class="error-text">
                El peso debe estar entre 20 kg y 600 kg (RN22).
              </small>
            </div>

            <div class="form-field">
              <label>Altura (cm)</label>
              <input
                type="number"
                formControlName="altura"
                min="50"
                max="300"
              />
              <small *ngIf="form.controls.altura.invalid && form.controls.altura.touched" class="error-text">
                La altura debe estar entre 50 cm y 300 cm (RN22).
              </small>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn-primary"
              [disabled]="form.invalid || cargandoGuardar"
            >
              {{ cargandoGuardar ? 'Guardando...' : 'Guardar medición' }}
            </button>
          </div>
        </form>

        <p class="helper-text">
          Esta pantalla valida rangos de peso y altura (RN22) y la fecha no futura.
          Cada medición registrada se usa luego para el gráfico en
          <strong>Mi progreso</strong> (RN23).
        </p>
      </div>

      <!-- Historial de mediciones -->
      <div class="card" *ngIf="historial.length > 0">
        <h2 class="section-title">Historial de mediciones</h2>
        <p class="section-subtitle">
          Ordenado desde la más reciente a la más antigua.
        </p>

        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Peso (kg)</th>
                <th>Altura (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let m of historial">
                <td>{{ m.fechaMedicion }}</td>
                <td>{{ m.peso | number: '1.1-1' }}</td>
                <td>{{ m.altura | number: '1.0-0' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="helper-text">
          Cuando tengas al menos <strong>2 mediciones</strong>, la pantalla de
          <em>Mi progreso</em> mostrará el gráfico según RN23.
        </p>
      </div>

      <div class="card" *ngIf="!cargandoHistorial && historial.length === 0">
        <p class="helper-text">
          Aún no tienes mediciones registradas. Comienza agregando la primera arriba.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 2rem;
        max-width: 900px;
        margin: 0 auto;
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
        margin-bottom: 1.25rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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

      .error-text {
        font-size: 0.75rem;
        color: #b91c1c;
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

      .section-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .section-subtitle {
        font-size: 0.9rem;
        color: #6b7280;
        margin-bottom: 0.75rem;
      }

      .table-wrapper {
        overflow-x: auto;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }

      .table th,
      .table td {
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
      }

      .table th {
        font-weight: 600;
        color: #4b5563;
      }
    `
  ]
})
export class MedicionesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private progresoService = inject(ProgresoService);
  private notificationService = inject(NotificationService);

  hoy = new Date().toISOString().substring(0, 10); // para max en input date

  form = this.fb.group({
    fecha: [this.hoy, Validators.required],
    peso: [
      70,
      [Validators.required, Validators.min(20), Validators.max(600)]
    ],
    altura: [
      170,
      [Validators.required, Validators.min(50), Validators.max(300)]
    ]
  });

  historial: HistorialMedidasResponse[] = [];
  cargandoHistorial = false;
  cargandoGuardar = false;

  ngOnInit(): void {
    this.cargarHistorial();
  }

  private cargarHistorial(): void {
    this.cargandoHistorial = true;
    this.progresoService.obtenerHistorialMedidas().subscribe({
      next: (resp: ApiResponse<HistorialMedidasResponse[]>) => {
        this.historial = (resp.data || []).sort((a, b) =>
          b.fechaMedicion.localeCompare(a.fechaMedicion)
        );
        this.cargandoHistorial = false;
      },
      error: () => {
        // no rompemos la UI, solo mostramos mensaje
        this.notificationService.showError(
          'No se pudo cargar el historial de mediciones.'
        );
        this.cargandoHistorial = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.showError(
        'Revisa los valores de fecha, peso y altura.'
      );
      return;
    }

    // RN22: ya validamos en el front; el backend también valida.
    const value = this.form.value;

    const request: HistorialMedidasRequest = {
      fechaMedicion: value.fecha!,
      peso: value.peso!,
      altura: value.altura!
    };

    this.cargandoGuardar = true;

    this.progresoService.registrarMedicion(request).subscribe({
      next: (resp: ApiResponse<HistorialMedidasResponse>) => {
        this.notificationService.showSuccess('Medición registrada correctamente.');
        // agregamos al historial y reordenamos
        if (resp.data) {
          this.historial = [resp.data, ...this.historial].sort((a, b) =>
            b.fechaMedicion.localeCompare(a.fechaMedicion)
          );
        } else {
          this.cargarHistorial();
        }
        this.cargandoGuardar = false;
      },
      error: (err) => {
        const msg =
          err?.error?.message ||
          'Ocurrió un problema al registrar la medición.';
        this.notificationService.showError(msg);
        this.cargandoGuardar = false;
      }
    });
  }
}
