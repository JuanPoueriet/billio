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
import { Subscription, distinctUntilChanged } from 'rxjs';
import { ThemeService } from '../../../core/services/theme';
import { toObservable } from '@angular/core/rxjs-interop';

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
  public accountCategoryOptions: { value: AccountCategory, label: string }[] = [];
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
    isActive: new FormControl(true)
  });

  // Computed properties
  public selectedParentAccount = computed(() => {
    const parentId = this.accountForm.get('parentId')?.value;
    if (!parentId) return null;
    return this.parentAccounts.find(acc => acc.id === parentId);
  });

  constructor() {
    // Inicializar opciones de tipo de cuenta
    this.accountTypeOptions = Object.values(AccountType).map(type => ({
      value: type,
      label: type
    }));
  }

  ngOnInit(): void {
    // Obtener parámetros de la ruta
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.isEditMode = true;
          this.currentAccountId = params['id'];
          // CORRECCIÓN: Verificar que currentAccountId no sea null
          if (this.currentAccountId) {
            this.loadAccountData(this.currentAccountId);
          }
        }
      })
    );

    // Cargar cuentas padre
    this.loadParentAccounts();

    // Reaccionar a cambios en el tipo de cuenta
    this.subscriptions.push(
      this.accountForm.get('type')!.valueChanges.pipe(
        distinctUntilChanged()
      ).subscribe(type => {
        this.updateCategoryOptions(type);
      })
    );

    // CORRECCIÓN: Usar toObservable para la señal currentLang
    const lang$ = toObservable(this.languageService.currentLang);
    this.subscriptions.push(
      lang$.subscribe((lang: string) => {
        // Actualizar etiquetas de categorías si el idioma cambia
        const currentType = this.accountForm.get('type')?.value;
        if (currentType) {
          this.updateCategoryOptions(currentType);
        }
      })
    );

    // Inicializar opciones de categoría si ya hay un tipo seleccionado
    const initialType = this.accountForm.get('type')?.value;
    if (initialType) {
      this.updateCategoryOptions(initialType);
    }
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
        if (this.currentAccountId) {
          // Filtrar cuentas inválidas (cuenta actual y sus descendientes)
          this.parentAccounts = this.treeService.filterDisabledAccounts(
            accounts,
            this.currentAccountId
          );
        } else {
          this.parentAccounts = this.treeService.flattenForSelect(accounts);
        }
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

  updateCategoryOptions(type: AccountType | null): void {
    if (!type) {
      this.accountCategoryOptions = [];
      this.accountForm.get('category')?.reset();
      return;
    }

    const lang = this.languageService.currentLang();
    this.accountCategoryOptions = this.categoryMap[type].map(cat => ({
      value: cat,
      label: AccountCategoryTranslations[cat][lang as keyof typeof AccountCategoryTranslations[AccountCategory]]
    }));
    
    // Si solo hay una opción, seleccionarla automáticamente
    if (this.accountCategoryOptions.length === 1) {
      this.accountForm.get('category')?.setValue(this.accountCategoryOptions[0].value);
    }
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
    
    // CORRECCIÓN: Crear objeto compatible con CreateAccountDto
    const accountData: CreateAccountDto = {
      code: formValue.code,
      name: formValue.name,
      type: formValue.type,
      category: formValue.category,
      parentId: formValue.parentId || null,
      description: formValue.description || null,
      // Si el backend requiere isActive, asegúrate de que CreateAccountDto lo incluya
      // De lo contrario, elimina esta línea
      // isActive: formValue.isActive
    };

    // CORRECCIÓN: Verificar modo de edición y currentAccountId
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