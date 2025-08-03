import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Save, Plus, Trash2 } from 'lucide-angular';
import { LanguageService } from '../../../core/services/language';
import { JournalEntries } from '../../../core/services/journal-entries';
// Asegúrate que el import apunte al servicio real, no al modelo si existe.
// import { JournalEntriesService } from '../../../core/services/journal-entries.service'; 

// Objeto de traducciones
const translations = {
  en: {
    titleNew: 'New Journal Entry',
    titleEdit: 'Edit Journal Entry',
    description: 'Record a manual transaction in the journal.',
    cancel: 'Cancel',
    save: 'Save Entry',
    date: 'Date*',
    formDescription: 'Description*',
    formDescriptionPlaceholder: 'Ex: Payroll payment, Credit sale...',
    accountColumn: 'Account',
    descriptionColumn: 'Description',
    debitColumn: 'Debit',
    creditColumn: 'Credit',
    addLine: 'Add Line',
    accountPlaceholder: 'Search for account...'
  },
  es: {
    titleNew: 'Nuevo Asiento Contable',
    titleEdit: 'Editar Asiento Contable',
    description: 'Registra una transacción manual en el libro diario.',
    cancel: 'Cancelar',
    save: 'Guardar Asiento',
    date: 'Fecha*',
    formDescription: 'Descripción*',
    formDescriptionPlaceholder: 'Ej: Pago de nómina, Venta a crédito...',
    accountColumn: 'Cuenta Contable',
    descriptionColumn: 'Descripción',
    debitColumn: 'Débito',
    creditColumn: 'Crédito',
    addLine: 'Añadir Línea',
    accountPlaceholder: 'Buscar cuenta...'
  }
};

@Component({
  selector: 'app-journal-entry-form-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './journal-entry-form.page.html',
  styleUrls: ['./journal-entry-form.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalEntryFormPage implements OnInit {
  @Input() id?: string;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private languageService = inject(LanguageService);
  private journalEntriesService = inject(JournalEntries);

  // ✅ **SOLUCIÓN 1:** Cambiar 'language' a 'currentLang' para que coincida con el servicio.
  language = this.languageService.currentLang;

  // ✅ **SOLUCIÓN 2:** Ayudar a TypeScript a entender el tipo de 'language'.
  t = computed(() => translations[this.language() as keyof typeof translations]);

  protected readonly SaveIcon = Save;
  protected readonly PlusIcon = Plus;
  protected readonly TrashIcon = Trash2;

  entryForm!: FormGroup;
  isEditMode = signal(false);

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.entryForm = this.fb.group({
      date: [today, Validators.required],
      description: ['', Validators.required],
      lines: this.fb.array([], [Validators.required, Validators.minLength(2)])
    });

    if (this.id) {
      this.isEditMode.set(true);
      // Lógica para cargar datos del asiento por ID
      // this.journalEntriesService.getById(this.id).subscribe(entry => this.entryForm.patchValue(entry));
    } else {
      this.addLine();
      this.addLine();
    }
  }

  get lines(): FormArray {
    return this.entryForm.get('lines') as FormArray;
  }

  createLine(): FormGroup {
    return this.fb.group({
      // En una app real, esto sería un objeto completo de cuenta
      accountName: ['', Validators.required], 
      accountCode: [''], // Campo auxiliar
      accountId: [''], // ID real
      description: [''],
      debit: [0, [Validators.required, Validators.min(0)]],
      credit: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addLine(): void {
    this.lines.push(this.createLine());
  }

  removeLine(index: number): void {
    if (this.lines.length > 2) {
      this.lines.removeAt(index);
    }
  }

 







   isSaving = signal(false);

  // ... (ngOnInit, lines, createLine, etc.)

  saveEntry(): void {
    // 1. Validar que el formulario sea válido
    if (this.entryForm.invalid) {
      this.entryForm.markAllAsTouched(); // Marca todos los campos para mostrar errores
      return;
    }

    // 2. Prevenir múltiples envíos
    if (this.isSaving()) return;

    // 3. Establecer el estado de carga
    this.isSaving.set(true);

    // 4. Obtener los datos del formulario
    const formData = this.entryForm.getRawValue();
    
    // 5. Llamar al servicio
    this.journalEntriesService.create(formData).subscribe({
      next: () => {
        // Éxito: notificar al usuario (opcional) y navegar a la lista
        console.log('Asiento contable creado con éxito!');
        this.router.navigate(['/app/accounting/journal-entries']);
      },
      error: (err) => {
        // Error: mostrar un mensaje de error y detener la carga
        console.error('Error al crear el asiento contable:', err.error.message || 'Error desconocido');
        this.isSaving.set(false);
        // Aquí podrías usar un servicio de notificaciones (Toast) para mostrar el error al usuario
      },
      complete: () => {
        // Se ejecuta después de next() o error()
        this.isSaving.set(false);
      }
    });
  }



}