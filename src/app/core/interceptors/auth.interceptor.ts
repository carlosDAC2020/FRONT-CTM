import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor HTTP para autenticación JWT
 * 
 * Funcionalidades:
 * - Agrega el token JWT a todas las peticiones autenticadas
 * - Maneja errores 401 (no autorizado) redirigiendo al login
 * - Excluye endpoints públicos (login, register, token refresh)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // URLs que no requieren autenticación
  const publicEndpoints = ['/api/token/', '/api/users/register/', '/api/token/refresh/'];
  const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

  // Si es un endpoint público, continuar sin modificar
  if (isPublicEndpoint) {
    return next(req);
  }

  // Obtener token del localStorage
  const token = localStorage.getItem('access_token');

  // Si hay token, agregarlo a los headers
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Manejar errores de autenticación
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Token inválido o expirado, limpiar storage y redirigir a login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
