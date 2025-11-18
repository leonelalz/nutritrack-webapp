// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
// import { Router, ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-historial-medidas-insertar',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   template: `
//     <div class="container">
//       <h2>{{ edicion ? 'Editar Medida' : 'Registrar Medida' }}</h2>

//       <form [formGroup]="form" (ngSubmit)="guardar()">

//         <label>Altura (m)
//           <input type="number" formControlName="altura">
//         </label>

//         <label>Peso (kg)
//           <input type="number" formControlName="peso">
//         </label>

//         <label>IMC
//           <input type="number" formControlName="imc" readonly>
//         </label>

//         <label>Fecha de medición
//           <input type="date" formControlName="fecha_medicion">
//         </label>

//         <button class="btn-primary" [disabled]="!form.valid">
//           {{ edicion ? 'Actualizar' : 'Guardar' }}
//         </button>

//         <button class="btn-secondary" type="button" (click)="cancelar()">
//           Cancelar
//         </button>

//       </form>
//     </div>
//   `,
//   styles:[`
//     .container { max-width: 500px; margin: 0 auto; padding: 20px; font-family: 'Inter'; }
//     h2 { text-align:center; font-weight:700; margin-bottom:20px; color:#1E293B; }
//     form { display:flex; flex-direction:column; gap:15px; }
//     label { font-weight:600; color:#475569; display:flex; flex-direction:column; gap:5px; }
//     input { padding:10px; border:1px solid #CBD5E1; border-radius:8px; }
//     input:focus { border-color:#16A34A; box-shadow:0 0 3px rgba(22,163,74,.4); outline:none;}
//     .btn-primary {
//       background:#16A34A; color:white; padding:12px; border-radius:8px; border:none;
//       font-size:16px; cursor:pointer; font-weight:600; margin-top:10px;
//     }
//     .btn-primary:disabled { background:#A7F3D0; cursor:not-allowed; }
//     .btn-secondary {
//       padding:10px; border-radius:8px; border:1px solid #DC2626; background:white;
//       color:#DC2626; font-weight:600; cursor:pointer;
//     }
//     .btn-secondary:hover { background:#FEE2E2; }
//   `]
// })
// export class UsuarioHistorialMedidasInsertarComponent {

//   edicion = false;
//   form!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {

//     this.form = this.fb.group({
//     altura: ['', Validators.required],
//     peso: ['', Validators.required],
//     imc: [{ value: '', disabled: true }],
//     fecha_medicion: ['', Validators.required]
//   });

//   this.form.valueChanges.subscribe(val => {
//     if(val.altura && val.peso){
//       const imc = val.peso / (val.altura * val.altura);
//       this.form.get('imc')?.setValue(imc.toFixed(2), { emitEvent: false });
//     }
//   });

//   }

//   guardar(){
//     console.log("Guardado:", this.form.getRawValue());
//     this.router.navigate(['/medidas']);
//   }

//   cancelar(){
//     this.router.navigate(['/medidas']);
//   }
// }







// src/app/features/usuario/pages/usuariocrud/usuario_historial_medidas/usuario_historial_medidas-insertar.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioHistorialMedidasService } from '../../../../core/services/UsuarioHistorialMedidas.service';
import { HistorialMedidasRequest, HistorialMedidasResponse, UnidadPeso } from '../../../../core/models/UsuarioHistorialMedidas.model';

@Component({
  selector: 'app-historial-medidas-insertar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>{{ edicion ? 'Editar Medida' : 'Registrar Medida' }}</h2>

      <form [formGroup]="form" (ngSubmit)="guardar()">

        <label>Altura (cm)
          <input type="number" formControlName="altura">
        </label>

        <label>Peso (kg)
          <input type="number" formControlName="peso">
        </label>

        <label>IMC
          <input type="number" formControlName="imc" readonly>
        </label>

        <label>Fecha de medición
          <input type="date" formControlName="fecha_medicion">
        </label>

        <div *ngIf="error" class="error">{{ error }}</div>

        <button class="btn-primary" [disabled]="form.invalid || cargando">
          {{ cargando ? 'Guardando...' : (edicion ? 'Actualizar' : 'Guardar') }}
        </button>

        <button class="btn-secondary" type="button" (click)="cancelar()">
          Cancelar
        </button>

      </form>
    </div>
  `,
  styles:[`
    .container { max-width: 500px; margin: 0 auto; padding: 20px; font-family: 'Inter'; }
    h2 { text-align:center; font-weight:700; margin-bottom:20px; color:#1E293B; }
    form { display:flex; flex-direction:column; gap:15px; }
    label { font-weight:600; color:#475569; display:flex; flex-direction:column; gap:5px; }
    input { padding:10px; border:1px solid #CBD5E1; border-radius:8px; }
    input:focus { border-color:#16A34A; box-shadow:0 0 3px rgba(22,163,74,.4); outline:none;}
    .btn-primary {
      background:#16A34A; color:white; padding:12px; border-radius:8px; border:none;
      font-size:16px; cursor:pointer; font-weight:600; margin-top:10px;
    }
    .btn-primary:disabled { background:#A7F3D0; cursor:not-allowed; }
    .btn-secondary {
      padding:10px; border-radius:8px; border:1px solid #DC2626; background:white;
      color:#DC2626; font-weight:600; cursor:pointer;
    }
    .error { color:#DC2626; margin-top:8px; }
  `]
})
export class UsuarioHistorialMedidasInsertarComponent implements OnInit {

  edicion = false;
  cargando = false;
  form!: FormGroup;
  error: string | null = null;
  private id?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private historialService: UsuarioHistorialMedidasService
  ) {

    this.form = this.fb.group({
      altura: ['', [Validators.required, Validators.min(50), Validators.max(300)]],  // RN22
      peso: ['', [Validators.required, Validators.min(20), Validators.max(600)]],    // RN22
      imc: [{ value: '', disabled: true }],
      fecha_medicion: ['', Validators.required]
    });

    this.form.valueChanges.subscribe(val => {
      const altura = Number(val.altura);
      const peso = Number(val.peso);

      if (altura && peso) {
        // altura en cm -> pasar a metros para IMC
        const alturaM = altura / 100;
        const imc = peso / (alturaM * alturaM);
        this.form.get('imc')?.setValue(imc.toFixed(2), { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.edicion = true;
        this.id = Number(idParam);
        this.cargarMedicion(this.id);
      }
    });
  }

  private cargarMedicion(id: number): void {
    this.cargando = true;
    this.historialService.obtenerMedicionPorId(id).subscribe({
      next: (res: HistorialMedidasResponse) => {
        this.cargando = false;
        this.form.patchValue({
          altura: res.altura,
          peso: res.peso,
          imc: res.imc,
          fecha_medicion: res.fechaMedicion
        });
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar la medición.';
        this.cargando = false;
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) return;

    this.cargando = true;
    this.error = null;

    const raw = this.form.getRawValue();
    const request: HistorialMedidasRequest = {
      altura: Number(raw.altura),
      peso: Number(raw.peso),
      fechaMedicion: raw.fecha_medicion,
      unidadPeso: UnidadPeso.KG   // por ahora siempre KG; RN27 se cumple en backend
    };

    const obs = this.edicion && this.id
      ? this.historialService.actualizarMedicion(this.id, request)
      : this.historialService.registrarMedicion(request);

    obs.subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/usuario/medidas']);
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo guardar la medición.';
        this.cargando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/usuario/medidas']);
  }
}

