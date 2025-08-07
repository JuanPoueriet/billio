/**
 * =====================================================================================
 * ARCHIVO: src/app/core/services/tree.service.ts
 * =====================================================================================
 * DESCRIPCIÓN:
 * Este servicio proporciona utilidades para trabajar con estructuras de datos
 * jerárquicas (árboles). Su principal responsabilidad es convertir una lista plana de
 * elementos (como cuentas contables) en un árbol anidado y viceversa.
 *
 * MÉTODOS PRINCIPALES:
 * - buildTree: Construye una estructura de árbol a partir de un array plano de cuentas.
 * - flattenTree: Aplana una estructura de árbol para facilitar su renderizado en la UI.
 * =====================================================================================
 */

import { Injectable } from '@angular/core';
import { Account } from '../models/account.model';
import { FlattenedAccount } from '../models/flattened-account.model';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  constructor() { }

  /**
   * Construye una estructura de árbol jerárquico a partir de una lista plana de cuentas.
   * El algoritmo es eficiente (complejidad O(n)) ya que solo recorre la lista una vez.
   *
   * @param accounts El array plano de cuentas obtenido de la API. Cada cuenta debe tener 'id' y 'parentId'.
   * @returns Un array de cuentas de nivel raíz (aquellas sin padre), con sus respectivos hijos anidados.
   */
  public buildTree(accounts: Account[]): Account[] {
    // Si la lista de entrada está vacía o no es un array, devolver un array vacío para evitar errores.
    if (!Array.isArray(accounts) || accounts.length === 0) {
      return [];
    }

    // Paso 1: Crear un mapa para un acceso rápido a cada cuenta por su ID.
    // Esto evita tener que buscar en el array repetidamente (lo que sería O(n^2)).
    const accountMap = new Map<string, Account>();
    accounts.forEach(account => {
      // Inicializar la propiedad 'children' en cada cuenta para poder añadirle descendientes.
      account.children = [];
      accountMap.set(account.id, account);
    });

    // Paso 2: Iterar sobre la lista de cuentas para asignar cada una a su padre.
    const rootAccounts: Account[] = [];
    accounts.forEach(account => {
      if (account.parentId) {
        const parent = accountMap.get(account.parentId);
        if (parent) {
          // Si se encuentra el padre, se añade la cuenta actual a su array de hijos.
          parent.children?.push(account);
        } else {
          // Si no se encuentra el padre (cuenta huérfana), se trata como una cuenta raíz.
          rootAccounts.push(account);
        }
      } else {
        // Si la cuenta no tiene parentId, es una cuenta de nivel raíz.
        rootAccounts.push(account);
      }
    });

    return rootAccounts;
  }

  /**
   * Aplana una estructura de árbol de cuentas en una lista plana, añadiendo propiedades
   * de UI como el nivel de profundidad. Utiliza un enfoque recursivo.
   *
   * @param tree El array de cuentas de nivel raíz (el resultado de buildTree).
   * @returns Un array de `FlattenedAccount` listo para ser renderizado en una vista de tabla/lista.
   */
  public flattenTree(tree: Account[]): FlattenedAccount[] {
    const flattened: FlattenedAccount[] = [];

    // Función recursiva interna para procesar cada nivel del árbol.
    const flatten = (nodes: Account[], level: number) => {
      for (const node of nodes) {
        // 1. Añadir el nodo actual a la lista plana, extendiéndolo con las propiedades de UI.
        flattened.push({
          ...node,
          level: level,
          isExpanded: false, // Por defecto, los nodos están colapsados.
          hasChildren: !!node.children && node.children.length > 0
        });

        // 2. Si el nodo tiene hijos, llamar recursivamente a la función para ellos.
        if (node.children && node.children.length > 0) {
          flatten(node.children, level + 1);
        }
      }
    };

    // Iniciar el proceso de aplanamiento desde el nivel raíz (nivel 0).
    flatten(tree, 0);
    return flattened;
  }
}
