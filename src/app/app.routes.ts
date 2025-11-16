import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { LandingLayoutComponent } from './shared/layouts/landing-layout.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout.component';

export const routes: Routes = [
  // =============================================================================
  // RUTAS PÚBLICAS (Sin Layout)
  // =============================================================================
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES)
  },

  // =============================================================================
  // LANDING LAYOUT - Rutas de Autenticación (Login, Register)
  // =============================================================================
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
      }
    ]
  },

  // =============================================================================
  // AUTH LAYOUT - Rutas Protegidas (requiere autenticación)
  // Dashboard, Perfil, Catálogo, Seguimiento, Admin
  // =============================================================================
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [authGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      // Módulo Perfil (US-03, US-04, US-05)
      {
        path: 'perfil',
        loadChildren: () => import('./features/perfil/perfil.routes').then(m => m.PERFIL_ROUTES)
      },
      // Módulo Catálogo (US-16 a US-20)
      {
        path: 'catalogo',
        loadChildren: () => import('./features/catalogo/catalogo.routes').then(m => m.CATALOGO_ROUTES)
      },
      // Módulo Seguimiento (US-21 a US-25)
      {
        path: 'seguimiento',
        loadChildren: () => import('./features/seguimiento/seguimiento.routes').then(m => m.SEGUIMIENTO_ROUTES)
      },
      // Módulo Admin (US-06 a US-15) - Solo para administradores
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
      }
    ]
  },

  // =============================================================================
  // FALLBACK - Ruta por defecto (404)
  // =============================================================================
  {
    path: '**',
    redirectTo: ''
  }
];