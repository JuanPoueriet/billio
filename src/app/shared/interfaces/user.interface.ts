/**
 * Define la estructura de datos para un objeto de Usuario en la aplicación.
 * Esta interfaz debe coincidir con la entidad User del backend.
 */
export interface User {
  /**
   * Identificador único del usuario (UUID).
   */
  id: string;

  /**
   * Correo electrónico del usuario.
   */
  email: string;

  /**
   * Nombre del usuario.
   */
  firstName: string; // ✅ CORRECCIÓN: Se usa firstName

  /**
   * Apellido del usuario.
   */
  lastName: string; // ✅ CORRECCIÓN: Se usa lastName

  /**
   * Indica si la cuenta del usuario está activa.
   */
  isActive: boolean;

  /**
   * Lista de roles asignados al usuario.
   */
  roles: string[]; // En el backend se llama 'role', pero lo ajustamos en el payload del token.

  token: string; //
}