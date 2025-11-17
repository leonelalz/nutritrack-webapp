import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PlanResponse, RutinaResponse } from '../../../shared/models';
import { environment } from '../../../../enviroments/enviroment';

/**
 * Servicio para el Catálogo de Planes y Rutinas
 * Módulo 4: CATÁLOGO Y EXPLORACIÓN
 * US-16 a US-20
 * 
 * BASE URLS:
 * - Admin (lectura): /api/v1/admin/planes, /api/v1/admin/rutinas
 * - Usuario: /api/v1/usuario/planes, /api/v1/usuario/rutinas
 */
@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private readonly adminUrl = `${environment.apiUrl}/admin`;
  private readonly usuarioUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  // ============================================================================
  // PLANES DISPONIBLES (LECTURA)
  // ============================================================================

  /**
   * US-16: Obtener todos los planes disponibles (activos)
   * Endpoint: GET /api/v1/admin/planes
   */
  obtenerPlanesDisponibles(): Observable<ApiResponse<PlanResponse[]>> {
    return this.http.get<ApiResponse<PlanResponse[]>>(
      `${this.adminUrl}/planes`
    );
  }

  /**
   * Obtener detalles de un plan específico
   * Endpoint: GET /api/v1/admin/planes/{id}
   */
  obtenerDetallePlan(id: number): Observable<ApiResponse<PlanResponse>> {
    return this.http.get<ApiResponse<PlanResponse>>(
      `${this.adminUrl}/planes/${id}`
    );
  }

  // ============================================================================
  // RUTINAS DISPONIBLES (LECTURA)
  // ============================================================================

  /**
   * US-18: Obtener todas las rutinas disponibles (activas)
   * Endpoint: GET /api/v1/admin/rutinas
   */
  obtenerRutinasDisponibles(): Observable<ApiResponse<RutinaResponse[]>> {
    return this.http.get<ApiResponse<RutinaResponse[]>>(
      `${this.adminUrl}/rutinas`
    );
  }

  /**
   * Obtener detalles de una rutina específica
   * Endpoint: GET /api/v1/admin/rutinas/{id}
   */
  obtenerDetalleRutina(id: number): Observable<ApiResponse<RutinaResponse>> {
    return this.http.get<ApiResponse<RutinaResponse>>(
      `${this.adminUrl}/rutinas/${id}`
    );
  }

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
   * Obtener historial completo de planes del usuario
   * Endpoint: GET /api/v1/usuario/planes
   */
  obtenerTodosLosPlanesDeUsuario(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.usuarioUrl}/planes`
    );
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
   * Obtener historial completo de rutinas del usuario
   * Endpoint: GET /api/v1/usuario/rutinas
   */
  obtenerTodasLasRutinasDeUsuario(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.usuarioUrl}/rutinas`
    );
  }

  // ============================================================================
  // ACTIVACIÓN DE PLANES (ASIGNACIÓN)
  // ============================================================================

  /**
   * US-16/US-17: Activar un plan para el usuario
   * Endpoint: POST /api/v1/usuario/planes/activar
   * 
   * REGLAS DE NEGOCIO:
   * - RN17: No permite duplicar el mismo plan si ya está activo
   * - RN32: Validación cruzada de alérgenos
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
   * RN19, RN26
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
   * RN19, RN26
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
   * RN26
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
   * RN26
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
   * 
   * REGLAS DE NEGOCIO:
   * - RN17: No permite duplicar la misma rutina si ya está activa
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
   * RN19, RN26
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
   * RN19, RN26
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
   * RN26
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
   * RN26
   */
  cancelarRutina(usuarioRutinaId: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
      `${this.usuarioUrl}/rutinas/${usuarioRutinaId}/cancelar`,
      {}
    );
  }
}
