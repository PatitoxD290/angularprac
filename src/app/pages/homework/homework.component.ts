import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HomeworkService, Usuario } from '../../core/services/homework.service';

// Angular Material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homework',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.css']
})
export class HomeworkComponent implements OnInit {
  hide = signal(true);
  usuarioForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private fb: FormBuilder, private homeworkService: HomeworkService) {}

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // solo 8 números exactos
      fechaNacimiento: ['', Validators.required], 
      direccion: ['', Validators.required],
      usuario: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // Permite solo números en el DNI
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.usuarioForm.invalid) {
      this.error = 'Por favor completa correctamente todos los campos';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const usuario: Usuario = this.usuarioForm.value;

    this.homeworkService.addUsuario(usuario).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Usuario registrado con éxito';
        this.usuarioForm.reset();
      },
      error: () => {
        this.loading = false;
        this.error = 'No se pudo registrar el usuario';
      }
    });
  }

  onCancel() {
    this.usuarioForm.reset();
    this.error = null;
    this.success = null;
  }

  getError(field: string) {
    const control = this.usuarioForm.get(field);
    if (!control || !control.touched) return null;

    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('pattern')) {
      if (field === 'nombre' || field === 'apellido') return 'No se permiten números ni caracteres especiales';
      if (field === 'dni') return 'Debe contener exactamente 8 números';
    }
    if (control.hasError('minlength')) return `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    return null;
  }
}
