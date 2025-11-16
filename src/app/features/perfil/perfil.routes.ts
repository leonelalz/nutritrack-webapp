import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const PERFIL_ROUTES: Routes = [
  {
    path: 'salud',
    loadComponent: () => import('./pages/perfil-salud.component').then(m => m.PerfilSaludComponent),
    canActivate: [authGuard],
    title: 'Perfil de Salud - NutriTrack'
  },
  {
    path: 'unidades',
    loadComponent: () => import('./pages/configurar-unidades.component').then(m => m.ConfigurarUnidadesComponent),
    canActivate: [authGuard],
    title: 'Configurar Unidades - NutriTrack'
  },
  {
    path: 'eliminar-cuenta',
    loadComponent: () => import('./pages/eliminar-cuenta.component').then(m => m.EliminarCuentaComponent),
    canActivate: [authGuard],
    title: 'Eliminar Cuenta - NutriTrack'
  },
  {
    path: '',
    redirectTo: 'salud',
    pathMatch: 'full'
  }
];
