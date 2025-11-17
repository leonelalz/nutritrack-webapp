// src/app/features/ejercicios/pages/ejercicios-list.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { EjercicioService } from '../../../core/services/ejercicio.service';
import { EtiquetaService } from '../../../core/services/etiqueta.service';
import {
  Ejercicio,
  TipoEjercicio,
  GrupoMuscular,
  NivelDificultad,
  TIPO_EJERCICIO_LABELS,
  GRUPO_MUSCULAR_LABELS,
  NIVEL_DIFICULTAD_LABELS,
  TIPO_EJERCICIO_ICONS
} from '../../../core/models/ejercicio.model';
import { Etiqueta, ApiResponse, PageResponse } from '../../../core/models/etiqueta.model';

@Component({
  selector: 'app-ejercicios-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ejercicios-container">
      <h1>Gestión de Ejercicios</h1>
      <p>US-08: Administración de ejercicios del catálogo</p>
      
      <!-- Aquí va tu diseño de Figma -->
      <div class="content">
        <p>Total de ejercicios: {{ totalElements }}</p>
        <p>Cargando: {{ loading() }}</p>
        
        <!-- Lista temporal -->
        <ul>
          @for (ejercicio of ejercicios(); track ejercicio.id) {
            <li>
              {{ getTipoIcon(ejercicio.tipoEjercicio) }}
              {{ ejercicio.nombre }}
              ({{ getTipoLabel(ejercicio.tipoEjercicio) }} - 
              {{ getGrupoLabel(ejercicio.grupoMuscular) }} - 
              {{ getNivelLabel(ejercicio.nivelDificultad) }})
              - Etiquetas: {{ ejercicio.etiquetas.length }}
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .ejercicios-container {
      padding: 20px;
    }
  `]
})
export class EjerciciosListComponent implements OnInit {
  private ejercicioService = inject(EjercicioService);
  private etiquetaService = inject(EtiquetaService);

  // Signals
  loading = signal(false);
  ejercicios = signal<Ejercicio[]>([]);
  etiquetasDisponibles = signal<Etiqueta[]>([]);
  
  // Paginación
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;
  
  // Búsqueda y filtros
  searchTerm = '';
  tipoFiltro: TipoEjercicio | '' = '';
  grupoFiltro: GrupoMuscular | '' = '';
  nivelFiltro: NivelDificultad | '' = '';
  searchTimeout: any;
  
  // Modal
  mostrarModal = false;
  ejercicioEditando: Ejercicio | null = null;
  
  // Confirmación
  mostrarConfirmacion = false;
  ejercicioAEliminar: Ejercicio | null = null;
  
  // Formulario
  formulario = {
    nombre: '',
    descripcion: '',
    tipoEjercicio: '' as TipoEjercicio | '',
    grupoMuscular: '' as GrupoMuscular | '',
    nivelDificultad: '' as NivelDificultad | '',
    caloriasQuemadasPorMinuto: 0,
    duracionEstimadaMinutos: 0,
    equipoNecesario: '',
    etiquetaIds: [] as number[]
  };
  
  // Estados
  guardando = false;
  eliminando = false;
  
  // Listas para selects
  tiposEjercicio = Object.values(TipoEjercicio);
  gruposMusculares = Object.values(GrupoMuscular);
  nivelesDificultad = Object.values(NivelDificultad);

  ngOnInit(): void {
    this.cargarEjercicios();
    this.cargarEtiquetas();
  }

  /**
   * Carga la lista de ejercicios
   */
  cargarEjercicios(): void {
    this.loading.set(true);
    
    let request: Observable<ApiResponse<PageResponse<Ejercicio>>>;
    
    if (this.searchTerm) {
      request = this.ejercicioService.buscarPorNombre(this.searchTerm, this.currentPage, this.pageSize);
    } else if (this.tipoFiltro || this.grupoFiltro || this.nivelFiltro) {
      request = this.ejercicioService.filtrarEjercicios(
        this.tipoFiltro || undefined,
        this.grupoFiltro || undefined,
        this.nivelFiltro || undefined,
        this.currentPage,
        this.pageSize
      );
    } else {
      request = this.ejercicioService.listar(this.currentPage, this.pageSize);
    }
    
    request.subscribe({
      next: (response) => {
        this.ejercicios.set(response.data.content);
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar ejercicios:', error);
        this.mostrarError('Error al cargar ejercicios');
        this.loading.set(false);
      }
    });
  }

  /**
   * Carga las etiquetas disponibles
   */
  cargarEtiquetas(): void {
    this.etiquetaService.listar(0, 1000).subscribe({
      next: (response) => {
        this.etiquetasDisponibles.set(response.data.content);
      },
      error: (error) => {
        console.error('Error al cargar etiquetas:', error);
      }
    });
  }

  /**
   * Búsqueda con debounce
   */
  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 0;
      this.cargarEjercicios();
    }, 500);
  }

  /**
   * Aplicar filtros
   */
  aplicarFiltros(): void {
    this.currentPage = 0;
    this.cargarEjercicios();
  }

  /**
   * Limpiar filtros
   */
  limpiarFiltros(): void {
    this.tipoFiltro = '';
    this.grupoFiltro = '';
    this.nivelFiltro = '';
    this.searchTerm = '';
    this.currentPage = 0;
    this.cargarEjercicios();
  }

  /**
   * Cambiar página
   */
  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.cargarEjercicios();
    }
  }

  /**
   * Abre el modal para crear
   */
  abrirModalCrear(): void {
    this.ejercicioEditando = null;
    this.formulario = {
      nombre: '',
      descripcion: '',
      tipoEjercicio: '',
      grupoMuscular: '',
      nivelDificultad: '',
      caloriasQuemadasPorMinuto: 0,
      duracionEstimadaMinutos: 0,
      equipoNecesario: '',
      etiquetaIds: []
    };
    this.mostrarModal = true;
  }

  /**
   * Abre el modal para editar
   */
  abrirModalEditar(ejercicio: Ejercicio): void {
    this.ejercicioEditando = ejercicio;
    this.formulario = {
      nombre: ejercicio.nombre,
      descripcion: ejercicio.descripcion || '',
      tipoEjercicio: ejercicio.tipoEjercicio,
      grupoMuscular: ejercicio.grupoMuscular,
      nivelDificultad: ejercicio.nivelDificultad,
      caloriasQuemadasPorMinuto: ejercicio.caloriasQuemadasPorMinuto || 0,
      duracionEstimadaMinutos: ejercicio.duracionEstimadaMinutos || 0,
      equipoNecesario: ejercicio.equipoNecesario || '',
      etiquetaIds: ejercicio.etiquetas.map(e => e.id)
    };
    this.mostrarModal = true;
  }

  /**
   * Cierra el modal
   */
  cerrarModal(): void {
    this.mostrarModal = false;
    this.ejercicioEditando = null;
  }

  /**
   * Guarda un ejercicio
   */
  guardar(): void {
    if (!this.formulario.nombre || !this.formulario.tipoEjercicio || 
        !this.formulario.grupoMuscular || !this.formulario.nivelDificultad) {
      this.mostrarError('Por favor completa los campos obligatorios');
      return;
    }

    this.guardando = true;
    const request = {
      nombre: this.formulario.nombre.trim(),
      descripcion: this.formulario.descripcion?.trim() || undefined,
      tipoEjercicio: this.formulario.tipoEjercicio as TipoEjercicio,
      grupoMuscular: this.formulario.grupoMuscular as GrupoMuscular,
      nivelDificultad: this.formulario.nivelDificultad as NivelDificultad,
      caloriasQuemadasPorMinuto: this.formulario.caloriasQuemadasPorMinuto || undefined,
      duracionEstimadaMinutos: this.formulario.duracionEstimadaMinutos || undefined,
      equipoNecesario: this.formulario.equipoNecesario?.trim() || undefined,
      etiquetaIds: this.formulario.etiquetaIds.length > 0 ? this.formulario.etiquetaIds : undefined
    };

    const observable = this.ejercicioEditando
      ? this.ejercicioService.actualizar(this.ejercicioEditando.id, request)
      : this.ejercicioService.crear(request);

    observable.subscribe({
      next: (response) => {
        this.mostrarExito(response.message);
        this.cerrarModal();
        this.cargarEjercicios();
        this.guardando = false;
      },
      error: (error) => {
        console.error('Error al guardar:', error);
        this.mostrarError(error.error?.message || 'Error al guardar el ejercicio');
        this.guardando = false;
      }
    });
  }

  /**
   * Confirmar eliminación
   */
  confirmarEliminar(ejercicio: Ejercicio): void {
    this.ejercicioAEliminar = ejercicio;
    this.mostrarConfirmacion = true;
  }

  /**
   * Cerrar confirmación
   */
  cerrarConfirmacion(): void {
    this.mostrarConfirmacion = false;
    this.ejercicioAEliminar = null;
  }

  /**
   * Eliminar ejercicio
   */
  eliminar(): void {
    if (!this.ejercicioAEliminar) return;

    this.eliminando = true;
    this.ejercicioService.eliminar(this.ejercicioAEliminar.id).subscribe({
      next: (response) => {
        this.mostrarExito(response.message);
        this.cerrarConfirmacion();
        this.cargarEjercicios();
        this.eliminando = false;
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
        this.mostrarError(error.error?.message || 'Error al eliminar el ejercicio');
        this.eliminando = false;
      }
    });
  }

  /**
   * Toggle etiqueta
   */
  toggleEtiqueta(etiquetaId: number): void {
    const index = this.formulario.etiquetaIds.indexOf(etiquetaId);
    if (index > -1) {
      this.formulario.etiquetaIds.splice(index, 1);
    } else {
      this.formulario.etiquetaIds.push(etiquetaId);
    }
  }

  /**
   * Verifica si una etiqueta está seleccionada
   */
  isEtiquetaSeleccionada(etiquetaId: number): boolean {
    return this.formulario.etiquetaIds.includes(etiquetaId);
  }

  /**
   * Obtiene el label del tipo
   */
  getTipoLabel(tipo: TipoEjercicio): string {
    return TIPO_EJERCICIO_LABELS[tipo];
  }

  /**
   * Obtiene el label del grupo muscular
   */
  getGrupoLabel(grupo: GrupoMuscular): string {
    return GRUPO_MUSCULAR_LABELS[grupo];
  }

  /**
   * Obtiene el label del nivel
   */
  getNivelLabel(nivel: NivelDificultad): string {
    return NIVEL_DIFICULTAD_LABELS[nivel];
  }

  /**
   * Obtiene el icono del tipo
   */
  getTipoIcon(tipo: TipoEjercicio): string {
    return TIPO_EJERCICIO_ICONS[tipo];
  }

  /**
   * Muestra mensaje de éxito
   */
  private mostrarExito(mensaje: string): void {
    alert(mensaje);
  }

  /**
   * Muestra mensaje de error
   */
  private mostrarError(mensaje: string): void {
    alert(mensaje);
  }
}