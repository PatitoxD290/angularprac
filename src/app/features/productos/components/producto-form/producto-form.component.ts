import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductoService } from '../../../../core/services/producto.service';
import { produc } from '../../../../core/models/producto.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {
  productoForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  hide = signal(true);

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      categoria: ['', Validators.required],
      costo: [0, [Validators.required, Validators.min(0)]],
      precioxunidad: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit() {
    if (this.productoForm.invalid) {
      this.error = 'Por favor completa correctamente todos los campos';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const producto: produc = this.productoForm.value;

    this.productoService.addProducto(producto).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Producto registrado con éxito';
        this.productoForm.reset();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al guardar producto:', err);
        this.error = 'No se pudo registrar el producto';
      }
    });
  }

  onCancel() {
    this.productoForm.reset();
    this.error = null;
    this.success = null;
  }

  getError(field: string) {
    const control = this.productoForm.get(field);
    if (!control || !control.touched) return null;

    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('minlength')) return 'Debe tener más caracteres';
    if (control.hasError('min')) return 'El valor debe ser mayor a 0';
    return null;
  }
}
