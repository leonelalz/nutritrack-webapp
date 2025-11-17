// =====================
//      ENUMS
// =====================
export enum UnidadPeso {
  KG = 'KG',
  LBS = 'LBS'
}

// =====================
//     REQUESTS
// =====================

/**
 * Para registrar una nueva medición del usuario.
 * Alineado con HistorialMedidasRequest del backend.
 */
export interface HistorialMedidasRequest {
  peso: number;             // BigDecimal → number
  altura: number;           // cm
  fechaMedicion: string;    // ISO date string: "2025-11-04"
  unidadPeso?: UnidadPeso;  // opcional, default = KG
}

// =====================
//     RESPONSES
// =====================

/**
 * Respuesta enviada por el backend.
 * Alineada con HistorialMedidasResponse.
 */
export interface HistorialMedidasResponse {
  id: number;
  peso: number;
  altura: number;
  imc: number;
  fechaMedicion: string;    // ISO "yyyy-MM-dd"
  unidadPeso: UnidadPeso;
}
