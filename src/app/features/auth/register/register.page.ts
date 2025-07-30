import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { trigger, transition, style, animate } from '@angular/animations';

// Íconos y Componentes de Pasos
import { LucideAngularModule, Check, ArrowLeft, ArrowRight, Rocket, CheckCircle, BarChart2, Package } from 'lucide-angular';
import { StepAccount } from './steps/step-account/step-account';
import { StepAccess } from './steps/step-access/step-access';
import { StepBusiness } from './steps/step-business/step-business';
import { StepConfiguration } from './steps/step-configuration/step-configuration';
import { StepPlan } from './steps/step-plan/step-plan';

// Validador personalizado
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule,
    StepAccount, StepAccess, StepBusiness, StepConfiguration, StepPlan
  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('stepAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(30px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-30px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class RegisterPage implements OnInit {
  // Íconos para la plantilla
  protected readonly CheckCircleIcon = CheckCircle;
  protected readonly BarChart2Icon = BarChart2;
  protected readonly PackageIcon = Package;
  protected readonly CheckIcon = Check;
  protected readonly ArrowLeftIcon = ArrowLeft;
  protected readonly ArrowRightIcon = ArrowRight;
  protected readonly RocketIcon = Rocket;
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentStep = signal(1);
  registerForm!: FormGroup;
  errorMessage = signal<string | null>(null);
  isRegistering = signal(false);

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      account: this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        jobTitle: [''],
        phone: [''], // Teléfono del usuario
        avatarUrl: [null],
      }),
      access: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        passwordGroup: this.fb.group({
          password: ['', [Validators.required, Validators.minLength(8)]],
          confirmPassword: ['', [Validators.required]],
        }, { validators: passwordMatchValidator }),
      }),
      business: this.fb.group({
        companyName: ['', [Validators.required]],
        industry: ['', [Validators.required]],
        legalForm: [''],
        numberOfEmployees: [''],
        website: [''],
        logoFile: [null],
      }),
      configuration: this.fb.group({
        address: [''], city: [''], stateOrProvince: [''], postalCode: [''],
        country: ['DO', [Validators.required]],
        companyPhone: ['', [Validators.required]], // Teléfono de la empresa
        taxId: ['', [Validators.required]],
        naicsCode: [''],
        currency: ['DOP', [Validators.required]],
        defaultTaxRate: [0],
        fiscalYearStart: ['01-01'],
        timezone: ['America/Santo_Domingo', [Validators.required]],
      }),
      plan: this.fb.group({
        planId: ['trial', [Validators.required]],
        acceptTerms: [false, [Validators.requiredTrue]],
        marketingOptIn: [true],
      }),
    });
  }

  nextStep(): void {
    if (this.isStepValid(this.currentStep())) this.currentStep.update(step => step + 1);
  }

  prevStep(): void {
    this.currentStep.update(step => step - 1);
  }

  isStepValid(step: number): boolean {
    const stepGroup = this.getStepGroup(step);
    stepGroup.markAllAsTouched();
    return stepGroup.valid;
  }

  getStepGroup(step: number): FormGroup {
    return [this.account, this.access, this.business, this.configuration, this.plan][step - 1];
  }

  get account() { return this.registerForm.get('account') as FormGroup; }
  get access() { return this.registerForm.get('access') as FormGroup; }
  get business() { return this.registerForm.get('business') as FormGroup; }
  get configuration() { return this.registerForm.get('configuration') as FormGroup; }
  get plan() { return this.registerForm.get('plan') as FormGroup; }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) {
      this.errorMessage.set('Por favor, revisa todos los pasos y completa los campos requeridos.');
      if (this.plan.get('acceptTerms')?.invalid) this.errorMessage.set('Debes aceptar los Términos y la Política de Privacidad.');
      return;
    }
    this.isRegistering.set(true);
    this.errorMessage.set(null);

    const formData = new FormData();
    const formValue = this.registerForm.getRawValue();
    
    // Construcción del payload
    const payload = {
      // User
      firstName: formValue.account.firstName, lastName: formValue.account.lastName,
      email: formValue.access.email, password: formValue.access.passwordGroup.password,
      userPhone: formValue.account.phone, // Clave única para el teléfono del usuario
      jobTitle: formValue.account.jobTitle,
      // Company
      companyName: formValue.business.companyName, mainEmail: formValue.access.email,
      companyPhone: formValue.configuration.companyPhone, // Clave única para el teléfono de la empresa
      address: formValue.configuration.address, city: formValue.configuration.city, stateOrProvince: formValue.configuration.stateOrProvince,
      postalCode: formValue.configuration.postalCode, country: formValue.configuration.country,
      taxId: formValue.configuration.taxId, legalForm: formValue.business.legalForm,
      industry: formValue.business.industry, naicsCode: formValue.configuration.naicsCode,
      currency: formValue.configuration.currency, defaultTaxRate: formValue.configuration.defaultTaxRate,
      fiscalYearStart: formValue.configuration.fiscalYearStart, 
      numberOfEmployees: formValue.business.numberOfEmployees, website: formValue.business.website,
      timezone: formValue.configuration.timezone,
      // Consent
      acceptTerms: formValue.plan.acceptTerms, marketingOptIn: formValue.plan.marketingOptIn,
    };

    // Añadir campos de texto a FormData
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, String(value));
    }
    
    // Añadir archivos a FormData
    if (formValue.account.avatarUrl) formData.append('avatarFile', formValue.account.avatarUrl);
    if (formValue.business.logoFile) formData.append('logoFile', formValue.business.logoFile);
    
    // this.authService.registerWithFormData(formData).subscribe({...});
    // Simulación de éxito
    setTimeout(() => {
        this.isRegistering.set(false);
        this.router.navigate(['/app']);
    }, 1500);
  }
}