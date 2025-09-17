import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Persona } from '../models/persona.model';
import { Direccion, Distrito, Provincia, Departamento, Pais } from '../models/persona.model';

// Para crear personas sin ID
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
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ===============================
  // 🔹 PERSONAS
  // ===============================
  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.apiUrl}/persona`);
  }

  getPersonasConUbicacion(): Observable<PersonaConUbicacion[]> {
    return this.http.get<Persona[]>(`${this.apiUrl}/persona`).pipe(
      switchMap(personas =>
        forkJoin({
          direcciones: this.getDirecciones(),
          distritos: this.getDistritos(),
          provincias: this.getProvincias(),
          departamentos: this.getDepartamentos(),
          paises: this.getPaises()
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
    return this.http.get<Persona>(`${this.apiUrl}/persona/${id}`);
  }

  addPersona(persona: PersonaCreate): Observable<Persona> {
    return this.http.post<Persona>(`${this.apiUrl}/persona`, persona);
  }

  updatePersona(persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/persona/${persona.id}`, persona);
  }

  deletePersona(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/persona/${id}`);
  }

  // ===============================
  // 🔹 PAISES
  // ===============================
  getPaises(): Observable<Pais[]> {
    return this.http.get<Pais[]>(`${this.apiUrl}/pais`);
  }
  addPais(pais: Pais): Observable<Pais> {
    return this.http.post<Pais>(`${this.apiUrl}/pais`, pais);
  }
  updatePais(pais: Pais): Observable<Pais> {
    return this.http.put<Pais>(`${this.apiUrl}/pais/${pais.id}`, pais);
  }
  deletePais(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pais/${id}`);
  }

  // ===============================
  // 🔹 DEPARTAMENTOS
  // ===============================
  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.apiUrl}/departamento`);
  }
  addDepartamento(dep: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(`${this.apiUrl}/departamento`, dep);
  }
  updateDepartamento(dep: Departamento): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.apiUrl}/departamento/${dep.id}`, dep);
  }
  deleteDepartamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/departamento/${id}`);
  }

  // ===============================
  // 🔹 PROVINCIAS
  // ===============================
  getProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.apiUrl}/provincia`);
  }
  addProvincia(prov: Provincia): Observable<Provincia> {
    return this.http.post<Provincia>(`${this.apiUrl}/provincia`, prov);
  }
  updateProvincia(prov: Provincia): Observable<Provincia> {
    return this.http.put<Provincia>(`${this.apiUrl}/provincia/${prov.id}`, prov);
  }
  deleteProvincia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/provincia/${id}`);
  }

  // ===============================
  // 🔹 DISTRITOS
  // ===============================
  getDistritos(): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(`${this.apiUrl}/distrito`);
  }
  addDistrito(dis: Distrito): Observable<Distrito> {
    return this.http.post<Distrito>(`${this.apiUrl}/distrito`, dis);
  }
  updateDistrito(dis: Distrito): Observable<Distrito> {
    return this.http.put<Distrito>(`${this.apiUrl}/distrito/${dis.id}`, dis);
  }
  deleteDistrito(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/distrito/${id}`);
  }

  // ===============================
  // 🔹 DIRECCIONES
  // ===============================
  getDirecciones(): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(`${this.apiUrl}/direccion`);
  }
  addDireccion(dir: Direccion): Observable<Direccion> {
    return this.http.post<Direccion>(`${this.apiUrl}/direccion`, dir);
  }
  updateDireccion(dir: Direccion): Observable<Direccion> {
    return this.http.put<Direccion>(`${this.apiUrl}/direccion/${dir.id}`, dir);
  }
  deleteDireccion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/direccion/${id}`);
  }
}
