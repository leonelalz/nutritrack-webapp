// src/app/core/models/ingrediente.model.ts

import { Etiqueta } from './etiqueta.model';

/**
 * Categorías de alimentos predefinidas en el sistema
 * NOTA: El sistema ahora permite categorías personalizadas además de estas predefinidas.
 * Los administradores pueden crear nuevas categorías usando la opción "Agregar nueva categoría..."
 */
export enum CategoriaAlimento {
  FRUTAS = 'FRUTAS',
  VERDURAS = 'VERDURAS',
  CEREALES = 'CEREALES',
  LEGUMBRES = 'LEGUMBRES',
  PROTEINAS = 'PROTEINAS',
  LACTEOS = 'LACTEOS',
  GRASAS_SALUDABLES = 'GRASAS_SALUDABLES',
  AZUCARES = 'AZUCARES',
  BEBIDAS = 'BEBIDAS',
  CONDIMENTOS = 'CONDIMENTOS',
  FRUTOS_SECOS = 'FRUTOS_SECOS',
  SEMILLAS = 'SEMILLAS',
  TUBERCULOS = 'TUBERCULOS',
  OTRO = 'OTRO'
}

export interface Ingrediente {
  id: number;
  nombre: string;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  energia: number;
  fibra?: number;
  categoriaAlimento: CategoriaAlimento;
  descripcion?: string;
  etiquetas: Etiqueta[];
  createdAt: string;
  updatedAt: string;
}

export interface IngredienteRequest {
  nombre: string;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  energia: number;
  fibra?: number;
  categoriaAlimento: CategoriaAlimento;
  descripcion?: string;
  etiquetaIds?: number[];
}

export const CATEGORIA_ALIMENTO_LABELS: Record<CategoriaAlimento, string> = {
  [CategoriaAlimento.FRUTAS]: 'Frutas',
  [CategoriaAlimento.VERDURAS]: 'Verduras',
  [CategoriaAlimento.CEREALES]: 'Cereales',
  [CategoriaAlimento.LEGUMBRES]: 'Legumbres',
  [CategoriaAlimento.PROTEINAS]: 'Proteínas',
  [CategoriaAlimento.LACTEOS]: 'Lácteos',
  [CategoriaAlimento.GRASAS_SALUDABLES]: 'Grasas Saludables',
  [CategoriaAlimento.AZUCARES]: 'Azúcares',
  [CategoriaAlimento.BEBIDAS]: 'Bebidas',
  [CategoriaAlimento.CONDIMENTOS]: 'Condimentos',
  [CategoriaAlimento.FRUTOS_SECOS]: 'Frutos Secos',
  [CategoriaAlimento.SEMILLAS]: 'Semillas',
  [CategoriaAlimento.TUBERCULOS]: 'Tubérculos',
  [CategoriaAlimento.OTRO]: 'Otro'
};

export const CATEGORIA_ALIMENTO_ICONS: Record<CategoriaAlimento, string> = {
  [CategoriaAlimento.FRUTAS]: '🍎',
  [CategoriaAlimento.VERDURAS]: '🥬',
  [CategoriaAlimento.CEREALES]: '🌾',
  [CategoriaAlimento.LEGUMBRES]: '🫘',
  [CategoriaAlimento.PROTEINAS]: '🍗',
  [CategoriaAlimento.LACTEOS]: '🥛',
  [CategoriaAlimento.GRASAS_SALUDABLES]: '🥑',
  [CategoriaAlimento.AZUCARES]: '🍬',
  [CategoriaAlimento.BEBIDAS]: '🥤',
  [CategoriaAlimento.CONDIMENTOS]: '🧂',
  [CategoriaAlimento.FRUTOS_SECOS]: '🥜',
  [CategoriaAlimento.SEMILLAS]: '🌰',
  [CategoriaAlimento.TUBERCULOS]: '🥔',
  [CategoriaAlimento.OTRO]: '📦'
};