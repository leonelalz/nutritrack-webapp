import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // No agregar token en rutas de autenticación (login/registro)
  const isAuthRoute = req.url.includes('/auth/login') || req.url.includes('/auth/registro');
  
  // Si hay token Y NO es una ruta de autenticación, agregar Authorization header
  if (token && !isAuthRoute) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // Fix: usar el token real, no el string "token"
      }
    });
    
    console.log('🔐 Agregando token a la petición:', req.url);
    return next(clonedRequest);
  }

  console.log('🔓 Petición sin token:', req.url);
  return next(req);
};
