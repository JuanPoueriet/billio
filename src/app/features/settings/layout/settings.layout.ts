import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule, Building, Users, Palette, CreditCard } from 'lucide-angular';

@Component({
  selector: 'app-settings-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './settings.layout.html',
  styleUrls: ['./settings.layout.scss']
})
export class SettingsLayout {
  protected readonly ProfileIcon = Building;
  protected readonly UsersIcon = Users;
  protected readonly BrandingIcon = Palette;
  protected readonly BillingIcon = CreditCard;
}