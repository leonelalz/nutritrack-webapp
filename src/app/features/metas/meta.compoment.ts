import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

/**
 * Componente Principal del Catálogo
 * Módulo 4: CATÁLOGO Y EXPLORACIÓN
 */
@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="catalogo-wrapper">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .catalogo-wrapper {
      min-height: 100vh;
      background: #f9fafb;
    }
  `]
})
export class MetasComponent {}