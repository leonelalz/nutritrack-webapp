import { Component, inject, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../components/navbar.component';
import { SidebarComponent } from '../components/sidebar.component';
import { FooterComponent } from '../components/footer.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="auth-layout">
      <div class="sidebar-wrapper" [class.sidebar-open]="!sidebarCollapsed()">
        <app-sidebar (sidebarToggle)="onSidebarToggle($event)" />
      </div>
      <div class="content-wrapper" [class.sidebar-open]="!sidebarCollapsed()">
        <app-navbar />
        <main class="auth-main">
          <router-outlet />     
        </main>
      </div>
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

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }

  private authService = inject(AuthService);

  isAdmin = computed(() => this.authService.currentUser()?.role === 'ROLE_ADMIN');
}