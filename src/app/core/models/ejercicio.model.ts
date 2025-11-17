// src/app/core/models/ejercicio.model.ts

import { Etiqueta } from './etiqueta.model';

/**
 * Tipos de ejercicio
 */
export enum TipoEjercicio {
  CARDIO = 'CARDIO',
  FUERZA = 'FUERZA',
  FLEXIBILIDAD = 'FLEXIBILIDAD',
  EQUILIBRIO = 'EQUILIBRIO',
  HIIT = 'HIIT',
  YOGA = 'YOGA',
  PILATES = 'PILATES',
  FUNCIONAL = 'FUNCIONAL',
  DEPORTIVO = 'DEPORTIVO',
  REHABILITACION = 'REHABILITACION',
  OTRO = 'OTRO'
}

/**
 * Grupos musculares
 */
export enum GrupoMuscular {
  PECHO = 'PECHO',
  ESPALDA = 'ESPALDA',
  HOMBROS = 'HOMBROS',
  BRAZOS = 'BRAZOS',
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  ABDOMINALES = 'ABDOMINALES',
  PIERNAS = 'PIERNAS',
  CUADRICEPS = 'CUADRICEPS',
  ISQUIOTIBIALES = 'ISQUIOTIBIALES',
  GLUTEOS = 'GLUTEOS',
  GEMELOS = 'GEMELOS',
  CORE = 'CORE',
  CARDIO = 'CARDIO',
  CUERPO_COMPLETO = 'CUERPO_COMPLETO',
  OTRO = 'OTRO'
}

/**
 * Niveles de dificultad
 */
export enum NivelDificultad {
  PRINCIPIANTE = 'PRINCIPIANTE',
  INTERMEDIO = 'INTERMEDIO',
  AVANZADO = 'AVANZADO',
  EXPERTO = 'EXPERTO'
}

/**
 * Interfaz para la entidad Ejercicio
 */
export interface Ejercicio {
  id: number;
  nombre: string;
  descripcion?: string;
  tipoEjercicio: TipoEjercicio;
  grupoMuscular: GrupoMuscular;
  nivelDificultad: NivelDificultad;
  caloriasQuemadasPorMinuto?: number;
  duracionEstimadaMinutos?: number;
  equipoNecesario?: string;
  etiquetas: Etiqueta[];
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para crear/actualizar un ejercicio
 */
export interface EjercicioRequest {
  nombre: string;
  descripcion?: string;
  tipoEjercicio: TipoEjercicio;
  grupoMuscular: GrupoMuscular;
  nivelDificultad: NivelDificultad;
  caloriasQuemadasPorMinuto?: number;
  duracionEstimadaMinutos?: number;
  equipoNecesario?: string;
  etiquetaIds?: number[];
}

/**
 * Labels en español para tipos de ejercicio
 */
export const TIPO_EJERCICIO_LABELS: Record<TipoEjercicio, string> = {
  [TipoEjercicio.CARDIO]: 'Cardio',
  [TipoEjercicio.FUERZA]: 'Fuerza',
  [TipoEjercicio.FLEXIBILIDAD]: 'Flexibilidad',
  [TipoEjercicio.EQUILIBRIO]: 'Equilibrio',
  [TipoEjercicio.HIIT]: 'HIIT',
  [TipoEjercicio.YOGA]: 'Yoga',
  [TipoEjercicio.PILATES]: 'Pilates',
  [TipoEjercicio.FUNCIONAL]: 'Funcional',
  [TipoEjercicio.DEPORTIVO]: 'Deportivo',
  [TipoEjercicio.REHABILITACION]: 'Rehabilitación',
  [TipoEjercicio.OTRO]: 'Otro'
};

/**
 * Labels en español para grupos musculares
 */
export const GRUPO_MUSCULAR_LABELS: Record<GrupoMuscular, string> = {
  [GrupoMuscular.PECHO]: 'Pecho',
  [GrupoMuscular.ESPALDA]: 'Espalda',
  [GrupoMuscular.HOMBROS]: 'Hombros',
  [GrupoMuscular.BRAZOS]: 'Brazos',
  [GrupoMuscular.BICEPS]: 'Bíceps',
  [GrupoMuscular.TRICEPS]: 'Tríceps',
  [GrupoMuscular.ABDOMINALES]: 'Abdominales',
  [GrupoMuscular.PIERNAS]: 'Piernas',
  [GrupoMuscular.CUADRICEPS]: 'Cuádriceps',
  [GrupoMuscular.ISQUIOTIBIALES]: 'Isquiotibiales',
  [GrupoMuscular.GLUTEOS]: 'Glúteos',
  [GrupoMuscular.GEMELOS]: 'Gemelos',
  [GrupoMuscular.CORE]: 'Core',
  [GrupoMuscular.CARDIO]: 'Cardio',
  [GrupoMuscular.CUERPO_COMPLETO]: 'Cuerpo Completo',
  [GrupoMuscular.OTRO]: 'Otro'
};

/**
 * Labels en español para niveles de dificultad
 */
export const NIVEL_DIFICULTAD_LABELS: Record<NivelDificultad, string> = {
  [NivelDificultad.PRINCIPIANTE]: 'Principiante',
  [NivelDificultad.INTERMEDIO]: 'Intermedio',
  [NivelDificultad.AVANZADO]: 'Avanzado',
  [NivelDificultad.EXPERTO]: 'Experto'
};

/**
 * Iconos para tipos de ejercicio
 */
export const TIPO_EJERCICIO_ICONS: Record<TipoEjercicio, string> = {
  [TipoEjercicio.CARDIO]: '🏃',
  [TipoEjercicio.FUERZA]: '💪',
  [TipoEjercicio.FLEXIBILIDAD]: '🤸',
  [TipoEjercicio.EQUILIBRIO]: '⚖️',
  [TipoEjercicio.HIIT]: '⚡',
  [TipoEjercicio.YOGA]: '🧘',
  [TipoEjercicio.PILATES]: '🤸‍♀️',
  [TipoEjercicio.FUNCIONAL]: '🏋️',
  [TipoEjercicio.DEPORTIVO]: '⚽',
  [TipoEjercicio.REHABILITACION]: '🏥',
  [TipoEjercicio.OTRO]: '🎯'
};