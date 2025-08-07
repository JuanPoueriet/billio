/**
 * =====================================================================================
 * ARCHIVO: src/app/features/accounting/chart-of-accounts/chart-of-accounts.page.ts
 * =====================================================================================
 * DESCRIPCIÓN:
 * Este componente es la página principal para visualizar y gestionar el Plan de Cuentas.
 * Actúa como la capa de presentación que consume el estado reactivo proporcionado por
 * `ChartOfAccountsStateService` y delega las acciones del usuario a dicho servicio.
 *
 * RESPONSABILIDADES:
 * - Mostrar la lista jerárquica de cuentas.
 * - Proveer controles de UI para filtrar por versión, jerarquía y término de búsqueda.
 * - Permitir la navegación a otras funcionalidades (crear/editar cuenta, operaciones
 * masivas, fusionar cuentas).
 * - Mostrar indicadores de carga y mensajes de error basados en el estado.
 * =====================================================================================
 */

import { Component, inject, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChartOfAccountsStateService } from '../../../core/state/chart-of-accounts.state';
import { HierarchyType } from '../../../core/models/account.model';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chart-of-accounts-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,  // Necesario para [(ngModel)]
    RouterLink    // Necesario para [routerLink]
  ],
  templateUrl: './chart-of-accounts.page.html',
  styleUrls: ['./chart-of-accounts.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartOfAccountsPage implements OnInit, OnDestroy {
  // --- INYECCIÓN DE DEPENDENCIAS Y ESTADO ---
  public readonly state = inject(ChartOfAccountsStateService);
  private readonly router = inject(Router);

  // Lógica para el debounce del input de búsqueda
  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  constructor() {
    // El estado ya se inicializa y carga los datos en su propio constructor.
    // No se necesita lógica de carga aquí.
  }

  /**
   * ngOnInit: Se configura el debounce para el campo de búsqueda.
   * Esto evita que se actualice el estado en cada pulsación de tecla, mejorando el rendimiento.
   */
  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300), // Espera 300ms después de la última pulsación antes de emitir
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.state.searchTerm.set(term);
    });
  }

  // --- MANEJADORES DE EVENTOS DE LA UI ---

  /**
   * Se llama cuando el usuario cambia la selección de la versión.
   * Delega la acción al servicio de estado.
   * @param version El número de la nueva versión seleccionada.
   */
  onVersionChange(version: number): void {
    this.state.selectVersion(Number(version));
  }

  /**
   * Se llama cuando el usuario cambia la selección de la jerarquía.
   * Delega la acción al servicio de estado.
   * @param hierarchy El nuevo tipo de jerarquía seleccionada.
   */
  onHierarchyChange(hierarchy: HierarchyType): void {
    this.state.selectHierarchy(hierarchy);
  }

  /**
   * Se llama en el evento (input) del campo de búsqueda.
   * Emite el nuevo término de búsqueda al searchSubject para el debouncing.
   * @param event El evento del input.
   */
  onSearchTermChange(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchSubject.next(term);
  }

  // --- NAVEGACIÓN ---

  /**
   * Navega al formulario de cuentas. Si se provee un ID, navega en modo edición.
   * @param id El ID opcional de la cuenta a editar.
   */
  goToAccountForm(id?: string): void {
    const route = id ? ['/accounting/account-form', id] : ['/accounting/account-form'];
    this.router.navigate(route);
  }

  /**
   * Navega a la página de operaciones masivas.
   */
  goToBulkOperations(): void {
    this.router.navigate(['/accounting/bulk-operations']);
  }

  /**
   * Navega a la herramienta de fusión de cuentas.
   */
  goToMergeTool(): void {
    this.router.navigate(['/accounting/merge-tool']);
  }

  // --- ACCIONES COMPLEJAS ---

  /**
   * Inicia el flujo para crear una nueva versión del plan de cuentas.
   * (Implementación futura: abriría un modal para confirmar y pedir fecha de efectividad).
   */
  createNewVersion(): void {
    console.log('Lógica para crear nueva versión pendiente de implementación.');
    // Ejemplo de cómo podría ser:
    // const baseVersion = this.state.selectedVersion();
    // this.modalService.open(CreateVersionModal, { data: { baseVersion } }).onClose.subscribe(result => {
    //   if (result && result.effectiveDate) {
    //     this.state.createVersion(baseVersion, result.effectiveDate);
    //   }
    // });
  }

  /**
   * ngOnDestroy: Limpia la suscripción al searchSubject para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
