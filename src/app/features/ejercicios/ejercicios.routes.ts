import { Routes } from '@angular/router';

export const EJERCICIOS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/mis-ejercicios.component').then(m => m.MisEjerciciosComponent)
    }
];
