import { Routes } from '@angular/router';

export const ETIQUETAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/etiquetas-list.component').then(m => m.EtiquetasListComponent),
    data: { title: 'Gestión de Etiquetas' }
  }
];