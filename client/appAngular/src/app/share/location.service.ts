import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'https://ubicaciones.paginasweb.cr/';

  constructor(private http: HttpClient) { }

  getProvinces() {
    return this.http.get<any[]>(`${this.apiUrl}/provincias.json`);
  }

  getCantons(provinceId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/provincia/${provinceId}/cantones.json`);
  }

  getDistricts(provinceId: string, cantonId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/provincia/${provinceId}/canton/${cantonId}/distritos.json`);
  }
}
