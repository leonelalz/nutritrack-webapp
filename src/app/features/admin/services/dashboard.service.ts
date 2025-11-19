import { Injectable, inject, signal } from '@angular/core';
import { forkJoin, Observable, tap, catchError, of } from 'rxjs';
import { PlanService } from '../../../core/services/plan.service';
import { RutinaService } from '../../../core/services/rutina.service';
import { ComidaService } from '../../../core/services/comida.service';
import { IngredienteService } from '../../../core/services/ingrediente.service';
import { EjercicioService } from '../../../core/services/ejercicio.service';

export interface DashboardStats {
  totalPlanes: number;
  totalRutinas: number;
  totalComidas: number;
  totalIngredientes: number;
  totalEjercicios: number;
}

export interface ActividadReciente {
  tipo: 'plan' | 'rutina' | 'comida' | 'ingrediente' | 'ejercicio';
  titulo: string;
  descripcion: string;
  fecha: Date;
  icono: string;
}

/**
 * Servicio centralizado para el Dashboard de Administración
 * Obtiene estadísticas y actividad reciente de todos los módulos
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private planService = inject(PlanService);
  private rutinaService = inject(RutinaService);
  private comidaService = inject(ComidaService);
  private ingredienteService = inject(IngredienteService);
  private ejercicioService = inject(EjercicioService);

  // Signals para estado reactivo
  private readonly _stats = signal<DashboardStats>({
    totalPlanes: 0,
    totalRutinas: 0,
    totalComidas: 0,
    totalIngredientes: 0,
    totalEjercicios: 0
  });

  private readonly _actividadReciente = signal<ActividadReciente[]>([]);
  private readonly _cargando = signal<boolean>(false);

  // Getters públicos
  readonly stats = this._stats.asReadonly();
  readonly actividadReciente = this._actividadReciente.asReadonly();
  readonly cargando = this._cargando.asReadonly();

  /**
   * Cargar todas las estadísticas del dashboard
   */
  cargarEstadisticas(): Observable<void> {
    this._cargando.set(true);

    forkJoin({
      planes: this.planService.obtenerPlanes(0, 1).pipe(
        catchError(() => of({ success: false, data: { totalElements: 0 } as any }))
      ),
      rutinas: this.rutinaService.obtenerRutinas(0, 1).pipe(
        catchError(() => of({ success: false, data: { totalElements: 0 } as any }))
      ),
      comidas: this.comidaService.listar(0, 1).pipe(
        catchError(() => of({ success: false, data: { totalElements: 0 } as any }))
      ),
      ingredientes: this.ingredienteService.listar(0, 1).pipe(
        catchError(() => of({ success: false, data: { totalElements: 0 } as any }))
      ),
      ejercicios: this.ejercicioService.listar(0, 1).pipe(
        catchError(() => of({ success: false, data: { totalElements: 0 } as any }))
      )
    }).subscribe({
      next: (results) => {
        const stats: DashboardStats = {
          totalPlanes: results.planes.success ? results.planes.data?.totalElements || 0 : 0,
          totalRutinas: results.rutinas.success ? results.rutinas.data?.totalElements || 0 : 0,
          totalComidas: results.comidas.success ? results.comidas.data?.totalElements || 0 : 0,
          totalIngredientes: results.ingredientes.success ? results.ingredientes.data?.totalElements || 0 : 0,
          totalEjercicios: results.ejercicios.success ? results.ejercicios.data?.totalElements || 0 : 0
        };
        
        this._stats.set(stats);
        this._cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar estadísticas del dashboard:', error);
        this._cargando.set(false);
      }
    });

    return of(void 0);
  }

  /**
   * Cargar actividad reciente de todos los módulos
   * Obtiene los últimos 3-4 items de cada tipo y los combina
   */
  cargarActividadReciente(): Observable<void> {
    forkJoin({
      planes: this.planService.obtenerPlanes(0, 3).pipe(
        catchError(() => of({ success: false, data: { content: [] } as any }))
      ),
      rutinas: this.rutinaService.obtenerRutinas(0, 3).pipe(
        catchError(() => of({ success: false, data: { content: [] } as any }))
      ),
      comidas: this.comidaService.listar(0, 3).pipe(
        catchError(() => of({ success: false, data: { content: [] } as any }))
      ),
      ingredientes: this.ingredienteService.listar(0, 2).pipe(
        catchError(() => of({ success: false, data: { content: [] } as any }))
      ),
      ejercicios: this.ejercicioService.listar(0, 2).pipe(
        catchError(() => of({ success: false, data: { content: [] } as any }))
      )
    }).subscribe({
      next: (results) => {
        const actividades: ActividadReciente[] = [];

        // Agregar planes
        if (results.planes.success && results.planes.data?.content) {
          results.planes.data.content.forEach((plan: any) => {
            actividades.push({
              tipo: 'plan',
              titulo: 'Plan Nutricional',
              descripcion: plan.nombre,
              fecha: new Date(), // Usar fecha actual por ahora
              icono: 'restaurant_menu'
            });
          });
        }

        // Agregar rutinas
        if (results.rutinas.success && results.rutinas.data?.content) {
          results.rutinas.data.content.forEach((rutina: any) => {
            actividades.push({
              tipo: 'rutina',
              titulo: 'Rutina de Ejercicio',
              descripcion: rutina.nombre,
              fecha: new Date(),
              icono: 'fitness_center'
            });
          });
        }

        // Agregar comidas
        if (results.comidas.success && results.comidas.data?.content) {
          results.comidas.data.content.forEach((comida: any) => {
            actividades.push({
              tipo: 'comida',
              titulo: 'Nueva Comida',
              descripcion: comida.nombre,
              fecha: new Date(),
              icono: 'restaurant'
            });
          });
        }

        // Agregar ingredientes
        if (results.ingredientes.success && results.ingredientes.data?.content) {
          results.ingredientes.data.content.forEach((ingrediente: any) => {
            actividades.push({
              tipo: 'ingrediente',
              titulo: 'Ingrediente',
              descripcion: ingrediente.nombre,
              fecha: new Date(),
              icono: 'kitchen'
            });
          });
        }

        // Agregar ejercicios
        if (results.ejercicios.success && results.ejercicios.data?.content) {
          results.ejercicios.data.content.forEach((ejercicio: any) => {
            actividades.push({
              tipo: 'ejercicio',
              titulo: 'Ejercicio',
              descripcion: ejercicio.nombre,
              fecha: new Date(),
              icono: 'fitness_center'
            });
          });
        }

        // Ordenar por fecha descendente y tomar los primeros 10
        actividades.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
        const actividadesRecientes = actividades.slice(0, 10);

        this._actividadReciente.set(actividadesRecientes);
      },
      error: (error) => {
        console.error('Error al cargar actividad reciente:', error);
      }
    });

    return of(void 0);
  }

  /**
   * Calcular tiempo relativo desde una fecha
   */
  calcularTiempoRelativo(fecha: Date): string {
    const ahora = new Date();
    const diferencia = ahora.getTime() - fecha.getTime();
    
    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `Hace ${dias}d`;
    if (horas > 0) return `Hace ${horas}h`;
    if (minutos > 0) return `Hace ${minutos}m`;
    return 'Ahora mismo';
  }
}
