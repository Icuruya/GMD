# Estado del Proyecto GMD y Pasos a Seguir

## Fases Completadas y en Progreso

### Fase 1: Generación Asíncrona y Mejoras Iniciales (Completada)
- [x] Actualizado `gemini.md` con la nueva arquitectura y roadmap.
- [x] Añadidas las dependencias de `celery` y `redis` a `backend/requirements.txt`.
- [x] Creado `backend/celery_worker.py` con la lógica de generación asíncrona.
- [x] Refactorizado `backend/main.py` para usar Celery.
- [x] Corregida la configuración de Redis en WSL para permitir conexiones externas.
- [x] Implementada la funcionalidad de `num_rows_to_generate` en backend y frontend.
- [x] Corregido el error de `AttributeError: '_Cell' object has no attribute 'runs'` y mejorado el reemplazo de placeholders para preservar el formato.
- [x] Implementada y verificada la descarga condicional de documentos (DOCX para uno, ZIP para múltiples).

### Fase 2: Persistencia de Datos y Flujo de Proyectos (En Progreso)
- [x] **Dependencias y Configuración:** Añadidas `SQLAlchemy` y `Alembic`. Configurada la base de datos SQLite.
- [x] **Modelos y Migración:** Definidos los modelos de datos (`User`, `Template`, `Job`, etc.) y creada la migración inicial.
- [x] **Integración con Backend:** Los endpoints de `jobs` ahora leen y escriben en la base de datos. El worker de Celery actualiza el estado del trabajo en la BD.
- [x] **Persistencia de Plantillas:**
  - [x] El endpoint `POST /templates` ahora guarda el archivo de la plantilla en el disco (`/uploads`) y crea un registro en la base de datos.
  - [x] El endpoint `POST /jobs` ahora utiliza el `template_id` para recuperar la plantilla de la base de datos.
  - [x] El frontend ha sido actualizado para reflejar estos cambios.
- [x] **Interfaz para Seleccionar Plantillas Existentes:**
  - [x] Creado endpoint `GET /templates` en el backend para listar plantillas.
  - [x] Modificado el frontend para mostrar y permitir la selección de plantillas existentes, incluyendo la detección de placeholders.
- [x] **Auto-mapeo de Placeholders (Feature de UX):**
  - [x] Modificado el frontend para que, si un placeholder `[NOMBRE]` coincide con un encabezado de datos `"NOMBRE"`, se mapeen automáticamente.
- [x] **Persistencia Completa de Mapeos:**
  - [x] Creados endpoints en el backend (`POST /mappings`, `GET /templates/{template_id}/mappings`) para guardar y recuperar mapeos.
  - [x] Modificado el frontend para permitir guardar y cargar mapeos guardados.
- [x] **Interfaz de Usuario para Gestión de Datos (Dashboard y Listado de Plantillas):**
  - [x] Creada la página de Dashboard (`/dashboard`) para ver el historial de trabajos.
  - [x] Creada la página de gestión de plantillas (`/templates/manage`) para listar plantillas.
  - [x] Creada la página de detalles de plantilla (`/templates/[id]`) para ver información de la plantilla y sus mapeos asociados.
  - [x] Implementada la funcionalidad "Ver Mapeo" en la página de detalles de la plantilla, mostrando el mapeo en una tabla legible.
  - [x] Añadida la funcionalidad de búsqueda/filtrado en el modal de detalles del mapeo.
- [x] **Funcionalidad de "Proyectos" (Gestión de Estado Global del Proyecto):**
  - [x] Creado el modelo `Project` en el backend y actualizados los modelos existentes para incluir `project_id`.
  - [x] Creados endpoints en el backend para la gestión de proyectos (`POST /projects`, `GET /projects`, `GET /projects/{project_id}`).
  - [x] Implementado `ProjectContext` en el frontend para gestionar el proyecto activo.
  - [x] Modificada la página `/projects` para permitir la creación y selección de proyectos, estableciendo el contexto global.
  - [x] Actualizada la barra lateral (`app-sidebar.tsx`) para reflejar el proyecto activo y generar enlaces contextualizados.
- [x] **Contextualización de Páginas Existentes (Frontend):**
  - [x] Actualizadas las páginas de Generación, Dashboard, Gestión de Plantillas y Detalles de Plantilla para que operen dentro del contexto del `project_id` seleccionado, filtrando datos y enviando el `project_id` en todas las llamadas a la API.

## Pasos Pendientes y Mejoras

- [ ] **Error Pendiente:** `TypeError: 'owner_id' is an invalid keyword argument for Template` en `backend/main.py` (línea 94).

- [ ] **Paso 1: Visualización HTML de Plantillas (Feature Avanzada):**
  - **Descripción:** Permitir al usuario visualizar la plantilla `.docx` directamente en el navegador como HTML, con los placeholders resaltados. Esto requerirá un nuevo endpoint en el backend para la conversión DOCX a HTML y un componente en el frontend para renderizarlo.

- [ ] **Paso 2: Funcionalidad de Eliminación de Historial/Archivos:**
  - **Descripción:** Añadir la opción de eliminar archivos de descarga generados o, en el contexto de proyectos, eliminar todo el historial de generación de un proyecto.
