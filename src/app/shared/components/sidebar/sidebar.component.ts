import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Componente Sidebar
 * 
 * Barra de navegación lateral que incluye:
 * - Información del usuario
 * - Enlaces de navegación principal
 * - Logo y versión de la aplicación
 * - Botón de cerrar sesión
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  /**
   * Obtiene las iniciales del usuario para el avatar
   * Por defecto retorna 'U' si no hay usuario
   */
  getUserInitial(): string {
    const user = this.authService.currentUser();
    if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  getUserName(): string {
    const user = this.authService.currentUser();
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'Usuario';
  }

  /**
   * Obtiene el email del usuario
   */
  getUserEmail(): string {
    const user = this.authService.currentUser();
    return user?.email || 'usuario@ejemplo.com';
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.authService.logout();
  }
}
