// ===== ENUMS =====
export enum RoleType {
  ROLE_USER = 1,
  ROLE_ADMIN = 2
}

// Helper para verificar si un id_rol es admin
export function isAdminRole(roleId: number): boolean {
  return roleId === RoleType.ROLE_ADMIN;
}

// Helper para obtener el nombre del rol
export function getRoleName(roleId: number): string {
  return roleId === RoleType.ROLE_ADMIN ? 'Administrador' : 'Usuario';
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
// Respuesta envuelta del backend
export interface ApiLoginResponse {
  success: boolean;
  message: string;
  data: AuthResponse;
  timestamp: string;
}

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
