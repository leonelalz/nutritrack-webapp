// src/app/core/services/usuario.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment.config';
import { Usuario, ApiResponse, PageResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/perfil`;

  /**
   * Listado paginado
   */
  listar(page: number = 0, size: number = 20):
    Observable<ApiResponse<PageResponse<Usuario>>> {
    return this.http.get<ApiResponse<PageResponse<Usuario>>>(
      `${this.apiUrl}?page=${page}&size=${size}`
    );
  }

  /**
   * Buscar por nombre o email (depende de tu backend)
   */
  buscar(term: string, page: number = 0, size: number = 20):
    Observable<ApiResponse<PageResponse<Usuario>>> {
    return this.http.get<ApiResponse<PageResponse<Usuario>>>(
      `${this.apiUrl}/search?term=${term}&page=${page}&size=${size}`
    );
  }

  /**
   * Crear nuevo usuario
   */
  crear(data: Partial<Usuario>):
    Observable<ApiResponse<Usuario>> {
    return this.http.post<ApiResponse<Usuario>>(this.apiUrl, data);
  }

  /**
   * Actualizar usuario
   */
  actualizar(id: number, data: Partial<Usuario>):
    Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  /**
   * Eliminar usuario
   */
  eliminar(id: number):
    Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/${id}`
    );
  }

  /**
   * Obtener por ID (opcional)
   */
  obtenerPorId(id: number):
    Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(
      `${this.apiUrl}/${id}`
    );
  }
}
