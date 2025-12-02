import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validadores específicos para los módulos de gestión (Etiquetas, Ingredientes, Ejercicios, Comidas)
 */
export class CrudValidators {

  /**
   * Valida que un valor numérico sea positivo (mayor a 0)
   */
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null; // Si está vacío, lo maneja el required
      }

      const value = Number(control.value);
      
      if (isNaN(value)) {
        return { invalidNumber: true };
      }

      return value > 0 ? null : { notPositive: { value: control.value } };
    };
  }

  /**
   * Valida que un valor numérico no sea negativo (mayor o igual a 0)
   */
  static nonNegativeNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null;
      }

      const value = Number(control.value);
      
      if (isNaN(value)) {
        return { invalidNumber: true };
      }

      return value >= 0 ? null : { negative: { value: control.value } };
    };
  }

  /**
   * Valida que un valor esté dentro de un rango específico
   */
  static range(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null;
      }

      const value = Number(control.value);
      
      if (isNaN(value)) {
        return { invalidNumber: true };
      }

      if (value < min) {
        return { min: { min, actual: value } };
      }

      if (value > max) {
        return { max: { max, actual: value } };
      }

      return null;
    };
  }

  /**
   * Valida que un texto tenga una longitud mínima (sin contar espacios)
   */
  static minLengthTrimmed(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const trimmedLength = control.value.toString().trim().length;
      
      return trimmedLength >= minLength 
        ? null 
        : { minLengthTrimmed: { requiredLength: minLength, actualLength: trimmedLength } };
    };
  }

  /**
   * Valida que un texto tenga una longitud máxima (sin contar espacios)
   */
  static maxLengthTrimmed(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const trimmedLength = control.value.toString().trim().length;
      
      return trimmedLength <= maxLength 
        ? null 
        : { maxLengthTrimmed: { requiredLength: maxLength, actualLength: trimmedLength } };
    };
  }

  /**
   * Valida que un texto no contenga solo espacios en blanco
   */
  static noWhitespaceOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const isWhitespace = control.value.toString().trim().length === 0;
      
      return isWhitespace ? { whitespaceOnly: true } : null;
    };
  }

  /**
   * Valida formato de categoría/tipo personalizado (MAYUSCULAS_CON_GUIONES_BAJOS)
   */
  static customTypeFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const pattern = /^[A-Z][A-Z0-9_]*$/;
      const isValid = pattern.test(control.value);
      
      return isValid ? null : { invalidCustomType: true };
    };
  }

  /**
   * Valida que al menos un elemento de un array esté seleccionado
   */
  static minArrayLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !Array.isArray(control.value)) {
        return null;
      }

      return control.value.length >= minLength 
        ? null 
        : { minArrayLength: { requiredLength: minLength, actualLength: control.value.length } };
    };
  }

  /**
   * Valida valores nutricionales (para ingredientes)
   * Los valores deben sumar coherentemente en términos de energía
   */
  static nutritionalValuesCoherent(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control;
      
      if (!group) return null;

      const proteinas = group.get('proteinas')?.value || 0;
      const carbohidratos = group.get('carbohidratos')?.value || 0;
      const grasas = group.get('grasas')?.value || 0;
      const energia = group.get('energia')?.value || 0;

      // Valores calóricos aproximados por gramo
      const caloriasCalculadas = (proteinas * 4) + (carbohidratos * 4) + (grasas * 9);
      
      // Permitir un margen de error del 15%
      const margenError = 0.15;
      const diferencia = Math.abs(caloriasCalculadas - energia);
      const porcentajeDiferencia = diferencia / Math.max(caloriasCalculadas, energia);

      if (porcentajeDiferencia > margenError && energia > 0) {
        return { 
          incoherentNutrition: { 
            calculated: Math.round(caloriasCalculadas), 
            provided: energia 
          } 
        };
      }

      return null;
    };
  }

  /**
   * Valida que la suma de macronutrientes no exceda 100g por 100g de alimento
   */
  static macrosNotExceed100g(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control;
      
      if (!group) return null;

      const proteinas = group.get('proteinas')?.value || 0;
      const carbohidratos = group.get('carbohidratos')?.value || 0;
      const grasas = group.get('grasas')?.value || 0;
      const fibra = group.get('fibra')?.value || 0;

      const suma = proteinas + carbohidratos + grasas + fibra;

      return suma <= 100 
        ? null 
        : { macrosExceed100: { total: suma } };
    };
  }

  /**
   * Valida que un nombre no contenga caracteres especiales peligrosos
   */
  static safeString(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      // Permite letras, números, espacios, tildes, ñ, guiones y paréntesis
      const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-(),.]+$/;
      const isValid = pattern.test(control.value);
      
      return isValid ? null : { unsafeCharacters: true };
    };
  }

  /**
   * Valida duración de ejercicio (entre 1 y 480 minutos = 8 horas)
   */
  static exerciseDuration(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null;
      }

      const value = Number(control.value);
      
      if (isNaN(value)) {
        return { invalidNumber: true };
      }

      if (value < 1) {
        return { minDuration: { min: 1, actual: value } };
      }

      if (value > 480) {
        return { maxDuration: { max: 480, actual: value } };
      }

      return null;
    };
  }

  /**
   * Valida calorías quemadas por minuto (entre 0.1 y 50)
   */
  static caloriesBurnedPerMinute(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null;
      }

      const value = Number(control.value);
      
      if (isNaN(value)) {
        return { invalidNumber: true };
      }

      if (value < 0.1) {
        return { minCalories: { min: 0.1, actual: value } };
      }

      if (value > 50) {
        return { maxCalories: { max: 50, actual: value } };
      }

      return null;
    };
  }
}

/**
 * Mensajes de error legibles para mostrar al usuario
 */
export const VALIDATION_MESSAGES = {
  required: 'Este campo es obligatorio',
  email: 'Ingresa un correo electrónico válido',
  minlength: 'Debe tener al menos {requiredLength} caracteres',
  maxlength: 'No puede exceder {requiredLength} caracteres',
  
  // Validadores personalizados
  invalidNumber: 'Ingresa un número válido',
  notPositive: 'El valor debe ser mayor a 0',
  negative: 'El valor no puede ser negativo',
  min: 'El valor mínimo es {min}',
  max: 'El valor máximo es {max}',
  minLengthTrimmed: 'Debe tener al menos {requiredLength} caracteres (sin contar espacios)',
  maxLengthTrimmed: 'No puede exceder {requiredLength} caracteres (sin contar espacios)',
  whitespaceOnly: 'No puede contener solo espacios en blanco',
  invalidCustomType: 'Debe estar en formato MAYUSCULAS_CON_GUIONES_BAJOS',
  minArrayLength: 'Debes seleccionar al menos {requiredLength} elemento(s)',
  incoherentNutrition: 'Los valores nutricionales no son coherentes (calculado: {calculated} kcal, ingresado: {provided} kcal)',
  macrosExceed100: 'La suma de macronutrientes ({total}g) excede los 100g por porción',
  unsafeCharacters: 'Contiene caracteres no permitidos',
  minDuration: 'La duración mínima es {min} minuto(s)',
  maxDuration: 'La duración máxima es {max} minutos',
  minCalories: 'El valor mínimo es {min} kcal/min',
  maxCalories: 'El valor máximo es {max} kcal/min'
};

/**
 * Función helper para obtener mensajes de error formateados
 */
export function getErrorMessage(errors: ValidationErrors | null, fieldName: string = 'Este campo'): string {
  if (!errors) return '';

  const errorKey = Object.keys(errors)[0];
  let message = VALIDATION_MESSAGES[errorKey as keyof typeof VALIDATION_MESSAGES] || 'Error de validación';

  // Reemplazar placeholders con valores reales
  if (errors[errorKey]) {
    Object.keys(errors[errorKey]).forEach(key => {
      message = message.replace(`{${key}}`, errors[errorKey][key]);
    });
  }

  return message;
}