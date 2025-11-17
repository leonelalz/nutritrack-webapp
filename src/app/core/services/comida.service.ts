// src/app/core/services/comida.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { Comida, ComidaRequest, TipoComida, AgregarIngredienteRequest } from '../models/comida.model';
import { ApiResponse, PageResponse } from '../models/etiqueta.model';

@Injectable({
  providedIn: 'root'
})
export class ComidaService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/comidas`;

  /**
   * Listar todas las comidas (paginado)
   */
  listar(page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Comida>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResponse<Comida>>>(this.API_URL, { params });
  }

  /**
   * Buscar comidas por nombre
   */
  buscarPorNombre(nombre: string, page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Comida>>> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResponse<Comida>>>(`${this.API_URL}/buscar`, { params });
  }

  /**
   * Filtrar por tipo de comida
   */
  filtrarPorTipo(tipo: TipoComida, page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Comida>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResponse<Comida>>>(`${this.API_URL}/tipo/${tipo}`, { params });
  }

  /**
   * Obtener una comida por ID
   */
  obtenerPorId(id: number): Observable<ApiResponse<Comida>> {
    return this.http.get<ApiResponse<Comida>>(`${this.API_URL}/${id}`);
  }

  /**
   * Crear una nueva comida
   */
  crear(request: ComidaRequest): Observable<ApiResponse<Comida>> {
    return this.http.post<ApiResponse<Comida>>(this.API_URL, request);
  }

  /**
   * Actualizar una comida existente
   */
  actualizar(id: number, request: ComidaRequest): Observable<ApiResponse<Comida>> {
    return this.http.put<ApiResponse<Comida>>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Eliminar una comida
   */
  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }

  // ========== US-10: Gestión de Recetas (Ingredientes) ==========

  /**
   * Agregar ingrediente a una comida
   */
  agregarIngrediente(comidaId: number, request: AgregarIngredienteRequest): Observable<ApiResponse<Comida>> {
    return this.http.post<ApiResponse<Comida>>(`${this.API_URL}/${comidaId}/ingredientes`, request);
  }

  /**
   * Actualizar cantidad de ingrediente en una comida
   */
  actualizarIngrediente(comidaId: number, ingredienteId: number, request: AgregarIngredienteRequest): Observable<ApiResponse<Comida>> {
    return this.http.put<ApiResponse<Comida>>(`${this.API_URL}/${comidaId}/ingredientes/${ingredienteId}`, request);
  }

  /**
   * Eliminar ingrediente de una comida
   */
  eliminarIngrediente(comidaId: number, ingredienteId: number): Observable<ApiResponse<Comida>> {
    return this.http.delete<ApiResponse<Comida>>(`${this.API_URL}/${comidaId}/ingredientes/${ingredienteId}`);
  }
}