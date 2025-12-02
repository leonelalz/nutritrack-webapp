import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, switchMap, map } from "rxjs";
import { ApiResponse } from "../models";
import { environment } from "../../../enviroments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class MetasService {
  private readonly usuarioUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) { }

  // ============================================================================
  // ASIGNACIONES DEL USUARIO
  // ============================================================================

  /**
   * US-20: Obtener planes activos del usuario (lista)
   * Endpoint: GET /api/v1/usuario/planes/activos
   * Retorna: Array de planes con estado ACTIVO
   */
  obtenerPlanesActivos(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.usuarioUrl}/planes/activos`
    );
  }

  /**
   * Obtener EL plan activo actual (singular)
   * Endpoint: GET /api/v1/usuario/planes/activo
   * Retorna: Un solo plan activo o null si no hay
   * Útil para: Dashboard de metas, seguimiento diario
   */
  obtenerPlanActivo(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.usuarioUrl}/planes/activo`
    );
  }

  /**
   * US-20: Obtener historial completo de planes del usuario
   * Endpoint: GET /api/v1/usuario/planes
   * Incluye: planes activos, pausados, completados, cancelados
   */
  obtenerHistorialPlanes(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.usuarioUrl}/planes`
    );
  }

  /**
   * Obtener todos los planes del usuario (historial completo)
   * @deprecated Usar obtenerHistorialPlanes() - mismo endpoint
   */
  obtenerTodosLosPlanesDeUsuario(): Observable<ApiResponse<any[]>> {
    return this.obtenerHistorialPlanes();
  }

  /**
   * US-20: Obtener rutinas activas del usuario (lista)
   * Endpoint: GET /api/v1/usuario/rutinas/activas
   * Retorna: Array de rutinas con estado ACTIVO
   */
  obtenerRutinasActivas(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.usuarioUrl}/rutinas/activas`
    );
  }

  /**
   * Obtener LA rutina activa actual (singular)
   * Endpoint: GET /api/v1/usuario/rutinas/activa
   * Retorna: Una sola rutina activa o null si no hay
   * Útil para: Dashboard de metas, seguimiento diario
   */
  obtenerRutinaActiva(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.usuarioUrl}/rutinas/activa`
    );
  }

  /**
   * US-20: Obtener historial completo de rutinas del usuario
   * Endpoint: GET /api/v1/usuario/rutinas
   * Incluye: rutinas activas, pausadas, completadas, canceladas
   */
  obtenerHistorialRutinas(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.usuarioUrl}/rutinas`
    );
  }

  /**
   * Obtener todas las rutinas del usuario (historial completo)
   * @deprecated Usar obtenerHistorialRutinas() - mismo endpoint
   */
  obtenerTodasLasRutinasDeUsuario(): Observable<ApiResponse<any[]>> {
    return this.obtenerHistorialRutinas();
  }

  // ============================================================================
  // ACTIVACIÓN DE PLANES (ASIGNACIÓN)
  // ============================================================================

  /**
   * US-16/US-17: Activar un plan para el usuario
   * Endpoint: POST /api/v1/usuario/planes/activar
   */
  activarPlan(request: { planId: number; fechaInicio?: string; notas?: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.usuarioUrl}/planes/activar`,
      request
    );
  }

  /**
   * US-19: Pausar un plan
   * Endpoint: PATCH /api/v1/usuario/planes/{usuarioPlanId}/pausar
   */
  pausarPlan(usuarioPlanId: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
      `${this.usuarioUrl}/planes/${usuarioPlanId}/pausar`,
      {}
    );
  }

  /**
   * US-19: Reanudar un plan
   * Endpoint: PATCH /api/v1/usuario/planes/{usuarioPlanId}/reanudar
   */
  reanudarPlan(usuarioPlanId: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
      `${this.usuarioUrl}/planes/${usuarioPlanId}/reanudar`,
      {}
    );
  }

  /**
   * US-20: Completar un plan
   * Endpoint: PATCH /api/v1/usuario/planes/{usuarioPlanId}/completar
   */
  completarPlan(usuarioPlanId: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
      `${this.usuarioUrl}/planes/${usuarioPlanId}/completar`,
      {}
    );
  }

  /**
   * US-20: Cancelar un plan
   * Endpoint: PATCH /api/v1/usuario/planes/{usuarioPlanId}/cancelar
   */
  cancelarPlan(usuarioPlanId: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
      `${this.usuarioUrl}/planes/${usuarioPlanId}/cancelar`,
      {}
    );
  }

  // ============================================================================
  // ACTIVACIÓN DE RUTINAS (ASIGNACIÓN)
  // ============================================================================

  /**
   * US-16/US-17: Activar una rutina para el usuario
   * Endpoint: POST /api/v1/usuario/rutinas/activar
   */
  activarRutina(request: { rutinaId: number; fechaInicio?: string; notas?: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.usuarioUrl}/rutinas/activar`,
      request
    );
  }

  /**
   * US-19: Pausar una rutina
   * Endpoint: PATCH /api/v1/usuario/rutinas/{usuarioRutinaId}/pausar
   */
  pausarRutina(usuarioRutinaId: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
      `${this.usuarioUrl}/rutinas/${usuarioRutinaId}/pausar`,
      {}
    );
  }

  /**
   * US-19: Reanudar una rutina
   * Endpoint: PATCH /api/v1/usuario/rutinas/{usuarioRutinaId}/reanudar
   */
  reanudarRutina(usuarioRutinaId: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
      `${this.usuarioUrl}/rutinas/${usuarioRutinaId}/reanudar`,
      {}
    );
  }

  /**
   * US-20: Completar una rutina
   * Endpoint: PATCH /api/v1/usuario/rutinas/{usuarioRutinaId}/completar
   */
  completarRutina(usuarioRutinaId: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
      `${this.usuarioUrl}/rutinas/${usuarioRutinaId}/completar`,
      {}
    );
  }

  /**
   * US-20: Cancelar una rutina
   * Endpoint: PATCH /api/v1/usuario/rutinas/{usuarioRutinaId}/cancelar
   */
  cancelarRutina(usuarioRutinaId: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
      `${this.usuarioUrl}/rutinas/${usuarioRutinaId}/cancelar`,
      {}
    );
  }

  // ============================================================================
  // SEGUIMIENTO: COMIDAS Y EJERCICIOS PROGRAMADOS
  // ============================================================================

  /**
   * Obtener comidas programadas para hoy del plan activo
   * Usa el endpoint: GET /api/v1/planes/{id}/dias/{numeroDia}
   * 
   * Pasos:
   * 1. Obtiene planes activos del usuario
   * 2. Calcula el día actual según la fecha de inicio
   * 3. Llama al endpoint con el planId y numeroDia
   */
  obtenerComidasProgramadasHoy(): Observable<ApiResponse<any[]>> {
    return this.obtenerPlanesActivos().pipe(
      switchMap(response => {
        if (!response.success || !response.data || response.data.length === 0) {
          // No hay planes activos, retornar array vacío
          return new Observable<ApiResponse<any[]>>(observer => {
            observer.next({ success: true, data: [], message: 'No hay planes activos' });
            observer.complete();
          });
        }

        // Obtener el primer plan activo
        const planActivo = response.data[0];
        const planId = planActivo.plan?.id || planActivo.planId;
        const fechaInicio = new Date(planActivo.fechaInicio);
        const hoy = new Date();
        
        // Calcular el número de día (1-based)
        // Días transcurridos desde fechaInicio + 1
        const diffTime = hoy.getTime() - fechaInicio.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const numeroDia = diffDays + 1;

        // Si el día calculado es negativo o 0, significa que no ha empezado
        if (numeroDia <= 0) {
          return new Observable<ApiResponse<any[]>>(observer => {
            observer.next({ success: true, data: [], message: 'El plan aún no ha comenzado' });
            observer.complete();
          });
        }

        // Llamar al endpoint específico del día
        return this.http.get<ApiResponse<any[]>>(
          `${environment.apiUrl}/planes/${planId}/dias/${numeroDia}`
        ).pipe(
          map(comidasResponse => {
            // Mapear las comidas para extraer los datos nutricionales correctamente
            const comidas = (comidasResponse.data || []).map((planDia: any) => ({
              id: planDia.id,
              numeroDia: planDia.numeroDia,
              tipoComida: planDia.tipoComida,
              comidaId: planDia.comida?.id,
              comidaNombre: planDia.comida?.nombre,
              notas: planDia.notas,
              // Datos nutricionales de la comida (energiaTotal = calorías)
              calorias: planDia.comida?.nutricionTotal?.energiaTotal || planDia.comida?.calorias || 0,
              proteinas: planDia.comida?.nutricionTotal?.proteinasTotales || planDia.comida?.proteinas || 0,
              carbohidratos: planDia.comida?.nutricionTotal?.carbohidratosTotales || planDia.comida?.carbohidratos || 0,
              grasas: planDia.comida?.nutricionTotal?.grasasTotales || planDia.comida?.grasas || 0,
              // Objeto comida completo para el modal de detalle
              comida: planDia.comida ? {
                id: planDia.comida.id,
                nombre: planDia.comida.nombre,
                tipoComida: planDia.comida.tipoComida,
                descripcion: planDia.comida.descripcion,
                instrucciones: planDia.comida.instrucciones,
                tiempoPreparacionMinutos: planDia.comida.tiempoPreparacionMinutos,
                porciones: planDia.comida.porciones,
                ingredientes: planDia.comida.ingredientes || [],
                calorias: planDia.comida.nutricionTotal?.energiaTotal || 0,
                proteinas: planDia.comida.nutricionTotal?.proteinasTotales || 0,
                carbohidratos: planDia.comida.nutricionTotal?.carbohidratosTotales || 0,
                grasas: planDia.comida.nutricionTotal?.grasasTotales || 0,
                nutricionTotal: planDia.comida.nutricionTotal
              } : null,
              completada: false,
              porciones: 1
            }));
            
            return {
              success: true,
              data: comidas,
              message: `${comidas.length} comida(s) para hoy (día ${numeroDia})`
            };
          })
        );
      })
    );
  }

  /**
   * Obtener ejercicios programados para hoy de la rutina activa
   * Endpoint: GET /api/v1/rutinas/{id}/ejercicios
   * 
   * Pasos:
   * 1. Obtiene rutinas activas del usuario
   * 2. Calcula la semana y día actual según la fecha de inicio
   * 3. Filtra ejercicios que correspondan al día de hoy (semanaBase y diaSemana)
   * 4. Ordena por campo 'orden' para mantener secuencia correcta
   */
  obtenerEjerciciosProgramadosHoy(): Observable<ApiResponse<any[]>> {
    return this.obtenerRutinasActivas().pipe(
      switchMap(response => {
        if (!response.success || !response.data || response.data.length === 0) {
          // No hay rutinas activas, retornar array vacío
          return new Observable<ApiResponse<any[]>>(observer => {
            observer.next({ success: true, data: [], message: 'No hay rutinas activas' });
            observer.complete();
          });
        }

        // Obtener la primera rutina activa
        const rutinaActiva = response.data[0];
        const rutinaId = rutinaActiva.rutina?.id || rutinaActiva.rutinaId;
        const patronSemanas = rutinaActiva.rutina?.patronSemanas || rutinaActiva.patronSemanas || 1;
        const fechaInicio = new Date(rutinaActiva.fechaInicio);
        const hoy = new Date();
        
        // Calcular días transcurridos
        const diffTime = hoy.getTime() - fechaInicio.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          return new Observable<ApiResponse<any[]>>(observer => {
            observer.next({ success: true, data: [], message: 'La rutina aún no ha comenzado' });
            observer.complete();
          });
        }

        // Calcular semana base (1-based, con patrón cíclico)
        const semanaAbsoluta = Math.floor(diffDays / 7) + 1;
        const semanaBase = ((semanaAbsoluta - 1) % patronSemanas) + 1;

        // Obtener día de la semana actual (0=Domingo, 1=Lunes, ..., 6=Sábado)
        const diaSemanaJS = hoy.getDay();
        
        // Mapear a número del API: 1=Lunes, 2=Martes, ..., 7=Domingo
        // JavaScript: 0=Domingo, 1=Lunes, ..., 6=Sábado
        // API: 1=Lunes, 2=Martes, ..., 6=Sábado, 7=Domingo
        const diaSemanaAPI = diaSemanaJS === 0 ? 7 : diaSemanaJS;

        console.log('📅 Calculando ejercicios de hoy:', {
          fechaInicio: fechaInicio.toISOString().split('T')[0],
          hoy: hoy.toISOString().split('T')[0],
          diffDays,
          semanaAbsoluta,
          patronSemanas,
          semanaBase,
          diaSemanaJS,
          diaSemanaAPI
        });

        // Obtener todos los ejercicios de la rutina
        return this.http.get<ApiResponse<any[]>>(
          `${environment.apiUrl}/rutinas/${rutinaId}/ejercicios`
        ).pipe(
          map(ejerciciosResponse => {
            if (!ejerciciosResponse.success || !ejerciciosResponse.data) {
              return { success: true, data: [], message: 'No hay ejercicios' };
            }

            console.log('🏋️ Ejercicios de la rutina:', ejerciciosResponse.data);

            // Filtrar ejercicios para el día actual
            // API usa: semanaBase (int), diaSemana (int 1-7), orden (int)
            const ejerciciosHoy = ejerciciosResponse.data
              .filter(ej => {
                const matchSemana = ej.semanaBase === semanaBase;
                const matchDia = ej.diaSemana === diaSemanaAPI;
                console.log(`  - ${ej.ejercicio?.nombre}: semana ${ej.semanaBase}=${semanaBase}? ${matchSemana}, dia ${ej.diaSemana}=${diaSemanaAPI}? ${matchDia}`);
                return matchSemana && matchDia;
              })
              .sort((a, b) => (a.orden || 0) - (b.orden || 0)) // Ordenar por campo 'orden'
              .map(ej => ({
                ...ej,
                ejercicioNombre: ej.ejercicio?.nombre || 'Ejercicio',
                ejercicioDescripcion: ej.ejercicio?.descripcion || '',
                grupoMuscular: ej.ejercicio?.grupoMuscular || '',
                tipoEjercicio: ej.ejercicio?.tipoEjercicio || ''
              }));

            console.log('✅ Ejercicios para hoy:', ejerciciosHoy.length);

            return {
              success: true,
              data: ejerciciosHoy,
              message: `${ejerciciosHoy.length} ejercicio(s) para hoy`
            };
          })
        );
      })
    );
  }

  /**
   * Marcar comida como consumida
   * Endpoint: POST /api/v1/usuario/registros/comidas
   */
  registrarComidaConsumida(data: {
    comidaId: number;
    usuarioPlanId?: number;
    fecha: string;
    hora?: string;
    tipoComidaId?: number;
    tipoComidaNombre?: string;
    porciones?: number;
    notas?: string;
  }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.usuarioUrl}/registros/comidas`,
      data
    );
  }

  /**
   * Marcar ejercicio como completado
   * Endpoint: POST /api/v1/usuario/registros/ejercicios
   */
  registrarEjercicioCompletado(data: {
    ejercicioId: number;
    usuarioRutinaId?: number;
    fecha: string;
    hora?: string;
    series?: number;
    repeticiones?: number;
    pesoKg?: number;
    duracionMinutos?: number;
    notas?: string;
  }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.usuarioUrl}/registros/ejercicios`,
      data
    );
  }

  /**
   * Obtener ejercicios de la rutina de HOY con estado de completitud
   * Endpoint: GET /api/v1/usuario/registros/rutina/hoy
   * Retorna: { fecha, semanaActual, ejercicios: [{ ejercicioId, nombre, registrado, registroId, ... }] }
   */
  obtenerRutinaHoyConEstado(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.usuarioUrl}/registros/rutina/hoy`
    );
  }

  /**
   * Eliminar registro de ejercicio (desmarcar como completado)
   * Endpoint: DELETE /api/v1/usuario/registros/ejercicios/{registroId}
   */
  eliminarRegistroEjercicio(registroId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.usuarioUrl}/registros/ejercicios/${registroId}`
    );
  }

  /**
   * Obtener progreso semanal de ejercicios
   * Endpoint: GET /api/v1/usuario/registros/ejercicios/progreso/semanal
   */
  obtenerProgresoSemanal(fecha?: string): Observable<ApiResponse<any>> {
    if (fecha) {
      return this.http.get<ApiResponse<any>>(
        `${this.usuarioUrl}/registros/ejercicios/progreso/semanal`,
        { params: { fecha } }
      );
    }
    return this.http.get<ApiResponse<any>>(
      `${this.usuarioUrl}/registros/ejercicios/progreso/semanal`
    );
  }

  // ============================================================
  // MÉTODOS PARA REGISTRO DE COMIDAS
  // ============================================================

  /**
   * Obtener comidas del plan de HOY con estado de completitud y macros completos
   * Endpoint: GET /api/v1/usuario/registros/plan/hoy
   * Retorna: { fecha, diaActual, caloriasObjetivo, caloriasConsumidas, 
   *            proteinasObjetivo, proteinasConsumidas, carbohidratosObjetivo, carbohidratosConsumidas,
   *            grasasObjetivo, grasasConsumidas,
   *            comidas: [{ comidaId, nombre, tipoComida, calorias, proteinas, carbohidratos, grasas,
   *                        ingredientes, registrada, registroId }] }
   */
  obtenerPlanHoyConEstado(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.usuarioUrl}/registros/plan/hoy`
    );
  }

  /**
   * Obtener comidas de una fecha específica con estado
   * Endpoint: GET /api/v1/usuario/registros/plan/dia?fecha=YYYY-MM-DD
   */
  obtenerPlanDiaConEstado(fecha: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.usuarioUrl}/registros/plan/dia`,
      { params: { fecha } }
    );
  }

  /**
   * Eliminar registro de comida (desmarcar como consumida)
   * Endpoint: DELETE /api/v1/usuario/registros/comidas/{registroId}
   */
  eliminarRegistroComida(registroId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.usuarioUrl}/registros/comidas/${registroId}`
    );
  }

  // ============================================================
  // CALENDARIO DE COMIDAS
  // ============================================================

  /**
   * Obtener calendario de comidas personalizado
   * Endpoint: GET /api/v1/usuario/registros/comidas/calendario?fechaInicio=&fechaFin=
   * Retorna: Estado de cada día, comidas programadas vs completadas, resumen nutricional
   */
  obtenerCalendarioComidas(fechaInicio: string, fechaFin: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.usuarioUrl}/registros/comidas/calendario`,
      { params: { fechaInicio, fechaFin } }
    );
  }

  /**
   * Obtener calendario de comidas - Vista semanal
   * Endpoint: GET /api/v1/usuario/registros/comidas/calendario/semana
   */
  obtenerCalendarioSemanal(fecha?: string): Observable<ApiResponse<any>> {
    const url = `${this.usuarioUrl}/registros/comidas/calendario/semana`;
    if (fecha) {
      return this.http.get<ApiResponse<any>>(url, { params: { fecha } });
    }
    return this.http.get<ApiResponse<any>>(url);
  }

  /**
   * Obtener calendario de comidas - Vista mensual
   * Endpoint: GET /api/v1/usuario/registros/comidas/calendario/mes
   */
  obtenerCalendarioMensual(fecha?: string): Observable<ApiResponse<any>> {
    const url = `${this.usuarioUrl}/registros/comidas/calendario/mes`;
    if (fecha) {
      return this.http.get<ApiResponse<any>>(url, { params: { fecha } });
    }
    return this.http.get<ApiResponse<any>>(url);
  }

  // ============================================================
  // PROGRESO NUTRICIONAL
  // ============================================================

  /**
   * Obtener progreso semanal de comidas con macros completos
   * Endpoint: GET /api/v1/usuario/registros/comidas/progreso/semanal
   * Retorna: Objetivos vs consumo (calorías, proteínas, carbos, grasas),
   *          porcentajes de cumplimiento, promedios diarios, desglose por día
   */
  obtenerProgresoSemanalComidas(fecha?: string): Observable<ApiResponse<any>> {
    const url = `${this.usuarioUrl}/registros/comidas/progreso/semanal`;
    if (fecha) {
      return this.http.get<ApiResponse<any>>(url, { params: { fecha } });
    }
    return this.http.get<ApiResponse<any>>(url);
  }

  /**
   * Obtener progreso semanal de ejercicios
   * Endpoint: GET /api/v1/usuario/registros/ejercicios/progreso/semanal
   * Retorna: Ejercicios completados vs programados, porcentaje cumplimiento,
   *          calorías quemadas, tiempo total, desglose por día
   */
  obtenerProgresoSemanalEjercicios(fecha?: string): Observable<ApiResponse<any>> {
    const url = `${this.usuarioUrl}/registros/ejercicios/progreso/semanal`;
    if (fecha) {
      return this.http.get<ApiResponse<any>>(url, { params: { fecha } });
    }
    return this.http.get<ApiResponse<any>>(url);
  }

  // ============================================================
  // COMIDAS EXTRA (NO PLANIFICADAS)
  // ============================================================

  /**
   * Registrar comida extra (no del plan)
   * Endpoint: POST /api/v1/usuario/registros/comidas/extra
   * @param data - Puede usar comidaId para comida del catálogo 
   *               o nombreComida + nutrientes para comida manual
   */
  registrarComidaExtra(data: {
    comidaId?: number;
    nombreComida?: string;
    descripcion?: string;
    tipoComidaId?: number;
    tipoComidaNombre?: string;
    fecha: string;
    hora?: string;
    porciones?: number;
    calorias?: number;
    proteinas?: number;
    carbohidratos?: number;
    grasas?: number;
    notas?: string;
  }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.usuarioUrl}/registros/comidas/extra`,
      data
    );
  }

  // ============================================================
  // HISTORIAL
  // ============================================================

  /**
   * Obtener historial de comidas registradas
   * Endpoint: GET /api/v1/usuario/registros/comidas/historial?fechaInicio=&fechaFin=
   */
  obtenerHistorialComidas(fechaInicio: string, fechaFin: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.usuarioUrl}/registros/comidas/historial`,
      { params: { fechaInicio, fechaFin } }
    );
  }

  /**
   * Obtener comidas de un día específico del plan
   * Endpoint: GET /api/v1/planes/{planId}/dias/{numeroDia}
   * @param planId - ID del plan
   * @param numeroDia - Número del día del plan (1-based)
   */
  obtenerComidasPorDia(planId: number, numeroDia: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${environment.apiUrl}/planes/${planId}/dias/${numeroDia}`
    );
  }

  /**
   * Obtener todas las comidas del plan activo (todos los días)
   * Útil para el calendario de comidas
   * Endpoint: GET /api/v1/planes/{id}/dias
   * @returns Observable con array de comidas agrupadas por día
   */
  obtenerTodasLasComidasDelPlan(): Observable<ApiResponse<any>> {
    return this.obtenerPlanesActivos().pipe(
      switchMap(response => {
        if (!response.success || !response.data || response.data.length === 0) {
          return new Observable<ApiResponse<any>>(observer => {
            observer.next({ success: true, data: { comidas: [], planInfo: null }, message: 'No hay planes activos' });
            observer.complete();
          });
        }

        const planActivo = response.data[0];
        const planId = planActivo.plan?.id || planActivo.planId;
        const diasTotales = planActivo.plan?.duracionDias || planActivo.planDuracionDias || 7;
        const fechaInicio = planActivo.fechaInicio;

        // Endpoint correcto: GET /api/v1/planes/{id}/dias - retorna todas las comidas del plan
        return this.http.get<ApiResponse<any[]>>(
          `${environment.apiUrl}/planes/${planId}/dias`
        ).pipe(
          map(comidasResponse => {
            // Mapear las comidas para extraer los datos nutricionales
            const comidas = (comidasResponse.data || []).map((planDia: any) => ({
              id: planDia.id,
              numeroDia: planDia.numeroDia,
              tipoComida: planDia.tipoComida,
              comidaId: planDia.comida?.id,
              comidaNombre: planDia.comida?.nombre,
              notas: planDia.notas,
              // Datos nutricionales de la comida
              calorias: planDia.comida?.nutricionTotal?.energiaTotal || planDia.comida?.calorias || 0,
              proteinas: planDia.comida?.nutricionTotal?.proteinasTotales || planDia.comida?.proteinas || 0,
              carbohidratos: planDia.comida?.nutricionTotal?.carbohidratosTotales || planDia.comida?.carbohidratos || 0,
              grasas: planDia.comida?.nutricionTotal?.grasasTotales || planDia.comida?.grasas || 0,
              // Datos adicionales de la comida
              comida: {
                id: planDia.comida?.id,
                nombre: planDia.comida?.nombre,
                tipoComida: planDia.comida?.tipoComida,
                descripcion: planDia.comida?.descripcion,
                instrucciones: planDia.comida?.instrucciones,
                ingredientes: planDia.comida?.ingredientes || [],
                calorias: planDia.comida?.nutricionTotal?.energiaTotal || 0,
                proteinas: planDia.comida?.nutricionTotal?.proteinasTotales || 0,
                carbohidratos: planDia.comida?.nutricionTotal?.carbohidratosTotales || 0,
                grasas: planDia.comida?.nutricionTotal?.grasasTotales || 0
              }
            }));
            
            return {
              success: true,
              message: 'Comidas del plan cargadas',
              data: {
                comidas,
                planInfo: {
                  planId,
                  fechaInicio,
                  diasTotales,
                  planNombre: planActivo.plan?.nombre || planActivo.planNombre
                }
              }
            };
          })
        );
      })
    );
  }
}