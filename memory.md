# Estado del Proyecto GMD y Pasos a Seguir

## Fase 1: Generación Asíncrona

### Progreso Actual

- [x] Actualizado `gemini.md` con la nueva arquitectura y roadmap.
- [x] Añadidas las dependencias de `celery` y `redis` a `backend/requirements.txt`.
- [x] Instaladas las nuevas dependencias en el entorno virtual.
- [x] Creado `backend/celery_worker.py` con la lógica de generación asíncrona.
- [x] Refactorizado `backend/main.py` para usar Celery:
  - `POST /generate/bulk` -> `POST /jobs` (inicia la tarea).
  - Añadido `GET /jobs/{job_id}` (consulta el estado).
  - Añadido `GET /jobs/{job_id}/download` (descarga el resultado).
- [x] Corregida la configuración de Redis en WSL para permitir conexiones externas.
- [x] Implementada la funcionalidad de `num_rows_to_generate` en backend y frontend.
- [x] Verificado que el flujo completo de generación asíncrona funciona correctamente.
- [x] Corregido el error de `AttributeError: '_Cell' object has no attribute 'runs'` en `celery_worker.py` y mejorado el reemplazo de placeholders para preservar el formato.
- [x] Implementada y verificada la descarga condicional de documentos (DOCX para uno, ZIP para múltiples).

### Pasos Pendientes y Mejoras

- [ ] **Paso 1: Persistencia de Datos (Fase 2 del Roadmap):**
  - **Problema:** La aplicación es actualmente sin estado. Las plantillas, los mapeos y el historial de generación se pierden después de cada sesión.
  - **Acción:** Implementar una base de datos (SQLite para desarrollo, PostgreSQL para producción) para almacenar usuarios, plantillas, mapeos y el historial de trabajos de generación.
  - **Estado:** Pendiente de iniciar.

- [ ] **Paso 2: Mejorar el reemplazo de placeholders (Warning 1):**
  - **Problema:** El reemplazo actual de placeholders no respeta el tipo de fuente y tamaño del documento o la palabra antes de reemplazar el placeholder, lo remplaza cosa que debe revisarse y estar pendiente.
  - **Acción:** (Ya completado en el paso anterior, se mantiene aquí como referencia de lo que se abordó).
