import { Component, ChangeDetectionStrategy, inject, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Save } from 'lucide-angular';
import { AccountType, AccountCategory } from '../../../core/models/account.model';
import { ChartOfAccountsService } from '../../../core/services/chart-of-accounts';

@Component({
  selector: 'app-account-form-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './account-form.page.html',
  styleUrls: ['./account-form.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormPage implements OnInit {
  @Input() id?: string;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private chartOfAccountsService = inject(ChartOfAccountsService);

  protected readonly SaveIcon = Save;

  accountForm!: FormGroup;
  isEditMode = signal(false);
  parentAccounts = signal<any[]>([]);

  // Arrays de opciones para los selects
  accountTypeOptions: { value: AccountType, label: string }[] = [];
  accountCategoryOptions: { value: AccountCategory, label: string }[] = [];

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      type: [null, Validators.required],
      category: [null, Validators.required],
      parentId: [null],
      description: [''],
      isActive: [true],
    });

    // Inicializar opciones para los enums
    this.accountTypeOptions = this.getEnumOptions(AccountType);
    this.accountCategoryOptions = this.getEnumOptions(AccountCategory);

    this.loadParentAccounts();

    if (this.id) {
      this.isEditMode.set(true);
      this.loadAccountData(this.id);
    }
  }

  private getEnumOptions<T extends Record<string, any>>(enumObj: T): { value: T[keyof T], label: string }[] {
    return Object.keys(enumObj)
      .filter(key => isNaN(Number(key)))
      .map(key => ({
        value: enumObj[key] as T[keyof T],
        label: enumObj[key] as string
      }));
  }

  loadParentAccounts(): void {
    this.chartOfAccountsService.getAccounts().subscribe(accounts => {
      this.parentAccounts.set(this.flattenForSelect(accounts));
    });
  }

  flattenForSelect(accounts: any[], level = 0): any[] {
    let result: any[] = [];
    for (const acc of accounts) {
      result.push({
        id: acc.id,
        name: '-'.repeat(level * 2) + ' ' + acc.name,
        code: acc.code
      });
      if (acc.children) {
        result = result.concat(this.flattenForSelect(acc.children, level + 1));
      }
    }
    return result;
  }

  loadAccountData(id: string): void {
    this.chartOfAccountsService.getAccountById(id).subscribe(account => {
      this.accountForm.patchValue({
        code: account.code,
        name: account.name,
        type: account.type,
        category: account.category,
        parentId: account.parentId,
        description: account.description,
        isActive: account.isActive
      });
    });
  }

  saveAccount(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    const formValue = this.accountForm.value;

    const accountData = {
      code: formValue.code,
      name: formValue.name,
      type: formValue.type,
      category: formValue.category,
      parentId: formValue.parentId || undefined, // Convertir null a undefined
      description: formValue.description,
      isActive: formValue.isActive,
    };

    const saveOperation = this.isEditMode() && this.id
      ? this.chartOfAccountsService.updateAccount(this.id, accountData)
      : this.chartOfAccountsService.createAccount(accountData);

    saveOperation.subscribe(() => {
      this.router.navigate(['/app/accounting/chart-of-accounts']);
    });
  }
}