import { Etiqueta } from './etiqueta.model';

/**
 * Tipos de comida predefinidos en el sistema
 * NOTA: El sistema ahora permite tipos personalizados además de estos predefinidos.
 * Los administradores pueden crear nuevos tipos usando la opción "Agregar nuevo tipo..."
 */
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

export interface InformacionNutricional {
  proteinasTotales: number;
  carbohidratosTotales: number;
  grasasTotales: number;
  energiaTotal: number;
  fibraTotal: number;
  pesoTotal: number;
}

export interface RecetaIngrediente {
  ingredienteId: number;
  ingredienteNombre: string;
  cantidadGramos: number;
  proteinasAportadas: number;
  carbohidratosAportados: number;
  grasasAportadas: number;
  energiaAportada: number;
  fibraAportada: number;
  notas?: string;
}

export interface Comida {
  id: number;
  nombre: string;
  tipoComidaId: number;      // ID del tipo de comida
  tipoComida: string;        // Nombre del tipo de comida (ej: "ALMUERZO")
  descripcion?: string;
  tiempoPreparacionMinutos?: number;
  porciones?: number;
  instrucciones?: string;
  ingredientes: RecetaIngrediente[];
  nutricionTotal: InformacionNutricional;
  etiquetas: Etiqueta[];
  createdAt: string;
  updatedAt: string;
}

export interface ComidaRequest {
  nombre: string;
  tipoComidaId?: number;       // ID del tipo de comida (preferido)
  tipoComidaNombre?: string;   // Nombre del tipo de comida (alternativo)
  descripcion?: string;
  tiempoPreparacionMinutos?: number;
  porciones?: number;
  instrucciones?: string;
  etiquetaIds?: number[];
}

export interface AgregarIngredienteRequest {
  ingredienteId: number;
  cantidadGramos: number;
  notas?: string;
}

export const TIPO_COMIDA_LABELS: Record<TipoComida, string> = {
  [TipoComida.DESAYUNO]: 'Desayuno',
  [TipoComida.ALMUERZO]: 'Almuerzo',
  [TipoComida.CENA]: 'Cena',
  [TipoComida.SNACK]: 'Snack',
  [TipoComida.PRE_ENTRENAMIENTO]: 'Pre-Entrenamiento',
  [TipoComida.POST_ENTRENAMIENTO]: 'Post-Entrenamiento',
  [TipoComida.COLACION]: 'Colación',
  [TipoComida.MERIENDA]: 'Merienda'
};

export const TIPO_COMIDA_ICONS: Record<TipoComida, string> = {
  [TipoComida.DESAYUNO]: '🍳',
  [TipoComida.ALMUERZO]: '🍽️',
  [TipoComida.CENA]: '🌙',
  [TipoComida.SNACK]: '🍿',
  [TipoComida.PRE_ENTRENAMIENTO]: '💪',
  [TipoComida.POST_ENTRENAMIENTO]: '🏋️',
  [TipoComida.COLACION]: '🥪',
  [TipoComida.MERIENDA]: '☕'
};