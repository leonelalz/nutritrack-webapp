import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PlanService } from '../../../../core/services/plan.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { DiaPlanResponse, TipoComida } from '../../../../core/models';

/**
 * Configurar Días del Plan (US-14)
 * Asignar comidas a cada día del plan
 */
@Component({
  selector: 'app-configurar-dias-plan',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="configurar-dias-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon>calendar_today</mat-icon>
            Configurar Días - {{ nombrePlan() }}
          </h1>
          <p class="page-subtitle">Asigna comidas a cada día del plan nutricional</p>
        </div>
        <button class="btn-link" routerLink="/admin/planes">← Volver a planes</button>
      </div>

      @if (cargando()) {
        <div class="loading">Cargando configuración...</div>
      }

      @if (!cargando()) {
        <div class="content">
          <!-- Agregar nueva comida al día -->
          <div class="add-section">
            <h2>Agregar Comida al Plan</h2>
            <form [formGroup]="formulario" (ngSubmit)="agregarDia()" class="add-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Día</label>
                  <input type="number" formControlName="numeroDia" min="1" [max]="duracionDias()" />
                  <small>De 1 a {{ duracionDias() }}</small>
                </div>

                <div class="form-group">
                  <label>ID Comida</label>
                  <input type="number" formControlName="comidaId" min="1" />
                  <small>ID de comida existente</small>
                </div>

                <div class="form-group">
                  <label>Tipo</label>
                  <select formControlName="tipoComida">
                    <option value="DESAYUNO">Desayuno</option>
                    <option value="ALMUERZO">Almuerzo</option>
                    <option value="CENA">Cena</option>
                    <option value="SNACK">Snack</option>
                    <option value="MERIENDA">Merienda</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Porciones</label>
                  <input type="number" formControlName="porcionesRecomendadas" min="0.5" step="0.5" />
                </div>

                <div class="form-group">
                  <label>Orden</label>
                  <input type="number" formControlName="orden" min="1" />
                </div>

                <button type="submit" class="btn-primary" [disabled]="formulario.invalid || guardando()">
                  {{ guardando() ? 'Agregando...' : '+ Agregar' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Lista de días configurados -->
          <div class="dias-section">
            <h2>Días Configurados</h2>

            @if (diasAgrupados().length === 0) {
              <div class="empty-state">
                <p>No hay comidas asignadas aún. Comienza agregando comidas para cada día.</p>
              </div>
            }

            @for (grupo of diasAgrupados(); track grupo.dia) {
              <div class="dia-card">
                <div class="dia-header">
                  <h3>Día {{ grupo.dia }}</h3>
                  <span class="comidas-count">{{ grupo.comidas.length }} comida(s)</span>
                </div>

                <div class="comidas-list">
                  @for (dia of grupo.comidas; track dia.id) {
                    <div class="comida-item">
                      <div class="comida-info">
                        <span class="orden">{{ grupo.comidas.indexOf(dia) + 1 }}.</span>
                        <div class="comida-details">
                          <strong>{{ dia.comida.nombre }}</strong>
                          <div class="comida-meta">
                            <span class="badge">{{ formatearTipoComida(dia.tipoComida) }}</span>
                            @if (dia.comida.calorias) {
                              <span>{{ dia.comida.calorias }} kcal</span>
                            }
                          </div>
                        </div>
                      </div>
                      <button class="btn-delete" (click)="eliminarDia(dia.id)">
                        Eliminar
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .configurar-dias-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h1 { font-size: 2rem; color: #2d3748; margin: 0; }
    .btn-link { background: none; border: none; color: #667eea; font-weight: 600; cursor: pointer; }
    
    .add-section { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .add-section h2 { font-size: 1.25rem; margin-bottom: 1rem; }
    
    .add-form .form-row { display: grid; grid-template-columns: repeat(5, 1fr) auto; gap: 1rem; align-items: end; }
    .form-group { display: flex; flex-direction: column; }
    .form-group label { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem; color: #4a5568; }
    .form-group input, .form-group select { padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.875rem; }
    .form-group small { font-size: 0.75rem; color: #718096; margin-top: 0.25rem; }
    
    .dias-section h2 { font-size: 1.25rem; margin-bottom: 1rem; }
    .dia-card { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .dia-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 2px solid #e2e8f0; }
    .dia-header h3 { font-size: 1.125rem; color: #2d3748; margin: 0; }
    .comidas-count { background: #edf2f7; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem; color: #4a5568; }
    
    .comidas-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .comida-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f7fafc; border-radius: 8px; }
    .comida-info { display: flex; gap: 1rem; align-items: start; flex: 1; }
    .orden { font-weight: 700; color: #667eea; font-size: 1.125rem; }
    .comida-details { flex: 1; }
    .comida-details strong { display: block; color: #2d3748; margin-bottom: 0.25rem; }
    .comida-meta { display: flex; gap: 1rem; font-size: 0.875rem; color: #718096; }
    
    .badge { background: #e6fffa; color: #234e52; padding: 0.125rem 0.5rem; border-radius: 12px; font-weight: 600; font-size: 0.75rem; }
    
    .btn-primary { padding: 0.5rem 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.875rem; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .btn-delete { padding: 0.5rem 1rem; background: #fc8181; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.875rem; }
    .btn-delete:hover { background: #f56565; }
    
    .loading, .empty-state { text-align: center; padding: 3rem; color: #718096; }
  `]
})
export class ConfigurarDiasPlanComponent implements OnInit {
  formulario!: FormGroup;
  planId!: number;
  nombrePlan = signal('');
  duracionDias = signal(7);
  cargando = signal(true);
  guardando = signal(false);
  dias = signal<DiaPlanResponse[]>([]);
  diasAgrupados = signal<{ dia: number; comidas: DiaPlanResponse[] }[]>([]);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private notificationService: NotificationService
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.planId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarPlan();
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      numeroDia: [1, [Validators.required, Validators.min(1)]],
      comidaId: ['', [Validators.required, Validators.min(1)]],
      tipoComida: ['DESAYUNO', Validators.required],
      porcionesRecomendadas: [1, [Validators.required, Validators.min(0.5)]],
      orden: [1, [Validators.required, Validators.min(1)]]
    });
  }

  cargarPlan(): void {
    this.planService.obtenerPlanPorId(this.planId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.nombrePlan.set(response.data.nombre);
          this.duracionDias.set(response.data.duracionDias);
          this.dias.set(response.data.dias || []);
          this.agruparDias();
          this.cargando.set(false);
        }
      },
      error: () => {
        this.notificationService.showError('Error al cargar plan');
        this.router.navigate(['/admin/planes']);
      }
    });
  }

  agruparDias(): void {
    const diasMap = new Map<number, DiaPlanResponse[]>();
    
    this.dias().forEach(dia => {
      if (!diasMap.has(dia.numeroDia)) {
        diasMap.set(dia.numeroDia, []);
      }
      diasMap.get(dia.numeroDia)!.push(dia);
    });

    const agrupados = Array.from(diasMap.entries())
      .map(([dia, comidas]) => ({
        dia,
        comidas: comidas
      }))
      .sort((a, b) => a.dia - b.dia);

    this.diasAgrupados.set(agrupados);
  }

  agregarDia(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    
    this.planService.agregarDiaAlPlan(this.planId, this.formulario.value).subscribe({
      next: (response) => {
        this.guardando.set(false);
        if (response.success) {
          this.notificationService.showSuccess('Comida agregada al día');
          this.formulario.reset({
            numeroDia: 1,
            tipoComida: 'DESAYUNO',
            porcionesRecomendadas: 1,
            orden: 1
          });
          this.cargarPlan();
        }
      },
      error: (error) => {
        this.guardando.set(false);
        this.notificationService.showError(error.error?.message || 'Error al agregar comida');
      }
    });
  }

  eliminarDia(diaId: number): void {
    if (!confirm('¿Eliminar esta comida del plan?')) return;

    this.planService.eliminarDiaDelPlan(this.planId, diaId).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Comida eliminada');
          this.cargarPlan();
        }
      },
      error: () => {
        this.notificationService.showError('Error al eliminar');
      }
    });
  }

  formatearTipoComida(tipo: string): string {
    const tipos: Record<string, string> = {
      'DESAYUNO': 'Desayuno',
      'ALMUERZO': 'Almuerzo',
      'CENA': 'Cena',
      'SNACK': 'Snack',
      'MERIENDA': 'Merienda'
    };
    return tipos[tipo] || tipo;
  }
}
