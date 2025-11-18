/**
 * Modelos comunes compartidos entre diferentes módulos
 */

// Etiqueta - usada por planes y rutinas
export interface Etiqueta {
  id: number;
  nombre: string;
  tipoEtiqueta: string;
  descripcion: string;
  createdAt: string | null;
  updatedAt: string | null;
}

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
export enum DiaSemana {
  LUNES = 'LUNES',
  MARTES = 'MARTES',
  MIERCOLES = 'MIERCOLES',
  JUEVES = 'JUEVES',
  VIERNES = 'VIERNES',
  SABADO = 'SABADO',
  DOMINGO = 'DOMINGO'
}
