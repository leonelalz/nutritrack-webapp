/**
 * Modelos para el Catálogo de Planes y Rutinas
 * Módulo 4: CATÁLOGO Y EXPLORACIÓN
 * US-16 a US-20
 */

// ============================================================================
// RESPUESTAS DEL CATÁLOGO
// ============================================================================

/**
 * Respuesta al activar un plan
 * POST /api/v1/usuario/planes/activar
 */
export interface ActivarPlanRequest {
  planId: number;
  fechaInicio?: string;
  notas?: string;
}

/**
 * Respuesta del usuario al activar/pausar/reanudar/completar un plan
 */
export interface UsuarioPlanResponse {
  id: number;
  planId: number;
  planNombre: string;
  estado: 'ACTIVO' | 'PAUSADO' | 'COMPLETADO' | 'CANCELADO';
  fechaInicio: string;
  fechaFin?: string;
  diaActual: number;
  diasTotales: number;
  porcentajeCompletado: number;
  notas?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

/**
 * Respuesta al activar una rutina
 * POST /api/v1/usuario/rutinas/activar
 */
export interface ActivarRutinaRequest {
  rutinaId: number;
  fechaInicio?: string;
  notas?: string;
}

/**
 * Respuesta del usuario al activar/pausar/reanudar/completar una rutina
 */
export interface UsuarioRutinaResponse {
  id: number;
  rutinaId: number;
  rutinaNombre: string;
  estado: 'ACTIVO' | 'PAUSADO' | 'COMPLETADO' | 'CANCELADO';
  fechaInicio: string;
  fechaFin?: string;
  semanaActual: number;
  semanasTotales: number;
  porcentajeCompletado: number;
  notas?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// ============================================================================
// TIPOS Y ENUMS
// ============================================================================

export enum EstadoPlan {
  ACTIVO = 'ACTIVO',
  PAUSADO = 'PAUSADO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO'
}

export enum EstadoRutina {
  ACTIVO = 'ACTIVO',
  PAUSADO = 'PAUSADO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO'
}
