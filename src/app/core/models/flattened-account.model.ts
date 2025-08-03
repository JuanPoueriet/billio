import { Account } from "./account.model";

// Extendemos el modelo Account para añadir propiedades de UI
export interface FlattenedAccount extends Account {
    level: number;      // Nivel de anidación (0 para raíz)
    isExpanded: boolean; // Estado de expansión para la UI
    hasChildren?: any;
}