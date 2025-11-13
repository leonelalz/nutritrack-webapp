import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-wrapper">
        <!-- Left Side - Features -->
        <div class="login-sidebar">
          <div class="pattern-overlay"></div>
          <div class="sidebar-content">
            <div class="brand-header">
              <div class="brand-icon">🥗</div>
              <h2 class="brand-name">Nutritrack</h2>
            </div>
            
            <div class="sidebar-info">
              <h3 class="sidebar-title">¡Bienvenido de vuelta!</h3>
              <p class="sidebar-description">
                Continúa tu viaje hacia una vida más saludable con el seguimiento nutricional más completo.
              </p>
            </div>
            
            <div class="features-list">
              <div class="feature-item">
                <div class="feature-icon">✓</div>
                <span>Seguimiento completo de calorías y nutrientes</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">✓</div>
                <span>Análisis personalizado de tu progreso</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">✓</div>
                <span>Base de datos con miles de alimentos</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">✓</div>
                <span>Reportes detallados y metas personalizadas</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">✓</div>
                <span>Sincronización en todos tus dispositivos</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Form -->
        <div class="login-form-container">
          <div class="form-header">
            <h1>Iniciar Sesión</h1>
            <p>Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-content">
              <div class="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  formControlName="email"
                  class="form-input"
                  [class.focused]="emailFocused()"
                  [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  placeholder="tu@email.com"
                  (focus)="emailFocused.set(true)"
                  (blur)="emailFocused.set(false)">
                @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                  <span class="error-text">
                    @if (loginForm.get('email')?.errors?.['required']) {
                      El correo es requerido
                    } @else if (loginForm.get('email')?.errors?.['email']) {
                      Ingresa un correo válido
                    }
                  </span>
                }
              </div>

              <div class="form-group">
                <label>Contraseña</label>
                <div class="password-wrapper">
                  <input
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    class="form-input"
                    [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    placeholder="Tu contraseña">
                  <button type="button" class="toggle-password" (click)="togglePassword()">
                    @if (showPassword()) {
                      👁️
                    } @else {
                      👁️‍🗨️
                    }
                  </button>
                </div>
                @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                  <span class="error-text">La contraseña es requerida</span>
                }
              </div>

              <div class="form-options">
                <label class="remember-me">
                  <input type="checkbox" formControlName="rememberMe">
                  <span>Recordarme</span>
                </label>
                <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
              </div>
            </div>

            @if (errorMessage()) {
              <div class="alert-error">
                <span class="alert-icon">⚠️</span>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <button type="submit" class="btn-primary" [disabled]="loginForm.invalid || loading()">
              @if (loading()) {
                <span class="spinner"></span>
                <span>Ingresando...</span>
              } @else {
                <span>Iniciar Sesión</span>
              }
            </button>

            <div class="register-link">
              <span>¿No tienes una cuenta?</span>
              <a routerLink="/register">Regístrate aquí</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      padding: 100px 32px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .login-wrapper {
      width: 100%;
      max-width: 900px;
      min-height: 600px;
      background: white;
      box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      overflow: hidden;
    }

    /* Left Sidebar */
    .login-sidebar {
      background: linear-gradient(123deg, #28A745 0%, #20C997 100%);
      padding: 60px 40px;
      position: relative;
      overflow: hidden;
    }

    .pattern-overlay {
      position: absolute;
      top: -347px;
      left: -225px;
      width: 900px;
      height: 1388px;
      pointer-events: none;
    }

    .pattern-overlay::before,
    .pattern-overlay::after {
      content: '';
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
    }

    .pattern-overlay::before {
      width: 36px;
      height: 36px;
      top: 509px;
      left: 387px;
    }

    .pattern-overlay::after {
      width: 27px;
      height: 27px;
      top: 693px;
      left: 931px;
      background: rgba(255, 255, 255, 0.15);
    }

    .sidebar-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .brand-header {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .brand-icon {
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
    }

    .brand-name {
      color: white;
      font-size: 36px;
      font-weight: 700;
      margin: 0;
    }

    .sidebar-info {
      margin-top: 20px;
    }

    .sidebar-title {
      color: white;
      font-size: 24px;
      font-weight: 700;
      line-height: 1.3;
      margin: 0 0 16px 0;
    }

    .sidebar-description {
      color: white;
      font-size: 16px;
      line-height: 1.5;
      opacity: 0.9;
      margin: 0;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-top: 40px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
      font-size: 14px;
    }

    .feature-icon {
      width: 24px;
      height: 24px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
    }

    /* Right Form Container */
    .login-form-container {
      padding: 60px 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .form-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .form-header h1 {
      color: #333333;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }

    .form-header p {
      color: #6C757D;
      font-size: 14px;
      margin: 0;
    }

    /* Form */
    .form-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      color: #333333;
      font-size: 14px;
      font-weight: 700;
    }

    .form-input {
      width: 100%;
      padding: 16px 18px;
      background: #F8F9FA;
      border: 2px solid #E9ECEF;
      border-radius: 12px;
      font-size: 15px;
      color: #333333;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .form-input::placeholder {
      color: #757575;
    }

    .form-input:focus {
      outline: none;
      border-color: #28A745;
      background: white;
      box-shadow: 0px 0px 0px 3px rgba(40, 167, 69, 0.1);
    }

    .form-input.focused {
      border-color: #28A745;
      background: white;
      box-shadow: 0px 0px 0px 3px rgba(40, 167, 69, 0.1);
    }

    .form-input.error {
      border-color: #DC3545;
    }

    .password-wrapper {
      position: relative;
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      padding: 4px;
      color: #6C757D;
    }

    .error-text {
      color: #DC3545;
      font-size: 12px;
      font-weight: 500;
      margin-top: -4px;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: #333333;
      font-size: 14px;
      font-weight: 400;
    }

    .remember-me input[type="checkbox"] {
      width: 13px;
      height: 13px;
      border: 1px solid #767676;
      border-radius: 2.5px;
      cursor: pointer;
    }

    .forgot-password {
      color: #28A745;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .forgot-password:hover {
      color: #20C997;
      text-decoration: underline;
    }

    .alert-error {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      background: #FFE5E8;
      border: 1px solid #FFCCD3;
      border-radius: 12px;
      color: #DC3545;
      font-size: 13px;
      margin-bottom: 20px;
    }

    .alert-icon {
      font-size: 20px;
    }

    /* Button */
    .btn-primary {
      width: 100%;
      padding: 14px;
      background: linear-gradient(173deg, #28A745 0%, #20C997 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 24px;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(40, 167, 69, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid white;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .register-link {
      text-align: center;
      color: #6C757D;
      font-size: 14px;
    }

    .register-link a {
      color: #28A745;
      text-decoration: none;
      font-weight: 700;
      margin-left: 4px;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .login-wrapper {
        grid-template-columns: 1fr;
        max-width: 500px;
      }

      .login-sidebar {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .login-container {
        padding: 40px 16px;
      }

      .login-form-container {
        padding: 40px 24px;
      }

      .form-header h1 {
        font-size: 24px;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  emailFocused = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  togglePassword() {
    this.showPassword.update(value => !value);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      const credentials: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage.set('Credenciales incorrectas. Por favor, verifica tus datos.');
          this.loading.set(false);
        }
      });
    }
  }
}