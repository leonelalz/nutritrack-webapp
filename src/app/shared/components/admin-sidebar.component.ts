import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

/**
 * Sidebar de navegación para administradores
 * Basado en el diseño de NutriTrack con fondo verde oscuro
 */
@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatRippleModule
  ],
  template: `
    <aside class="admin-sidebar" [class.collapsed]="isCollapsed()">
      <!-- boton pa cerrar -->
       <button class="toggle-btn" (click)="toggleSidebar()" title="Ocultar/Mostrar menú">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          @if (isCollapsed()) {
            <polyline points="9 18 15 12 9 6"/>
          } @else {
            <polyline points="15 18 9 12 15 6"/>
          }
        </svg>
      </button>

      <!-- Logo & Brand -->
      <div class="sidebar-header">
        <div class="brand">
          <mat-icon class="brand-icon">spa</mat-icon>
          <span class="brand-text">NutriTrack</span>
        </div>
      </div>

      <!-- User Info -->
      <div class="user-section">
        <div class="user-avatar">
          <div class="avatar-fallback">{{ getUserInitials() }}</div>
        </div>
        <div class="user-info">
          <p class="user-name">{{ getUserName() }}</p>
          <p class="user-role">Administrador</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <a 
          *ngFor="let item of navItems" 
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{exact: item.route === '/admin/dashboard'}"
          class="nav-item"
          mat-ripple
        >
          <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
          <span class="nav-label">{{ item.label }}</span>
        </a>
      </nav>

      <!-- Logout -->
      <div class="sidebar-footer">
        <button mat-button class="logout-btn" (click)="onLogout()">
          <mat-icon>logout</mat-icon>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .admin-sidebar {
      width: 260px;
      height: 100vh;
      background: linear-gradient(180deg, #003D2A 0%, #002820 100%);
      color: white;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
    }

    .admin-sidebar.collapsed {
      transform: translateX(calc(-1 * var(--sidebar-width)));
    }
    
    .toggle-btn {
      position: absolute;
      right: -25px;
      top: calc(100vh / 2 - 100px);
      width: 25px;
      height: 200px;
      background: var(--color-secondary);
      color: var(--color-text-light);
      border: none;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-base);
      z-index: var(--z-index-fixed);
    }

    .toggle-btn:hover {
      background: var(--color-secondary-dark);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
      transform: scale(1.05);
    }

    .toggle-btn svg {
      transition: var(--transition-base);
    }

    /* Logo & Brand */
    .sidebar-header {
      padding: 1.5rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-icon {
      color: #00A859;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .brand-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      letter-spacing: 0.5px;
    }

    /* User Section */
    .user-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .user-avatar {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }

    .avatar-fallback {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #00A859 0%, #007A42 100%);
      color: white;
      font-weight: 600;
      font-size: 1.125rem;
      border-radius: 50%;
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      margin: 0 0 0.25rem 0;
      font-weight: 600;
      font-size: 0.9375rem;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      margin: 0;
      font-size: 0.8125rem;
      color: #00A859;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.5rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      border-left: 3px solid transparent;
      font-size: 0.9375rem;
      font-weight: 500;
      min-height: 44px;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }

    .nav-item.active {
      background: rgba(0, 168, 89, 0.15);
      color: #00A859;
      border-left-color: #00A859;
    }

    .nav-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      flex-shrink: 0;
    }

    .nav-label {
      flex: 1;
      line-height: 1.3;
      word-break: break-word;
    }

    /* Logout Button */
    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 1rem;
      padding: 0.875rem 1rem;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9375rem;
      font-weight: 500;
      text-transform: none;
      letter-spacing: normal;
    }

    .logout-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }

    .logout-btn mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    /* Scrollbar personalizado */
    .sidebar-nav::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    @media (max-width: 768px) {
      .admin-sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .admin-sidebar.mobile-open {
        transform: translateX(0);
      }
    }
  `]
})
export class AdminSidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard'
    },
    {
      label: 'Planes Nutricionales',
      icon: 'menu_book',
      route: '/admin/planes'
    },
    {
      label: 'Rutinas de Ejercicio',
      icon: 'fitness_center',
      route: '/admin/rutinas'
    },
    {
      label: 'Comidas',
      icon: 'restaurant',
      route: '/admin/comidas'
    },
    {
      label: 'Ingredientes',
      icon: 'inventory_2',
      route: '/admin/ingredientes'
    },
    {
      label: 'Ejercicios',
      icon: 'directions_run',
      route: '/admin/ejercicios'
    },
    {
      label: 'Etiquetas',
      icon: 'label',
      route: '/admin/etiquetas'
    }
  ];

  getUserName(): string {
    return this.authService.currentUser()?.nombre || 'Admin';
  }

  getUserInitials(): string {
    const name = this.getUserName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  onLogout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
    }
  }

  @Output() sidebarToggle = new EventEmitter<boolean>();

  isCollapsed = signal(false); // Visible por defecto

  toggleSidebar() {
    this.isCollapsed.update(value => !value);
    // Emitir al parent (AuthLayout)
    this.sidebarToggle.emit(this.isCollapsed());
  }
}
