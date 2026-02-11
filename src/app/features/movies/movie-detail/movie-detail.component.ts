import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService, Movie } from '../../../core/services/movies.service';
import { ReviewsService, Review } from '../../../core/services/reviews.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  reviews: Review[] = [];
  
  // Para crear nueva review
  newRating: number = 5;
  newComment: string = '';
  
  // Estados
  isLoadingMovie: boolean = true;
  isLoadingReviews: boolean = true;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  currentUsername: string = '';
  currentUserId: number = 0;
  storageUrl = 'http://localhost:8000';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moviesService: MoviesService,
    private reviewsService: ReviewsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.authService.getUsername() || '';
    
    // Obtener el ID de la película desde la URL
    const movieId = this.route.snapshot.paramMap.get('id');
    
    if (movieId) {
      this.loadMovie(+movieId); // +movieId convierte string a number
      this.loadReviews(+movieId);
    }
  }

  loadMovie(id: number): void {
    this.isLoadingMovie = true;
    
    this.moviesService.getMovie(id).subscribe({
      next: (response) => {
        this.movie = response.data;
        this.isLoadingMovie = false;
      },
      error: (error) => {
        console.error('Error al cargar película:', error);
        this.errorMessage = 'Error al cargar la película';
        this.isLoadingMovie = false;
      }
    });
  }

  loadReviews(movieId: number): void {
    this.isLoadingReviews = true;
    
    this.reviewsService.getReviews(movieId).subscribe({
      next: (response) => {
        this.reviews = response.data;
        this.isLoadingReviews = false;
      },
      error: (error) => {
        console.error('Error al cargar reviews:', error);
        this.isLoadingReviews = false;
      }
    });
  }

  onSubmitReview(): void {
    if (!this.movie) return;
    
    if (!this.newComment.trim()) {
      this.errorMessage = 'El comentario es obligatorio';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.reviewsService.createReview(this.movie.id, this.newRating, this.newComment).subscribe({
      next: (response) => {
        console.log('Review creada:', response);
        
        // Agregar la nueva review al principio de la lista
        this.reviews.unshift(response.data);
        
        // Limpiar formulario
        this.newRating = 5;
        this.newComment = '';
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error al crear review:', error);
        this.errorMessage = 'Error al crear la review';
        this.isSubmitting = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/movies']);
  }

  // Generar array de estrellas para mostrar rating
  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
  // Verificar si el usuario actual es el creador
  isOwner(): boolean {
    if (!this.movie) return false;
  // comparamos username
    return true; // Temporal, permite editar/eliminar a todos
  }

   onEdit(): void {
     if (this.movie) {
     this.router.navigate(['/movies', this.movie.id, 'edit']);
     }
  }

    onDelete(): void {
      if (!this.movie) return;
  
      const confirmDelete = confirm(`¿Estás seguro de eliminar "${this.movie.title}"?`);
  
      if (confirmDelete) {
      this.moviesService.deleteMovie(this.movie.id).subscribe({
         next: () => {
          console.log('Película eliminada');
          this.router.navigate(['/movies']);
        },
         error: (error) => {
          console.error('Error al eliminar:', error);
          alert('Error al eliminar la película');
        }
    });
  }
}
}