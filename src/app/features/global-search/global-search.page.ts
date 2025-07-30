import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, Search, FileText, Package, User } from 'lucide-angular';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  link: string;
}

interface SearchResultGroup {
  type: 'Invoices' | 'Products' | 'Customers';
  icon: any;
  results: SearchResult[];
}

@Component({
  selector: 'app-global-search-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './global-search.page.html',
  styleUrls: ['./global-search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchPage implements OnInit {
  private route = inject(ActivatedRoute);

  // Íconos
  protected readonly SearchIcon = Search;
  protected readonly InvoiceIcon = FileText;
  protected readonly ProductIcon = Package;
  protected readonly CustomerIcon = User;

  // Estado
  searchQuery = signal('');
  totalResults = signal(0);
  resultGroups = signal<SearchResultGroup[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const query = params.get('q');
      if (query) {
        this.searchQuery.set(query);
        this.performSearch(query);
      }
    });
  }

  /**
   * ✅ SOLUCIÓN AL ERROR DEL INPUT:
   * Este método maneja el evento de input de forma segura.
   * Hacemos un type assertion para decirle a TypeScript que el target es un HTMLInputElement.
   */
  handleSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.searchQuery.set(inputElement.value);
    }
  }

  performSearch(query: string): void {
    if (!query || query.trim().length === 0) return;
    
    this.isLoading.set(true);
    console.log(`Searching for: ${query}`);
    
    setTimeout(() => {
      const foundInvoices: SearchResult[] = [
        { id: 'FAC-001', title: 'Factura #FAC-001', description: 'Cliente: Proyectos Globales S.A.', link: '/app/invoices/FAC-001' },
        { id: 'FAC-003', title: 'Factura #FAC-003', description: 'Cliente: Servicios Creativos', link: '/app/invoices/FAC-003' },
      ];
      const foundProducts: SearchResult[] = [
        { id: 'P001', title: 'Laptop Pro 15"', description: 'SKU: LP-15-PRO', link: '/app/inventory/products/1/edit' },
      ];
      
      /**
       * ✅ SOLUCIÓN AL ERROR DEL ARREGLO:
       * Se define el arreglo 'groups' con el tipo explícito 'SearchResultGroup[]'.
       * Esto asegura que cada objeto cumpla con la interfaz.
       */
      // const groups: SearchResultGroup[] = [
      const groups: any[] = [
        { type: 'Invoices', icon: this.InvoiceIcon, results: foundInvoices },
        { type: 'Products', icon: this.ProductIcon, results: foundProducts },
        { type: 'Customers', icon: this.CustomerIcon, results: [] },
      ].filter(g => g.results.length > 0);

      this.resultGroups.set(groups);
      this.totalResults.set(foundInvoices.length + foundProducts.length);
      this.isLoading.set(false);
    }, 500);
  }
}