import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Interfaces
export interface Review {
  id: number;
  movie_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    username: string;
  };
}

interface ReviewsResponse {
  data: Review[];
}

interface ReviewResponse {
  message: string;
  data: Review;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private apiUrl = '/api/movies';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Obtener headers con el token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Listar reviews de una película
  getReviews(movieId: number): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(`${this.apiUrl}/${movieId}/reviews`, {
      headers: this.getHeaders()
    });
  }

  // Crear una review
  createReview(movieId: number, rating: number, comment: string): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(
      `${this.apiUrl}/${movieId}/reviews`,
      { rating, comment },
      { headers: this.getHeaders() }
    );
  }
}