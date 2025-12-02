/**
 * Modelos para Planes Nutricionales (Módulo 3)
 * Backend: /api/v1/admin/planes
 */

import { PagedResponse } from './common.model';
import { Etiqueta } from './etiqueta.model';

// Re-exportar para compatibilidad
export type { Etiqueta, PagedResponse };

export enum TipoObjetivo {
  PERDER_PESO = 'PERDER_PESO',
  GANAR_MASA_MUSCULAR = 'GANAR_MASA_MUSCULAR',
  MANTENER_FORMA = 'MANTENER_FORMA',
  REHABILITACION = 'REHABILITACION',
  CONTROLAR_ESTRES = 'CONTROLAR_ESTRES'
}

export enum TipoComida {
  DESAYUNO = 'DESAYUNO',
  ALMUERZO = 'ALMUERZO',
  CENA = 'CENA',
  SNACK = 'SNACK',
  PRE_ENTRENAMIENTO = 'PRE_ENTRENAMIENTO',
  POST_ENTRENAMIENTO = 'POST_ENTRENAMIENTO',
  COLACION = 'COLACION',
  MERIENDA = 'MERIENDA'
}

export interface ObjetivoNutricional {
  caloriasObjetivo: number;
  proteinasObjetivo: number;
  carbohidratosObjetivo: number;
  grasasObjetivo: number;
  descripcion?: string;
}

export interface CrearPlanRequest {
  nombre: string;
  descripcion: string;
  duracionDias: number;
  objetivo: ObjetivoNutricional;
  etiquetaIds?: number[];
}

export interface ActualizarPlanRequest {
  nombre?: string;
  descripcion?: string;
  duracionDias?: number;
  objetivo?: ObjetivoNutricional;
  etiquetaIds?: number[];
}

export interface PlanResponse {
  id: number;
  nombre: string;
  descripcion: string;
  duracionDias: number;
  activo: boolean;
  objetivo: ObjetivoNutricional | null;
  etiquetas: Etiqueta[];
  createdAt: string | null;
  updatedAt: string | null;
  totalDiasProgramados?: number;
  numeroUsuariosActivos?: number;
  dias?: DiaPlanResponse[];
}

export interface DiaPlanRequest {
  numeroDia: number;
  tipoComidaId?: number;       // ID del tipo de comida (preferido)
  tipoComidaNombre?: string;   // Nombre del tipo de comida (alternativo)
  comidaId: number;
  notas?: string;
}

export interface ComidaInfo {
  id: number;
  nombre: string;
  tipoComidaId?: number;
  tipoComida?: string;
  tiempoPreparacion?: number;
  calorias?: number;
}

export interface DiaPlanResponse {
  id: number;
  numeroDia: number;
  tipoComidaId: number;   // ID del tipo de comida
  tipoComida: string;     // Nombre del tipo de comida
  comida: ComidaInfo;
  notas?: string;
  // Propiedades para compatibilidad con componentes (extraídas de comida)
  orden?: number;
  nombreComida?: string;
  porcionesRecomendadas?: number;
  calorias?: number;
}

export interface PlanDetalleResponse extends PlanResponse {
  dias: DiaPlanResponse[];
}
