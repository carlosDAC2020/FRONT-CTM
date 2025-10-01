import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  UserRegister,
  LoginCredentials,
  AuthResponse,
  RefreshTokenResponse,
  AuthTestResponse
} from '../models/user.model';

/**
 * Servicio de Autenticación
 * 
 * Gestiona todas las operaciones relacionadas con autenticación:
 * - Login y logout
 * - Registro de usuarios
 * - Renovación de tokens
 * - Verificación de autenticación
 * - Almacenamiento de tokens en localStorage
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  // Estado reactivo del usuario actual
  currentUser = signal<User | null>(null);

  /**
   * Inicia sesión con credenciales de usuario
   * 
   * @param credentials - Nombre de usuario y contraseña
   * @returns Observable con los tokens de acceso y refresh
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/token/`, credentials).pipe(
      tap(response => {
        this.setTokens(response.access, response.refresh);
      })
    );
  }

  /**
   * Registra un nuevo usuario en el sistema
   * 
   * @param userData - Datos del usuario a registrar
   * @returns Observable con los datos del usuario creado
   */
  register(userData: UserRegister): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/register/`, userData);
  }

  /**
   * Cierra la sesión del usuario actual
   * Limpia los tokens y redirige al login
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Renueva el token de acceso usando el refresh token
   * 
   * @returns Observable con el nuevo token de acceso
   */
  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<RefreshTokenResponse>(
      `${this.apiUrl}/token/refresh/`,
      { refresh: refreshToken }
    ).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access);
      })
    );
  }

  /**
   * Verifica que el token actual es válido
   * 
   * @returns Observable con información del usuario autenticado
   */
  testAuth(): Observable<AuthTestResponse> {
    return this.http.get<AuthTestResponse>(`${this.apiUrl}/users/test-auth/`);
  }

  /**
   * Verifica si el usuario está autenticado
   * 
   * @returns true si existe un token de acceso válido
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  /**
   * Obtiene el token de acceso actual
   * 
   * @returns Token de acceso o null si no existe
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Obtiene el token de refresh actual
   * 
   * @returns Token de refresh o null si no existe
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Almacena los tokens en localStorage
   * 
   * @param accessToken - Token de acceso JWT
   * @param refreshToken - Token de refresh JWT
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
}
