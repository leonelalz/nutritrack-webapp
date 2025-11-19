/**
 * Modelos para Rutinas de Ejercicio (Módulo 3)
 * Backend: /api/v1/admin/rutinas
 */

import { PagedResponse, DiaSemana } from './common.model';
import { Etiqueta } from './etiqueta.model';
import { NivelDificultad } from './ejercicio.model';

// Re-exportar para compatibilidad
export type { Etiqueta, PagedResponse, DiaSemana, NivelDificultad };

export enum ObjetivoRutina {
  PERDER_PESO = 'PERDER_PESO',
  GANAR_MASA_MUSCULAR = 'GANAR_MASA_MUSCULAR',
  MANTENER_FORMA = 'MANTENER_FORMA',
  REHABILITACION = 'REHABILITACION',
  CONTROLAR_ESTRES = 'CONTROLAR_ESTRES'
}

export interface CrearRutinaRequest {
  nombre: string;
  descripcion: string;
  duracionSemanas: number;
  patronSemanas?: number;
  nivelDificultad: NivelDificultad;
  etiquetaIds?: number[];
}

export interface ActualizarRutinaRequest {
  nombre?: string;
  descripcion?: string;
  duracionSemanas?: number;
  patronSemanas?: number;
  nivelDificultad?: NivelDificultad;
  etiquetaIds?: number[];
}


export interface RutinaResponse {
  id: number;
  nombre: string;
  descripcion: string;
  duracionSemanas: number;
  patronSemanas: number;
  nivelDificultad: NivelDificultad;
  etiquetas: Etiqueta[];
  activo: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  totalEjerciciosProgramados?: number;
  numeroUsuariosActivos?: number;
  ejercicios?: EjercicioRutinaResponse[];
}

export interface EjercicioRutinaRequest {
  ejercicioId: number;
  semanaBase: number;
  diaSemana: DiaSemana;
  orden: number;
  series: number;
  repeticiones: number;
  peso?: number;
  duracionMinutos?: number;
  descansoSegundos?: number;
  notas?: string;
}

export interface ActualizarEjercicioRutinaRequest {
  ejercicioId?: number;
  semanaBase?: number;
  diaSemana?: DiaSemana;
  orden?: number;
  series?: number;
  repeticiones?: number;
  peso?: number;
  duracionMinutos?: number;
  descansoSegundos?: number;
  notas?: string;
}

export interface EjercicioInfo {
  id: number;
  nombre: string;
  descripcion: string;
  tipoEjercicio: string;
  grupoMuscular: string;
  nivelDificultad: string;
}

export interface EjercicioRutinaResponse {
  id: number;
  ejercicio: EjercicioInfo;
  semanaBase: number;
  diaSemana: DiaSemana;
  orden: number;
  series: number;
  repeticiones: number;
  peso?: number;
  duracionMinutos?: number;
  descansoSegundos?: number;
  notas?: string;
}

export interface RutinaDetalleResponse extends RutinaResponse {
  ejercicios: EjercicioRutinaResponse[];
}
