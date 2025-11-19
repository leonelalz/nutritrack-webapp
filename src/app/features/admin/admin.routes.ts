import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

/**
 * MÓDULO 2 Y 3: ADMINISTRACIÓN
 * Rutas para gestión de contenido (solo ADMIN)
 * US-06 a US-15
 */
export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    title: 'Panel Admin - NutriTrack'
  },
  // Módulo 2: Gestión de Contenido Base
  {
    path: 'etiquetas',
    loadChildren: () => import('./etiquetas/etiquetas.routes').then(m => m.ETIQUETAS_ROUTES),
  },
  {
    path: 'ingredientes',
    loadChildren: () => import('./ingredientes/ingredientes.routes').then(m => m.INGREDIENTES_ROUTES),
  },
  {
    path: 'ejercicios',
    loadChildren: () => import('./ejercicios/ejercicios.routes').then(m => m.EJERCICIOS_ROUTES),
  },
  {
    path: 'comidas',
    loadChildren: () => import('./comidas/comidas.routes').then(m => m.COMIDAS_ROUTES),
  },
  // Módulo 3: Gestión de Planes y Rutinas ✅ IMPLEMENTADO
  {
    path: 'planes',
    children: [
      {
        path: '',
        loadComponent: () => import('./planes/pages/lista-planes.component').then(m => m.ListaPlanesComponent),
        title: 'Planes - Admin'
      },
      {
        path: 'crear',
        loadComponent: () => import('./planes/pages/crear-plan.component').then(m => m.CrearPlanComponent),
        title: 'Crear Plan - Admin'
      },
      {
        path: ':id',
        loadComponent: () => import('./planes/pages/detalle-plan.component').then(m => m.DetallePlanComponent),
        title: 'Detalle Plan - Admin'
      },
      {
        path: ':id/editar',
        loadComponent: () => import('./planes/pages/editar-plan.component').then(m => m.EditarPlanComponent),
        title: 'Editar Plan - Admin'
      },
      {
        path: ':id/configurar',
        loadComponent: () => import('./planes/pages/configurar-dias-plan.component').then(m => m.ConfigurarDiasPlanComponent),
        title: 'Configurar Días - Admin'
      },
      {
        path: ':id/comidas',
        loadComponent: () => import('./planes/pages/gestionar-comidas-plan.component').then(m => m.GestionarComidasPlanComponent),
        title: 'Gestionar Comidas - Admin'
      }
    ]
  },
  {
    path: 'rutinas',
    children: [
      {
        path: '',
        loadComponent: () => import('./rutinas/pages/lista-rutinas.component').then(m => m.ListaRutinasComponent),
        title: 'Rutinas - Admin'
      },
      {
        path: 'crear',
        loadComponent: () => import('./rutinas/pages/crear-rutina.component').then(m => m.CrearRutinaComponent),
        title: 'Crear Rutina - Admin'
      },
      {
        path: ':id/editar',
        loadComponent: () => import('./rutinas/pages/editar-rutina.component').then(m => m.EditarRutinaComponent),
        title: 'Editar Rutina - Admin'
      },
      {
        path: ':id/ejercicios',
        loadComponent: () => import('./rutinas/pages/gestionar-ejercicios-rutina.component').then(m => m.GestionarEjerciciosRutinaComponent),
        title: 'Gestionar Ejercicios - Admin'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
