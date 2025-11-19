import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

export interface PerfilSalud {
    id: number;
    objetivoActual: string;
    nivelActividadActual: string;
    notas: string | null;
    etiquetas: Etiqueta[];
}

export interface Etiqueta {
    id: number;
    nombre: string;
    tipoEtiqueta: string;
    descripcion: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

export interface PerfilCompleto {
    id: number;
    email: string;
    rol: string;
    activo: boolean;
    fechaRegistro: string;
    nombre: string;
    apellido: string;
    nombreCompleto: string;
    unidadesMedida: string;
    fechaInicioApp: string;
    perfilSalud: PerfilSaludCompleto;
    ultimaMedicion: UltimaMedicion;
    totalMediciones: number;
}

export interface PerfilSaludCompleto {
    id: number;
    objetivoActual: string;
    nivelActividadActual: string;
    fechaActualizacion: string;
    etiquetas: Etiqueta[];
}

export interface UltimaMedicion {
    id: number;
    peso: number;
    altura: number;
    imc: number | null;
    fechaMedicion: string;
    unidadPeso: string;
    categoriaIMC: string;
}

@Injectable({
    providedIn: 'root'
})
export class PerfilService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/perfil`;

    /**
     * Obtener perfil completo del usuario (recomendado)
     */
    obtenerPerfilCompleto(): Observable<ApiResponse<PerfilCompleto>> {
        return this.http.get<ApiResponse<PerfilCompleto>>(`${this.apiUrl}/completo`);
    }

    /**
     * Obtener solo perfil de salud  
     */
    obtenerPerfilSalud(): Observable<ApiResponse<PerfilSalud>> {
        return this.http.get<ApiResponse<PerfilSalud>>(`${this.apiUrl}/salud`);
    }

    /**
     * Actualizar perfil de salud
     */
    actualizarPerfilSalud(perfil: Partial<PerfilSalud>): Observable<ApiResponse<PerfilSalud>> {
        return this.http.put<ApiResponse<PerfilSalud>>(`${this.apiUrl}/salud`, perfil);
    }

    /**
     * Agregar etiqueta al perfil
     */
    agregarEtiqueta(etiquetaId: number): Observable<ApiResponse<PerfilSalud>> {
        return this.http.post<ApiResponse<PerfilSalud>>(`${this.apiUrl}/salud/etiquetas/${etiquetaId}`, {});
    }

    /**
     * Eliminar etiqueta del perfil
     */
    eliminarEtiqueta(etiquetaId: number): Observable<ApiResponse<PerfilSalud>> {
        return this.http.delete<ApiResponse<PerfilSalud>>(`${this.apiUrl}/salud/etiquetas/${etiquetaId}`);
    }

    /**
     * Registrar nueva medición corporal
     */
    registrarMedicion(medicion: NuevaMedicion): Observable<ApiResponse<Medicion>> {
        return this.http.post<ApiResponse<Medicion>>(`${this.apiUrl}/mediciones`, medicion);
    }

    /**
     * Obtener todas las mediciones del usuario
     */
    obtenerMediciones(): Observable<ApiResponse<Medicion[]>> {
        return this.http.get<ApiResponse<Medicion[]>>(`${this.apiUrl}/mediciones`);
    }

    /**
     * Obtener medición específica por ID
     */
    obtenerMedicion(id: number): Observable<ApiResponse<Medicion>> {
        return this.http.get<ApiResponse<Medicion>>(`${this.apiUrl}/mediciones/${id}`);
    }

    /**
     * Actualizar medición existente
     */
    actualizarMedicion(id: number, medicion: NuevaMedicion): Observable<ApiResponse<Medicion>> {
        return this.http.put<ApiResponse<Medicion>>(`${this.apiUrl}/mediciones/${id}`, medicion);
    }

    /**
     * Eliminar medición
     */
    eliminarMedicion(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/mediciones/${id}`);
    }
}

export interface NuevaMedicion {
    peso: number;
    altura: number;
    fechaMedicion: string;
    unidadPeso: string;
}

export interface Medicion {
    id: number;
    peso: number;
    altura: number;
    imc: number | null;
    fechaMedicion: string;
    unidadPeso: string;
    categoriaIMC: string;
}
