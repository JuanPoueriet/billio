import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, PlusCircle, Filter, MoreHorizontal } from 'lucide-angular';

interface Supplier {
  id: string;
  name: string;
  taxId: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-supplier-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './supplier-list.page.html',
  styleUrls: ['./supplier-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierListPage {
  protected readonly PlusCircleIcon = PlusCircle;
  protected readonly FilterIcon = Filter;
  protected readonly MoreHorizontalIcon = MoreHorizontal;

  suppliers = signal<Supplier[]>([
    { id: 'S01', name: 'OfiSuministros SRL', taxId: '130-11111-1', email: 'ventas@ofisuministros.com', phone: '809-555-1111' },
    { id: 'S02', name: 'TecnoImportaciones', taxId: '131-22222-2', email: 'info@tecnoimport.net', phone: '809-555-2222' },
  ]);
}