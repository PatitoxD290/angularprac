import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { UbicacionService, Direccion, Distrito, Provincia, Departamento, Pais } from '../services/direccion.service';

export interface Persona {
  id?: number;
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  telefono: string;
  id_direcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = 'http://localhost:3000/persona';

  constructor(private http: HttpClient, private ubicacionService: UbicacionService) {}

  // 🔹 Personas simples (sin relaciones)
  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl);
  }

  // 🔹 Personas con datos relacionados (direccion, distrito, provincia, departamento, pais)
  getPersonasConUbicacion() {
    return forkJoin({
      personas: this.http.get<Persona[]>(this.apiUrl),
      direcciones: this.ubicacionService.getDirecciones(),
      distritos: this.ubicacionService.getDistritos(),
      provincias: this.ubicacionService.getProvincias(),
      departamentos: this.ubicacionService.getDepartamentos(),
      paises: this.ubicacionService.getPaises()
    }).pipe(
      map(({ personas, direcciones, distritos, provincias, departamentos, paises }) =>
        personas.map(p => {
          const direccion = direcciones.find(d => d.id === +p.id_direcion);
          const distrito = direccion ? distritos.find(dis => dis.id === direccion.id_distrito) : null;
          const provincia = distrito ? provincias.find(prov => prov.id === distrito.id_provincia) : null;
          const departamento = provincia ? departamentos.find(dep => dep.id === provincia.id_departamento) : null;
          const pais = departamento ? paises.find(pa => pa.id === departamento.id_pais) : null;

          return {
            ...p,
            direccion,
            distrito,
            provincia,
            departamento,
            pais
          };
        })
      )
    );
  }

  getPersona(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/${id}`);
  }

  addPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.apiUrl, persona);
  }

  updatePersona(persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/${persona.id}`, persona);
  }

  deletePersona(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
