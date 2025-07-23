# GMD Project: Vision, Architecture & Roadmap

## 1. Project Vision

Building an enterprise-grade web platform for intelligent, rule-based document automation. Users will upload Word templates (`.docx`) and structured data (Excel/CSV), visually map data to placeholders, and define complex business logic without writing code. The platform will transcend simple mail-merge, enabling the generation of sophisticated, dynamic documents based on conditional rules, calculations, and structural modifications.

## 2. Current Architecture: Scalable Foundation

The application is built on a modern, scalable architecture designed for performance and maintainability.

-   **Frontend:** A Next.js application providing a reactive and intuitive user interface for project management, template handling, data mapping, and job monitoring.
-   **Backend:** A high-performance FastAPI (Python) server that exposes a REST API for all frontend operations.
-   **Asynchronous Processing:** A robust background task system using Celery and Redis ensures the UI remains responsive during large-scale document generation jobs, providing a seamless user experience.
-   **Persistence:** A database layer using SQLAlchemy (SQLite for development, PostgreSQL for production) persists all user assets, including projects, templates, data mappings, and generation job history.

## 3. Project Roadmap

### Phase 1: Asynchronous Generation & Core Platform (Completed)

-   **Objective:** Establish a non-blocking, scalable architecture and a persistent workflow.
-   **Key Features Implemented:** Asynchronous job processing via Celery, database integration for projects, templates, and jobs, a project-based workflow with a central dashboard, and a refined UI navigation flow.

### Phase 2: Enhanced UX & Asset Management (In Progress)

-   **Objective:** Improve user efficiency and provide better tools for managing project assets.
-   **Action Plan:**
    1.  **Visual Template Preview:** Implement a feature to render `.docx` templates as HTML directly in the browser. This will provide users with an interactive preview, highlighting placeholders and improving the mapping experience.
    2.  **Advanced Mapping UI:** Enhance the mapping interface with drag-and-drop capabilities and status indicators for mapped/unmapped placeholders.
    3.  **Asset Deletion:** Implement secure deletion for projects, templates, mappings, and job history (including generated files) with user confirmation.
    4.  **Refine Project Context:** Refactor the `ProjectContext` to manage a single `activeProject` object, improving code clarity and reducing potential errors.

### Phase 3: Intelligent Automation & Pre-processing

-   **Objective:** Reduce manual user effort and introduce smart, time-saving features.
-   **Action Plan:**
    1.  **AI-Powered Mapping (Semantic Matching):** Implement the AI mapper to automatically suggest mappings by analyzing the semantic meaning of placeholders and data headers, not just exact text matches.
    2.  **Data Formatting Presets:** Allow users to apply formatting rules directly during the mapping phase (e.g., format a column as Currency `($1,234.56)`, Date `DD/MM/YYYY`, or Uppercase).
    3.  **Initial Data Validation:** Provide a pre-generation check to warn users about potential issues, such as missing data in mapped columns or data type mismatches.

### Phase 4: The Generic Rule Engine (The Core Feature)

-   **Objective:** Empower non-technical users to replicate the complex logic currently hard-coded in the Python generation scripts. This is the key differentiator.
-   **Action Plan:**
    1.  **Rule Builder UI:** Design and build a user-friendly interface for creating a sequence of rules that will be executed for each data row.
    2.  **Rule Types to Implement:**
        -   **Conditional Logic (IF/THEN):** Allow rules like: "`IF` `[CLAVE DE EXTENSION]` `is not` `0` `THEN` `Skip Generation`".
        -   **Data Transformation:** Allow users to create new "Calculated Placeholders".
            -   **Formulas:** `[TOTAL]` = `SUM([Subtotal], [Tax])`.
            -   **Text Conversion:** `[TOTAL_TEXTO]` = `CONVERT_TO_WORDS([TOTAL])`.
            -   **Concatenation:** `[FULL_NAME]` = `JOIN([FirstName], " ", [LastName])`.
        -   **Document Structure Manipulation:** Allow rules that modify the template structure based on data.
            -   `IF` `[VALOR CATASTRAL CONSTRUCCION 2024]` `is equal to` `0` `THEN` `Delete Element` `[Tabla_Construccion_2024]`.
            -   `IF` `[AÑO]` `is not in` `[Anos_Activos]` `THEN` `Delete Section` `[Seccion_Año]`.
        -   **Content Replacement:** `IF` `[MILLAR]` `is equal to` `0.002` `THEN` `Set Paragraph Text` `[PARRAFO_MILLAR]` to `"...texto para 2 al millar..."`.

### Phase 5: Deployment & Enterprise Readiness

-   **Objective:** Prepare the application for production deployment and enterprise-level features.
-   **Action Plan:**
    1.  **Containerization:** Finalize `Dockerfile`s and `docker-compose.yml` for consistent environments.
    2.  **Cloud Deployment:** Deploy to Vercel (Frontend) and a scalable cloud service like Google Cloud Run or AWS Fargate (Backend).
    3.  **User Authentication:** Implement a full authentication system (e.g., NextAuth.js) with user registration, password management, and roles.
    4.  **Team & Collaboration Features:** Introduce multi-user support within projects for enterprise clients.