import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
 

      <div class="navbar-user">
        <div class="welcome-card">
          <div class="welcome-content">
            <h1>¡Hola, {{ authService.currentUser()?.nombre }}!</h1>
            <p>Aquí tienes tu resumen completo de salud y bienestar</p>
          </div>
          <div class="welcome-actions">
            <div class="user-profile">
              <div class="avatar">{{ authService.currentUser()?.nombre?.charAt(0) }}</div>
              <div class="user-info">
                <div class="user-name">{{ authService.currentUser()?.nombre }}</div>
                  @if (isAdmin()) {
                    <div class="user-plan">Admin</div>
                  } 
              </div>
            </div>
            <button (click)="logout()" class="btn-logout">Cerrar Sesión</button>
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


    .logo-icon {
      font-size: 2rem;
    }

    .navbar-brand a {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
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

    .quick-buttons {
      display: flex;
      gap: 10px;
    }

    .quick-btn {
      background: linear-gradient(159deg, #28A745 0%, #20C997 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .quick-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
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
export class NavbarComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }

  isAdmin = computed(() => this.authService.currentUser()?.role === 'ROLE_ADMIN');
}
