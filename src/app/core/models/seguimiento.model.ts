// src/app/core/models/seguimiento.model.ts

export interface ActividadesDiaResponse {
  fecha: string;             // LocalDate en ISO "yyyy-MM-dd"
  diaActual: number;         // Día número del plan
  caloriasObjetivo: number;  // Calorías objetivo del día
  caloriasConsumidas: number;
  comidas: ComidaDiaInfo[];
}

export interface ComidaDiaInfo {
  comidaId: number;
  nombre: string;
  tipoComida: string;        // DESAYUNO, ALMUERZO, etc.
  calorias: number;
  registrada: boolean;       // <-- esto viene del backend y es el "check"
  registroId?: number | null;
}
