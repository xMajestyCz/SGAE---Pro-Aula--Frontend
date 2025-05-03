import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(catchError(this.handleError));
  }
  private handleError(error: any) {
    console.error('Error en la petición HTTP:', error);
    return throwError(() => new Error(error.message || 'Error desconocido en la API'));
  }


}
