import { Component, inject, signal, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside 
      class="sidebar" 
      [class.collapsed]="isCollapsed()"
      [class.hovered]="isHovered()"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()">
      
      <!-- Logo Section -->
      <div class="sidebar-header">
        <a routerLink="/dashboard" class="logo">
          <span class="logo-icon">🥗</span>
          <span class="logo-text">Nutri<span class="logo-highlight">Track</span></span>
        </a>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <!-- Main Section -->
        <div class="nav-section">
          <div class="section-title">Principal</div>

          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <span class="nav-text">Dashboard</span>
          </a>

          <a routerLink="/comidas" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/>
                <line x1="10" y1="1" x2="10" y2="4"/>
                <line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
            </div>
            <span class="nav-text">Mis Comidas</span>
          </a>

          <a routerLink="/ejercicios" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6.5 6.5L17.5 17.5"/>
                <path d="M6.5 6.5l-3.5 3.5"/>
                <path d="M6.5 6.5l3.5-3.5"/>
                <path d="M17.5 17.5l3.5-3.5"/>
                <path d="M17.5 17.5l-3.5 3.5"/>
                <circle cx="6.5" cy="6.5" r="2.5"/>
                <circle cx="17.5" cy="17.5" r="2.5"/>
              </svg>
            </div>
            <span class="nav-text">Mis Ejercicios</span>
          </a>

          <a routerLink="/metas" routerLinkActive="active" class="nav-item">
            <div class="nav-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <span class="nav-text">Mis Metas</span>
          </a>
        </div>

        <!-- Admin Section -->
        @if (isAdmin()) {
          <div class="nav-section admin-section">
            <div class="section-title">
              <span class="admin-badge">Admin</span>
            </div>

            <a routerLink="/admin" routerLinkActive="active" class="nav-item admin-item">
              <div class="nav-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
                </svg>
              </div>
              <span class="nav-text">Panel Admin</span>
            </a>
          </div>
        }

        <!-- Spacer -->
        <div class="nav-spacer"></div>

        <!-- User Section -->
        <div class="user-section">
          <a routerLink="/perfil" class="user-profile-link">
            <div class="user-avatar">
              {{ getUserInitial() }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ authService.currentUser()?.nombre || 'Usuario' }}</span>
              <span class="user-role">{{ isAdmin() ? 'Administrador' : 'Usuario' }}</span>
            </div>
          </a>
          
          <button class="logout-btn" (click)="logout()" title="Cerrar sesión">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span class="logout-text">Salir</span>
          </button>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    :host {
      --sidebar-expanded: 240px;
      --sidebar-collapsed: 72px;
      --transition-speed: 0.25s;
    }

    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: var(--sidebar-collapsed);
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      transition: width var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      overflow: hidden;
    }

    /* Expandir al hacer hover */
    .sidebar:hover,
    .sidebar.hovered {
      width: var(--sidebar-expanded);
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
    }

    /* Header */
    .sidebar-header {
      display: flex;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      min-height: 64px;
      overflow: hidden;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      white-space: nowrap;
    }

    .logo-icon {
      font-size: 1.6rem;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 1.2rem;
      font-weight: 700;
      color: #22c55e;
      opacity: 0;
      width: 0;
      overflow: hidden;
      transition: opacity var(--transition-speed), width var(--transition-speed);
    }

    .sidebar:hover .logo-text,
    .sidebar.hovered .logo-text {
      opacity: 1;
      width: auto;
    }

    .logo-highlight {
      color: #3b82f6;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 12px 8px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-section {
      margin-bottom: 8px;
    }

    .nav-spacer {
      flex: 1;
    }

    .admin-section {
      border-top: 1px solid #fbbf24;
      padding-top: 12px;
      margin-top: 8px;
      background: linear-gradient(180deg, rgba(251, 191, 36, 0.05) 0%, transparent 100%);
    }

    .section-title {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #94a3b8;
      padding: 8px 12px 4px;
      white-space: nowrap;
      overflow: hidden;
      opacity: 0;
      transition: opacity var(--transition-speed);
    }

    .sidebar:hover .section-title,
    .sidebar.hovered .section-title {
      opacity: 1;
    }

    .admin-badge {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.65rem;
    }

    /* Nav Items */
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      margin: 2px 0;
      border-radius: 12px;
      color: #64748b;
      text-decoration: none;
      transition: all 0.2s ease;
      position: relative;
      cursor: pointer;
      overflow: hidden;
    }

    .nav-item:hover {
      background: #f1f5f9;
      color: #3b82f6;
    }

    .nav-item:hover .nav-icon-wrapper {
      background: #dbeafe;
      color: #3b82f6;
    }

    .nav-item.active {
      background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
      color: #3b82f6;
    }

    .nav-item.active .nav-icon-wrapper {
      background: #3b82f6;
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    /* Admin item special styles */
    .nav-item.admin-item:hover .nav-icon-wrapper {
      background: #fef3c7;
      color: #d97706;
    }

    .nav-item.admin-item.active .nav-icon-wrapper {
      background: #f59e0b;
      color: white;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }

    .nav-icon-wrapper {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 10px;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }

    .nav-text {
      font-size: 0.9rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      width: 0;
      overflow: hidden;
      transition: opacity var(--transition-speed), width var(--transition-speed);
    }

    .sidebar:hover .nav-text,
    .sidebar.hovered .nav-text {
      opacity: 1;
      width: auto;
    }

    /* User Section */
    .user-section {
      border-top: 1px solid #e2e8f0;
      padding: 12px 8px;
      margin-top: auto;
    }

    .user-profile-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 12px;
      text-decoration: none;
      color: #475569;
      transition: all 0.2s ease;
      position: relative;
      cursor: pointer;
    }

    .user-profile-link:hover {
      background: #f1f5f9;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      width: 0;
      transition: opacity var(--transition-speed), width var(--transition-speed);
    }

    .sidebar:hover .user-info,
    .sidebar.hovered .user-info {
      opacity: 1;
      width: auto;
    }

    .user-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 0.75rem;
      color: #64748b;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 10px 12px;
      margin-top: 8px;
      border: none;
      border-radius: 12px;
      background: transparent;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .logout-btn:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    .logout-btn svg {
      flex-shrink: 0;
    }

    .logout-text {
      font-size: 0.9rem;
      font-weight: 500;
      opacity: 0;
      width: 0;
      overflow: hidden;
      transition: opacity var(--transition-speed), width var(--transition-speed);
    }

    .sidebar:hover .logout-text,
    .sidebar.hovered .logout-text {
      opacity: 1;
      width: auto;
    }

    /* Scrollbar */
    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Mobile */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.hovered {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);

  @Output() sidebarToggle = new EventEmitter<boolean>();

  isCollapsed = signal(true);
  isHovered = signal(false);

  ngOnInit(): void {
    this.emitState();
  }

  onMouseEnter(): void {
    this.isHovered.set(true);
    this.emitState();
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
    this.emitState();
  }

  private emitState(): void {
    // El sidebar está efectivamente colapsado cuando no hay hover
    this.sidebarToggle.emit(!this.isHovered());
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getUserInitial(): string {
    const nombre = this.authService.currentUser()?.nombre;
    return nombre ? nombre.charAt(0).toUpperCase() : 'U';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}