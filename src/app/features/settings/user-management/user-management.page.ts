// src/app/features/settings/user-management/user-management.page.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { LucideAngularModule, UserPlus, Save, X, MoreVertical, Power, PowerOff, Send } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import { NotificationService } from '../../../core/services/notification';
import { InviteUserDto, UsersService } from '../../../core/api/users.service';
import { Role, RolesService } from '../../../core/api/roles.service';
import { AuthService } from '../../../core/services/auth';
import { User } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, TitleCasePipe],
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss']
})
export class UserManagementPage implements OnInit {
  // Servicios
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private rolesService = inject(RolesService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

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
  loading = signal(true);

  ngOnInit(): void {
    this.inviteForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roleId: ['', Validators.required]
    });
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    forkJoin({
      users: this.usersService.getAllUsers(),
      roles: this.rolesService.getRoles()
    }).subscribe({
      next: ({ users, roles }) => {
        this.users.set(users);
        // this.roles.set(roles.filter((role: Role) => !role.isSystemRole));

        console.log('Roles recibidos del backend:', roles);

        this.roles.set(roles);

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.show('Error al cargar los datos', 'error');
      }
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
        this.notificationService.show('Invitación enviada exitosamente.', 'success');
        this.loadData();
        this.closeModal();
      },
      error: (err) => this.notificationService.show(err.error?.message || 'Error al enviar invitación', 'error')
    });
  }

  toggleUserStatus(user: User) {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    this.usersService.updateUser(user.id, { status: newStatus }).subscribe(() => {
      this.notificationService.show('Estado del usuario actualizado', 'success');
      this.loadData();
    });
  }

  sendPasswordReset(user: User) {
    this.authService.adminSendPasswordReset(user.email).subscribe(() => {
      this.notificationService.show(`Correo de recuperación enviado a ${user.email}`, 'success');
    });
  }
}