# Estado del Proyecto GMD y Pasos a Seguir

## Resumen de la Sesión de Desarrollo Reciente

En esta sesión, se abordaron y resolvieron errores críticos de la interfaz de usuario y la capa de datos, mejorando significativamente la estabilidad y la experiencia de usuario del prototipo. La navegación ahora es lógica y robusta.

## Tareas Completadas

-   [x] **Corregido Error de `owner_id`:** Solucionado el `TypeError` en el endpoint `POST /templates` al eliminar el argumento inválido `owner_id` de la creación del modelo `Template`.
-   [x] **Corregido Error de `user_id`:** Solucionado el `TypeError` en el endpoint `POST /jobs` al eliminar el argumento inválido `user_id` de la creación del modelo `GenerationJob`.
-   [x] **Reestructuración del Flujo de Navegación:**
    -   [x] Se eliminó la barra lateral de la página principal de selección de proyectos (`/projects`), creando una vista de inicio limpia.
    -   [x] La barra lateral ahora aparece contextualmente solo después de entrar a un proyecto.
    -   [x] Se eliminó el enlace redundante "Projects" de la barra lateral para prevenir rutas inválidas.
    -   [x] La barra lateral ahora muestra el nombre del proyecto activo, mejorando la orientación del usuario.
-   [x] **Corrección de Errores de Contexto en Frontend:**
    -   [x] Resueltos los errores de `TypeError` y de importación en `app-sidebar.tsx` y `layout.tsx` al alinear los componentes con la estructura de datos real proporcionada por `ProjectContext.tsx`.

## Próximos Pasos

Con la navegación y la estructura base estabilizadas, los siguientes pasos se centran en refinar el código y comenzar a construir las funcionalidades avanzadas.

-   [ ] **Paso 1: Refactorizar `ProjectContext` (Mejora de Código)**
    -   **Por qué:** El contexto actual maneja el ID y el nombre del proyecto en estados separados (`selectedProjectId`, `selectedProjectName`). Esto puede llevar a errores si uno se actualiza y el otro no. Unificarlo en un solo objeto `activeProject` hará el código más limpio, seguro y fácil de mantener.
    -   **Cómo:**
        1.  En `ProjectContext.tsx`, modificar el estado para que sea un solo objeto: `const [activeProject, setActiveProject] = useState<Project | null>(null);`.
        2.  Actualizar la interfaz `ProjectContextType` y las funciones `selectProject` y `clearProject` para que operen sobre este objeto único.
        3.  Ajustar los componentes que consumen el contexto (como `app-sidebar.tsx`) para usar `const { activeProject } = useProject();`.

-   [ ] **Paso 2: Implementar la Visualización de Plantillas (Feature Clave de UX)**
    -   **Por qué:** Permitir al usuario ver su plantilla `.docx` directamente en la web es fundamental para una buena experiencia de mapeo. Esto está marcado como un paso pendiente en el roadmap (`memory.md`, `gemini.md`) y es el siguiente paso lógico para mejorar la usabilidad.
    -   **Cómo:**
        1.  **Backend:** Crear un nuevo endpoint, ej. `GET /templates/{template_id}/preview`, que use una librería como `pypandoc` o `mammoth.js` (ejecutado con un microservicio de Node.js si es necesario) para convertir el `.docx` almacenado a HTML.
        2.  **Frontend:** En la página de mapeo o de detalles de la plantilla, hacer una llamada a este endpoint y renderizar el HTML resultante de forma segura dentro de un componente. Resaltar los placeholders (`[PLACEHOLDER]`) encontrados usando CSS para que sean fácilmente identificables.

-   [ ] **Paso 3: Planificar la Arquitectura del Motor de Reglas (Fase 4)**
    -   **Por qué:** Antes de escribir la interfaz, necesitamos definir cómo se guardarán y procesarán las reglas en el backend.
    -   **Cómo:**
        1.  **Modelos de BD:** Diseñar los modelos de SQLAlchemy para almacenar las reglas. Por ejemplo, una tabla `Rules` con campos como `project_id`, `name`, `trigger_column`, `operator`, `trigger_value` y `action_type`.
        2.  **Lógica del Worker:** Modificar el `celery_worker.py` para que, antes de generar un documento, recupere todas las reglas asociadas al proyecto desde la base de datos y las aplique a cada fila de datos.