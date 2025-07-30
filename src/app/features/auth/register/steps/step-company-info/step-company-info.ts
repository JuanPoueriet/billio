import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Building2, Mail, Lock, Users, Briefcase } from 'lucide-angular';

@Component({
  selector: 'app-step-company-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './step-company-info.html',
  styleUrls: ['./step-company-info.scss']
})
export class StepCompanyInfo {
  @Input() parentForm!: FormGroup;
  protected readonly CompanyIcon = Building2;
  protected readonly MailIcon = Mail;
  protected readonly LockIcon = Lock;
  protected readonly IndustryIcon = Briefcase;
  protected readonly EmployeesIcon = Users;

  get passwordGroup() { return this.parentForm.get('passwordGroup') as FormGroup; }
}