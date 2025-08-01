import { Component, inject, signal, HostListener, ElementRef, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { BrandingService } from '../../core/services/branding';
import { ThemeToggle } from '../../shared/components/theme-toggle/theme-toggle';

// Se importan todos los íconos, incluyendo el nuevo para "Aprobaciones"
import {
  LucideAngularModule, Search, PlusCircle, Bell, User, Settings, LogOut, ChevronDown,
  LayoutDashboard, ShoppingCart, Receipt, Package, Users as ContactsIcon, HardHat, CheckSquare, // Ícono para "Aprobaciones"
  FolderArchive,
  Database,
  UploadCloud,
  DownloadCloud,
  BookCopy,
  BarChartBig,
  Truck
} from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ThemeToggle, LucideAngularModule,TranslateModule,Sidebar],
  templateUrl: './main.layout.html',
  styleUrls: ['./main.layout.scss'],
})
export class MainLayout {
  private elementRef = inject(ElementRef);
  authService = inject(AuthService);
  brandingService = inject(BrandingService);

  settings = this.brandingService.settings;
  isUserMenuOpen = signal(false);

  @HostBinding('class')
  get layoutClass() {
    return `layout-${this.settings().layoutStyle}`;
  }

  // Íconos expuestos a la plantilla
  protected readonly SearchIcon = Search;
  protected readonly PlusCircleIcon = PlusCircle;
  protected readonly BellIcon = Bell;
  protected readonly UserIcon = User;
  protected readonly SettingsIcon = Settings;
  protected readonly LogOutIcon = LogOut;
  protected readonly ChevronDownIcon = ChevronDown;

  // Íconos de Navegación
  protected readonly DashboardIcon = LayoutDashboard;
  protected readonly MyWorkIcon = HardHat;
  protected readonly ApprovalsIcon = CheckSquare; // ✅ Nuevo ícono
  protected readonly DocumentsIcon = FolderArchive; // ✅ Nuevo ícono
  protected readonly PackageIcon = Package; // ✅ Nuevo ícono
  protected readonly SalesIcon = ShoppingCart;
  protected readonly InvoicesIcon = Receipt;
  protected readonly InventoryIcon = Package;
  protected readonly ContactsIcon = ContactsIcon;
  protected readonly MastersIcon = Database; // ✅ Nuevo ícono
  protected readonly DataImportsIcon = UploadCloud; // ✅ Nuevo ícono
  protected readonly DataExportsIcon = DownloadCloud; // ✅ Nuevo ícono
  protected readonly AccountingIcon = BookCopy; // ✅ Nuevo ícono
  protected readonly ReportsIcon = BarChartBig; // ✅ Nuevo ícono
    protected readonly PurchasingIcon = Truck; // ✅ Nuevo ícono



  
  toggleUserMenu(): void {
    this.isUserMenuOpen.update(isOpen => !isOpen);
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  private router = inject(Router); // ✅ Se inyecta el Router

  /**
   * ✅ NUEVO MÉTODO: Navega a la página de búsqueda global con el término introducido.
   */
  navigateToSearch(query: string): void {
    if (query && query.trim().length > 0) {
      this.router.navigate(['/app/global-search'], { queryParams: { q: query.trim() } });
    }
  }



  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const userMenuElement = this.elementRef.nativeElement.querySelector('.user-menu');
    if (userMenuElement && !userMenuElement.contains(event.target as Node)) {
      this.closeUserMenu();
    }
  }
}