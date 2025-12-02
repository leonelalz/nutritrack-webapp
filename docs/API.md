Este es el api, actuamente extraida de swager, tenga en un docuento para que la usea de guia:
Módulo 3: Gestor de Catálogo - Rutinas de Ejercicio
🔐 ADMIN: Gestión completa | 👤 USER: Ver catálogo filtrado por perfil (US-11 a US-15) - Jhamil Peña



PUT
/api/v1/rutinas/{rutinaId}/ejercicios/{ejercicioId}
Actualizar ejercicio de rutina


Actualiza la configuración de un ejercicio en la rutina (series, reps, peso, etc.)

Parameters
Try it out
Name	Description
rutinaId *
integer($int64)
(path)
ID de la rutina

rutinaId
ejercicioId *
integer($int64)
(path)
ID del ejercicio de rutina

ejercicioId
Request body

application/json
Example Value
Schema
{
  "ejercicioId": 5,
  "semanaBase": 1,
  "diaSemana": 1,
  "orden": 1,
  "series": 4,
  "repeticiones": 12,
  "peso": 60,
  "duracionMinutos": 15,
  "descansoSegundos": 90,
  "notas": "Bajar hasta 90 grados, mantener la espalda recta"
}
Responses
Code	Description	Links
200	
Ejercicio actualizado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "semanaBase": 1,
    "diaSemana": 1,
    "orden": 1,
    "series": 4,
    "repeticiones": 12,
    "peso": 60,
    "duracionMinutos": 15,
    "descansoSegundos": 90,
    "notas": "Bajar hasta 90 grados",
    "ejercicio": {
      "id": 5,
      "nombre": "Press Banca",
      "tipoEjercicio": "FUERZA",
      "grupoMuscular": "PECHO",
      "nivelDificultad": "INTERMEDIO"
    }
  },
  "timestamp": "2025-11-30T23:22:33.335Z"
}
No links
400	
Datos inválidos o ejercicio no pertenece a la rutina

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "semanaBase": 1,
    "diaSemana": 1,
    "orden": 1,
    "series": 4,
    "repeticiones": 12,
    "peso": 60,
    "duracionMinutos": 15,
    "descansoSegundos": 90,
    "notas": "Bajar hasta 90 grados",
    "ejercicio": {
      "id": 5,
      "nombre": "Press Banca",
      "tipoEjercicio": "FUERZA",
      "grupoMuscular": "PECHO",
      "nivelDificultad": "INTERMEDIO"
    }
  },
  "timestamp": "2025-11-30T23:22:33.339Z"
}
No links
404	
Ejercicio no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "semanaBase": 1,
    "diaSemana": 1,
    "orden": 1,
    "series": 4,
    "repeticiones": 12,
    "peso": 60,
    "duracionMinutos": 15,
    "descansoSegundos": 90,
    "notas": "Bajar hasta 90 grados",
    "ejercicio": {
      "id": 5,
      "nombre": "Press Banca",
      "tipoEjercicio": "FUERZA",
      "grupoMuscular": "PECHO",
      "nivelDificultad": "INTERMEDIO"
    }
  },
  "timestamp": "2025-11-30T23:22:33.342Z"
}
No links

DELETE
/api/v1/rutinas/{rutinaId}/ejercicios/{ejercicioId}
Eliminar ejercicio de rutina


Elimina un ejercicio de la rutina

Parameters
Try it out
Name	Description
rutinaId *
integer($int64)
(path)
ID de la rutina

rutinaId
ejercicioId *
integer($int64)
(path)
ID del ejercicio de rutina

ejercicioId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.353Z"
}
No links

DELETE
/api/v1/rutinas/{rutinaId}/ejercicios
🔐 ADMIN - Eliminar TODOS los ejercicios de rutina (Batch)


Elimina TODOS los ejercicios de una rutina en una sola operación.

Parameters
Try it out
Name	Description
rutinaId *
integer($int64)
(path)
ID de la rutina

rutinaId
Responses
Code	Description	Links
200	
Todos los ejercicios eliminados exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Se eliminaron X ejercicios de la rutina",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.353Z"
}
No links
404	
Rutina no encontrada

No links

PUT
/api/v1/rutinas/{rutinaId}/ejercicios/batch
🔐 ADMIN - Reemplazar TODOS los ejercicios de rutina (Batch Atómico)


Reemplaza TODOS los ejercicios de una rutina en una operación atómica.
1. Elimina todos los ejercicios existentes
2. Agrega los nuevos ejercicios
3. Si falla alguno, hace rollback de todo

BENEFICIOS:
- Una sola llamada HTTP (más eficiente)
- Operación transaccional (todo o nada)
- Evita conflictos de constraints

Parameters
Try it out
Name	Description
rutinaId *
integer($int64)
(path)
ID de la rutina

rutinaId
Request body

application/json
Example Value
Schema
[
  { "ejercicioId": 5, "semanaBase": 1, "diaSemana": 1, "orden": 1, "series": 3, "repeticiones": 12 },
  { "ejercicioId": 7, "semanaBase": 1, "diaSemana": 1, "orden": 2, "series": 4, "repeticiones": 10 },
  { "ejercicioId": 9, "semanaBase": 1, "diaSemana": 2, "orden": 1, "series": 3, "repeticiones": 15 }
]
Responses
Code	Description	Links
200	
Ejercicios reemplazados exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Ejercicios actualizados correctamente",
  "data": [
    {
      "id": 1,
      "semanaBase": 1,
      "diaSemana": 1,
      "orden": 1,
      "series": 3,
      "repeticiones": 12,
      "ejercicio": { "id": 5, "nombre": "Press Banca" }
    }
  ],
  "timestamp": "2025-11-30T23:22:33.353Z"
}
No links
400	
Datos inválidos

No links
404	
Rutina o ejercicio no encontrado

No links

GET
/api/v1/rutinas/{id}
🔐 ADMIN - Obtener rutina por ID


Obtiene los detalles completos de una rutina. SOLO ADMINISTRADORES.

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID de la rutina

id
Responses
Code	Description	Links
200	
Rutina encontrada

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Rutina Hipertrofia 12 Semanas",
    "descripcion": "string",
    "duracionSemanas": 12,
    "patronSemanas": 2,
    "nivelDificultad": "INTERMEDIO",
    "activo": true,
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.359Z",
        "updatedAt": "2025-11-30T23:22:33.359Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.359Z",
    "updatedAt": "2025-11-30T23:22:33.359Z",
    "totalEjerciciosProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.359Z"
}
No links
404	
Rutina no encontrada

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Rutina Hipertrofia 12 Semanas",
    "descripcion": "string",
    "duracionSemanas": 12,
    "patronSemanas": 2,
    "nivelDificultad": "INTERMEDIO",
    "activo": true,
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.363Z",
        "updatedAt": "2025-11-30T23:22:33.363Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.363Z",
    "updatedAt": "2025-11-30T23:22:33.363Z",
    "totalEjerciciosProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.363Z"
}
No links

PUT
/api/v1/rutinas/{id}
Actualizar rutina


Actualiza una rutina existente. RN11: Nombre debe ser único.

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID de la rutina

id
Request body

application/json
Example Value
Schema
{
  "nombre": "Rutina Hipertrofia 12 Semanas",
  "descripcion": "Programa de entrenamiento enfocado en ganancia de masa muscular",
  "duracionSemanas": 12,
  "patronSemanas": 2,
  "nivelDificultad": "INTERMEDIO",
  "etiquetaIds": [
    1,
    2,
    3
  ]
}
Responses
Code	Description	Links
200	
Rutina actualizada exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Rutina Hipertrofia 12 Semanas",
    "descripcion": "string",
    "duracionSemanas": 12,
    "patronSemanas": 2,
    "nivelDificultad": "INTERMEDIO",
    "activo": true,
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.376Z",
        "updatedAt": "2025-11-30T23:22:33.376Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.376Z",
    "updatedAt": "2025-11-30T23:22:33.376Z",
    "totalEjerciciosProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.376Z"
}
No links
400	
Datos inválidos o nombre duplicado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Rutina Hipertrofia 12 Semanas",
    "descripcion": "string",
    "duracionSemanas": 12,
    "patronSemanas": 2,
    "nivelDificultad": "INTERMEDIO",
    "activo": true,
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.380Z",
        "updatedAt": "2025-11-30T23:22:33.380Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.380Z",
    "updatedAt": "2025-11-30T23:22:33.380Z",
    "totalEjerciciosProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.380Z"
}
No links
404	
Rutina no encontrada

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Rutina Hipertrofia 12 Semanas",
    "descripcion": "string",
    "duracionSemanas": 12,
    "patronSemanas": 2,
    "nivelDificultad": "INTERMEDIO",
    "activo": true,
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.384Z",
        "updatedAt": "2025-11-30T23:22:33.384Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.384Z",
    "updatedAt": "2025-11-30T23:22:33.384Z",
    "totalEjerciciosProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.384Z"
}
No links

DELETE
/api/v1/rutinas/{id}
🔐 ADMIN - US-14: Eliminar rutina [RN14, RN28]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN14: No permite eliminar rutina si tiene usuarios activos
RN28: Soft delete - marca activo=false en lugar de DELETE
VALIDACIONES AUTOMÁTICAS:

Verifica si rutina tiene registros en usuario_rutinas con estado ACTIVO
Rechaza eliminación si hay usuarios activos
Si no hay usuarios, marca activo=false
UNIT TESTS: 17/17 ✅ en RutinaServiceTest.java

testEliminarRutina_ConUsuariosActivos_Falla()
testEliminarRutina_SinUsuarios_SoftDelete()
Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID de la rutina

id
Responses
Code	Description	Links
200	
Rutina eliminada exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.390Z"
}
No links
404	
Rutina no encontrada

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.392Z"
}
No links
409	
No se puede eliminar - tiene usuarios activos (RN14)

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.397Z"
}
No links

GET
/api/v1/rutinas
🔐 ADMIN - Listar todas las rutinas


Obtiene lista paginada de todas las rutinas incluyendo inactivas. SOLO ADMINISTRADORES.

Parameters
Try it out
Name	Description
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Rutina Hipertrofia 12 Semanas",
        "descripcion": "string",
        "duracionSemanas": 12,
        "patronSemanas": 2,
        "nivelDificultad": "INTERMEDIO",
        "activo": true,
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:33.408Z",
            "updatedAt": "2025-11-30T23:22:33.408Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:33.408Z",
        "updatedAt": "2025-11-30T23:22:33.408Z",
        "totalEjerciciosProgramados": 0
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:33.408Z"
}
No links

POST
/api/v1/rutinas
🔐 ADMIN - US-11: Crear rutina [RN11]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN11: Rutinas con nombre único en catálogo (@Column unique=true)
UNIT TESTS: 17/17 ✅ en RutinaServiceTest.java

testCrearRutina_NombreDuplicado_Falla()
testCrearRutina_NombreUnico_Exito()
Ejecutar: ./mvnw test -Dtest=RutinaServiceTest

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "nombre": "Rutina Hipertrofia 12 Semanas",
  "descripcion": "Programa de entrenamiento enfocado en ganancia de masa muscular",
  "duracionSemanas": 12,
  "patronSemanas": 2,
  "nivelDificultad": "INTERMEDIO",
  "etiquetaIds": [
    1,
    2,
    3
  ]
}
Responses
Code	Description	Links
201	
Rutina creada exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Rutina Hipertrofia 12 Semanas",
    "descripcion": "string",
    "duracionSemanas": 12,
    "patronSemanas": 2,
    "nivelDificultad": "INTERMEDIO",
    "activo": true,
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.420Z",
        "updatedAt": "2025-11-30T23:22:33.420Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.420Z",
    "updatedAt": "2025-11-30T23:22:33.420Z",
    "totalEjerciciosProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.420Z"
}
No links
400	
Datos inválidos o nombre duplicado (RN11)

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Rutina Hipertrofia 12 Semanas",
    "descripcion": "string",
    "duracionSemanas": 12,
    "patronSemanas": 2,
    "nivelDificultad": "INTERMEDIO",
    "activo": true,
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.423Z",
        "updatedAt": "2025-11-30T23:22:33.423Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.423Z",
    "updatedAt": "2025-11-30T23:22:33.423Z",
    "totalEjerciciosProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.423Z"
}
No links
401	
No autenticado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Rutina Hipertrofia 12 Semanas",
    "descripcion": "string",
    "duracionSemanas": 12,
    "patronSemanas": 2,
    "nivelDificultad": "INTERMEDIO",
    "activo": true,
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.425Z",
        "updatedAt": "2025-11-30T23:22:33.425Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.425Z",
    "updatedAt": "2025-11-30T23:22:33.425Z",
    "totalEjerciciosProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.425Z"
}
No links
403	
No autorizado - requiere rol ADMIN

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Rutina Hipertrofia 12 Semanas",
    "descripcion": "string",
    "duracionSemanas": 12,
    "patronSemanas": 2,
    "nivelDificultad": "INTERMEDIO",
    "activo": true,
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.428Z",
        "updatedAt": "2025-11-30T23:22:33.428Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.428Z",
    "updatedAt": "2025-11-30T23:22:33.428Z",
    "totalEjerciciosProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.428Z"
}
No links

GET
/api/v1/rutinas/{id}/ejercicios
Obtener ejercicios de rutina


Lista todos los ejercicios programados en la rutina ordenados por orden de ejecución

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID de la rutina

id
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 1,
      "semanaBase": 1,
      "diaSemana": 1,
      "orden": 1,
      "series": 4,
      "repeticiones": 12,
      "peso": 60,
      "duracionMinutos": 15,
      "descansoSegundos": 90,
      "notas": "Bajar hasta 90 grados",
      "ejercicio": {
        "id": 5,
        "nombre": "Press Banca",
        "tipoEjercicio": "FUERZA",
        "grupoMuscular": "PECHO",
        "nivelDificultad": "INTERMEDIO"
      }
    }
  ],
  "timestamp": "2025-11-30T23:22:33.432Z"
}
No links

POST
/api/v1/rutinas/{id}/ejercicios
🔐 ADMIN - US-12/US-15: Agregar ejercicio a rutina [RN13]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN13: Series y repeticiones deben ser positivas (@Min(1))
VALIDACIONES AUTOMÁTICAS:

Series >= 1
Repeticiones >= 1
Peso >= 0 (opcional)
UNIT TESTS: 17/17 ✅ en RutinaServiceTest.java

testAgregarEjercicio_SeriesCero_Falla()
testAgregarEjercicio_RepeticionesCero_Falla()
Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID de la rutina

id
Request body

application/json
Example Value
Schema
{
  "ejercicioId": 5,
  "semanaBase": 1,
  "diaSemana": 1,
  "orden": 1,
  "series": 4,
  "repeticiones": 12,
  "peso": 60,
  "duracionMinutos": 15,
  "descansoSegundos": 90,
  "notas": "Bajar hasta 90 grados, mantener la espalda recta"
}
Responses
Code	Description	Links
201	
Ejercicio agregado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "semanaBase": 1,
    "diaSemana": 1,
    "orden": 1,
    "series": 4,
    "repeticiones": 12,
    "peso": 60,
    "duracionMinutos": 15,
    "descansoSegundos": 90,
    "notas": "Bajar hasta 90 grados",
    "ejercicio": {
      "id": 5,
      "nombre": "Press Banca",
      "tipoEjercicio": "FUERZA",
      "grupoMuscular": "PECHO",
      "nivelDificultad": "INTERMEDIO"
    }
  },
  "timestamp": "2025-11-30T23:22:33.440Z"
}
No links
400	
Datos inválidos o series/reps no positivas (RN13)

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "semanaBase": 1,
    "diaSemana": 1,
    "orden": 1,
    "series": 4,
    "repeticiones": 12,
    "peso": 60,
    "duracionMinutos": 15,
    "descansoSegundos": 90,
    "notas": "Bajar hasta 90 grados",
    "ejercicio": {
      "id": 5,
      "nombre": "Press Banca",
      "tipoEjercicio": "FUERZA",
      "grupoMuscular": "PECHO",
      "nivelDificultad": "INTERMEDIO"
    }
  },
  "timestamp": "2025-11-30T23:22:33.444Z"
}
No links
404	
Rutina o ejercicio no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "semanaBase": 1,
    "diaSemana": 1,
    "orden": 1,
    "series": 4,
    "repeticiones": 12,
    "peso": 60,
    "duracionMinutos": 15,
    "descansoSegundos": 90,
    "notas": "Bajar hasta 90 grados",
    "ejercicio": {
      "id": 5,
      "nombre": "Press Banca",
      "tipoEjercicio": "FUERZA",
      "grupoMuscular": "PECHO",
      "nivelDificultad": "INTERMEDIO"
    }
  },
  "timestamp": "2025-11-30T23:22:33.447Z"
}
No links
409	
Ya existe ejercicio en ese orden

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "semanaBase": 1,
    "diaSemana": 1,
    "orden": 1,
    "series": 4,
    "repeticiones": 12,
    "peso": 60,
    "duracionMinutos": 15,
    "descansoSegundos": 90,
    "notas": "Bajar hasta 90 grados",
    "ejercicio": {
      "id": 5,
      "nombre": "Press Banca",
      "tipoEjercicio": "FUERZA",
      "grupoMuscular": "PECHO",
      "nivelDificultad": "INTERMEDIO"
    }
  },
  "timestamp": "2025-11-30T23:22:33.449Z"
}
No links

PATCH
/api/v1/rutinas/{id}/reactivar
🔐 ADMIN: Reactivar rutina eliminada


Reactiva una rutina previamente marcada como inactiva (soft delete). Permite reutilizar rutinas eliminadas en lugar de crear duplicadas.

✅ BENEFICIOS:

Reutiliza configuraciones existentes
Preserva historial y ejercicios
Evita duplicación de datos
⚠️ RESTRICCIONES:

Solo funciona con rutinas inactivas (activo=false)
Si la rutina ya está activa → error 400 Bad Request
Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID de la rutina a reactivar

id
Responses
Code	Description	Links
200	
Rutina reactivada exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Rutina Hipertrofia 12 Semanas",
    "descripcion": "string",
    "duracionSemanas": 12,
    "patronSemanas": 2,
    "nivelDificultad": "INTERMEDIO",
    "activo": true,
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.456Z",
        "updatedAt": "2025-11-30T23:22:33.456Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.456Z",
    "updatedAt": "2025-11-30T23:22:33.456Z",
    "totalEjerciciosProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.456Z"
}
No links
400	
La rutina ya está activa

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Rutina Hipertrofia 12 Semanas",
    "descripcion": "string",
    "duracionSemanas": 12,
    "patronSemanas": 2,
    "nivelDificultad": "INTERMEDIO",
    "activo": true,
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.459Z",
        "updatedAt": "2025-11-30T23:22:33.459Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.459Z",
    "updatedAt": "2025-11-30T23:22:33.459Z",
    "totalEjerciciosProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.459Z"
}
No links
404	
Rutina no encontrada

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Rutina Hipertrofia 12 Semanas",
    "descripcion": "string",
    "duracionSemanas": 12,
    "patronSemanas": 2,
    "nivelDificultad": "INTERMEDIO",
    "activo": true,
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.464Z",
        "updatedAt": "2025-11-30T23:22:33.464Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.464Z",
    "updatedAt": "2025-11-30T23:22:33.464Z",
    "totalEjerciciosProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.464Z"
}
No links

GET
/api/v1/rutinas/catalogo
👤 USER - Ver catálogo de rutinas


US-16: Obtiene rutinas disponibles filtradas por perfil del usuario autenticado. RN15: Sugiere según objetivo. RN16: 🚨FILTRA ALÉRGENOS. SOLO USUARIOS REGULARES.

Parameters
Try it out
Name	Description
sugeridos
boolean
(query)
Filtrar solo rutinas sugeridas según objetivo

Default value : false


false
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Rutina Hipertrofia 12 Semanas",
        "descripcion": "string",
        "duracionSemanas": 12,
        "patronSemanas": 2,
        "nivelDificultad": "INTERMEDIO",
        "activo": true,
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:33.477Z",
            "updatedAt": "2025-11-30T23:22:33.477Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:33.477Z",
        "updatedAt": "2025-11-30T23:22:33.477Z",
        "totalEjerciciosProgramados": 0
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:33.477Z"
}
No links

GET
/api/v1/rutinas/catalogo/{id}
Ver detalle de rutina (Cliente)


US-17: Obtiene detalle de rutina validando alérgenos. RN16: 🚨SEGURIDAD SALUD

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID de la rutina

id
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Rutina Hipertrofia 12 Semanas",
    "descripcion": "string",
    "duracionSemanas": 12,
    "patronSemanas": 2,
    "nivelDificultad": "INTERMEDIO",
    "activo": true,
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.485Z",
        "updatedAt": "2025-11-30T23:22:33.485Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.485Z",
    "updatedAt": "2025-11-30T23:22:33.485Z",
    "totalEjerciciosProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.485Z"
}
No links

GET
/api/v1/rutinas/buscar
Buscar rutinas por nombre


Busca rutinas que contengan el texto especificado (case-insensitive)

Parameters
Try it out
Name	Description
nombre *
string
(query)
Texto a buscar en el nombre

nombre
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Rutina Hipertrofia 12 Semanas",
        "descripcion": "string",
        "duracionSemanas": 12,
        "patronSemanas": 2,
        "nivelDificultad": "INTERMEDIO",
        "activo": true,
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:33.496Z",
            "updatedAt": "2025-11-30T23:22:33.496Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:33.496Z",
        "updatedAt": "2025-11-30T23:22:33.496Z",
        "totalEjerciciosProgramados": 0
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:33.496Z"
}
No links

GET
/api/v1/rutinas/activas
🔐 ADMIN - Listar rutinas activas


Obtiene solo las rutinas activas disponibles para asignar. RN28: Solo activo=true. SOLO ADMINISTRADORES.

Parameters
Try it out
Name	Description
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Rutina Hipertrofia 12 Semanas",
        "descripcion": "string",
        "duracionSemanas": 12,
        "patronSemanas": 2,
        "nivelDificultad": "INTERMEDIO",
        "activo": true,
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:33.507Z",
            "updatedAt": "2025-11-30T23:22:33.507Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:33.507Z",
        "updatedAt": "2025-11-30T23:22:33.507Z",
        "totalEjerciciosProgramados": 0
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:33.507Z"
}
No links
Módulo 5: Tracking de Actividades
👤 USER - Registro y seguimiento de comidas y ejercicios diarios (US-21, US-22, US-23). SOLO USUARIOS REGULARES.



GET
/api/v1/usuario/registros/comidas/{registroId}
👤 USER - Obtener detalle de registro de comida


Consultar información completa de un registro específico. SOLO USUARIOS REGULARES.

Parameters
Try it out
Name	Description
registroId *
integer($int64)
(path)
registroId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "comidaId": 0,
  "comidaNombre": "string",
  "usuarioPlanId": 0,
  "fecha": "2025-11-30",
  "hora": "13:30:00",
  "tipoComida": "DESAYUNO",
  "porciones": 0,
  "caloriasConsumidas": 0,
  "notas": "string"
}
No links

PUT
/api/v1/usuario/registros/comidas/{registroId}
👤 USER - Actualizar registro de comida


Parameters
Try it out
Name	Description
registroId *
integer($int64)
(path)
registroId
Request body

application/json
Example Value
Schema
{
  "comidaId": 5,
  "usuarioPlanId": 1,
  "fecha": "2025-11-05",
  "hora": "13:30:00",
  "tipoComida": "ALMUERZO",
  "porciones": 1,
  "notas": "Comida completa, muy sabrosa"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "comidaId": 0,
  "comidaNombre": "string",
  "usuarioPlanId": 0,
  "fecha": "2025-11-30",
  "hora": "13:30:00",
  "tipoComida": "DESAYUNO",
  "porciones": 0,
  "caloriasConsumidas": 0,
  "notas": "string"
}
No links

DELETE
/api/v1/usuario/registros/comidas/{registroId}
👤 USER - Eliminar registro de comida


US-23: Desmarcar comida completada. SOLO USUARIOS REGULARES.

Parameters
Try it out
Name	Description
registroId *
integer($int64)
(path)
registroId
Responses
Code	Description	Links
200	
OK

No links

POST
/api/v1/usuario/registros/ejercicios
👤 USER - Registrar ejercicio realizado


US-22: Marcar ejercicio como completado. SOLO USUARIOS REGULARES.

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "ejercicioId": 9,
  "usuarioRutinaId": 1,
  "fecha": "2025-11-05",
  "hora": "13:30:00",
  "series": 3,
  "repeticiones": 10,
  "pesoKg": 20,
  "duracionMinutos": 15,
  "notas": "Buen entrenamiento, sin dolor"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "ejercicioId": 0,
  "ejercicioNombre": "string",
  "usuarioRutinaId": 0,
  "fecha": "2025-11-30",
  "hora": "13:30:00",
  "series": 0,
  "repeticiones": 0,
  "pesoKg": 0,
  "duracionMinutos": 0,
  "caloriasQuemadas": 0,
  "notas": "string"
}
No links

POST
/api/v1/usuario/registros/comidas
👤 USER - US-22: Registrar comida [RN20, RN21]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN20: Mostrar checks ✅ en actividades diarias
RN21: No permite marcar si plan está pausado
VALIDACIONES AUTOMÁTICAS:

Usuario debe tener plan ACTIVO
Plan no debe estar en estado PAUSADO
Se marca con timestamp de registro
UNIT TESTS: 1/1 ✅ en UsuarioPlanServiceTest.java

testRegistrarComida_PlanPausado_Falla()
Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "comidaId": 5,
  "usuarioPlanId": 1,
  "fecha": "2025-11-05",
  "hora": "13:30:00",
  "tipoComida": "ALMUERZO",
  "porciones": 1,
  "notas": "Comida completa, muy sabrosa"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "comidaId": 0,
  "comidaNombre": "string",
  "usuarioPlanId": 0,
  "fecha": "2025-11-30",
  "hora": "13:30:00",
  "tipoComida": "DESAYUNO",
  "porciones": 0,
  "caloriasConsumidas": 0,
  "notas": "string"
}
No links

GET
/api/v1/usuario/registros/rutina/hoy
👤 USER - Ver ejercicios de la rutina de hoy


US-21: Obtener ejercicios programados y su estado. SOLO USUARIOS REGULARES.

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "fecha": "2025-11-30",
  "semanaActual": 0,
  "ejercicios": [
    {
      "ejercicioId": 0,
      "nombre": "string",
      "seriesObjetivo": 0,
      "repeticionesObjetivo": 0,
      "pesoSugerido": 0,
      "duracionMinutos": 0,
      "registrado": true,
      "registroId": 0
    }
  ]
}
No links

GET
/api/v1/usuario/registros/rutina/dia
👤 USER - Ver ejercicios de la rutina en una fecha


US-21: Obtener ejercicios de un día específico. SOLO USUARIOS REGULARES.

Parameters
Try it out
Name	Description
fecha *
string($date)
(query)
fecha
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "fecha": "2025-11-30",
  "semanaActual": 0,
  "ejercicios": [
    {
      "ejercicioId": 0,
      "nombre": "string",
      "seriesObjetivo": 0,
      "repeticionesObjetivo": 0,
      "pesoSugerido": 0,
      "duracionMinutos": 0,
      "registrado": true,
      "registroId": 0
    }
  ]
}
No links

GET
/api/v1/usuario/registros/plan/hoy
👤 USER - US-21: Ver actividades del plan [RN20, RN23]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN20: Muestra checks ✅ en actividades completadas
RN23: Gráfico requiere mínimo 2 registros (para tracking)
INFORMACIÓN RETORNADA:

Comidas programadas para el día actual
Estado de completitud (check ✅ si registrada)
Información nutricional (calorías, proteínas, etc.)
Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "fecha": "2025-11-30",
  "diaActual": 0,
  "caloriasObjetivo": 0,
  "caloriasConsumidas": 0,
  "comidas": [
    {
      "comidaId": 0,
      "nombre": "string",
      "tipoComida": "string",
      "calorias": 0,
      "registrada": true,
      "registroId": 0
    }
  ]
}
No links

GET
/api/v1/usuario/registros/plan/dia
👤 USER - Ver actividades del plan en una fecha


US-21: Obtener comidas de un día específico. SOLO USUARIOS REGULARES.

Parameters
Try it out
Name	Description
fecha *
string($date)
(query)
fecha
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "fecha": "2025-11-30",
  "diaActual": 0,
  "caloriasObjetivo": 0,
  "caloriasConsumidas": 0,
  "comidas": [
    {
      "comidaId": 0,
      "nombre": "string",
      "tipoComida": "string",
      "calorias": 0,
      "registrada": true,
      "registroId": 0
    }
  ]
}
No links

GET
/api/v1/usuario/registros/ejercicios/{registroId}
👤 USER - Obtener detalle de registro de ejercicio


Consultar información completa de un registro específico. SOLO USUARIOS REGULARES.

Parameters
Try it out
Name	Description
registroId *
integer($int64)
(path)
registroId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "ejercicioId": 0,
  "ejercicioNombre": "string",
  "usuarioRutinaId": 0,
  "fecha": "2025-11-30",
  "hora": "13:30:00",
  "series": 0,
  "repeticiones": 0,
  "pesoKg": 0,
  "duracionMinutos": 0,
  "caloriasQuemadas": 0,
  "notas": "string"
}
No links

DELETE
/api/v1/usuario/registros/ejercicios/{registroId}
👤 USER - Eliminar registro de ejercicio


US-23: Desmarcar ejercicio completado. SOLO USUARIOS REGULARES.

Parameters
Try it out
Name	Description
registroId *
integer($int64)
(path)
registroId
Responses
Code	Description	Links
200	
OK

No links

GET
/api/v1/usuario/registros/ejercicios/historial
👤 USER - Obtener historial de ejercicios


Consultar registros de ejercicios en un rango de fechas. SOLO USUARIOS REGULARES.

Parameters
Try it out
Name	Description
fechaInicio *
string($date)
(query)
fechaInicio
fechaFin *
string($date)
(query)
fechaFin
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
[
  {
    "id": 0,
    "ejercicioId": 0,
    "ejercicioNombre": "string",
    "usuarioRutinaId": 0,
    "fecha": "2025-11-30",
    "hora": "13:30:00",
    "series": 0,
    "repeticiones": 0,
    "pesoKg": 0,
    "duracionMinutos": 0,
    "caloriasQuemadas": 0,
    "notas": "string"
  }
]
No links

GET
/api/v1/usuario/registros/comidas/hoy


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
[
  {
    "id": 0,
    "comidaId": 0,
    "comidaNombre": "string",
    "usuarioPlanId": 0,
    "fecha": "2025-11-30",
    "hora": "13:30:00",
    "tipoComida": "DESAYUNO",
    "porciones": 0,
    "caloriasConsumidas": 0,
    "notas": "string"
  }
]
No links

GET
/api/v1/usuario/registros/comidas/historial
👤 USER - Obtener historial de comidas


Consultar registros de comidas en un rango de fechas. SOLO USUARIOS REGULARES.

Parameters
Try it out
Name	Description
fechaInicio *
string($date)
(query)
fechaInicio
fechaFin *
string($date)
(query)
fechaFin
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
[
  {
    "id": 0,
    "comidaId": 0,
    "comidaNombre": "string",
    "usuarioPlanId": 0,
    "fecha": "2025-11-30",
    "hora": "13:30:00",
    "tipoComida": "DESAYUNO",
    "porciones": 0,
    "caloriasConsumidas": 0,
    "notas": "string"
  }
]
No links
Módulo 4: Asignación de Metas
👤 USER - Activar, pausar, reanudar y completar planes/rutinas asignadas. SOLO USUARIOS REGULARES.



POST
/api/v1/usuario/rutinas/activar
US-18: Activar rutina de ejercicio


Activa una rutina de ejercicio para el usuario autenticado. RN17: No permite duplicados activos.

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "rutinaId": 1,
  "fechaInicio": "2025-11-05",
  "notas": "Iniciando rutina principiante - 4 semanas"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "rutinaId": 0,
    "rutinaNombre": "string",
    "rutinaDescripcion": "string",
    "rutinaDuracionSemanas": 0,
    "fechaInicio": "2025-11-30",
    "fechaFin": "2025-11-30",
    "semanaActual": 0,
    "estado": "string",
    "notas": "string"
  },
  "timestamp": "2025-11-30T23:22:33.602Z"
}
No links

POST
/api/v1/usuario/planes/activar
👤 USER - US-18: Activar plan nutricional [RN17, RN32]


Activa un plan nutricional para el usuario autenticado.

REGLAS DE NEGOCIO IMPLEMENTADAS:

RN17: No permite duplicar el mismo plan si ya está activo
RN32: Validación cruzada de alérgenos (bloquea si plan contiene alérgenos del usuario)
VALIDACIONES AUTOMÁTICAS:

Query 5-join: Plan → PlanDia → Comida → ComidaIngrediente → Ingrediente → Etiqueta
Intersección de alergias del usuario vs etiquetas de ingredientes del plan
Si hay coincidencia, rechaza activación con mensaje específico de alérgenos
UNIT TESTS: 37/37 ✅ en UsuarioPlanServiceTest.java

testActivarPlan_ConAlergenosIncompatibles() - RN32
testActivarPlan_MismoPlanActivo() - RN17
testActivarPlan_ExitoCuandoNoHayAlergias() - RN32
SOLO USUARIOS REGULARES.

Parameters
Try it out
No parameters

Request body

application/json
Datos para activar el plan

Examples: 
Plan Perdida Peso - 7 dias
Example Value
Schema
{
  "planId": 1,
  "fechaInicio": "2025-11-05",
  "notas": "Iniciando Plan Perdida Peso - 7 dias"
}
Example Description
Test: testActivarPlan_Success() - Plan sin alérgenos incompatibles con usuario demo


Responses
Code	Description	Links
201	
✅ Plan activado exitosamente

Media type

application/json
Controls Accept header.
Examples

Plan Activado
Example Value
{
  "success": true,
  "message": "Plan activado exitosamente",
  "data": {
    "id": 1,
    "planId": 1,
    "planNombre": "Plan Pérdida Peso - 7 días",
    "estado": "ACTIVO",
    "fechaInicio": "2025-11-05",
    "fechaFin": "2025-11-11",
    "diaActual": 1
  }
}
Example Description
Plan Activado


No links
400	
❌ Error: Plan duplicado (RN17) o Alérgenos incompatibles (RN32)

Media type

application/json
Examples

Ya tienes este mismo plan activo
Example Value
{
  "success": false,
  "message": "Ya tienes este plan activo. Para activarlo nuevamente, debes pausarlo o cancelarlo primero",
  "data": null
}
Example Description
Test: testActivarPlan_RN17_MismoPlanActivoLanzaExcepcion()


No links
404	
❌ Error: Plan no encontrado o inactivo

Media type

application/json
Examples

Plan No Encontrado
Example Value
{
  "success": false,
  "message": "Plan no encontrado con ID: 999",
  "data": null
}
Example Description
Plan No Encontrado


No links

PATCH
/api/v1/usuario/rutinas/{usuarioRutinaId}/reanudar
US-19: Reanudar rutina de ejercicio


Reanuda una rutina pausada del usuario autenticado. RN19: Solo permite reanudar rutinas pausadas.

Parameters
Try it out
Name	Description
usuarioRutinaId *
integer($int64)
(path)
usuarioRutinaId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "rutinaId": 0,
    "rutinaNombre": "string",
    "rutinaDescripcion": "string",
    "rutinaDuracionSemanas": 0,
    "fechaInicio": "2025-11-30",
    "fechaFin": "2025-11-30",
    "semanaActual": 0,
    "estado": "string",
    "notas": "string"
  },
  "timestamp": "2025-11-30T23:22:33.617Z"
}
No links

PATCH
/api/v1/usuario/rutinas/{usuarioRutinaId}/pausar
US-19: Pausar rutina de ejercicio


Pausa una rutina activa del usuario autenticado. RN19: No permite pausar si está completada/cancelada.

Parameters
Try it out
Name	Description
usuarioRutinaId *
integer($int64)
(path)
usuarioRutinaId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "rutinaId": 0,
    "rutinaNombre": "string",
    "rutinaDescripcion": "string",
    "rutinaDuracionSemanas": 0,
    "fechaInicio": "2025-11-30",
    "fechaFin": "2025-11-30",
    "semanaActual": 0,
    "estado": "string",
    "notas": "string"
  },
  "timestamp": "2025-11-30T23:22:33.621Z"
}
No links

PATCH
/api/v1/usuario/rutinas/{usuarioRutinaId}/completar
US-20: Completar rutina de ejercicio


Marca la rutina del usuario autenticado como completada. RN26: Valida transiciones de estado.

Parameters
Try it out
Name	Description
usuarioRutinaId *
integer($int64)
(path)
usuarioRutinaId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "rutinaId": 0,
    "rutinaNombre": "string",
    "rutinaDescripcion": "string",
    "rutinaDuracionSemanas": 0,
    "fechaInicio": "2025-11-30",
    "fechaFin": "2025-11-30",
    "semanaActual": 0,
    "estado": "string",
    "notas": "string"
  },
  "timestamp": "2025-11-30T23:22:33.625Z"
}
No links

PATCH
/api/v1/usuario/rutinas/{usuarioRutinaId}/cancelar
US-20: Cancelar rutina de ejercicio


Cancela la rutina del usuario autenticado. RN26: Valida transiciones de estado.

Parameters
Try it out
Name	Description
usuarioRutinaId *
integer($int64)
(path)
usuarioRutinaId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "rutinaId": 0,
    "rutinaNombre": "string",
    "rutinaDescripcion": "string",
    "rutinaDuracionSemanas": 0,
    "fechaInicio": "2025-11-30",
    "fechaFin": "2025-11-30",
    "semanaActual": 0,
    "estado": "string",
    "notas": "string"
  },
  "timestamp": "2025-11-30T23:22:33.630Z"
}
No links

PATCH
/api/v1/usuario/planes/{usuarioPlanId}/reanudar
👤 USER - US-19: Reanudar plan nutricional [RN19, RN26]


Reanuda un plan pausado del usuario autenticado.

REGLAS DE NEGOCIO:

RN19: No permite reanudar si está completado/cancelado
RN26: Solo permite transición PAUSADO → ACTIVO
UNIT TESTS: testReanudarPlan_RN19_CompletadoLanzaExcepcion()

Parameters
Try it out
Name	Description
usuarioPlanId *
integer($int64)
(path)
usuarioPlanId
Responses
Code	Description	Links
200	
✅ Plan reanudado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "planId": 0,
    "planNombre": "string",
    "planDescripcion": "string",
    "planDuracionDias": 0,
    "fechaInicio": "2025-11-30",
    "fechaFin": "2025-11-30",
    "diaActual": 0,
    "estado": "string",
    "notas": "string"
  },
  "timestamp": "2025-11-30T23:22:33.633Z"
}
No links
400	
❌ Error: Plan no pausado (RN19) o completado/cancelado

Media type

application/json
Examples

Solo se pueden reanudar planes pausados
Example Value
{
  "success": false,
  "message": "Solo puedes reanudar planes que están pausados",
  "data": null
}
Example Description
Test: testReanudarPlan_RN19_ActivoLanzaExcepcion()


No links

PATCH
/api/v1/usuario/planes/{usuarioPlanId}/pausar
👤 USER - US-19: Pausar plan nutricional [RN19, RN26]


Pausa un plan activo del usuario autenticado.

REGLAS DE NEGOCIO:

RN19: No permite pausar si está completado/cancelado
RN26: Solo permite transición ACTIVO → PAUSADO
UNIT TESTS: testPausarPlan_RN19_CompletadoLanzaExcepcion()

Parameters
Try it out
Name	Description
usuarioPlanId *
integer($int64)
(path)
usuarioPlanId
Responses
Code	Description	Links
200	
✅ Plan pausado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "planId": 0,
    "planNombre": "string",
    "planDescripcion": "string",
    "planDuracionDias": 0,
    "fechaInicio": "2025-11-30",
    "fechaFin": "2025-11-30",
    "diaActual": 0,
    "estado": "string",
    "notas": "string"
  },
  "timestamp": "2025-11-30T23:22:33.639Z"
}
No links
400	
❌ Error: Plan completado/cancelado (RN19) o no está activo

Media type

application/json
Examples

No se puede pausar plan completado
Example Value
{
  "success": false,
  "message": "No puedes pausar un plan que ya está completado o cancelado",
  "data": null
}
Example Description
Test: testPausarPlan_RN19_CompletadoLanzaExcepcion()


No links

PATCH
/api/v1/usuario/planes/{usuarioPlanId}/completar
US-20: Completar plan nutricional


Marca el plan del usuario autenticado como completado. RN26: Valida transiciones de estado.

Parameters
Try it out
Name	Description
usuarioPlanId *
integer($int64)
(path)
usuarioPlanId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "planId": 0,
    "planNombre": "string",
    "planDescripcion": "string",
    "planDuracionDias": 0,
    "fechaInicio": "2025-11-30",
    "fechaFin": "2025-11-30",
    "diaActual": 0,
    "estado": "string",
    "notas": "string"
  },
  "timestamp": "2025-11-30T23:22:33.645Z"
}
No links

PATCH
/api/v1/usuario/planes/{usuarioPlanId}/cancelar
US-20: Cancelar plan nutricional


Cancela el plan del usuario autenticado. RN26: Valida transiciones de estado.

Parameters
Try it out
Name	Description
usuarioPlanId *
integer($int64)
(path)
usuarioPlanId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "planId": 0,
    "planNombre": "string",
    "planDescripcion": "string",
    "planDuracionDias": 0,
    "fechaInicio": "2025-11-30",
    "fechaFin": "2025-11-30",
    "diaActual": 0,
    "estado": "string",
    "notas": "string"
  },
  "timestamp": "2025-11-30T23:22:33.649Z"
}
No links

GET
/api/v1/usuario/rutinas
Listar todas las rutinas del usuario


Obtiene historial completo de rutinas del usuario autenticado (activas, pausadas, completadas, canceladas)

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 0,
      "rutinaId": 0,
      "rutinaNombre": "string",
      "rutinaDescripcion": "string",
      "rutinaDuracionSemanas": 0,
      "fechaInicio": "2025-11-30",
      "fechaFin": "2025-11-30",
      "semanaActual": 0,
      "estado": "string",
      "notas": "string"
    }
  ],
  "timestamp": "2025-11-30T23:22:33.653Z"
}
No links

GET
/api/v1/usuario/rutinas/activas
Listar rutinas activas


Obtiene todas las rutinas activas del usuario autenticado

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 0,
      "rutinaId": 0,
      "rutinaNombre": "string",
      "rutinaDescripcion": "string",
      "rutinaDuracionSemanas": 0,
      "fechaInicio": "2025-11-30",
      "fechaFin": "2025-11-30",
      "semanaActual": 0,
      "estado": "string",
      "notas": "string"
    }
  ],
  "timestamp": "2025-11-30T23:22:33.656Z"
}
No links

GET
/api/v1/usuario/rutinas/activa
Obtener rutina activa


Obtiene la rutina activa actual del usuario autenticado

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "rutinaId": 0,
    "rutinaNombre": "string",
    "rutinaDescripcion": "string",
    "rutinaDuracionSemanas": 0,
    "fechaInicio": "2025-11-30",
    "fechaFin": "2025-11-30",
    "semanaActual": 0,
    "estado": "string",
    "notas": "string"
  },
  "timestamp": "2025-11-30T23:22:33.660Z"
}
No links

GET
/api/v1/usuario/planes
Listar todos los planes del usuario


Obtiene historial completo de planes del usuario autenticado (activos, pausados, completados, cancelados)

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 0,
      "planId": 0,
      "planNombre": "string",
      "planDescripcion": "string",
      "planDuracionDias": 0,
      "fechaInicio": "2025-11-30",
      "fechaFin": "2025-11-30",
      "diaActual": 0,
      "estado": "string",
      "notas": "string"
    }
  ],
  "timestamp": "2025-11-30T23:22:33.664Z"
}
No links

GET
/api/v1/usuario/planes/activos
Listar planes activos


Obtiene todos los planes activos del usuario autenticado

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 0,
      "planId": 0,
      "planNombre": "string",
      "planDescripcion": "string",
      "planDuracionDias": 0,
      "fechaInicio": "2025-11-30",
      "fechaFin": "2025-11-30",
      "diaActual": 0,
      "estado": "string",
      "notas": "string"
    }
  ],
  "timestamp": "2025-11-30T23:22:33.667Z"
}
No links

GET
/api/v1/usuario/planes/activo
Obtener plan activo


Obtiene el plan activo actual del usuario autenticado

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "planId": 0,
    "planNombre": "string",
    "planDescripcion": "string",
    "planDuracionDias": 0,
    "fechaInicio": "2025-11-30",
    "fechaFin": "2025-11-30",
    "diaActual": 0,
    "estado": "string",
    "notas": "string"
  },
  "timestamp": "2025-11-30T23:22:33.671Z"
}
No links
Módulo 2: Biblioteca de Contenido - Ingredientes
🔐 ADMIN - Gestión del catálogo de ingredientes (US-07) - Fabián Rojas. SOLO ADMINISTRADORES.



GET
/api/v1/ingredientes/{id}
🔐 ADMIN - Obtener ingrediente por ID


Obtiene los detalles de un ingrediente específico. SOLO ADMINISTRADORES.

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del ingrediente

id
Responses
Code	Description	Links
200	
Ingrediente encontrado

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Pechuga de pollo",
    "proteinas": 31,
    "carbohidratos": 0,
    "grasas": 3.6,
    "energia": 165,
    "fibra": 0,
    "categoriaAlimento": "PROTEINAS",
    "descripcion": "string",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.675Z",
        "updatedAt": "2025-11-30T23:22:33.675Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.675Z",
    "updatedAt": "2025-11-30T23:22:33.675Z"
  },
  "timestamp": "2025-11-30T23:22:33.675Z"
}
No links
404	
Ingrediente no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Pechuga de pollo",
    "proteinas": 31,
    "carbohidratos": 0,
    "grasas": 3.6,
    "energia": 165,
    "fibra": 0,
    "categoriaAlimento": "PROTEINAS",
    "descripcion": "string",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.678Z",
        "updatedAt": "2025-11-30T23:22:33.678Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.678Z",
    "updatedAt": "2025-11-30T23:22:33.678Z"
  },
  "timestamp": "2025-11-30T23:22:33.678Z"
}
No links

PUT
/api/v1/ingredientes/{id}
Actualizar ingrediente


Actualiza los datos de un ingrediente existente

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del ingrediente

id
Request body

application/json
Example Value
Schema
{
  "nombre": "Pollo",
  "proteinas": 31,
  "carbohidratos": 0,
  "grasas": 3.6,
  "energia": 165,
  "fibra": 0,
  "categoriaAlimento": "PROTEINAS",
  "descripcion": "Pechuga de pollo sin piel, alta en proteínas y baja en grasas",
  "etiquetaIds": [
    1,
    2,
    3
  ]
}
Responses
Code	Description	Links
200	
Ingrediente actualizado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Pechuga de pollo",
    "proteinas": 31,
    "carbohidratos": 0,
    "grasas": 3.6,
    "energia": 165,
    "fibra": 0,
    "categoriaAlimento": "PROTEINAS",
    "descripcion": "string",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.685Z",
        "updatedAt": "2025-11-30T23:22:33.685Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.685Z",
    "updatedAt": "2025-11-30T23:22:33.685Z"
  },
  "timestamp": "2025-11-30T23:22:33.685Z"
}
No links
400	
Datos inválidos o nombre duplicado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Pechuga de pollo",
    "proteinas": 31,
    "carbohidratos": 0,
    "grasas": 3.6,
    "energia": 165,
    "fibra": 0,
    "categoriaAlimento": "PROTEINAS",
    "descripcion": "string",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.687Z",
        "updatedAt": "2025-11-30T23:22:33.687Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.687Z",
    "updatedAt": "2025-11-30T23:22:33.687Z"
  },
  "timestamp": "2025-11-30T23:22:33.687Z"
}
No links
404	
Ingrediente no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Pechuga de pollo",
    "proteinas": 31,
    "carbohidratos": 0,
    "grasas": 3.6,
    "energia": 165,
    "fibra": 0,
    "categoriaAlimento": "PROTEINAS",
    "descripcion": "string",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.691Z",
        "updatedAt": "2025-11-30T23:22:33.691Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.691Z",
    "updatedAt": "2025-11-30T23:22:33.691Z"
  },
  "timestamp": "2025-11-30T23:22:33.691Z"
}
No links

DELETE
/api/v1/ingredientes/{id}
🔐 ADMIN - US-07: Eliminar ingrediente [RN09]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN09: No permite eliminar ingredientes en uso en recetas
VALIDACIONES AUTOMÁTICAS:

Verifica si ingrediente está en tabla comida_ingredientes
Rechaza eliminación si hay comidas que lo usan
UNIT TESTS: 9/9 ✅ en IngredienteServiceTest.java

testEliminarIngrediente_EnUsoEnComida_Falla()
testEliminarIngrediente_SinUso_Exito()
Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del ingrediente

id
Responses
Code	Description	Links
200	
Ingrediente eliminado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.697Z"
}
No links
404	
Ingrediente no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.698Z"
}
No links
409	
No se puede eliminar - ingrediente en uso

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.700Z"
}
No links

GET
/api/v1/ingredientes
🔐 ADMIN - Listar ingredientes


Obtiene una lista paginada de todos los ingredientes. SOLO ADMINISTRADORES.

Parameters
Try it out
Name	Description
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Pechuga de pollo",
        "proteinas": 31,
        "carbohidratos": 0,
        "grasas": 3.6,
        "energia": 165,
        "fibra": 0,
        "categoriaAlimento": "PROTEINAS",
        "descripcion": "string",
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:33.713Z",
            "updatedAt": "2025-11-30T23:22:33.714Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:33.714Z",
        "updatedAt": "2025-11-30T23:22:33.714Z"
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:33.714Z"
}
No links

POST
/api/v1/ingredientes
🔐 ADMIN - US-07: Crear ingrediente [RN07, RN12]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN07: Ingredientes con nombre único (@Column unique=true)
RN12: Solo permite asignar etiquetas existentes (FK constraint)
UNIT TESTS: 9/9 ✅ en IngredienteServiceTest.java

testCrearIngrediente_NombreDuplicado_Falla()
testCrearIngrediente_EtiquetaInexistente_Falla()
Ejecutar: ./mvnw test -Dtest=IngredienteServiceTest

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "nombre": "Pollo",
  "proteinas": 31,
  "carbohidratos": 0,
  "grasas": 3.6,
  "energia": 165,
  "fibra": 0,
  "categoriaAlimento": "PROTEINAS",
  "descripcion": "Pechuga de pollo sin piel, alta en proteínas y baja en grasas",
  "etiquetaIds": [
    1,
    2,
    3
  ]
}
Responses
Code	Description	Links
201	
Ingrediente creado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Pechuga de pollo",
    "proteinas": 31,
    "carbohidratos": 0,
    "grasas": 3.6,
    "energia": 165,
    "fibra": 0,
    "categoriaAlimento": "PROTEINAS",
    "descripcion": "string",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.721Z",
        "updatedAt": "2025-11-30T23:22:33.721Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.721Z",
    "updatedAt": "2025-11-30T23:22:33.721Z"
  },
  "timestamp": "2025-11-30T23:22:33.721Z"
}
No links
400	
Datos inválidos o nombre duplicado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Pechuga de pollo",
    "proteinas": 31,
    "carbohidratos": 0,
    "grasas": 3.6,
    "energia": 165,
    "fibra": 0,
    "categoriaAlimento": "PROTEINAS",
    "descripcion": "string",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.724Z",
        "updatedAt": "2025-11-30T23:22:33.724Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.724Z",
    "updatedAt": "2025-11-30T23:22:33.724Z"
  },
  "timestamp": "2025-11-30T23:22:33.724Z"
}
No links
401	
No autenticado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Pechuga de pollo",
    "proteinas": 31,
    "carbohidratos": 0,
    "grasas": 3.6,
    "energia": 165,
    "fibra": 0,
    "categoriaAlimento": "PROTEINAS",
    "descripcion": "string",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.726Z",
        "updatedAt": "2025-11-30T23:22:33.726Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.726Z",
    "updatedAt": "2025-11-30T23:22:33.726Z"
  },
  "timestamp": "2025-11-30T23:22:33.726Z"
}
No links
403	
No autorizado - requiere rol ADMIN

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Pechuga de pollo",
    "proteinas": 31,
    "carbohidratos": 0,
    "grasas": 3.6,
    "energia": 165,
    "fibra": 0,
    "categoriaAlimento": "PROTEINAS",
    "descripcion": "string",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.729Z",
        "updatedAt": "2025-11-30T23:22:33.729Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.729Z",
    "updatedAt": "2025-11-30T23:22:33.729Z"
  },
  "timestamp": "2025-11-30T23:22:33.729Z"
}
No links

GET
/api/v1/ingredientes/categoria/{categoria}
Filtrar por categoría


Obtiene ingredientes de una categoría específica

Parameters
Try it out
Name	Description
categoria *
string
(path)
Categoría del ingrediente

Available values : FRUTAS, VERDURAS, CEREALES, LEGUMBRES, PROTEINAS, LACTEOS, GRASAS_SALUDABLES, AZUCARES, BEBIDAS, CONDIMENTOS, FRUTOS_SECOS, SEMILLAS, TUBERCULOS, OTRO


FRUTAS
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Pechuga de pollo",
        "proteinas": 31,
        "carbohidratos": 0,
        "grasas": 3.6,
        "energia": 165,
        "fibra": 0,
        "categoriaAlimento": "PROTEINAS",
        "descripcion": "string",
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:33.738Z",
            "updatedAt": "2025-11-30T23:22:33.738Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:33.738Z",
        "updatedAt": "2025-11-30T23:22:33.738Z"
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:33.738Z"
}
No links

GET
/api/v1/ingredientes/buscar
Buscar ingredientes por nombre


Busca ingredientes que contengan el texto especificado (case-insensitive)

Parameters
Try it out
Name	Description
nombre *
string
(query)
Texto a buscar en el nombre

nombre
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Pechuga de pollo",
        "proteinas": 31,
        "carbohidratos": 0,
        "grasas": 3.6,
        "energia": 165,
        "fibra": 0,
        "categoriaAlimento": "PROTEINAS",
        "descripcion": "string",
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:33.748Z",
            "updatedAt": "2025-11-30T23:22:33.748Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:33.748Z",
        "updatedAt": "2025-11-30T23:22:33.748Z"
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:33.748Z"
}
No links
Módulo 1: Autenticación y Perfil - Gestión de Perfil
👤 USER - Gestión del perfil de usuario y mediciones (US-03, US-04, US-05) - Leonel Alzamora. SOLO USUARIOS REGULARES.



GET
/api/v1/perfil/salud
Obtener perfil de salud


Retorna el perfil de salud completo del usuario (US-04)

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "objetivoActual": "PERDER_PESO",
    "nivelActividadActual": "BAJO",
    "notas": "string",
    "etiquetas": [
      {
        "id": 0,
        "nombre": "string",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "string"
      }
    ]
  },
  "timestamp": "2025-11-30T23:22:33.753Z"
}
No links

PUT
/api/v1/perfil/salud
Actualizar perfil de salud


Actualiza objetivo de salud, nivel de actividad y etiquetas de salud (US-04)

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "objetivoActual": "PERDER_PESO",
  "nivelActividadActual": "MODERADO",
  "etiquetasId": [
    1,
    5,
    12
  ]
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "objetivoActual": "PERDER_PESO",
    "nivelActividadActual": "BAJO",
    "notas": "string",
    "etiquetas": [
      {
        "id": 0,
        "nombre": "string",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "string"
      }
    ]
  },
  "timestamp": "2025-11-30T23:22:33.763Z"
}
No links

POST
/api/v1/perfil/salud
👤 USER - US-04: Crear perfil de salud [RN04, RN12]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN04: Perfil de salud usa etiquetas maestras de la tabla etiquetas
RN12: Solo permite asignar etiquetas existentes (validación FK)
UNIT TESTS: 11/11 ✅ en PerfilServiceTest.java

testActualizarPerfilSalud_ValidaEtiquetasExistentes()
testCrearPerfilSalud_ConObjetivoYEtiquetas()
Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "objetivoActual": "PERDER_PESO",
  "nivelActividadActual": "MODERADO",
  "etiquetasId": [
    1,
    5,
    12
  ]
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "objetivoActual": "PERDER_PESO",
    "nivelActividadActual": "BAJO",
    "notas": "string",
    "etiquetas": [
      {
        "id": 0,
        "nombre": "string",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "string"
      }
    ]
  },
  "timestamp": "2025-11-30T23:22:33.769Z"
}
No links

PUT
/api/v1/perfil/mediciones/{id}
Actualizar medición corporal


Actualiza una medición existente del usuario (US-24)

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
Request body

application/json
Example Value
Schema
{
  "peso": 75.5,
  "altura": 175,
  "fechaMedicion": "2025-11-04",
  "unidadPeso": "KG"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "peso": 0,
    "altura": 0,
    "imc": 0,
    "fechaMedicion": "2025-11-30",
    "unidadPeso": "KG"
  },
  "timestamp": "2025-11-30T23:22:33.775Z"
}
No links

DELETE
/api/v1/perfil/mediciones/{id}
Eliminar medición corporal


Elimina una medición existente del usuario (US-24)

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.779Z"
}
No links

GET
/api/v1/perfil/mediciones
Obtener historial de mediciones


Retorna todas las mediciones del usuario ordenadas por fecha (US-05)

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 0,
      "peso": 0,
      "altura": 0,
      "imc": 0,
      "fechaMedicion": "2025-11-30",
      "unidadPeso": "KG"
    }
  ],
  "timestamp": "2025-11-30T23:22:33.783Z"
}
No links

POST
/api/v1/perfil/mediciones
👤 USER - US-24: Registrar medición corporal [RN22]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN22: Validación de mediciones en rango (peso: 20-300kg, altura: 50-250cm)
VALIDACIONES AUTOMÁTICAS:

Peso debe estar entre 20 y 300 kg
Altura debe estar entre 50 y 250 cm
Fecha no puede ser futura
UNIT TESTS: 11/11 ✅ en PerfilServiceTest.java

testRegistrarMedicion_PesoFueraDeRango()
testRegistrarMedicion_AlturaFueraDeRango()
Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "peso": 75.5,
  "altura": 175,
  "fechaMedicion": "2025-11-04",
  "unidadPeso": "KG"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "peso": 0,
    "altura": 0,
    "imc": 0,
    "fechaMedicion": "2025-11-30",
    "unidadPeso": "KG"
  },
  "timestamp": "2025-11-30T23:22:33.790Z"
}
No links

PATCH
/api/v1/perfil/unidades
👤 USER - US-03: Actualizar unidades de medida [RN03, RN27]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN03: La unidad aplica a todas las vistas del sistema
RN27: Conversión automática KG ↔ LBS (almacena en KG en BD)
UNIT TESTS: 11/11 ✅ en PerfilServiceTest.java

testActualizarUnidades_ConversionKGaLBS()
testObtenerPerfil_MuestraPesoEnLBS()
Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "unidadesMedida": "KG"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.796Z"
}
No links

GET
/api/v1/perfil/completo
👤 USER - Obtener perfil completo del usuario


Retorna toda la información del usuario en un solo endpoint:

Datos de cuenta (email, rol, fecha registro)
Datos personales (nombre, apellido, unidades)
Perfil de salud (objetivo, nivel actividad, etiquetas)
Última medición corporal (peso, altura, IMC)
Estadísticas básicas (total mediciones)
Útil para pantallas de perfil y dashboard del usuario.

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "email": "string",
    "rol": "string",
    "activo": true,
    "fechaRegistro": "2025-11-30",
    "nombre": "string",
    "apellido": "string",
    "nombreCompleto": "string",
    "unidadesMedida": "KG",
    "fechaInicioApp": "2025-11-30",
    "perfilSalud": {
      "id": 0,
      "objetivoActual": "string",
      "nivelActividadActual": "string",
      "fechaActualizacion": "2025-11-30",
      "etiquetas": [
        {
          "id": 0,
          "nombre": "string",
          "tipoEtiqueta": "string",
          "descripcion": "string"
        }
      ]
    },
    "ultimaMedicion": {
      "id": 0,
      "peso": 0,
      "altura": 0,
      "imc": 0,
      "fechaMedicion": "2025-11-30",
      "unidadPeso": "KG",
      "categoriaIMC": "string"
    },
    "totalMediciones": 0
  },
  "timestamp": "2025-11-30T23:22:33.798Z"
}
No links
Módulo 2: Biblioteca de Contenido - Etiquetas
🔐 ADMIN - Gestión del catálogo de etiquetas (US-06) - Fabián Rojas. SOLO ADMINISTRADORES.



GET
/api/v1/etiquetas/{id}
🔐 ADMIN - Obtener etiqueta por ID


Obtiene los detalles de una etiqueta específica. SOLO ADMINISTRADORES.

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID de la etiqueta

id
Responses
Code	Description	Links
200	
Etiqueta encontrada

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Gluten",
    "tipoEtiqueta": "ALERGIA",
    "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
    "createdAt": "2025-11-30T23:22:33.804Z",
    "updatedAt": "2025-11-30T23:22:33.804Z"
  },
  "timestamp": "2025-11-30T23:22:33.804Z"
}
No links
404	
Etiqueta no encontrada

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Gluten",
    "tipoEtiqueta": "ALERGIA",
    "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
    "createdAt": "2025-11-30T23:22:33.805Z",
    "updatedAt": "2025-11-30T23:22:33.805Z"
  },
  "timestamp": "2025-11-30T23:22:33.805Z"
}
No links

PUT
/api/v1/etiquetas/{id}
Actualizar etiqueta


Actualiza los datos de una etiqueta existente

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID de la etiqueta

id
Request body

application/json
Example Value
Schema
{
  "nombre": "Sin Gluten",
  "tipoEtiqueta": "ALERGIA",
  "descripcion": "Apto para personas con intolerancia o alergia al gluten"
}
Responses
Code	Description	Links
200	
Etiqueta actualizada exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Gluten",
    "tipoEtiqueta": "ALERGIA",
    "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
    "createdAt": "2025-11-30T23:22:33.811Z",
    "updatedAt": "2025-11-30T23:22:33.811Z"
  },
  "timestamp": "2025-11-30T23:22:33.811Z"
}
No links
400	
Datos inválidos o nombre duplicado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Gluten",
    "tipoEtiqueta": "ALERGIA",
    "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
    "createdAt": "2025-11-30T23:22:33.814Z",
    "updatedAt": "2025-11-30T23:22:33.814Z"
  },
  "timestamp": "2025-11-30T23:22:33.814Z"
}
No links
404	
Etiqueta no encontrada

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Gluten",
    "tipoEtiqueta": "ALERGIA",
    "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
    "createdAt": "2025-11-30T23:22:33.816Z",
    "updatedAt": "2025-11-30T23:22:33.816Z"
  },
  "timestamp": "2025-11-30T23:22:33.816Z"
}
No links

DELETE
/api/v1/etiquetas/{id}
🔐 ADMIN - US-06: Eliminar etiqueta [RN08]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN08: No permite eliminar etiquetas en uso
VALIDACIONES AUTOMÁTICAS:

Verifica si etiqueta está en ingredientes (ingrediente_etiquetas)
Verifica si etiqueta está en ejercicios (ejercicio_etiquetas)
Verifica si etiqueta está en perfiles (usuario_etiquetas_salud)
Rechaza eliminación si hay referencias
UNIT TESTS: 12/12 ✅ en EtiquetaServiceTest.java

testEliminarEtiqueta_EnUsoEnIngrediente_Falla()
testEliminarEtiqueta_EnUsoEnEjercicio_Falla()
testEliminarEtiqueta_EnUsoEnPerfil_Falla()
Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID de la etiqueta

id
Responses
Code	Description	Links
200	
Etiqueta eliminada exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.820Z"
}
No links
404	
Etiqueta no encontrada

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.821Z"
}
No links
409	
No se puede eliminar - etiqueta en uso

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.823Z"
}
No links

GET
/api/v1/etiquetas
Listar todas las etiquetas


Obtiene una lista paginada de todas las etiquetas

Parameters
Try it out
Name	Description
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.829Z",
        "updatedAt": "2025-11-30T23:22:33.829Z"
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:33.829Z"
}
No links

POST
/api/v1/etiquetas
🔐 ADMIN - US-06: Crear etiqueta [RN06]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN06: Etiquetas con nombre único (@Column unique=true)
UNIT TESTS: 12/12 ✅ en EtiquetaServiceTest.java

testCrearEtiqueta_NombreDuplicado_Falla()
testCrearEtiqueta_NombreUnico_Exito()
Ejecutar: ./mvnw test -Dtest=EtiquetaServiceTest

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "nombre": "Sin Gluten",
  "tipoEtiqueta": "ALERGIA",
  "descripcion": "Apto para personas con intolerancia o alergia al gluten"
}
Responses
Code	Description	Links
201	
Etiqueta creada exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Gluten",
    "tipoEtiqueta": "ALERGIA",
    "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
    "createdAt": "2025-11-30T23:22:33.835Z",
    "updatedAt": "2025-11-30T23:22:33.835Z"
  },
  "timestamp": "2025-11-30T23:22:33.835Z"
}
No links
400	
Datos inválidos o nombre duplicado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Gluten",
    "tipoEtiqueta": "ALERGIA",
    "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
    "createdAt": "2025-11-30T23:22:33.837Z",
    "updatedAt": "2025-11-30T23:22:33.837Z"
  },
  "timestamp": "2025-11-30T23:22:33.837Z"
}
No links
401	
No autenticado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Gluten",
    "tipoEtiqueta": "ALERGIA",
    "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
    "createdAt": "2025-11-30T23:22:33.843Z",
    "updatedAt": "2025-11-30T23:22:33.843Z"
  },
  "timestamp": "2025-11-30T23:22:33.843Z"
}
No links
403	
No autorizado - requiere rol ADMIN

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Gluten",
    "tipoEtiqueta": "ALERGIA",
    "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
    "createdAt": "2025-11-30T23:22:33.846Z",
    "updatedAt": "2025-11-30T23:22:33.846Z"
  },
  "timestamp": "2025-11-30T23:22:33.846Z"
}
No links

GET
/api/v1/etiquetas/buscar
Buscar etiquetas por nombre


Busca etiquetas que contengan el texto especificado (case-insensitive)

Parameters
Try it out
Name	Description
nombre *
string
(query)
Texto a buscar en el nombre

nombre
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.853Z",
        "updatedAt": "2025-11-30T23:22:33.853Z"
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:33.853Z"
}
No links
Módulo 2: Biblioteca de Contenido - Ejercicios
🔐 ADMIN - Gestión del catálogo de ejercicios (US-08) - Fabián Rojas. SOLO ADMINISTRADORES.



GET
/api/v1/ejercicios/{id}
🔐 ADMIN - Obtener ejercicio por ID


Obtiene los detalles de un ejercicio específico. SOLO ADMINISTRADORES.

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del ejercicio

id
Responses
Code	Description	Links
200	
Ejercicio encontrado

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Sentadillas",
    "descripcion": "string",
    "tipoEjercicio": "FUERZA",
    "grupoMuscular": "PIERNAS",
    "nivelDificultad": "INTERMEDIO",
    "caloriasQuemadasPorMinuto": 8.5,
    "duracionEstimadaMinutos": 15,
    "equipoNecesario": "Barra olímpica, discos de peso",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.859Z",
        "updatedAt": "2025-11-30T23:22:33.859Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.859Z",
    "updatedAt": "2025-11-30T23:22:33.859Z"
  },
  "timestamp": "2025-11-30T23:22:33.859Z"
}
No links
404	
Ejercicio no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Sentadillas",
    "descripcion": "string",
    "tipoEjercicio": "FUERZA",
    "grupoMuscular": "PIERNAS",
    "nivelDificultad": "INTERMEDIO",
    "caloriasQuemadasPorMinuto": 8.5,
    "duracionEstimadaMinutos": 15,
    "equipoNecesario": "Barra olímpica, discos de peso",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.861Z",
        "updatedAt": "2025-11-30T23:22:33.861Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.861Z",
    "updatedAt": "2025-11-30T23:22:33.861Z"
  },
  "timestamp": "2025-11-30T23:22:33.861Z"
}
No links

PUT
/api/v1/ejercicios/{id}
Actualizar ejercicio


Actualiza los datos de un ejercicio existente

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del ejercicio

id
Request body

application/json
Example Value
Schema
{
  "nombre": "Sentadillas",
  "descripcion": "Ejercicio compuesto que trabaja piernas y glúteos. Mantén la espalda recta y desciende hasta que los muslos estén paralelos al suelo.",
  "tipoEjercicio": "FUERZA",
  "grupoMuscular": "PIERNAS",
  "nivelDificultad": "INTERMEDIO",
  "caloriasQuemadasPorMinuto": 8.5,
  "duracionEstimadaMinutos": 15,
  "equipoNecesario": "Barra olímpica, discos de peso",
  "etiquetaIds": [
    1,
    2,
    3
  ]
}
Responses
Code	Description	Links
200	
Ejercicio actualizado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Sentadillas",
    "descripcion": "string",
    "tipoEjercicio": "FUERZA",
    "grupoMuscular": "PIERNAS",
    "nivelDificultad": "INTERMEDIO",
    "caloriasQuemadasPorMinuto": 8.5,
    "duracionEstimadaMinutos": 15,
    "equipoNecesario": "Barra olímpica, discos de peso",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.868Z",
        "updatedAt": "2025-11-30T23:22:33.868Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.868Z",
    "updatedAt": "2025-11-30T23:22:33.868Z"
  },
  "timestamp": "2025-11-30T23:22:33.868Z"
}
No links
400	
Datos inválidos o nombre duplicado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Sentadillas",
    "descripcion": "string",
    "tipoEjercicio": "FUERZA",
    "grupoMuscular": "PIERNAS",
    "nivelDificultad": "INTERMEDIO",
    "caloriasQuemadasPorMinuto": 8.5,
    "duracionEstimadaMinutos": 15,
    "equipoNecesario": "Barra olímpica, discos de peso",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.870Z",
        "updatedAt": "2025-11-30T23:22:33.870Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.870Z",
    "updatedAt": "2025-11-30T23:22:33.870Z"
  },
  "timestamp": "2025-11-30T23:22:33.870Z"
}
No links
404	
Ejercicio no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Sentadillas",
    "descripcion": "string",
    "tipoEjercicio": "FUERZA",
    "grupoMuscular": "PIERNAS",
    "nivelDificultad": "INTERMEDIO",
    "caloriasQuemadasPorMinuto": 8.5,
    "duracionEstimadaMinutos": 15,
    "equipoNecesario": "Barra olímpica, discos de peso",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.872Z",
        "updatedAt": "2025-11-30T23:22:33.872Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.872Z",
    "updatedAt": "2025-11-30T23:22:33.872Z"
  },
  "timestamp": "2025-11-30T23:22:33.872Z"
}
No links

DELETE
/api/v1/ejercicios/{id}
🔐 ADMIN - US-08: Eliminar ejercicio [RN09]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN09: No permite eliminar ejercicios en uso en rutinas
VALIDACIONES AUTOMÁTICAS:

Verifica si ejercicio está en tabla rutina_ejercicios
Rechaza eliminación si hay rutinas que lo usan
UNIT TESTS: 9/9 ✅ en EjercicioServiceTest.java

testEliminarEjercicio_EnUsoEnRutina_Falla()
testEliminarEjercicio_SinUso_Exito()
Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del ejercicio

id
Responses
Code	Description	Links
200	
Ejercicio eliminado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.877Z"
}
No links
404	
Ejercicio no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.878Z"
}
No links
409	
No se puede eliminar - ejercicio en uso

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.879Z"
}
No links

GET
/api/v1/ejercicios
Listar todos los ejercicios


Obtiene una lista paginada de todos los ejercicios

Parameters
Try it out
Name	Description
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Sentadillas",
        "descripcion": "string",
        "tipoEjercicio": "FUERZA",
        "grupoMuscular": "PIERNAS",
        "nivelDificultad": "INTERMEDIO",
        "caloriasQuemadasPorMinuto": 8.5,
        "duracionEstimadaMinutos": 15,
        "equipoNecesario": "Barra olímpica, discos de peso",
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:33.885Z",
            "updatedAt": "2025-11-30T23:22:33.885Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:33.885Z",
        "updatedAt": "2025-11-30T23:22:33.885Z"
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:33.885Z"
}
No links

POST
/api/v1/ejercicios
🔐 ADMIN - US-08: Crear ejercicio [RN07, RN12]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN07: Ejercicios con nombre único (@Column unique=true)
RN12: Solo permite asignar etiquetas existentes (FK constraint)
UNIT TESTS: 9/9 ✅ en EjercicioServiceTest.java

testCrearEjercicio_NombreDuplicado_Falla()
testCrearEjercicio_EtiquetaInexistente_Falla()
Ejecutar: ./mvnw test -Dtest=EjercicioServiceTest

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "nombre": "Sentadillas",
  "descripcion": "Ejercicio compuesto que trabaja piernas y glúteos. Mantén la espalda recta y desciende hasta que los muslos estén paralelos al suelo.",
  "tipoEjercicio": "FUERZA",
  "grupoMuscular": "PIERNAS",
  "nivelDificultad": "INTERMEDIO",
  "caloriasQuemadasPorMinuto": 8.5,
  "duracionEstimadaMinutos": 15,
  "equipoNecesario": "Barra olímpica, discos de peso",
  "etiquetaIds": [
    1,
    2,
    3
  ]
}
Responses
Code	Description	Links
201	
Ejercicio creado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Sentadillas",
    "descripcion": "string",
    "tipoEjercicio": "FUERZA",
    "grupoMuscular": "PIERNAS",
    "nivelDificultad": "INTERMEDIO",
    "caloriasQuemadasPorMinuto": 8.5,
    "duracionEstimadaMinutos": 15,
    "equipoNecesario": "Barra olímpica, discos de peso",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.892Z",
        "updatedAt": "2025-11-30T23:22:33.892Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.892Z",
    "updatedAt": "2025-11-30T23:22:33.892Z"
  },
  "timestamp": "2025-11-30T23:22:33.892Z"
}
No links
400	
Datos inválidos o nombre duplicado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Sentadillas",
    "descripcion": "string",
    "tipoEjercicio": "FUERZA",
    "grupoMuscular": "PIERNAS",
    "nivelDificultad": "INTERMEDIO",
    "caloriasQuemadasPorMinuto": 8.5,
    "duracionEstimadaMinutos": 15,
    "equipoNecesario": "Barra olímpica, discos de peso",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.894Z",
        "updatedAt": "2025-11-30T23:22:33.894Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.894Z",
    "updatedAt": "2025-11-30T23:22:33.894Z"
  },
  "timestamp": "2025-11-30T23:22:33.894Z"
}
No links
401	
No autenticado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Sentadillas",
    "descripcion": "string",
    "tipoEjercicio": "FUERZA",
    "grupoMuscular": "PIERNAS",
    "nivelDificultad": "INTERMEDIO",
    "caloriasQuemadasPorMinuto": 8.5,
    "duracionEstimadaMinutos": 15,
    "equipoNecesario": "Barra olímpica, discos de peso",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.897Z",
        "updatedAt": "2025-11-30T23:22:33.897Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.897Z",
    "updatedAt": "2025-11-30T23:22:33.897Z"
  },
  "timestamp": "2025-11-30T23:22:33.897Z"
}
No links
403	
No autorizado - requiere rol ADMIN

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Sentadillas",
    "descripcion": "string",
    "tipoEjercicio": "FUERZA",
    "grupoMuscular": "PIERNAS",
    "nivelDificultad": "INTERMEDIO",
    "caloriasQuemadasPorMinuto": 8.5,
    "duracionEstimadaMinutos": 15,
    "equipoNecesario": "Barra olímpica, discos de peso",
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.900Z",
        "updatedAt": "2025-11-30T23:22:33.900Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.900Z",
    "updatedAt": "2025-11-30T23:22:33.900Z"
  },
  "timestamp": "2025-11-30T23:22:33.900Z"
}
No links

GET
/api/v1/ejercicios/filtrar
Filtrar ejercicios


Filtra ejercicios por tipo, grupo muscular y/o nivel de dificultad

Parameters
Try it out
Name	Description
tipo
string
(query)
Tipo de ejercicio

Available values : CARDIO, FUERZA, FLEXIBILIDAD, EQUILIBRIO, HIIT, YOGA, PILATES, FUNCIONAL, DEPORTIVO, REHABILITACION, OTRO


--
grupo
string
(query)
Grupo muscular

Available values : PECHO, ESPALDA, HOMBROS, BRAZOS, BICEPS, TRICEPS, ABDOMINALES, PIERNAS, CUADRICEPS, ISQUIOTIBIALES, GLUTEOS, GEMELOS, CORE, CARDIO, CUERPO_COMPLETO, OTRO


--
nivel
string
(query)
Nivel de dificultad

Available values : PRINCIPIANTE, INTERMEDIO, AVANZADO, EXPERTO


--
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Sentadillas",
        "descripcion": "string",
        "tipoEjercicio": "FUERZA",
        "grupoMuscular": "PIERNAS",
        "nivelDificultad": "INTERMEDIO",
        "caloriasQuemadasPorMinuto": 8.5,
        "duracionEstimadaMinutos": 15,
        "equipoNecesario": "Barra olímpica, discos de peso",
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:33.912Z",
            "updatedAt": "2025-11-30T23:22:33.912Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:33.912Z",
        "updatedAt": "2025-11-30T23:22:33.912Z"
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:33.912Z"
}
No links

GET
/api/v1/ejercicios/buscar
Buscar ejercicios por nombre


Busca ejercicios que contengan el texto especificado (case-insensitive)

Parameters
Try it out
Name	Description
nombre *
string
(query)
Texto a buscar en el nombre

nombre
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Sentadillas",
        "descripcion": "string",
        "tipoEjercicio": "FUERZA",
        "grupoMuscular": "PIERNAS",
        "nivelDificultad": "INTERMEDIO",
        "caloriasQuemadasPorMinuto": 8.5,
        "duracionEstimadaMinutos": 15,
        "equipoNecesario": "Barra olímpica, discos de peso",
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:33.921Z",
            "updatedAt": "2025-11-30T23:22:33.921Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:33.921Z",
        "updatedAt": "2025-11-30T23:22:33.921Z"
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:33.921Z"
}
No links
Módulo 3: Gestor de Catálogo - Planes Nutricionales
🔐 ADMIN: Gestión completa | 👤 USER: Ver catálogo filtrado por perfil (US-11 a US-14) - Jhamil Peña



GET
/api/v1/planes/{id}
🔐 ADMIN - Obtener plan por ID


Obtiene los detalles completos de un plan incluyendo objetivos nutricionales. SOLO ADMINISTRADORES.

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del plan

id
Responses
Code	Description	Links
200	
Plan encontrado

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Plan Pérdida de Peso 30 días",
    "descripcion": "string",
    "duracionDias": 30,
    "activo": true,
    "objetivo": {
      "caloriasObjetivo": 1500,
      "proteinasObjetivo": 120,
      "carbohidratosObjetivo": 150,
      "grasasObjetivo": 50,
      "descripcion": "string"
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.927Z",
        "updatedAt": "2025-11-30T23:22:33.927Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.927Z",
    "updatedAt": "2025-11-30T23:22:33.927Z",
    "totalDiasProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.927Z"
}
No links
404	
Plan no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Plan Pérdida de Peso 30 días",
    "descripcion": "string",
    "duracionDias": 30,
    "activo": true,
    "objetivo": {
      "caloriasObjetivo": 1500,
      "proteinasObjetivo": 120,
      "carbohidratosObjetivo": 150,
      "grasasObjetivo": 50,
      "descripcion": "string"
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.929Z",
        "updatedAt": "2025-11-30T23:22:33.929Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.929Z",
    "updatedAt": "2025-11-30T23:22:33.929Z",
    "totalDiasProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.929Z"
}
No links

PUT
/api/v1/planes/{id}
Actualizar plan


Actualiza un plan existente. RN11: Nombre debe ser único.

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del plan

id
Request body

application/json
Example Value
Schema
{
  "nombre": "Plan Pérdida de Peso 30 días",
  "descripcion": "Plan nutricional diseñado para perder peso de forma saludable",
  "duracionDias": 30,
  "objetivo": {
    "caloriasObjetivo": 1500,
    "proteinasObjetivo": 120,
    "carbohidratosObjetivo": 150,
    "grasasObjetivo": 50,
    "descripcion": "Déficit calórico moderado con alta proteína"
  },
  "etiquetaIds": [
    1,
    2,
    3
  ]
}
Responses
Code	Description	Links
200	
Plan actualizado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Plan Pérdida de Peso 30 días",
    "descripcion": "string",
    "duracionDias": 30,
    "activo": true,
    "objetivo": {
      "caloriasObjetivo": 1500,
      "proteinasObjetivo": 120,
      "carbohidratosObjetivo": 150,
      "grasasObjetivo": 50,
      "descripcion": "string"
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.935Z",
        "updatedAt": "2025-11-30T23:22:33.935Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.935Z",
    "updatedAt": "2025-11-30T23:22:33.935Z",
    "totalDiasProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.935Z"
}
No links
400	
Datos inválidos o nombre duplicado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Plan Pérdida de Peso 30 días",
    "descripcion": "string",
    "duracionDias": 30,
    "activo": true,
    "objetivo": {
      "caloriasObjetivo": 1500,
      "proteinasObjetivo": 120,
      "carbohidratosObjetivo": 150,
      "grasasObjetivo": 50,
      "descripcion": "string"
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.938Z",
        "updatedAt": "2025-11-30T23:22:33.938Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.938Z",
    "updatedAt": "2025-11-30T23:22:33.938Z",
    "totalDiasProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.938Z"
}
No links
404	
Plan no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Plan Pérdida de Peso 30 días",
    "descripcion": "string",
    "duracionDias": 30,
    "activo": true,
    "objetivo": {
      "caloriasObjetivo": 1500,
      "proteinasObjetivo": 120,
      "carbohidratosObjetivo": 150,
      "grasasObjetivo": 50,
      "descripcion": "string"
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.941Z",
        "updatedAt": "2025-11-30T23:22:33.941Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.941Z",
    "updatedAt": "2025-11-30T23:22:33.941Z",
    "totalDiasProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.941Z"
}
No links

DELETE
/api/v1/planes/{id}
🔐 ADMIN - US-14: Eliminar plan [RN14, RN28]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN14: No permite eliminar plan si tiene usuarios activos
RN28: Soft delete - marca activo=false en lugar de DELETE
VALIDACIONES AUTOMÁTICAS:

Verifica si plan tiene registros en usuario_planes con estado ACTIVO
Rechaza eliminación si hay usuarios activos
Si no hay usuarios, marca activo=false
UNIT TESTS: 22/22 ✅ en PlanServiceTest.java

testEliminarPlan_ConUsuariosActivos_Falla()
testEliminarPlan_SinUsuarios_SoftDelete()
Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del plan

id
Responses
Code	Description	Links
200	
Plan eliminado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.946Z"
}
No links
404	
Plan no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.947Z"
}
No links
409	
No se puede eliminar - tiene usuarios activos (RN14)

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:33.949Z"
}
No links

GET
/api/v1/planes
🔐 ADMIN - Listar todos los planes


Obtiene lista paginada de todos los planes incluyendo inactivos. SOLO ADMINISTRADORES.

Parameters
Try it out
Name	Description
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Plan Pérdida de Peso 30 días",
        "descripcion": "string",
        "duracionDias": 30,
        "activo": true,
        "objetivo": {
          "caloriasObjetivo": 1500,
          "proteinasObjetivo": 120,
          "carbohidratosObjetivo": 150,
          "grasasObjetivo": 50,
          "descripcion": "string"
        },
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:33.962Z",
            "updatedAt": "2025-11-30T23:22:33.962Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:33.962Z",
        "updatedAt": "2025-11-30T23:22:33.962Z",
        "totalDiasProgramados": 0
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:33.962Z"
}
No links

POST
/api/v1/planes
🔐 ADMIN - US-11: Crear plan nutricional [RN11]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN11: Planes con nombre único en catálogo (@Column unique=true)
UNIT TESTS: 22/22 ✅ en PlanServiceTest.java

testCrearPlan_NombreDuplicado_Falla()
testCrearPlan_NombreUnico_Exito()
Ejecutar: ./mvnw test -Dtest=PlanServiceTest

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "nombre": "Plan Pérdida de Peso 30 días",
  "descripcion": "Plan nutricional diseñado para perder peso de forma saludable",
  "duracionDias": 30,
  "objetivo": {
    "caloriasObjetivo": 1500,
    "proteinasObjetivo": 120,
    "carbohidratosObjetivo": 150,
    "grasasObjetivo": 50,
    "descripcion": "Déficit calórico moderado con alta proteína"
  },
  "etiquetaIds": [
    1,
    2,
    3
  ]
}
Responses
Code	Description	Links
201	
Plan creado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Plan Pérdida de Peso 30 días",
    "descripcion": "string",
    "duracionDias": 30,
    "activo": true,
    "objetivo": {
      "caloriasObjetivo": 1500,
      "proteinasObjetivo": 120,
      "carbohidratosObjetivo": 150,
      "grasasObjetivo": 50,
      "descripcion": "string"
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.969Z",
        "updatedAt": "2025-11-30T23:22:33.969Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.969Z",
    "updatedAt": "2025-11-30T23:22:33.969Z",
    "totalDiasProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.969Z"
}
No links
400	
Datos inválidos o nombre duplicado (RN11)

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Plan Pérdida de Peso 30 días",
    "descripcion": "string",
    "duracionDias": 30,
    "activo": true,
    "objetivo": {
      "caloriasObjetivo": 1500,
      "proteinasObjetivo": 120,
      "carbohidratosObjetivo": 150,
      "grasasObjetivo": 50,
      "descripcion": "string"
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.972Z",
        "updatedAt": "2025-11-30T23:22:33.972Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.972Z",
    "updatedAt": "2025-11-30T23:22:33.972Z",
    "totalDiasProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.972Z"
}
No links
401	
No autenticado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Plan Pérdida de Peso 30 días",
    "descripcion": "string",
    "duracionDias": 30,
    "activo": true,
    "objetivo": {
      "caloriasObjetivo": 1500,
      "proteinasObjetivo": 120,
      "carbohidratosObjetivo": 150,
      "grasasObjetivo": 50,
      "descripcion": "string"
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.974Z",
        "updatedAt": "2025-11-30T23:22:33.974Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.974Z",
    "updatedAt": "2025-11-30T23:22:33.974Z",
    "totalDiasProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.974Z"
}
No links
403	
No autorizado - requiere rol ADMIN

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Plan Pérdida de Peso 30 días",
    "descripcion": "string",
    "duracionDias": 30,
    "activo": true,
    "objetivo": {
      "caloriasObjetivo": 1500,
      "proteinasObjetivo": 120,
      "carbohidratosObjetivo": 150,
      "grasasObjetivo": 50,
      "descripcion": "string"
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.977Z",
        "updatedAt": "2025-11-30T23:22:33.977Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.977Z",
    "updatedAt": "2025-11-30T23:22:33.977Z",
    "totalDiasProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.977Z"
}
No links

GET
/api/v1/planes/{id}/dias
🔐 ADMIN/USER - Obtener días del plan


Lista todas las actividades programadas del plan ordenadas por día y tipo. Accesible para administradores y usuarios.

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del plan

id
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 1,
      "numeroDia": 1,
      "tipoComida": "DESAYUNO",
      "comida": {
        "id": 15,
        "nombre": "Avena con frutas",
        "tipoComida": "DESAYUNO"
      },
      "notas": "Tomar con agua tibia"
    }
  ],
  "timestamp": "2025-11-30T23:22:33.981Z"
}
No links

POST
/api/v1/planes/{id}/dias
Agregar día al plan


Programa una comida específica para un día del plan

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del plan

id
Request body

application/json
Example Value
Schema
{
  "numeroDia": 1,
  "tipoComida": "DESAYUNO",
  "comidaId": 15,
  "notas": "Tomar con agua tibia"
}
Responses
Code	Description	Links
201	
Día agregado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "numeroDia": 1,
    "tipoComida": "DESAYUNO",
    "comida": {
      "id": 15,
      "nombre": "Avena con frutas",
      "tipoComida": "DESAYUNO"
    },
    "notas": "Tomar con agua tibia"
  },
  "timestamp": "2025-11-30T23:22:33.988Z"
}
No links
400	
Datos inválidos o día excede duración

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "numeroDia": 1,
    "tipoComida": "DESAYUNO",
    "comida": {
      "id": 15,
      "nombre": "Avena con frutas",
      "tipoComida": "DESAYUNO"
    },
    "notas": "Tomar con agua tibia"
  },
  "timestamp": "2025-11-30T23:22:33.990Z"
}
No links
404	
Plan o comida no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "numeroDia": 1,
    "tipoComida": "DESAYUNO",
    "comida": {
      "id": 15,
      "nombre": "Avena con frutas",
      "tipoComida": "DESAYUNO"
    },
    "notas": "Tomar con agua tibia"
  },
  "timestamp": "2025-11-30T23:22:33.992Z"
}
No links
409	
Ya existe comida para ese día y tipo

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "numeroDia": 1,
    "tipoComida": "DESAYUNO",
    "comida": {
      "id": 15,
      "nombre": "Avena con frutas",
      "tipoComida": "DESAYUNO"
    },
    "notas": "Tomar con agua tibia"
  },
  "timestamp": "2025-11-30T23:22:33.994Z"
}
No links

PATCH
/api/v1/planes/{id}/reactivar
🔐 ADMIN: Reactivar plan eliminado


Reactiva un plan previamente marcado como inactivo (soft delete). Permite reutilizar planes eliminados en lugar de crear duplicados.

✅ BENEFICIOS:

Reutiliza configuraciones existentes
Preserva historial y relaciones
Evita duplicación de datos
⚠️ RESTRICCIONES:

Solo funciona con planes inactivos (activo=false)
Si el plan ya está activo → error 400 Bad Request
Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del plan a reactivar

id
Responses
Code	Description	Links
200	
Plan reactivado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Plan Pérdida de Peso 30 días",
    "descripcion": "string",
    "duracionDias": 30,
    "activo": true,
    "objetivo": {
      "caloriasObjetivo": 1500,
      "proteinasObjetivo": 120,
      "carbohidratosObjetivo": 150,
      "grasasObjetivo": 50,
      "descripcion": "string"
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:33.999Z",
        "updatedAt": "2025-11-30T23:22:33.999Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:33.999Z",
    "updatedAt": "2025-11-30T23:22:33.999Z",
    "totalDiasProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:33.999Z"
}
No links
400	
El plan ya está activo

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Plan Pérdida de Peso 30 días",
    "descripcion": "string",
    "duracionDias": 30,
    "activo": true,
    "objetivo": {
      "caloriasObjetivo": 1500,
      "proteinasObjetivo": 120,
      "carbohidratosObjetivo": 150,
      "grasasObjetivo": 50,
      "descripcion": "string"
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.003Z",
        "updatedAt": "2025-11-30T23:22:34.003Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.003Z",
    "updatedAt": "2025-11-30T23:22:34.003Z",
    "totalDiasProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:34.004Z"
}
No links
404	
Plan no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Plan Pérdida de Peso 30 días",
    "descripcion": "string",
    "duracionDias": 30,
    "activo": true,
    "objetivo": {
      "caloriasObjetivo": 1500,
      "proteinasObjetivo": 120,
      "carbohidratosObjetivo": 150,
      "grasasObjetivo": 50,
      "descripcion": "string"
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.007Z",
        "updatedAt": "2025-11-30T23:22:34.007Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.007Z",
    "updatedAt": "2025-11-30T23:22:34.007Z",
    "totalDiasProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:34.007Z"
}
No links

GET
/api/v1/planes/{id}/dias/{numeroDia}
🔐 ADMIN/USER - Obtener actividades de un día


Lista las comidas programadas para un día específico del plan. Accesible para administradores y usuarios.

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del plan

id
numeroDia *
integer($int32)
(path)
Número de día (1, 2, 3...)

numeroDia
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 1,
      "numeroDia": 1,
      "tipoComida": "DESAYUNO",
      "comida": {
        "id": 15,
        "nombre": "Avena con frutas",
        "tipoComida": "DESAYUNO"
      },
      "notas": "Tomar con agua tibia"
    }
  ],
  "timestamp": "2025-11-30T23:22:34.013Z"
}
No links

GET
/api/v1/planes/catalogo
👤 USER - Ver catálogo de planes


US-16: Obtiene planes disponibles filtrados por perfil del usuario autenticado. RN15: Sugiere según objetivo. RN16: 🚨FILTRA ALÉRGENOS. SOLO USUARIOS REGULARES.

Parameters
Try it out
Name	Description
sugeridos
boolean
(query)
Filtrar solo planes sugeridos según objetivo

Default value : false


false
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Plan Pérdida de Peso 30 días",
        "descripcion": "string",
        "duracionDias": 30,
        "activo": true,
        "objetivo": {
          "caloriasObjetivo": 1500,
          "proteinasObjetivo": 120,
          "carbohidratosObjetivo": 150,
          "grasasObjetivo": 50,
          "descripcion": "string"
        },
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:34.022Z",
            "updatedAt": "2025-11-30T23:22:34.022Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:34.022Z",
        "updatedAt": "2025-11-30T23:22:34.022Z",
        "totalDiasProgramados": 0
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:34.022Z"
}
No links

GET
/api/v1/planes/catalogo/{id}
Ver detalle de plan (Cliente)


US-17: Obtiene detalle del plan validando alérgenos del usuario. RN16: 🚨SEGURIDAD SALUD

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID del plan

id
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Plan Pérdida de Peso 30 días",
    "descripcion": "string",
    "duracionDias": 30,
    "activo": true,
    "objetivo": {
      "caloriasObjetivo": 1500,
      "proteinasObjetivo": 120,
      "carbohidratosObjetivo": 150,
      "grasasObjetivo": 50,
      "descripcion": "string"
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.028Z",
        "updatedAt": "2025-11-30T23:22:34.028Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.028Z",
    "updatedAt": "2025-11-30T23:22:34.028Z",
    "totalDiasProgramados": 0
  },
  "timestamp": "2025-11-30T23:22:34.028Z"
}
No links

GET
/api/v1/planes/buscar
Buscar planes por nombre


Busca planes que contengan el texto especificado (case-insensitive)

Parameters
Try it out
Name	Description
nombre *
string
(query)
Texto a buscar en el nombre

nombre
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Plan Pérdida de Peso 30 días",
        "descripcion": "string",
        "duracionDias": 30,
        "activo": true,
        "objetivo": {
          "caloriasObjetivo": 1500,
          "proteinasObjetivo": 120,
          "carbohidratosObjetivo": 150,
          "grasasObjetivo": 50,
          "descripcion": "string"
        },
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:34.037Z",
            "updatedAt": "2025-11-30T23:22:34.037Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:34.037Z",
        "updatedAt": "2025-11-30T23:22:34.037Z",
        "totalDiasProgramados": 0
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:34.037Z"
}
No links

GET
/api/v1/planes/activos
🔐 ADMIN - Listar planes activos


Obtiene solo los planes activos disponibles para asignar. RN28: Solo activo=true. SOLO ADMINISTRADORES.

Parameters
Try it out
Name	Description
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Plan Pérdida de Peso 30 días",
        "descripcion": "string",
        "duracionDias": 30,
        "activo": true,
        "objetivo": {
          "caloriasObjetivo": 1500,
          "proteinasObjetivo": 120,
          "carbohidratosObjetivo": 150,
          "grasasObjetivo": 50,
          "descripcion": "string"
        },
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:34.045Z",
            "updatedAt": "2025-11-30T23:22:34.045Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:34.045Z",
        "updatedAt": "2025-11-30T23:22:34.045Z",
        "totalDiasProgramados": 0
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:34.045Z"
}
No links

DELETE
/api/v1/planes/{planId}/dias/{diaId}
Eliminar actividad del plan


Elimina una comida programada de un día específico

Parameters
Try it out
Name	Description
planId *
integer($int64)
(path)
ID del plan

planId
diaId *
integer($int64)
(path)
ID de la actividad

diaId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:34.052Z"
}
No links

DELETE
/api/v1/planes/{planId}/dias
🔐 ADMIN - Eliminar TODAS las comidas del plan (Batch)


Elimina TODAS las comidas/días de un plan en una sola operación.

Parameters
Try it out
Name	Description
planId *
integer($int64)
(path)
ID del plan

planId
Responses
Code	Description	Links
200	
Todas las comidas eliminadas exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Se eliminaron X días del plan",
  "data": {},
  "timestamp": "2025-11-30T23:22:34.052Z"
}
No links
404	
Plan no encontrado

No links

PUT
/api/v1/planes/{planId}/dias/batch
🔐 ADMIN - Reemplazar TODAS las comidas del plan (Batch Atómico)


Reemplaza TODAS las comidas de un plan en una operación atómica.
1. Elimina todos los días/comidas existentes
2. Agrega los nuevos días/comidas
3. Si falla alguno, hace rollback de todo

BENEFICIOS:
- Una sola llamada HTTP (más eficiente)
- Operación transaccional (todo o nada)
- Evita conflictos de constraints

Parameters
Try it out
Name	Description
planId *
integer($int64)
(path)
ID del plan

planId
Request body

application/json
Example Value
Schema
[
  { "numeroDia": 1, "tipoComida": "DESAYUNO", "comidaId": 10 },
  { "numeroDia": 1, "tipoComida": "ALMUERZO", "comidaId": 15 },
  { "numeroDia": 1, "tipoComida": "CENA", "comidaId": 20 },
  { "numeroDia": 2, "tipoComida": "DESAYUNO", "comidaId": 12 }
]
Responses
Code	Description	Links
200	
Comidas reemplazadas exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Días del plan actualizados correctamente",
  "data": [
    {
      "id": 1,
      "numeroDia": 1,
      "tipoComida": "DESAYUNO",
      "comida": { "id": 10, "nombre": "Avena con frutas" }
    }
  ],
  "timestamp": "2025-11-30T23:22:34.052Z"
}
No links
400	
Datos inválidos

No links
404	
Plan o comida no encontrada

No links

Módulo 2: Biblioteca de Contenido - Comidas y Recetas
🔐 ADMIN - Gestión del catálogo de comidas y recetas (US-09, US-10) - Fabián Rojas. SOLO ADMINISTRADORES.



GET
/api/v1/comidas/{id}
🔐 ADMIN - Obtener comida por ID


Obtiene los detalles de una comida con su información nutricional calculada. SOLO ADMINISTRADORES.

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID de la comida

id
Responses
Code	Description	Links
200	
Comida encontrada

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.055Z",
        "updatedAt": "2025-11-30T23:22:34.055Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.055Z",
    "updatedAt": "2025-11-30T23:22:34.055Z"
  },
  "timestamp": "2025-11-30T23:22:34.055Z"
}
No links
404	
Comida no encontrada

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.059Z",
        "updatedAt": "2025-11-30T23:22:34.059Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.059Z",
    "updatedAt": "2025-11-30T23:22:34.059Z"
  },
  "timestamp": "2025-11-30T23:22:34.059Z"
}
No links

PUT
/api/v1/comidas/{id}
Actualizar comida


Actualiza los datos de una comida existente

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID de la comida

id
Request body

application/json
Example Value
Schema
{
  "nombre": "Ensalada de pollo",
  "tipoComida": "ALMUERZO",
  "descripcion": "Ensalada fresca con lechuga romana, pollo a la plancha, crutones y aderezo César",
  "tiempoPreparacionMinutos": 20,
  "porciones": 2,
  "instrucciones": "1. Lavar y cortar la lechuga\n2. Cocinar el pollo a la plancha\n3. Mezclar todos los ingredientes...",
  "etiquetaIds": [
    1,
    2,
    3
  ]
}
Responses
Code	Description	Links
200	
Comida actualizada exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.066Z",
        "updatedAt": "2025-11-30T23:22:34.066Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.066Z",
    "updatedAt": "2025-11-30T23:22:34.066Z"
  },
  "timestamp": "2025-11-30T23:22:34.066Z"
}
No links
400	
Datos inválidos o nombre duplicado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.074Z",
        "updatedAt": "2025-11-30T23:22:34.074Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.074Z",
    "updatedAt": "2025-11-30T23:22:34.074Z"
  },
  "timestamp": "2025-11-30T23:22:34.074Z"
}
No links
404	
Comida no encontrada

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.078Z",
        "updatedAt": "2025-11-30T23:22:34.078Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.078Z",
    "updatedAt": "2025-11-30T23:22:34.078Z"
  },
  "timestamp": "2025-11-30T23:22:34.078Z"
}
No links

DELETE
/api/v1/comidas/{id}
Eliminar comida


Elimina una comida del catálogo

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
ID de la comida

id
Responses
Code	Description	Links
200	
Comida eliminada exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:34.083Z"
}
No links
404	
Comida no encontrada

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:34.084Z"
}
No links

PUT
/api/v1/comidas/{comidaId}/ingredientes/{ingredienteId}
Actualizar cantidad de ingrediente


Modifica la cantidad de un ingrediente en la receta. RN10: Cantidad debe ser positiva.

Parameters
Try it out
Name	Description
comidaId *
integer($int64)
(path)
ID de la comida

comidaId
ingredienteId *
integer($int64)
(path)
ID del ingrediente

ingredienteId
Request body

application/json
Example Value
Schema
{
  "ingredienteId": 1,
  "cantidadGramos": 150,
  "notas": "Cocinar a la plancha sin aceite"
}
Responses
Code	Description	Links
200	
Cantidad actualizada exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.090Z",
        "updatedAt": "2025-11-30T23:22:34.090Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.091Z",
    "updatedAt": "2025-11-30T23:22:34.091Z"
  },
  "timestamp": "2025-11-30T23:22:34.091Z"
}
No links
404	
Ingrediente no encontrado en esta comida

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.094Z",
        "updatedAt": "2025-11-30T23:22:34.094Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.094Z",
    "updatedAt": "2025-11-30T23:22:34.094Z"
  },
  "timestamp": "2025-11-30T23:22:34.094Z"
}
No links

DELETE
/api/v1/comidas/{comidaId}/ingredientes/{ingredienteId}
Eliminar ingrediente de receta


Quita un ingrediente de la comida

Parameters
Try it out
Name	Description
comidaId *
integer($int64)
(path)
ID de la comida

comidaId
ingredienteId *
integer($int64)
(path)
ID del ingrediente

ingredienteId
Responses
Code	Description	Links
200	
Ingrediente eliminado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.101Z",
        "updatedAt": "2025-11-30T23:22:34.101Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.101Z",
    "updatedAt": "2025-11-30T23:22:34.101Z"
  },
  "timestamp": "2025-11-30T23:22:34.101Z"
}
No links
404	
Ingrediente no encontrado en esta comida

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.104Z",
        "updatedAt": "2025-11-30T23:22:34.104Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.104Z",
    "updatedAt": "2025-11-30T23:22:34.104Z"
  },
  "timestamp": "2025-11-30T23:22:34.104Z"
}
No links

GET
/api/v1/comidas
Listar todas las comidas


Obtiene una lista paginada de todas las comidas

Parameters
Try it out
Name	Description
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Ensalada César con pollo",
        "tipoComida": "ALMUERZO",
        "descripcion": "string",
        "tiempoPreparacionMinutos": 20,
        "porciones": 2,
        "instrucciones": "string",
        "ingredientes": [
          {
            "ingredienteId": 1,
            "ingredienteNombre": "Pechuga de pollo",
            "cantidadGramos": 150,
            "proteinasAportadas": 46.5,
            "carbohidratosAportados": 0,
            "grasasAportadas": 5.4,
            "energiaAportada": 247.5,
            "fibraAportada": 0,
            "notas": "string"
          }
        ],
        "nutricionTotal": {
          "proteinasTotales": 46.5,
          "carbohidratosTotales": 15,
          "grasasTotales": 12.5,
          "energiaTotal": 350,
          "fibraTotal": 2.5,
          "pesoTotal": 350
        },
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:34.112Z",
            "updatedAt": "2025-11-30T23:22:34.112Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:34.112Z",
        "updatedAt": "2025-11-30T23:22:34.112Z"
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:34.112Z"
}
No links

POST
/api/v1/comidas
🔐 ADMIN - US-09: Crear comida [RN11, RN25]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN11: Comidas con nombre único en catálogo
RN25: Cálculo automático de calorías basado en ingredientes
UNIT TESTS: 9/9 ✅ en ComidaServiceTest.java

testCrearComida_NombreDuplicado_Falla()
testCrearComida_CalculaCaloriasAutomaticamente()
Ejecutar: ./mvnw test -Dtest=ComidaServiceTest

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "nombre": "Ensalada de pollo",
  "tipoComida": "ALMUERZO",
  "descripcion": "Ensalada fresca con lechuga romana, pollo a la plancha, crutones y aderezo César",
  "tiempoPreparacionMinutos": 20,
  "porciones": 2,
  "instrucciones": "1. Lavar y cortar la lechuga\n2. Cocinar el pollo a la plancha\n3. Mezclar todos los ingredientes...",
  "etiquetaIds": [
    1,
    2,
    3
  ]
}
Responses
Code	Description	Links
201	
Comida creada exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.119Z",
        "updatedAt": "2025-11-30T23:22:34.119Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.119Z",
    "updatedAt": "2025-11-30T23:22:34.119Z"
  },
  "timestamp": "2025-11-30T23:22:34.119Z"
}
No links
400	
Datos inválidos o nombre duplicado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.122Z",
        "updatedAt": "2025-11-30T23:22:34.122Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.122Z",
    "updatedAt": "2025-11-30T23:22:34.122Z"
  },
  "timestamp": "2025-11-30T23:22:34.122Z"
}
No links
401	
No autenticado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.125Z",
        "updatedAt": "2025-11-30T23:22:34.125Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.125Z",
    "updatedAt": "2025-11-30T23:22:34.125Z"
  },
  "timestamp": "2025-11-30T23:22:34.125Z"
}
No links
403	
No autorizado - requiere rol ADMIN

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.129Z",
        "updatedAt": "2025-11-30T23:22:34.129Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.129Z",
    "updatedAt": "2025-11-30T23:22:34.129Z"
  },
  "timestamp": "2025-11-30T23:22:34.129Z"
}
No links

POST
/api/v1/comidas/{comidaId}/ingredientes
🔐 ADMIN - US-10: Agregar ingrediente a receta [RN10, RN25]


REGLAS DE NEGOCIO IMPLEMENTADAS:

RN10: Cantidad de ingrediente debe ser positiva (@Min(1))
RN25: Recalcula calorías automáticamente al agregar ingrediente
UNIT TESTS: 9/9 ✅ en ComidaServiceTest.java

testAgregarIngrediente_CantidadCero_Falla()
testAgregarIngrediente_RecalculaCalorias()
Parameters
Try it out
Name	Description
comidaId *
integer($int64)
(path)
ID de la comida

comidaId
Request body

application/json
Example Value
Schema
{
  "ingredienteId": 1,
  "cantidadGramos": 150,
  "notas": "Cocinar a la plancha sin aceite"
}
Responses
Code	Description	Links
200	
Ingrediente agregado exitosamente

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.136Z",
        "updatedAt": "2025-11-30T23:22:34.136Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.136Z",
    "updatedAt": "2025-11-30T23:22:34.136Z"
  },
  "timestamp": "2025-11-30T23:22:34.136Z"
}
No links
400	
Ingrediente ya existe o cantidad inválida

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.139Z",
        "updatedAt": "2025-11-30T23:22:34.139Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.139Z",
    "updatedAt": "2025-11-30T23:22:34.139Z"
  },
  "timestamp": "2025-11-30T23:22:34.139Z"
}
No links
404	
Comida o ingrediente no encontrado

Media type

*/*
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "id": 1,
    "nombre": "Ensalada César con pollo",
    "tipoComida": "ALMUERZO",
    "descripcion": "string",
    "tiempoPreparacionMinutos": 20,
    "porciones": 2,
    "instrucciones": "string",
    "ingredientes": [
      {
        "ingredienteId": 1,
        "ingredienteNombre": "Pechuga de pollo",
        "cantidadGramos": 150,
        "proteinasAportadas": 46.5,
        "carbohidratosAportados": 0,
        "grasasAportadas": 5.4,
        "energiaAportada": 247.5,
        "fibraAportada": 0,
        "notas": "string"
      }
    ],
    "nutricionTotal": {
      "proteinasTotales": 46.5,
      "carbohidratosTotales": 15,
      "grasasTotales": 12.5,
      "energiaTotal": 350,
      "fibraTotal": 2.5,
      "pesoTotal": 350
    },
    "etiquetas": [
      {
        "id": 1,
        "nombre": "Gluten",
        "tipoEtiqueta": "ALERGIA",
        "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
        "createdAt": "2025-11-30T23:22:34.143Z",
        "updatedAt": "2025-11-30T23:22:34.143Z"
      }
    ],
    "createdAt": "2025-11-30T23:22:34.143Z",
    "updatedAt": "2025-11-30T23:22:34.143Z"
  },
  "timestamp": "2025-11-30T23:22:34.143Z"
}
No links

GET
/api/v1/comidas/tipo/{tipo}
Filtrar por tipo


Obtiene comidas de un tipo específico (DESAYUNO, ALMUERZO, etc.)

Parameters
Try it out
Name	Description
tipo *
string
(path)
Tipo de comida

Available values : DESAYUNO, ALMUERZO, CENA, SNACK, PRE_ENTRENAMIENTO, POST_ENTRENAMIENTO, COLACION, MERIENDA


DESAYUNO
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Ensalada César con pollo",
        "tipoComida": "ALMUERZO",
        "descripcion": "string",
        "tiempoPreparacionMinutos": 20,
        "porciones": 2,
        "instrucciones": "string",
        "ingredientes": [
          {
            "ingredienteId": 1,
            "ingredienteNombre": "Pechuga de pollo",
            "cantidadGramos": 150,
            "proteinasAportadas": 46.5,
            "carbohidratosAportados": 0,
            "grasasAportadas": 5.4,
            "energiaAportada": 247.5,
            "fibraAportada": 0,
            "notas": "string"
          }
        ],
        "nutricionTotal": {
          "proteinasTotales": 46.5,
          "carbohidratosTotales": 15,
          "grasasTotales": 12.5,
          "energiaTotal": 350,
          "fibraTotal": 2.5,
          "pesoTotal": 350
        },
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:34.152Z",
            "updatedAt": "2025-11-30T23:22:34.152Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:34.152Z",
        "updatedAt": "2025-11-30T23:22:34.152Z"
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:34.152Z"
}
No links

GET
/api/v1/comidas/buscar
Buscar comidas por nombre


Busca comidas que contengan el texto especificado (case-insensitive)

Parameters
Try it out
Name	Description
nombre *
string
(query)
Texto a buscar en el nombre

nombre
page
integer
(query)
Zero-based page index (0..N)

Default value : 0

0
size
integer
(query)
The size of the page to be returned

Default value : 20

20
sort
array[string]
(query)
Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "totalPages": 0,
    "totalElements": 0,
    "size": 0,
    "content": [
      {
        "id": 1,
        "nombre": "Ensalada César con pollo",
        "tipoComida": "ALMUERZO",
        "descripcion": "string",
        "tiempoPreparacionMinutos": 20,
        "porciones": 2,
        "instrucciones": "string",
        "ingredientes": [
          {
            "ingredienteId": 1,
            "ingredienteNombre": "Pechuga de pollo",
            "cantidadGramos": 150,
            "proteinasAportadas": 46.5,
            "carbohidratosAportados": 0,
            "grasasAportadas": 5.4,
            "energiaAportada": 247.5,
            "fibraAportada": 0,
            "notas": "string"
          }
        ],
        "nutricionTotal": {
          "proteinasTotales": 46.5,
          "carbohidratosTotales": 15,
          "grasasTotales": 12.5,
          "energiaTotal": 350,
          "fibraTotal": 2.5,
          "pesoTotal": 350
        },
        "etiquetas": [
          {
            "id": 1,
            "nombre": "Gluten",
            "tipoEtiqueta": "ALERGIA",
            "descripcion": "Alergia al gluten presente en trigo, cebada y centeno",
            "createdAt": "2025-11-30T23:22:34.163Z",
            "updatedAt": "2025-11-30T23:22:34.163Z"
          }
        ],
        "createdAt": "2025-11-30T23:22:34.163Z",
        "updatedAt": "2025-11-30T23:22:34.163Z"
      }
    ],
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "first": true,
    "last": true,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 0,
      "pageSize": 0,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2025-11-30T23:22:34.163Z"
}
No links
Módulo 1: Autenticación y Perfil
🔓 PÚBLICO - Endpoints para registro, login y gestión de cuentas (US-01 a US-05) - Leonel Alzamora. ACCESO PÚBLICO (sin autenticación).



POST
/api/v1/auth/registro
🔓 PÚBLICO - Registrar nuevo usuario [RN01, RN30, RN31]


Crea una nueva cuenta de usuario con su perfil básico. ACCESO PÚBLICO.

REGLAS DE NEGOCIO IMPLEMENTADAS:

RN01: Email único en la base de datos
RN30: Validación formato email RFC 5322 + verificación DNS
RN31: Contraseña mínimo 12 caracteres con complejidad (mayúscula, minúscula, número, símbolo)
VALIDACIONES AUTOMÁTICAS:

Email con formato válido y dominio existente (DNS lookup)
Contraseña no puede ser común (blacklist)
Contraseña no puede contener el email del usuario
Email no puede estar registrado previamente
UNIT TESTS: 13/13 ✅ en AuthServiceTest.java

Ejecutar: ./mvnw test -Dtest=AuthServiceTest
Parameters
Try it out
No parameters

Request body

application/json
Datos del nuevo usuario

Examples: 
Ejemplo cumple RN30 y RN31
Example Value
Schema
{
  "email": "nuevo@ejemplo.com",
  "password": "SecurePass2024!",
  "nombre": "Juan",
  "apellido": "Pérez",
  "fechaNacimiento": "1990-05-15"
}
Example Description
Email válido RFC 5322 + contraseña 12+ chars con complejidad


Responses
Code	Description	Links
201	
✅ Usuario registrado exitosamente

Media type

application/json
Controls Accept header.
Examples

Registro Exitoso
Example Value
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "nuevo@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "role": "ROLE_USER"
  }
}
Example Description
Registro Exitoso


No links
400	
❌ Error de validación (RN01, RN30, RN31)

Media type

application/json
Examples

Email ya registrado
Example Value
{
  "success": false,
  "message": "El email ya está registrado",
  "data": null
}
Example Description
Test: testRegistro_EmailDuplicado()


No links

POST
/api/v1/auth/login
🔓 PÚBLICO - Iniciar sesión [RN03]


Autentica un usuario y retorna un token JWT. ACCESO PÚBLICO.

REGLAS DE NEGOCIO:

RN03: Login falla si credenciales incorrectas o cuenta inactiva
UNIT TESTS: testLogin_PasswordIncorrecto(), testLogin_CuentaInactiva()

Parameters
Cancel
No parameters

Request body

application/json
Credenciales de acceso

Examples: 
Usuario regular para pruebas
{
  "email": "demo@nutritrack.com",
  "password": "Demo123!"
}
Example Description
Cuenta de usuario regular con objetivo de perder peso


Execute
Clear
Responses
Curl

curl -X 'POST' \
  'http://localhost:8080/api/v1/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "demo@nutritrack.com",
  "password": "Demo123!"
}'
Request URL
http://localhost:8080/api/v1/auth/login
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZW1vQG51dHJpdHJhY2suY29tIiwiaWF0IjoxNzY0NTM4MjYzLCJleHAiOjE3NjcxMzAyNjN9.UDkDzeV2bWnqcjJyAHE8ml-r2L8QopiL26uAkx5KNa0",
    "email": "demo@nutritrack.com",
    "nombre": "Usuario",
    "apellido": "Demo",
    "role": "ROLE_USER",
    "userId": 2,
    "perfilId": 2
  },
  "timestamp": "2025-11-30T16:31:03.7429528"
}
Response headers
 cache-control: no-cache,no-store,max-age=0,must-revalidate 
 connection: keep-alive 
 content-type: application/json 
 date: Sun,30 Nov 2025 21:31:03 GMT 
 expires: 0 
 keep-alive: timeout=60 
 pragma: no-cache 
 transfer-encoding: chunked 
 vary: Origin,Access-Control-Request-Method,Access-Control-Request-Headers 
 x-content-type-options: nosniff 
 x-frame-options: DENY 
 x-xss-protection: 0 
Responses
Code	Description	Links
200	
✅ Login exitoso

Media type

application/json
Controls Accept header.
Examples

Login Exitoso
Example Value
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "demo@nutritrack.com",
    "nombre": "Demo",
    "apellido": "Usuario",
    "role": "ROLE_USER"
  }
}
Example Description
Login Exitoso


No links
401	
❌ Credenciales inválidas o cuenta inactiva (RN03)

Media type

application/json
Examples

Usuario no existe
Example Value
{
  "success": false,
  "message": "Credenciales inválidas",
  "data": null
}
Example Description
Test: testLogin_EmailNoRegistrado()


No links

DELETE
/api/v1/auth/cuenta
Eliminar cuenta


Elimina permanentemente la cuenta del usuario. Requiere escribir 'ELIMINAR' para confirmar

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "confirmacion": "ELIMINAR"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "2025-11-30T23:22:34.192Z"
}
