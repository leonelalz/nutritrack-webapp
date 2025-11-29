import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validadores específicos para el módulo de autenticación
 */
export class AuthValidators {

  // Validador para contraseñas que coinciden
  static passwordMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordField)?.value;
      const confirmPassword = formGroup.get(confirmPasswordField)?.value;

      if (!password || !confirmPassword) {
        return null;
      }

      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  // Validador para contraseña fuerte (requisitos de seguridad)
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(control.value);
      const hasLowerCase = /[a-z]/.test(control.value);
      const hasNumeric = /[0-9]/.test(control.value);
      const hasMinLength = control.value.length >= 8;
      const hasSymbol = /[@$!%*?&]/.test(control.value); // ← nuevo

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasMinLength && hasSymbol;

      return passwordValid ? null : {
        weakPassword: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric,
          hasMinLength,
          hasSymbol
        }
      };
    };
  }

  // Validador para DNI peruano específico del registro
  static peruvianDNI(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const dniPattern = /^\d{8}$/;
      return dniPattern.test(control.value) ? null : { invalidPeruvianDNI: true };
    };
  }

  static passwordNotContainingEmail(emailControlName: string, passwordControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {

      const email = formGroup.get(emailControlName)?.value;
      const password = formGroup.get(passwordControlName)?.value;

      if (!email || !password) {
        return null;
      }

      // Tomar parte antes del @
      const userPart = email.split("@")[0].toLowerCase();
      const passwordLower = password.toLowerCase();

      if (passwordLower.includes(userPart)) {
        return {
          passwordContainsEmail: {
            message: 'La contraseña no debe contener tu email',
            userPart
          }
        };
      }

      return null;
    };
  }
}