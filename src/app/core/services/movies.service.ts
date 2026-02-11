import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

// Interfaces para las películas
export interface Movie {
  id: number;
  title: string;
  description: string | null;
  poster: string | null;
  is_published: boolean;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

interface MoviesResponse {
  data: Movie[];
}

interface MovieResponse {
  message: string;
  data: Movie;
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private apiUrl = '/api/movies';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Obtener headers con el token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Listar todas las películas
  getMovies(): Observable<MoviesResponse> {
    return this.http.get<MoviesResponse>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // Obtener una película por ID
  getMovie(id: number): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Crear una película
  createMovie(formData: FormData): Observable<MovieResponse> {
    return this.http.post<MovieResponse>(this.apiUrl, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    });
  }

  // Actualizar una película
  updateMovie(id: number, formData: FormData): Observable<MovieResponse> {
    return this.http.post<MovieResponse>(`${this.apiUrl}/${id}?_method=PUT`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    });
  }

  // Eliminar una película
  deleteMovie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}