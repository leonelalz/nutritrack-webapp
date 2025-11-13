import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing-container">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="navbar-content">
          <div class="logo">
            <span class="logo-text"><span class="logo-green">Nutri</span><span class="logo-gray">Track</span></span>
          </div>
          <div class="nav-links">
            <a href="#inicio" class="nav-link active">Inicio</a>
            <a href="#caracteristicas" class="nav-link">Características</a>
            <a href="#planes" class="nav-link">Planes</a>
            <a href="#contacto" class="nav-link">Contacto</a>
          </div>
          <div class="nav-buttons">
            <a routerLink="/register" class="btn-cta-nav">Comenzar Gratis</a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero" id="inicio">
        <div class="hero-background"></div>
        <div class="hero-container">
          <div class="hero-content">
            <h1 class="hero-title">
              Transforma tu<br>
              alimentación con<br>
              inteligencia
            </h1>
            <p class="hero-subtitle">
              NutriTrack te ayuda a alcanzar tus objetivos nutricionales de manera simple y efectiva. 
              Registra tus comidas, analiza tus macronutrientes y mejora tu salud día a día.
            </p>
            <div class="hero-buttons">
              <a routerLink="/register" class="btn btn-primary">
                <span>📱</span>
                <span>Comenzar Ahora</span>
              </a>
              <a href="#demo" class="btn btn-secondary">
                <span>▶</span>
                <span>Ver Demo</span>
              </a>
            </div>
          </div>
          
          <div class="hero-card">
            <div class="card-header">
              <h3>Resumen Diario</h3>
              <span class="progress-badge">78% Completado</span>
            </div>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number green">1,847</div>
                <div class="stat-label">Calorías</div>
              </div>
              <div class="stat-card">
                <div class="stat-number green">92g</div>
                <div class="stat-label">Proteína</div>
              </div>
              <div class="stat-card">
                <div class="stat-number green">180g</div>
                <div class="stat-label">Carbos</div>
              </div>
              <div class="stat-card">
                <div class="stat-number green">65g</div>
                <div class="stat-label">Grasas</div>
              </div>
            </div>
            
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features" id="caracteristicas">
        <div class="section-header">
          <h2 class="section-title">Todo lo que necesitas para una nutrición inteligente</h2>
          <p class="section-subtitle">
            Herramientas poderosas y fáciles de usar que te ayudarán a tomar el control de tu alimentación
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Registro Intuitivo</h3>
            <p>Registra tus comidas de manera rápida y sencilla. Nuestra base de datos contiene miles de alimentos con información nutricional precisa.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Análisis Detallado</h3>
            <p>Visualiza tu progreso con gráficos interactivos. Analiza macronutrientes, micronutrientes y tendencias de consumo.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Metas Personalizadas</h3>
            <p>Establece objetivos personalizados basados en tu estilo de vida, edad, peso y objetivos de salud específicos.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🏷️</div>
            <h3>Categorización Inteligente</h3>
            <p>Clasifica automáticamente tus alimentos por categorías y etiquetas para un análisis más profundo de tu dieta.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3>Reportes Avanzados</h3>
            <p>Genera reportes detallados de tu progreso nutricional con insights accionables para mejorar tu alimentación.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⏰</div>
            <h3>Seguimiento por Horarios</h3>
            <p>Organiza tus comidas por desayuno, almuerzo, snacks y cena para un control completo de tu día alimentario.</p>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-number-large">50K+</div>
            <div class="stat-label-large">Usuarios Activos</div>
          </div>
          <div class="stat-item">
            <div class="stat-number-large">1M+</div>
            <div class="stat-label-large">Comidas Registradas</div>
          </div>
          <div class="stat-item">
            <div class="stat-number-large">15K+</div>
            <div class="stat-label-large">Alimentos en Base de Datos</div>
          </div>
          <div class="stat-item">
            <div class="stat-number-large">4.8★</div>
            <div class="stat-label-large">Calificación Promedio</div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section" id="planes">
        <div class="cta-content">
          <h2 class="cta-title">¿Listo para transformar tu alimentación?</h2>
          <p class="cta-subtitle">Únete a miles de usuarios que ya están mejorando su salud con NutriTrack</p>
          <a routerLink="/register" class="btn btn-cta-large">
            <span>Comenzar mi Viaje Nutricional</span>
            <span>→</span>
          </a>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer" id="contacto">
        <div class="footer-content">
          <div class="footer-column">
            <h4 class="footer-brand">NutriTrack</h4>
            <p class="footer-description">Tu compañero inteligente en nutrición para una vida más saludable.</p>
            <div class="social-icons">
              <a href="#" class="social-icon">📘</a>
              <a href="#" class="social-icon">🐦</a>
              <a href="#" class="social-icon">📷</a>
            </div>
          </div>
          
          <div class="footer-column">
            <h5>Producto</h5>
            <a href="#">Características</a>
            <a href="#">Planes y Precios</a>
            <a href="#">Aplicación Móvil</a>
            <a href="#">API</a>
          </div>
          
          <div class="footer-column">
            <h5>Soporte</h5>
            <a href="#">Centro de Ayuda</a>
            <a href="#">Contacto</a>
            <a href="#">Documentación</a>
            <a href="#">Estado del Sistema</a>
          </div>
          
          <div class="footer-column">
            <h5>Empresa</h5>
            <a href="#">Acerca de</a>
            <a href="#">Blog</a>
            <a href="#">Carreras</a>
            <a href="#">Privacidad</a>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>© 2024 NutriTrack. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .landing-container {
      min-height: 100vh;
      background: #fff;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    /* Navbar */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(5px);
      border-bottom: 1px solid rgba(226, 232, 240, 0.5);
      z-index: 1000;
      padding: 16px 0;
    }

    .navbar-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 48px;
    }

    .logo-text {
      font-size: 24px;
      font-weight: 700;
      line-height: 1.6;
    }

    .logo-green {
      color: #16A34A;
    }

    .logo-gray {
      color: #64748B;
    }

    .nav-links {
      display: flex;
      gap: 32px;
      align-items: center;
      flex: 1;
      justify-content: center;
    }

    .nav-link {
      color: #64748B;
      text-decoration: none;
      font-size: 16px;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .nav-link.active {
      color: #16A34A;
    }

    .nav-link:hover {
      color: #16A34A;
    }

    .btn-cta-nav {
      background: linear-gradient(164deg, #16A34A 0%, #22C55E 100%);
      color: white;
      padding: 14px 24px;
      border-radius: 50px;
      text-decoration: none;
      font-size: 16px;
      font-weight: 700;
      box-shadow: 0px 4px 15px rgba(22, 163, 74, 0.3);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .btn-cta-nav:hover {
      transform: translateY(-2px);
      box-shadow: 0px 8px 20px rgba(22, 163, 74, 0.4);
    }

    /* Hero Section */
    .hero {
      position: relative;
      padding: 150px 32px 80px;
      background: linear-gradient(148deg, #F8FAFC 0%, #E2E8F0 100%);
      overflow: hidden;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse 70% 70% at 50% 50%, rgba(22, 163, 74, 0.1) 0%, rgba(22, 163, 74, 0) 70%);
      pointer-events: none;
    }

    .hero-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: center;
      position: relative;
    }

    .hero-title {
      font-size: 56px;
      font-weight: 700;
      line-height: 1.2;
      color: #1E293B;
      margin-bottom: 24px;
    }

    .hero-subtitle {
      font-size: 20px;
      line-height: 1.6;
      color: #64748B;
      margin-bottom: 32px;
    }

    .hero-buttons {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 18px 32px;
      border-radius: 50px;
      text-decoration: none;
      font-size: 16px;
      font-weight: 700;
      transition: all 0.3s ease;
      cursor: pointer;
      border: 2px solid transparent;
    }

    .btn-primary {
      background: linear-gradient(164deg, #16A34A 0%, #22C55E 100%);
      color: white;
      box-shadow: 0px 4px 15px rgba(22, 163, 74, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0px 8px 20px rgba(22, 163, 74, 0.4);
    }

    .btn-secondary {
      background: white;
      color: #1E293B;
      border: 2px solid #E2E8F0;
    }

    .btn-secondary:hover {
      border-color: #16A34A;
      color: #16A34A;
    }

    /* Hero Card */
    .hero-card {
      background: white;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0px 25px 60px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px solid #E2E8F0;
      margin-bottom: 24px;
    }

    .card-header h3 {
      font-size: 20px;
      font-weight: 700;
      color: #1E293B;
    }

    .progress-badge {
      font-size: 12px;
      font-weight: 700;
      color: #16A34A;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: #F8FAFC;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }

    .stat-number {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .stat-number.green {
      color: #16A34A;
    }

    .stat-label {
      font-size: 12px;
      color: #64748B;
    }

    .progress-bar {
      height: 60px;
      background: linear-gradient(167deg, #16A34A 0%, #22C55E 100%);
      border-radius: 12px;
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60%;
      background: linear-gradient(172deg, #F9EA16 0%, #FBBF24 100%);
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }

    /* Features Section */
    .features {
      padding: 96px 32px;
      background: white;
    }

    .section-header {
      text-align: center;
      max-width: 1000px;
      margin: 0 auto 64px;
    }

    .section-title {
      font-size: 40px;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 16px;
      line-height: 1.6;
    }

    .section-subtitle {
      font-size: 20px;
      color: #64748B;
      line-height: 1.6;
    }

    .features-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 32px;
    }

    .feature-card {
      background: white;
      border: 1px solid #E2E8F0;
      border-radius: 20px;
      padding: 40px 32px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border-color: #16A34A;
    }

    .feature-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #16A34A 0%, #22C55E 100%);
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin: 0 auto 24px;
    }

    .feature-card h3 {
      font-size: 20px;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 12px;
    }

    .feature-card p {
      font-size: 16px;
      color: #64748B;
      line-height: 1.6;
    }

    /* Stats Section */
    .stats-section {
      padding: 64px 32px;
      background: linear-gradient(169deg, #16A34A 0%, #22C55E 100%);
    }

    .stats-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 48px;
      text-align: center;
    }

    .stat-number-large {
      font-size: 48px;
      font-weight: 700;
      color: white;
      margin-bottom: 8px;
      line-height: 1.6;
    }

    .stat-label-large {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
    }

    /* CTA Section */
    .cta-section {
      padding: 96px 32px;
      background: linear-gradient(164deg, #F8FAFC 0%, #E2E8F0 100%);
    }

    .cta-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }

    .cta-title {
      font-size: 40px;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 16px;
      line-height: 1.6;
    }

    .cta-subtitle {
      font-size: 20px;
      color: #64748B;
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .btn-cta-large {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 22px 40px;
      background: linear-gradient(169deg, #16A34A 0%, #22C55E 100%);
      color: white;
      border-radius: 50px;
      text-decoration: none;
      font-size: 18px;
      font-weight: 700;
      box-shadow: 0px 4px 15px rgba(22, 163, 74, 0.3);
      transition: all 0.3s ease;
    }

    .btn-cta-large:hover {
      transform: translateY(-2px);
      box-shadow: 0px 8px 20px rgba(22, 163, 74, 0.4);
    }

    /* Footer */
    .footer {
      background: #1E293B;
      color: white;
      padding: 48px 32px 24px;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto 32px;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 48px;
    }

    .footer-column h4 {
      font-size: 19px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .footer-column h5 {
      font-size: 19px;
      font-weight: 700;
      color: white;
      margin-bottom: 16px;
    }

    .footer-description {
      color: #94A3B8;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .social-icons {
      display: flex;
      gap: 16px;
    }

    .social-icon {
      width: 40px;
      height: 40px;
      background: #334155;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: background 0.3s ease;
    }

    .social-icon:hover {
      background: #16A34A;
    }

    .footer-column a {
      display: block;
      color: #94A3B8;
      text-decoration: none;
      margin-bottom: 12px;
      font-size: 16px;
      transition: color 0.3s ease;
    }

    .footer-column a:hover {
      color: white;
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding-top: 24px;
      border-top: 1px solid #334155;
      text-align: center;
      color: #94A3B8;
      font-size: 16px;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .hero-container {
        grid-template-columns: 1fr;
        gap: 48px;
      }

      .hero-title {
        font-size: 48px;
      }

      .nav-links {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .navbar-content {
        flex-direction: column;
        gap: 16px;
      }

      .hero {
        padding: 120px 24px 60px;
      }

      .hero-title {
        font-size: 36px;
      }

      .hero-subtitle {
        font-size: 18px;
      }

      .section-title {
        font-size: 32px;
      }

      .section-subtitle {
        font-size: 18px;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .stats-container {
        grid-template-columns: 1fr 1fr;
        gap: 32px;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      .cta-title {
        font-size: 32px;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 28px;
      }

      .section-title {
        font-size: 28px;
      }

      .stats-container {
        grid-template-columns: 1fr;
      }

      .hero-buttons {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class HomeComponent {}