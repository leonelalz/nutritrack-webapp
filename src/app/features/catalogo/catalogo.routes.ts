import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

/**
 * MÓDULO 4: CATÁLOGO Y EXPLORACIÓN
 * Rutas para que usuarios exploren y activen planes/rutinas
 * US-16 a US-20
 */
export const CATALOGO_ROUTES: Routes = [
  {
    path: 'planes',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/lista-planes.component').then(
            (m) => m.CatalogoListaPlanesComponent
          ),
        title: 'Planes Nutricionales - NutriTrack',
        canActivate: [authGuard],
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/detalle-plan.component').then(
            (m) => m.CatalogoDetallePlanComponent
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
            (m) => m.CatalogoListaRutinasComponent
          ),
        title: 'Rutinas de Ejercicio - NutriTrack',
        canActivate: [authGuard],
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/detalle-rutina.component').then(
            (m) => m.CatalogoDetalleRutinaComponent
          ),
        title: 'Detalle de Rutina - NutriTrack',
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'mis-asignaciones',
    loadComponent: () =>
      import('./pages/mis-asignaciones.component').then(
        (m) => m.MisAsignacionesComponent
      ),
    title: 'Mis Planes y Rutinas - NutriTrack',
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'planes',
    pathMatch: 'full',
  },
];
