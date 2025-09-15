import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-pruebas',
  imports: [FormsModule],
  templateUrl: './pruebas.component.html',
  styleUrl: './pruebas.component.css'
})
export class PruebasComponent {

  nombre: string = ""
  usuarioActivo = {nombre : 'Pedro'};

  productos = [
    {id: 1, nombre: 'Pato', precio: 10},
    {id: 2, nombre: 'Peto', precio: 12},
    {id: 3, nombre: 'Psto', precio: 9}
  ]
}
