/**
 * =====================================================================================
 * ARCHIVO: app/core/models/account.model.ts
 * =====================================================================================
 * DESCRIPCIÓN:
 * Este archivo define los modelos de datos, interfaces y tipos enumerados para la
 * entidad "Cuenta Contable" (Account) en toda la aplicación. Ha sido expandido
 * para incluir todas las funcionalidades avanzadas requeridas para una gestión
 * de nivel empresarial del Plan de Cuentas (Chart of Accounts).
 * =====================================================================================
 */

// --- TIPOS ENUMERADOS (ENUM TYPES) ---
// Estos tipos estandarizan los valores posibles para los atributos de las cuentas,
// garantizando la consistencia de los datos en toda la aplicación.

/**
 * Define la clasificación principal de una cuenta según los estados financieros.
 * Estos son los 5 tipos fundamentales de la contabilidad.
 */
export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

/**
 * Define la naturaleza contable de una cuenta.
 * - DEBIT (Deudora): Aumenta con cargos en el debe. Típicamente Activos y Gastos.
 * - CREDIT (Acreedora): Aumenta con abonos en el haber. Típicamente Pasivos, Patrimonio e Ingresos.
 */
export type AccountNature = 'DEBIT' | 'CREDIT';

/**
 * Define las diferentes jerarquías o "vistas" del Plan de Cuentas.
 * Una misma cuenta puede tener diferentes padres o agrupaciones según la jerarquía.
 * - LEGAL: Para reportes oficiales y fiscales.
 * - MANAGEMENT: Para reportes de gestión interna y análisis de negocio.
 * - FISCAL: Para mapeos específicos a requerimientos tributarios.
 */
export type HierarchyType = 'LEGAL' | 'MANAGEMENT' | 'FISCAL';

/**
 * Define la categoría de una cuenta dentro del Estado de Flujo de Efectivo.
 */
export type CashFlowCategory = 'OPERATING' | 'INVESTING' | 'FINANCING' | 'NONE';

/**
 * Define las dimensiones de negocio que pueden ser requeridas al imputar una cuenta.
 * Por ejemplo, una cuenta de gastos podría requerir siempre un centro de costo.
 */
export type RequiredDimension = 'COST_CENTER' | 'PROJECT' | 'SEGMENT';

/**
 * Define los orígenes de los asientos contables que pueden ser bloqueados para una cuenta.
 * Por ejemplo, para prevenir asientos manuales en cuentas de control de sub-diarios.
 */
export type BlockedSource = 'MANUAL' | 'SUB_LEDGER_AR' | 'SUB_LEDGER_AP' | 'SUB_LEDGER_INV';

/**
 * Define los diferentes estándares contables (Generally Accepted Accounting Principles)
 * para mapeo entre planes de cuentas.
 */
export type GaapStandard = 'IFRS' | 'LOCAL_GAAP' | 'US_GAAP';


/**
 * =====================================================================================
 * INTERFAZ PRINCIPAL: Account
 * =====================================================================================
 * Esta es la estructura de datos completa para una cuenta contable.
 * Combina los campos originales con los nuevos atributos requeridos.
 * =====================================================================================
 */
export interface Account {

  // --- ATRIBUTOS FUNDAMENTALES (Existentes y Mantenidos) ---
  id: string;
  code: string;                      // Código de la cuenta (e.g., "1101-01"). Inmutable después del primer movimiento.
  name: string;                      // Nombre descriptivo (e.g., "Caja General").
  description?: string;              // Descripción detallada opcional sobre el uso de la cuenta.
  type: AccountType;                 // Clasificación principal: Activo, Pasivo, etc. Inmutable después del primer movimiento.
  parentId: string | null;           // ID de la cuenta padre para construir la jerarquía.
  isActive: boolean;                 // Indica si la cuenta puede ser usada en nuevas transacciones.
  isSystemAccount: boolean;          // (Existente) Indica si es una cuenta de sistema que no puede ser eliminada/modificada por el usuario.
  balance: number;                   // (Existente) Saldo actual de la cuenta. Podría ser un campo calculado.
  currency: string;                  // (Existente) Moneda principal de la cuenta (e.g., 'USD', 'DOP').
  organizationId: string;            // (Existente) ID de la organización a la que pertenece la cuenta.

  // --- NUEVO: VERSIONADO Y VIGENCIA ---
  version: number;                   // Versión del plan de cuentas a la que pertenece esta instancia (e.g., 1, 2, 3).
  lineageId: string;                 // ID único que agrupa todas las versiones de una misma cuenta a través del tiempo.
  effectiveFrom: string;             // Fecha de inicio de vigencia de esta versión de la cuenta (formato ISO "YYYY-MM-DDTHH:mm:ssZ").
  effectiveTo?: string | null;       // Fecha de fin de vigencia. Nulo significa que sigue vigente.

  // --- NUEVO: JERARQUÍAS Y NATURALEZA ---
  hierarchyType: HierarchyType;      // A qué jerarquía (Legal, Management, Fiscal) pertenece esta instancia de la cuenta.
  isPostable: boolean;               // `true`: es una cuenta imputable (permite asientos). `false`: es una cuenta sumaria/de agrupación (no permite asientos).
  nature: AccountNature;             // Naturaleza contable de la cuenta (DEBIT o CREDIT).
  level?: number;                    // Nivel de profundidad en la jerarquía (puede ser calculado en el frontend o venir del backend).

  // --- NUEVO: ATRIBUTOS Y MAPE_OS CONTABLES ---
  statementMapping?: {
    balanceSheetCategory?: string;   // Categoría en el Balance General (e.g., "Activos Corrientes").
    incomeStatementCategory?: string;// Categoría en el Estado de Resultados (e.g., "Gastos de Venta").
    cashFlowCategory?: CashFlowCategory; // Categoría para el Estado de Flujo de Efectivo.
  };
  taxMapping?: {
    [taxSystem: string]: { code: string; form: string; }; // Mapeo a códigos fiscales. e.g., { 'DGII_DO': { code: 'A01', form: 'IT-1' } }.
  };
  isFxRevaluation: boolean;          // Marcar como `true` si es una cuenta de ajuste por diferencia de cambio (CTA/FX).
  isRetainedEarnings: boolean;       // Marcar como `true` si es la cuenta de resultados acumulados/utilidades retenidas.
  isClosingAccount: boolean;         // Marcar como `true` si es la cuenta puente para el cierre de resultados del período.

  // --- NUEVO: FLAGS DE CONTROL ---
  requiresReconciliation: boolean;   // `true` si la cuenta debe incluirse en procesos de conciliación bancaria o de saldos.
  isCashOrBank: boolean;             // `true` si la cuenta representa efectivo o una cuenta bancaria.
  allowsIntercompany: boolean;       // `true` si la cuenta puede ser usada en transacciones entre compañías del mismo grupo.
  requiredDimensions?: RequiredDimension[]; // Lista de dimensiones de negocio que son obligatorias al imputar en esta cuenta.
  blockedSources?: BlockedSource[];  // Lista de orígenes de asientos que están bloqueados para esta cuenta.

  // --- NUEVO: MULTI-ENTIDAD Y MULTI-GAAP ---
  applicableCompanyIds: string[];    // Array de IDs de las compañías/entidades que tienen permiso para usar esta cuenta.
  gaapMapping?: { [key in GaapStandard]?: string }; // Mapeo a códigos de cuenta equivalentes en otros estándares contables.

  // --- AUDITORÍA (Campos existentes, mantenidos por consistencia) ---
  createdAt: string;                 // Fecha de creación del registro (formato ISO).
  updatedAt: string;                 // Fecha de la última modificación (formato ISO).
  createdBy?: string;                // (Nuevo/Opcional) ID o nombre del usuario que creó la cuenta.
  updatedBy?: string;                // (Nuevo/Opcional) ID o nombre del último usuario que modificó la cuenta.

  // --- PROPIEDADES PARA LA INTERFAZ DE USUARIO (UI) ---
  // Estas propiedades no necesariamente vienen del backend, pero son útiles para manejar el estado en el frontend.
  children?: Account[];              // (Existente) Array de cuentas hijas para construir la estructura de árbol.
}
