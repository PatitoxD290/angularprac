import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces
export interface Pais {
  id?: number;
  nombre: string;
}

export interface Departamento {
  id?: number;
  nombre: string;
  id_pais: number;
}

export interface Provincia {
  id?: number;
  nombre: string;
  id_departamento: number;
}

export interface Distrito {
  id?: number;
  nombre: string;
  id_provincia: number;
}

export interface Direccion {
  id?: number;
  id_distrito: number;
  codpostal: string;
  coordenadas: string;
}

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private apiUrl = 'http://localhost:3000'; 
  constructor(private http: HttpClient) {}

  // 🔹 PAISES
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

  // 🔹 DEPARTAMENTOS
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

  // 🔹 PROVINCIAS
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

  // 🔹 DISTRITOS
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

  // 🔹 DIRECCIONES
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
