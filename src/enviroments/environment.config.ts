/**
 * Configuración de environment que se auto-detecta
 * En producción (Netlify), usa automáticamente las variables de producción
 */

// Importa ambos environments
import { environment as devEnv } from './enviroment';
import { environment as prodEnv } from './enviroment.prod';

// Detecta si estamos en producción
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname !== 'localhost' && 
   window.location.hostname !== '127.0.0.1');

// Exporta el environment correcto
export const environment = isProduction ? prodEnv : devEnv;

// Log para debugging (solo en desarrollo)
if (!isProduction) {
  console.log('🔧 Environment mode:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
  console.log('🌐 API URL:', environment.apiUrl);
}
