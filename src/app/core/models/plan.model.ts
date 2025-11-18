/**
 * Modelos para Planes Nutricionales (Módulo 3)
 * Backend: /api/v1/admin/planes
 */

import { Etiqueta, PagedResponse } from './common.model';

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
  objetivo: TipoObjetivo;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

export interface CrearPlanRequest {
  nombre: string;
  descripcion: string;
  duracionDias: number;
  caloriasTotales: number;
  objetivos: ObjetivoNutricional[];
}

export interface ActualizarPlanRequest {
  nombre?: string;
  descripcion?: string;
  duracionDias?: number;
  caloriasTotales?: number;
  objetivos?: ObjetivoNutricional[];
}

export interface PlanResponse {
  id: number;
  nombre: string;
  descripcion: string;
  duracionDias: number;
  activo: boolean;
  objetivo: TipoObjetivo | null;
  etiquetas: Etiqueta[];
  createdAt: string | null;
  updatedAt: string | null;
  totalDiasProgramados?: number;
  numeroUsuariosActivos?: number;
  dias?: DiaPlanResponse[];
}

export interface DiaPlanRequest {
  numeroDia: number;
  tipoComida: TipoComida;
  idComida: number;
  notas?: string;
}

export interface ComidaInfo {
  id: number;
  nombre: string;
  tipo: string;
  tiempoPreparacion: number;
  calorias?: number;
}

export interface DiaPlanResponse {
  id: number;
  numeroDia: number;
  tipoComida: TipoComida;
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
