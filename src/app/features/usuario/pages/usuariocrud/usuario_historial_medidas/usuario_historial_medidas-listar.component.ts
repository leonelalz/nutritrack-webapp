import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-medidas-listar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h2>Historial de Medidas</h2>

      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Altura (m)</th>
            <th>Peso (kg)</th>
            <th>IMC</th>
            <th>Fecha</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let e of dataSource">
            <td>{{ e.id }}</td>
            <td>{{ e.altura }}</td>
            <td>{{ e.peso }}</td>
            <td>{{ e.imc }}</td>
            <td>{{ e.fecha_medicion | date }}</td>
            <td class="links">
              <a [routerLink]="['editar', e.id]" class="btn-edit">✏️</a>
              <button class="btn-delete" (click)="eliminar(e.id)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="btn-wrap">
        <a routerLink="/medidas/nuevo" class="btn-primary">➕ Registrar nueva medida</a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 950px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Inter', sans-serif;
    }
    h2 {
      text-align: center;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 20px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      font-size: 14px;
    }
    thead {
      background: #F1F5F9;
    }
    th, td {
      padding: 12px;
      text-align: center;
    }
    tbody tr:nth-child(even) {
      background: #F8FAFC;
    }
    .links {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    .btn-edit, .btn-delete {
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      background: none;
      font-size: 16px;
    }
    .btn-delete:hover {
      color: #DC2626;
    }
    .btn-edit:hover {
      color: #2563EB;
    }
    .btn-primary {
      background: #16A34A;
      color: white;
      padding: 12px 18px;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      display: inline-block;
      transition: background 0.3s;
    }
    .btn-primary:hover {
      background: #15803D;
    }
    .btn-wrap {
      margin-top: 22px;
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class UsuarioHistorialMedidasListarComponent {

  columnas = ['id','altura','peso','imc','fecha'];

  dataSource = [
    { id: 1, altura: 1.70, peso: 70, imc: 24.2, fecha_medicion: new Date() }
  ];

  eliminar(id: number) {
    console.log("Eliminar:", id);
  }
}
