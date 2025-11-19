import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import {
  ApiResponse,
  PlanResponse,
  PlanDetalleResponse,
  CrearPlanRequest,
  ActualizarPlanRequest,
  DiaPlanRequest,
  DiaPlanResponse,
  PagedResponse
} from '../../core/models';

/**
 * Servicio para gestión de Planes Nutricionales (Admin)
 * Endpoints: /api/v1/planes
 * Módulo 3 - US-11 a US-15
 */
@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private readonly baseUrl = `${environment.apiUrl}/planes`;

  // Signals para estado reactivo
  private readonly _planes = signal<PlanResponse[]>([]);
  private readonly _planActual = signal<PlanDetalleResponse | null>(null);
  private readonly _totalElements = signal<number>(0);

  // Getters públicos de signals
  readonly planes = this._planes.asReadonly();
  readonly planActual = this._planActual.asReadonly();
  readonly totalElements = this._totalElements.asReadonly();

  constructor(private http: HttpClient) {}

  /**
   * Listar todos los planes con paginación (US-13)
   * @param page - Número de página (default: 0)
   * @param size - Elementos por página (default: 20)
   */
  obtenerPlanes(page: number = 0, size: number = 20): Observable<ApiResponse<PagedResponse<PlanResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<PagedResponse<PlanResponse>>>(this.baseUrl, { params })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this._planes.set(response.data.content || []);
            this._totalElements.set(response.data.totalElements || 0);
          }
        })
      );
  }

  /**
   * Listar planes activos con paginación
   */
  obtenerPlanesActivos(page: number = 0, size: number = 20): Observable<ApiResponse<PagedResponse<PlanResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<PagedResponse<PlanResponse>>>(`${this.baseUrl}/activos`, { params })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this._planes.set(response.data.content || []);
            this._totalElements.set(response.data.totalElements || 0);
          }
        })
      );
  }

  /**
   * Buscar planes por nombre
   */
  buscarPlanes(nombre: string, page: number = 0, size: number = 20): Observable<ApiResponse<PagedResponse<PlanResponse>>> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<PagedResponse<PlanResponse>>>(`${this.baseUrl}/buscar`, { params })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this._planes.set(response.data.content || []);
            this._totalElements.set(response.data.totalElements || 0);
          }
        })
      );
  }

  /**
   * Obtener detalle de un plan por ID
   */
  obtenerPlanPorId(id: number): Observable<ApiResponse<PlanResponse>> {
    return this.http
      .get<ApiResponse<PlanResponse>>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this._planActual.set(response.data as any);
          }
        })
      );
  }

  /**
   * Crear un nuevo plan (US-11)
   * RN11: Nombre único
   */
  crearPlan(plan: CrearPlanRequest): Observable<ApiResponse<PlanResponse>> {
    return this.http.post<ApiResponse<PlanResponse>>(this.baseUrl, plan);
  }

  /**
   * Actualizar plan existente (US-12)
   * RN11: Nombre único (si se cambia)
   */
  actualizarPlan(id: number, plan: ActualizarPlanRequest): Observable<ApiResponse<PlanResponse>> {
    return this.http.put<ApiResponse<PlanResponse>>(`${this.baseUrl}/${id}`, plan);
  }

  /**
   * Eliminar plan (US-14)
   * RN14: No se puede eliminar si tiene usuarios activos
   * RN28: Soft delete (marca como inactivo)
   */
  eliminarPlan(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Reactivar plan (reactivar un plan inactivo)
   * Solo funciona con planes inactivos (activo=false)
   * Si el plan ya está activo → error 400
   */
  activarPlan(id: number): Observable<ApiResponse<PlanResponse>> {
    return this.http.patch<ApiResponse<PlanResponse>>(`${this.baseUrl}/${id}/reactivar`, {});
  }

  /**
   * Desactivar plan (soft delete)
   * RN14: No se puede desactivar si tiene usuarios activos
   */
  desactivarPlan(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Agregar comida a un día del plan (US-12)
   */
  agregarDiaAlPlan(planId: number, dia: DiaPlanRequest): Observable<ApiResponse<DiaPlanResponse>> {
    return this.http.post<ApiResponse<DiaPlanResponse>>(
      `${this.baseUrl}/${planId}/dias`,
      dia
    );
  }

  /**
   * Obtener todos los días del plan
   */
  obtenerDiasPlan(planId: number): Observable<ApiResponse<DiaPlanResponse[]>> {
    return this.http.get<ApiResponse<DiaPlanResponse[]>>(`${this.baseUrl}/${planId}/dias`);
  }

  /**
   * Obtener actividades de un día específico
   */
  obtenerDiaEspecifico(planId: number, numeroDia: number): Observable<ApiResponse<DiaPlanResponse[]>> {
    return this.http.get<ApiResponse<DiaPlanResponse[]>>(`${this.baseUrl}/${planId}/dias/${numeroDia}`);
  }

  /**
   * Eliminar comida del plan
   */
  eliminarDiaDelPlan(planId: number, diaId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${planId}/dias/${diaId}`);
  }

  /**
   * Limpiar estado local
   */
  limpiarEstado(): void {
    this._planes.set([]);
    this._planActual.set(null);
    this._totalElements.set(0);
  }
}
