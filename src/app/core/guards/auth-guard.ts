// src/app/core/guards/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario ya está en memoria, permite el acceso inmediatamente.
  if (authService.isAuthenticated()) {
    return of(true);
  }

  // Si no, llama al backend y espera la respuesta.
  return authService.checkAuthStatus().pipe(
    map(isAuthenticated => {
      // Si el backend dice que está autenticado, permite el acceso.
      if (isAuthenticated) {
        return true;
      }
      // Si no, crea el UrlTree para redirigir.
      return router.createUrlTree(['/auth/login']);
    }),
    catchError(() => {
      // Si la llamada HTTP falla (ej. 401 Unauthorized), redirige a login.
      return of(router.createUrlTree(['/auth/login']));
    })
  );
};