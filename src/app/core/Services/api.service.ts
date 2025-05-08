import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
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

  private getHeaders(contentType: string = 'application/json'): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', contentType);
    
    const token = this.authService.currentToken;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  post(endpoint: string, data: any, useFormData: boolean = false): Observable<any> {
    if (useFormData) {
      return this.http.post(
        `${this.apiUrl}${endpoint}`, 
        data, 
        { headers: this.getHeaders() }
      ).pipe(
        catchError(this.handleError)
      );
    } else {
      return this.http.post(
        `${this.apiUrl}${endpoint}`, 
        data, 
        { headers: this.getHeaders('application/json') }
      ).pipe(
        catchError(this.handleError)
      );
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error en la solicitud';
    
    if (error.status === 409) {
      if (error.error?.id_card) {
        errorMessage = `El documento ${error.error.id_card} ya está registrado`;
      } else if (error.error?.email) {
        errorMessage = `El email ${error.error.email} ya está registrado`;
      } else if (error.error?.detail) {
        errorMessage = error.error.detail;
      } else {
        errorMessage = 'Registro duplicado: el documento o email ya existen';
      }
    } else if (error.status === 400) {
      errorMessage = 'Datos inválidos: ' + 
        (error.error ? JSON.stringify(error.error) : 'verifica los campos');
    } else if (error.status === 401 || error.status === 403) {
      errorMessage = 'No autorizado - sesión expirada';
    }
    
    console.error('Error detallado:', error);
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      serverError: error.error
    }));
  }
}