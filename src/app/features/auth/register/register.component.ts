import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // Variables del formulario
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  
  // Variables de estado
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Método que se ejecuta al hacer submit del formulario
  onRegister(): void {
    // Limpiar mensaje de error anterior
    this.errorMessage = '';
    
    // Validaciones
    if (!this.username || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    // Mostrar loading
    this.isLoading = true;

    // Llamar al servicio de autenticación
    this.authService.register(this.username, this.password).subscribe({
      next: (response) => {
        // Registro exitoso
        console.log('Registro exitoso:', response);
        this.isLoading = false;
        
        // Redirigir a la página de películas
        this.router.navigate(['/movies']);
      },
      error: (error) => {
        // Registro fallido
        console.error('Error en registro:', error);
        this.isLoading = false;
        
        // Manejo de errores específicos
        if (error.status === 422) {
          this.errorMessage = 'El usuario ya existe';
        } else {
          this.errorMessage = 'Error al registrar usuario';
        }
      }
    });
  }

  // Ir al login
  onGoToLogin(): void {
    this.router.navigate(['/login']);
  }
}