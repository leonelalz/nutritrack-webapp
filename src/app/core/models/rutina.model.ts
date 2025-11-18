/**
 * Modelos para Rutinas de Ejercicio (Módulo 3)
 * Backend: /api/v1/admin/rutinas
 */

import { Etiqueta, PagedResponse, DiaSemana } from './common.model';

// Re-exportar para compatibilidad
export type { Etiqueta, PagedResponse, DiaSemana };

export enum NivelDificultad {
  PRINCIPIANTE = 'PRINCIPIANTE',
  INTERMEDIO = 'INTERMEDIO',
  AVANZADO = 'AVANZADO',
  EXPERTO = 'EXPERTO'
}

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
  nivelDificultad: NivelDificultad;
  objetivo: ObjetivoRutina;
}

export interface ActualizarRutinaRequest {
  nombre?: string;
  descripcion?: string;
  duracionSemanas?: number;
  nivelDificultad?: NivelDificultad;
  objetivo?: ObjetivoRutina;
}


export interface RutinaResponse {
  id: number;
  nombre: string;
  descripcion: string;
  duracionSemanas: number;
  nivelDificultad: NivelDificultad;
  objetivo: ObjetivoRutina | null;
  etiquetas: Etiqueta[];
  activo: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  totalEjerciciosProgramados?: number;
  numeroUsuariosActivos?: number;
  ejercicios?: EjercicioRutinaResponse[];
}

export interface EjercicioRutinaRequest {
  idEjercicio: number;
  orden: number;
  series: number;
  repeticiones: number;
  peso?: number;
  duracionMinutos?: number;
  descansoSegundos?: number;
  notas?: string;
}

export interface ActualizarEjercicioRutinaRequest {
  idEjercicio?: number;
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
  orden: number;
  series: number;
  repeticiones: number;
  peso?: number;
  duracionMinutos?: number;
  descansoSegundos?: number;
  notas?: string;
  // Propiedades para compatibilidad con componentes
  diaSemana?: DiaSemana;
  nombreEjercicio?: string;
  tiempoDescanso?: number;
}

export interface RutinaDetalleResponse extends RutinaResponse {
  ejercicios: EjercicioRutinaResponse[];
}
