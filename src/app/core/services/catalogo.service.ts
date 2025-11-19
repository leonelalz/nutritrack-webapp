import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
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
   * US-XX: Ver catálogo de rutinas (Usuario)
   * Endpoint: GET /api/v1/rutinas/catalogo
   * Obtiene rutinas disponibles filtradas por perfil del usuario
   */
  verCatalogoRutinas(sugeridos: boolean = false, page: number = 0, size: number = 20): Observable<ApiResponse<any>> {
    let params = new HttpParams()
      .set('sugeridos', sugeridos.toString())
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<any>>(
      `${this.rutinasUrl}/catalogo`,
      { params }
    );
  }

  /**
   * US-XX: Ver detalle de una rutina del catálogo (Usuario)
   * Endpoint: GET /api/v1/rutinas/catalogo/{id}
   */
  verDetalleRutina(rutinaId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.rutinasUrl}/catalogo/${rutinaId}`
    );
  }
}