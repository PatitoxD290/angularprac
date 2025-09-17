export interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  telefono: string;
  id_direccion: number | string;
}

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

export interface Coordinates {
  lat: number;
  lng: number;
}