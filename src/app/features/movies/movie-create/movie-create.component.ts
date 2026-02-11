import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MoviesService } from '../../../core/services/movies.service';

@Component({
  selector: 'app-movie-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-create.component.html',
  styleUrl: './movie-create.component.css'
})
export class MovieCreateComponent {
  // Datos del formulario
  title: string = '';
  description: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  // Estados
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private moviesService: MoviesService,
    private router: Router
  ) {}

  // Cuando el usuario selecciona una imagen
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (file) {
      this.selectedFile = file;

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Enviar el formulario
  onSubmit(): void {
    // Limpiar mensajes
    this.errorMessage = '';
    this.successMessage = '';

    // Validación
    if (!this.title.trim()) {
      this.errorMessage = 'El título es obligatorio';
      return;
    }

    // Crear FormData
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    
    if (this.selectedFile) {
      formData.append('poster', this.selectedFile);
    }

    // Mostrar loading
    this.isLoading = true;

    // Llamar al servicio
    this.moviesService.createMovie(formData).subscribe({
      next: (response) => {
        console.log('Película creada:', response);
        this.successMessage = 'Película creada exitosamente';
        this.isLoading = false;

        // Redirigir después de 1 segundo
        setTimeout(() => {
          this.router.navigate(['/movies']);
        }, 1000);
      },
      error: (error) => {
        console.error('Error al crear película:', error);
        this.errorMessage = 'Error al crear la película';
        this.isLoading = false;
      }
    });
  }

  // Cancelar y volver
  onCancel(): void {
    this.router.navigate(['/movies']);
  }
}