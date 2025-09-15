import { Component, OnInit, signal } from '@angular/core';
import { PersonaService, Persona } from '../../../../core/services/persona.service';
import { UbicacionService, Pais, Departamento, Provincia, Distrito } from '../../../../core/services/direccion.service';

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
    private personaService: PersonaService,
    private ubicacionService: UbicacionService
  ) {}

  ngOnInit(): void {
    this.personaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}-\d$/)]], // 8 dígitos + '-' + 1 dígito
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{1,13}$/)]], // máx 13 dígitos
      direccion: ['', Validators.required],
      pais: ['', Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      coordenadas: [''],
      codpostal: ['', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]],
    });

    // cargar países
    this.ubicacionService.getPaises().subscribe(data => {
      this.paises = data;
    });

    // cuando cambia el país → filtrar departamentos
    this.personaForm.get('pais')?.valueChanges.subscribe(idPais => {
      if (idPais) {
        this.ubicacionService.getDepartamentos().subscribe(deps => {
          this.departamentos = deps.filter(d => d.id_pais == idPais);
          this.provincias = [];
          this.distritos = [];
          this.personaForm.patchValue({ departamento: '', provincia: '', distrito: '' });
        });
      }
    });

    // cuando cambia el departamento → filtrar provincias
    this.personaForm.get('departamento')?.valueChanges.subscribe(idDep => {
      if (idDep) {
        this.ubicacionService.getProvincias().subscribe(provs => {
          this.provincias = provs.filter(p => p.id_departamento == idDep);
          this.distritos = [];
          this.personaForm.patchValue({ provincia: '', distrito: '' });
        });
      }
    });

    // cuando cambia la provincia → filtrar distritos
    this.personaForm.get('provincia')?.valueChanges.subscribe(idProv => {
      if (idProv) {
        this.ubicacionService.getDistritos().subscribe(dists => {
          this.distritos = dists.filter(d => d.id_provincia == idProv);
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

    // ✅ Se arma el objeto Persona quitando los campos que NO se deben enviar
    const { pais, departamento, provincia, distrito, coordenadas, ...rest } = formValue;

    const persona: Persona = {
      ...rest,
      dirrecion: formValue.direccion
    } as Persona;

    delete (persona as any).direccion;

    this.personaService.addPersona(persona).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Persona registrada con éxito';
        this.personaForm.reset();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error del backend:', err);
        this.error = 'No se pudo registrar la persona';
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
