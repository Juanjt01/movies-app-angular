import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService, Movie } from '../../../core/services/movies.service';

@Component({
  selector: 'app-movie-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-edit.component.html',
  styleUrl: './movie-edit.component.css'
})
export class MovieEditComponent implements OnInit {
  movieId: number = 0;
  movie: Movie | null = null;
  
  // Datos del formulario
  title: string = '';
  description: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  currentPosterUrl: string = '';

  // Estados
  isLoading: boolean = false;
  isLoadingMovie: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  storageUrl = 'http://localhost:8000';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moviesService: MoviesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.movieId = +id;
      this.loadMovie();
    }
  }

  loadMovie(): void {
    this.isLoadingMovie = true;
    
    this.moviesService.getMovie(this.movieId).subscribe({
      next: (response) => {
        this.movie = response.data;
        this.title = this.movie.title;
        this.description = this.movie.description || '';
        
        if (this.movie.poster) {
          this.currentPosterUrl = `${this.storageUrl}/storage/${this.movie.poster}`;
        }
        
        this.isLoadingMovie = false;
      },
      error: (error) => {
        console.error('Error al cargar película:', error);
        this.errorMessage = 'Error al cargar la película';
        this.isLoadingMovie = false;
      }
    });
  }

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

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.title.trim()) {
      this.errorMessage = 'El título es obligatorio';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    
    if (this.selectedFile) {
      formData.append('poster', this.selectedFile);
    }

    this.isLoading = true;

    this.moviesService.updateMovie(this.movieId, formData).subscribe({
      next: (response) => {
        console.log('Película actualizada:', response);
        this.successMessage = 'Película actualizada exitosamente';
        this.isLoading = false;

        setTimeout(() => {
          this.router.navigate(['/movies', this.movieId]);
        }, 1000);
      },
      error: (error) => {
        console.error('Error al actualizar película:', error);
        this.errorMessage = 'Error al actualizar la película';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/movies', this.movieId]);
  }
}