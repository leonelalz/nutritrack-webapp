import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { ApiResponse } from '../models';

/**
 * Modelo para Tipo de Comida (desde el backend)
 */
export interface TipoComidaResponse {
  id: number;
  nombre: string;
  descripcion: string;
  ordenVisualizacion: number;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearTipoComidaRequest {
  nombre: string;
  descripcion?: string;
  ordenVisualizacion?: number;
}

export interface ActualizarTipoComidaRequest {
  nombre?: string;
  descripcion?: string;
  ordenVisualizacion?: number;
}

/**
 * Servicio para gestión de Tipos de Comida
 * Endpoints: /api/v1/tipos-comida
 */
@Injectable({
  providedIn: 'root'
})
export class TipoComidaService {
  private readonly baseUrl = `${environment.apiUrl}/tipos-comida`;

  // Signal para cache de tipos de comida
  private readonly _tiposComida = signal<TipoComidaResponse[]>([]);
  readonly tiposComida = this._tiposComida.asReadonly();

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los tipos de comida activos
   */
  obtenerTiposComida(): Observable<ApiResponse<TipoComidaResponse[]>> {
    return this.http.get<ApiResponse<TipoComidaResponse[]>>(this.baseUrl).pipe(
      tap(response => {
        if (response.success && response.data) {
          this._tiposComida.set(response.data);
        }
      })
    );
  }

  /**
   * Obtener un tipo de comida por ID
   */
  obtenerPorId(id: number): Observable<ApiResponse<TipoComidaResponse>> {
    return this.http.get<ApiResponse<TipoComidaResponse>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtener un tipo de comida por nombre
   */
  obtenerPorNombre(nombre: string): TipoComidaResponse | undefined {
    return this._tiposComida().find(t => t.nombre === nombre);
  }

  /**
   * Crear un nuevo tipo de comida (Solo Admin)
   */
  crear(request: CrearTipoComidaRequest): Observable<ApiResponse<TipoComidaResponse>> {
    return this.http.post<ApiResponse<TipoComidaResponse>>(this.baseUrl, request);
  }

  /**
   * Actualizar tipo de comida (Solo Admin)
   */
  actualizar(id: number, request: ActualizarTipoComidaRequest): Observable<ApiResponse<TipoComidaResponse>> {
    return this.http.put<ApiResponse<TipoComidaResponse>>(`${this.baseUrl}/${id}`, request);
  }

  /**
   * Desactivar tipo de comida (Solo Admin)
   */
  desactivar(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}/desactivar`, {});
  }

  /**
   * Activar tipo de comida (Solo Admin)
   */
  activar(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/${id}/activar`, {});
  }

  /**
   * Formatear nombre de tipo de comida para mostrar
   */
  formatearNombre(nombre: string): string {
    const formatos: Record<string, string> = {
      'DESAYUNO': 'Desayuno',
      'ALMUERZO': 'Almuerzo',
      'CENA': 'Cena',
      'SNACK': 'Snack',
      'MERIENDA': 'Merienda',
      'COLACION': 'Colación',
      'PRE_ENTRENAMIENTO': 'Pre-Entrenamiento',
      'POST_ENTRENAMIENTO': 'Post-Entrenamiento',
      'BRUNCH': 'Brunch'
    };
    return formatos[nombre] || nombre.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  /**
   * Limpiar cache
   */
  limpiarCache(): void {
    this._tiposComida.set([]);
  }
}
