import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, PlusCircle, Filter, MoreHorizontal } from 'lucide-angular';

interface PriceList {
  id: string;
  name: string;
  currency: string;
  validFrom: string;
  validTo: string;
  itemCount: number;
  status: 'Active' | 'Inactive' | 'Draft';
}

@Component({
  selector: 'app-price-lists-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './price-lists.page.html',
  styleUrls: ['./price-lists.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceListsPage {
  protected readonly PlusCircleIcon = PlusCircle;
  protected readonly FilterIcon = Filter;
  protected readonly MoreHorizontalIcon = MoreHorizontal;

  priceLists = signal<PriceList[]>([
    { id: 'PL-001', name: 'Lista de Precios General 2025', currency: 'USD', validFrom: 'Jan 1, 2025', validTo: 'Dec 31, 2025', itemCount: 125, status: 'Active' },
    { id: 'PL-002', name: 'Lista de Precios Mayorista', currency: 'USD', validFrom: 'Jul 1, 2025', validTo: 'Dec 31, 2025', itemCount: 110, status: 'Active' },
    { id: 'PL-003', name: 'Oferta de Verano', currency: 'USD', validFrom: 'Jun 1, 2025', validTo: 'Aug 31, 2025', itemCount: 25, status: 'Inactive' },
    { id: 'PL-004', name: 'Nuevos Precios 2026 (Borrador)', currency: 'USD', validFrom: 'Jan 1, 2026', validTo: 'Dec 31, 2026', itemCount: 0, status: 'Draft' },
  ]);

  getStatusClass(status: PriceList['status']): string {
    if (status === 'Active') return 'status-active';
    if (status === 'Inactive') return 'status-inactive';
    return 'status-draft';
  }
}