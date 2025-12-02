import { Injectable, signal } from '@angular/core';

/**
 * Servicio de datos mock para modo demo/offline
 * Simula una base de datos en memoria del frontend
 * Los datos persisten mientras la app está abierta
 */
@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // ============================================================================
  // ESTADO GLOBAL DEL USUARIO
  // ============================================================================
  
  readonly usuarioActual = signal({
    id: 1,
    username: 'Usuario Demo',
    email: 'demo@nutritrack.com',
    nombreCompleto: 'Juan Pérez Demo',
    rol: 'USER'
  });

  readonly perfilSalud = signal({
    id: 1,
    objetivoActual: 'PERDER_PESO',
    nivelActividadActual: 'MODERADO',
    notas: 'Perfil de demostración funcional' as string | null,
    etiquetas: [
      { id: 1, nombre: 'Sin Gluten', tipoEtiqueta: 'ALERGIA', descripcion: 'Alergia al gluten' },
      { id: 2, nombre: 'Lactosa', tipoEtiqueta: 'ALERGIA', descripcion: 'Intolerancia a la lactosa' }
    ]
  });

  // ============================================================================
  // PLANES NUTRICIONALES
  // ============================================================================
  
  readonly planesDisponibles = signal([
    {
      id: 1,
      nombre: 'Plan Pérdida de Peso - 30 días',
      descripcion: 'Plan balanceado para reducir peso de forma saludable',
      duracionDias: 30,
      activo: true,
      objetivo: { caloriasObjetivo: 1800, proteinasObjetivo: 120, carbohidratosObjetivo: 150, grasasObjetivo: 60 },
      etiquetas: [{ id: 9, nombre: 'Perder Peso', tipoEtiqueta: 'OBJETIVO', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
      totalDiasProgramados: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      nombre: 'Plan Ganancia Muscular - 60 días',
      descripcion: 'Plan alto en proteínas para aumentar masa muscular',
      duracionDias: 60,
      activo: true,
      objetivo: { caloriasObjetivo: 2500, proteinasObjetivo: 180, carbohidratosObjetivo: 250, grasasObjetivo: 80 },
      etiquetas: [{ id: 10, nombre: 'Ganar Masa Muscular', tipoEtiqueta: 'OBJETIVO', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
      totalDiasProgramados: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      nombre: 'Plan Mantenimiento',
      descripcion: 'Plan equilibrado para mantener peso actual',
      duracionDias: 30,
      activo: true,
      objetivo: { caloriasObjetivo: 2000, proteinasObjetivo: 100, carbohidratosObjetivo: 200, grasasObjetivo: 70 },
      etiquetas: [{ id: 11, nombre: 'Mantener Forma', tipoEtiqueta: 'OBJETIVO', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
      totalDiasProgramados: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  readonly planActivo = signal<any>(null);

  readonly comidasProgramadas = signal<any[]>([
    { 
      id: 1, 
      numeroDia: 1,
      tipoComida: 'DESAYUNO',
      comida: { id: 1, nombre: 'Avena con frutas y miel', tipoComida: 'DESAYUNO', calorias: 350 },
      notas: 'Desayuno balanceado',
      completada: false,
      registroId: null as number | null,
      fecha: new Date().toISOString().split('T')[0]
    },
    { 
      id: 2, 
      numeroDia: 1,
      tipoComida: 'ALMUERZO',
      comida: { id: 2, nombre: 'Pollo a la plancha con arroz integral', tipoComida: 'ALMUERZO', calorias: 600 },
      notas: 'Incluye ensalada verde',
      completada: false,
      registroId: null as number | null,
      fecha: new Date().toISOString().split('T')[0]
    },
    { 
      id: 3, 
      numeroDia: 1,
      tipoComida: 'SNACK',
      comida: { id: 3, nombre: 'Yogur griego con almendras', tipoComida: 'SNACK', calorias: 180 },
      notas: 'Snack de media tarde',
      completada: false,
      registroId: null as number | null,
      fecha: new Date().toISOString().split('T')[0]
    },
    { 
      id: 4, 
      numeroDia: 1,
      tipoComida: 'CENA',
      comida: { id: 4, nombre: 'Salmón al horno con verduras', tipoComida: 'CENA', calorias: 500 },
      notas: 'Cena ligera y nutritiva',
      completada: false,
      registroId: null as number | null,
      fecha: new Date().toISOString().split('T')[0]
    }
  ]);

  // ============================================================================
  // RUTINAS DE EJERCICIO
  // ============================================================================
  
  readonly rutinasDisponibles = signal([
    {
      id: 1,
      nombre: 'Rutina Principiante - 4 semanas',
      descripcion: 'Rutina de inicio para personas sedentarias. 3 días por semana.',
      duracionSemanas: 4,
      patronSemanas: 1,
      nivelDificultad: 'PRINCIPIANTE',
      activo: true,
      etiquetas: [
        { id: 9, nombre: 'Perder Peso', tipoEtiqueta: 'OBJETIVO' },
        { id: 11, nombre: 'Mantener Forma', tipoEtiqueta: 'OBJETIVO' }
      ],
      totalEjerciciosProgramados: 9
    },
    {
      id: 2,
      nombre: 'Rutina Intermedia - 6 semanas',
      descripcion: 'Rutina de nivel medio con mayor intensidad. 4 días por semana.',
      duracionSemanas: 6,
      patronSemanas: 1,
      nivelDificultad: 'INTERMEDIO',
      activo: true,
      etiquetas: [{ id: 10, nombre: 'Ganar Masa Muscular', tipoEtiqueta: 'OBJETIVO' }],
      totalEjerciciosProgramados: 16
    },
    {
      id: 3,
      nombre: 'Rutina Avanzada - 8 semanas',
      descripcion: 'Rutina de alta intensidad para personas con experiencia. 5 días por semana.',
      duracionSemanas: 8,
      patronSemanas: 1,
      nivelDificultad: 'AVANZADO',
      activo: true,
      etiquetas: [],
      totalEjerciciosProgramados: 25
    }
  ]);

  readonly rutinaActiva = signal<any>(null);

  readonly ejerciciosProgramados = signal([
    { 
      id: 1, 
      semanaBase: 1,
      diaSemana: 1,
      orden: 1,
      series: 3,
      repeticiones: 15,
      peso: null,
      duracionMinutos: 10,
      descansoSegundos: 60,
      notas: 'Calentar bien antes de empezar',
      ejercicio: { id: 9, nombre: 'Sentadillas', tipoEjercicio: 'FUERZA', grupoMuscular: 'PIERNAS' },
      completado: false
    },
    { 
      id: 2, 
      semanaBase: 1,
      diaSemana: 1,
      orden: 2,
      series: 3,
      repeticiones: 12,
      peso: null,
      duracionMinutos: 8,
      descansoSegundos: 60,
      notas: 'Mantener espalda recta',
      ejercicio: { id: 10, nombre: 'Flexiones', tipoEjercicio: 'FUERZA', grupoMuscular: 'PECHO' },
      completado: false
    },
    { 
      id: 3, 
      semanaBase: 1,
      diaSemana: 1,
      orden: 3,
      series: 3,
      repeticiones: 1,
      peso: null,
      duracionMinutos: 5,
      descansoSegundos: 45,
      notas: 'Mantener abdomen contraído',
      ejercicio: { id: 11, nombre: 'Plancha', tipoEjercicio: 'CORE', grupoMuscular: 'ABDOMEN' },
      completado: false
    }
  ]);

  // ============================================================================
  // ESTADÍSTICAS Y SEGUIMIENTO
  // ============================================================================
  
  readonly estadisticasHoy = signal({
    caloriasConsumidas: 0,
    caloriasQuemadas: 0,
    caloriasObjetivo: 2000,
    comidasCompletadas: 0,
    comidasProgramadas: 4,
    ejerciciosCompletados: 0,
    ejerciciosProgramados: 3,
    tiempoActivoMinutos: 0,
    tiempoObjetivoMinutos: 45,
    hidratacionLitros: 1.2,
    hidratacionObjetivo: 2.5
  });

  // ============================================================================
  // MÉTODOS PARA MANIPULAR DATOS
  // ============================================================================

  // -------------------- PLANES --------------------
  
  activarPlan(planId: number): void {
    const plan = this.planesDisponibles().find(p => p.id === planId);
    if (plan) {
      this.planActivo.set({
        ...plan,
        fechaInicio: new Date().toISOString().split('T')[0],
        diaActual: 1,
        estado: 'ACTIVO'
      });
    }
  }

  obtenerPlanActivo(): any {
    return this.planActivo();
  }

  // -------------------- COMIDAS --------------------
  
  marcarComidaCompletada(comidaId: number): void {
    const comidas = this.comidasProgramadas();
    const comida = comidas.find(c => c.id === comidaId);
    if (comida) {
      comida.completada = true;
      this.comidasProgramadas.set([...comidas]);
      this.actualizarEstadisticasComidas();
    }
  }

  desmarcarComidaCompletada(comidaId: number): void {
    const comidas = this.comidasProgramadas();
    const comida = comidas.find(c => c.id === comidaId);
    if (comida) {
      comida.completada = false;
      comida.registroId = null;
      this.comidasProgramadas.set([...comidas]);
      this.actualizarEstadisticasComidas();
    }
  }

  agregarComida(comida: any): void {
    const comidas = this.comidasProgramadas();
    const nuevaComida = {
      ...comida,
      id: Math.max(...comidas.map(c => c.id), 0) + 1,
      completada: false,
      fecha: new Date().toISOString().split('T')[0]
    };
    this.comidasProgramadas.set([...comidas, nuevaComida]);
  }

  private actualizarEstadisticasComidas(): void {
    const comidas = this.comidasProgramadas();
    const completadas = comidas.filter(c => c.completada);
    const caloriasConsumidas = completadas.reduce((sum, c) => sum + (c.comida?.calorias || 0), 0);
    
    this.estadisticasHoy.update(stats => ({
      ...stats,
      caloriasConsumidas,
      comidasCompletadas: completadas.length,
      comidasProgramadas: comidas.length
    }));
  }

  // -------------------- RUTINAS --------------------
  
  activarRutina(rutinaId: number): void {
    const rutina = this.rutinasDisponibles().find(r => r.id === rutinaId);
    if (rutina) {
      this.rutinaActiva.set({
        ...rutina,
        fechaInicio: new Date().toISOString().split('T')[0],
        semanaActual: 1,
        diaActual: 1,
        estado: 'ACTIVO'
      });
    }
  }

  obtenerRutinaActiva(): any {
    return this.rutinaActiva();
  }

  // -------------------- EJERCICIOS --------------------
  
  marcarEjercicioCompletado(ejercicioId: number): void {
    const ejercicios = this.ejerciciosProgramados();
    const ejercicio = ejercicios.find(e => e.id === ejercicioId);
    if (ejercicio) {
      ejercicio.completado = true;
      this.ejerciciosProgramados.set([...ejercicios]);
      this.actualizarEstadisticasEjercicios();
    }
  }

  agregarEjercicio(ejercicio: any): void {
    const ejercicios = this.ejerciciosProgramados();
    const nuevoEjercicio = {
      ...ejercicio,
      id: Math.max(...ejercicios.map(e => e.id), 0) + 1,
      completado: false
    };
    this.ejerciciosProgramados.set([...ejercicios, nuevoEjercicio]);
  }

  private actualizarEstadisticasEjercicios(): void {
    const ejercicios = this.ejerciciosProgramados();
    const completados = ejercicios.filter(e => e.completado);
    const tiempoActivo = completados.reduce((sum, e) => sum + (e.duracionMinutos || 0), 0);
    const caloriasQuemadas = tiempoActivo * 8; // Aproximación: 8 cal/min
    
    this.estadisticasHoy.update(stats => ({
      ...stats,
      caloriasQuemadas,
      ejerciciosCompletados: completados.length,
      ejerciciosProgramados: ejercicios.length,
      tiempoActivoMinutos: tiempoActivo
    }));
  }

  // -------------------- PERFIL --------------------
  
  actualizarPerfilSalud(datos: any): void {
    this.perfilSalud.update(perfil => ({ ...perfil, ...datos }));
  }

  agregarEtiqueta(etiqueta: any): void {
    const perfil = this.perfilSalud();
    const nuevaEtiqueta = {
      ...etiqueta,
      id: Math.max(...perfil.etiquetas.map(e => e.id), 0) + 1
    };
    this.perfilSalud.set({
      ...perfil,
      etiquetas: [...perfil.etiquetas, nuevaEtiqueta]
    });
  }

  eliminarEtiqueta(etiquetaId: number): void {
    const perfil = this.perfilSalud();
    this.perfilSalud.set({
      ...perfil,
      etiquetas: perfil.etiquetas.filter(e => e.id !== etiquetaId)
    });
  }

  // -------------------- RESET --------------------
  
  resetearDatos(): void {
    // Reinicia todos los datos a valores por defecto
    this.planActivo.set(null);
    this.rutinaActiva.set(null);
    
    const comidas = this.comidasProgramadas();
    comidas.forEach(c => c.completada = false);
    this.comidasProgramadas.set([...comidas]);
    
    const ejercicios = this.ejerciciosProgramados();
    ejercicios.forEach(e => e.completado = false);
    this.ejerciciosProgramados.set([...ejercicios]);
    
    this.estadisticasHoy.set({
      caloriasConsumidas: 0,
      caloriasQuemadas: 0,
      caloriasObjetivo: 2000,
      comidasCompletadas: 0,
      comidasProgramadas: 4,
      ejerciciosCompletados: 0,
      ejerciciosProgramados: 3,
      tiempoActivoMinutos: 0,
      tiempoObjetivoMinutos: 45,
      hidratacionLitros: 1.2,
      hidratacionObjetivo: 2.5
    });
  }
}
