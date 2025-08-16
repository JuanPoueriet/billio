import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from './roles.service';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  passwordHash: string | null; // El backend no lo envía, pero la entidad lo tiene
  roles: Role[];
}

export interface InviteUserDto {
    firstName: string;
    lastName: string;
    email: string;
    roleId: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  inviteUser(userData: InviteUserDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/invite`, userData);
  }
  
  setUserStatus(userId: string, isActive: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}/status`, { isActive });
  }

  sendPasswordReset(userId: string): Observable<void> {
      return this.http.post<void>(`${this.apiUrl}/${userId}/reset-password`, {});
  }
}