# Sistema Drag & Drop para Gestión de Ejercicios en Rutinas

## Descripción

Nueva interfaz intuitiva de arrastrar y soltar (drag & drop) para crear y organizar rutinas de ejercicio día por día.

## Características Principales

### 🎯 Interfaz Dividida en Dos Paneles

1. **Panel Izquierdo - Catálogo de Ejercicios**
   - Lista de todos los ejercicios disponibles
   - Buscador para filtrar por nombre
   - Cada ejercicio muestra:
     - Nombre del ejercicio
     - Tipo de ejercicio (Cardio, Fuerza, etc.)
     - Grupo muscular trabajado
   - Barra de desplazamiento sticky

2. **Panel Derecho - Planificación Semanal**
   - Acordeones expandibles para cada día de la semana
   - Badge con contador de ejercicios por día
   - Zona de drop para recibir ejercicios
   - Configuración detallada de cada ejercicio

### 🖱️ Funcionalidad Drag & Drop

- **Arrastrar desde catálogo**: Agrega un nuevo ejercicio al día seleccionado
- **Reordenar dentro del día**: Cambia la secuencia de ejercicios
- **Mover entre días**: Transfiere ejercicios de un día a otro
- **Visual feedback**: Placeholders y animaciones durante el arrastre

### ⚙️ Configuración de Ejercicios

Cada ejercicio agregado permite configurar:
- **Series** (requerido, mínimo 1) - con ícono repeat
- **Repeticiones** (requerido, mínimo 1) - con ícono format_list_numbered
- **Peso (kg)** (opcional) - con ícono fitness_center
- **Duración (min)** (opcional) - con ícono timer
- **Descanso (seg)** (opcional) - con ícono pause_circle
- **Notas** (opcional) - campo de texto para instrucciones específicas

### ✅ Validaciones

- **RN13**: Series y repeticiones deben ser valores positivos (>=1)
- Validación antes de guardar
- Mensajes de error específicos indicando qué campo falla

### 💾 Guardado

- Botón "Guardar Rutina Completa" al final
- Muestra contador total de ejercicios
- Guarda todos los ejercicios de todos los días en una sola operación
- Feedback visual durante el guardado

## Uso

1. **Buscar ejercicio**: Usa el campo de búsqueda para filtrar ejercicios
2. **Seleccionar día**: Expande el acordeón del día deseado
3. **Arrastrar ejercicio**: Desde el catálogo hacia el día
4. **Configurar parámetros**: Ajusta series, repeticiones, peso, etc.
5. **Agregar más ejercicios**: Repite para otros días
6. **Guardar**: Click en "Guardar Rutina Completa"

## Componentes Técnicos

### Angular CDK Drag & Drop
- `DragDropModule` para funcionalidad drag & drop
- `cdkDropList` para zonas de drop
- `cdkDrag` para elementos arrastrables
- `cdkDropListConnectedTo` para conexión entre listas

### Material Design
- `MatExpansionModule` para acordeones de días
- `MatBadgeModule` para contadores
- `MatFormFieldModule` para campos de configuración
- `MatIconModule` para iconografía

### Signals
- Estado reactivo con Angular Signals
- `computed()` para listas conectadas y totales
- Actualizaciones automáticas de UI

## Mejoras Futuras

- [ ] Persistencia de ejercicios existentes al cargar
- [ ] Templates de rutinas predefinidas
- [ ] Copia de ejercicios entre días
- [ ] Exportar/importar rutinas
- [ ] Drag & drop desde biblioteca de ejercicios favoritos
- [ ] Vista previa de la rutina completa
- [ ] Estadísticas: duración total, calorías estimadas, etc.

## Archivos Modificados

- `gestionar-ejercicios-rutina.component.ts` - Componente principal reescrito
- `index.ts` - Agregado export de ejercicio.model
- `ejercicio.service.ts` - Ya existente, usado para listar ejercicios

## Backup

Se creó backup del componente original en:
- `gestionar-ejercicios-rutina.component.backup.ts`
