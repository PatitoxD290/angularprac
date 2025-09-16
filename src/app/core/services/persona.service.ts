import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { UbicacionService, Direccion, Distrito, Provincia, Departamento, Pais } from '../services/direccion.service';

// Persona base
// Persona que ya existe en la BD
export interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  telefono: string;
  id_direccion: number | string;
}

// Persona para crear (sin id)
export type PersonaCreate = Omit<Persona, 'id'>;

export interface PersonaConUbicacion extends Persona {
  direccion?: Direccion | null;
  distrito?: Distrito | null;
  provincia?: Provincia | null;
  departamento?: Departamento | null;
  pais?: Pais | null;
}

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = 'http://localhost:3000/persona';

  constructor(private http: HttpClient, private ubicacionService: UbicacionService) {}

  // Personas simples
  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl);
  }

  // Personas con relaciones
  getPersonasConUbicacion(): Observable<PersonaConUbicacion[]> {
    return this.http.get<Persona[]>(this.apiUrl).pipe(
      switchMap(personas =>
        forkJoin({
          direcciones: this.ubicacionService.getDirecciones(),
          distritos: this.ubicacionService.getDistritos(),
          provincias: this.ubicacionService.getProvincias(),
          departamentos: this.ubicacionService.getDepartamentos(),
          paises: this.ubicacionService.getPaises()
        }).pipe(
          map(({ direcciones, distritos, provincias, departamentos, paises }) =>
            personas.map(p => {
              const direccion = direcciones.find(d => String(d.id) === String(p.id_direccion));
              const distrito = direccion ? distritos.find(dis => String(dis.id) === String(direccion.id_distrito)) : null;
              const provincia = distrito ? provincias.find(pr => String(pr.id) === String(distrito.id_provincia)) : null;
              const departamento = provincia ? departamentos.find(dep => String(dep.id) === String(provincia.id_departamento)) : null;
              const pais = departamento ? paises.find(pa => String(pa.id) === String(departamento.id_pais)) : null;

              return { ...p, direccion, distrito, provincia, departamento, pais };
            })
          )
        )
      )
    );
  }

  getPersona(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/${id}`);
  }

  // 👇 Aquí usas PersonaCreate en vez de Persona
  addPersona(persona: PersonaCreate): Observable<Persona> {
    return this.http.post<Persona>(this.apiUrl, persona);
  }

  updatePersona(persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/${persona.id}`, persona);
  }

  deletePersona(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
