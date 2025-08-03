// src/app/features/accounting/chart-of-accounts/chart-of-accounts.page.ts

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { Account, AccountType, AccountTypeTranslations, AccountCategory, AccountCategoryTranslations } from '../../../core/models/account.model';
import { ChartOfAccountsService } from '../../../core/services/chart-of-accounts';
import { LanguageService } from '../../../core/services/language';

// import { ChartOfAccountsService } from 'src/app/core/services/chart-of-accounts.service';
// import { LanguageService } from 'src/app/core/services/language.service';
// import {
//   Account,
//   AccountCategory,
//   AccountCategoryTranslations,
//   AccountType,
//   AccountTypeTranslations,
//   Language,
// } from 'src/app/core/models/account.model';

interface State {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.page.html',
  styleUrls: ['./chart-of-accounts.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
})
export class ChartOfAccountsPage implements OnInit {
  private chartOfAccountsService = inject(ChartOfAccountsService);
  private languageService = inject(LanguageService);
  private router = inject(Router);

  public state = signal<State>({
    accounts: [],
    loading: true,
    error: null,
  });

  // El 'computed' para aplanar las cuentas sigue siendo útil.
  public flattenedAccounts = computed(() => this.flattenTree(this.state().accounts, 0));

  constructor() {}

  ngOnInit() {
    this.loadAccounts();
  }

  ionViewWillEnter() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.state.update((s) => ({ ...s, loading: true, error: null }));
    this.chartOfAccountsService
      .getAccounts()
      .pipe(take(1))
      .subscribe({
        next: (accounts) => {
          this.state.set({ accounts, loading: false, error: null });
        },
        error: (err) => {
          console.error('Error fetching accounts:', err);
          this.state.set({
            accounts: [],
            loading: false,
            error: 'Failed to load accounts. Please try again.',
          });
        },
      });
  }

  goToNewAccountForm() {
    this.router.navigate(['/tabs/accounting/account-form']);
  }

  private flattenTree(accounts: Account[], level: number): (Account & { level: number })[] {
    let flattened: (Account & { level: number })[] = [];
    for (const account of accounts) {
      flattened.push({ ...account, level });
      if (account.children && account.children.length > 0) {
        flattened = flattened.concat(this.flattenTree(account.children, level + 1));
      }
    }
    return flattened;
  }

  /**
   * CORRECCIÓN: Obtenemos el idioma directamente desde el servicio.
   * Esto asegura que TypeScript siempre vea el tipo correcto ('en' | 'es').
   */
  getAccountTypeTranslation(type: AccountType): string {
    const lang = this.languageService.currentLang();
    return AccountTypeTranslations[type][lang];
  }

  /**
   * CORRECCIÓN: Hacemos lo mismo para la categoría.
   */
  getAccountCategoryTranslation(category: AccountCategory): string {
    const lang = this.languageService.currentLang();
    return AccountCategoryTranslations[category][lang];
  }
}
