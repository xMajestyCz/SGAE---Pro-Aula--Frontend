import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from 'src/app/shared/models/student';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl= `${environment.apiUrl}students/`;
  constructor(private http:HttpClient) { }
  
  create(student: Student): Observable<any> {
    return this.http.post(this.apiUrl, student);
  }

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}${id}/`);
  }

  update(id: number, student: Student): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, student);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
  
}
