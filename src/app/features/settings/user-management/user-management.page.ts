import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, UserPlus, Save, X } from 'lucide-angular';

const PERMISSIONS_LIST = [
  { id: 'sell', label: 'Realizar Ventas' },
  { id: 'viewSales', label: 'Ver Ventas' },
  { id: 'manageInvoices', label: 'Gestionar Facturas' },
  { id: 'viewInventory', label: 'Ver Inventario' },
  { id: 'manageProducts', label: 'Gestionar Productos' },
  { id: 'viewReports', label: 'Ver Reportes' },
];

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss']
})
export class UserManagementPage implements OnInit {
  private fb = inject(FormBuilder);

  protected readonly UserPlusIcon = UserPlus;
  protected readonly SaveIcon = Save;
  protected readonly CloseIcon = X;

  isModalOpen = signal(false);
  newUserForm!: FormGroup;
  permissions = PERMISSIONS_LIST;

  users = signal([
    { id: 1, name: 'Admin Principal', email: 'admin@empresa.com', role: 'Propietario' },
    { id: 2, name: 'Juan Vendedor', email: 'juan.v@empresa.com', role: 'Empleado' },
  ]);

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      permissions: this.buildPermissionsGroup()
    });
  }

  buildPermissionsGroup(): FormGroup {
    const group = this.fb.group({});
    this.permissions.forEach(permission => {
      group.addControl(permission.id, this.fb.control(false));
    });
    return group;
  }

  openModal(): void {
    this.newUserForm.reset();
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onAddUserSubmit(): void {
    if (this.newUserForm.valid) {
      const formValue = this.newUserForm.value;
      const selectedPermissions = Object.keys(formValue.permissions)
        .filter(key => formValue.permissions[key]);

      const newUser = { ...formValue, permissions: selectedPermissions };
      console.log('Nuevo usuario a crear:', newUser);
      // Lógica para enviar al backend
      this.closeModal();
    }
  }
}