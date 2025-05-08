import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guardian } from 'src/app/shared/models/guardian';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuardianService {
private apiUrl = `${environment.apiUrl}guardians/`;

  constructor(private http: HttpClient) {}

  create(guardian: Guardian): Observable<any> {
    return this.http.post(this.apiUrl, guardian);
  }

  update(id: number, guardian: Guardian): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, guardian);
  }

  getAll(): Observable< Guardian[]> {
    return this.http.get< Guardian[]>(this.apiUrl);
  }

  getById(id: number): Observable<Guardian> {
    return this.http.get<Guardian>(`${this.apiUrl}${id}/`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
  
}
