import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  computed,
  Signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';
import {
  LucideAngularModule,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Loader
} from 'lucide-angular';
import {
  AccountType,
  AccountCategory,
  AccountCategoryTranslations,
  CreateAccountDto,
  Account
} from '../../../core/models/account.model';
import { ChartOfAccountsService } from '../../../core/services/chart-of-accounts';
import { TreeService } from '../../../core/services/tree';
import { NotificationService } from '../../../core/services/notification';
import { LanguageService } from '../../../core/services/language';
import { Subscription, forkJoin, of } from 'rxjs';
import { ThemeService } from '../../../core/services/theme';

@Component({
  selector: 'app-account-form-page',
  templateUrl: './account-form.page.html',
  styleUrls: ['./account-form.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule, FormsModule],
})
export class AccountFormPage implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private chartOfAccountsService = inject(ChartOfAccountsService);
  private treeService = inject(TreeService);
  private notificationService = inject(NotificationService);
  private languageService = inject(LanguageService);
  private cdr = inject(ChangeDetectorRef);
  private themeService = inject(ThemeService);
  private subscriptions: Subscription[] = [];

  // Iconos
  protected readonly SaveIcon = Save;
  protected readonly CancelIcon = X;
  protected readonly ChevronDownIcon = ChevronDown;
  protected readonly ChevronUpIcon = ChevronUp;
  protected readonly LoaderIcon = Loader;

  // Estados
  public loading = false;
  public saving = false;
  public isEditMode = false;
  public currentAccountId: string | null = null;
  public parentAccounts: any[] = [];
  public showParentDropdown = false;
  public filteredParentAccounts: any[] = [];
  public parentSearchQuery = '';
  public currentLang = this.languageService.currentLang;
  public themeMode = this.themeService.themeMode;

  // Enums y opciones
  public accountTypeOptions: { value: AccountType, label: string }[] = [];
  public categoryMap: Record<AccountType, AccountCategory[]> = {
    [AccountType.ASSET]: [
      AccountCategory.CURRENT_ASSET,
      AccountCategory.NON_CURRENT_ASSET
    ],
    [AccountType.LIABILITY]: [
      AccountCategory.CURRENT_LIABILITY,
      AccountCategory.NON_CURRENT_LIABILITY
    ],
    [AccountType.EQUITY]: [
      AccountCategory.OWNERS_EQUITY,
      AccountCategory.RETAINED_EARNINGS
    ],
    [AccountType.REVENUE]: [
      AccountCategory.OPERATING_REVENUE,
      AccountCategory.NON_OPERATING_REVENUE
    ],
    [AccountType.EXPENSE]: [
      AccountCategory.OPERATING_EXPENSE,
      AccountCategory.NON_OPERATING_EXPENSE,
      AccountCategory.COST_OF_GOODS_SOLD
    ]
  };

  // Formulario
  public accountForm: FormGroup = this.fb.group({
    code: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]+(\.[0-9]+)*$/),
      Validators.maxLength(20)
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(100)
    ]),
    type: new FormControl(null as AccountType | null, Validators.required),
    category: new FormControl(null as AccountCategory | null, Validators.required),
    parentId: new FormControl(null as string | null),
    description: new FormControl('', Validators.maxLength(500)),
    isActive: new FormControl(true),
    currency: new FormControl('USD', Validators.required) // <-- Añadido, valor por defecto
  });

  // Computed: Cuenta padre seleccionada
  public selectedParentAccount = computed(() => {
    const parentId = this.accountForm.get('parentId')?.value;
    if (!parentId) return null;
    return this.parentAccounts.find(acc => acc.id === parentId);
  });

  // ✅ Nueva señal computada para categorías
  public accountCategories = computed(() => {
    const type = this.accountForm.get('type')?.value as AccountType | null;
    const lang = this.languageService.currentLang();

    if (!type) return [];

    return this.categoryMap[type].map((cat: AccountCategory) => ({
      value: cat,
      label: AccountCategoryTranslations[cat][lang as keyof typeof AccountCategoryTranslations[AccountCategory]]
    }));
  });

  constructor() {
    this.accountTypeOptions = Object.values(AccountType).map(type => ({
      value: type,
      label: type
    }));
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.isEditMode = true;
          this.currentAccountId = params['id'];
          if (this.currentAccountId) {
            // Encadenar ambas cargas
            this.loading = true;
            forkJoin({
              parents: this.chartOfAccountsService.getAccounts(),
              account: this.chartOfAccountsService.getAccountById(this.currentAccountId)
            }).subscribe({
              next: ({ parents, account }) => {
                this.parentAccounts = this.treeService.getSelectableAccounts(
                  parents,
                  this.currentAccountId ?? undefined // <-- Corrige el tipo aquí
                );
                this.filteredParentAccounts = [...this.parentAccounts];
                this.accountForm.patchValue({
                  code: account.code,
                  name: account.name,
                  type: account.type,
                  category: account.category,
                  parentId: account.parentId,
                  description: account.description,
                  isActive: account.isActive
                });
                this.loading = false;
                this.cdr.detectChanges();
              },
              error: (err) => {
                this.notificationService.showError('Failed to load account data');
                this.loading = false;
              }
            });
          }
        } else {
          this.loadParentAccounts();
        }
      })
    );

    this.loadParentAccounts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadAccountData(id: string): void {
    this.loading = true;
    this.chartOfAccountsService.getAccountById(id).subscribe({
      next: (account) => {
        this.accountForm.patchValue({
          code: account.code,
          name: account.name,
          type: account.type,
          category: account.category,
          parentId: account.parentId,
          description: account.description,
          isActive: account.isActive
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading account', err);
        this.notificationService.showError('Failed to load account data');
        this.loading = false;
      }
    });
  }

  loadParentAccounts(): void {
    this.loading = true;
    this.chartOfAccountsService.getAccounts().subscribe({
      next: (accounts) => {
        this.parentAccounts = this.treeService.getSelectableAccounts(
          accounts,
          this.isEditMode && this.currentAccountId ? this.currentAccountId : undefined
        );
        this.filteredParentAccounts = [...this.parentAccounts];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading parent accounts', err);
        this.notificationService.showError('Failed to load parent accounts');
        this.loading = false;
      }
    });
  }

  toggleParentDropdown(): void {
    this.showParentDropdown = !this.showParentDropdown;
    if (this.showParentDropdown) {
      this.filterParentAccounts();
    }
  }

  filterParentAccounts(): void {
    if (!this.parentSearchQuery) {
      this.filteredParentAccounts = [...this.parentAccounts];
      return;
    }

    const query = this.parentSearchQuery.toLowerCase();
    this.filteredParentAccounts = this.parentAccounts.filter(account =>
      account.name.toLowerCase().includes(query) ||
      account.code.toLowerCase().includes(query)
    );
  }

  selectParentAccount(account: any | null): void {
    if (account && account.isDisabled) return; // <--- Previene selección
    this.accountForm.get('parentId')?.setValue(account ? account.id : null);
    this.showParentDropdown = false;
    this.parentSearchQuery = '';
  }

  getSelectedParentDisplay(): string {
    const parent = this.selectedParentAccount();
    if (!parent) return 'None (Top Level Account)';
    return `${parent.code} - ${parent.name}`;
  }

  saveAccount(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.notificationService.showError('Please fill all required fields correctly');
      return;
    }

    this.saving = true;
    const formValue = this.accountForm.value;

    const accountData: CreateAccountDto = {
      code: formValue.code,
      name: formValue.name,
      type: formValue.type,
      category: formValue.category,
      parentId: formValue.parentId || null,
      description: formValue.description || null,
      currency: formValue.currency // <-- Añadido
    };

    const operation = this.isEditMode && this.currentAccountId
      ? this.chartOfAccountsService.updateAccount(this.currentAccountId, accountData)
      : this.chartOfAccountsService.createAccount(accountData);

    operation.subscribe({
      next: (account) => {
        this.saving = false;
        this.notificationService.showSuccess(
          `Account ${this.isEditMode ? 'updated' : 'created'} successfully`
        );
        this.router.navigate(['/app/accounting/chart-of-accounts']);
      },
      error: (err) => {
        this.saving = false;
        console.error('Save failed', err);
        this.notificationService.showError(
          `Failed to ${this.isEditMode ? 'update' : 'create'} account: ${err.error?.message || 'Unknown error'}`
        );
      }
    });
  }
}
