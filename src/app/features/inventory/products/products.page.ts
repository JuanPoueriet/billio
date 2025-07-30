import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, PlusCircle, Filter, MoreHorizontal, FileDown } from 'lucide-angular';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'En Stock' | 'Bajo Stock' | 'Agotado';
  imageUrl: string;
}

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage {
  protected readonly PlusCircleIcon = PlusCircle;
  protected readonly FilterIcon = Filter;
  protected readonly MoreHorizontalIcon = MoreHorizontal;
  protected readonly FileDownIcon = FileDown;

  products = signal<Product[]>([
    { id: '1', name: 'Laptop Pro 15"', sku: 'LP-15-PRO', category: 'Electrónica', price: 1599.99, stock: 25, status: 'En Stock', imageUrl: 'https://i.imgur.com/4q0d7w9.png' },
    { id: '2', name: 'Mouse Inalámbrico Ergonómico', sku: 'MS-ERG-WL', category: 'Accesorios', price: 49.50, stock: 8, status: 'Bajo Stock', imageUrl: 'https://i.imgur.com/h3G6Qv4.png' },
    { id: '3', name: 'Teclado Mecánico RGB', sku: 'KB-MEC-RGB', category: 'Accesorios', price: 120.00, stock: 0, status: 'Agotado', imageUrl: 'https://i.imgur.com/a9a626d.png' },
    { id: '4', name: 'Monitor UltraWide 34"', sku: 'MN-UW-34', category: 'Monitores', price: 799.00, stock: 15, status: 'En Stock', imageUrl: 'https://i.imgur.com/L30ER72.png' },
  ]);

  getStockStatusClass(status: Product['status']): string {
    switch (status) {
      case 'En Stock': return 'stock-in';
      case 'Bajo Stock': return 'stock-low';
      case 'Agotado': return 'stock-out';
    }
  }
}