import { Routes } from '@angular/router';

export const PERFIL_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/mi-perfil.component').then(m => m.MiPerfilComponent)
    }
];
