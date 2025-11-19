import { Component, inject, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../components/navbar.component';
import { SidebarComponent } from '../components/sidebar.component';
import { FooterComponent } from '../components/footer.component';
import { AdminSidebarComponent } from "../components/admin-sidebar.component";

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent, AdminSidebarComponent],
  template: `
    <div class="auth-layout">
      @if (isAdminRoute()) {
        <!-- Admin Layout: Solo sidebar, sin navbar superior -->
        <div class="sidebar-wrapper" [class.sidebar-open]="!sidebarCollapsed()">
          <app-admin-sidebar (sidebarToggle)="onSidebarToggle($event)"/>
        </div>
        <div class="content-wrapper" [class.sidebar-open]="!sidebarCollapsed()">
          <main class="auth-main">
            <router-outlet />
          </main>
        </div>
      } @else {
        <div class="sidebar-wrapper" [class.sidebar-open]="!sidebarCollapsed()">
          <app-sidebar (sidebarToggle)="onSidebarToggle($event)" />
        </div>
        <div class="content-wrapper" [class.sidebar-open]="!sidebarCollapsed()">
            <app-navbar />
          <main class="auth-main">
            <router-outlet />     
          </main>
        </div>
      }
    </div>
  `,
  styles: [`
    .auth-layout {
      width: calc(100vw - 8px);
      min-height: 100vh;
      display: flex;
      position: absolute;
    }

    .conten-sidebar-wrapper {
      width: var(--sidebar-width);
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .content-wrapper {
      width: 100vw;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      margin-left: 0;
      transition: margin-left 0.3s ease, width 0.3s ease;
    }
    
    .content-wrapper.sidebar-open {
      width: calc(100vw - var(--sidebar-width));
      margin-left: var(--sidebar-width);
    }


    .auth-main {
      flex: 1;
    }

    /* Solo agregar margen superior si NO es admin route */
    .content-wrapper:has(app-navbar) .auth-main {
      margin-top: calc(20px + var(--navbar-height));
    }

    @media (max-width: 768px) {
      .content-wrapper {
        width: 100vw;
      }

      .content-wrapper.sidebar-open {
        width: calc(100vw - var(--sidebar-width));
        margin-left: var(--sidebar-width);
      }

      .auth-main {
        min-height: calc(100vh - 60px - 60px);
      }
    }
  `]
})
export class AuthLayoutComponent {
  sidebarCollapsed = signal(false);
  
  private authService = inject(AuthService);
  private router = inject(Router);

  // id_rol = 2 es Admin

  isAdmin = computed(() => this.authService.currentUser()?.role === 'ROLE_ADMIN');
  
  // Detecta si estamos en rutas de administración
  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }
}