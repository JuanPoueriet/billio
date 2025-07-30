import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, PlusCircle, Filter, MoreHorizontal } from 'lucide-angular';

interface Tax {
  id: string;
  name: string;
  rate: number;
  type: 'Porcentaje' | 'Fijo';
  countryCode: string;
}

@Component({
  selector: 'app-taxes-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './taxes.page.html',
  styleUrls: ['./taxes.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxesPage {
  protected readonly PlusCircleIcon = PlusCircle;
  protected readonly FilterIcon = Filter;
  protected readonly MoreHorizontalIcon = MoreHorizontal;

  taxes = signal<Tax[]>([
    { id: 'TAX-01', name: 'ITBIS (18%)', rate: 18, type: 'Porcentaje', countryCode: 'DO' },
    { id: 'TAX-02', name: 'ITBIS Reducido (16%)', rate: 16, type: 'Porcentaje', countryCode: 'DO' },
    { id: 'TAX-03', name: 'Impuesto Selectivo al Consumo', rate: 10, type: 'Porcentaje', countryCode: 'DO' },
    { id: 'TAX-04', name: 'Sales Tax (FL)', rate: 7, type: 'Porcentaje', countryCode: 'US' },
  ]);
}