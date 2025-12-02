import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { ApiResponse } from '../models/common.model';
import { HistorialMedidasRequest, HistorialMedidasResponse, PerfilCompletoResponse, PerfilSaludRequest, PerfilSaludResponse} from '../models/perfil.model';

@Injectable({
    providedIn: 'root'
})
export class PerfilService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/perfil`;

    /**
     * Obtener perfil completo del usuario (recomendado)
     */
    obtenerPerfilCompleto(): Observable<ApiResponse<PerfilCompletoResponse>> {
        return this.http.get<ApiResponse<PerfilCompletoResponse>>(`${this.apiUrl}/completo`);
    }

    /**
     * Obtener solo perfil de salud  
     */
    obtenerPerfilSalud(): Observable<ApiResponse<PerfilSaludResponse>> {
        return this.http.get<ApiResponse<PerfilSaludResponse>>(`${this.apiUrl}/salud`);
    }

    /**
     * Actualizar perfil de salud
     */
    actualizarPerfilSalud(perfil: Partial<PerfilSaludRequest>): Observable<ApiResponse<PerfilSaludResponse>> {
        return this.http.put<ApiResponse<PerfilSaludResponse>>(`${this.apiUrl}/salud`, perfil);
    }

    /**
     * Registrar nueva medición corporal
     */
    registrarMedicion(medicion: HistorialMedidasRequest): Observable<ApiResponse<HistorialMedidasResponse>> {
        return this.http.post<ApiResponse<HistorialMedidasResponse>>(`${this.apiUrl}/mediciones`, medicion);
    }

    /**
     * Obtener todas las mediciones del usuario
     */
    obtenerMediciones(): Observable<ApiResponse<HistorialMedidasResponse[]>> {
        return this.http.get<ApiResponse<HistorialMedidasResponse[]>>(`${this.apiUrl}/mediciones`);
    }

    /**
     * Obtener medición específica por ID
     */
    obtenerMedicion(id: number): Observable<ApiResponse<HistorialMedidasResponse>> {
        return this.http.get<ApiResponse<HistorialMedidasResponse>>(`${this.apiUrl}/mediciones/${id}`);
    }

    /**
     * Actualizar medición existente
     */
    actualizarMedicion(id: number, medicion: HistorialMedidasRequest): Observable<ApiResponse<HistorialMedidasResponse>> {
        return this.http.put<ApiResponse<HistorialMedidasResponse>>(`${this.apiUrl}/mediciones/${id}`, medicion);
    }

    /**
     * Eliminar medición
     */
    eliminarMedicion(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/mediciones/${id}`);
    }
}