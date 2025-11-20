export interface RegistroComida {
  id: number;
  fecha: string;            // "yyyy-MM-dd"
  nombreComida: string;     // ej: "Almuerzo"
  planNombre: string;       // nombre del plan activo
  calorias: number;
}
