import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';
import {
  PerfilSaludResponse,
  PerfilSaludRequest,
  UpdateUnidadesMedidaRequest,
  EtiquetaResponse,
  TipoEtiqueta,
  UnidadesMedida
} from '../../../shared/models/perfil.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/perfil`;

  // Signals para ESTADO COMPARTIDO
  private _perfilActual = signal<PerfilSaludResponse | null>(null);
  private _unidadActual = signal<UnidadesMedida>(UnidadesMedida.KG);
  
  perfilActual = this._perfilActual.asReadonly();
  unidadActual = this._unidadActual.asReadonly();

  // GET - Obtener perfil completo
  obtenerPerfil(): Observable<PerfilSaludResponse> {
    return this.http.get<PerfilSaludResponse>(`${this.apiUrl}`).pipe(
      tap(perfil => {
        this._perfilActual.set(perfil);
        this._unidadActual.set(perfil.unidadesMedida);
      })
    );
  }

  // PATCH - Actualizar unidades (US-03)
  actualizarUnidades(data: UpdateUnidadesMedidaRequest): Observable<PerfilSaludResponse> {
    return this.http.patch<PerfilSaludResponse>(`${this.apiUrl}/unidades`, data).pipe(
      tap(perfil => {
        this._perfilActual.set(perfil);
        this._unidadActual.set(perfil.unidadesMedida);
      })
    );
  }

  // PUT - Actualizar perfil de salud (US-04)
  actualizarPerfilSalud(data: PerfilSaludRequest): Observable<PerfilSaludResponse> {
    return this.http.put<PerfilSaludResponse>(`${this.apiUrl}/salud`, data).pipe(
      tap(perfil => {
        this._perfilActual.set(perfil);
      })
    );
  }

  // Convertir peso según unidad
  convertirPeso(pesoKg: number, aUnidad: UnidadesMedida): number {
    if (aUnidad === UnidadesMedida.LBS) {
      return pesoKg * 2.20462;
    }
    return pesoKg;
  }

  // Convertir peso de usuario a KG (para enviar al backend)
  convertirPesoAKg(peso: number, desdeUnidad: UnidadesMedida): number {
    if (desdeUnidad === UnidadesMedida.LBS) {
      return peso / 2.20462;
    }
    return peso;
  }
}
