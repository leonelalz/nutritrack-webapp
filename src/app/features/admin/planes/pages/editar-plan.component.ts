import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanService } from '../../../../core/services/plan.service';
import { EtiquetaService } from '../../../../core/services/etiqueta.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EtiquetaResponse } from '../../../../core/models';

/**
 * Editar Plan (US-13)
 */
@Component({
  selector: 'app-editar-plan',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="editar-plan-container">
      <div class="header">
        <h1>Editar Plan</h1>
        <button class="btn-link" routerLink="/admin/planes">← Volver</button>
      </div>

      @if (cargando()) {
        <div class="loading">Cargando plan...</div>
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

          <div class="form-group">
            <label>Duración (días) <span class="required">*</span></label>
            <input type="number" formControlName="duracionDias" min="1" />
          </div>

          <div formGroupName="objetivo">
            <h3>Objetivos</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Calorías</label>
                <input type="number" formControlName="caloriasObjetivo" />
              </div>
              <div class="form-group">
                <label>Proteínas (g)</label>
                <input type="number" formControlName="proteinasObjetivo" />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" routerLink="/admin/planes">Cancelar</button>
            <button type="submit" class="btn-primary" [disabled]="formulario.invalid || guardando()">
              {{ guardando() ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .editar-plan-container { padding: 2rem; max-width: 900px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
    h1 { font-size: 2rem; color: #2d3748; }
    .btn-link { background: none; border: none; color: #667eea; font-weight: 600; cursor: pointer; }
    .form { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    label { display: block; font-weight: 600; color: #4a5568; margin-bottom: 0.5rem; }
    .required { color: #e53e3e; }
    input, textarea { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; }
    .btn-primary, .btn-secondary { padding: 0.75rem 2rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .btn-secondary { background: #edf2f7; color: #4a5568; }
    .loading { text-align: center; padding: 3rem; }
  `]
})
export class EditarPlanComponent implements OnInit {
  formulario!: FormGroup;
  cargando = signal(true);
  guardando = signal(false);
  planId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.planId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarPlan();
  }

  cargarPlan(): void {
    this.planService.obtenerPlanPorId(this.planId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const plan = response.data;
          this.formulario = this.fb.group({
            nombre: [plan.nombre, Validators.required],
            descripcion: [plan.descripcion, Validators.required],
            duracionDias: [plan.duracionDias, Validators.required]
          });
          this.cargando.set(false);
        }
      },
      error: () => {
        this.notificationService.showError('Error al cargar plan');
        this.router.navigate(['/admin/planes']);
      }
    });
  }

  guardar(): void {
    if (this.formulario.invalid) return;

    this.guardando.set(true);
    this.planService.actualizarPlan(this.planId, this.formulario.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Plan actualizado');
          this.router.navigate(['/admin/planes']);
        }
      },
      error: () => {
        this.guardando.set(false);
        this.notificationService.showError('Error al actualizar');
      }
    });
  }
}
