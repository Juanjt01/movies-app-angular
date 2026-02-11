import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MoviesService, Movie } from '../../../core/services/movies.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  username: string = '';

  constructor(
    private moviesService: MoviesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el username del usuario logueado
    this.username = this.authService.getUsername() || 'Usuario';
    
    // Cargar las películas
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.moviesService.getMovies().subscribe({
      next: (response) => {
        console.log('Películas cargadas:', response);
        this.movies = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar películas:', error);
        this.errorMessage = 'Error al cargar las películas';
        this.isLoading = false;
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onCreateMovie(): void {
    this.router.navigate(['/movies/create']);
    
  }
  onViewMovie(movieId: number): void {
  this.router.navigate(['/movies', movieId]);
  }
}