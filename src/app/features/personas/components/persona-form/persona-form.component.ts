import { Component, OnInit, signal } from '@angular/core';
import { PersonaService, PersonaCreate } from '../../../../core/services/persona.service';
import { Pais, Departamento, Provincia, Distrito, Direccion } from '../../../../core/models/persona.model';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-persona-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './persona-form.component.html',
  styleUrls: ['./persona-form.component.css']
})
export class PersonaFormComponent implements OnInit {
  hide = signal(true);
  personaForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  // listas dinámicas
  paises: Pais[] = [];
  departamentos: Departamento[] = [];
  provincias: Provincia[] = [];
  distritos: Distrito[] = [];

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService
  ) {}

  ngOnInit(): void {
    this.personaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}-\d$/)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{1,13}$/)]],
      pais: ['', Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      codpostal: ['', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]],
      coordenadas: [''],
      direccion: ['', Validators.required],
    });

    // cargar países
    this.personaService.getPaises().subscribe(data => this.paises = data);

    // filtrar departamentos
    this.personaForm.get('pais')?.valueChanges.subscribe(idPais => {
      if (idPais) {
        this.personaService.getDepartamentos().subscribe(deps => {
          this.departamentos = deps.filter(d => d.id_pais.toString() === idPais.toString());
          this.provincias = [];
          this.distritos = [];
          this.personaForm.patchValue({ departamento: '', provincia: '', distrito: '' });
        });
      }
    });

    // filtrar provincias
    this.personaForm.get('departamento')?.valueChanges.subscribe(idDep => {
      if (idDep) {
        this.personaService.getProvincias().subscribe(provs => {
          this.provincias = provs.filter(p => p.id_departamento.toString() === idDep.toString());
          this.distritos = [];
          this.personaForm.patchValue({ provincia: '', distrito: '' });
        });
      }
    });

    // filtrar distritos
    this.personaForm.get('provincia')?.valueChanges.subscribe(idProv => {
      if (idProv) {
        this.personaService.getDistritos().subscribe(dists => {
          this.distritos = dists.filter(d => d.id_provincia.toString() === idProv.toString());
          this.personaForm.patchValue({ distrito: '' });
        });
      }
    });
  }

  onSubmit() {
    if (this.personaForm.invalid) {
      this.error = 'Por favor completa correctamente todos los campos';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const formValue = this.personaForm.value;

    // 1️⃣ Crear la dirección primero
    const direccion: Direccion = {
      id_distrito: formValue.distrito,
      codpostal: formValue.codpostal,
      coordenadas: formValue.coordenadas
    };

    this.personaService.addDireccion(direccion).subscribe({
      next: (dirCreada) => {
        // 2️⃣ Crear la persona con el id de la dirección recién creada
        const persona: PersonaCreate = {
          nombre: formValue.nombre,
          apellido: formValue.apellido,
          dni: formValue.dni,
          correo: formValue.correo,
          telefono: formValue.telefono,
          id_direccion: dirCreada.id!
        };

        this.personaService.addPersona(persona).subscribe({
          next: () => {
            this.loading = false;
            this.success = 'Persona registrada con éxito';
            this.personaForm.reset();
          },
          error: (err) => {
            this.loading = false;
            console.error('Error al guardar persona:', err);
            this.error = 'No se pudo registrar la persona';
          }
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al guardar dirección:', err);
        this.error = 'No se pudo registrar la dirección';
      }
    });
  }

  onCancel() {
    this.personaForm.reset();
    this.error = null;
    this.success = null;
  }

  getError(field: string) {
    const control = this.personaForm.get(field);
    if (!control || !control.touched) return null;

    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('pattern')) {
      if (field === 'nombre' || field === 'apellido')
        return 'No se permiten números ni caracteres especiales';
      if (field === 'dni') return 'Debe tener formato 12345678-9';
      if (field === 'telefono') return 'El teléfono solo debe contener hasta 13 dígitos';
      if (field === 'codpostal') return 'El código postal debe ser solo numérico';
    }
    if (control.hasError('email')) return 'Formato de correo no válido';
    return null;
  }
}
