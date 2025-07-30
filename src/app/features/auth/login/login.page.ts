import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { LucideAngularModule, Mail, Lock } from 'lucide-angular';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  protected readonly MailIcon = Mail;
  protected readonly LockIcon = Lock;
  loginForm!: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoggingIn = signal(false);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['admin@empresa.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;
    this.isLoggingIn.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.loginForm.getRawValue();
    this.authService.login(email, password).subscribe({
      next: () => this.router.navigate(['/app']),
      error: (err) => {
        this.isLoggingIn.set(false);
        this.errorMessage.set(err.message || 'Error desconocido.');
      },
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}