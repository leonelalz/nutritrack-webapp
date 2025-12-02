import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

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

      console.error('Intercepted Error:', errorMessage);

      return throwError(() => ({
        status: error.status,
        message: errorMessage
      }));
    })
  );
};
