import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}auth/`;
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    this.loadTokens();
  }

  private loadTokens(): void {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken) this.tokenSubject.next(accessToken);
    if (refreshToken) this.refreshTokenSubject.next(refreshToken);
  }

  get currentToken(): string | null {
    return this.tokenSubject.value;
  }

  get currentRefreshToken(): string | null {
    return this.refreshTokenSubject.value;
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, credentials).pipe(
      tap((response: any) => {
        if (response?.access && response?.refresh) {
          this.setTokens(response.access, response.refresh);
          const decodedToken = jwtDecode<any>(response.access);
          localStorage.setItem('userData', JSON.stringify(decodedToken));
        }
      })
    );
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.tokenSubject.next(accessToken);
    this.refreshTokenSubject.next(refreshToken);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('UserRole');
    this.tokenSubject.next(null);
    this.refreshTokenSubject.next(null);
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.currentRefreshToken;
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http.post(`${this.apiUrl}token/refresh/`, { refresh: refreshToken }).pipe(
      tap((response: any) => {
        if (response?.access) {
          localStorage.setItem('accessToken', response.access);
          this.tokenSubject.next(response.access);
        }
      })
    );
  }
}