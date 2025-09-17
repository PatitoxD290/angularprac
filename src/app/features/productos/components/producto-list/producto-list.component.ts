import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductoService } from '../../../../core/services/producto.service';
import { produc } from '../../../../core/models/producto.model';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css']
})
export class ProductoListComponent implements OnInit {
  productos: produc[] = [];
  displayedColumns: string[] = [
    'nombre',
    'descripcion',
    'cantidad',
    'categoria',
    'costo',
    'precioxunidad',
    'acciones'
  ];

  @Output() editar = new EventEmitter<produc>();

  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
      this.cdr.detectChanges(); // 🔑 fuerza a Angular a refrescar la vista
    });
  }

  onEditar(p: produc) {
    this.editar.emit(p);
  }

  onEliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe(() => this.cargarProductos());
    }
  }
}
