import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; 
import { PersonaListComponent } from '../../components/persona-list/persona-list.component';
import { PersonaFormComponent } from '../../components/persona-form/persona-form.component';

@Component({
  selector: 'app-persona-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, PersonaListComponent, PersonaFormComponent], 
  templateUrl: './persona.html',
  styleUrls: ['./persona.css']
})
export class PersonaPage {
  mostrarFormulario = false;

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
}
