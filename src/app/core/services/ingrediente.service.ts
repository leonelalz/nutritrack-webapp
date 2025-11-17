// src/app/core/services/ingrediente.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { Ingrediente, IngredienteRequest, CategoriaAlimento } from '../models/ingrediente.model';
import { ApiResponse, PageResponse } from '../models/etiqueta.model';

@Injectable({
  providedIn: 'root'
})
export class IngredienteService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/ingredientes`;

  listar(page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Ingrediente>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResponse<Ingrediente>>>(this.API_URL, { params });
  }

  buscarPorNombre(nombre: string, page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Ingrediente>>> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResponse<Ingrediente>>>(`${this.API_URL}/buscar`, { params });
  }

  filtrarPorCategoria(categoria: CategoriaAlimento, page: number = 0, size: number = 20): Observable<ApiResponse<PageResponse<Ingrediente>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResponse<Ingrediente>>>(`${this.API_URL}/categoria/${categoria}`, { params });
  }

  obtenerPorId(id: number): Observable<ApiResponse<Ingrediente>> {
    return this.http.get<ApiResponse<Ingrediente>>(`${this.API_URL}/${id}`);
  }

  crear(request: IngredienteRequest): Observable<ApiResponse<Ingrediente>> {
    return this.http.post<ApiResponse<Ingrediente>>(this.API_URL, request);
  }

  actualizar(id: number, request: IngredienteRequest): Observable<ApiResponse<Ingrediente>> {
    return this.http.put<ApiResponse<Ingrediente>>(`${this.API_URL}/${id}`, request);
  }

  eliminar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }
}