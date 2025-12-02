import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, forkJoin, map, switchMap } from "rxjs";
import { ApiResponse } from "../models";
import { environment } from "../../../enviroments/enviroment";

@Injectable({
    providedIn: 'root'
})
export class CatalogoService {
  private readonly planesUrl = `${environment.apiUrl}/planes`;
  private readonly rutinasUrl = `${environment.apiUrl}/rutinas`;

  constructor(private http: HttpClient) {}

  /**
   * US-16: Ver catálogo de planes (Usuario)
   * Endpoint: GET /api/v1/planes/catalogo
   * Obtiene planes disponibles filtrados por perfil del usuario
   * - RN15: Sugiere según objetivo
   * - RN16: Filtra alérgenos automáticamente
   */
  verCatalogo(sugeridos: boolean = false, page: number = 0, size: number = 20): Observable<ApiResponse<any>> {
    let params = new HttpParams()
      .set('sugeridos', sugeridos.toString())
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<any>>(
      `${this.planesUrl}/catalogo`,
      { params }
    );
  }

  /**
   * US-17: Ver detalle de un plan del catálogo (Usuario)
   * Endpoint: GET /api/v1/planes/catalogo/{id}
   * Valida automáticamente alérgenos del usuario (RN16)
   */
  verDetallePlan(planId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.planesUrl}/catalogo/${planId}`
    );
  }

  /**
   * Obtener días/comidas de un plan (Usuario)
   * Endpoint: GET /api/v1/planes/{id}/dias
   * Lista todas las comidas programadas ordenadas por día y tipo
   */
  obtenerDiasPlan(planId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.planesUrl}/${planId}/dias`
    );
  }

  /**
   * Obtener comidas de un día específico del plan (Usuario)
   * Endpoint: GET /api/v1/planes/{id}/dias/{numeroDia}
   */
  obtenerComidasDia(planId: number, numeroDia: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.planesUrl}/${planId}/dias/${numeroDia}`
    );
  }

  /**
   * Ver detalle completo del plan con días/comidas
   * Combina el detalle del plan con sus días programados
   */
  verDetallePlanCompleto(planId: number): Observable<ApiResponse<any>> {
    return forkJoin({
      plan: this.verDetallePlan(planId),
      dias: this.obtenerDiasPlan(planId)
    }).pipe(
      map(({ plan, dias }) => {
        if (plan.success && plan.data) {
          // Agregar los días al objeto del plan
          plan.data.dias = dias.success ? dias.data : [];
        }
        return plan;
      })
    );
  }

  /**
   * US-XX: Ver catálogo de rutinas (Usuario)
   * Endpoint: GET /api/v1/rutinas/catalogo
   * Si no existe, usa GET /api/v1/rutinas/activas como fallback
   * Obtiene rutinas disponibles filtradas por perfil del usuario
   */
  verCatalogoRutinas(sugeridos: boolean = false, page: number = 0, size: number = 20): Observable<ApiResponse<any>> {
    let params = new HttpParams()
      .set('sugeridos', sugeridos.toString())
      .set('page', page.toString())
      .set('size', size.toString());

    // Intentar endpoint de catálogo primero
    return this.http.get<ApiResponse<any>>(
      `${this.rutinasUrl}/catalogo`,
      { params }
    );
  }

  /**
   * US-XX: Ver detalle de una rutina del catálogo (Usuario)
   * Endpoint: GET /api/v1/rutinas/catalogo/{id}
   * Fallback: GET /api/v1/rutinas/{id}
   */
  verDetalleRutina(rutinaId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.rutinasUrl}/catalogo/${rutinaId}`
    );
  }

  /**
   * Obtener ejercicios de una rutina (Usuario)
   * Endpoint: GET /api/v1/rutinas/{id}/ejercicios
   */
  obtenerEjerciciosRutina(rutinaId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.rutinasUrl}/${rutinaId}/ejercicios`
    );
  }

  /**
   * Ver detalle completo de rutina con ejercicios
   * Combina el detalle de la rutina con sus ejercicios
   */
  verDetalleRutinaCompleto(rutinaId: number): Observable<ApiResponse<any>> {
    return forkJoin({
      rutina: this.verDetalleRutina(rutinaId),
      ejercicios: this.obtenerEjerciciosRutina(rutinaId)
    }).pipe(
      map(({ rutina, ejercicios }) => {
        if (rutina.success && rutina.data) {
          // Agregar los ejercicios al objeto de la rutina
          rutina.data.ejercicios = ejercicios.success ? ejercicios.data : [];
        }
        return rutina;
      })
    );
  }

  /**
   * Buscar planes por nombre (Usuario)
   * Endpoint: GET /api/v1/planes/buscar
   */
  buscarPlanes(nombre: string, page: number = 0, size: number = 20): Observable<ApiResponse<any>> {
    let params = new HttpParams()
      .set('nombre', nombre)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<any>>(
      `${this.planesUrl}/buscar`,
      { params }
    );
  }
}