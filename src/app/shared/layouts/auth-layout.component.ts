import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from '../components/sidebar.component';
import { AdminSidebarComponent } from "../components/admin-sidebar.component";

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, AdminSidebarComponent],
  template: `
    <div class="auth-layout">
      @if (isAdminRoute()) {
        <!-- Admin Layout -->
        <div class="sidebar-wrapper">
          <app-admin-sidebar (sidebarToggle)="onSidebarToggle($event)"/>
        </div>
        <div class="content-wrapper" [class.collapsed]="sidebarCollapsed()">
          <main class="auth-main">
            <router-outlet />
          </main>
        </div>
      } @else {
        <!-- User Layout: Solo sidebar lateral con perfil y logout integrados -->
        <app-sidebar (sidebarToggle)="onSidebarToggle($event)" />
        
        <div class="content-wrapper" [class.collapsed]="sidebarCollapsed()">
          <main class="auth-main">
            <router-outlet />     
          </main>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      --sidebar-expanded: 240px;
      --sidebar-collapsed: 72px;
    }

    .auth-layout {
      width: 100%;
      min-height: 100vh;
      display: flex;
      position: relative;
    }

    .content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      margin-left: var(--sidebar-expanded);
      transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      width: calc(100% - var(--sidebar-expanded));
    }
    
    .content-wrapper.collapsed {
      margin-left: var(--sidebar-collapsed);
      width: calc(100% - var(--sidebar-collapsed));
    }

    .auth-main {
      flex: 1;
      padding: 24px;
      background: #f8fafc;
    }

    @media (max-width: 768px) {
      .content-wrapper {
        margin-left: 0;
        width: 100%;
      }

      .content-wrapper.collapsed {
        margin-left: 0;
        width: 100%;
      }
    }
  `]
})
export class AuthLayoutComponent {
  sidebarCollapsed = signal(true);
  
  private authService = inject(AuthService);
  private router = inject(Router);

  isAdmin = computed(() => this.authService.currentUser()?.role === 'ROLE_ADMIN');
  
  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }
}