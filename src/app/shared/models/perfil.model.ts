// ===== ENUMS =====
export enum UnidadesMedida {
  KG = 'KG',
  LBS = 'LBS'
}

export enum Genero {
  MASCULINO = 'MASCULINO',
  FEMENINO = 'FEMENINO',
  OTRO = 'OTRO'
}

export enum TipoEtiqueta {
  OBJETIVO = 'objetivo',
  ALERGIA = 'alergia',
  CONDICION = 'condicion',
  CATEGORIA = 'categoria'
}

// ===== REQUEST DTOs =====
export interface UpdateUnidadesMedidaRequest {
  unidadesMedida: UnidadesMedida;
}

export interface PerfilSaludRequest {
  altura?: number;                // cm, opcional
  pesoActual?: number;            // kg
  pesoObjetivo?: number;          // kg
  fechaNacimiento?: string;       // ISO 8601 (YYYY-MM-DD)
  genero?: Genero;
  objetivoActual?: string;        // Texto libre
  etiquetaSaludIds: number[];     // IDs de alergias, condiciones
}

export interface DeleteAccountRequest {
  confirmacion: string;   // Usuario debe escribir "ELIMINAR" (RN05)
}

// ===== RESPONSE DTOs =====
export interface EtiquetaResponse {
  id: number;
  nombre: string;
  tipo: TipoEtiqueta;
  descripcion?: string;
}

export interface PerfilSaludResponse {
  id: number;
  cuentaId: number;
  nombre: string;
  apellido: string;
  fechaNacimiento?: string;
  genero?: Genero;
  unidadesMedida: UnidadesMedida;
  altura?: number;        // Convertido según unidad del usuario
  pesoActual?: number;    // Convertido según unidad
  pesoObjetivo?: number;  // Convertido según unidad
  objetivoActual?: string;
  etiquetasSalud: EtiquetaResponse[];  // Alergias, condiciones, objetivos
}

// ===== API Response Wrapper =====
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp?: string;
}
