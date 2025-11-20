export interface RouteMessage {
  title: string;
  subtitle: string;
  showName?: boolean; // para dashboard
}

export const ROUTE_MESSAGES: Record<string, RouteMessage> = {
  '/dashboard': {
    title: '¡Hola!',
    subtitle: 'Aquí tienes tu resumen completo de salud y bienestar',
    showName: true
  },

  '/usuario/perfil': {
    title: 'Tu Perfil',
    subtitle: 'Revisa tu información personal'
  },

  '/usuario/historial': {
    title: 'Historial de Medidas',
    subtitle: 'Controla tu progreso físico'
  },

  '/reports': {
    title: 'Reportes',
    subtitle: 'Visualiza estadísticas avanzadas'
  },

  '/admin/etiquetas': {
    title: 'Gestión de etiquetas',
    subtitle: 'Administra las etiquetas para clasificar ingredientes, ejercicios y comidas'
  },

  '/admin/ingredientes': {
    title: 'Gestión de Ingredientes',
    subtitle: 'Administración de ingredientes con información nutricional completa'
  },

  '/admin/comidas': {
    title: 'Gestión de Comidas y Recetas',
    subtitle: 'Administración completa de comidas con ingredientes y recetas'
  },

  //-----
    '/seguimiento/hoy': {
    title: 'Actividades de hoy',
    subtitle: 'Revisa las comidas y ejercicios del día'
  },

  '/seguimiento/registrar-comida': {
    title: 'Registrar comida',
    subtitle: 'Agrega una comida a tu registro diario'
  },

  '/seguimiento/registrar-ejercicio': {
    title: 'Registrar ejercicio',
    subtitle: 'Agrega un ejercicio a tu registro diario'
  },

  '/seguimiento/historial': {
    title: 'Historial de registros',
    subtitle: 'Consulta tus comidas y ejercicios anteriores'
  },

  '/seguimiento/mediciones': {
    title: 'Mediciones',
    subtitle: 'Registra y revisa tus medidas físicas'
  },

  '/seguimiento/progreso': {
    title: 'Mi progreso',
    subtitle: 'Visualiza la evolución de tu peso en el tiempo'
  },

};
