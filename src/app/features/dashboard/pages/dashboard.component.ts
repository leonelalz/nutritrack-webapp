import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';

// Services
import { PerfilService } from '../../../core/services/perfil.service';
import { MetasService } from '../../../core/services/metas.service';
import { NotificationService } from '../../../core/services/notification.service';
import { 
  DashboardService, 
  Logro, 
  HistorialMedida,
  ProgresoPlanResponse,
  ProgresoNutricionalResponse,
  ProgresoSemanalEjerciciosResponse,
  ActividadesDiaResponse,
  EjerciciosDiaResponse,
  UsuarioPlanResponse,
  UsuarioRutinaResponse
} from '../services/dashboard.service';

// Models
import { PerfilCompletoResponse, HistorialMedidasResponse } from '../../../core/models/perfil.model';

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardMainComponent implements OnInit, OnDestroy {
  // Exponer Math al template
  protected Math = Math;
  // Services
  private perfilService = inject(PerfilService);
  private metasService = inject(MetasService);
  private dashboardService = inject(DashboardService);
  private notificationService = inject(NotificationService);

  // Estado de carga
  isLoading = signal(true);
  hasError = signal(false);
  errorMessage = signal('');

  // Datos del perfil
  perfil = signal<PerfilCompletoResponse | null>(null);
  mediciones = signal<HistorialMedida[]>([]);

  // Datos de planes y rutinas
  planActivo = signal<UsuarioPlanResponse | null>(null);
  rutinaActiva = signal<UsuarioRutinaResponse | null>(null);

  // Progreso del día
  progresoHoy = signal<ActividadesDiaResponse | null>(null);
  ejerciciosHoy = signal<EjerciciosDiaResponse | null>(null);

  // Progreso del plan (estadísticas completas)
  progresoPlan = signal<ProgresoPlanResponse | null>(null);

  // Progreso semanal
  progresoSemanalComidas = signal<ProgresoNutricionalResponse | null>(null);
  progresoSemanalEjercicios = signal<ProgresoSemanalEjerciciosResponse | null>(null);

  // Logros
  logros = signal<Logro[]>([]);

  // Animaciones
  showWelcome = signal(true);
  animatedCalories = signal(0);
  animatedProtein = signal(0);
  animatedCarbs = signal(0);
  animatedFat = signal(0);

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Computed values
  nombreUsuario = computed(() => {
    const p = this.perfil();
    if (p?.nombre) return p.nombre;
    if (p?.nombreCompleto) return p.nombreCompleto.split(' ')[0];
    return 'Usuario';
  });

  saludoDelDia = computed(() => {
    const hora = new Date().getHours();
    if (hora < 12) return '¡Buenos días';
    if (hora < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  });

  getSaludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) return '¡Buenos días';
    if (hora < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  }

  mensajeMotivacional = computed(() => {
    const mensajes = [
      '¡Cada día es una nueva oportunidad para ser mejor! 💪',
      '¡Tu dedicación te llevará lejos! 🌟',
      '¡Sigue así, vas por buen camino! 🎯',
      '¡Los pequeños pasos llevan a grandes logros! 🏆',
      '¡Tu cuerpo te agradecerá el esfuerzo! 💚',
      '¡La consistencia es la clave del éxito! 🔑',
      '¡Hoy es un gran día para superarte! 🚀'
    ];
    return mensajes[Math.floor(Math.random() * mensajes.length)];
  });

  // Métricas calculadas
  diasEnApp = computed(() => {
    const p = this.perfil();
    if (!p?.fechaInicioApp) return 0;
    const inicio = new Date(p.fechaInicioApp);
    const hoy = new Date();
    return Math.floor((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  });

  rachaActual = computed(() => {
    // Usar datos reales del progreso del plan (más precisos)
    const pp = this.progresoPlan();
    if (pp?.rachaActual) {
      return pp.rachaActual;
    }
    // Fallback al cálculo del servicio
    return this.dashboardService.calcularRacha({
      planActivo: this.planActivo(),
      rutinaActiva: this.rutinaActiva(),
      progresoPlan: this.progresoPlan()
    });
  });

  // Mejor racha histórica
  rachaMejor = computed(() => {
    const pp = this.progresoPlan();
    return pp?.rachaMejor || this.rachaActual();
  });

  pesoActual = computed(() => {
    const p = this.perfil();
    return p?.ultimaMedicion?.peso || 0;
  });

  pesoInicial = computed(() => {
    const m = this.mediciones();
    if (m.length === 0) return this.pesoActual();
    return m[m.length - 1]?.peso || this.pesoActual();
  });

  cambiosPeso = computed(() => {
    return this.pesoActual() - this.pesoInicial();
  });

  imcActual = computed(() => {
    const p = this.perfil();
    return p?.ultimaMedicion?.imc || 0;
  });

  categoriaIMC = computed(() => {
    const p = this.perfil();
    return p?.ultimaMedicion?.categoriaIMC || 'Sin datos';
  });

  // Progreso nutricional del día
  caloriasConsumidas = computed(() => this.progresoHoy()?.caloriasConsumidas || 0);
  caloriasObjetivo = computed(() => this.progresoHoy()?.caloriasObjetivo || 2000);
  porcentajeCalorias = computed(() => {
    const obj = this.caloriasObjetivo();
    if (obj <= 0) return 0;
    return Math.min(100, (this.caloriasConsumidas() / obj) * 100);
  });

  proteinasConsumidas = computed(() => this.progresoHoy()?.proteinasConsumidas || 0);
  proteinasObjetivo = computed(() => this.progresoHoy()?.proteinasObjetivo || 120);
  porcentajeProteinas = computed(() => {
    const obj = this.proteinasObjetivo();
    if (obj <= 0) return 0;
    return Math.min(100, (this.proteinasConsumidas() / obj) * 100);
  });

  carbohidratosConsumidos = computed(() => this.progresoHoy()?.carbohidratosConsumidos || 0);
  carbohidratosObjetivo = computed(() => this.progresoHoy()?.carbohidratosObjetivo || 250);
  porcentajeCarbohidratos = computed(() => {
    const obj = this.carbohidratosObjetivo();
    if (obj <= 0) return 0;
    return Math.min(100, (this.carbohidratosConsumidos() / obj) * 100);
  });

  grasasConsumidas = computed(() => this.progresoHoy()?.grasasConsumidas || 0);
  grasasObjetivo = computed(() => this.progresoHoy()?.grasasObjetivo || 65);
  porcentajeGrasas = computed(() => {
    const obj = this.grasasObjetivo();
    if (obj <= 0) return 0;
    return Math.min(100, (this.grasasConsumidas() / obj) * 100);
  });

  // Ejercicios
  ejerciciosCompletados = computed(() => {
    const ej = this.ejerciciosHoy();
    if (!ej?.ejercicios) return 0;
    return ej.ejercicios.filter((e: any) => e.registrado).length;
  });

  ejerciciosProgramados = computed(() => {
    const ej = this.ejerciciosHoy();
    return ej?.ejercicios?.length || 0;
  });

  porcentajeEjercicios = computed(() => {
    const prog = this.ejerciciosProgramados();
    if (prog <= 0) return 0;
    return Math.min(100, (this.ejerciciosCompletados() / prog) * 100);
  });

  caloriasQuemadas = computed(() => {
    const prog = this.progresoSemanalEjercicios();
    // Usar calorías totales de la semana dividido entre días con registro
    if (prog?.caloriasQuemadasTotal && prog?.diasSemana) {
      // Calcular calorías de hoy específicamente
      const hoy = new Date().toISOString().split('T')[0];
      const diaHoy = prog.diasSemana.find(d => d.fecha === hoy);
      if (diaHoy) {
        return diaHoy.caloriasQuemadas || 0;
      }
    }
    return prog?.caloriasQuemadasTotal || 0;
  });

  // Comidas del día
  comidasCompletadas = computed(() => {
    const ph = this.progresoHoy();
    if (!ph?.comidas) return 0;
    return ph.comidas.filter((c: any) => c.registrada).length;
  });

  comidasProgramadas = computed(() => {
    const ph = this.progresoHoy();
    return ph?.comidas?.length || 0;
  });

  // Logros desbloqueados
  logrosDesbloqueados = computed(() => {
    return this.logros().filter(l => l.desbloqueado).length;
  });

  totalLogros = computed(() => this.logros().length);

  // Progreso semanal para gráfico (adaptado para el template)
  datosSemana = computed(() => {
    const prog = this.progresoSemanalComidas();
    if (!prog?.diasSemana) return this.generarDatosSemanaVacios();
    
    // Adaptar los datos de DiaNutricional al formato del template
    return prog.diasSemana.map(d => ({
      dia: d.nombreDia.substring(0, 3), // Lun, Mar, etc.
      calorias: d.caloriasConsumidas,
      objetivo: d.caloriasObjetivo,
      completado: d.diaCompleto
    }));
  });

  ngOnInit(): void {
    this.cargarDashboard();
    
    // Ocultar mensaje de bienvenida después de 5 segundos
    setTimeout(() => {
      this.showWelcome.set(false);
    }, 5000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Carga todos los datos del dashboard
   */
  cargarDashboard(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.dashboardService.cargarDashboardCompleto().subscribe({
      next: (data) => {
        // Establecer datos
        this.perfil.set(data.perfil);
        this.mediciones.set(data.mediciones);
        this.planActivo.set(data.planActivo);
        this.rutinaActiva.set(data.rutinaActiva);
        this.progresoHoy.set(data.progresoHoy);
        this.progresoPlan.set(data.progresoPlan);
        this.ejerciciosHoy.set(data.ejerciciosHoy);
        this.progresoSemanalComidas.set(data.progresoSemanalComidas);
        this.progresoSemanalEjercicios.set(data.progresoSemanalEjercicios);

        // Calcular logros con todos los datos incluyendo progresoPlan
        this.logros.set(this.dashboardService.calcularLogros(data));

        // Animar números
        this.animarNumeros();

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.hasError.set(true);
        this.errorMessage.set('No se pudo cargar el dashboard. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Anima los números del dashboard
   */
  private animarNumeros(): void {
    const duracion = 1500;
    const fps = 60;
    const pasos = duracion / (1000 / fps);
    
    const caloriasTarget = this.caloriasConsumidas();
    const proteinTarget = this.proteinasConsumidas();
    const carbsTarget = this.carbohidratosConsumidos();
    const fatTarget = this.grasasConsumidas();

    let paso = 0;
    const sub = interval(1000 / fps).subscribe(() => {
      paso++;
      const progreso = this.easeOutQuad(paso / pasos);
      
      this.animatedCalories.set(Math.round(caloriasTarget * progreso));
      this.animatedProtein.set(Math.round(proteinTarget * progreso));
      this.animatedCarbs.set(Math.round(carbsTarget * progreso));
      this.animatedFat.set(Math.round(fatTarget * progreso));

      if (paso >= pasos) {
        this.animatedCalories.set(caloriasTarget);
        this.animatedProtein.set(proteinTarget);
        this.animatedCarbs.set(carbsTarget);
        this.animatedFat.set(fatTarget);
        sub.unsubscribe();
      }
    });

    this.subscriptions.push(sub);
  }

  /**
   * Función de easing para animaciones suaves
   */
  private easeOutQuad(t: number): number {
    return t * (2 - t);
  }

  /**
   * Genera datos vacíos para la semana
   */
  private generarDatosSemanaVacios(): any[] {
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return dias.map(dia => ({
      dia,
      calorias: 0,
      objetivo: this.caloriasObjetivo(),
      completado: false
    }));
  }

  /**
   * Refrescar dashboard
   */
  refrescar(): void {
    this.cargarDashboard();
    this.notificationService.info('Dashboard actualizado', 'Los datos se han actualizado correctamente');
  }

  /**
   * Obtener color según progreso
   */
  getColorProgreso(porcentaje: number): string {
    if (porcentaje >= 100) return '#10B981'; // Verde
    if (porcentaje >= 75) return '#3B82F6';  // Azul
    if (porcentaje >= 50) return '#F59E0B';  // Amarillo
    return '#EF4444'; // Rojo
  }

  /**
   * Obtener color de fondo según progreso
   */
  getBgColorProgreso(porcentaje: number): string {
    if (porcentaje >= 100) return 'rgba(16, 185, 129, 0.1)';
    if (porcentaje >= 75) return 'rgba(59, 130, 246, 0.1)';
    if (porcentaje >= 50) return 'rgba(245, 158, 11, 0.1)';
    return 'rgba(239, 68, 68, 0.1)';
  }

  /**
   * Formatear número con separador de miles
   */
  formatNumber(num: number): string {
    return new Intl.NumberFormat('es-ES').format(Math.round(num));
  }

  /**
   * Obtener el icono del objetivo
   */
  getObjetivoIcon(objetivo: string): string {
    const iconos: Record<string, string> = {
      'PERDER_PESO': '⚖️',
      'GANAR_MASA_MUSCULAR': '💪',
      'MANTENER_FORMA': '🎯',
      'REHABILITACION': '🏥',
      'CONTROLAR_ESTRES': '🧘'
    };
    return iconos[objetivo] || '🎯';
  }

  /**
   * Obtener label del objetivo
   */
  getObjetivoLabel(objetivo: string): string {
    const labels: Record<string, string> = {
      'PERDER_PESO': 'Perder Peso',
      'GANAR_MASA_MUSCULAR': 'Ganar Masa Muscular',
      'MANTENER_FORMA': 'Mantener Forma',
      'REHABILITACION': 'Rehabilitación',
      'CONTROLAR_ESTRES': 'Controlar Estrés'
    };
    return labels[objetivo] || objetivo;
  }

  /**
   * Obtener el día de la semana actual
   */
  getDiaSemana(): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[new Date().getDay()];
  }

  /**
   * Obtener fecha formateada
   */
  getFechaFormateada(): string {
    return new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  /**
   * Calcular altura de barra del gráfico
   */
  calcularAlturaBarra(valor: number, maximo: number): number {
    if (maximo <= 0) return 0;
    return Math.min(100, (valor / maximo) * 100);
  }
}
