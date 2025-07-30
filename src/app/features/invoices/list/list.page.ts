import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, PlusCircle, Filter, MoreHorizontal } from 'lucide-angular';

export interface Invoice {
  id: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: 'Pagada' | 'Pendiente' | 'Vencida';
}

@Component({
  selector: 'app-invoices-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesListPage {
  protected readonly PlusCircleIcon = PlusCircle;
  protected readonly FilterIcon = Filter;
  protected readonly MoreHorizontalIcon = MoreHorizontal;

  invoices = signal<Invoice[]>([
    { id: 'FAC-001', customerName: 'Proyectos Globales', issueDate: '15/07/2025', dueDate: '30/07/2025', total: 1500.75, status: 'Pendiente' },
    { id: 'FAC-002', customerName: 'Cliente Ejemplo S.R.L.', issueDate: '10/07/2025', dueDate: '25/07/2025', total: 350.00, status: 'Pagada' },
    { id: 'FAC-003', customerName: 'Servicios Creativos', issueDate: '01/07/2025', dueDate: '16/07/2025', total: 850.00, status: 'Vencida' },
    { id: 'FAC-004', customerName: 'Ana Pérez', issueDate: '20/07/2025', dueDate: '04/08/2025', total: 120.50, status: 'Pendiente' },
  ]);

  getStatusClass(status: Invoice['status']): string {
    switch (status) {
      case 'Pagada': return 'status-paid';
      case 'Pendiente': return 'status-pending';
      case 'Vencida': return 'status-overdue';
    }
  }
}