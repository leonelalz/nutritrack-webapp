export enum ObjetivoSalud {
  PERDER_PESO = 'PERDER_PESO',
  GANAR_MASA_MUSCULAR = 'GANAR_MASA_MUSCULAR',
  MANTENER_FORMA = 'MANTENER_FORMA',
  REHABILITACION = 'REHABILITACION',
  CONTROLAR_ESTRES = 'CONTROLAR_ESTRES',
}

export enum NivelActividad {
  BAJO = 'BAJO',      // Sedentario, poco o ningún ejercicio
  MODERADO = 'MODERADO',  // Ejercicio ligero 1-3 días/semana
  ALTO ='ALTO'       // Ejercicio intenso 4-7 días/semana
}

export enum UnidadesMedida {
  KG = 'KG',
  LBS = 'LBS'
}

export enum Genero {
  MASCULINO = 'MASCULINO',
  FEMENINO = 'FEMENINO',
  OTRO = 'OTRO'
}



// ===== REQUEST DTOs =====
export interface UpdateUnidadesMedidaRequest {
  unidadesMedida: UnidadesMedida;
}

export interface PerfilSaludRequest {
  objetivoActual: ObjetivoSalud | undefined;    // Texto libre
  nivelActividadActual: NivelActividad | undefined;
  etiquetasId: number[] | undefined;     // IDs de alergias, condiciones
}

export interface HistorialMedidasRequest {
  peso: number;
  altura: number;
  fechaMedicion: string;
}

export interface DeleteAccountRequest {
  confirmacion: string;   // Usuario debe escribir "ELIMINAR" (RN05)
}

// ===== RESPONSE DTOs =====
import { Etiqueta } from './etiqueta.model';

export interface PerfilSaludResponse {
  id: number;
  objetivoActual: ObjetivoSalud;
  nivelActividadActual: NivelActividad;
  fechaActualizacion?: string;
  etiquetas: Etiqueta[];
}

export interface HistorialMedidasResponse {
  id: number;
  peso: number;
  altura: number;
  imc: number;
  fechaMedicion: string;
  unidadPeso: UnidadesMedida;
  categoriaIMC?: string;
}

export interface PerfilCompletoResponse {
    id: number;
    email: string;
    rol: string;
    activo: boolean;
    fechaRegistro: string;

    nombre: string;
    apellido: string;
    nombreCompleto: string;
    unidadesMedida: UnidadesMedida;
    fechaInicioApp: string;

    perfilSalud: PerfilSaludResponse;

    ultimaMedicion: HistorialMedidasResponse | null;
    
    totalMediciones: number;
}
