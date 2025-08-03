// src/app/core/models/account.model.ts

/**
 * @enum AccountType
 * @description Language-agnostic keys for GL account classification.
 * Claves agnósticas al idioma para la clasificación de cuentas contables.
 */
export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

/**
 * @enum AccountCategory
 * @description Language-agnostic keys for specific categories within each AccountType.
 * Claves agnósticas al idioma para categorías específicas dentro de cada AccountType.
 */
export enum AccountCategory {
  // Asset Categories / Categorías de Activo
  CURRENT_ASSET = 'CURRENT_ASSET',
  NON_CURRENT_ASSET = 'NON_CURRENT_ASSET',
  // Liability Categories / Categorías de Pasivo
  CURRENT_LIABILITY = 'CURRENT_LIABILITY',
  NON_CURRENT_LIABILITY = 'NON_CURRENT_LIABILITY',
  // Equity Categories / Categorías de Patrimonio
  OWNERS_EQUITY = 'OWNERS_EQUITY',
  RETAINED_EARNINGS = 'RETAINED_EARNINGS',
  // Revenue Categories / Categorías de Ingresos
  OPERATING_REVENUE = 'OPERATING_REVENUE',
  NON_OPERATING_REVENUE = 'NON_OPERATING_REVENUE',
  // Expense Categories / Categorías de Gastos
  OPERATING_EXPENSE = 'OPERATING_EXPENSE',
  NON_OPERATING_EXPENSE = 'NON_OPERATING_EXPENSE',
  COST_OF_GOODS_SOLD = 'COST_OF_GOODS_SOLD',
}

/**
 * @interface Account
 * @description Represents a single account in the Chart of Accounts. Matches the backend entity.
 * Representa una única cuenta en el Plan de Cuentas. Coincide con la entidad del backend.
 */
export interface Account {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: AccountType;
  category: AccountCategory;
  balance: number;
  isActive: boolean;
  isSystemAccount: boolean;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  parentId: string | null;
  children: Account[];
}

/**
 * @description DTO (Data Transfer Object) for creating a new account.
 * DTO para crear una nueva cuenta.
 */
export type CreateAccountDto = Omit<Account, 'id' | 'balance' | 'isActive' | 'isSystemAccount' | 'createdAt' | 'updatedAt' | 'organizationId' | 'children'>;

// --- Translation Mappings / Mapeo de Traducciones ---

// 1. Definir los idiomas soportados de forma explícita
export type Language = 'en' | 'es';

// 2. Crear un tipo para un mapa de traducciones que TypeScript pueda entender
export type TranslationMap = { [key in Language]: string };

// 3. Aplicar los tipos corregidos a los objetos de traducción
// export const AccountTypeTranslations: { [key in AccountType]: TranslationMap } = {
export const AccountTypeTranslations: any = {
  [AccountType.ASSET]: { en: 'Asset', es: 'Activo' },
  [AccountType.LIABILITY]: { en: 'Liability', es: 'Pasivo' },
  [AccountType.EQUITY]: { en: 'Equity', es: 'Patrimonio' },
  [AccountType.REVENUE]: { en: 'Revenue', es: 'Ingresos' },
  [AccountType.EXPENSE]: { en: 'Expense', es: 'Gastos' },
};

// export const AccountCategoryTranslations: { [key in AccountCategory]: TranslationMap } = {
export const AccountCategoryTranslations: any = {
  [AccountCategory.CURRENT_ASSET]: { en: 'Current Asset', es: 'Activo Corriente' },
  [AccountCategory.NON_CURRENT_ASSET]: { en: 'Non-Current Asset', es: 'Activo No Corriente' },
  [AccountCategory.CURRENT_LIABILITY]: { en: 'Current Liability', es: 'Pasivo Corriente' },
  [AccountCategory.NON_CURRENT_LIABILITY]: { en: 'Non-Current Liability', es: 'Pasivo No Corriente' },
  [AccountCategory.OWNERS_EQUITY]: { en: 'Owner\'s Equity', es: 'Patrimonio de Propietarios' },
  [AccountCategory.RETAINED_EARNINGS]: { en: 'Retained Earnings', es: 'Ganancias Retenidas' },
  [AccountCategory.OPERATING_REVENUE]: { en: 'Operating Revenue', es: 'Ingresos Operativos' },
  [AccountCategory.NON_OPERATING_REVENUE]: { en: 'Non-Operating Revenue', es: 'Ingresos No Operativos' },
  [AccountCategory.OPERATING_EXPENSE]: { en: 'Operating Expense', es: 'Gasto Operativo' },
  [AccountCategory.NON_OPERATING_EXPENSE]: { en: 'Non-Operating Expense', es: 'Gasto No Operativo' },
  [AccountCategory.COST_OF_GOODS_SOLD]: { en: 'Cost of Goods Sold', es: 'Costo de Bienes Vendidos' },
};
