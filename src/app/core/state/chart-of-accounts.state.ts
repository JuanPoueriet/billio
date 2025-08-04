import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ChartOfAccountsService } from '../services/chart-of-accounts';
import { TreeService } from '../services/tree';
import { Account, AccountType, AccountTypeTranslations } from '../models/account.model';
import { FlattenedAccount } from '../models/flattened-account.model';

@Injectable({
  providedIn: 'root'
})
export class ChartOfAccountsStateService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private chartOfAccountsService = inject(ChartOfAccountsService);
  private treeService = inject(TreeService);

  // Estado centralizado
  public accounts = signal<Account[]>([]);
  public loading = signal(true);
  public error = signal<string | null>(null);
  public expandedIds = signal<Set<string>>(new Set());
  public searchQuery = signal('');
  public selectedType = signal<AccountType | 'all'>('all');

  // Nuevas señales para mejorar performance
  public reloading = signal(false);
  public expandingAll = signal(false);
  public collapsingAll = signal(false);

  // Memoización de cuentas aplanadas sin filtros
  private flattenedAccounts = signal<FlattenedAccount[]>([]);

  // Traducciones
  public accountTypeTranslations = AccountTypeTranslations;
  public accountTypes = Object.values(AccountType);

  // Computed: Cuentas visibles según filtros
  public displayAccounts = computed<FlattenedAccount[]>(() => {
    const query = this.searchQuery().toLowerCase();
    const type = this.selectedType();
    const expanded = this.expandedIds();

    return this.flattenedAccounts().filter(account => {
      const matchesType = type === 'all' || account.type === type;
      const matchesQuery =
        query === '' ||
        account.name.toLowerCase().includes(query) ||
        account.code.toLowerCase().includes(query);

      const parentExpanded = this.isParentExpanded(account);

      return matchesType && matchesQuery && parentExpanded;
    });
  });

  constructor() {
    this.loadAccounts();
  }

  // Cargar cuentas desde el servicio
  async loadAccounts(): Promise<void> {
    this.reloading.set(true);

    this.chartOfAccountsService.getAccounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accounts) => {
          this.accounts.set(accounts);
          this.updateFlattenedAccounts();
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading accounts', err);
          this.error.set('Failed to load accounts. Please try again later.');
          this.loading.set(false);
        }
      });

    this.reloading.set(false);
  }

  // Actualiza la señal de cuentas aplanadas (sin filtros)
  private updateFlattenedAccounts(): void {
    this.flattenedAccounts.set(
      this.treeService['flattenTree'](this.accounts())
    );
  }

  // Determina si el padre está expandido (para visibilidad)
  private isParentExpanded(account: FlattenedAccount): boolean {
    if (!account.parentId) return true;
    return this.expandedIds().has(account.parentId);
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
    this.expandingAll.set(true);
    const allIds = this.getAllAccountIds(this.accounts());
    this.expandedIds.set(new Set(allIds));
    this.expandingAll.set(false);
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
      if (account.children) {
        ids = ids.concat(this.getAllAccountIds(account.children));
      }
    }

    return ids;
  }

  // Cleanup al destruir el servicio
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
