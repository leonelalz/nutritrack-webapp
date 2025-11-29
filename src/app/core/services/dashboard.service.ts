// src/app/core/services/dashboard.service.ts

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

import {
  ActividadesDiaResponse,
  DashboardData,
  DashboardSummary,
  EjerciciosDiaResponse,
  RegistroComidaHistorial,
  RegistroEjercicioHistorial,
  WeeklyAnalysis,
  WeeklyExerciseData,
  WeeklyGoalsData,
  WeeklyNutritionData,
  DailyGoal,
  RecentActivityItem,
  ExerciseSummary,
} from '../models/dashboard.model';
import { HistorialMedidasResponse, UnidadPeso } from '../models/UsuarioHistorialMedidas.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private readonly registrosUrl = `${environment.apiUrl}/registros`;
  private readonly perfilUrl = `${environment.apiUrl}/perfil`;

  getDashboardData(): Observable<DashboardData> {
    const today = new Date();
    const todayStr = this.formatDate(today);
    const start30 = this.addDays(today, -29); // para racha y resúmenes
    const start30Str = this.formatDate(start30);
    const start7 = this.addDays(today, -6);   // para gráficos semanales
    const start7Str = this.formatDate(start7);

    return forkJoin({
      planHoy: this.http.get<ActividadesDiaResponse>(`${this.registrosUrl}/plan/hoy`),
      rutinaHoy: this.http.get<EjerciciosDiaResponse>(`${this.registrosUrl}/rutina/hoy`),
      comidas: this.http.get<RegistroComidaHistorial[]>(
        `${this.registrosUrl}/comidas/historial`,
        { params: { fechaInicio: start30Str, fechaFin: todayStr } }
      ),
      ejercicios: this.http.get<RegistroEjercicioHistorial[]>(
        `${this.registrosUrl}/ejercicios/historial`,
        { params: { fechaInicio: start30Str, fechaFin: todayStr } }
      ),
      mediciones: this.http.get<{ success: boolean; data: HistorialMedidasResponse[] }>(
        `${this.perfilUrl}/mediciones`
      )
    }).pipe(
      map(({ planHoy, rutinaHoy, comidas, ejercicios, mediciones }) => {
        const summary = this.buildSummary(
          planHoy,
          rutinaHoy,
          comidas,
          ejercicios,
          todayStr
        );

        const weekly = this.buildWeeklyAnalysis(
          planHoy,
          comidas,
          ejercicios,
          mediciones.data ?? [],
          start7Str,
          todayStr
        );

        const dailyGoals = this.buildDailyGoals(planHoy, rutinaHoy);
        const dailyGoalsCompletionPercent = this.calculateDailyGoalsPercent(dailyGoals);
        const recentActivity = this.buildRecentActivity(comidas, ejercicios, todayStr);
        const exerciseSummary = this.buildExerciseSummary(ejercicios, todayStr);

        return {
          summary,
          weekly,
          dailyGoals,
          dailyGoalsCompletionPercent,
          recentActivity,
          exerciseSummary
        };
      })
    );
  }

  // ================= Helpers internos =================

  private buildSummary(
    planHoy: ActividadesDiaResponse,
    rutinaHoy: EjerciciosDiaResponse,
    comidas: RegistroComidaHistorial[],
    ejercicios: RegistroEjercicioHistorial[],
    todayStr: string
  ): DashboardSummary {
    const mealsCompletedToday = planHoy.comidas.filter(c => c.registrada).length;
    const mealsPlannedToday = planHoy.comidas.length;

    const workoutsCompletedToday =
      rutinaHoy.ejercicios?.filter(e => e.registrado).length ?? 0;

    const workoutsCaloriesToday = ejercicios
      .filter(r => r.fecha === todayStr)
      .reduce((sum, r) => sum + (r.caloriasQuemadas ?? 0), 0);

    const caloriesToday = planHoy.caloriasConsumidas ?? 0;
    const caloriesTarget = planHoy.caloriasObjetivo ?? 0;
    const caloriesRemaining = Math.max(caloriesTarget - caloriesToday, 0);

    const caloriesProgressPercent =
      caloriesTarget > 0 ? (caloriesToday / caloriesTarget) * 100 : 0;

    const streak = this.calculateStreak(comidas, ejercicios, todayStr);

    return {
      caloriesToday,
      caloriesTarget,
      caloriesRemaining,
      caloriesProgressPercent,
      mealsCompletedToday,
      mealsPlannedToday,
      workoutsCompletedToday,
      workoutsCaloriesToday,
      activeStreakDays: streak,
    };
  }

  private buildWeeklyAnalysis(
    planHoy: ActividadesDiaResponse,
    comidas: RegistroComidaHistorial[],
    ejercicios: RegistroEjercicioHistorial[],
    mediciones: HistorialMedidasResponse[],
    start7: string,
    today: string
  ): WeeklyAnalysis {
    const dates7 = this.rangeOfDates(start7, today);

    // --- Nutrición ---
    const caloriesByDate = this.groupSumByDate(
      comidas,
      r => r.fecha,
      r => r.caloriasConsumidas ?? 0
    );

    const nutrition: WeeklyNutritionData = {
      labels: dates7.map(d => this.shortDayLabel(d)),
      calories: dates7.map(d => caloriesByDate.get(d) ?? 0),
      targetCalories: dates7.map(() => planHoy.caloriasObjetivo ?? 0),
      averageCalories:
        dates7.length > 0
          ? dates7.reduce((acc, d) => acc + (caloriesByDate.get(d) ?? 0), 0) / dates7.length
          : 0,
    };

    // --- Ejercicio ---
    const caloriesBurnedByDate = this.groupSumByDate(
      ejercicios,
      r => r.fecha,
      r => r.caloriasQuemadas ?? 0
    );

    const exercise: WeeklyExerciseData = {
      labels: dates7.map(d => this.shortDayLabel(d)),
      caloriesBurned: dates7.map(d => caloriesBurnedByDate.get(d) ?? 0),
    };

    // --- Metas (peso) ---
    const medidasOrdenadas = [...mediciones].sort((a, b) =>
      a.fechaMedicion.localeCompare(b.fechaMedicion)
    );
    const recientes = medidasOrdenadas.filter(
      m => m.fechaMedicion >= start7 && m.fechaMedicion <= today
    );

    const goals: WeeklyGoalsData = {
      labels: recientes.map(m => this.formatDateLabel(m.fechaMedicion)),
      weight: recientes.map(m => Number(m.peso)),
      unit: recientes[0]?.unidadPeso ?? UnidadPeso.KG,
    };

    return { nutrition, exercise, goals };
  }

  // ----- NUEVO: construir metas diarias a partir del plan y rutina -----

  private buildDailyGoals(
    planHoy: ActividadesDiaResponse,
    rutinaHoy: EjerciciosDiaResponse
  ): DailyGoal[] {
    const goals: DailyGoal[] = [];

    const mealsPlanned = planHoy.comidas?.length ?? 0;
    const mealsDone = planHoy.comidas?.filter(c => c.registrada).length ?? 0;

    if (mealsPlanned > 0) {
      goals.push({
        id: 'meals-today',
        name: 'Comidas del plan de hoy',
        current: mealsDone,
        target: mealsPlanned,
        unit: 'comidas',
        type: 'nutrition',
        completed: mealsDone >= mealsPlanned
      });
    }

    const workoutsPlanned = rutinaHoy.ejercicios?.length ?? 0;
    const workoutsDone = rutinaHoy.ejercicios?.filter(e => e.registrado).length ?? 0;

    if (workoutsPlanned > 0) {
      goals.push({
        id: 'workouts-today',
        name: 'Ejercicios de la rutina de hoy',
        current: workoutsDone,
        target: workoutsPlanned,
        unit: 'ejercicios',
        type: 'exercise',
        completed: workoutsDone >= workoutsPlanned
      });
    }

    return goals;
  }

  private calculateDailyGoalsPercent(goals: DailyGoal[]): number {
    if (!goals.length) {
      return 0;
    }

    const totalPercent = goals.reduce((acc, g) => {
      if (!g.target || g.target <= 0) return acc;
      const pct = Math.min((g.current / g.target) * 100, 100);
      return acc + pct;
    }, 0);

    return totalPercent / goals.length;
  }

  // ----- NUEVO: actividad reciente combinando comidas y ejercicios -----

  private buildRecentActivity(
    comidas: RegistroComidaHistorial[],
    ejercicios: RegistroEjercicioHistorial[],
    todayStr: string
  ): RecentActivityItem[] {
    const combined: { dateTime: string; item: RecentActivityItem }[] = [];

    for (const c of comidas) {
      const dateTime = `${c.fecha}T${c.hora}`;
      const title = `${c.tipoComida || 'Comida'} registrada`;
      const value = `${c.caloriasConsumidas ?? 0} cal`;

      combined.push({
        dateTime,
        item: {
          id: `meal-${c.id}`,
          type: 'meal',
          title,
          timeAgo: this.computeTimeAgo(c.fecha, todayStr),
          value,
          color: 'green',
          icon: '🥗'
        }
      });
    }

    for (const e of ejercicios) {
      const dateTime = `${e.fecha}T${e.hora}`;
      const title = `${e.ejercicioNombre} completado`;
      const value =
        e.duracionMinutos != null && e.duracionMinutos > 0
          ? `${e.duracionMinutos} min`
          : `${e.caloriasQuemadas ?? 0} cal`;

      combined.push({
        dateTime,
        item: {
          id: `exercise-${e.id}`,
          type: 'exercise',
          title,
          timeAgo: this.computeTimeAgo(e.fecha, todayStr),
          value,
          color: 'red',
          icon: '🏃‍♂️'
        }
      });
    }

    combined.sort((a, b) => b.dateTime.localeCompare(a.dateTime));

    return combined.slice(0, 5).map(c => c.item);
  }

  private computeTimeAgo(fecha: string, todayStr: string): string {
    if (fecha === todayStr) {
      return 'Hoy';
    }

    const d1 = this.parseIsoDate(fecha);
    const d2 = this.parseIsoDate(todayStr);
    const diffMs = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Hoy';
    if (diffDays === 1) return 'Hace 1 día';
    return `Hace ${diffDays} días`;
  }

  private parseIsoDate(dateStr: string): Date {
    return new Date(dateStr + 'T00:00:00');
  }

  // ----- NUEVO: resumen de ejercicio (tarjeta "Resumen de Ejercicios") -----

  private buildExerciseSummary(
    ejercicios: RegistroEjercicioHistorial[],
    todayStr: string
  ): ExerciseSummary {
    if (!ejercicios || !ejercicios.length) {
      return {
        workoutsThisMonth: 0,
        totalHours: 0,
        caloriesBurned: 0,
        workoutsThisWeek: 0
      };
    }

    const today = this.parseIsoDate(todayStr);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const startOfWeek = this.getStartOfWeek(today);

    let workoutsThisMonth = 0;
    let workoutsThisWeek = 0;
    let totalMinutes = 0;
    let caloriesBurned = 0;

    for (const e of ejercicios) {
      const d = this.parseIsoDate(e.fecha);

      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        workoutsThisMonth++;
      }

      if (d >= startOfWeek && d <= today) {
        workoutsThisWeek++;
      }

      totalMinutes += e.duracionMinutos ?? 0;
      caloriesBurned += e.caloriasQuemadas ?? 0;
    }

    const totalHours = totalMinutes / 60;

    return {
      workoutsThisMonth,
      totalHours,
      caloriesBurned,
      workoutsThisWeek
    };
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay(); // 0=Domingo, 1=Lunes,...
    const diffFromMonday = (day + 6) % 7; // distancia desde lunes
    d.setDate(d.getDate() - diffFromMonday);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // ---- utilidades de agrupación y fechas ----

  private groupSumByDate<T>(
    items: T[],
    getDate: (item: T) => string,
    getValue: (item: T) => number
  ): Map<string, number> {
    const map = new Map<string, number>();
    for (const item of items) {
      const date = getDate(item);
      const current = map.get(date) ?? 0;
      map.set(date, current + getValue(item));
    }
    return map;
  }

  private calculateStreak(
    comidas: RegistroComidaHistorial[],
    ejercicios: RegistroEjercicioHistorial[],
    todayStr: string
  ): number {
    const daysWithActivity = new Set<string>();
    comidas.forEach(c => daysWithActivity.add(c.fecha));
    ejercicios.forEach(e => daysWithActivity.add(e.fecha));

    let streak = 0;
    let cursor = new Date(todayStr);

    for (let i = 0; i < 30; i++) {
      const dateStr = this.formatDate(cursor);
      if (daysWithActivity.has(dateStr)) {
        streak++;
      } else {
        break;
      }
      cursor = this.addDays(cursor, -1);
    }

    return streak;
  }

  private addDays(base: Date, days: number): Date {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10); // yyyy-MM-dd
  }

  private rangeOfDates(start: string, end: string): string[] {
    const dates: string[] = [];
    let d = new Date(start);
    const endDate = new Date(end);

    while (d <= endDate) {
      dates.push(this.formatDate(d));
      d = this.addDays(d, 1);
    }
    return dates;
  }

  private shortDayLabel(dateStr: string): string {
    const d = new Date(dateStr);
    const day = d.getDay(); // 0=Domingo
    const labels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return labels[day];
  }

  private formatDateLabel(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}`;
  }
}
