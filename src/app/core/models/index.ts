// Exportar todos los modelos desde un solo punto
// Primero exportar modelos comunes para evitar duplicados
export * from './common.model';
export * from './etiqueta.model';
export * from './perfil.model';
export * from './plan.model';
export * from './rutina.model';
export * from './ejercicio.model';
// Export specific types from comida.model to avoid TipoComida conflict with plan.model
export type { Comida, ComidaRequest, InformacionNutricional, RecetaIngrediente, AgregarIngredienteRequest } from './comida.model';
export { TIPO_COMIDA_LABELS, TIPO_COMIDA_ICONS } from './comida.model';
