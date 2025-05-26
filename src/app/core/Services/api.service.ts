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
  private selectedRole: string = '';

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

  get(endpoint: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}${endpoint}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  put(endpoint: string, data: any): Observable<any> {
    const headers = this.getHeaders('application/json');
    return this.http.put(
      `${this.apiUrl}${endpoint}`,
      data,
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  delete(endpoint: string, id: string | number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}${endpoint}${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }

  getEndpointByRole(role?: string): string {
    const roleToUse = role || this.selectedRole;
    const roleEndpoints: Record<string, string> = {
      'rector': 'directors/',
      'profesor': 'teachers/',
      'estudiante': 'students/',
      'acudiente': 'guardians/',
      'coordinador': 'academics_coordinators/',
      'secretaria': 'secretaries/'
    };
    
    return roleEndpoints[roleToUse] || 'users/';
  }

  public setSelectedRole(role: string): void {
    this.selectedRole = role;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error en la solicitud';
    
    if (error.status === 409) {
      errorMessage = this.handleDuplicateError(error.error);
    } else if (error.status === 400) {
      errorMessage = 'Datos inválidos: ' + 
        (error.error ? JSON.stringify(error.error) : 'verifica los campos');
    } else if (error.status === 401 || error.status === 403) {
      errorMessage = 'No autorizado - sesión expirada';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }
    
    console.error('Error detallado:', error);
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      serverError: error.error
    }));
  }

  private handleDuplicateError(errorData: any): string {
    let errorMessage = 'Datos duplicados: ';
    
    if (Array.isArray(errorData?.non_field_errors)) {
      errorMessage += errorData.non_field_errors.join(', ');
    } else if (errorData?.id_card) {
      errorMessage += `El documento ${errorData.id_card} ya existe`;
    } else if (errorData?.email) {
      errorMessage += `El email ${errorData.email} ya existe`;
    } else if (errorData?.detail) {
      errorMessage += errorData.detail;
    } else {
      errorMessage += 'El documento o email ya están registrados';
    }
    
    return errorMessage;
  }
}