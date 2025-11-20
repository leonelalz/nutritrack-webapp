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
   * US-20: Obtener planes activos del usuario
   * Endpoint: GET /api/v1/usuario/planes/activos
   */
  obtenerPlanesActivos(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.usuarioUrl}/planes/activos`
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
   * US-20: Obtener rutinas activas del usuario
   * Endpoint: GET /api/v1/usuario/rutinas/activas
   */
  obtenerRutinasActivas(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.usuarioUrl}/rutinas/activas`
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
        const fechaInicio = new Date(rutinaActiva.fechaInicio);
        const hoy = new Date();
        
        // Calcular semana y día actuales
        const diffTime = hoy.getTime() - fechaInicio.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          return new Observable<ApiResponse<any[]>>(observer => {
            observer.next({ success: true, data: [], message: 'La rutina aún no ha comenzado' });
            observer.complete();
          });
        }

        // Calcular semana (1-based) y día de la semana (1-7, donde 1=Lunes)
        const semanaActual = Math.floor(diffDays / 7) + 1;
        const diaActual = (diffDays % 7) + 1; // 1=primer día, 2=segundo, etc.

        // Obtener todos los ejercicios de la rutina
        return this.http.get<ApiResponse<any[]>>(
          `${environment.apiUrl}/rutinas/${rutinaId}/ejercicios`
        ).pipe(
          map(ejerciciosResponse => {
            if (!ejerciciosResponse.success || !ejerciciosResponse.data) {
              return { success: true, data: [], message: 'No hay ejercicios' };
            }

            // Filtrar ejercicios para el día actual
            // Campos del backend: semanaBase, diaSemana, orden
            const ejerciciosHoy = ejerciciosResponse.data
              .filter(ej => 
                ej.semanaBase === semanaActual && ej.diaSemana === diaActual
              )
              .sort((a, b) => a.orden - b.orden); // Ordenar por campo 'orden'

            return {
              success: true,
              data: ejerciciosHoy,
              message: `${ejerciciosHoy.length} ejercicios para hoy`
            };
          })
        );
      })
    );
  }

  /**
   * Marcar comida como consumida
   * Endpoint: POST /api/v1/usuario/registros/comida
   */
  registrarComidaConsumida(data: {
    planComidaId: number;
    fecha: string;
    hora?: string;
    notas?: string;
  }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.usuarioUrl}/registros/comida`,
      data
    );
  }

  /**
   * Marcar ejercicio como completado
   * Endpoint: POST /api/v1/usuario/registros/ejercicio
   */
  registrarEjercicioCompletado(data: {
    rutinaEjercicioId: number;
    fecha: string;
    seriesRealizadas?: number;
    repeticionesRealizadas?: number;
    pesoUtilizado?: number;
    duracionMinutos?: number;
    notas?: string;
  }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.usuarioUrl}/registros/ejercicio`,
      data
    );
  }
}