import { Routes } from '@angular/router';

export const METAS_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'mis-asignaciones',
        pathMatch: 'full'
    },
    {
        path: 'mis-asignaciones',
        loadComponent: () => import('./pages/mis-asignaciones.components').then(m => m.MisAsignacionesComponent)
    },
    {
        path: 'planes',
        loadComponent: () => import('./pages/lista-planes.component').then(m => m.MetasListaPlanesComponent)
    },
    {
        path: 'planes/:id',
        loadComponent: () => import('./pages/detalle-plan.component').then(m => m.MetasDetallePlanComponent)
    },
    {
        path: 'rutinas',
        loadComponent: () => import('./pages/lista-rutinas.component').then(m => m.MetasListaRutinasComponent)
    },
    {
        path: 'rutinas/:id',
        loadComponent: () => import('./pages/detalle-rutina.component').then(m => m.MetasDetalleRutinaComponent)
    }
];
