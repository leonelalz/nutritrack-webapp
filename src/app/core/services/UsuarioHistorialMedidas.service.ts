import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';
import {
  HistorialMedidasRequest,
  HistorialMedidasResponse
} from '../models/UsuarioHistorialMedidas.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UsuarioHistorialMedidasService {

  private url = `${base_url}/perfil/mediciones`;

  constructor(private http: HttpClient) {}

  // POST - registrar
  registrarMedicion(request: HistorialMedidasRequest): Observable<HistorialMedidasResponse> {
    return this.http.post<HistorialMedidasResponse>(this.url, request);
  }

  // GET - listar historial
  obtenerHistorial(): Observable<HistorialMedidasResponse[]> {
    return this.http.get<HistorialMedidasResponse[]>(this.url);
  }

  // PUT - actualizar medición
  actualizarMedicion(id: number, request: HistorialMedidasRequest): Observable<HistorialMedidasResponse> {
    return this.http.put<HistorialMedidasResponse>(`${this.url}/${id}`, request);
  }

  // DELETE - eliminar medición
  eliminarMedicion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
