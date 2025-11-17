import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed()">
      <button class="toggle-btn" (click)="toggleSidebar()" title="Ocultar/Mostrar menú">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          @if (isCollapsed()) {
            <polyline points="9 18 15 12 9 6"/>
          } @else {
            <polyline points="15 18 9 12 15 6"/>
          }
        </svg>
      </button>
    
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="header-content">
            <a routerLink="/" class="logo">
              <span class="logo-text">Nutri<span class="logo-highlight">Track</span></span>
            </a>
          </div>

          <div class="section-title">Principal</div>

          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span class="nav-text">Dashboard</span>
          </a>

          <a routerLink="/accounts" routerLinkActive="active" class="nav-item">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 23" fill="none" >
              <path d="M2.79125 1.16974C2.85687 0.592236 2.44125 0.0759864 1.86375 0.0103614C1.28625 -0.0552636 0.77 0.360362 0.704375 0.937862L0.00437493 7.23786L0 7.29474V8.05161C0 10.1779 1.72375 11.9016 3.85 11.9016H4.2V21.3516C4.2 21.9335 4.66813 22.4016 5.25 22.4016C5.83188 22.4016 6.3 21.9335 6.3 21.3516V11.9016H6.65C8.77625 11.9016 10.5 10.1779 10.5 8.05161V7.29474L10.4956 7.23786L9.79562 0.937862C9.72563 0.360362 9.205 -0.0552636 8.6275 0.00598643C8.05 0.0672364 7.63438 0.587861 7.7 1.16536L8.39562 7.40849V8.05161C8.39562 9.01849 7.6125 9.80161 6.64562 9.80161H3.84562C2.87875 9.80161 2.09562 9.01849 2.09562 8.05161V7.40849L2.79125 1.16536V1.16974ZM6.29562 1.05161C6.29562 0.469737 5.8275 0.0016115 5.24563 0.0016115C4.66375 0.0016115 4.19562 0.469737 4.19562 1.05161V7.35161C4.19562 7.93349 4.66375 8.40161 5.24563 8.40161C5.8275 8.40161 6.29562 7.93349 6.29562 7.35161V1.05161ZM14.3456 7.70161C14.3456 5.17724 15.295 3.82536 16.1569 3.07724C16.4937 2.78849 16.835 2.56974 17.1456 2.41224V13.3016H15.0456C14.6606 13.3016 14.3456 12.9866 14.3456 12.6016V7.70161ZM17.1456 15.4016V21.3516C17.1456 21.9335 17.6137 22.4016 18.1956 22.4016C18.7775 22.4016 19.2456 21.9335 19.2456 21.3516V1.40161C19.2456 0.627236 18.62 0.0016115 17.8456 0.0016115C17.1456 0.0016115 12.2456 1.40161 12.2456 7.70161V12.6016C12.2456 14.146 13.5012 15.4016 15.0456 15.4016H17.1456Z" fill="#64748B"/>
            </svg>
            <span class="nav-text">Mis Comidas</span>
          </a>

          <a routerLink="/transactions" routerLinkActive="active" class="nav-item">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 27" fill="none">
              <path d="M12.0049 0C13.4534 0 14.6299 1.17656 14.6299 2.625C14.6299 4.07344 13.4534 5.25 12.0049 5.25C10.5565 5.25 9.37992 4.07344 9.37992 2.625C9.37992 1.17656 10.5565 0 12.0049 0ZM5.75649 9C5.4518 9 5.17992 9.18281 5.06274 9.45937L3.67055 12.8062C3.43149 13.3781 2.77524 13.65 2.19867 13.4109C1.62211 13.1719 1.35492 12.5156 1.59399 11.9391L2.98617 8.59219C3.45024 7.47656 4.54242 6.75 5.75649 6.75H10.1534C11.7143 6.75 13.144 7.63125 13.8424 9.02812L15.2252 11.7891C15.2909 11.9156 15.4174 11.9953 15.5627 11.9953H18.3846C19.0081 11.9953 19.5096 12.4969 19.5096 13.1203C19.5096 13.7437 19.0081 14.2453 18.3846 14.2453H15.5627C14.569 14.2453 13.6596 13.6828 13.2143 12.7922L13.069 12.5016L11.8455 16.3781L14.4424 17.0531C15.5627 17.3437 16.1534 18.5719 15.6846 19.6312L13.0315 25.5797C12.7784 26.1469 12.1127 26.4047 11.5455 26.1516C10.9784 25.8984 10.7205 25.2328 10.9737 24.6656L13.4346 19.125L7.5893 17.6016C6.15492 17.2266 5.31586 15.7406 5.73305 14.3203L7.17211 9.43125L7.29867 9H5.7518H5.75649ZM9.6518 9C9.62836 9.075 9.04711 11.0625 7.89867 14.9578C7.83774 15.1594 7.95961 15.375 8.16586 15.4266L9.66586 15.8156L11.6018 9.67969C11.2502 9.25312 10.7205 9 10.158 9H9.65649H9.6518ZM5.49399 19.0828C5.94867 19.3922 6.45961 19.6312 7.02211 19.7812L7.57992 19.9266L7.33617 20.6109C7.08774 21.3 6.66117 21.9141 6.09867 22.3828L1.84711 25.9453C1.36899 26.3437 0.661173 26.2828 0.262736 25.8047C-0.135702 25.3266 -0.0747643 24.6187 0.403361 24.2203L4.65492 20.6578C4.91274 20.4422 5.10492 20.1656 5.21742 19.8516L5.49399 19.0828Z" fill="#64748B"/>
            </svg>
            <span class="nav-text">Mis Ejercicios</span>
          </a>

          <a routerLink="/transactions" routerLinkActive="active" class="nav-item">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 14 10" fill="none">
              <path d="M12.5303 0.530334L4.28033 8.78033L0.530334 5.03033" stroke="#64748B" stroke-width="1.5"/>
            </svg>
            <span class="nav-text">Mis Metas</span>
          </a>

        </div>

        <!-- Sección de Administración - TEMPORALMENTE VISIBLE PARA TODOS (REMOVER @if PARA TESTING) -->
        <div class="nav-section nav-section-divider admin-section">
          <div class="section-title">Administración</div>
          
          <!-- ETIQUETAS -->
          <a routerLink="/etiquetas" routerLinkActive="active" class="nav-item">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            <span class="nav-text">Etiquetas</span>
          </a>

          <a routerLink="/ingredientes" routerLinkActive="active" class="nav-item">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
              <path d="M12 12v10"/>
              <path d="M8 22h8"/>
            </svg>
            <span class="nav-text">Ingredientes</span>
          </a>

          <a routerLink="/ejercicios" routerLinkActive="active" class="nav-item">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.4 14.4L9.6 9.6"/>
              <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.828l-1.768 1.768a2 2 0 1 1 2.828 2.828z"/>
              <path d="M21.5 21.5l-1.4-1.4"/>
              <path d="M3.9 3.9l1.4 1.4"/>
            </svg>
            <span class="nav-text">Ejercicios</span>
          </a>

          <a routerLink="/comidas" routerLinkActive="active" class="nav-item">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="6"/>
              <path d="M12 14v8"/>
              <path d="M8.5 14l-1 8"/>
              <path d="M15.5 14l1 8"/>
            </svg>
            <span class="nav-text">Comidas</span>
          </a>
        </div>
         @if (isAdmin()) {
          <div class="nav-section nav-section-divider admin-section">
            <div class="section-title">Administración</div>
            <a routerLink="/reports" routerLinkActive="active" class="nav-item">
              <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18"/>
                <path d="M18 17V9"/>
                <path d="M13 17V5"/>
                <path d="M8 17v-3"/>
              </svg>
              <span class="nav-text">Reportes</span>
            </a>
          </div>
         }

        <div class="nav-section nav-section-bottom">
          <div class="section-title">Cuenta</div>
          <a routerLink="/profile" routerLinkActive="active" class="nav-item">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="nav-text">Mi Perfil</span>
          </a>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      height: 100vh;
      width: var(--sidebar-width);
      background: var(--color-background-light);
      box-shadow: var(--shadow-md);
      transition: var(--transition-base);
      z-index: 1
      display: flex;
      flex-direction: column;
    }

    .sidebar.collapsed {
      transform: translateX(calc(-1 * var(--sidebar-width)));
    }

    .header-content {
      width: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      padding: 10px 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .logo-icon {
      font-size: 2rem;
    }

    .logo-text {
      color: var(--color-primary);
    }

    .logo-highlight {
      color: var(--color-secondary);
    }

    .toggle-btn {
      position: absolute;
      right: -40px;
      top: 10px;
      width: 36px;
      height: 36px;
      background: var(--color-secondary);
      color: var(--color-text-light);
      border: none;
      border-radius: var(--border-radius-round);
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

    .sidebar-nav {
      padding: var(--spacing-md) 0;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .nav-section {
      display: flex;
      flex-direction: column;
    }

    .nav-section-divider {
      padding-top: var(--spacing-md);
      margin-top: var(--spacing-md);
      border-top: 2px solid var(--color-border-light);
    }

    .nav-section-bottom {
      margin-top: auto;
      padding-top: var(--spacing-md);
      border-top: 2px solid var(--color-border-light);
    }

    .section-title {
      padding: 0.75rem var(--spacing-lg) var(--spacing-sm) var(--spacing-lg);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--color-text-muted);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md) var(--spacing-lg);
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: var(--transition-base);
      position: relative;
    }

    .nav-item:hover {
      background: var(--color-background);
      color: var(--color-secondary);
    }

    .nav-item.active {
      background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%);
      color: var(--color-secondary);
      border-left: 3px solid var(--color-secondary);
    }

    .nav-item.active .nav-icon {
      color: var(--color-secondary);
    }

    .nav-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .nav-text {
      font-size: 0.95rem;
      font-weight: var(--font-weight-medium);
      white-space: nowrap;
    }

    /* Sección de administración */
    .admin-section {
      border-top: 2px solid var(--color-warning);
      background: linear-gradient(180deg, rgba(255, 193, 7, 0.05) 0%, transparent 100%);
    }

    .admin-section .section-title {
      color: var(--color-warning);
      font-weight: var(--font-weight-bold);
    }

    .admin-section .nav-item {
      border-left: 3px solid transparent;
    }

    .admin-section .nav-item:hover {
      background: rgba(255, 193, 7, 0.1);
      color: var(--color-warning);
      border-left: 3px solid var(--color-warning);
    }

    .admin-section .nav-item.active {
      background: linear-gradient(90deg, rgba(255, 193, 7, 0.15) 0%, transparent 100%);
      color: var(--color-warning);
      border-left: 3px solid var(--color-warning);
    }

    .admin-section .nav-item.active .nav-icon {
      color: var(--color-warning);
    }

    @media (max-width: 768px) {
      .sidebar {
        top: 60px;
        height: calc(100vh - 60px);
      }

      .toggle-btn {
        right: -38px;
      }
    }
  `]
})
export class SidebarComponent {
  private authService = inject(AuthService);

  @Output() sidebarToggle = new EventEmitter<boolean>();

  isCollapsed = signal(false); // Visible por defecto

  toggleSidebar() {
    this.isCollapsed.update(value => !value);
    // Emitir al parent (AuthLayout)
    this.sidebarToggle.emit(this.isCollapsed());
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  
}