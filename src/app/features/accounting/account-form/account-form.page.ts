import { Component, ChangeDetectionStrategy, inject, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Save } from 'lucide-angular';

@Component({
  selector: 'app-account-form-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './account-form.page.html',
  styleUrls: ['./account-form.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormPage implements OnInit {
  @Input() id?: string; // Recibe el ID desde la ruta para el modo edición

  private fb = inject(FormBuilder);
  private router = inject(Router);

  protected readonly SaveIcon = Save;

  accountForm!: FormGroup;
  isEditMode = signal(false);

  // Datos simulados para el selector de cuenta padre
  parentAccounts = signal([
    { id: '1', code: '1', name: 'Assets' },
    { id: '1-1', code: '1010', name: 'Cash and Equivalents' },
    { id: '2', code: '2', name: 'Liabilities' },
    { id: '3', code: '3', name: 'Equity' },
  ]);

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      accountCode: ['', Validators.required],
      accountName: ['', Validators.required],
      accountType: [null, Validators.required],
      parentAccountId: [null],
      description: [''],
      isActive: [true],
    });

    if (this.id) {
      this.isEditMode.set(true);
      // En una aplicación real, aquí se cargan los datos de la cuenta por su ID
      // y se rellena el formulario con this.accountForm.patchValue(...)
      console.log('Edit mode for account with ID:', this.id);
    }
  }

  saveAccount(): void {
    if (this.accountForm.valid) {
      console.log('Saving account data:', this.accountForm.value);
      // Lógica para enviar los datos al backend
      this.router.navigate(['/app/accounting/chart-of-accounts']);
    }
  }
}