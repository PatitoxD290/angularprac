import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PersonaService, Persona, PersonaConUbicacion } from '../../../../core/services/persona.service';

@Component({
  selector: 'app-persona-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './persona-list.component.html',
  styleUrls: ['./persona-list.component.css']
})
export class PersonaListComponent implements OnInit {
  personas: PersonaConUbicacion[] = [];
  displayedColumns: string[] = [
    'nombre',
    'apellido',
    'dni',
    'correo',
    'telefono',
    'distrito',
    'provincia',
    'departamento',
    'pais',
    'acciones'
  ];

  @Output() editar = new EventEmitter<Persona>();

  constructor(
    private personaService: PersonaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPersonas();
  }

  cargarPersonas() {
    this.personaService.getPersonasConUbicacion().subscribe(data => {
      this.personas = data;
      this.cdr.detectChanges(); // 🔑 fuerza a Angular a refrescar la vista
    });
  }

  onEditar(p: Persona) {
    this.editar.emit(p);
  }

  onEliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar esta persona?')) {
      this.personaService.deletePersona(id).subscribe(() => this.cargarPersonas());
    }
  }
}
