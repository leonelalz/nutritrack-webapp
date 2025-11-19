import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../models";
import { environment } from "../../../enviroments/enviroment";

@Injectable({
    providedIn : 'root'
})
export class MetasService {
  private readonly usuarioUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

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
      `planes/catalogo`
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
      `rutinas/catalogo`
    );
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
}