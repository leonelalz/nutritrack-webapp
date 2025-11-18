import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

/**
 * MÓDULO 4: CATÁLOGO Y EXPLORACIÓN
 * Rutas para que usuarios exploren y activen planes/rutinas
 * US-16 a US-20
 */
export const CATALOGO_ROUTES: Routes = [
  // TODO: Implementar componentes del Módulo 4
  // {
  //   path: 'planes',
  //   children: [
  //     {
  //       path: '',
  //       loadComponent: () => import('./pages/lista-planes.component').then(m => m.ListaPlanesComponent),
  //       title: 'Planes Nutricionales - NutriTrack'
  //     },
  //     {
  //       path: ':id',
  //       loadComponent: () => import('./pages/detalle-plan.component').then(m => m.DetallePlanComponent),
  //       title: 'Detalle de Plan - NutriTrack'
  //     }
  //   ]
  // },
  // {
  //   path: 'rutinas',
  //   children: [
  //     {
  //       path: '',
  //       loadComponent: () => import('./pages/lista-rutinas.component').then(m => m.ListaRutinasComponent),
  //       title: 'Rutinas de Ejercicio - NutriTrack'
  //     },
  //     {
  //       path: ':id',
  //       loadComponent: () => import('./pages/detalle-rutina.component').then(m => m.DetalleRutinaComponent),
  //       title: 'Detalle de Rutina - NutriTrack'
  //     }
  //   ]
  // },
  // {
  //   path: 'mis-asignaciones',
  //   loadComponent: () => import('./pages/mis-asignaciones.component').then(m => m.MisAsignacionesComponent),
  //   title: 'Mis Planes y Rutinas - NutriTrack'
  // },
  // {
  //   path: '',
  //   redirectTo: 'planes',
  //   pathMatch: 'full'
  // }
];
