import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface Coordinates {
  lat: number;
  lng: number;
}

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) { }

  geocodeAddress(address: string): Observable<Coordinates | null> {
    if (!address || address.trim().length < 5) {
      return of(null);
    }

    const params = {
      q: address,
      format: 'json',
      limit: '1',
      addressdetails: '1',
      countrycodes: 'pe' // Priorizar Perú
    };

    return this.http.get<any[]>(this.nominatimUrl, { params }).pipe(
      map(response => {
        if (response && response.length > 0) {
          const result = response[0];
          return {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error en geocodificación:', error);
        return of(null);
      })
    );
  }

  geocodeFromComponents(
    direccion: string,
    distrito: string,
    provincia: string,
    departamento: string,
    pais: string
  ): Observable<Coordinates | null> {
    // Construir la dirección completa
    const fullAddress = this.buildFullAddress(direccion, distrito, provincia, departamento, pais);

    return this.geocodeAddress(fullAddress);
  }

  private buildFullAddress(
    direccion: string,
    distrito: string,
    provincia: string,
    departamento: string,
    pais: string
  ): string {
    const parts = [direccion];

    if (distrito && distrito !== 'N/A') parts.push(distrito);
    if (provincia && provincia !== 'N/A') parts.push(provincia);
    if (departamento && departamento !== 'N/A') parts.push(departamento);
    if (pais && pais !== 'N/A') parts.push(pais);

    return parts.join(', ');
  }
}