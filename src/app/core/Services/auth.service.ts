import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl=environment.backendUrl

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.backendUrl, credentials).pipe(
      catchError(error => {
        console.error('Error en autenticación', error);
        return throwError(() => new Error('Error de autenticación'));
      })
    );
  }
}