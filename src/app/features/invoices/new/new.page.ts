import { Component, ChangeDetectionStrategy, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Save, Plus, Trash2 } from 'lucide-angular';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-new-invoice-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewInvoicePage implements OnInit {
  private fb = inject(FormBuilder);

  protected readonly SaveIcon = Save;
  protected readonly PlusIcon = Plus;
  protected readonly TrashIcon = Trash2;

  invoiceForm!: FormGroup;

  // Convertimos los cambios del formulario en señales para cálculos reactivos
  private formChanges = toSignal(this.invoiceForm.valueChanges, { initialValue: {} });

  subtotal = computed(() => {
    return this.lineItems.controls.reduce((acc, control) => {
      const quantity = control.get('quantity')?.value || 0;
      const price = control.get('price')?.value || 0;
      return acc + (quantity * price);
    }, 0);
  });

  taxAmount = computed(() => this.subtotal() * 0.18); // Asumiendo un 18% de impuesto
  total = computed(() => this.subtotal() + this.taxAmount());

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      customerName: ['', Validators.required],
      invoiceNumber: [{ value: 'FAC-005', disabled: true }],
      issueDate: [this.getTodayDate(), Validators.required],
      dueDate: ['', Validators.required],
      lineItems: this.fb.array([]),
      notes: [''],
    });
    this.addLineItem(); // Añade una línea por defecto al iniciar
  }

  get lineItems(): FormArray {
    return this.invoiceForm.get('lineItems') as FormArray;
  }

  createLineItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addLineItem(): void {
    this.lineItems.push(this.createLineItem());
  }

  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
  }

  getLineItemTotal(index: number): number {
    const lineItem = this.lineItems.at(index);
    const quantity = lineItem.get('quantity')?.value || 0;
    const price = lineItem.get('price')?.value || 0;
    return quantity * price;
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  saveInvoice(): void {
    if (this.invoiceForm.valid) {
      console.log('Factura guardada:', this.invoiceForm.getRawValue());
      // Aquí iría la lógica para enviar al backend
    }
  }
}