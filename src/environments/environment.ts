// =============================================================================
// VARIABLES DE ENTORNO (DESARROLLO)
// =============================================================================
// Descripción: Este archivo contiene la configuración que se usará cuando
// ejecutes la aplicación en modo de desarrollo (ej. con 'ng serve').
// =============================================================================

export const environment = {
  // production: false
  // Esta bandera le indica a Angular que no estamos en un entorno de producción,
  // por lo que puede habilitar funcionalidades de ayuda para el desarrollo.
  production: false,

  // apiUrl: string
  // La URL completa de tu backend de NestJS.
  // Es la que configuramos en los pasos anteriores (puerto 3000 y prefijo /api/v1).
  apiUrl: 'http://localhost:3000/api/v1',
};