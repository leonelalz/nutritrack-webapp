import { Routes } from '@angular/router';

export const EJERCICIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/ejercicios-list.component').then(m => m.EjerciciosListComponent),
    data: { title: 'Gestión de Ejercicios' }
  }
];