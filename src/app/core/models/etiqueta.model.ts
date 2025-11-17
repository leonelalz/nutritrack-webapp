// src/app/core/models/etiqueta.model.ts

/**
 * Tipos de etiqueta disponibles en el sistema
 */
export enum TipoEtiqueta {
  ALERGIA = 'ALERGIA',
  CONDICION_MEDICA = 'CONDICION_MEDICA',
  OBJETIVO = 'OBJETIVO',
  DIETA = 'DIETA',
  DIFICULTAD = 'DIFICULTAD',
  GRUPO_MUSCULAR = 'GRUPO_MUSCULAR',
  TIPO_EJERCICIO = 'TIPO_EJERCICIO'
}

/**
 * Interfaz para la entidad Etiqueta
 */
export interface Etiqueta {
  id: number;
  nombre: string;
  tipoEtiqueta: TipoEtiqueta;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para crear/actualizar una etiqueta
 */
export interface EtiquetaRequest {
  nombre: string;
  tipoEtiqueta: TipoEtiqueta;
  descripcion?: string;
}

/**
 * Respuesta paginada del backend
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * Respuesta estándar de la API
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

/**
 * Etiquetas en español para los tipos
 */
export const TIPO_ETIQUETA_LABELS: Record<TipoEtiqueta, string> = {
  [TipoEtiqueta.ALERGIA]: 'Alergia',
  [TipoEtiqueta.CONDICION_MEDICA]: 'Condición Médica',
  [TipoEtiqueta.OBJETIVO]: 'Objetivo',
  [TipoEtiqueta.DIETA]: 'Dieta',
  [TipoEtiqueta.DIFICULTAD]: 'Dificultad',
  [TipoEtiqueta.GRUPO_MUSCULAR]: 'Grupo Muscular',
  [TipoEtiqueta.TIPO_EJERCICIO]: 'Tipo de Ejercicio'
};

/**
 * Colores para badges según tipo de etiqueta
 */
export const TIPO_ETIQUETA_COLORS: Record<TipoEtiqueta, string> = {
  [TipoEtiqueta.ALERGIA]: 'bg-red-100 text-red-800',
  [TipoEtiqueta.CONDICION_MEDICA]: 'bg-orange-100 text-orange-800',
  [TipoEtiqueta.OBJETIVO]: 'bg-blue-100 text-blue-800',
  [TipoEtiqueta.DIETA]: 'bg-green-100 text-green-800',
  [TipoEtiqueta.DIFICULTAD]: 'bg-purple-100 text-purple-800',
  [TipoEtiqueta.GRUPO_MUSCULAR]: 'bg-indigo-100 text-indigo-800',
  [TipoEtiqueta.TIPO_EJERCICIO]: 'bg-pink-100 text-pink-800'
};

/**
 * Iconos para cada tipo de etiqueta
 */
export const TIPO_ETIQUETA_ICONS: Record<TipoEtiqueta, string> = {
  [TipoEtiqueta.ALERGIA]: '⚠️',
  [TipoEtiqueta.CONDICION_MEDICA]: '🏥',
  [TipoEtiqueta.OBJETIVO]: '🎯',
  [TipoEtiqueta.DIETA]: '🥗',
  [TipoEtiqueta.DIFICULTAD]: '📊',
  [TipoEtiqueta.GRUPO_MUSCULAR]: '💪',
  [TipoEtiqueta.TIPO_EJERCICIO]: '🏃'
};