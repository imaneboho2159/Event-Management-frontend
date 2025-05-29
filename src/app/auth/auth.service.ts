import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
}

export interface UserDetails {
  email: string;
  authorities: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private userSubject = new BehaviorSubject<UserDetails | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing token and user data
    const token = this.getToken();
    if (token) {
      this.validateAndUpdateUserState();
    }
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.validateAndUpdateUserState();
        })
      );
  }

  register(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, request)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.validateAndUpdateUserState();
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private validateAndUpdateUserState(): void {
    // This endpoint should validate the token and return user details
    this.http.get<UserDetails>(`${this.API_URL}/validate`).subscribe({
      next: (userDetails) => {
        this.userSubject.next(userDetails);
      },
      error: () => {
        this.logout();
      }
    });
  }

  hasRole(role: string): boolean {
    const user = this.userSubject.value;
    return user?.authorities?.includes(role) || false;
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }
} 