/**
 * =====================================================================================
 * ARCHIVO: src/app/core/state/chart-of-accounts.state.ts
 * =====================================================================================
 * DESCRIPCIÓN:
 * Este servicio de estado (`StateService`) actúa como la única fuente de verdad (Single
 * Source of Truth) para todo lo relacionado con el Plan de Cuentas. Utiliza Angular
 * Signals para gestionar el estado de forma reactiva.
 *
 * RESPONSABILIDADES:
 * - Almacenar el estado actual de los filtros (versión, jerarquía, búsqueda).
 * - Cargar y almacenar la lista de cuentas desde el backend.
 * - Procesar las cuentas para su visualización (construir árbol, aplanar).
 * - Exponer el estado a través de signals para que los componentes puedan consumirlo
 * de manera reactiva y eficiente.
 * - Centralizar las acciones que modifican el estado (e.g., cambiar de versión).
 * =====================================================================================
 */

import { Injectable, computed, signal, effect, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { ChartOfAccountsService } from '../services/chart-of-accounts.service';
// import { TreeService } from '../services/tree.service';
import { Account, HierarchyType } from '../models/account.model';
import { FlattenedAccount } from '../models/flattened-account.model';
import { ChartOfAccountsService } from '../services/chart-of-accounts';
import { TreeService } from '../services/tree';

@Injectable({ providedIn: 'root' })
export class ChartOfAccountsStateService implements OnDestroy {
  // --- INYECCIÓN DE DEPENDENCIAS ---
  private readonly chartOfAccountsService = inject(ChartOfAccountsService);
  private readonly treeService = inject(TreeService);

  // --- SEÑALES DE ESTADO (STATE SIGNALS) ---
  // Las señales son los bloques de construcción del estado reactivo.

  // Estado de carga y errores
  public readonly isLoading = signal<boolean>(true);
  public readonly error = signal<string | null>(null);

  // Filtros y selecciones del usuario
  public readonly selectedVersion = signal<number>(0); // 0 indica que aún no se ha cargado una versión válida
  public readonly selectedHierarchy = signal<HierarchyType>('LEGAL');
  public readonly searchTerm = signal<string>('');
  public readonly accountTypeFilter = signal<string[]>([]);

  // Datos crudos y procesados
  public readonly versions = signal<number[]>([]); // Lista de versiones disponibles (e.g., [1, 2, 3])
  private readonly allAccounts = signal<Account[]>([]); // Almacén de cuentas "crudas" de la versión/jerarquía actual
  public readonly flattenedAccounts = signal<FlattenedAccount[]>([]); // Cuentas aplanadas para la vista de árbol

  // --- SEÑALES COMPUTADAS (COMPUTED SIGNALS) ---
  // Se recalculan automáticamente cuando una de sus señales dependientes cambia.

  /**
   * La lista de cuentas que se debe mostrar en la UI.
   * Aplica los filtros de búsqueda y tipo sobre la lista aplanada de cuentas.
   */
  public readonly displayAccounts = computed<FlattenedAccount[]>(() => {
    const flatAccounts = this.flattenedAccounts();
    const term = this.searchTerm().toLowerCase();
    const types = this.accountTypeFilter();

    // Si no hay filtros activos, devolver la lista completa para un rendimiento óptimo.
    if (!term && types.length === 0) {
      return flatAccounts;
    }

    // Aplicar filtros
    return flatAccounts.filter(account => {
      const nameMatch = account.name.toLowerCase().includes(term);
      const codeMatch = account.code.toLowerCase().includes(term);
      const typeMatch = types.length > 0 ? types.includes(account.type) : true;
      
      return (nameMatch || codeMatch) && typeMatch;
    });
  });

  private readonly destroy$ = new Subject<void>();

  constructor() {
    // `effect` es una función reactiva que se ejecuta cuando cualquiera de las
    // señales leídas dentro de ella cambia. Es perfecto para manejar efectos
    // secundarios como llamadas a una API.
    effect(() => {
      const version = this.selectedVersion();
      const hierarchy = this.selectedHierarchy();
      
      // Solo cargar si se ha seleccionado una versión válida (diferente de 0)
      if (version > 0) {
        this.loadAccounts(version, hierarchy);
      }
    });

    // Carga inicial de la aplicación
    this.loadInitialData();
  }

  // --- MÉTODOS PÚBLICOS (ACCIONES PARA MODIFICAR EL ESTADO) ---

  /**
   * Carga los datos iniciales de la aplicación, principalmente la lista de versiones
   * disponibles del plan de cuentas.
   */
  public loadInitialData(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.chartOfAccountsService.getVersions().pipe(takeUntil(this.destroy$)).subscribe({
      next: (versions) => {
        this.versions.set(versions);
        if (versions.length > 0) {
          // Seleccionar la versión más reciente por defecto.
          // Esto disparará automáticamente el `effect` para cargar las cuentas.
          this.selectedVersion.set(Math.max(...versions));
        } else {
          // No hay versiones, el estado de carga termina y se muestra un error.
          this.isLoading.set(false);
          this.error.set('No se encontraron versiones del plan de cuentas.');
        }
      },
      error: (err) => {
        this.error.set('Error crítico: No se pudieron cargar las versiones del plan de cuentas.');
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Acción para cambiar la versión seleccionada.
   * El `effect` se encargará automáticamente de recargar los datos.
   * @param version El nuevo número de versión a seleccionar.
   */
  public selectVersion(version: number): void {
    if (this.selectedVersion() !== version) {
      this.selectedVersion.set(version);
    }
  }

  /**
   * Acción para cambiar la jerarquía seleccionada.
   * El `effect` se encargará automáticamente de recargar los datos.
   * @param hierarchy El nuevo tipo de jerarquía a seleccionar.
   */
  public selectHierarchy(hierarchy: HierarchyType): void {
    if (this.selectedHierarchy() !== hierarchy) {
      this.selectedHierarchy.set(hierarchy);
    }
  }

  /**
   * Acción para forzar una recarga de los datos del plan de cuentas actual.
   * Útil después de una operación de creación, edición o importación masiva.
   */
  public refreshAccounts(): void {
    if (this.selectedVersion() > 0) {
      this.loadAccounts(this.selectedVersion(), this.selectedHierarchy());
    }
  }

  /**
   * Limpia las suscripciones para prevenir fugas de memoria cuando el servicio es destruido.
   */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- MÉTODOS PRIVADOS DE LÓGICA INTERNA ---

  /**
   * Orquesta la carga de la lista de cuentas para una versión y jerarquía específicas.
   * @param version La versión a cargar.
   * @param hierarchy La jerarquía a cargar.
   */
  private loadAccounts(version: number, hierarchy: HierarchyType): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.chartOfAccountsService.getAccounts(version, hierarchy)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accounts) => {
          this.allAccounts.set(accounts);
          // Una vez cargadas las cuentas, se procesan para la vista de árbol.
          const tree = this.treeService.buildTree(accounts);
          const flattenedTree = this.treeService.flattenTree(tree);
          this.flattenedAccounts.set(flattenedTree);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('No se pudieron cargar las cuentas para la selección actual.');
          console.error(err);
          this.allAccounts.set([]);
          this.flattenedAccounts.set([]);
          this.isLoading.set(false);
        }
      });
  }
}
