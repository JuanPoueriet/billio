// =============================================================================
// AUTH.GUARD.TS (GUARDIÁN DE RUTAS AUTENTICADAS)
// =============================================================================
// Descripción: Este es un guardián funcional de tipo 'CanActivateFn'.
// Su propósito es proteger las rutas principales de la aplicación (como el
// dashboard y todos los módulos de negocio) para que solo puedan ser accedidas
// por usuarios que han iniciado sesión.
// =============================================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth'; // Importamos nuestro servicio de autenticación

/**
 * Función guardiana que determina si una ruta puede ser activada.
 * @returns True si el usuario está autenticado, o una UrlTree para redirigir
 * al login si no lo está.
 */
export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  // --- INYECCIÓN DE DEPENDENCIAS MODERNA ---
  // Utilizamos 'inject' para obtener instancias de nuestros servicios
  // dentro de un contexto funcional.
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos el estado de autenticación utilizando la señal pública
  // de nuestro AuthService.
  if (authService.isAuthenticated()) {
    // Si el usuario está autenticado (la señal es 'true'), permitimos
    // el acceso a la ruta solicitada.
    return true;
  } else {
    // Si el usuario no está autenticado, creamos una 'UrlTree' para
    // redirigirlo a la página de login. Esta es la forma moderna y segura
    // de manejar redirecciones dentro de los guardianes de ruta.
    console.log('AuthGuard: Usuario no autenticado. Redirigiendo a /auth/login...');
    return router.createUrlTree(['/auth/login']);
  }
};
