import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LoginCredentials } from '../../../core/models/user.model';

/**
 * Componente de Login
 * 
 * Permite a los usuarios iniciar sesión en la aplicación.
 * Incluye validación de formulario y manejo de errores.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Modelo del formulario
  credentials = signal<LoginCredentials>({
    username: '',
    password: ''
  });

  // Estados del componente
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  /**
   * Maneja el envío del formulario de login
   * Intenta autenticar al usuario y redirige al dashboard si es exitoso
   */
  onSubmit(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.credentials()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Error de login:', error);
        
        if (error.status === 401) {
          this.errorMessage.set('Usuario o contraseña incorrectos');
        } else {
          this.errorMessage.set('Error de conexión. Por favor, intenta nuevamente.');
        }
      }
    });
  }

  /**
   * Actualiza el campo username del formulario
   */
  updateUsername(value: string): void {
    this.credentials.update(creds => ({ ...creds, username: value }));
  }

  /**
   * Actualiza el campo password del formulario
   */
  updatePassword(value: string): void {
    this.credentials.update(creds => ({ ...creds, password: value }));
  }
}
