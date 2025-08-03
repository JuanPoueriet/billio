import { 
  Component, 
  inject, 
  OnInit, 
  OnDestroy, 
  DestroyRef, 
  computed,
  Signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ChartOfAccountsStateService } from '../../../core/state/chart-of-accounts.state';
import { 
  AccountType, 
  AccountTypeTranslations 
} from '../../../core/models/account.model';
import { FlattenedAccount } from '../../../core/models/flattened-account.model';
import { 
  LucideAngularModule, 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  PlusCircle, 
  RefreshCw, 
  ArrowDown, 
  ArrowUp, 
  AlertCircle, 
  FileSearch, 
  Search
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.page.html',
  styleUrls: ['./chart-of-accounts.page.scss'],
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
})
export class ChartOfAccountsPage implements OnInit, OnDestroy {
  // Servicios inyectados
  public state = inject(ChartOfAccountsStateService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // Iconos
  protected readonly ChevronDownIcon = ChevronDown;
  protected readonly ChevronRightIcon = ChevronRight;
  protected readonly EditIcon = Edit;
  protected readonly PlusCircleIcon = PlusCircle;
  protected readonly RefreshIcon = RefreshCw;
  protected readonly ExpandAllIcon = ArrowDown;
  protected readonly CollapseAllIcon = ArrowUp;
  protected readonly AlertCircleIcon = AlertCircle;
  protected readonly FileSearchIcon = FileSearch;
  protected readonly SearchIcon = Search;

  // Estado expuesto desde el servicio
  public displayAccounts: Signal<FlattenedAccount[]> = this.state.displayAccounts;
  public loading: Signal<boolean> = this.state.loading;
  public error: Signal<string | null> = this.state.error;
  public accountTypeTranslations = AccountTypeTranslations;
  public accountTypes = Object.values(AccountType);
  
  // Variables locales para filtros
  public searchInput = '';
  public selectedType: AccountType | 'all' = 'all';

  // Estado de carga para acciones
  public reloading = false;
  public expandingAll = false;
  public collapsingAll = false;

  // Computed: Verifica si hay cuentas para mostrar
  public hasAccountsToDisplay = computed(() => {
    return !this.loading() && !this.error() && this.displayAccounts().length > 0;
  });

  // Computed: Verifica si el estado está vacío
  public isEmptyState = computed(() => {
    return !this.loading() && !this.error() && this.displayAccounts().length === 0;
  });

  constructor() {
    // Convertir señales a observables
    const searchQuery$ = toObservable(this.state.searchQuery);
    const selectedType$ = toObservable(this.state.selectedType);

    // Sincronizar estado de búsqueda (con tipado explícito)
    searchQuery$.subscribe((query: string) => {
      this.searchInput = query;
    });

    // Sincronizar tipo seleccionado (con tipado explícito)
    selectedType$.subscribe((type: AccountType | 'all') => {
      this.selectedType = type;
    });
  }

  ngOnInit(): void {
    // No es necesario hacer nada adicional aquí
  }

  // Métodos de UI
  onSearchInput(): void {
    this.state.setSearchQuery(this.searchInput);
  }

  onTypeChange(): void {
    this.state.setSelectedType(this.selectedType);
  }

  toggleExpand(accountId: string): void {
    this.state.toggleExpand(accountId);
  }

  reloadAccounts(): void {
    this.reloading = true;
    this.state.loadAccounts();
    
    // Simular tiempo de espera para feedback visual
    setTimeout(() => {
      this.reloading = false;
    }, 1000);
  }

  expandAll(): void {
    this.expandingAll = true;
    this.state.expandAll();
    
    // Feedback visual
    setTimeout(() => {
      this.expandingAll = false;
    }, 500);
  }

  collapseAll(): void {
    this.collapsingAll = true;
    this.state.collapseAll();
    
    // Feedback visual
    setTimeout(() => {
      this.collapsingAll = false;
    }, 500);
  }

  navigateToEdit(accountId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/app/accounting/chart-of-accounts', accountId, 'edit']);
  }

  navigateToCreate(): void {
    this.router.navigate(['/app/accounting/chart-of-accounts/new']);
  }

  // Obtener jerarquía visual para indicadores
  getHierarchyLines(level: number): { vertical: boolean; horizontal: boolean }[] {
    const lines: { vertical: boolean; horizontal: boolean }[] = [];
    
    // Solo para niveles mayores a 0
    if (level > 0) {
      // Añadir línea vertical para cada nivel
      for (let i = 1; i < level; i++) {
        lines.push({ vertical: true, horizontal: false });
      }
      
      // Añadir línea horizontal para el último nivel
      lines.push({ vertical: false, horizontal: true });
    }
    
    return lines;
  }

  // Manejar clic en fila
  onRowClick(accountId: string, hasChildren: boolean, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    if (hasChildren) {
      this.toggleExpand(accountId);
    } else {
      this.navigateToEdit(accountId);
    }
  }

  ngOnDestroy(): void {
    // No es necesario limpieza manual
  }

  // TrackBy para optimización de rendimiento
  trackByAccountId(index: number, account: FlattenedAccount): string {
    return account.id;
  }
}