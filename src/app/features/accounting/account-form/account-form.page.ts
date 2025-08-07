/**
 * =====================================================================================
 * ARCHIVO: src/app/features/accounting/account-form/account-form.page.ts
 * =====================================================================================
 * DESCRIPCIÓN:
 * Este componente maneja la lógica para el formulario de creación y edición de
 * cuentas contables. Es responsable de inicializar el formulario con sus
 * validaciones, cargar los datos de una cuenta existente para su edición, y
 * enviar los datos al servicio para su persistencia.
 * Utiliza Reactive Forms de Angular para una gestión robusta del estado del formulario.
 * =====================================================================================
 */

import { Component, OnInit, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChartOfAccountsService } from '../../../core/services/chart-of-accounts';
import { take } from 'rxjs/operators';
import {
  AccountType,
  AccountNature,
  HierarchyType,
  CashFlowCategory,
  RequiredDimension
} from '../../../core/models/account.model';
import { ChartOfAccountsStateService } from '../../../core/state/chart-of-accounts.state';

@Component({
  selector: 'app-account-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Importante para usar [formGroup] y otros
    RouterLink
  ],
  templateUrl: './account-form.page.html',
  styleUrls: ['./account-form.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormPage implements OnInit {
  // --- INYECCIÓN DE DEPENDENCIAS ---
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly coaService = inject(ChartOfAccountsService);
  private readonly coaState = inject(ChartOfAccountsStateService);

  // --- ESTADO DEL COMPONENTE ---
  public accountForm!: FormGroup;
  public isEditing = signal(false);
  public isLoading = signal(true);
  public activeTab = signal('general');
  private accountId: string | null = null;

  // --- DATOS PARA SELECTORES (DROPDOWNS) Y LISTAS ---
  public readonly accountTypes: AccountType[] = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];
  public readonly accountNatures: AccountNature[] = ['DEBIT', 'CREDIT'];
  public readonly hierarchyTypes: HierarchyType[] = ['LEGAL', 'MANAGEMENT', 'FISCAL'];
  public readonly cashFlowCategories: CashFlowCategory[] = ['OPERATING', 'INVESTING', 'FINANCING', 'NONE'];
  public readonly allDimensions: RequiredDimension[] = ['COST_CENTER', 'PROJECT', 'SEGMENT'];
  
  // Opciones para el selector de "Cuenta Padre", excluyendo las cuentas sumarias (no imputables)
  public readonly parentAccountOptions = computed(() => 
    this.coaState.flattenedAccounts().filter(acc => !acc.isPostable)
  );

  /**
   * Ciclo de vida ngOnInit. Se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.initializeForm();
    this.accountId = this.route.snapshot.paramMap.get('id');

    if (this.accountId) {
      this.isEditing.set(true);
      this.loadAccountData(this.accountId);
    } else {
      // Valores por defecto para una cuenta nueva
      this.accountForm.patchValue({
        version: this.coaState.selectedVersion(),
        hierarchyType: this.coaState.selectedHierarchy(),
        effectiveFrom: new Date().toISOString().split('T')[0]
      });
      this.isLoading.set(false);
    }
  }

  /**
   * Inicializa la estructura del FormGroup con todos los campos y validaciones.
   */
  private initializeForm(): void {
    this.accountForm = this.fb.group({
      // --- Pestaña: General ---
      code: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9-._]*$/)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(255)],
      parentId: [null],
      type: [null as AccountType | null, Validators.required],
      nature: [null as AccountNature | null, Validators.required],
      isPostable: [true, Validators.required],
      isActive: [true, Validators.required],

      // --- Pestaña: Mapeos ---
      statementMapping: this.fb.group({
        balanceSheetCategory: [''],
        incomeStatementCategory: [''],
        cashFlowCategory: ['NONE' as CashFlowCategory],
      }),

      // --- Pestaña: Reglas y Control ---
      requiresReconciliation: [false],
      isCashOrBank: [false],
      allowsIntercompany: [false],
      isFxRevaluation: [false],
      isRetainedEarnings: [false],
      isClosingAccount: [false],
      requiredDimensions: this.fb.array([]),

      // --- Pestaña: Avanzado ---
      version: [{ value: 1, disabled: true }, Validators.required],
      hierarchyType: [{ value: 'LEGAL', disabled: true }, Validators.required],
      effectiveFrom: [null, Validators.required],
      effectiveTo: [null],
    });
  }

  /**
   * Carga los datos de una cuenta existente y puebla el formulario.
   * @param id El ID de la cuenta a cargar.
   */
  private loadAccountData(id: string): void {
    this.isLoading.set(true);
    this.coaService.getAccountById(id).pipe(take(1)).subscribe({
      next: (account) => {
        // Formatear fechas para los inputs de tipo 'date'
        if (account.effectiveFrom) {
          account.effectiveFrom = account.effectiveFrom.split('T')[0];
        }
        if (account.effectiveTo) {
          account.effectiveTo = account.effectiveTo.split('T')[0];
        }
        this.accountForm.patchValue(account);
        
        this.populateFormArray('requiredDimensions', account.requiredDimensions || []);

        // Reglas de inmutabilidad: Código y Tipo no se pueden editar.
        this.accountForm.get('code')?.disable();
        this.accountForm.get('type')?.disable();
        
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar la cuenta', err);
        this.isLoading.set(false);
        this.router.navigate(['/accounting/chart-of-accounts']);
      }
    });
  }

  /**
   * Helper para poblar un FormArray con datos.
   */
  private populateFormArray(arrayName: string, data: any[]): void {
    const formArray = this.accountForm.get(arrayName) as FormArray;
    formArray.clear();
    data.forEach(item => formArray.push(this.fb.control(item)));
  }

  /**
   * Se ejecuta al enviar el formulario.
   */
  onSave(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      // Opcional: alertar al usuario o cambiar a la primera pestaña con error.
      return;
    }

    this.isLoading.set(true);
    const formData = this.accountForm.getRawValue();

    const saveOperation = this.isEditing()
      ? this.coaService.updateAccount(this.accountId!, formData)
      : this.coaService.createAccount(formData);

    saveOperation.pipe(take(1)).subscribe({
      next: () => {
        this.coaState.refreshAccounts();
        this.router.navigate(['/accounting/chart-of-accounts']);
      },
      error: (err) => {
        console.error('Error al guardar la cuenta', err);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Maneja el cambio en los checkboxes de 'Dimensiones Requeridas'.
   */
  onDimensionChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const dimensionsArray = this.accountForm.get('requiredDimensions') as FormArray;

    if (target.checked) {
      dimensionsArray.push(this.fb.control(target.value));
    } else {
      const index = dimensionsArray.controls.findIndex(x => x.value === target.value);
      if (index !== -1) {
        dimensionsArray.removeAt(index);
      }
    }
  }

  /**
   * Verifica si una dimensión está seleccionada para el binding en el HTML.
   */
  isDimensionSelected(dimension: RequiredDimension): boolean {
    return (this.accountForm.get('requiredDimensions') as FormArray).value.includes(dimension);
  }

  /**
   * Navega de vuelta a la lista.
   */
  onCancel(): void {
    this.router.navigate(['/accounting/chart-of-accounts']);
  }
}
