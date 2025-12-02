import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/user.model';
import { AuthValidators } from '../validators/auth.validators';
import { CommonValidators } from '../../../core/validators/common-validators';
import { NATIONALITIES } from '../../../core/constants/nationalities';
import { PerfilService } from '../../../core/services/perfil.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-wrapper">
        <!-- Left Side - Features -->
        <div class="register-sidebar">
          <div class="pattern-overlay"></div>
          <div class="sidebar-content">
            <div class="brand-header">
              <div class="brand-icon">🥗</div>
              <h2 class="brand-name">Nutritrack</h2>
            </div>
            
            <div class="sidebar-info">
              <h3 class="sidebar-title">¡Únete a Nutritrack!</h3>
              <p class="sidebar-description">
                Comienza tu transformación hacia una vida más saludable con la plataforma de nutrición más completa.
              </p>
            </div>
            
            <div class="features-list">
              <div class="feature-item">
                <div class="feature-icon">🥗</div>
                <span>Seguimiento detallado de nutrición</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🎯</div>
                <span>Metas personalizadas para tu estilo de vida</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📊</div>
                <span>Reportes y análisis de tu progreso</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">👥</div>
                <span>Comunidad de apoyo y motivación</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🔄</div>
                <span>Sincronización multiplataforma</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Form -->
        <div class="register-form-container">
          <div class="form-header">
            <h1>Crear Cuenta</h1>
            <p>Completa la información para comenzar tu viaje</p>
          </div>

          <!-- Stepper -->
          <div class="stepper">
            <div class="step-item">
              <div class="step-circle" [class.active]="currentStep() >= 1" [class.completed]="currentStep() > 1">
                1
              </div>
              <div class="step-line" [class.completed]="currentStep() > 1"></div>
            </div>
            <div class="step-item">
              <div class="step-circle" [class.active]="currentStep() >= 2" [class.completed]="currentStep() > 2">
                2
              </div>
              <div class="step-line" [class.completed]="currentStep() > 2"></div>
            </div>
            <div class="step-item">
              <div class="step-circle" [class.active]="currentStep() >= 3">
                3
              </div>
            </div>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <!-- Step 1: Información Básica -->
            @if (currentStep() === 1) {
              <div class="form-content">
                <div class="form-row">
                  <div class="form-group">
                    <label>
                      Nombre
                      <span class="required">*</span>
                    </label>
                    <input
                      type="text"
                      formControlName="nombre"
                      class="form-input"
                      placeholder="Tu nombre"
                      [class.error]="registerForm.get('nombre')?.invalid && registerForm.get('nombre')?.touched">
                    @if (registerForm.get('nombre')?.invalid && registerForm.get('nombre')?.touched) {
                      <span class="error-text">El nombre es requerido</span>
                    }
                  </div>
                  
                  <div class="form-group">
                    <label>
                      Apellido
                      <span class="required">*</span>
                    </label>
                    <input
                      type="text"
                      formControlName="apellido"
                      class="form-input"
                      placeholder="Tu apellido"
                      [class.error]="registerForm.get('apellido')?.invalid && registerForm.get('apellido')?.touched">
                    @if (registerForm.get('apellido')?.invalid && registerForm.get('apellido')?.touched) {
                      <span class="error-text">El apellido es requerido</span>
                    }
                  </div>
                </div>

                <div class="form-group full-width">
                  <label>
                    Correo Electrónico
                    <span class="required">*</span>
                  </label>
                  <input
                    type="email"
                    formControlName="email"
                    class="form-input"
                    placeholder="tu@email.com"
                    [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                  @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                    <span class="error-text">
                      @if (registerForm.get('email')?.errors?.['required']) {
                        El correo es requerido
                      } @else if (registerForm.get('email')?.errors?.['email']) {
                        Ingresa un correo válido
                      }
                    </span>
                  }
                </div>

                <div class="form-group full-width">
                  <label>
                    Contraseña
                    <span class="required">*</span>
                  </label>
                  <div class="password-wrapper">
                    <input
                      [type]="showPassword() ? 'text' : 'password'"
                      formControlName="password"
                      class="form-input"
                      placeholder="Mínimo 12 caracteres"
                      [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                    <button type="button" class="toggle-password" (click)="togglePassword()">
                      @if (showPassword()) {
                        👁️
                      } @else {
                        👁️‍🗨️
                      }
                    </button>
                  </div>
                  @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                    <span class="error-text">
                      @if (registerForm.get('password')?.errors?.['required']) {
                        La contraseña es requerida
                      } @else if (registerForm.get('password')?.errors?.['minlength']) {
                        La contraseña debe tener al menos 12 caracteres
                      } @else if (registerForm.get('password')?.errors?.['weakPassword']) {
                        La contraseña debe contener mayúsculas, minúsculas, números, símbolos (@ $ ! % * ? &)
                      }
                    </span>
                  }
                  @if (registerForm.errors?.['passwordContainsEmail'] && registerForm.get('password')?.touched) {
                    <span class="error-text">
                      La contraseña no debe contener tu email.
                    </span>
                  }
                </div>
              </div>
            }

            <!-- Step 2: Información Personal -->
            @if (currentStep() === 2) {
              <div class="form-content">
                <div class="form-group full-width">
                  <label>Teléfono (Opcional)</label>
                  <input
                    type="tel"
                    formControlName="phone"
                    class="form-input"
                    placeholder="+51 999 999 999"
                    [class.error]="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched">
                  @if (registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched) {
                    <span class="error-text">El teléfono debe tener 9 dígitos</span>
                  }
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>DNI (Opcional)</label>
                    <input
                      type="text"
                      formControlName="dni"
                      class="form-input"
                      placeholder="12345678"
                      [class.error]="registerForm.get('dni')?.invalid && registerForm.get('dni')?.touched">
                    @if (registerForm.get('dni')?.invalid && registerForm.get('dni')?.touched) {
                      <span class="error-text">El DNI debe tener 8 dígitos</span>
                    }
                  </div>

                  <div class="form-group">
                    <label>Fecha de Nacimiento</label>
                    <input
                      type="date"
                      formControlName="dateOfBirth"
                      class="form-input"
                      [class.error]="registerForm.get('dateOfBirth')?.invalid && registerForm.get('dateOfBirth')?.touched">
                    @if (registerForm.get('dateOfBirth')?.invalid && registerForm.get('dateOfBirth')?.touched) {
                      <span class="error-text">Debes ser mayor de 18 años</span>
                    }
                  </div>
                </div>

                <div class="form-group full-width">
                  <label>Nacionalidad</label>
                  <select formControlName="nationality" class="form-input">
                    <option value="">Selecciona tu nacionalidad</option>
                    @for (nationality of nationalities; track nationality) {
                      <option [value]="nationality">{{ nationality }}</option>
                    }
                  </select>
                </div>
              </div>
            }

            <!-- Step 3: Información Adicional -->
            @if (currentStep() === 3) {
              <div class="form-content">
                <div class="form-group full-width">
                  <label>Dirección (Opcional)</label>
                  <input
                    type="text"
                    formControlName="address"
                    class="form-input"
                    placeholder="Calle, número, distrito, ciudad">
                </div>

                <div class="form-group full-width">
                  <label>Ocupación (Opcional)</label>
                  <input
                    type="text"
                    formControlName="occupation"
                    class="form-input"
                    placeholder="Ingeniero, Contador, Estudiante, etc.">
                </div>

                <div class="info-box">
                  <span class="info-icon">ℹ️</span>
                  <p>Esta información nos ayuda a personalizar tu experiencia nutricional y establecer metas realistas.</p>
                </div>
              </div>
            }

            @if (errorMessage()) {
              <div class="alert-error">
                <span class="alert-icon">⚠️</span>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <!-- Navigation Buttons -->
            <div class="form-actions">
              @if (currentStep() > 1) {
                <button type="button" class="btn-secondary" (click)="previousStep()">
                  ← Anterior
                </button>
              }

              @if (currentStep() < 3) {
                <button type="button" class="btn-primary" (click)="nextStep()">
                  Continuar
                </button>
              }

              @if (currentStep() === 3) {
                <button type="submit" class="btn-primary" [disabled]="registerForm.invalid || loading()">
                  @if (loading()) {
                    <span class="spinner"></span>
                    <span>Creando cuenta...</span>
                  } @else {
                    <span>Crear Cuenta</span>
                  }
                </button>
              }
            </div>

            <div class="login-link">
              <span>¿Ya tienes una cuenta?</span>
              <a routerLink="/login">Iniciar sesión</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      padding: 100px 32px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .register-wrapper {
      width: 100%;
      max-width: 1000px;
      min-height: 700px;
      background: white;
      box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      display: grid;
      grid-template-columns: 460px 1fr;
      overflow: hidden;
    }

    /* Left Sidebar */
    .register-sidebar {
      background: linear-gradient(123deg, #28A745 0%, #20C997 100%);
      padding: 60px 40px;
      position: relative;
      overflow: hidden;
    }

    .pattern-overlay {
      position: absolute;
      top: -350px;
      left: -230px;
      width: 924px;
      height: 1404px;
      pointer-events: none;
    }

    .pattern-overlay::before,
    .pattern-overlay::after {
      content: '';
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }

    .pattern-overlay::before {
      width: 37px;
      height: 37px;
      top: 516px;
      left: 396px;
    }

    .pattern-overlay::after {
      width: 28px;
      height: 28px;
      top: 706px;
      left: 955px;
      background: rgba(255, 255, 255, 0.15);
    }

    .sidebar-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 30px;
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
      font-size: 16px;
      flex-shrink: 0;
    }

    /* Right Form Container */
    .register-form-container {
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-height: 900px;
      overflow-y: auto;
    }

    .form-header {
      text-align: center;
      margin-bottom: 24px;
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

    /* Stepper */
    .stepper {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 32px;
      gap: 0;
    }

    .step-item {
      display: flex;
      align-items: center;
    }

    .step-circle {
      width: 30px;
      height: 30px;
      background: #E9ECEF;
      color: #6C757D;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      position: relative;
      transition: all 0.3s ease;
    }

    .step-circle.active {
      background: #28A745;
      color: white;
    }

    .step-circle.completed {
      background: #28A745;
      color: white;
    }

    .step-line {
      width: 30px;
      height: 2px;
      background: #E9ECEF;
      transition: all 0.3s ease;
    }

    .step-line.completed {
      background: #28A745;
    }

    /* Form */
    .form-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    label {
      color: #333333;
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .required {
      color: #DC3545;
    }

    .form-input {
      width: 100%;
      padding: 14px 18px;
      background: #F8F9FA;
      border: 2px solid #E9ECEF;
      border-radius: 12px;
      font-size: 13px;
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
    }

    .error-text {
      color: #DC3545;
      font-size: 12px;
      font-weight: 500;
      margin-top: -4px;
    }

    .info-box {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: #E7F3FF;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #B3D9FF;
    }

    .info-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    .info-box p {
      margin: 0;
      color: #0056B3;
      font-size: 13px;
      line-height: 1.5;
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

    /* Buttons */
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .btn-primary {
      flex: 1;
      padding: 12px;
      background: linear-gradient(174deg, #28A745 0%, #20C997 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(40, 167, 69, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      flex: 1;
      padding: 12px;
      background: #E9ECEF;
      color: #495057;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: #DEE2E6;
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

    .login-link {
      text-align: center;
      margin-top: 20px;
      color: #6C757D;
      font-size: 13px;
    }

    .login-link a {
      color: #28A745;
      text-decoration: none;
      font-weight: 700;
      margin-left: 4px;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .register-wrapper {
        grid-template-columns: 1fr;
        max-width: 600px;
      }

      .register-sidebar {
        display: none;
      }

      .register-form-container {
        max-height: none;
      }
    }

    @media (max-width: 640px) {
      .register-container {
        padding: 40px 16px;
      }

      .register-form-container {
        padding: 32px 24px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-header h1 {
        font-size: 24px;
      }

      .brand-name {
        font-size: 28px;
      }

      .sidebar-title {
        font-size: 20px;
      }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private perfilService = inject(PerfilService)

  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  nationalities = NATIONALITIES;
  currentStep = signal(1);

  registerForm: FormGroup = this.fb.group({
    // Campos requeridos
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(12), AuthValidators.strongPassword()]],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    apellido: ['', [Validators.required, Validators.minLength(3)]],
    // Campos opcionales con validaciones
    phone: ['', [CommonValidators.phone(9)]],
    dni: ['', [AuthValidators.peruvianDNI()]],
    address: [''],
    dateOfBirth: ['', [CommonValidators.minAge(18)]],
    nationality: [''],
    occupation: ['']
  },
  {
    validators: [
      AuthValidators.passwordNotContainingEmail('email', 'password')
    ]
  }
);

  nextStep() {
    // Validar campos del paso actual antes de avanzar
    if (!this.validateCurrentStep()) {
      this.markStepFieldsAsTouched();
      return;
    }

    if (this.currentStep() < 3) {
      this.currentStep.set(this.currentStep() + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  validateCurrentStep(): boolean {
    const step = this.currentStep();

    if (step === 1) {
      // Paso 1: Validar nombre, apellido, email y password
      const nombre = this.registerForm.get('nombre');
      const apellido = this.registerForm.get('apellido');
      const email = this.registerForm.get('email');
      const password = this.registerForm.get('password');
      
      return (nombre?.valid ?? false) && 
             (apellido?.valid ?? false) && 
             (email?.valid ?? false) &&
             (password?.valid ?? false);
    } else if (step === 2) {
      // Paso 2: Validar teléfono y campos opcionales
      const phone = this.registerForm.get('phone');
      const dni = this.registerForm.get('dni');
      const dateOfBirth = this.registerForm.get('dateOfBirth');

      return (phone?.value === '' || (phone?.valid ?? true)) &&
             (dni?.value === '' || (dni?.valid ?? true)) &&
             (dateOfBirth?.value === '' || (dateOfBirth?.valid ?? true));
    }

    return true; // Paso 3 no tiene campos requeridos
  }

  markStepFieldsAsTouched() {
    const step = this.currentStep();

    if (step === 1) {
      this.registerForm.get('nombre')?.markAsTouched();
      this.registerForm.get('apellido')?.markAsTouched();
      this.registerForm.get('email')?.markAsTouched();
      this.registerForm.get('password')?.markAsTouched();
    } else if (step === 2) {
      this.registerForm.get('phone')?.markAsTouched();
      this.registerForm.get('dni')?.markAsTouched();
      this.registerForm.get('dateOfBirth')?.markAsTouched();
    }
  }

  previousStep() {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  togglePassword() {
    this.showPassword.update(value => !value);
  }

  onSubmit() {
  if (this.registerForm.valid) {
    this.loading.set(true);
    this.errorMessage.set('');

    const formData = this.registerForm.value;
    const registerData: RegisterRequest = {
      email: formData.email,
      password: formData.password,
      nombre: formData.nombre,
      apellido: formData.apellido,
      phone: formData.phone || undefined,
      dni: formData.dni || undefined,
      address: formData.address || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      nationality: formData.nationality || undefined,
      occupation: formData.occupation || undefined
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        
        // ⭐ AUTO-LOGIN
        this.authService.login({
          email: registerData.email,
          password: registerData.password
        }).subscribe(() => {
          
           // ⭐ Verificar si necesita onboarding
          this.perfilService.obtenerPerfilSalud().subscribe(perfil => {

            const p = perfil.data;

            const necesitaOnboarding =
              !p ||
              !p.objetivoActual ||
              !p.nivelActividadActual ||
              (p.etiquetas?.length ?? 0) === 0;

            if (necesitaOnboarding) {
              this.router.navigate(['/onboarding']);
            } else {
              this.router.navigate(['/dashboard']);
            }

          });

          this.loading.set(false);

        });

      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al registrar usuario.');
        this.loading.set(false);
      }
    });
  }
}

}