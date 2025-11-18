import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

/**
 * MÓDULO 5: SEGUIMIENTO Y PROGRESO
 * Rutas para registro de actividades y visualización de progreso
 * US-21 a US-25
 * TODO: Implementar componentes del Módulo 5
 */
export const SEGUIMIENTO_ROUTES: Routes = [
  // Temporalmente vacío hasta implementar componentes
  /*
  {
    path: 'hoy',
    loadComponent: () => import('./pages/actividades-hoy.component').then(m => m.ActividadesHoyComponent),
    title: 'Actividades de Hoy - NutriTrack'
  },
  {
    path: 'registrar-comida',
    loadComponent: () => import('./pages/registrar-comida.component').then(m => m.RegistrarComidaComponent),
    title: 'Registrar Comida - NutriTrack'
  },
  {
    path: 'registrar-ejercicio',
    loadComponent: () => import('./pages/registrar-ejercicio.component').then(m => m.RegistrarEjercicioComponent),
    title: 'Registrar Ejercicio - NutriTrack'
  },
  {
    path: 'historial',
    loadComponent: () => import('./pages/historial-registros.component').then(m => m.HistorialRegistrosComponent),
    title: 'Historial - NutriTrack'
  },
  {
    path: 'mediciones',
    loadComponent: () => import('./pages/mediciones.component').then(m => m.MedicionesComponent),
    title: 'Mediciones - NutriTrack'
  },
  {
    path: 'progreso',
    loadComponent: () => import('./pages/grafico-progreso.component').then(m => m.GraficoProgresoComponent),
    title: 'Mi Progreso - NutriTrack'
  },
  {
    path: '',
    redirectTo: 'hoy',
    pathMatch: 'full'
  }
  */
];
