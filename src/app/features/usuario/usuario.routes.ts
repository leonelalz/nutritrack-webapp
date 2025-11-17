import { Routes } from '@angular/router';

// PERFIL GENERAL
//import { PerfilComponent } from './pages/perfil.component';

// HISTORIAL MEDIDAS
import { UsuarioHistorialMedidasInsertarComponent } from './pages/usuariocrud/usuario_historial_medidas/usuario_historial_medidas-insertar.component';
import { UsuarioHistorialMedidasListarComponent } from './pages/usuariocrud/usuario_historial_medidas/usuario_historial_medidas-listar.component';

// PERFIL SALUD (nuevo insertar / listar)
//import { UsuarioPerfilSaludInsertarComponent } from './pages/usuariocrud/usuario_perfil_salud/usuario_perfil_saludinsertar.component';
//import { UsuarioPerfilSaludListarComponent } from './pages/usuariocrud/usuario_perfil_salud/usuario_perfil_saludlistar.component';

// PERFILES_USUARIO
//import { PerfilesUsuarioInsertarComponent } from './pages/usuariocrud/perfiles_usuario/perfiles_usuarioinsertar.component';
//import { PerfilesUsuarioListarComponent } from './pages/usuariocrud/perfiles_usuario/perfiles_usuariolistar.component';

// CUENTAS_AUTH
//import { CuentasAuthInsertarComponent } from './pages/usuariocrud/cuentas_auth/cuentas_authinsertar.component';
//import { CuentasAuthListarComponent } from './pages/usuariocrud/cuentas_auth/cuentas_authlistar.component';

// ROLES
//import { RolesInsertarComponent } from './pages/usuariocrud/roles/rolesinsertar.component';
//import { RolesListarComponent } from './pages/usuariocrud/roles/roleslistar.component';


export const USUARIO_ROUTES: Routes = [
  {
    path: '',
    children: [

      // PERFIL GENERAL
      //{ path: 'perfil', component: PerfilComponent, title: 'Mi Perfil' },

      // HISTORIAL MEDIDAS
      { path: 'medidas', component: UsuarioHistorialMedidasListarComponent },
      { path: 'medidas/nuevo', component: UsuarioHistorialMedidasInsertarComponent },
      { path: 'medidas/editar/:id', component: UsuarioHistorialMedidasInsertarComponent },

      // PERFIL SALUD (nuevo listar / insertar / editar)
      //{ path: 'perfil-salud', component: UsuarioPerfilSaludListarComponent },
      //{ path: 'perfil-salud/nuevo', component: UsuarioPerfilSaludInsertarComponent },
      //{ path: 'perfil-salud/editar/:id', component: UsuarioPerfilSaludInsertarComponent },

      // PERFILES_USUARIO
      //{ path: 'perfiles', component: PerfilesUsuarioListarComponent },
      //{ path: 'perfiles/nuevo', component: PerfilesUsuarioInsertarComponent },
      //{ path: 'perfiles/editar/:id', component: PerfilesUsuarioInsertarComponent },

      // CUENTAS_AUTH
      //{ path: 'cuentas', component: CuentasAuthListarComponent },
      //{ path: 'cuentas/nuevo', component: CuentasAuthInsertarComponent },
      //{ path: 'cuentas/editar/:id', component: CuentasAuthInsertarComponent },

      // ROLES
      //{ path: 'roles', component: RolesListarComponent },
      //{ path: 'roles/nuevo', component: RolesInsertarComponent },
      //{ path: 'roles/editar/:id', component: RolesInsertarComponent },
    ]
  }
];
