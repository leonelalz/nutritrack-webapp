import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { PerfilService } from '../../../core/services/perfil.service';
import { ObjetivoSalud, NivelActividad, Etiqueta } from '../../../core/models';
import { EtiquetaService } from '../../../core/services/etiqueta.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="onboarding-container">

  <!-- Progress Bar -->
  <div class="progress-wrapper">
    <div class="progress-bar" [style.width.%]="(step() / (totalSteps - 1)) * 100"></div>
  </div>

  <!-- Title -->
  <h2 class="title">{{ stepTitles[step()] }}</h2>
  <p class="subtitle">{{ stepSubtitles[step()] }}</p>

  <!-- Step 1: Objetivo -->
  @if (step() === 0) {
    <div class="card fade-in">
      <label>¿Cuál es tu objetivo nutricional?</label>
      <select [(ngModel)]="form.objetivo">
        <option [ngValue]="undefined">Selecciona un objetivo</option>
        @for (o of objetivos; track o) {
          <option [ngValue]="o">{{ o }}</option>
        }
      </select>
    </div>
  }

  <!-- Step 2: Nivel de Actividad -->
  @if (step() === 1) {
    <div class="card fade-in">
      <label>¿Cuál es tu nivel de actividad?</label>
      <select [(ngModel)]="form.nivelActividad">
        <option [ngValue]="undefined">Selecciona un nivel</option>
        @for (n of niveles; track n) {
          <option [ngValue]="n">{{ n }}</option>
        }
      </select>
    </div>
  }

  <!-- Step 3: Etiquetas -->
  @if (step() === 2) {
    <div class="card fade-in">
      <label>Alergias y Condiciones Médicas</label>

      <div class="tags-section">
        <h4>Alergias</h4>
        <div class="tags">
          @for (e of alergias(); track e.id) {
            <button class="tag" [class.selected]="isSelected(e.id)" (click)="toggleTag(e.id)">
              {{ e.nombre }}
            </button>
          }
        </div>

        <h4>Condiciones Médicas</h4>
        <div class="tags">
          @for (e of condiciones(); track e.id) {
            <button class="tag" [class.selected]="isSelected(e.id)" (click)="toggleTag(e.id)">
              {{ e.nombre }}
            </button>
          }
        </div>
      </div>
    </div>
  }

  <!-- Navigation buttons -->
   
    <div class="nav-buttons">
    <button class="btn-primary"
        *ngIf="step() < totalSteps - 1"
        [disabled]="!canContinue()"
        (click)="nextStep()">
        Siguiente
    </button>
    
    <button class="btn-primary"
            *ngIf="step() === totalSteps - 1"
            [disabled]="loading()"
            (click)="finalizar()">
      {{ loading() ? 'Guardando...' : 'Finalizar' }}
    </button>
    
    @if (step() > 0){
        <button class="btn-secondary" 
                (click)="prevStep()" 
                [disabled]="step() === 0 || loading()">
        Atrás
        </button>
   }
  </div>

</div>
  `,

  styles: [`

/* General Layout */
.onboarding-container {
  max-width: 620px;
  margin: 3rem auto;
  text-align: center;
}

/* Progress Bar */
.progress-wrapper {
  width: 100%;
  height: 6px;
  background: #E5E7EB;
  border-radius: 10px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.progress-bar {
  height: 6px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transition: width 0.4s ease;
}

/* Titles */
.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: .3rem;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 1.8rem;
}

/* Card */
.card, .summary-card {
  background: white;
  padding: 1.8rem;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.06);
  text-align: left;
}

label {
  font-weight: 600;
  color: #374151;
  margin-bottom: .7rem;
  display: block;
}

select {
  width: 100%;
  padding: .85rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
}

/* Tags */
.tags-section h4 {
  margin: 1.2rem 0 .5rem;
  font-size: 1rem;
  font-weight: 700;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 8px 16px;
  border-radius: 18px;
  border: 2px solid #cbd5e1;
  background: white;
  cursor: pointer;
  font-size: .85rem;
  transition: .25s;
}

.tag.selected {
  background: linear-gradient(135deg, #10b981, #34d399);
  border-color: transparent;
  color: white;
}

/* Summary */
.summary-card h3 {
  margin-bottom: 1rem;
}

.summary-item {
  margin-bottom: .8rem;
  font-size: 1rem;
}

/* Buttons */
.nav-buttons {
  margin-top: 2rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}

.btn-primary {
  padding: .85rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: .2s;
}

.btn-secondary {
  padding: .85rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  background: #e5e7eb;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
}

/* Fade-in animation */
.fade-in {
  animation: fadeIn .45s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

  `]
})
export class OnboardingComponent {

  private router = inject(Router);
  private ns = inject(NotificationService);
  private perfilService = inject(PerfilService);
  private etiquetaService = inject(EtiquetaService);

  loading = signal(false);
  etiquetas = signal<Etiqueta[]>([]);

  // Wizard Step Control
  step = signal(0);
  totalSteps = 3;

  stepTitles = [
    "¿Cuál es tu objetivo?",
    "Nivel de Actividad",
    "Salud y Restricciones",
    "Resumen Final"
  ];

  stepSubtitles = [
    "Esto nos ayuda a personalizar tus metas.",
    "Determina cuánto debes consumir al día.",
    "Para evitar alimentos que no puedas consumir.",
    "Confirma tus datos antes de comenzar."
  ];

  objetivos = Object.values(ObjetivoSalud);
  niveles = Object.values(NivelActividad);

  form = {
    objetivo: undefined as ObjetivoSalud | undefined,
    nivelActividad: undefined as NivelActividad | undefined,
    etiquetas: [] as number[]
  };

  constructor() {
    this.cargarEtiquetas();
  }

  /* Data Loading */
  cargarEtiquetas() {
    this.etiquetaService.obtenerTodas().subscribe(r => {
      this.etiquetas.set(r.data || []);
    });
  }

  alergias() {
    return this.etiquetas().filter(e => e.tipoEtiqueta?.toUpperCase() === 'ALERGIA');
  }

  condiciones() {
    return this.etiquetas().filter(e => e.tipoEtiqueta?.toUpperCase() === 'CONDICION_MEDICA');
  }

  /* Tag Selection */
  isSelected(id: number) {
    return this.form.etiquetas.includes(id);
  }

  toggleTag(id: number) {
    const arr = this.form.etiquetas;
    const i = arr.indexOf(id);
    if (i >= 0) arr.splice(i, 1);
    else arr.push(id);
  }

  getEtiquetaNombre(id: number) {
    return this.etiquetas().find(e => e.id === id)?.nombre || '';
  }

  /* Step Navigation */
  nextStep() {
    if (this.step() < this.totalSteps - 1) this.step.set(this.step() + 1);
  }

  prevStep() {
    if (this.step() > 0) this.step.set(this.step() - 1);
  }

  /* Validation for step changes */
  canContinue() {
    if (this.step() === 0) return !!this.form.objetivo;
    if (this.step() === 1) return !!this.form.nivelActividad;
    return true;
  }

  /* Finish onboarding */
  finalizar() {
    this.loading.set(true);

    const payload = {
      objetivoActual: this.form.objetivo,
      nivelActividadActual: this.form.nivelActividad,
      etiquetasId: this.form.etiquetas
    };

    this.perfilService.actualizarPerfilSalud(payload).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.ns.success("Onboarding", "Tu perfil ha sido configurado.");
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.loading.set(false);
        this.ns.error("Onboarding", "Ocurrió un error al guardar.");
      }
    });
  }
}
