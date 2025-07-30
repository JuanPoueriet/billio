import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, PlusCircle, Filter, MoreHorizontal } from 'lucide-angular';

export interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  totalBilled: number;
}

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPage {
  protected readonly PlusCircleIcon = PlusCircle;
  protected readonly FilterIcon = Filter;
  protected readonly MoreHorizontalIcon = MoreHorizontal;

  customers = signal<Customer[]>([
    { id: 'CUST-001', companyName: 'Proyectos Globales S.A.', contactPerson: 'Juan Pérez', email: 'juan.perez@proyectosglobales.com', phone: '809-555-1234', totalBilled: 1500.75 },
    { id: 'CUST-002', companyName: 'Cliente Ejemplo S.R.L.', contactPerson: 'María García', email: 'm.garcia@cliente.com', phone: '809-555-5678', totalBilled: 350.00 },
    { id: 'CUST-003', companyName: 'Servicios Creativos', contactPerson: 'Carlos López', email: 'carlos@servicioscreativos.do', phone: '809-555-9012', totalBilled: 850.00 },
  ]);
}