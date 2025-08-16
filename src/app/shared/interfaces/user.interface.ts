/**
 * Representa la estructura de un usuario en la aplicación.
 * Esta interfaz debe mantenerse alineada con la entidad `User` del backend.
 */
export interface User {
  /** Identificador único del usuario (UUID). */
  id: string;

  /** Correo electrónico del usuario. */
  email: string;

  /** Nombre del usuario. */
  firstName: string;

  /** Apellido del usuario. */
  lastName: string;

  /** Indica si la cuenta del usuario está activa. */
  isActive: boolean;

  /**
   * Lista de roles asignados al usuario.
   * Ejemplo: ["admin", "editor"]
   */
  roles: string[];

  /**
   * Lista de permisos calculados del usuario.
   * El backend los añade al payload del JWT a partir de los roles.
   * Ejemplo: ["users.create", "users.delete"]
   */
  permissions: string[];

  /** Token de acceso JWT del usuario. */
  token: string;
}
