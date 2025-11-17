# Módulo 4: Catálogo y Exploración

Este módulo implementa la funcionalidad de catálogo donde los usuarios pueden explorar, visualizar y activar planes nutricionales y rutinas de ejercicio disponibles.

## 📋 Estructura del Módulo

```
catalogo/
├── catalogo.component.ts          # Componente principal (router outlet)
├── catalogo.routes.ts              # Definición de rutas
├── pages/
│   ├── lista-planes.component.ts           # US-16: Listar planes disponibles
│   ├── detalle-plan.component.ts           # US-16: Detalles de un plan
│   ├── lista-rutinas.component.ts          # US-18: Listar rutinas disponibles
│   ├── detalle-rutina.component.ts         # US-19: Detalles de una rutina
│   └── mis-asignaciones.component.ts       # US-20: Mis planes y rutinas activos
└── services/
    └── catalogo.service.ts         # Servicio para operaciones del catálogo
```

## 🎯 Historias de Usuario Implementadas

### US-16: Explorar Planes Nutricionales
- **Componente**: `lista-planes.component.ts` y `detalle-plan.component.ts`
- **Funcionalidad**:
  - Listar todos los planes disponibles
  - Filtrar por nombre y objetivo
  - Ver detalles completos de un plan
  - Ver información de macronutrientes
  - Activar un plan

### US-17: Activar Plan (Incluida en US-16)
- Permite a usuarios activar planes desde el catálogo

### US-18: Explorar Rutinas de Ejercicio
- **Componente**: `lista-rutinas.component.ts` y `detalle-rutina.component.ts`
- **Funcionalidad**:
  - Listar todas las rutinas disponibles
  - Filtrar por nombre y nivel de dificultad
  - Ver detalles completos de una rutina
  - Ver información de duración y frecuencia
  - Activar una rutina

### US-19: Detalles de Rutina
- Incluida en `detalle-rutina.component.ts`
- Muestra información detallada, beneficios y características

### US-20: Mis Asignaciones
- **Componente**: `mis-asignaciones.component.ts`
- **Funcionalidad**:
  - Ver todos los planes activos del usuario
  - Ver todas las rutinas activas del usuario
  - Desactivar planes y rutinas
  - Gestionar asignaciones personales

## 🔧 Servicio: CatalogoService

El servicio `catalogo.service.ts` proporciona las siguientes operaciones:

### Métodos Principales

```typescript
// Planes
obtenerPlanesDisponibles(): Observable<{ success: boolean; data: PlanResponse[] }>
obtenerDetallePlan(id: string): Observable<{ success: boolean; data: PlanResponse }>
activarPlan(planId: string): Observable<{ success: boolean; message: string }>
desactivarPlan(planId: string): Observable<{ success: boolean; message: string }>

// Rutinas
obtenerRutinasDisponibles(): Observable<{ success: boolean; data: RutinaResponse[] }>
obtenerDetalleRutina(id: string): Observable<{ success: boolean; data: RutinaResponse }>
activarRutina(rutinaId: string): Observable<{ success: boolean; message: string }>
desactivarRutina(rutinaId: string): Observable<{ success: boolean; message: string }>

// Asignaciones del Usuario
obtenerMisAsignaciones(): Observable<{
  success: boolean;
  data: { planesActivos: PlanResponse[]; rutinasActivas: RutinaResponse[] }
}>
```

## 📱 Componentes

### 1. CatalogoListaPlanesComponent
**Ruta**: `/catalogo/planes`

**Funcionalidades**:
- Grid responsive de planes disponibles
- Búsqueda por nombre
- Filtro por tipo de objetivo
- Tarjetas con información resumida
- Botón para ver detalles
- Botón para activar plan

**Características del UI**:
- Grid responsive (350px mínimo por columna)
- Animaciones hover
- Estados de carga
- Empty state si no hay planes

### 2. CatalogoDetallePlanComponent
**Ruta**: `/catalogo/planes/:id`

**Funcionalidades**:
- Información completa del plan
- Macronutrientes con gráficos visuales
- Estadísticas (duración, objetivo, calorías)
- Activar plan
- Volver a lista

**Características del UI**:
- Diseño full-width
- Gráficos de macronutrientes con barras
- Cards informativos
- Badges de estado

### 3. CatalogoListaRutinasComponent
**Ruta**: `/catalogo/rutinas`

**Funcionalidades**:
- Grid responsive de rutinas disponibles
- Búsqueda por nombre
- Filtro por nivel de dificultad
- Tarjetas con información resumida
- Botón para ver detalles
- Botón para activar rutina

**Características del UI**:
- Grid responsive similar a planes
- Badges de nivel de dificultad con colores
- Estados de carga y empty state

### 4. CatalogoDetalleRutinaComponent
**Ruta**: `/catalogo/rutinas/:id`

**Funcionalidades**:
- Información completa de la rutina
- Detalles de sesiones y duración
- Lista de beneficios
- Activar rutina
- Volver a lista

**Características del UI**:
- Diseño similar al detalle de plan
- Lista de beneficios con checkmarks
- Badges de nivel

### 5. MisAsignacionesComponent
**Ruta**: `/catalogo/mis-asignaciones`

**Funcionalidades**:
- Mostrar todos los planes activos del usuario
- Mostrar todas las rutinas activas del usuario
- Botón para desactivar planes y rutinas
- Links a catálogos para agregar más
- Empty states con CTAs

**Características del UI**:
- Dos secciones: Planes y Rutinas
- Cards removibles con botón de eliminar
- Empty states orientados al usuario
- Botones flotantes para agregar

## 🎨 Estilos y Diseño

### Paleta de Colores
- **Primario**: `#667eea` - `#764ba2` (Gradiente)
- **Éxito**: `#48bb78`
- **Peligro**: `#f56565`
- **Info**: `#4299e1`
- **Advertencia**: `#f6ad55`

### Tipografía
- **Títulos**: Tamaño 2-2.5rem, peso 600-700
- **Texto**: Tamaño 1rem, color `#2d3748`
- **Labels**: Tamaño 0.875rem, color `#718096`

### Espaciado
- Padding estándar: 1.5rem - 2rem
- Gap en grids: 1.5rem
- Margenes inferiores: 1rem - 2rem

## 🔐 Seguridad

Todas las rutas están protegidas con `authGuard`:
```typescript
canActivate: [authGuard]
```

Esto asegura que solo usuarios autenticados pueden acceder al catálogo.

## 📝 Notas de Implementación

### Endpoints Esperados
El servicio espera los siguientes endpoints en el backend:

```
GET    /api/planes/disponibles                    # Listar planes
GET    /api/planes/:id                            # Detalle plan
POST   /api/usuarios/planes/activar               # Activar plan
POST   /api/usuarios/planes/desactivar            # Desactivar plan

GET    /api/rutinas/disponibles                   # Listar rutinas
GET    /api/rutinas/:id                           # Detalle rutina
POST   /api/usuarios/rutinas/activar              # Activar rutina
POST   /api/usuarios/rutinas/desactivar           # Desactivar rutina

GET    /api/usuarios/asignaciones                 # Mis asignaciones
```

### Modelos Esperados
- `PlanResponse`: Contiene información de planes (incluye `activoParaUsuario`)
- `RutinaResponse`: Contiene información de rutinas (incluye `activoParaUsuario`)
- Ambos incluyen arreglos de `etiquetas` para características

## 🚀 Uso

### Acceso a Rutas
```typescript
// Listar planes
/catalogo/planes

// Detalle de plan
/catalogo/planes/{idPlan}

// Listar rutinas
/catalogo/rutinas

// Detalle de rutina
/catalogo/rutinas/{idRutina}

// Mis asignaciones
/catalogo/mis-asignaciones
```

### En Componentes
```typescript
import { CatalogoService } from './services/catalogo.service';

constructor(private catalogoService: CatalogoService) {}

// Obtener planes
this.catalogoService.obtenerPlanesDisponibles().subscribe(response => {
  if (response.success) {
    console.log(response.data);
  }
});

// Activar un plan
this.catalogoService.activarPlan(planId).subscribe(response => {
  if (response.success) {
    // Mostrar notificación de éxito
  }
});
```

## 🔄 Flujo de Usuario

1. **Usuario autenticado accede a `/catalogo`**
   → Redirige a `/catalogo/planes`

2. **Explorar Planes**
   - Ve lista de planes
   - Puede filtrar por objetivo
   - Puede buscar por nombre
   - Clica en un plan para ver detalles

3. **Ver Detalles del Plan**
   - Ve información completa
   - Ve macronutrientes visualizados
   - Puede activar el plan
   - Puede volver a la lista

4. **Flujo similar para Rutinas**

5. **Gestionar Asignaciones**
   - Ve todos sus planes y rutinas activos
   - Puede desactivarlos
   - Puede volver al catálogo para activar más

## 📦 Dependencias

- `@angular/common`: Directivas comunes (CommonModule)
- `@angular/router`: Enrutamiento (RouterLink, RouterOutlet)
- `@angular/forms`: Formularios (FormsModule)
- Servicios propios: CatalogoService, NotificationService

## ✅ Estado

✅ Componentes creados
✅ Servicio creado
✅ Rutas configuradas
✅ Guards aplicados
⏳ Backend endpoints pendientes
⏳ Pruebas unitarias pendientes
