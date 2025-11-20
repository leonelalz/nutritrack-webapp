// // src/app/core/services/progreso.service.ts

// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../enviroments/enviroment';
// import { ApiResponse } from '../models/etiqueta.model';
// import {
//   HistorialMedidasRequest,
//   HistorialMedidasResponse
// } from '../models/UsuarioHistorialMedidas.model';
// import { ActividadesDiaResponse } from '../models/seguimiento.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProgresoService {
//   private http = inject(HttpClient);

//   private readonly PERFIL_URL = `${environment.apiUrl}/perfiles`;
//   private readonly REGISTROS_URL = `${environment.apiUrl}/usuario/registros`;

//   // =========================
//   // MEDICIONES (RN22, RN23)
//   // =========================

//   obtenerHistorialMedidas(): Observable<ApiResponse<HistorialMedidasResponse[]>> {
//     return this.http.get<ApiResponse<HistorialMedidasResponse[]>>(
//       `${this.PERFIL_URL}/mediciones`
//     );
//   }

//   registrarMedicion(
//     request: HistorialMedidasRequest
//   ): Observable<ApiResponse<HistorialMedidasResponse>> {
//     return this.http.post<ApiResponse<HistorialMedidasResponse>>(
//       `${this.PERFIL_URL}/mediciones`,
//       request
//     );
//   }

//   // =========================
//   // ACTIVIDADES DEL DÍA (RN20)
//   // =========================

//   obtenerActividadesHoy(): Observable<ActividadesDiaResponse> {
//     // Backend: GET /api/v1/usuario/registros/plan/hoy
//     return this.http.get<ActividadesDiaResponse>(`${this.REGISTROS_URL}/plan/hoy`);
//   }
// }


import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment'; // 👈 ajusta la ruta si en tu proyecto es diferente
import { ApiResponse } from '../models/etiqueta.model';
import {
  HistorialMedidasRequest,
  HistorialMedidasResponse
} from '../models/UsuarioHistorialMedidas.model';
import { ActividadesDiaResponse } from '../models/seguimiento.model';
import { RegistroComida } from '../models/registro-comida.model';
import { RegistroEjercicio } from '../models/registro-ejercicio.model';


@Injectable({
  providedIn: 'root'
})
export class ProgresoService {
  private http = inject(HttpClient);

  private readonly PERFIL_URL = `${environment.apiUrl}/perfil`; // en singular
  private readonly REGISTROS_URL = `${environment.apiUrl}/usuario/registros`;


  // MEDICIONES (RN22, RN23)
  obtenerHistorialMedidas(): Observable<ApiResponse<HistorialMedidasResponse[]>> {
    return this.http.get<ApiResponse<HistorialMedidasResponse[]>>(
      `${this.PERFIL_URL}/mediciones`
    );
  }

  registrarMedicion(
    request: HistorialMedidasRequest
  ): Observable<ApiResponse<HistorialMedidasResponse>> {
    return this.http.post<ApiResponse<HistorialMedidasResponse>>(
      `${this.PERFIL_URL}/mediciones`,
      request
    );
  }

  // ACTIVIDADES DEL DÍA (RN20)
  obtenerActividadesHoy(): Observable<ActividadesDiaResponse> {
    return this.http.get<ActividadesDiaResponse>(
      `${this.REGISTROS_URL}/plan/hoy`
    );
  }

}
