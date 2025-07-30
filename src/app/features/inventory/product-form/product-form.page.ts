import { Component, ChangeDetectionStrategy, inject, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Save, Image, Package, DollarSign, List, Info, ChevronsUpDown } from 'lucide-angular';

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormPage implements OnInit {
  @Input() id?: string; // Recibe el ID desde la ruta para modo edición

  private fb = inject(FormBuilder);
  private router = inject(Router);

  protected readonly SaveIcon = Save;
  protected readonly ImageIcon = Image;
  // ... (más íconos)

  productForm!: FormGroup;
  isEditMode = signal(false);
  imagePreview = signal<string | ArrayBuffer | null>(null);

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      sku: [''],
      description: [''],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      reorderLevel: [0],
      supplier: [''],
      imageFile: [null],
    });

    if (this.id) {
      this.isEditMode.set(true);
      // Aquí iría la lógica para cargar los datos del producto por su ID
      // y rellenar el formulario con this.productForm.patchValue(...)
      console.log('Modo Edición para producto con ID:', this.id);
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.productForm.patchValue({ imageFile: file });
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result);
      reader.readAsDataURL(file);
    }
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      console.log('Datos del producto a guardar:', this.productForm.value);
      // Lógica para enviar al backend
      this.router.navigate(['/app/inventory/products']);
    }
  }
}