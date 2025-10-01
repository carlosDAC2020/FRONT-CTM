/**
 * Modelo de Usuario
 * Representa la información de un usuario en el sistema
 */
export interface User {
  id?: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

/**
 * Datos de registro de usuario
 */
export interface UserRegister {
  username: string;
  password: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

/**
 * Credenciales de inicio de sesión
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Respuesta de autenticación con tokens JWT
 */
export interface AuthResponse {
  access: string;
  refresh: string;
}

/**
 * Respuesta de renovación de token
 */
export interface RefreshTokenResponse {
  access: string;
}

/**
 * Respuesta de verificación de autenticación
 */
export interface AuthTestResponse {
  message: string;
  user_id: number;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
}
