export interface SidebarSubItem {
  path: string;
  translationKey: string;
}

export interface SidebarItem {
  path?: string; // Optional if it's just a group title
  translationKey: string;
  icon: string;
  isExpanded?: boolean; // To handle the state
  subItems?: SidebarSubItem[];
}

export interface SidebarGroup {
  groupTranslationKey: string;
  items: SidebarItem[];
}

export const SIDEBAR_MENU: SidebarGroup[] = [
  {
    groupTranslationKey: 'sidebar.groups.general',
    items: [
      {
        path: '/app/dashboard',
        translationKey: 'sidebar.general.dashboard',
        icon: 'home',
      },
      {
        path: '/app/my-work',
        translationKey: 'sidebar.general.my_work',
        icon: 'assignment_ind',
      },
      {
        path: '/app/notifications',
        translationKey: 'sidebar.general.notifications',
        icon: 'notifications',
      },
      {
        path: '/app/global-search',
        translationKey: 'sidebar.general.search',
        icon: 'search',
      },
    ],
  },
  {
    groupTranslationKey: 'sidebar.groups.finance',
    items: [
      {
        translationKey: 'sidebar.finance.gl',
        icon: 'account_balance',
        isExpanded: false,
        subItems: [
          { path: '/app/accounting/journal-entries', translationKey: 'sidebar.finance.gl_sub.journal' },
          { path: '/app/accounting/chart-of-accounts', translationKey: 'sidebar.finance.gl_sub.coa' },
          { path: '/app/accounting/periods', translationKey: 'sidebar.finance.gl_sub.periods' },
          { path: '/app/accounting/closing', translationKey: 'sidebar.finance.gl_sub.closing' },
          { path: '/app/accounting/reconciliation-gl', translationKey: 'sidebar.finance.gl_sub.reconciliation' },
        ],
      },
      {
        translationKey: 'sidebar.finance.treasury',
        icon: 'monetization_on',
        isExpanded: false,
        subItems: [
          { path: '/app/treasury/dashboard', translationKey: 'sidebar.finance.treasury_sub.dashboard' },
          { path: '/app/treasury/bank-accounts', translationKey: 'sidebar.finance.treasury_sub.accounts' },
          { path: '/app/treasury/reconciliation', translationKey: 'sidebar.finance.treasury_sub.reconciliation' },
          { path: '/app/treasury/cash-flow', translationKey: 'sidebar.finance.treasury_sub.cash_flow' },
          { path: '/app/treasury/payment-batches', translationKey: 'sidebar.finance.treasury_sub.payments' },
        ],
      },
       {
        translationKey: 'sidebar.finance.ar',
        icon: 'request_quote',
        isExpanded: false,
        subItems: [
          { path: '/app/ar/dashboard', translationKey: 'sidebar.finance.ar_sub.dashboard' },
          { path: '/app/ar/invoices', translationKey: 'sidebar.finance.ar_sub.invoices' },
          { path: '/app/ar/receipts', translationKey: 'sidebar.finance.ar_sub.receipts' },
          { path: '/app/ar/customer-statements', translationKey: 'sidebar.finance.ar_sub.statements' },
        ],
      },
      {
        translationKey: 'sidebar.finance.ap',
        icon: 'receipt_long',
        isExpanded: false,
        subItems: [
          { path: '/app/ap/dashboard', translationKey: 'sidebar.finance.ap_sub.dashboard' },
          { path: '/app/ap/invoices', translationKey: 'sidebar.finance.ap_sub.invoices' },
          { path: '/app/ap/payments', translationKey: 'sidebar.finance.ap_sub.payments' },
        ],
      },
      {
        translationKey: 'sidebar.finance.fixed_assets',
        icon: 'domain',
        isExpanded: false,
        subItems: [
          { path: '/app/fixed-assets/list', translationKey: 'sidebar.finance.fa_sub.list' },
          { path: '/app/fixed-assets/depreciation', translationKey: 'sidebar.finance.fa_sub.depreciation' },
        ],
      },
    ],
  },
  {
    groupTranslationKey: 'sidebar.groups.operations',
    items: [
       {
        translationKey: 'sidebar.operations.sales',
        icon: 'storefront',
        isExpanded: false,
        subItems: [
          { path: '/app/sales/quotes', translationKey: 'sidebar.operations.sales_sub.quotes' },
          { path: '/app/sales/orders', translationKey: 'sidebar.operations.sales_sub.orders' },
          { path: '/app/sales/contracts', translationKey: 'sidebar.operations.sales_sub.contracts' },
        ],
      },
      {
        translationKey: 'sidebar.operations.purchasing',
        icon: 'shopping_cart',
        isExpanded: false,
        subItems: [
          { path: '/app/purchasing/requisitions', translationKey: 'sidebar.operations.purchasing_sub.requisitions' },
          { path: '/app/purchasing/orders', translationKey: 'sidebar.operations.purchasing_sub.orders' },
          { path: '/app/purchasing/invoice-matching', translationKey: 'sidebar.operations.purchasing_sub.matching' },
        ],
      },
      {
        translationKey: 'sidebar.operations.inventory',
        icon: 'inventory_2',
        isExpanded: false,
        subItems: [
          { path: '/app/inventory/dashboard', translationKey: 'sidebar.operations.inventory_sub.dashboard' },
          { path: '/app/inventory/stock-levels', translationKey: 'sidebar.operations.inventory_sub.stock' },
          { path: '/app/inventory/movements', translationKey: 'sidebar.operations.inventory_sub.movements' },
          { path: '/app/inventory/adjustments', translationKey: 'sidebar.operations.inventory_sub.adjustments' },
        ],
      },
      {
        translationKey: 'sidebar.operations.manufacturing',
        icon: 'precision_manufacturing',
        isExpanded: false,
        subItems: [
          { path: '/app/manufacturing/orders', translationKey: 'sidebar.operations.manufacturing_sub.orders' },
          { path: '/app/manufacturing/mrp', translationKey: 'sidebar.operations.manufacturing_sub.mrp' },
          { path: '/app/manufacturing/costing', translationKey: 'sidebar.operations.manufacturing_sub.costing' },
        ],
      },
    ]
  },
  {
    groupTranslationKey: 'sidebar.groups.master_data',
    items: [
      {
        path: '/app/masters/customers',
        translationKey: 'sidebar.master_data.customers',
        icon: 'people',
      },
      {
        path: '/app/masters/suppliers',
        translationKey: 'sidebar.master_data.suppliers',
        icon: 'local_shipping',
      },
      {
        path: '/app/masters/products',
        translationKey: 'sidebar.master_data.products',
        icon: 'inventory',
      },
    ],
  },
  {
    groupTranslationKey: 'sidebar.groups.reports',
    items: [
       {
        translationKey: 'sidebar.reports.reporting',
        icon: 'assessment',
        isExpanded: false,
        subItems: [
          { path: '/app/reports/financial', translationKey: 'sidebar.reports.reporting_sub.financial' },
          { path: '/app/reports/sales', translationKey: 'sidebar.reports.reporting_sub.sales' },
          { path: '/app/reports/audit', translationKey: 'sidebar.reports.reporting_sub.audit' },
        ],
      },
      {
        translationKey: 'sidebar.reports.bi',
        icon: 'monitoring',
        isExpanded: false,
        subItems: [
          { path: '/app/bi/dashboards', translationKey: 'sidebar.reports.bi_sub.dashboards' },
          { path: '/app/bi/kpis', translationKey: 'sidebar.reports.bi_sub.kpis' },
        ],
      },
    ]
  },
   {
    groupTranslationKey: 'sidebar.groups.configuration',
    items: [
      {
        path: '/app/settings/system',
        translationKey: 'sidebar.configuration.system',
        icon: 'tune',
      },
      {
        path: '/app/settings/security',
        translationKey: 'sidebar.configuration.security',
        icon: 'security',
      },
      {
        path: '/app/settings/integrations',
        translationKey: 'sidebar.configuration.integrations',
        icon: 'hub',
      },
    ],
  },
];