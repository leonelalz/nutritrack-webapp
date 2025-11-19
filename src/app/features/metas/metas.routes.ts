import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';


export const METAS_ROUTES: Routes = [
   {
    path: 'planes',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/lista-planes.component').then(
            (m) => m.MetasListaPlanesComponent
          ),
        title: 'Planes Nutricionales - NutriTrack',
        canActivate: [authGuard],
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/detalle-plan.component').then(
            (m) => m.MetasDetallePlanComponent
          ),
        title: 'Detalle de Plan - NutriTrack',
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'rutinas',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/lista-rutinas.component').then(
            (m) => m.MetasListaRutinasComponent
          ),
        title: 'Rutinas de Ejercicio - NutriTrack',
        canActivate: [authGuard],
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/detalle-rutina.component').then(
            (m) => m.MetasDetalleRutinaComponent
          ),
        title: 'Detalle de Rutina - NutriTrack',
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'mis-asignaciones',
    loadComponent: () =>
      import('./pages/mis-asignaciones.components').then(
        (m) => m.MisAsignacionesComponent
      ),
    title: 'Mis Planes y Rutinas - NutriTrack',
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'mis-asignaciones',
    pathMatch: 'full',
  }, 
];