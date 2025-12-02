import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ROUTE_MESSAGES } from '../../core/constants/route-messages';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-content">
        <!-- Left: Page Title -->
        <div class="page-header">
          <h1 class="page-title">
            {{ currentTitle() }}
            @if (showName()) {
              <span class="user-name-title">{{ authService.currentUser()?.nombre }}</span>
            }
          </h1>
          <p class="page-subtitle">{{ currentSubtitle() }}</p>
        </div>

        <!-- Right: User Actions -->
        <div class="user-actions">
          <div class="user-profile" (click)="toggleDropdown()">
            <div class="avatar">
              {{ authService.currentUser()?.nombre?.charAt(0)?.toUpperCase() }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ authService.currentUser()?.nombre }}</span>
              @if (isAdmin()) {
                <span class="user-role admin">Admin</span>
              } @else {
                <span class="user-role">Usuario</span>
              }
            </div>
            <svg class="dropdown-arrow" [class.open]="showDropdown()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          <!-- Dropdown Menu -->
          @if (showDropdown()) {
            <div class="dropdown-menu">
              <a class="dropdown-item" (click)="navigateTo('/perfil')">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Mi Perfil
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout" (click)="logout()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          }
        </div>
      </div>
    </nav>

    <!-- Backdrop for dropdown -->
    @if (showDropdown()) {
      <div class="backdrop" (click)="closeDropdown()"></div>
    }
  `,
  styles: [`
    :host {
      --navbar-height: 80px;
    }

    .navbar {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      height: var(--navbar-height);
      background: white;
      border-bottom: 1px solid #e2e8f0;
      z-index: 900;
      display: flex;
      align-items: center;
      padding: 0 24px;
    }

    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 100%;
    }

    /* Page Header */
    .page-header {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-name-title {
      color: #22c55e;
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0;
    }

    /* User Actions */
    .user-actions {
      position: relative;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .user-profile:hover {
      background: #f1f5f9;
    }

    .avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
      font-weight: 600;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e293b;
    }

    .user-role {
      font-size: 0.75rem;
      color: #64748b;
    }

    .user-role.admin {
      color: #f59e0b;
      font-weight: 600;
    }

    .dropdown-arrow {
      color: #64748b;
      transition: transform 0.2s ease;
    }

    .dropdown-arrow.open {
      transform: rotate(180deg);
    }

    /* Dropdown Menu */
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
      min-width: 200px;
      padding: 8px;
      z-index: 1000;
      animation: slideDown 0.2s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 8px;
      color: #475569;
      text-decoration: none;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }

    .dropdown-item:hover {
      background: #f1f5f9;
      color: #3b82f6;
    }

    .dropdown-item.logout {
      color: #ef4444;
    }

    .dropdown-item.logout:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    .dropdown-divider {
      height: 1px;
      background: #e2e8f0;
      margin: 4px 0;
    }

    /* Backdrop */
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 899;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .navbar {
        padding: 0 16px;
      }

      .page-title {
        font-size: 1.25rem;
      }

      .user-info {
        display: none;
      }

      .dropdown-arrow {
        display: none;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {

  authService = inject(AuthService);
  private router = inject(Router);

  currentTitle = signal('');
  currentSubtitle = signal('');
  showName = signal(false);
  showDropdown = signal(false);

  isAdmin = computed(
    () => this.authService.currentUser()?.role === 'ROLE_ADMIN'
  );

  ngOnInit(): void {
    this.actualizarMensajes(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects ?? event.url;
        this.actualizarMensajes(url);
      });
  }

  private actualizarMensajes(url: string): void {
    const path = url.split('?')[0];
    const message = ROUTE_MESSAGES[path];

    if (message) {
      this.currentTitle.set(message.title ?? '');
      this.currentSubtitle.set(message.subtitle ?? '');
      this.showName.set(!!message.showName);
    } else {
      this.currentTitle.set('');
      this.currentSubtitle.set('');
      this.showName.set(false);
    }
  }

  toggleDropdown(): void {
    this.showDropdown.update(v => !v);
  }

  closeDropdown(): void {
    this.showDropdown.set(false);
  }

  navigateTo(path: string): void {
    this.closeDropdown();
    this.router.navigate([path]);
  }

  logout(): void {
    this.closeDropdown();
    this.authService.logout();
  }
}
