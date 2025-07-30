import { Component, ChangeDetectionStrategy, Input, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideAngularModule, Printer, Download, Mail, MoreVertical } from 'lucide-angular';
import { Invoice, InvoicesService } from '../../../core/services/invoices';

@Component({
  selector: 'app-invoice-detail-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceDetailPage implements OnInit {
  private invoicesService = inject(InvoicesService);

  // Recibe el 'id' directamente desde la ruta gracias a withComponentInputBinding()
  @Input() id: string = '';

  // Señal para almacenar la factura encontrada
  invoice = signal<Invoice | undefined>(undefined);

  // Íconos para la plantilla
  protected readonly PrinterIcon = Printer;
  protected readonly DownloadIcon = Download;
  protected readonly MailIcon = Mail;
  protected readonly MoreIcon = MoreVertical;

  ngOnInit(): void {
    if (this.id) {
      this.invoicesService.getInvoiceById(this.id).subscribe(data => {
        this.invoice.set(data);
      });
    }
  }

  getSubtotal(): number {
    return this.invoice()?.lineItems.reduce((acc, item) => acc + (item.quantity * item.price), 0) || 0;
  }

  getTaxAmount(): number {
    return this.getSubtotal() * 0.18; // Asumiendo un 18% de impuesto
  }

  printInvoice(): void {
    window.print();
  }
}