import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PerfilService } from '../services/perfil.service';
import { EtiquetaService } from '../services/etiqueta.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  EtiquetaResponse,
  PerfilSaludRequest,
  PerfilSaludResponse,
  Genero,
  TipoEtiqueta
} from '../../../shared/models/perfil.model';

@Component({
  selector: 'app-perfil-salud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="perfil-salud-container">
      <div class="card">
        <div class="card-header">
          <h2>Perfil de Salud</h2>
          <p>Configura tu información de salud, alergias y objetivos</p>
        </div>

        <div class="card-body">
          @if (loading()) {
            <div class="loading-spinner">
              <div class="spinner"></div>
              <p>Cargando perfil...</p>
            </div>
          } @else {
            <form [formGroup]="perfilForm" (ngSubmit)="guardar()">
              <!-- Información Personal -->
              <div class="form-section">
                <h3>Información Personal</h3>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="fechaNacimiento">Fecha de Nacimiento</label>
                    <input 
                      type="date" 
                      id="fechaNacimiento"
                      formControlName="fechaNacimiento"
                      class="form-control"
                    />
                  </div>

                  <div class="form-group">
                    <label for="genero">Género</label>
                    <select id="genero" formControlName="genero" class="form-control">
                      <option value="">Seleccionar...</option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMENINO">Femenino</option>
                      <option value="OTRO">Otro</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Medidas -->
              <div class="form-section">
                <h3>Medidas</h3>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="altura">Altura (cm)</label>
                    <input 
                      type="number" 
                      id="altura"
                      formControlName="altura"
                      class="form-control"
                      placeholder="Ej: 170"
                      min="50"
                      max="300"
                    />
                    @if (perfilForm.get('altura')?.hasError('min')) {
                      <span class="error">Altura mínima: 50 cm</span>
                    }
                    @if (perfilForm.get('altura')?.hasError('max')) {
                      <span class="error">Altura máxima: 300 cm</span>
                    }
                  </div>

                  <div class="form-group">
                    <label for="pesoActual">Peso Actual ({{ unidadPeso() }})</label>
                    <input 
                      type="number" 
                      id="pesoActual"
                      formControlName="pesoActual"
                      class="form-control"
                      placeholder="Ej: 70"
                      min="20"
                      max="600"
                      step="0.1"
                    />
                  </div>

                  <div class="form-group">
                    <label for="pesoObjetivo">Peso Objetivo ({{ unidadPeso() }})</label>
                    <input 
                      type="number" 
                      id="pesoObjetivo"
                      formControlName="pesoObjetivo"
                      class="form-control"
                      placeholder="Ej: 65"
                      min="20"
                      max="600"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              <!-- Objetivo Actual -->
              <div class="form-section">
                <h3>Objetivo</h3>
                <div class="form-group">
                  <label for="objetivoActual">Describe tu objetivo actual</label>
                  <textarea 
                    id="objetivoActual"
                    formControlName="objetivoActual"
                    class="form-control"
                    rows="3"
                    placeholder="Ej: Quiero perder peso gradualmente y ganar masa muscular"
                  ></textarea>
                </div>
              </div>

              <!-- Alergias -->
              <div class="form-section">
                <h3>Alergias Alimentarias ⚠️</h3>
                <p class="section-description">
                  Selecciona tus alergias para que el sistema filtre planes incompatibles
                </p>
                
                @if (etiquetasAlergias().length > 0) {
                  <div class="etiquetas-grid">
                    @for (alergia of etiquetasAlergias(); track alergia.id) {
                      <label class="etiqueta-checkbox">
                        <input 
                          type="checkbox"
                          [value]="alergia.id"
                          [checked]="isAlergiaSeleccionada(alergia.id)"
                          (change)="toggleAlergia(alergia.id)"
                        />
                        <span class="etiqueta-label">{{ alergia.nombre }}</span>
                      </label>
                    }
                  </div>
                } @else {
                  <p class="no-data">No hay alergias disponibles</p>
                }
              </div>

              <!-- Condiciones Médicas -->
              <div class="form-section">
                <h3>Condiciones de Salud</h3>
                <p class="section-description">
                  Selecciona condiciones que puedan afectar tu plan nutricional
                </p>
                
                @if (etiquetasCondiciones().length > 0) {
                  <div class="etiquetas-grid">
                    @for (condicion of etiquetasCondiciones(); track condicion.id) {
                      <label class="etiqueta-checkbox">
                        <input 
                          type="checkbox"
                          [value]="condicion.id"
                          [checked]="isCondicionSeleccionada(condicion.id)"
                          (change)="toggleCondicion(condicion.id)"
                        />
                        <span class="etiqueta-label">{{ condicion.nombre }}</span>
                      </label>
                    }
                  </div>
                } @else {
                  <p class="no-data">No hay condiciones disponibles</p>
                }
              </div>

              <!-- Botones -->
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" (click)="cancelar()">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="saving() || !perfilForm.valid">
                  @if (saving()) {
                    <span class="spinner-small"></span>
                    Guardando...
                  } @else {
                    Guardar Perfil
                  }
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .perfil-salud-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
    }

    .card-header h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
    }

    .card-header p {
      margin: 0;
      opacity: 0.9;
    }

    .card-body {
      padding: 2rem;
    }

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-section h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .section-description {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #444;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .error {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .etiquetas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
    }

    .etiqueta-checkbox {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .etiqueta-checkbox:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .etiqueta-checkbox input[type="checkbox"] {
      margin-right: 0.5rem;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .etiqueta-checkbox input[type="checkbox"]:checked + .etiqueta-label {
      font-weight: 600;
      color: #667eea;
    }

    .etiqueta-label {
      flex: 1;
    }

    .no-data {
      text-align: center;
      color: #999;
      padding: 2rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #666;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .loading-spinner {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    .spinner-small {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff80;
      border-top: 2px solid #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class PerfilSaludComponent implements OnInit {
  private fb = inject(FormBuilder);
  private perfilService = inject(PerfilService);
  private etiquetaService = inject(EtiquetaService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  perfilForm!: FormGroup;
  loading = signal(true);
  saving = signal(false);
  
  etiquetasAlergias = signal<EtiquetaResponse[]>([]);
  etiquetasCondiciones = signal<EtiquetaResponse[]>([]);
  
  alergiasSeleccionadas = signal<number[]>([]);
  condicionesSeleccionadas = signal<number[]>([]);
  
  unidadPeso = signal('KG');

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarDatos();
  }

  private inicializarFormulario(): void {
    this.perfilForm = this.fb.group({
      altura: ['', [Validators.min(50), Validators.max(300)]],
      pesoActual: ['', [Validators.min(20), Validators.max(600)]],
      pesoObjetivo: ['', [Validators.min(20), Validators.max(600)]],
      fechaNacimiento: [''],
      genero: [''],
      objetivoActual: ['', [Validators.maxLength(500)]]
    });
  }

  private cargarDatos(): void {
    Promise.all([
      this.cargarEtiquetas(),
      this.cargarPerfilActual()
    ]).finally(() => {
      this.loading.set(false);
    });
  }

  private async cargarEtiquetas(): Promise<void> {
    try {
      const [alergias, condiciones] = await Promise.all([
        this.etiquetaService.obtenerPorTipo(TipoEtiqueta.ALERGIA).toPromise(),
        this.etiquetaService.obtenerPorTipo(TipoEtiqueta.CONDICION).toPromise()
      ]);
      
      this.etiquetasAlergias.set(alergias || []);
      this.etiquetasCondiciones.set(condiciones || []);
    } catch (error) {
      console.error('Error al cargar etiquetas:', error);
      this.notificationService.showError('Error al cargar etiquetas');
    }
  }

  private async cargarPerfilActual(): Promise<void> {
    try {
      const perfil = await this.perfilService.obtenerPerfil().toPromise();
      if (perfil) {
        this.unidadPeso.set(perfil.unidadesMedida);
        
        this.perfilForm.patchValue({
          altura: perfil.altura,
          pesoActual: perfil.pesoActual,
          pesoObjetivo: perfil.pesoObjetivo,
          fechaNacimiento: perfil.fechaNacimiento,
          genero: perfil.genero,
          objetivoActual: perfil.objetivoActual
        });

        // Pre-seleccionar etiquetas
        const alergias = perfil.etiquetasSalud
          .filter(e => e.tipo === TipoEtiqueta.ALERGIA)
          .map(e => e.id);
        this.alergiasSeleccionadas.set(alergias);

        const condiciones = perfil.etiquetasSalud
          .filter(e => e.tipo === TipoEtiqueta.CONDICION)
          .map(e => e.id);
        this.condicionesSeleccionadas.set(condiciones);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  }

  toggleAlergia(id: number): void {
    const alergias = this.alergiasSeleccionadas();
    if (alergias.includes(id)) {
      this.alergiasSeleccionadas.set(alergias.filter(a => a !== id));
    } else {
      this.alergiasSeleccionadas.set([...alergias, id]);
    }
  }

  toggleCondicion(id: number): void {
    const condiciones = this.condicionesSeleccionadas();
    if (condiciones.includes(id)) {
      this.condicionesSeleccionadas.set(condiciones.filter(c => c !== id));
    } else {
      this.condicionesSeleccionadas.set([...condiciones, id]);
    }
  }

  isAlergiaSeleccionada(id: number): boolean {
    return this.alergiasSeleccionadas().includes(id);
  }

  isCondicionSeleccionada(id: number): boolean {
    return this.condicionesSeleccionadas().includes(id);
  }

  guardar(): void {
    if (this.perfilForm.invalid) {
      this.notificationService.showWarning('Por favor completa el formulario correctamente');
      return;
    }

    this.saving.set(true);

    const etiquetaIds = [
      ...this.alergiasSeleccionadas(),
      ...this.condicionesSeleccionadas()
    ];

    const request: PerfilSaludRequest = {
      ...this.perfilForm.value,
      etiquetaSaludIds: etiquetaIds
    };

    this.perfilService.actualizarPerfilSalud(request).subscribe({
      next: () => {
        this.notificationService.showSuccess('Perfil de salud actualizado correctamente');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error al actualizar perfil:', error);
        this.notificationService.showError('Error al actualizar perfil');
        this.saving.set(false);
      },
      complete: () => {
        this.saving.set(false);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/dashboard']);
  }
}
