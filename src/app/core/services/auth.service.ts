import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Interfaces para tipar las respuestas
interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    username: string;
  };
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    username: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api'; 

  constructor(private http: HttpClient) { }

  // Método de login
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        // Si el login es exitoso, guardar el token
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('username', response.data.username);
        }
      })
    );
  }

  // Método de registro
  register(username: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      username,
      password
    }).pipe(
      tap(response => {
        // Si el registro es exitoso, guardar el token
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('username', response.data.username);
        }
      })
    );
  }

  // Método de logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtener el token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtener el username
  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}