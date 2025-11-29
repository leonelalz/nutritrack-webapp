// src/app/core/models/dashboard.model.ts

import { UnidadPeso, HistorialMedidasResponse } from './UsuarioHistorialMedidas.model';

// ====== RESPUESTAS DEL BACKEND USADAS EN DASHBOARD ======

export interface ComidaDiaInfo {
  comidaId: number;
  nombre: string;
  tipoComida: string;
  calorias: number;
  registrada: boolean;
  registroId: number | null;
}

export interface ActividadesDiaResponse {
  fecha: string;           // LocalDate -> "yyyy-MM-dd"
  diaActual: number;
  caloriasObjetivo: number;
  caloriasConsumidas: number;
  comidas: ComidaDiaInfo[];
}

export interface EjercicioDiaInfo {
  ejercicioId: number;
  nombre: string;
  seriesObjetivo: number;
  repeticionesObjetivo: number;
  pesoSugerido: number | null;
  duracionMinutos: number | null;
  registrado: boolean;
  registroId: number | null;
}

export interface EjerciciosDiaResponse {
  fecha: string;           // LocalDate
  semanaActual: number;
  ejercicios: EjercicioDiaInfo[];
}

export interface RegistroComidaHistorial {
  id: number;
  comidaId: number;
  comidaNombre: string;
  usuarioPlanId: number | null;
  fecha: string;           // LocalDate
  hora: string;            // LocalTime
  tipoComida: string;
  porciones: number;
  caloriasConsumidas: number;
  notas: string | null;
}

export interface RegistroEjercicioHistorial {
  id: number;
  ejercicioId: number;
  ejercicioNombre: string;
  usuarioRutinaId: number | null;
  fecha: string;
  hora: string;
  series: number;
  repeticiones: number;
  pesoKg: number | null;
  duracionMinutos: number | null;
  caloriasQuemadas: number;
  notas: string | null;
}

// ====== MODELOS DE DASHBOARD (ya procesados) ======

export interface DashboardSummary {
  caloriesToday: number;
  caloriesTarget: number;
  caloriesRemaining: number;
  caloriesProgressPercent: number;

  mealsCompletedToday: number;
  mealsPlannedToday: number;

  workoutsCompletedToday: number;
  workoutsCaloriesToday: number;

  activeStreakDays: number;
}

export type WeeklyTab = 'nutrition' | 'exercise' | 'goals';

export interface WeeklyNutritionData {
  labels: string[];          // p.e. ["Lun", "Mar", ...]
  calories: number[];        // consumidas por día
  targetCalories: number[];  // objetivo por día (línea plana)
  averageCalories: number;
}

export interface WeeklyExerciseData {
  labels: string[];
  caloriesBurned: number[];
}

export interface WeeklyGoalsData {
  labels: string[];          // fechas con medición
  weight: number[];          // peso en unidad preferida
  unit: UnidadPeso;
}

export interface WeeklyAnalysis {
  nutrition: WeeklyNutritionData;
  exercise: WeeklyExerciseData;
  goals: WeeklyGoalsData;
}

// ====== NUEVAS ESTRUCTURAS PARA QUITAR MAQUETA ======

export interface DailyGoal {
  id: string;
  name: string;         // Ej: "Comidas del plan de hoy"
  current: number;      // Ej: 4
  target: number;       // Ej: 5
  unit: string;         // Ej: "comidas", "ejercicios"
  type: 'nutrition' | 'exercise' | 'habit';
  completed: boolean;
}

export interface RecentActivityItem {
  id: string;
  type: 'meal' | 'exercise' | 'goal';
  title: string;        // Ej: "Almuerzo registrado"
  timeAgo: string;      // Ej: "Hoy", "Hace 2 días"
  value: string;        // Ej: "650 cal", "30 min", "+500ml"
  color: 'green' | 'red' | 'yellow' | 'blue'; // para CSS
  icon: string;         // Ej: "🥗", "🏃‍♂️"
}

export interface ExerciseSummary {
  workoutsThisMonth: number;   // 24
  totalHours: number;          // 18.5
  caloriesBurned: number;      // 3240
  workoutsThisWeek: number;    // 4
}

// ====== ROOT DEL DASHBOARD ======

export interface DashboardData {
  summary: DashboardSummary;
  weekly: WeeklyAnalysis;

  dailyGoals: DailyGoal[];
  dailyGoalsCompletionPercent: number;
  recentActivity: RecentActivityItem[];
  exerciseSummary: ExerciseSummary;
}
