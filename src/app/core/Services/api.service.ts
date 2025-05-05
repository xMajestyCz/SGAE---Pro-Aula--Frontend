import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(contentType = 'application/json'): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', contentType);
    
    const token = this.authService.currentToken;
    if (token) {
      headers = headers.append('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  post<T>(endpoint: string, data: any, useFormData = false): Observable<T> {
    const contentType = useFormData ? 'multipart/form-data' : 'application/json';
    const headers = this.getHeaders(contentType);
    
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data, {
      headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error en la solicitud';
    
    if (error.status === 401 || error.status === 403) {
      errorMessage = 'Sesión expirada o no autorizado';
    } else if (error.error?.detail) {
      errorMessage = error.error.detail;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}