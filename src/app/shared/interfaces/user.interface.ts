// src/app/shared/interfaces/user.interface.ts

import { Role } from "../../core/api/roles.service";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  status: 'pending' | 'active' | 'inactive'; // <--- CORRECCIÓN: Añadir la propiedad 'status'
  role?: Role; // <--- CORRECCIÓN: Definir la propiedad 'role' correctamente
  organizationId: string;
  roleId?: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: string[];
  roles: Role[]; // Asegurarse de que esta propiedad exista si se usa
  

}