import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserRegister } from '../../../core/models/user.model';

/**
 * Componente de Registro
 * 
 * Permite a nuevos usuarios crear una cuenta en la aplicación.
 * Incluye validación de formulario y manejo de errores.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Modelo del formulario
  userData = signal<UserRegister>({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: ''
  });

  // Estados del componente
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  /**
   * Maneja el envío del formulario de registro
   * Crea la cuenta y redirige al login si es exitoso
   */
  onSubmit(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.register(this.userData()).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Cuenta creada exitosamente. Redirigiendo al login...');
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Error de registro:', error);
        
        if (error.error) {
          // Mostrar errores específicos del backend
          const errors = error.error;
          let errorMsg = 'Error en el registro: ';
          
          if (errors.username) {
            errorMsg += errors.username[0];
          } else if (errors.email) {
            errorMsg += errors.email[0];
          } else if (errors.password) {
            errorMsg += errors.password[0];
          } else {
            errorMsg += 'Por favor, verifica los datos ingresados.';
          }
          
          this.errorMessage.set(errorMsg);
        } else {
          this.errorMessage.set('Error de conexión. Por favor, intenta nuevamente.');
        }
      }
    });
  }

  /**
   * Actualiza un campo del formulario
   */
  updateField(field: keyof UserRegister, value: string): void {
    this.userData.update(data => ({ ...data, [field]: value }));
  }
}
