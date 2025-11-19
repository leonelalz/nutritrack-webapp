import { Routes } from '@angular/router';

export const COMIDAS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/mis-comidas.component').then(m => m.MisComidasComponent)
    }
];
