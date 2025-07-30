import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  customerAddress: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: 'Pagada' | 'Pendiente' | 'Vencida';
  lineItems: InvoiceLineItem[];
  notes?: string;
}

// Datos simulados de facturas
const MOCK_INVOICES: Invoice[] = [
  {
    id: 'FAC-001', customerName: 'Proyectos Globales S.A.', customerAddress: 'Av. Winston Churchill 1515, Santo Domingo',
    issueDate: '2025-07-15', dueDate: '2025-07-30', total: 1500.75, status: 'Pendiente',
    lineItems: [
      { description: 'Consultoría de Desarrollo (40 horas)', quantity: 40, price: 35.00 },
      { description: 'Soporte Técnico Mensual', quantity: 1, price: 100.75 },
    ],
    notes: 'Pago a 15 días. Contactar a finanzas@proyectosglobales.com para cualquier consulta.'
  },
  // ... (aquí irían las otras facturas de la lista)
];

@Injectable({ providedIn: 'root' })
export class InvoicesService {
  private invoices = signal<Invoice[]>(MOCK_INVOICES);

  getInvoiceById(id: string): Observable<Invoice | undefined> {
    const invoice = this.invoices().find(inv => inv.id === id);
    return of(invoice).pipe(delay(300)); // Simula una llamada a la API
  }
}