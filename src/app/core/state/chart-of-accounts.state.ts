import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
// import { ChartOfAccountsService } from '../../../core/services/chart-of-accounts';
// import { Account, AccountType, AccountTypeTranslations } from '../../../core/models/account.model';
// import { FlattenedAccount } from '../../../core/models/flattened-account.model';
import { Subject, takeUntil } from 'rxjs';
import { ChartOfAccountsService } from '../services/chart-of-accounts';
import { Account, AccountType, AccountTypeTranslations } from '../models/account.model';
import { FlattenedAccount } from '../models/flattened-account.model';

@Injectable({
  providedIn: 'root'
})
export class ChartOfAccountsStateService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private chartOfAccountsService = inject(ChartOfAccountsService);
  
  // Estado centralizado
  public accounts = signal<Account[]>([]);
  public loading = signal(true);
  public error = signal<string | null>(null);
  public expandedIds = signal<Set<string>>(new Set());
  public searchQuery = signal('');
  public selectedType = signal<AccountType | 'all'>('all');

  // Traducciones
  public accountTypeTranslations = AccountTypeTranslations;
  public accountTypes = Object.values(AccountType);

  // Computed: Cuentas aplanadas con filtros aplicados
  public displayAccounts = computed<FlattenedAccount[]>(() => {
    const query = this.searchQuery().toLowerCase();
    const type = this.selectedType();
    const expanded = this.expandedIds();
    const accounts = this.accounts();

    const buildAndFilter = (accounts: Account[], level: number): FlattenedAccount[] => {
      let result: FlattenedAccount[] = [];

      for (const account of accounts) {
        const isExpanded = expanded.has(account.id);
        const children = account.children || [];
        const visibleChildren = buildAndFilter(children, level + 1);

        const selfMatches = 
          (type === 'all' || account.type === type) &&
          (query === '' || 
           account.name.toLowerCase().includes(query) || 
           account.code.toLowerCase().includes(query));

        if (selfMatches || visibleChildren.length > 0) {
          result.push({ 
            ...account, 
            level, 
            isExpanded,
            hasChildren: children.length > 0
          });
          
          if (isExpanded && visibleChildren.length > 0) {
            result = result.concat(visibleChildren);
          }
        }
      }
      
      return result;
    };

    return buildAndFilter(accounts, 0);
  });

  constructor() {
    this.loadAccounts();
  }

  // Cargar cuentas desde el servicio
  loadAccounts(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.chartOfAccountsService.getAccounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accounts) => {
          this.accounts.set(accounts);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading accounts', err);
          this.error.set('Failed to load accounts. Please try again later.');
          this.loading.set(false);
        }
      });
  }

  // Alternar estado expandido de una cuenta
  toggleExpand(accountId: string): void {
    this.expandedIds.update(ids => {
      const newSet = new Set(ids);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  }

  // Actualizar búsqueda
  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  // Actualizar tipo seleccionado
  setSelectedType(type: AccountType | 'all'): void {
    this.selectedType.set(type);
  }

  // Expandir todas las cuentas
  expandAll(): void {
    const allIds = this.getAllAccountIds(this.accounts());
    this.expandedIds.set(new Set(allIds));
  }

  // Colapsar todas las cuentas
  collapseAll(): void {
    this.expandedIds.set(new Set());
  }

  // Obtener todos los IDs de cuenta recursivamente
  private getAllAccountIds(accounts: Account[]): string[] {
    let ids: string[] = [];
    
    for (const account of accounts) {
      ids.push(account.id);
      if (account.children && account.children.length > 0) {
        ids = ids.concat(this.getAllAccountIds(account.children));
      }
    }
    
    return ids;
  }

  // Actualizar cuenta después de edición/creación
  updateAccount(updatedAccount: Account): void {
    this.accounts.update(currentAccounts => {
      const updateRecursive = (accounts: Account[]): Account[] => {
        return accounts.map(account => {
          if (account.id === updatedAccount.id) {
            return updatedAccount;
          }
          
          if (account.children && account.children.length > 0) {
            return {
              ...account,
              children: updateRecursive(account.children)
            };
          }
          
          return account;
        });
      };
      
      return updateRecursive(currentAccounts);
    });
  }

  // Añadir nueva cuenta
  addNewAccount(newAccount: Account, parentId?: string): void {
    this.accounts.update(currentAccounts => {
      if (!parentId) {
        return [...currentAccounts, newAccount];
      }
      
      const addRecursive = (accounts: Account[]): Account[] => {
        return accounts.map(account => {
          if (account.id === parentId) {
            return {
              ...account,
              children: [...(account.children || []), newAccount]
            };
          }
          
          if (account.children && account.children.length > 0) {
            return {
              ...account,
              children: addRecursive(account.children)
            };
          }
          
          return account;
        });
      };
      
      return addRecursive(currentAccounts);
    });
  }

  // Manejo de limpieza
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}