import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service'; // Asegúrate de que la ruta sea correcta
import { Group } from 'src/app/shared/models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private apiService: ApiService) { }
    getGroups(): Observable<Group[]> {
    return this.apiService.get('groups'); // Llama al endpoint de grupos
  }
}
