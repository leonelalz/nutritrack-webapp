import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-mis-comidas',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="mis-comidas-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <span class="icon">🍽️</span>
            Mis Comidas
          </h1>
          <p class="page-subtitle">Gestiona tu alimentación diaria y plan nutricional</p>
        </div>
        <button class="btn-add">
          <span class="icon">+</span>
          Registrar Comida
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">🔥</span>
            <span class="stat-label">Calorías Hoy</span>
          </div>
          <div class="stat-value">{{ caloriasHoy() }}</div>
          <div class="stat-footer">
            <span class="stat-meta">de {{ caloriasMeta() }} kcal</span>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="(caloriasHoy() / caloriasMeta()) * 100"></div>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">🥗</span>
            <span class="stat-label">Comidas Registradas</span>
          </div>
          <div class="stat-value">{{ comidasRegistradas() }}</div>
          <div class="stat-footer">
            <span class="stat-meta">4/5 comidas programadas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">💧</span>
            <span class="stat-label">Hidratación</span>
          </div>
          <div class="stat-value">{{ hidratacion() }}L</div>
          <div class="stat-footer">
            <span class="stat-meta">de 2.5L objetivo</span>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="(hidratacion() / 2.5) * 100"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-grid">
        <!-- Today's Meals -->
        <div class="content-card">
          <div class="card-header">
            <h2>Comidas de Hoy</h2>
            <span class="date">{{ fechaHoy }}</span>
          </div>
          <div class="card-content">
            @if (comidasHoy().length === 0) {
              <div class="empty-state">
                <span class="empty-icon">🍽️</span>
                <p>No has registrado comidas hoy</p>
                <button class="btn-secondary">Registrar Primera Comida</button>
              </div>
            } @else {
              <div class="meals-list">
                @for (comida of comidasHoy(); track comida.id) {
                  <div class="meal-item">
                    <div class="meal-time">
                      <span class="time">{{ comida.hora }}</span>
                      <span class="type-badge">{{ comida.tipo }}</span>
                    </div>
                    <div class="meal-info">
                      <h4>{{ comida.nombre }}</h4>
                      <div class="meal-nutrients">
                        <span class="nutrient">{{ comida.calorias }} kcal</span>
                        <span class="nutrient">P: {{ comida.proteinas }}g</span>
                        <span class="nutrient">C: {{ comida.carbohidratos }}g</span>
                        <span class="nutrient">G: {{ comida.grasas }}g</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Nutrition Plan -->
        <div class="content-card">
          <div class="card-header">
            <h2>Plan Nutricional Activo</h2>
            <a [routerLink]="['/metas']" class="link-see-all">Ver Todo</a>
          </div>
          <div class="card-content">
            @if (planActivo()) {
              <div class="plan-info">
                <div class="plan-header">
                  <h3>{{ planActivo().nombre }}</h3>
                  <span class="plan-badge">Activo</span>
                </div>
                <p class="plan-description">{{ planActivo().descripcion }}</p>
                <div class="plan-stats">
                  <div class="plan-stat">
                    <span class="label">Duración:</span>
                    <span class="value">{{ planActivo().duracion }} días</span>
                  </div>
                  <div class="plan-stat">
                    <span class="label">Progreso:</span>
                    <span class="value">Día {{ planActivo().diaActual }}/{{ planActivo().duracion }}</span>
                  </div>
                </div>
                <div class="plan-macros">
                  <h4>Objetivos Diarios</h4>
                  <div class="macro-grid">
                    <div class="macro-item">
                      <span class="macro-label">Calorías</span>
                      <span class="macro-value">{{ planActivo().caloriasObjetivo }} kcal</span>
                    </div>
                    <div class="macro-item">
                      <span class="macro-label">Proteínas</span>
                      <span class="macro-value">{{ planActivo().proteinasObjetivo }}g</span>
                    </div>
                    <div class="macro-item">
                      <span class="macro-label">Carbohidratos</span>
                      <span class="macro-value">{{ planActivo().carbohidratosObjetivo }}g</span>
                    </div>
                    <div class="macro-item">
                      <span class="macro-label">Grasas</span>
                      <span class="macro-value">{{ planActivo().grasasObjetivo }}g</span>
                    </div>
                  </div>
                </div>
              </div>
            } @else {
              <div class="empty-state">
                <span class="empty-icon">📋</span>
                <p>No tienes un plan nutricional activo</p>
                <button class="btn-secondary" [routerLink]="['/metas/planes']">Explorar Planes</button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .mis-comidas-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .header-content {
      flex: 1;
    }

    .page-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #2d3748;
    }

    .page-title .icon {
      font-size: 2.5rem;
    }

    .page-subtitle {
      margin: 0;
      color: #718096;
      font-size: 1.1rem;
    }

    .btn-add {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(72, 187, 120, 0.3);
    }

    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(72, 187, 120, 0.4);
    }

    .btn-add .icon {
      font-size: 1.25rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .stat-icon {
      font-size: 1.75rem;
    }

    .stat-label {
      color: #718096;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    .stat-footer {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-meta {
      color: #a0aec0;
      font-size: 0.875rem;
    }

    .progress-bar {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
      transition: width 0.3s ease;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 1.5rem;
    }

    .content-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #2d3748;
    }

    .date {
      color: #718096;
      font-size: 0.95rem;
    }

    .link-see-all {
      color: #48bb78;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }

    .link-see-all:hover {
      color: #38a169;
    }

    .card-content {
      padding: 1.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: #a0aec0;
    }

    .empty-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 0 0 1.5rem 0;
      font-size: 1.1rem;
    }

    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: #edf2f7;
      color: #4a5568;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
      transform: translateY(-2px);
    }

    .meals-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .meal-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
      border-left: 4px solid #48bb78;
    }

    .meal-time {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 80px;
    }

    .time {
      font-weight: 700;
      color: #2d3748;
    }

    .type-badge {
      padding: 0.25rem 0.5rem;
      background: #48bb78;
      color: white;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-align: center;
    }

    .meal-info {
      flex: 1;
    }

    .meal-info h4 {
      margin: 0 0 0.5rem 0;
      color: #2d3748;
      font-size: 1.1rem;
    }

    .meal-nutrients {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .nutrient {
      padding: 0.25rem 0.75rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-size: 0.875rem;
      color: #4a5568;
    }

    .plan-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 1rem;
    }

    .plan-header h3 {
      margin: 0;
      color: #2d3748;
      font-size: 1.25rem;
    }

    .plan-badge {
      padding: 0.25rem 0.75rem;
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .plan-description {
      margin: 0;
      color: #718096;
      line-height: 1.6;
    }

    .plan-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
    }

    .plan-stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .plan-stat .label {
      color: #718096;
      font-size: 0.875rem;
    }

    .plan-stat .value {
      color: #2d3748;
      font-weight: 700;
    }

    .plan-macros h4 {
      margin: 0 0 1rem 0;
      color: #2d3748;
      font-size: 1rem;
    }

    .macro-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .macro-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.75rem;
      background: #f7fafc;
      border-radius: 6px;
    }

    .macro-label {
      color: #718096;
      font-size: 0.875rem;
    }

    .macro-value {
      color: #2d3748;
      font-weight: 700;
    }

    @media (max-width: 768px) {
      .mis-comidas-container {
        padding: 1rem;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MisComidasComponent implements OnInit {
    fechaHoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Mock data - replace with API calls
    caloriasHoy = signal(1450);
    caloriasMeta = signal(2200);
    comidasRegistradas = signal(3);
    hidratacion = signal(1.8);

    comidasHoy = signal([
        { id: 1, hora: '08:00', tipo: 'Desayuno', nombre: 'Avena con frutas', calorias: 350, proteinas: 12, carbohidratos: 55, grasas: 8 },
        { id: 2, hora: '12:30', tipo: 'Almuerzo', nombre: 'Pollo con arroz integral', calorias: 650, proteinas: 45, carbohidratos: 60, grasas: 15 },
        { id: 3, hora: '16:00', tipo: 'Snack', nombre: 'Yogurt con nueces', calorias: 450, proteinas: 15, carbohidratos: 30, grasas: 12 }
    ]);

    planActivo = signal({
        nombre: 'Plan de Pérdida de Peso',
        descripcion: 'Plan balanceado para pérdida de peso saludable',
        duracion: 30,
        diaActual: 5,
        caloriasObjetivo: 2200,
        proteinasObjetivo: 110,
        carbohidratosObjetivo: 220,
        grasasObjetivo: 75
    });

    ngOnInit(): void {
        // TODO: Load data from API
        this.loadComidasHoy();
        this.loadPlanActivo();
    }

    loadComidasHoy(): void {
        // TODO: Implement API call
    }

    loadPlanActivo(): void {
        // TODO: Implement API call
    }
}
