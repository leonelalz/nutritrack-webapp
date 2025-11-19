/**
 * Modelos comunes compartidos entre diferentes módulos
 */

// Respuesta paginada del API Spring Boot
export interface PagedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

// Días de la semana (usado en rutinas)
// El backend espera valores numéricos: 1=Lunes, 2=Martes, etc.
export enum DiaSemana {
  LUNES = 1,
  MARTES = 2,
  MIERCOLES = 3,
  JUEVES = 4,
  VIERNES = 5,
  SABADO = 6,
  DOMINGO = 7
}
