// src/app/auth/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Verificar si es un error 401 y no es una solicitud de refresh
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return authService.refreshAccessToken().pipe(
          switchMap(() => {
            // Reintentar la petición original después de refrescar
            return next(req);
          }),
          catchError((refreshError) => {
            // Manejar error en el refresco de token
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};