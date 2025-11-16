# 🎨 GUÍA RÁPIDA FRONTEND ANGULAR - NUTRITRACK

> **Resumen Ejecutivo por Módulos**  
> **Versión:** 3.0 | **Fecha:** 15 de Noviembre, 2025

---

## 📊 DISTRIBUCIÓN DE TRABAJO

### Tabla Resumen

| Persona | Módulo | User Stories | Componentes | DTOs | Servicios | Semanas |
|---------|--------|--------------|-------------|------|-----------|---------|
| **Persona 1** | Autenticación y Perfil | US-01 a US-05 | 5 | 6 Request + 3 Response | AuthService, PerfilService | 2 |
| **Persona 2** | Admin Contenido | US-06 a US-10 | 12 | 4 Request + 4 Response | EtiquetaService, IngredienteService, EjercicioService, ComidaService | 3 |
| **Persona 3** | Admin Planes/Rutinas | US-11 a US-15 | 8 | 4 Request + 4 Response | PlanService, RutinaService | 3 |
| **Persona 4** | Exploración Usuario | US-16 a US-20 | 7 | 2 Request + 4 Response | CatalogoService, AsignacionService | 2 |
| **Persona 5** | Seguimiento Progreso | US-21 a US-25 | 8 | 3 Request + 3 Response | RegistroService, ProgresoService | 2 |
| **TOTAL** | 5 Módulos | 25 US | **40 componentes** | **28 DTOs** | **9 servicios** | **12 semanas** |

**Trabajo Paralelo:** 3-4 semanas efectivas

---

## 🔑 PERSONA 1: AUTENTICACIÓN Y PERFIL

### Responsabilidad
Sistema completo de autenticación JWT + Gestión de perfil de salud

### DTOs Principales

```typescript
// REQUEST
RegisterRequest { email, password, nombre, apellido }
LoginRequest { email, password }
PerfilSaludRequest { altura?, pesoActual?, pesoObjetivo?, etiquetaSaludIds[] }
UpdateUnidadesMedidaRequest { unidadesMedida: 'KG'|'LBS' }
DeleteAccountRequest { confirmacion: 'ELIMINAR' }

// RESPONSE
AuthResponse { token, usuario, rol }
PerfilSaludResponse { id, nombre, unidadesMedida, etiquetasSalud[] }
```

### Componentes
1. **LoginComponent** (`/login`) - Login form con redirección por rol
2. **RegistroComponent** (`/auth/registro`) - Registro con validación RN30 + RN31
3. **PerfilSaludComponent** (`/perfil/salud`) - Selector de alergias y condiciones
4. **ConfigurarUnidadesComponent** (`/perfil/unidades`) - Toggle KG/LBS (RN03)
5. **EliminarCuentaComponent** (`/perfil/eliminar`) - Confirmación "ELIMINAR" (RN05)

### Servicios
- **AuthService**: login(), registro(), logout(), obtenerToken()
- **PerfilService**: obtenerPerfil(), actualizarPerfilSalud(), actualizarUnidades()

### Guards e Interceptors
- **AuthGuard**: Proteger rutas privadas
- **AdminGuard**: Proteger rutas `/admin/**`
- **JwtInterceptor**: Agregar `Authorization: Bearer {token}`
- **ErrorInterceptor**: Manejo centralizado de errores HTTP

### Reglas Críticas
- 🚨 **RN30**: Email RFC 5322 + validación DNS
- 🚨 **RN31**: Contraseña 12+ chars (mayúscula + minúscula + número + símbolo)
- 🔴 **RN03**: Unidad (KG/LBS) aplica a TODAS las vistas
- 🟡 **RN05**: Eliminación requiere escribir "ELIMINAR"

---

## 📚 PERSONA 2: ADMINISTRACIÓN DE CONTENIDO

### Responsabilidad
CRUD completo de: Etiquetas, Ingredientes, Ejercicios, Comidas (con recetas)

### DTOs Principales

```typescript
// ETIQUETAS
EtiquetaRequest { nombre, tipo, descripcion? }
EtiquetaResponse { id, nombre, tipo, descripcion? }

// INGREDIENTES
IngredienteRequest { 
  nombre, proteinas, carbohidratos, grasas, energia, 
  categoriaAlimento, descripcion?, etiquetaIds[] 
}
IngredienteResponse { id, nombre, ...nutrientes, etiquetas[] }

// EJERCICIOS
EjercicioRequest { nombre, descripcion, grupoMuscular, nivelDificultad }
EjercicioResponse { id, nombre, descripcion, grupoMuscular }

// COMIDAS
ComidaRequest { nombre, tipoComida, descripcion?, porciones }
ComidaResponse { id, nombre, tipoComida, caloriasTotales, ingredientes[] }

// RECETAS (agregar ingrediente a comida)
AgregarIngredienteRequest { ingredienteId, cantidadGramos, notas? }
RecetaIngredienteResponse { id, ingrediente, cantidadGramos, calorias }
```

### Componentes

#### Etiquetas (US-06)
1. **ListaEtiquetasComponent** - Tabla con acciones CRUD
2. **CrearEtiquetaComponent** - Form con selector de tipo
3. **EditarEtiquetaComponent** - Form pre-cargado

#### Ingredientes (US-07)
4. **ListaIngredientesComponent** - Tabla filtrable
5. **CrearIngredienteComponent** - Form con información nutricional
6. **EditarIngredienteComponent** - Form pre-cargado

#### Ejercicios (US-08)
7. **ListaEjerciciosComponent** - Tabla con búsqueda
8. **CrearEjercicioComponent** - Form con grupo muscular
9. **EditarEjercicioComponent** - Form pre-cargado

#### Comidas (US-09, US-10)
10. **ListaComidasComponent** - Tabla con preview de receta
11. **CrearComidaComponent** - Form básico
12. **GestionarRecetaComponent** - Agregar/eliminar ingredientes con cantidades

### Servicios
- **EtiquetaService**: CRUD completo + obtenerPorTipo()
- **IngredienteService**: CRUD completo + buscar()
- **EjercicioService**: CRUD completo + buscar()
- **ComidaService**: CRUD completo + agregarIngrediente() + eliminarIngrediente()

### Reglas Críticas
- 🔴 **RN06**: Etiquetas con nombre único
- 🔴 **RN07**: Ingredientes/Ejercicios con nombre único
- 🔴 **RN08**: No eliminar etiqueta si está en uso (mostrar error 409)
- 🔴 **RN09**: No eliminar ingrediente/ejercicio si está en uso
- 🟡 **RN10**: Cantidad de ingrediente debe ser > 0 gramos

### Flujo Especial: Crear Comida con Receta
```
1. Admin crea comida básica → POST /api/v1/comidas
2. Backend retorna comida.id
3. Por cada ingrediente:
   - Seleccionar ingrediente del catálogo
   - Especificar cantidadGramos (ej: 150g de Pollo)
   - POST /api/v1/comidas/{comidaId}/ingredientes
4. Backend calcula calorías automáticamente (RN25)
5. Mostrar total de calorías en UI
```

---

## 🗂️ PERSONA 3: GESTIÓN DE PLANES Y RUTINAS

### Responsabilidad
CRUD de Planes Nutricionales y Rutinas de Ejercicio (Admin)

### DTOs Principales

```typescript
// PLANES
PlanRequest {
  nombre, descripcion, duracionDias,
  objetivo: {
    caloriasObjetivo, proteinasObjetivo, carbohidratosObjetivo, 
    grasasObjetivo, tipoObjetivo
  },
  etiquetaIds[]
}
PlanResponse { 
  id, nombre, descripcion, duracionDias, activo, 
  objetivo, etiquetas[], dias[] 
}

// DÍAS DEL PLAN
PlanDiaRequest { 
  numeroDia, comidaId, tipoComida, porcionesRecomendadas, orden 
}
PlanDiaResponse { 
  id, numeroDia, comida, tipoComida, porciones, orden 
}

// RUTINAS
RutinaRequest {
  nombre, descripcion, duracionSemanas, nivelDificultad, 
  frecuenciaSemanal, etiquetaIds[]
}
RutinaResponse { 
  id, nombre, descripcion, duracionSemanas, nivelDificultad, 
  ejercicios[], etiquetas[] 
}

// EJERCICIOS DE RUTINA
RutinaEjercicioRequest {
  ejercicioId, series, repeticiones, peso?, duracionMinutos?, 
  tiempoDescanso?, diaSemana, orden
}
RutinaEjercicioResponse {
  id, ejercicio, series, repeticiones, peso, diaSemana, orden
}
```

### Componentes

#### Planes (US-11, US-12, US-13, US-14)
1. **ListaPlanesComponent** - Tabla con activos/inactivos
2. **CrearPlanComponent** - Wizard de 3 pasos:
   - Paso 1: Información básica
   - Paso 2: Objetivo nutricional
   - Paso 3: Asignar etiquetas
3. **ConfigurarDiasPlanComponent** - Por cada día, asignar comidas (desayuno, almuerzo, cena)
4. **EditarPlanComponent** - Form pre-cargado

#### Rutinas (US-11, US-12, US-13, US-14, US-15)
5. **ListaRutinasComponent** - Tabla con activas/inactivas
6. **CrearRutinaComponent** - Form con nivel de dificultad
7. **GestionarEjerciciosRutinaComponent** - Agregar ejercicios con series/reps/día
8. **EditarRutinaComponent** - Form pre-cargado

### Servicios
- **PlanService**: CRUD + crearDia() + eliminarDia() + activar()/desactivar()
- **RutinaService**: CRUD + agregarEjercicio() + eliminarEjercicio() + activar()/desactivar()

### Reglas Críticas
- 🔴 **RN11**: Nombres únicos en planes y rutinas
- 🟡 **RN12**: Solo asignar etiquetas existentes (validar antes de enviar)
- 🟡 **RN13**: Series y repeticiones deben ser > 0
- 🔴 **RN14**: No eliminar plan/rutina si tiene usuarios activos (error 409)
- 🟡 **RN28**: Soft delete (marcar como inactivo, no DELETE físico)

### Flujo Especial: Crear Plan Completo

```
1. Admin crea plan → POST /api/v1/admin/planes
   Response: { id: 1, nombre: "Plan 7 días", ... }

2. Por cada día (1 a duracionDias):
   - Día 1:
     * POST /api/v1/admin/planes/1/dias { numeroDia: 1, comidaId: 5, tipoComida: 'DESAYUNO' }
     * POST /api/v1/admin/planes/1/dias { numeroDia: 1, comidaId: 8, tipoComida: 'ALMUERZO' }
     * POST /api/v1/admin/planes/1/dias { numeroDia: 1, comidaId: 12, tipoComida: 'CENA' }
   - Día 2...
   - Día 7...

3. Asignar etiquetas: PUT /api/v1/admin/planes/1 { etiquetaIds: [1, 5, 8] }
4. Activar plan: PATCH /api/v1/admin/planes/1/activar
```

---

## 🔍 PERSONA 4: EXPLORACIÓN Y ACTIVACIÓN

### Responsabilidad
Catálogo público de planes/rutinas + Activación/Gestión de asignaciones (Usuario)

### DTOs Principales

```typescript
// VER CATÁLOGO (planes filtrados por alergias RN16)
// GET /api/v1/planes/catalogo?sugeridos=true
PlanResponse[] // Solo planes compatibles con alergias del usuario

// ACTIVAR PLAN
ActivarPlanRequest { planId, fechaInicio, notas? }
UsuarioPlanResponse {
  id, planId, nombrePlan, fechaInicio, fechaFin, 
  diaActual, duracionTotal, estado, caloriasDiarias
}

// ACTIVAR RUTINA
ActivarRutinaRequest { rutinaId, fechaInicio, notas? }
UsuarioRutinaResponse {
  id, rutinaId, nombreRutina, fechaInicio, fechaFin, 
  semanaActual, duracionTotal, estado
}

// ESTADOS: ACTIVO | PAUSADO | COMPLETADO | CANCELADO
```

### Componentes

1. **ListaPlanesPublicoComponent** (`/catalogo/planes`) - Grid de cards con filtro por etiquetas
2. **DetallePlanComponent** (`/catalogo/planes/:id`) - Ver días/comidas del plan
3. **ActivarPlanDialogComponent** - Modal para activar con fecha inicio
4. **ListaRutinasPublicoComponent** (`/catalogo/rutinas`) - Grid de cards
5. **DetalleRutinaComponent** (`/catalogo/rutinas/:id`) - Ver ejercicios/días
6. **MisAsignacionesComponent** (`/usuario/asignaciones`) - Lista de planes/rutinas activos
7. **GestionarAsignacionComponent** - Pausar/Reanudar/Completar/Cancelar

### Servicios
- **CatalogoService**: obtenerPlanes(), obtenerRutinas(), obtenerDetalle()
- **AsignacionService**: activarPlan(), activarRutina(), pausar(), reanudar(), completar(), cancelar()

### Reglas Críticas
- 🚨 **RN16**: Catálogo OCULTA planes con ingredientes alérgenos del usuario
- 🟡 **RN15**: Mostrar planes sugeridos según perfil de salud
- 🔴 **RN17**: No activar el MISMO plan si ya está ACTIVO (error 409)
- 🟡 **RN18**: Si intenta activar plan activo, proponer reemplazo
- 🟡 **RN19**: No pausar/reanudar si estado = COMPLETADO o CANCELADO
- 🔴 **RN26**: Transiciones válidas de estado
- 🚨 **RN32**: Al activar, validar que plan no contenga alérgenos

### Transiciones de Estado Permitidas

```
ACTIVO → PAUSADO (pausar temporalmente)
ACTIVO → COMPLETADO (finalizar con éxito)
ACTIVO → CANCELADO (abandonar)
PAUSADO → ACTIVO (reanudar)

PROHIBIDO:
COMPLETADO → cualquier cosa
CANCELADO → cualquier cosa
```

### Manejo de Error RN17 (Plan Duplicado)

```typescript
activarPlan(planId: number): void {
  this.asignacionService.activarPlan({ planId, fechaInicio: new Date() })
    .subscribe({
      next: (response) => {
        this.toastr.success('Plan activado correctamente');
      },
      error: (error) => {
        if (error.status === 409) {
          // RN17: Plan duplicado activo
          Swal.fire({
            title: 'Ya tienes este plan activo',
            text: error.error.message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Pausar y reiniciar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              // Pausar instancia actual y crear nueva
              this.pausarYReiniciar(planId);
            }
          });
        }
      }
    });
}
```

---

## 📊 PERSONA 5: SEGUIMIENTO Y PROGRESO

### Responsabilidad
Registros diarios (comidas/ejercicios) + Mediciones + Gráficos de progreso (Usuario)

### DTOs Principales

```typescript
// VER ACTIVIDADES DEL DÍA
// GET /api/v1/usuario/registros/plan/hoy
ActividadesDiaResponse {
  fecha, diaActual, caloriasObjetivo, caloriasConsumidas,
  comidas: [{ comidaId, nombre, tipoComida, calorias, completado, registroId? }],
  ejercicios: [{ ejercicioId, nombre, series, repeticiones, completado, registroId? }]
}

// REGISTRAR COMIDA
RegistroComidaRequest {
  comidaId, usuarioPlanId, fecha, hora, tipoComida, porciones, notas?
}
RegistroComidaResponse {
  id, comidaId, nombreComida, fecha, hora, tipoComida, 
  porciones, caloriasConsumidas, notas?
}

// REGISTRAR EJERCICIO
RegistroEjercicioRequest {
  ejercicioId, usuarioRutinaId?, fecha, hora, 
  series, repeticiones, pesoKg?, duracionMinutos?, notas?
}
RegistroEjercicioResponse {
  id, ejercicioId, nombreEjercicio, fecha, hora, 
  series, repeticiones, pesoKg?, duracionMinutos?
}

// MEDICIONES
HistorialMedidasRequest { peso, altura?, cintura?, fecha }
HistorialMedidasResponse { id, peso, altura?, cintura?, fecha, imc? }

// PROGRESO (gráfico)
// GET /api/v1/usuario/progreso/grafico?tipo=peso&fechaInicio&fechaFin
ProgresoResponse {
  fechas: string[],
  valores: number[],
  tendencia: 'SUBIDA' | 'BAJADA' | 'ESTABLE'
}
```

### Componentes

1. **DashboardUsuarioComponent** (`/usuario/dashboard`) - Vista principal con resumen
2. **ActividadesHoyComponent** (`/usuario/actividades-hoy`) - Lista de comidas/ejercicios del día
3. **RegistrarComidaDialogComponent** - Modal para registrar comida
4. **RegistrarEjercicioDialogComponent** - Modal para registrar ejercicio
5. **HistorialRegistrosComponent** (`/usuario/historial`) - Tabla de registros pasados
6. **MedicionesComponent** (`/usuario/mediciones`) - Formulario + historial de mediciones
7. **GraficoProgresoComponent** - Gráfico de líneas con Chart.js
8. **ExportarReporteComponent** - Botón para descargar PDF (si RN24 implementado)

### Servicios
- **RegistroService**: registrarComida(), registrarEjercicio(), obtenerHistorial(), desmarcar()
- **ProgresoService**: obtenerActividadesHoy(), registrarMedicion(), obtenerGrafico(), exportarPDF()

### Reglas Críticas
- 🟡 **RN20**: Mostrar check (✓) en actividades completadas
- 🔴 **RN21**: No registrar si plan está PAUSADO (error 400)
- 🟡 **RN22**: Validar mediciones en rango (peso 20-600 kg, altura 50-300 cm)
- 🟡 **RN23**: Gráfico requiere mínimo 2 registros
- 🟢 **RN24**: Reporte PDF (opcional, puede ser pendiente)
- 🔴 **RN25**: Calorías calculadas automáticamente (no input manual)

### Flujo: Ver y Registrar Actividades del Día

```typescript
// 1. Obtener actividades del día
this.progresoService.obtenerActividadesHoy().subscribe(actividades => {
  this.actividades = actividades;
  
  // 2. Mostrar lista de comidas
  actividades.comidas.forEach(comida => {
    // comida.completado = true → Mostrar ✓ verde
    // comida.completado = false → Mostrar botón "Registrar"
  });
});

// 3. Usuario hace click en "Registrar Comida"
registrarComida(comida: ComidaDia): void {
  const request: RegistroComidaRequest = {
    comidaId: comida.comidaId,
    usuarioPlanId: this.planActivo.id,
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().split(' ')[0],
    tipoComida: comida.tipoComida,
    porciones: 1.0
  };

  this.registroService.registrarComida(request).subscribe({
    next: () => {
      this.toastr.success(`✓ ${comida.nombre} registrada`);
      this.recargarActividades(); // Actualizar checks
    },
    error: (error) => {
      if (error.status === 400 && error.error.message.includes('pausado')) {
        // RN21: Plan pausado
        this.toastr.error('No puedes registrar comidas en un plan pausado');
      }
    }
  });
}
```

### Gráfico de Progreso con Chart.js

```typescript
import { Chart } from 'chart.js/auto';

export class GraficoProgresoComponent implements OnInit {
  chart: Chart;

  ngOnInit(): void {
    this.progresoService.obtenerGrafico('peso', fechaInicio, fechaFin)
      .subscribe(data => {
        if (data.fechas.length < 2) {
          // RN23: Mínimo 2 registros
          this.toastr.warning('Se necesitan al menos 2 mediciones para generar el gráfico');
          return;
        }

        this.chart = new Chart('grafico-progreso', {
          type: 'line',
          data: {
            labels: data.fechas,
            datasets: [{
              label: 'Peso (kg)',
              data: data.valores,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: false
              }
            }
          }
        });
      });
  }
}
```

---

## 🔗 MODELOS COMPARTIDOS

### Archivo: `src/app/shared/models/api-response.model.ts`

```typescript
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export enum EstadoAsignacion {
  ACTIVO = 'ACTIVO',
  PAUSADO = 'PAUSADO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO'
}

export enum TipoComida {
  DESAYUNO = 'DESAYUNO',
  ALMUERZO = 'ALMUERZO',
  CENA = 'CENA',
  SNACK = 'SNACK'
}

export enum UnidadesMedida {
  KG = 'KG',
  LBS = 'LBS'
}

export enum Rol {
  USER = 'USER',
  ADMIN = 'ADMIN'
}
```

---

## ✅ CHECKLIST GENERAL DE INTEGRACIÓN

### Fase 1: Setup Inicial (Semana 1)
- [ ] Crear proyecto Angular 17+
- [ ] Instalar dependencias (Material, Chart.js, Toastr, SweetAlert2)
- [ ] Configurar `environment.ts` y `environment.prod.ts`
- [ ] Crear estructura de carpetas
- [ ] Configurar Angular Material theme
- [ ] Crear `CoreModule` con guards e interceptors
- [ ] Crear `SharedModule` con componentes reutilizables
- [ ] Definir todos los modelos TypeScript en `shared/models/`

### Fase 2: Desarrollo Paralelo (Semanas 2-4)
- [ ] **Persona 1**: Módulo de Autenticación (CRÍTICO, hace primero)
- [ ] **Persona 2**: Módulo de Administración de Contenido (paralelo después de Autenticación)
- [ ] **Persona 3**: Módulo de Gestión de Planes/Rutinas (paralelo)
- [ ] **Persona 4**: Módulo de Exploración y Activación (paralelo)
- [ ] **Persona 5**: Módulo de Seguimiento y Progreso (paralelo)

### Fase 3: Integración y Testing (Semana 5)
- [ ] Integrar todos los módulos en `app-routing.module.ts`
- [ ] Verificar que guards funcionan correctamente
- [ ] Testing manual de flujos completos:
  - [ ] Registro → Login → Configurar perfil → Explorar catálogo → Activar plan → Registrar comidas
  - [ ] Admin: Login → Crear ingredientes → Crear comida → Crear plan → Publicar
- [ ] Testing de reglas críticas (RN16, RN17, RN21, RN30, RN31, RN32)
- [ ] Verificar conversión de unidades (KG ↔ LBS) en todas las vistas
- [ ] Verificar que catálogo filtra planes con alérgenos

### Fase 4: Ajustes y Deploy (Semana 6)
- [ ] Optimización de rendimiento (lazy loading de módulos)
- [ ] Mejoras de UX (skeleton loaders, estados vacíos)
- [ ] Responsive design (mobile-first)
- [ ] Build de producción: `ng build --configuration production`
- [ ] Deploy a Netlify/Vercel/Firebase
- [ ] Configurar variable de entorno `apiUrl` para producción

---

## 🚀 COMANDOS ÚTILES

```bash
# Crear módulo
ng generate module modules/auth --routing

# Crear componente
ng generate component modules/auth/components/login

# Crear servicio
ng generate service core/services/auth

# Crear guard
ng generate guard core/guards/auth

# Crear interceptor (functional)
ng generate interceptor core/interceptors/jwt

# Crear interface
ng generate interface shared/models/auth

# Crear pipe
ng generate pipe shared/pipes/unit-converter

# Ejecutar dev server
ng serve

# Build producción
ng build --configuration production

# Ejecutar tests
ng test

# Lint
ng lint
```

---

## 📞 RECURSOS Y SOPORTE

### Documentación Backend
- **Swagger UI:** https://nutritrack-api-wt8b.onrender.com/swagger-ui.html
- **Postman Collections:** `/postman/` (5 colecciones por módulo)
- **Reglas de Negocio:** `/docs/REGLAS_NEGOCIO.MD` (39 reglas)
- **User Stories:** `/docs/USER_STORIES.MD` (25 historias)
- **Unit Tests Mapping:** `/docs/UNIT_TESTS_MAPPING.md` (175 tests)

### Coordinación del Equipo
- **Daily Standup:** 15 min diarios (9:00 AM)
- **Weekly Demo:** Viernes 4:00 PM
- **Code Review:** Obligatorio en PRs (al menos 1 aprobación)
- **Convención de Commits:** 
  - `feat(modulo): Descripción` - Nueva funcionalidad
  - `fix(modulo): Descripción` - Bug fix
  - `refactor(modulo): Descripción` - Refactorización
  - `docs: Descripción` - Documentación

### Dudas Técnicas
- **Backend:** Leonel Alzamora
- **Frontend:** Coordinador de Frontend
- **UI/UX:** Diseñador UX (si aplica)

---

**Última Actualización:** 15 de Noviembre, 2025  
**Versión:** 3.0  
**Equipo:** 5 Desarrolladores Frontend + 1 Coordinador  
**Status:** ✅ Listo para Desarrollo Paralelo
