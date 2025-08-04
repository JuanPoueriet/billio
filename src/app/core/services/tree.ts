import { Injectable } from '@angular/core';
import { Account } from '../models/account.model';
import { FlattenedAccount } from '../models/flattened-account.model';

@Injectable({ providedIn: 'root' })
export class TreeService {
  private flattenTree(
    accounts: Account[],
    level: number = 0,
    parentId: string | null = null
  ): FlattenedAccount[] {
    return accounts.flatMap(account => {
      const flattened: FlattenedAccount = {
        ...account,
        level,
        parentId,
        isExpanded: false,
        isDisabled: false,
      };
      const children = account.children ?? [];
      return [flattened, ...this.flattenTree(children, level + 1, account.id)];
    });
  }

  public getSelectableAccounts(
    accounts: Account[],
    currentAccountId?: string
  ): FlattenedAccount[] {
    const flat = this.flattenTree(accounts);
    if (!currentAccountId) {
      return flat;
    }
    // Construir un set de todos los descendientes de la cuenta actual
    const descendants = new Set<string>();
    const findDescendants = (parentId: string) => {
      for (const acc of flat) {
        if (acc.parentId === parentId) {
          descendants.add(acc.id);
          findDescendants(acc.id);
        }
      }
    };
    descendants.add(currentAccountId);
    findDescendants(currentAccountId);

    return flat.map(acc => ({
      ...acc,
      isDisabled: descendants.has(acc.id)
    }));
  }
}