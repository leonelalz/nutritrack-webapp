import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';
import { EtiquetaResponse, TipoEtiqueta } from '../../../shared/models/perfil.model';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/etiquetas`;

  // Signals para cache de etiquetas
  private _etiquetas = signal<EtiquetaResponse[]>([]);
  etiquetas = this._etiquetas.asReadonly();

  // GET - Obtener todas las etiquetas
  obtenerTodas(): Observable<EtiquetaResponse[]> {
    return this.http.get<EtiquetaResponse[]>(`${this.apiUrl}`).pipe(
      tap(data => this._etiquetas.set(data))
    );
  }

  // GET - Obtener etiquetas por tipo (alergia, condicion, objetivo)
  obtenerPorTipo(tipo: TipoEtiqueta | string): Observable<EtiquetaResponse[]> {
    return this.http.get<EtiquetaResponse[]>(`${this.apiUrl}/tipo/${tipo}`);
  }

  // GET - Obtener etiqueta por ID
  obtenerPorId(id: number): Observable<EtiquetaResponse> {
    return this.http.get<EtiquetaResponse>(`${this.apiUrl}/${id}`);
  }
}
