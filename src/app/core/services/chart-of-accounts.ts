// app/core/services/chart-of-accounts.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Account, CreateAccountDto } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class ChartOfAccountsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/chart-of-accounts`;

  /**
   * Obtiene todas las cuentas.
   * ✅ SE AÑADIÓ { withCredentials: true }
   */
  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl, { withCredentials: true });
  }

  /**
   * Obtiene una cuenta por su ID.
   * ✅ SE AÑADIÓ { withCredentials: true }
   */
  getAccountById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  /**
   * Crea una nueva cuenta.
   * ✅ SE AÑADIÓ { withCredentials: true }
   */
  createAccount(accountData: CreateAccountDto): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, accountData, { withCredentials: true });
  }

  /**
   * Actualiza una cuenta existente.
   * ✅ SE AÑADIÓ { withCredentials: true }
   */
  updateAccount(id: string, updates: Partial<CreateAccountDto>): Observable<Account> {
    return this.http.patch<Account>(`${this.apiUrl}/${id}`, updates, { withCredentials: true });
  }
}