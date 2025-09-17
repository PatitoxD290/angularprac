import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { produc } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000'; // Ajusta al puerto/endpoint de tu backend

  constructor(private http: HttpClient) {}

  // ===============================
  // 🔹 PRODUCTOS
  // ===============================
  getProductos(): Observable<produc[]> {
    return this.http.get<produc[]>(`${this.apiUrl}/producto`);
  }

  getProducto(id: number): Observable<produc> {
    return this.http.get<produc>(`${this.apiUrl}/producto/${id}`);
  }

  addProducto(producto: produc): Observable<produc> {
    return this.http.post<produc>(`${this.apiUrl}/producto`, producto);
  }

  updateProducto(producto: produc): Observable<produc> {
    return this.http.put<produc>(`${this.apiUrl}/producto/${producto.id}`, producto);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/producto/${id}`);
  }
}
