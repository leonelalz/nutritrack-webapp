import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Mensajes de 404 que son esperados y no deben loguearse como errores
const EXPECTED_404_MESSAGES = [
  'No hay rutina activa',
  'No hay plan activo',
  'No hay registro de rutina para hoy',
  'No hay registro de plan para hoy',
  'No tienes plan activo',
  'No tienes rutina activa'
];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error';

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        errorMessage = error.error?.message || error.message;

        if (error.status === 401) {
          authService.logout();
          router.navigate(['/login']);
        }

        if (error.status === 403) {
          router.navigate(['/']);
        }
      }

      // No loguear errores 404 esperados (como "No hay rutina activa")
      const isExpected404 = error.status === 404 && 
        EXPECTED_404_MESSAGES.some(msg => errorMessage.toLowerCase().includes(msg.toLowerCase()));
      
      if (!isExpected404) {
        console.error('Intercepted Error:', errorMessage);
      }

      return throwError(() => ({
        status: error.status,
        message: errorMessage
      }));
    })
  );
};
