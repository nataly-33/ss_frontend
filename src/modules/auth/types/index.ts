/**
 * Tipos e interfaces para el módulo de autenticación
 */

// ==================== USUARIO ====================
export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol_detalle: Role;
  is_active: boolean;
  fecha_registro: string;
}

// ==================== ROL ====================
export interface Role {
  id: string;
  nombre: string;
  descripcion?: string;
  permisos: Permission[];
}

export interface Permission {
  id: string;
  nombre: string;
  codigo: string;
  modulo: string;
  descripcion?: string;
}

// ==================== AUTENTICACIÓN ====================
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
}

export interface TokenPayload {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: string;
}

// ==================== ESTADO DE AUTENTICACIÓN ====================
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
