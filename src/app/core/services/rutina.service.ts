import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import {
  ApiResponse,
  RutinaResponse,
  RutinaDetalleResponse,
  CrearRutinaRequest,
  ActualizarRutinaRequest,
  EjercicioRutinaRequest,
  EjercicioRutinaResponse,
  ActualizarEjercicioRutinaRequest,
  PagedResponse
} from '../../core/models';

/**
 * Servicio para gestión de Rutinas de Ejercicio (Admin)
 * Endpoints: /api/v1/rutinas
 * Módulo 3 - US-11 a US-15
 */
@Injectable({
  providedIn: 'root'
})
export class RutinaService {
  private readonly baseUrl = `${environment.apiUrl}/rutinas`;

  // Signals para estado reactivo
  private readonly _rutinas = signal<RutinaResponse[]>([]);
  private readonly _rutinaActual = signal<RutinaDetalleResponse | null>(null);
  private readonly _totalElements = signal<number>(0);

  // Getters públicos de signals
  readonly rutinas = this._rutinas.asReadonly();
  readonly rutinaActual = this._rutinaActual.asReadonly();
  readonly totalElements = this._totalElements.asReadonly();

  constructor(private http: HttpClient) {}

  /**
   * Listar todas las rutinas con paginación (US-13)
   * @param page - Número de página (default: 0)
   * @param size - Elementos por página (default: 20)
   */
  obtenerRutinas(page: number = 0, size: number = 20): Observable<ApiResponse<PagedResponse<RutinaResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<PagedResponse<RutinaResponse>>>(this.baseUrl, { params })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this._rutinas.set(response.data.content || []);
            this._totalElements.set(response.data.totalElements || 0);
          }
        })
      );
  }

  /**
   * Listar rutinas activas con paginación
   */
  obtenerRutinasActivas(page: number = 0, size: number = 20): Observable<ApiResponse<PagedResponse<RutinaResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<PagedResponse<RutinaResponse>>>(`${this.baseUrl}/activas`, { params })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this._rutinas.set(response.data.content || []);
            this._totalElements.set(response.data.totalElements || 0);
          }
        })
      );
  }

  /**
   * Buscar rutinas por nombre
   */
  buscarRutinas(nombre: string, page: number = 0, size: number = 20): Observable<ApiResponse<PagedResponse<RutinaResponse>>> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<PagedResponse<RutinaResponse>>>(`${this.baseUrl}/buscar`, { params })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this._rutinas.set(response.data.content || []);
            this._totalElements.set(response.data.totalElements || 0);
          }
        })
      );
  }

  /**
   * Obtener detalle de rutina por ID
   */
  obtenerRutinaPorId(id: number): Observable<ApiResponse<RutinaResponse>> {
    return this.http
      .get<ApiResponse<RutinaResponse>>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this._rutinaActual.set(response.data as any);
          }
        })
      );
  }

  /**
   * Crear rutina (US-11)
   * RN11: Nombre único
   */
  crearRutina(rutina: CrearRutinaRequest): Observable<ApiResponse<RutinaResponse>> {
    return this.http.post<ApiResponse<RutinaResponse>>(this.baseUrl, rutina);
  }

  /**
   * Actualizar rutina (US-12)
   */
  actualizarRutina(id: number, rutina: ActualizarRutinaRequest): Observable<ApiResponse<RutinaResponse>> {
    return this.http.put<ApiResponse<RutinaResponse>>(`${this.baseUrl}/${id}`, rutina);
  }

  /**
   * Desactivar rutina (Soft delete)
   * RN14: No eliminar si usuarios activos
   * RN28: Soft delete
   */
  desactivarRutina(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Activar rutina (Reactivar)
   */
  activarRutina(id: number): Observable<ApiResponse<RutinaResponse>> {
    return this.http.patch<ApiResponse<RutinaResponse>>(`${this.baseUrl}/${id}/reactivar`, {});
  }

  /**
   * Agregar ejercicio a rutina (US-12, US-15)
   * RN13: Series y repeticiones >= 1
   */
  agregarEjercicio(rutinaId: number, ejercicio: EjercicioRutinaRequest): Observable<ApiResponse<EjercicioRutinaResponse>> {
    return this.http.post<ApiResponse<EjercicioRutinaResponse>>(
      `${this.baseUrl}/${rutinaId}/ejercicios`,
      ejercicio
    );
  }

  /**
   * Obtener ejercicios de rutina
   */
  obtenerEjerciciosRutina(rutinaId: number): Observable<ApiResponse<EjercicioRutinaResponse[]>> {
    return this.http.get<ApiResponse<EjercicioRutinaResponse[]>>(
      `${this.baseUrl}/${rutinaId}/ejercicios`
    );
  }

  /**
   * Actualizar ejercicio de rutina (US-15)
   */
  actualizarEjercicio(
    rutinaId: number,
    ejercicioId: number,
    ejercicio: ActualizarEjercicioRutinaRequest
  ): Observable<ApiResponse<EjercicioRutinaResponse>> {
    return this.http.put<ApiResponse<EjercicioRutinaResponse>>(
      `${this.baseUrl}/${rutinaId}/ejercicios/${ejercicioId}`,
      ejercicio
    );
  }

  /**
   * Eliminar ejercicio de rutina
   */
  eliminarEjercicio(rutinaId: number, ejercicioId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/${rutinaId}/ejercicios/${ejercicioId}`
    );
  }

  /**
   * Limpiar estado
   */
  limpiarEstado(): void {
    this._rutinas.set([]);
    this._rutinaActual.set(null);
    this._totalElements.set(0);
  }
}
