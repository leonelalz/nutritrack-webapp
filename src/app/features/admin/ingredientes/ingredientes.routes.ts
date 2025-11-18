import { Routes } from '@angular/router';

export const INGREDIENTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/ingredientes-list.component').then(m => m.IngredientesListComponent),
    data: { title: 'Gestión de Ingredientes' }
  }
];