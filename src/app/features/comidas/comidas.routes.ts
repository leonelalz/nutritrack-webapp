import { Routes } from '@angular/router';

export const COMIDAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/comidas-list.component').then(m => m.ComidasListComponent),
    data: { title: 'Gestión de Comidas y Recetas' }
  }
];