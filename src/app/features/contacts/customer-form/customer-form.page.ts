import { Component, ChangeDetectionStrategy, inject, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Save, Building2, User, Mail, Phone, Hash, MapPin } from 'lucide-angular';

@Component({
  selector: 'app-customer-form-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './customer-form.page.html',
  styleUrls: ['./customer-form.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerFormPage implements OnInit {
  @Input() id?: string; // Recibe el ID desde la ruta para modo edición

  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Íconos
  protected readonly SaveIcon = Save;
  protected readonly CompanyIcon = Building2;
  protected readonly UserIcon = User;
  protected readonly MailIcon = Mail;
  protected readonly PhoneIcon = Phone;
  protected readonly TaxIdIcon = Hash;
  protected readonly AddressIcon = MapPin;

  customerForm!: FormGroup;
  isEditMode = signal(false);

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      companyName: ['', Validators.required],
      contactPerson: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      taxId: [''],
      address: [''],
      city: [''],
      stateOrProvince: [''],
      postalCode: [''],
      country: ['DO', Validators.required],
    });

    if (this.id) {
      this.isEditMode.set(true);
      // Lógica para cargar los datos del cliente por ID
      console.log('Modo Edición para cliente con ID:', this.id);
      // this.customerService.getCustomerById(this.id).subscribe(customer => {
      //   this.customerForm.patchValue(customer);
      // });
    }
  }

  saveCustomer(): void {
    if (this.customerForm.valid) {
      console.log('Datos del cliente a guardar:', this.customerForm.value);
      // Lógica para enviar al backend (crear o actualizar)
      this.router.navigate(['/app/contacts/customers']);
    }
  }
}