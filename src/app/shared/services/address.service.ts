import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private BASE_URL = environment.apiAddress;

  constructor(private http: HttpClient) {}

  // 1. Obtener países con nombre y un "id" (aquí usaremos el nombre como identificador)
  getCountries(): Observable<{ id: string; name: string }[]> {
    return this.http.get<any>(this.BASE_URL).pipe(
      map(res =>
        res.data.map((item: any) => ({
          id: item.country,
          name: item.country
        }))
      )
    );
  }

  // 2. Obtener estados/departamentos por nombre de país
  getStatesByCountry(countryName: string): Observable<{ code: string, name: string }[]> {
    return this.http.post<any>(
      `${this.BASE_URL}/states`,
      { country: countryName }
    ).pipe(
      map(res =>
        res.data?.states?.map((s: any) => ({
          code: s.name,
          name: s.name.replace(/ Department$/i, '')
        })) || []
      )
    );
  }

  // 3. Obtener ciudades por estado (departamento) y país
  getCitiesByState(countryName: string, stateName: string): Observable<string[]> {
    return this.http.post<any>(
      `${this.BASE_URL}/state/cities`,
      {
        country: countryName,
        state: stateName
      }
    ).pipe(
      map(res => res.data || [])
    );
  }
}
