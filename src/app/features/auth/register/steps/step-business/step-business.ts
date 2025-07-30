import { Component, Input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Building2, Briefcase, Users, Globe, Landmark, Image } from 'lucide-angular';
@Component({
  selector: 'app-step-business', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './step-business.html', styleUrls: ['./step-business.scss']
})
export class StepBusiness {
  @Input() parentForm!: FormGroup;
  protected readonly CompanyIcon = Building2;
  protected readonly IndustryIcon = Briefcase;
  protected readonly LegalFormIcon = Landmark;
  protected readonly EmployeesIcon = Users;
  protected readonly WebsiteIcon = Globe;
  protected readonly LogoIcon = Image;
  logoPreview = signal<string | ArrayBuffer | null>(null);

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.parentForm.patchValue({ logoFile: file });
      const reader = new FileReader();
      reader.onload = () => this.logoPreview.set(reader.result);
      reader.readAsDataURL(file);
    }
  }
}