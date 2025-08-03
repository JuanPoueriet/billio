import { Injectable } from '@angular/core';
import { Account } from '../models/account.model';

// Definir tipo extendido
type AccountWithDisabled = Account & { 
  isDisabled?: boolean;
  children?: AccountWithDisabled[];
};

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  flattenForSelect(accounts: Account[]): any[] {
    throw new Error('Method not implemented.');
  }
  constructor() {}

  flattenTree(accounts: Account[], level: number = 0): any[] {
    let flattened: any[] = [];
    for (const account of accounts) {
      flattened.push({ ...account, level });
      if (account.children && account.children.length > 0) {
        flattened = flattened.concat(this.flattenTree(account.children, level + 1));
      }
    }
    return flattened;
  }

  filterDisabledAccounts(accounts: Account[], currentAccountId: string): AccountWithDisabled[] {
    const disabledIds = new Set<string>();
    
    const findAccount = (id: string, list: Account[]): Account | null => {
      for (const acc of list) {
        if (acc.id === id) return acc;
        if (acc.children && acc.children.length > 0) {
          const found = findAccount(id, acc.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const disableChildren = (account: Account) => {
      disabledIds.add(account.id);
      if (account.children) {
        for (const child of account.children) {
          disableChildren(child);
        }
      }
    };
    
    const currentAccount = findAccount(currentAccountId, accounts);
    if (currentAccount) {
      disableChildren(currentAccount);
    }
    
    return accounts.map(acc => this.cloneAccountWithDisabled(acc, disabledIds));
  }

  private cloneAccountWithDisabled(account: Account, disabledIds: Set<string>): AccountWithDisabled {
    return {
      ...account,
      isDisabled: disabledIds.has(account.id),
      children: account.children 
        ? account.children.map(child => this.cloneAccountWithDisabled(child, disabledIds)) 
        : []
    };
  }
}