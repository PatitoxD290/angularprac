import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; 
import { ProductoListComponent } from '../../components/producto-list/producto-list.component';
import { ProductoFormComponent } from '../../components/producto-form/producto-form.component';

@Component({
  selector: 'app-producto-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, ProductoListComponent, ProductoFormComponent], 
  templateUrl: './producto.html',
  styleUrls: ['./producto.css']
})
export class ProductoPage {
  mostrarFormulario = false;

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
}
