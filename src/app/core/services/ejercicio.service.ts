// src/app/core/services/ejercicio.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { Ejercicio, EjercicioRequest, TipoEjercicio, GrupoMuscular, NivelDificultad } from '../models/ejercicio.model';
import { PageResponse } from '../models/etiqueta.model';
import { ApiResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class EjercicioService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/ejercicios`;

  /**
   * Listar todos los ejercicios (paginado)
   */
  listar(page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Ejercicio>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResponse<Ejercicio>>>(this.API_URL, { params });
  }

  /**
   * Buscar ejercicios por nombre
   */
  buscarPorNombre(nombre: string, page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Ejercicio>>> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResponse<Ejercicio>>>(`${this.API_URL}/buscar`, { params });
  }

  /**
   * Filtrar ejercicios por múltiples criterios
   */
  filtrarEjercicios(
    tipo?: TipoEjercicio,
    grupo?: GrupoMuscular,
    nivel?: NivelDificultad,
    page: number = 0,
    size: number = 20
  ): Observable<ApiResponse<PageResponse<Ejercicio>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (tipo) params = params.set('tipo', tipo);
    if (grupo) params = params.set('grupo', grupo);
    if (nivel) params = params.set('nivel', nivel);
    
    return this.http.get<ApiResponse<PageResponse<Ejercicio>>>(`${this.API_URL}/filtrar`, { params });
  }

  /**
   * Obtener un ejercicio por ID
   */
  obtenerPorId(id: number): Observable<ApiResponse<Ejercicio>> {
    return this.http.get<ApiResponse<Ejercicio>>(`${this.API_URL}/${id}`);
  }

  /**
   * Crear un nuevo ejercicio
   */
  crear(request: EjercicioRequest): Observable<ApiResponse<Ejercicio>> {
    return this.http.post<ApiResponse<Ejercicio>>(this.API_URL, request);
  }

  /**
   * Actualizar un ejercicio existente
   */
  actualizar(id: number, request: EjercicioRequest): Observable<ApiResponse<Ejercicio>> {
    return this.http.put<ApiResponse<Ejercicio>>(`${this.API_URL}/${id}`, request);
  }

  /**
   * Eliminar un ejercicio
   */
  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }
}