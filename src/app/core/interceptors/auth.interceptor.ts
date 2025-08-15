// src/app/core/interceptors/auth.interceptor.ts
import {
    HttpInterceptorFn,
    HttpRequest,
    HttpHandlerFn,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    const authReq = req.clone({
        withCredentials: true
    });

    if (authReq.url.includes('/auth/refresh')) {
        console.log('[Interceptor] Enviando solicitud de refresh');
        console.log('[Interceptor] URL:', authReq.url);
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // --- CORRECCIÓN ---
            // Condiciones para intentar refrescar el token:
            // 1. El error es 401 (Unauthorized).
            // 2. La URL original NO era para el endpoint de refresh.
            // 3. La URL original NO era para el endpoint de login.
            const isUnauthorized = error.status === 401;
            const isNotRefreshRequest = !authReq.url.includes('/auth/refresh');
            const isNotLoginRequest = !authReq.url.includes('/auth/login');

            if (isUnauthorized && isNotRefreshRequest && isNotLoginRequest) {
            // --- FIN DE LA CORRECCIÓN ---
                console.log('[Interceptor] Intentando refrescar token...');
                return authService.refreshAccessToken().pipe(
                    switchMap(() => {
                        console.log('[Interceptor] Token refrescado, reintentando solicitud original');
                        // Reintenta la solicitud original. No es necesario clonarla de nuevo.
                        return next(authReq);
                    }),
                    catchError((refreshError) => {
                        console.error('[Interceptor] Error al refrescar token:', refreshError);
                        authService.logout(); // Si el refresh falla, desloguear.
                        return throwError(() => refreshError);
                    })
                );
            }
            // Para todos los demás errores, simplemente propaga el error.
            return throwError(() => error);
        })
    );
};