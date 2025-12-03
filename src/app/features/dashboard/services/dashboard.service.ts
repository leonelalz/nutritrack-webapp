import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, map, catchError } from 'rxjs';
import { environment } from '../../../../enviroments/environment.config';
import { ApiResponse } from '../../../core/models/common.model';

// ===== INTERFACES PARA RESPUESTAS DE API =====

export interface HistorialMedida {
  id: number;
  peso: number;
  altura: number;
  imc: number;
  fechaMedicion: string;
  unidadPeso: string;
}

export interface Logro {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  desbloqueado: boolean;
  fechaDesbloqueo?: string;
  progreso: number;
  objetivo: number;
  tipo: 'racha' | 'peso' | 'ejercicio' | 'nutricion' | 'consistencia';
}

// Respuesta de /usuario/planes/activo
export interface UsuarioPlanResponse {
  id: number;
  planId: number;
  planNombre: string;
  planDescripcion: string;
  planDuracionDias: number;
  fechaInicio: string;
  fechaFin: string;
  diaActual: number;
  estado: string;
  notas: string;
}

// Respuesta de /usuario/rutinas/activa
export interface UsuarioRutinaResponse {
  id: number;
  rutinaId: number;
  rutinaNombre: string;
  rutinaDescripcion: string;
  rutinaDuracionSemanas: number;
  fechaInicio: string;
  fechaFin: string;
  semanaActual: number;
  estado: string;
  notas: string;
}

// Respuesta de /usuario/registros/plan/hoy (ActividadesDiaResponse)
export interface ActividadesDiaResponse {
  fecha: string;
  diaSemana: number;
  nombreDia: string;
  diaActual: number;
  diaPlan: number;
  duracionDias: number;
  nombrePlan: string;
  caloriasObjetivo: number;
  proteinasObjetivo: number;
  carbohidratosObjetivo: number;
  grasasObjetivo: number;
  caloriasConsumidas: number;
  proteinasConsumidas: number;
  carbohidratosConsumidos: number;
  grasasConsumidas: number;
  caloriasPlanificadas: number;
  proteinasPlanificadas: number;
  carbohidratosPlanificados: number;
  grasasPlanificadas: number;
  comidas: ComidaDiaInfo[];
}

export interface ComidaDiaInfo {
  comidaId: number;
  nombre: string;
  tipoComida: string;
  tipoComidaId: number;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  descripcion: string;
  tiempoPreparacionMinutos: number;
  porciones: number;
  notas: string;
  registrada: boolean;
  registroId: number | null;
}

// Respuesta de /usuario/registros/rutina/hoy (EjerciciosDiaResponse)
export interface EjerciciosDiaResponse {
  fecha: string;
  diaSemana: number;
  nombreDia: string;
  semanaActual: number;
  semanaBase: number;
  ejercicios: EjercicioDiaInfo[];
}

export interface EjercicioDiaInfo {
  ejercicioId: number;
  nombre: string;
  seriesObjetivo: number;
  repeticionesObjetivo: number;
  pesoSugerido: number;
  duracionMinutos: number;
  descansoSegundos: number;
  notas: string;
  registrado: boolean;
  registroId: number | null;
}

// Respuesta de /usuario/registros/plan/progreso (ProgresoPlanResponse)
export interface ProgresoPlanResponse {
  usuarioPlanId: number;
  planId: number;
  nombrePlan: string;
  fechaInicio: string;
  fechaActual: string;
  diaActual: number;
  diaPlanCiclico: number;
  duracionDias: number;
  cicloActual: number;
  diasCompletados: number;
  diasParciales: number;
  diasSinRegistro: number;
  porcentajeDiasCompletados: number;
  totalComidasProgramadas: number;
  totalComidasRegistradas: number;
  porcentajeComidasRegistradas: number;
  comidasHoyProgramadas: number;
  comidasHoyCompletadas: number;
  diaActualCompleto: boolean;
  rachaActual: number;
  rachaMejor: number;
  historialDias: DiaPlanInfo[];
}

export interface DiaPlanInfo {
  fecha: string;
  diaPlan: number;
  comidasProgramadas: number;
  comidasCompletadas: number;
  completo: boolean;
  estado: string;
}

// Respuesta de /usuario/registros/comidas/progreso/semanal (ProgresoNutricionalResponse)
export interface ProgresoNutricionalResponse {
  inicioSemana: string;
  finSemana: string;
  nombrePlan: string;
  caloriasObjetivoSemanal: number;
  proteinasObjetivoSemanal: number;
  carbohidratosObjetivoSemanal: number;
  grasasObjetivoSemanal: number;
  caloriasConsumidasSemanal: number;
  proteinasConsumidasSemanal: number;
  carbohidratosConsumidosSemanal: number;
  grasasConsumidasSemanal: number;
  porcentajeCaloriasCumplido: number;
  porcentajeProteinasCumplido: number;
  porcentajeCarbohidratosCumplido: number;
  porcentajeGrasasCumplido: number;
  caloriasPromedioDiario: number;
  proteinasPromedioDiario: number;
  carbohidratosPromedioDiario: number;
  grasasPromedioDiario: number;
  diasConRegistro: number;
  comidasRegistradas: number;
  comidasProgramadas: number;
  porcentajeComidasCumplido: number;
  diasSemana: DiaNutricional[];
}

export interface DiaNutricional {
  fecha: string;
  nombreDia: string;
  diaSemana: number;
  caloriasObjetivo: number;
  proteinasObjetivo: number;
  carbohidratosObjetivo: number;
  grasasObjetivo: number;
  caloriasConsumidas: number;
  proteinasConsumidas: number;
  carbohidratosConsumidos: number;
  grasasConsumidas: number;
  comidasRegistradas: number;
  comidasProgramadas: number;
  diaCompleto: boolean;
}

// Respuesta de /usuario/registros/ejercicios/progreso/semanal (ProgresoSemanalResponse)
export interface ProgresoSemanalEjerciciosResponse {
  inicioSemana: string;
  finSemana: string;
  ejerciciosCompletados: number;
  ejerciciosProgramados: number;
  porcentajeCumplimiento: number;
  caloriasQuemadasTotal: number;
  tiempoTotalMinutos: number;
  diasSemana: DiaSemanaInfo[];
}

export interface DiaSemanaInfo {
  fecha: string;
  diaSemana: string;
  ejerciciosCompletados: number;
  caloriasQuemadas: number;
  tiempoMinutos: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Obtener perfil completo del usuario
   * GET /api/v1/perfil/completo
   */
  obtenerPerfilCompleto(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/perfil/completo`);
  }

  /**
   * Obtener historial de mediciones
   * GET /api/v1/perfil/mediciones
   */
  obtenerHistorialMediciones(): Observable<ApiResponse<HistorialMedida[]>> {
    return this.http.get<ApiResponse<HistorialMedida[]>>(`${this.apiUrl}/perfil/mediciones`);
  }

  /**
   * Obtener plan activo del usuario
   * GET /api/v1/usuario/planes/activo
   */
  obtenerPlanActivo(): Observable<ApiResponse<UsuarioPlanResponse>> {
    return this.http.get<ApiResponse<UsuarioPlanResponse>>(`${this.apiUrl}/usuario/planes/activo`);
  }

  /**
   * Obtener rutina activa del usuario
   * GET /api/v1/usuario/rutinas/activa
   */
  obtenerRutinaActiva(): Observable<ApiResponse<UsuarioRutinaResponse>> {
    return this.http.get<ApiResponse<UsuarioRutinaResponse>>(`${this.apiUrl}/usuario/rutinas/activa`);
  }

  /**
   * Obtener actividades del plan de hoy (comidas programadas y su estado)
   * GET /api/v1/usuario/registros/plan/hoy
   */
  obtenerProgresoHoy(): Observable<ActividadesDiaResponse> {
    return this.http.get<ActividadesDiaResponse>(`${this.apiUrl}/usuario/registros/plan/hoy`);
  }

  /**
   * Obtener progreso acumulado del plan (estadísticas completas, rachas, historial)
   * GET /api/v1/usuario/registros/plan/progreso
   */
  obtenerProgresoPlan(): Observable<ProgresoPlanResponse> {
    return this.http.get<ProgresoPlanResponse>(`${this.apiUrl}/usuario/registros/plan/progreso`);
  }

  /**
   * Obtener ejercicios programados de hoy y su estado
   * GET /api/v1/usuario/registros/rutina/hoy
   */
  obtenerEjerciciosHoy(): Observable<EjerciciosDiaResponse> {
    return this.http.get<EjerciciosDiaResponse>(`${this.apiUrl}/usuario/registros/rutina/hoy`);
  }

  /**
   * Obtener progreso nutricional semanal
   * GET /api/v1/usuario/registros/comidas/progreso/semanal
   */
  obtenerProgresoSemanalComidas(fecha?: string): Observable<ProgresoNutricionalResponse> {
    if (fecha) {
      return this.http.get<ProgresoNutricionalResponse>(
        `${this.apiUrl}/usuario/registros/comidas/progreso/semanal`,
        { params: { fecha } }
      );
    }
    return this.http.get<ProgresoNutricionalResponse>(
      `${this.apiUrl}/usuario/registros/comidas/progreso/semanal`
    );
  }

  /**
   * Obtener progreso semanal de ejercicios
   * GET /api/v1/usuario/registros/ejercicios/progreso/semanal
   */
  obtenerProgresoSemanalEjercicios(fecha?: string): Observable<ProgresoSemanalEjerciciosResponse> {
    if (fecha) {
      return this.http.get<ProgresoSemanalEjerciciosResponse>(
        `${this.apiUrl}/usuario/registros/ejercicios/progreso/semanal`,
        { params: { fecha } }
      );
    }
    return this.http.get<ProgresoSemanalEjerciciosResponse>(
      `${this.apiUrl}/usuario/registros/ejercicios/progreso/semanal`
    );
  }

  /**
   * Obtener historial de comidas en un rango de fechas
   * GET /api/v1/usuario/registros/comidas/historial
   */
  obtenerHistorialComidas(fechaInicio: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/usuario/registros/comidas/historial`,
      { params: { fechaInicio, fechaFin } }
    );
  }

  /**
   * Obtener historial de ejercicios en un rango de fechas
   * GET /api/v1/usuario/registros/ejercicios/historial
   */
  obtenerHistorialEjercicios(fechaInicio: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/usuario/registros/ejercicios/historial`,
      { params: { fechaInicio, fechaFin } }
    );
  }

  /**
   * Cargar todos los datos del dashboard en paralelo
   */
  cargarDashboardCompleto(): Observable<{
    perfil: any;
    mediciones: HistorialMedida[];
    planActivo: UsuarioPlanResponse | null;
    rutinaActiva: UsuarioRutinaResponse | null;
    progresoHoy: ActividadesDiaResponse | null;
    progresoPlan: ProgresoPlanResponse | null;
    ejerciciosHoy: EjerciciosDiaResponse | null;
    progresoSemanalComidas: ProgresoNutricionalResponse | null;
    progresoSemanalEjercicios: ProgresoSemanalEjerciciosResponse | null;
  }> {
    return forkJoin({
      perfil: this.obtenerPerfilCompleto().pipe(
        map(r => r.data),
        catchError(() => of(null))
      ),
      mediciones: this.obtenerHistorialMediciones().pipe(
        map(r => r.data || []),
        catchError(() => of([]))
      ),
      planActivo: this.obtenerPlanActivo().pipe(
        map(r => r.data),
        catchError(() => of(null))
      ),
      rutinaActiva: this.obtenerRutinaActiva().pipe(
        map(r => r.data),
        catchError(() => of(null))
      ),
      progresoHoy: this.obtenerProgresoHoy().pipe(
        catchError(() => of(null))
      ),
      progresoPlan: this.obtenerProgresoPlan().pipe(
        catchError(() => of(null))
      ),
      ejerciciosHoy: this.obtenerEjerciciosHoy().pipe(
        catchError(() => of(null))
      ),
      progresoSemanalComidas: this.obtenerProgresoSemanalComidas().pipe(
        catchError(() => of(null))
      ),
      progresoSemanalEjercicios: this.obtenerProgresoSemanalEjercicios().pipe(
        catchError(() => of(null))
      )
    });
  }

  /**
   * Calcular logros basados en los datos del dashboard
   */
  calcularLogros(data: any): Logro[] {
    const logros: Logro[] = [];
    const mediciones = data.mediciones || [];
    const perfil = data.perfil;
    const progresoPlan = data.progresoPlan;
    const progresoSemanalEjercicios = data.progresoSemanalEjercicios;
    const progresoHoy = data.progresoHoy;

    // Logro: Primera medición
    logros.push({
      id: 'primera-medicion',
      nombre: '¡Primera Medición!',
      descripcion: 'Registra tu primera medición corporal',
      icono: '📏',
      desbloqueado: mediciones.length > 0,
      progreso: Math.min(mediciones.length, 1),
      objetivo: 1,
      tipo: 'peso'
    });

    // Logro: 7 días de racha (usar datos reales del API)
    const rachaActual = progresoPlan?.rachaActual || this.calcularRacha(data);
    logros.push({
      id: 'racha-7',
      nombre: 'Semana Perfecta',
      descripcion: 'Mantén una racha de 7 días consecutivos',
      icono: '🔥',
      desbloqueado: rachaActual >= 7,
      progreso: Math.min(rachaActual, 7),
      objetivo: 7,
      tipo: 'racha'
    });

    // Logro: 30 días de racha
    logros.push({
      id: 'racha-30',
      nombre: 'Mes Imparable',
      descripcion: 'Mantén una racha de 30 días consecutivos',
      icono: '🏆',
      desbloqueado: rachaActual >= 30,
      progreso: Math.min(rachaActual, 30),
      objetivo: 30,
      tipo: 'racha'
    });

    // Logro: Pérdida de peso
    if (mediciones.length >= 2) {
      const primeraM = mediciones[mediciones.length - 1];
      const ultimaM = mediciones[0];
      const diferencia = primeraM.peso - ultimaM.peso;
      
      logros.push({
        id: 'perdida-5kg',
        nombre: 'Transformación',
        descripcion: 'Pierde 5 kg desde tu peso inicial',
        icono: '⚖️',
        desbloqueado: diferencia >= 5,
        progreso: Math.min(Math.max(diferencia, 0), 5),
        objetivo: 5,
        tipo: 'peso'
      });
    }

    // Logro: 10 ejercicios completados
    const ejerciciosTotal = progresoSemanalEjercicios?.ejerciciosCompletados || 0;
    logros.push({
      id: 'ejercicios-10',
      nombre: 'En Movimiento',
      descripcion: 'Completa 10 ejercicios',
      icono: '💪',
      desbloqueado: ejerciciosTotal >= 10,
      progreso: Math.min(ejerciciosTotal, 10),
      objetivo: 10,
      tipo: 'ejercicio'
    });

    // Logro: Meta diaria cumplida
    const comidasHoy = progresoHoy?.comidas?.filter((c: any) => c.registrada)?.length || 0;
    const totalComidasHoy = progresoHoy?.comidas?.length || 0;
    logros.push({
      id: 'meta-diaria',
      nombre: 'Día Perfecto',
      descripcion: 'Cumple todas las comidas del día',
      icono: '✨',
      desbloqueado: comidasHoy > 0 && comidasHoy === totalComidasHoy,
      progreso: comidasHoy,
      objetivo: Math.max(totalComidasHoy, 1),
      tipo: 'nutricion'
    });

    // Logro: Perfil completo
    const perfilCompleto = perfil && perfil.perfilSalud && perfil.ultimaMedicion;
    logros.push({
      id: 'perfil-completo',
      nombre: 'Listo para Empezar',
      descripcion: 'Completa tu perfil de salud y primera medición',
      icono: '🎯',
      desbloqueado: !!perfilCompleto,
      progreso: perfilCompleto ? 2 : (perfil?.perfilSalud ? 1 : 0),
      objetivo: 2,
      tipo: 'consistencia'
    });

    // Logro: 100 ejercicios completados
    logros.push({
      id: 'ejercicios-100',
      nombre: 'Atleta Dedicado',
      descripcion: 'Completa 100 ejercicios en total',
      icono: '🏅',
      desbloqueado: ejerciciosTotal >= 100,
      progreso: Math.min(ejerciciosTotal, 100),
      objetivo: 100,
      tipo: 'ejercicio'
    });

    // Logro: Días completados en el plan
    const diasCompletados = progresoPlan?.diasCompletados || 0;
    logros.push({
      id: 'plan-10-dias',
      nombre: 'Comprometido',
      descripcion: 'Completa 10 días de tu plan nutricional',
      icono: '📅',
      desbloqueado: diasCompletados >= 10,
      progreso: Math.min(diasCompletados, 10),
      objetivo: 10,
      tipo: 'consistencia'
    });

    return logros;
  }

  /**
   * Calcular racha de días activos (fallback si no hay datos del API)
   */
  calcularRacha(data: any): number {
    // Primero intentar usar datos del progreso del plan (más precisos)
    if (data.progresoPlan?.rachaActual) {
      return data.progresoPlan.rachaActual;
    }

    // Fallback: calcular desde fecha de inicio
    const planActivo = data.planActivo;
    const rutinaActiva = data.rutinaActiva;
    
    let diasActivo = 0;
    
    if (planActivo?.fechaInicio) {
      const inicio = new Date(planActivo.fechaInicio);
      const hoy = new Date();
      diasActivo = Math.max(diasActivo, Math.floor((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    }
    
    if (rutinaActiva?.fechaInicio) {
      const inicio = new Date(rutinaActiva.fechaInicio);
      const hoy = new Date();
      diasActivo = Math.max(diasActivo, Math.floor((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    }

    return diasActivo;
  }
}
