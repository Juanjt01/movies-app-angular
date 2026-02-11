import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Variables del formulario
  username: string = '';
  password: string = '';
  
  // Variables de estado
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Método que se ejecuta al hacer submit del formulario
  onLogin(): void {
    // Limpiar mensaje de error anterior
    this.errorMessage = '';
    
    // Validación simple
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    // Mostrar loading
    this.isLoading = true;

    // Llamar al servicio de autenticación
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        // Login exitoso
        console.log('Login exitoso:', response);
        this.isLoading = false;
        
        // Redirigir a la página de películas
        this.router.navigate(['/movies']);
      },
      error: (error) => {
        // Login fallido
        console.error('Error en login:', error);
        this.isLoading = false;
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }
}