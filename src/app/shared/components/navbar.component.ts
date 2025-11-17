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
      <div class="navbar-user">
        <div class="welcome-card">
          <div class="welcome-content">
            <h1>
              {{ currentTitle() }}
              @if (showName()) {
                <span>{{ authService.currentUser()?.nombre }}</span>
              }
            </h1>
            <p>{{ currentSubtitle() }}</p>
          </div>
          <div class="welcome-actions">
            <div class="user-profile">
              <div class="avatar">
                {{ authService.currentUser()?.nombre?.charAt(0) }}
              </div>
              <div class="user-info">
                <div class="user-name">
                  {{ authService.currentUser()?.nombre }}
                </div>
                @if (isAdmin()) {
                  <div class="user-plan">Admin</div>
                }
              </div>
            </div>
            <button (click)="logout()" class="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      margin-top: 60px;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: white;
      padding: 0px 30px;
    }

    .navbar-user {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
    }

    .welcome-card {
      width: 100%;
      background: white;
      border-radius: 16px;
      padding: 25px 30px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
      justify-content: space-between;
      display: flex;
      align-items: center;
    }

    .welcome-content h1 {
      color: #333333;
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 5px 0;
    }

    .welcome-content p {
      color: #6C757D;
      font-size: 14px;
      margin: 0;
    }

    .welcome-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #28A745 0%, #20C997 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      font-weight: 700;
    }

    .user-name {
      color: #333333;
      font-size: 14px;
      font-weight: 700;
    }

    .user-plan {
      color: #6C757D;
      font-size: 12px;
    }

    .btn-logout {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
    }

    .btn-logout:hover {
      background: white;
      color: #f5576c;
    }
  `]
})
export class NavbarComponent implements OnInit {

  authService = inject(AuthService);
  private router = inject(Router);

  currentTitle = signal('');
  currentSubtitle = signal('');
  showName = signal(false);

  // señal derivada para admin
  isAdmin = computed(
    () => this.authService.currentUser()?.role === 'ROLE_ADMIN'
  );

  ngOnInit(): void {
    // 1) Ejecutar una vez al inicio
    this.actualizarMensajes(this.router.url);

    // 2) Escuchar solo cuando termina la navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects ?? event.url;
        this.actualizarMensajes(url);
      });
  }

  private actualizarMensajes(url: string): void {
    const path = url.split('?')[0];

    console.log('Navbar URL:', url);
    console.log('Navbar PATH:', path);
    console.log('ROUTE_MESSAGES keys:', Object.keys(ROUTE_MESSAGES));
    console.log('Mensaje para path:', ROUTE_MESSAGES[path]);

    const message = ROUTE_MESSAGES[path];

    if (message) {
      this.currentTitle.set(message.title ?? '');
      this.currentSubtitle.set(message.subtitle ?? '');
      this.showName.set(!!message.showName);
    } else {
      // Opcional: valores por defecto si no hay match
      this.currentTitle.set('');
      this.currentSubtitle.set('');
      this.showName.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
