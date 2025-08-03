import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JournalEntry } from '../models/journal-entry.model';

// Usaremos un DTO (Data Transfer Object) para la creación, 
// ya que no necesitamos enviar todos los campos de JournalEntry.
type CreateJournalEntryDto = Omit<JournalEntry, 'id' | 'organizationId' | 'createdAt' | 'updatedAt' | 'totalDebit' | 'totalCredit'>;


@Injectable({
  providedIn: 'root'
})
export class JournalEntries {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/journal-entries`;

  getAll(): Observable<JournalEntry[]> {
    return this.http.get<JournalEntry[]>(this.apiUrl);
  }

  getById(id: string): Observable<JournalEntry> {
    return this.http.get<JournalEntry>(`${this.apiUrl}/${id}`);
  }

  create(entry: CreateJournalEntryDto): Observable<JournalEntry> {
    return this.http.post<JournalEntry>(this.apiUrl, entry);
  }
}