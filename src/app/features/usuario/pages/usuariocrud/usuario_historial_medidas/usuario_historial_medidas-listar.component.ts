// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-historial-medidas-listar',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   template: `
//     <div class="container">
//       <h2>Historial de Medidas</h2>

//       <table class="table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Altura (m)</th>
//             <th>Peso (kg)</th>
//             <th>IMC</th>
//             <th>Fecha</th>
//             <th></th>
//           </tr>
//         </thead>

//         <tbody>
//           <tr *ngFor="let e of dataSource">
//             <td>{{ e.id }}</td>
//             <td>{{ e.altura }}</td>
//             <td>{{ e.peso }}</td>
//             <td>{{ e.imc }}</td>
//             <td>{{ e.fecha_medicion | date }}</td>
//             <td class="links">
//               <a [routerLink]="['editar', e.id]" class="btn-edit">✏️</a>
//               <button class="btn-delete" (click)="eliminar(e.id)">🗑️</button>
//             </td>
//           </tr>
//         </tbody>
//       </table>

//       <div class="btn-wrap">
//         <a routerLink="/medidas/nuevo" class="btn-primary">➕ Registrar nueva medida</a>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .container {
//       max-width: 950px;
//       margin: 0 auto;
//       padding: 20px;
//       font-family: 'Inter', sans-serif;
//     }
//     h2 {
//       text-align: center;
//       font-weight: 700;
//       color: #1E293B;
//       margin-bottom: 20px;
//     }
//     .table {
//       width: 100%;
//       border-collapse: collapse;
//       background: white;
//       border-radius: 10px;
//       overflow: hidden;
//       font-size: 14px;
//     }
//     thead {
//       background: #F1F5F9;
//     }
//     th, td {
//       padding: 12px;
//       text-align: center;
//     }
//     tbody tr:nth-child(even) {
//       background: #F8FAFC;
//     }
//     .links {
//       display: flex;
//       gap: 10px;
//       justify-content: center;
//     }
//     .btn-edit, .btn-delete {
//       padding: 6px 10px;
//       border-radius: 6px;
//       cursor: pointer;
//       border: none;
//       background: none;
//       font-size: 16px;
//     }
//     .btn-delete:hover {
//       color: #DC2626;
//     }
//     .btn-edit:hover {
//       color: #2563EB;
//     }
//     .btn-primary {
//       background: #16A34A;
//       color: white;
//       padding: 12px 18px;
//       border-radius: 8px;
//       font-weight: 600;
//       text-decoration: none;
//       display: inline-block;
//       transition: background 0.3s;
//     }
//     .btn-primary:hover {
//       background: #15803D;
//     }
//     .btn-wrap {
//       margin-top: 22px;
//       display: flex;
//       justify-content: flex-end;
//     }
//   `]
// })
// export class UsuarioHistorialMedidasListarComponent {

//   columnas = ['id','altura','peso','imc','fecha'];

//   dataSource = [
//     { id: 1, altura: 1.70, peso: 70, imc: 24.2, fecha_medicion: new Date() }
//   ];

//   eliminar(id: number) {
//     console.log("Eliminar:", id);
//   }
// }



























// src/app/features/usuario/pages/usuariocrud/usuario_historial_medidas/usuario_historial_medidas-listar.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { UsuarioHistorialMedidasService } from '../../../../core/services/UsuarioHistorialMedidas.service';
import { HistorialMedidasResponse } from '../../../../core/models/UsuarioHistorialMedidas.model';

@Component({
  selector: 'app-historial-medidas-listar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h2>Historial de Medidas</h2>

      <div *ngIf="cargando">Cargando historial...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <table class="table" *ngIf="!cargando && dataSource.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Altura (cm)</th>
            <th>Peso</th>
            <th>IMC</th>
            <th>Fecha</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let e of dataSource">
            <td>{{ e.id }}</td>
            <td>{{ e.altura }}</td>
            <td>{{ e.peso }} {{ e.unidadPeso }}</td>
            <td>{{ e.imc }}</td>
            <td>{{ e.fechaMedicion | date }}</td>
            <td class="links">
              <a [routerLink]="['/usuario/medidas/editar', e.id]" class="btn-edit">✏️</a>
              <button class="btn-delete" (click)="eliminar(e.id)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!cargando && dataSource.length === 0" class="empty">
        Aún no tienes mediciones registradas.
      </div>

      <div class="btn-wrap">
        <a routerLink="/usuario/medidas/nuevo" class="btn-primary">➕ Registrar nueva medida</a>
      </div>
    </div>
  `,
  styles:[`
    .container { max-width: 800px; margin: 0 auto; padding: 20px; font-family: 'Inter'; }
    h2 { text-align:center; font-weight:700; margin-bottom:20px; color:#1E293B; }
    .table { width:100%; border-collapse:collapse; }
    .table th, .table td { padding:8px 12px; border-bottom:1px solid #E2E8F0; text-align:left; }
    .table th { background:#F8FAFC; font-weight:600; color:#475569; }
    .links { display:flex; gap:8px; }
    .btn-primary {
      display:inline-block;
      background:#16A34A; color:white; padding:10px 16px; border-radius:8px; text-decoration:none;
      font-weight:600; margin-top:16px;
    }
    .btn-edit, .btn-delete {
      border:none; background:transparent; cursor:pointer; font-size:18px;
    }
    .btn-edit { color:#0EA5E9; }
    .btn-delete { color:#DC2626; }
    .error { color:#DC2626; margin-bottom:10px; }
    .empty { text-align:center; color:#64748B; margin:16px 0; }
  `]
})
export class UsuarioHistorialMedidasListarComponent implements OnInit {

  dataSource: HistorialMedidasResponse[] = [];
  cargando = false;
  error: string | null = null;

  constructor(
    private historialService: UsuarioHistorialMedidasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando = true;
    this.error = null;

    this.historialService.obtenerHistorial().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar el historial de medidas.';
        this.cargando = false;
      }
    });
  }

  eliminar(id: number): void {
    const ok = confirm('¿Seguro que deseas eliminar esta medición?');
    if (!ok) return;

    this.historialService.eliminarMedicion(id).subscribe({
      next: () => {
        this.cargarHistorial();
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo eliminar la medición.';
      }
    });
  }
}
