import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, UserPlus, Save, X, MoreVertical, Power, PowerOff, Send } from 'lucide-angular';
import { NotificationService } from '../../../core/services/notification';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import { InviteUserDto, User, UsersService } from '../../../core/api/users.service';
import { Role, RolesService } from '../../../core/api/roles.service';

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, HasPermissionDirective],
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss']
})
export class UserManagementPage implements OnInit {
  // Servicios
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private rolesService = inject(RolesService);
  private notificationService = inject(NotificationService);

  // Iconos
  protected readonly UserPlusIcon = UserPlus;
  protected readonly SaveIcon = Save;
  protected readonly CloseIcon = X;
  protected readonly MoreVerticalIcon = MoreVertical;
  protected readonly ActivateIcon = Power;
  protected readonly DeactivateIcon = PowerOff;
  protected readonly ResetPasswordIcon = Send;

  // Estado
  isModalOpen = signal(false);
  inviteForm!: FormGroup;
  users = signal<User[]>([]);
  roles = signal<Role[]>([]);

  ngOnInit(): void {
    this.inviteForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roleId: ['', Validators.required]
    });
    this.loadUsers();
    this.loadRoles();
  }
  
  loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: () => this.notificationService.showError('No se pudieron cargar los usuarios.')
    });
  }

  loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (data) => this.roles.set(data.filter(r => !r.isSystemRole)), // No mostrar roles de sistema para asignar
      error: () => this.notificationService.showError('No se pudieron cargar los roles.')
    });
  }

  openModal(): void {
    this.inviteForm.reset();
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  sendInvitation(): void {
    if (this.inviteForm.invalid) return;
    
    const inviteDto: InviteUserDto = this.inviteForm.value;
    this.usersService.inviteUser(inviteDto).subscribe({
      next: () => {
        this.notificationService.showSuccess('Invitación enviada exitosamente.');
        this.loadUsers();
        this.closeModal();
      },
      error: (err) => this.notificationService.showError(err.error.message || 'Error al enviar la invitación.')
    });
  }
  
  toggleUserStatus(user: User): void {
      const newStatus = !user.isActive;
      const action = newStatus ? 'activar' : 'desactivar';

      if (confirm(`¿Estás seguro de que quieres ${action} a ${user.firstName}?`)) {
          this.usersService.setUserStatus(user.id, newStatus).subscribe({
              next: () => {
                  this.notificationService.showSuccess(`Usuario ${action}do.`);
                  this.loadUsers();
              },
              error: (err) => this.notificationService.showError(err.error.message || 'No se pudo cambiar el estado.')
          });
      }
  }

  sendPasswordReset(user: User): void {
      if (confirm(`¿Enviar un correo de restablecimiento de contraseña a ${user.firstName}?`)) {
          this.usersService.sendPasswordReset(user.id).subscribe({
              next: () => this.notificationService.showSuccess('Correo de restablecimiento enviado.'),
              error: (err) => this.notificationService.showError(err.error.message || 'No se pudo enviar el correo.')
          });
      }
  }

   getRoleNames(user: User): string {
    if (!user.roles || user.roles.length === 0) {
      return 'Sin rol';
    }
    return user.roles.map(r => r.name).join(', ');
  }

  getUserStatus(user: User): 'Activo' | 'Inactivo' | 'Pendiente' {
    if (!user.passwordHash) return 'Pendiente';
    return user.isActive ? 'Activo' : 'Inactivo';
  }
}