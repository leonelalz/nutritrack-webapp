// src/app/core/services/etiqueta.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import {
  Etiqueta,
  EtiquetaRequest,
  PageResponse
} from '../models/etiqueta.model';
import { ApiResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/etiquetas`;
  /**
   * Listar todas las etiquetas (paginado)
   */
  listar(page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Etiqueta>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResponse<Etiqueta>>>(this.API_URL, { params });
  }

  /**
   * Buscar etiquetas por nombre
   */
  buscarPorNombre(nombre: string, page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Etiqueta>>> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResponse<Etiqueta>>>(`${this.API_URL}/buscar`, { params });
  }
  /**
   * Obtener todas las etiquetas sin paginación
   * Usa el endpoint paginado con un tamaño grande para obtener todas las etiquetas
   */
  obtenerTodas(): Observable<ApiResponse<Etiqueta[]>> {
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '1000'); // Tamaño grande para obtener todas
    
    return new Observable(observer => {
      this.http.get<ApiResponse<PageResponse<Etiqueta>>>(this.API_URL, { params }).subscribe({
        next: (response) => {
          // Transformar la respuesta paginada a un array simple
          const transformedResponse: ApiResponse<Etiqueta[]> = {
            success: response.success,
            message: response.message,
            data: response.data.content, // Extraer solo el contenido
            timestamp: response.timestamp
          };
          observer.next(transformedResponse);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Obtener una etiqueta por ID
   */
  obtenerPorId(id: number): Observable<ApiResponse<Etiqueta>> {
    return this.http.get<ApiResponse<Etiqueta>>(`${this.API_URL}/${id}`);
  }

  /**
   * Crear una nueva etiqueta
   */
  crear(request: EtiquetaRequest): Observable<ApiResponse<Etiqueta>> {
    return this.http.post<ApiResponse<Etiqueta>>(this.API_URL, request);
  }

  /**
   * Actualizar una etiqueta existente
   */
  actualizar(id: number, request: EtiquetaRequest): Observable<ApiResponse<Etiqueta>> {
    return this.http.put<ApiResponse<Etiqueta>>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Eliminar una etiqueta
   */
  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }
}