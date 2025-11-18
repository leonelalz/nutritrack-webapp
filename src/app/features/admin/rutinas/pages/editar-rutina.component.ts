import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RutinaService } from '../../../../core/services/rutina.service';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Editar Rutina (US-13)
 */
@Component({
  selector: 'app-editar-rutina',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="editar-rutina-container">
      <div class="header">
        <h1>Editar Rutina</h1>
        <button class="btn-link" routerLink="/admin/rutinas">← Volver</button>
      </div>

      @if (cargando()) {
        <div class="loading">Cargando rutina...</div>
      }

      @if (!cargando() && formulario) {
        <form [formGroup]="formulario" (ngSubmit)="guardar()" class="form">
          <div class="form-group">
            <label>Nombre <span class="required">*</span></label>
            <input type="text" formControlName="nombre" />
          </div>

          <div class="form-group">
            <label>Descripción <span class="required">*</span></label>
            <textarea formControlName="descripcion" rows="4"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Duración (semanas)</label>
              <input type="number" formControlName="duracionSemanas" min="1" />
            </div>
            <div class="form-group">
              <label>Frecuencia Semanal</label>
              <input type="number" formControlName="frecuenciaSemanal" min="1" max="7" />
            </div>
          </div>

          <div class="form-group">
            <label>Nivel</label>
            <select formControlName="nivelDificultad">
              <option value="PRINCIPIANTE">Principiante</option>
              <option value="INTERMEDIO">Intermedio</option>
              <option value="AVANZADO">Avanzado</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" routerLink="/admin/rutinas">Cancelar</button>
            <button type="submit" class="btn-primary" [disabled]="formulario.invalid || guardando()">
              {{ guardando() ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .editar-rutina-container { padding: 2rem; max-width: 900px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
    h1 { font-size: 2rem; color: #2d3748; }
    .btn-link { background: none; border: none; color: #667eea; font-weight: 600; cursor: pointer; }
    .form { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    label { display: block; font-weight: 600; color: #4a5568; margin-bottom: 0.5rem; }
    .required { color: #e53e3e; }
    input, select, textarea { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; }
    .btn-primary, .btn-secondary { padding: 0.75rem 2rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .btn-secondary { background: #edf2f7; color: #4a5568; }
    .loading { text-align: center; padding: 3rem; }
  `]
})
export class EditarRutinaComponent implements OnInit {
  formulario!: FormGroup;
  cargando = signal(true);
  guardando = signal(false);
  rutinaId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rutinaService: RutinaService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.rutinaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarRutina();
  }

  cargarRutina(): void {
    this.rutinaService.obtenerRutinaPorId(this.rutinaId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const rutina = response.data;
          this.formulario = this.fb.group({
            nombre: [rutina.nombre, Validators.required],
            descripcion: [rutina.descripcion, Validators.required],
            duracionSemanas: [rutina.duracionSemanas, Validators.required],
            nivelDificultad: [rutina.nivelDificultad, Validators.required],
            objetivo: [rutina.objetivo]
          });
          this.cargando.set(false);
        }
      },
      error: () => {
        this.notificationService.showError('Error al cargar rutina');
        this.router.navigate(['/admin/rutinas']);
      }
    });
  }

  guardar(): void {
    if (this.formulario.invalid) return;

    this.guardando.set(true);
    this.rutinaService.actualizarRutina(this.rutinaId, this.formulario.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Rutina actualizada');
          this.router.navigate(['/admin/rutinas']);
        }
      },
      error: () => {
        this.guardando.set(false);
        this.notificationService.showError('Error al actualizar');
      }
    });
  }
}
