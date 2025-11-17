// ===== ENUMS =====
export enum RoleType {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

// ===== REQUESTS =====
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  phone?: string;
  dni?: string;
  address?: string;
  dateOfBirth?: string;
  nationality?: string;
  occupation?: string;
}

// ===== RESPONSES =====
export interface AuthResponse {
  token: string;
  email: string;
  nombre: string;
  apellido: string;
  role: string;
  userId: number;
  perfilId: number;
}

export interface UserResponse {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  role: RoleType;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
