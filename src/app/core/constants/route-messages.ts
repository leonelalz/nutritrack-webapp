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

  '/metas/mis-asignaciones': {
    title: 'Mis Planes y Rutinas',
    subtitle: 'Gestiona tus asignaciones activas'
  },

  '/comidas': {
    title: '🍽️ Mis Comidas',
    subtitle: 'Gestiona tus comidas activas'
  },
  
  '/ejercicios': {
    title: '🏃‍♂️ Mis Ejercicios',
    subtitle: 'Gestiona tus ejercicios activas'
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

  '/perfil': {
    title: '👤 Mi Perfil de Salud',
    subtitle: 'Gestiona tu información de salud y objetivos nutricionales'
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

};
