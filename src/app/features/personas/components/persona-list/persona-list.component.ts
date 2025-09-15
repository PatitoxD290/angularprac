import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PersonaService, Persona } from '../../../../core/services/persona.service';

@Component({
  selector: 'app-persona-list',
  standalone: true, // si es standalone
  imports: [CommonModule],
  templateUrl: './persona-list.component.html',
  styleUrls: ['./persona-list.component.css']
})
export class PersonaListComponent implements OnInit {
  personas: any[] = [];
  @Output() editar = new EventEmitter<Persona>();

  constructor(private personaService: PersonaService) {}

  ngOnInit(): void {
    this.cargarPersonas();
  }

  cargarPersonas() {
    this.personaService.getPersonasConUbicacion().subscribe(data => {
      this.personas = data;
    });
  }

  onEditar(p: Persona) {
    this.editar.emit(p);
  }
}
