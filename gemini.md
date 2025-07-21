# GMD Project: Vision, Architecture & Roadmap

## 1. Project Vision

The goal is to build a web platform for users to mass-generate documents. Users can upload their own Word templates (`.docx`), upload their data (from Excel/CSV), visually map the data columns to the template's placeholders, and generate a unique document for each row of data. The system should be generic and not tied to a specific document type, eventually allowing users to define their own transformation and conditional logic rules.

## 2. Current Architecture: Functional Prototype

We have a functional local prototype that accomplishes the core workflow.

-   **Frontend:** A Next.js application in `src/` provides the full user interface for the generation workflow:
    1.  Upload a `.docx` template.
    2.  Upload an `.xlsx` or `.csv` data file.
    3.  Visually map template placeholders to data columns.
    4.  Trigger the generation process.

-   **Backend:** A FastAPI server in `backend/` written in Python. It exposes a REST API that the frontend consumes.

-   **Core API Endpoints:**
    -   `POST /templates/placeholders`: Receives a `.docx` file and returns a list of all found placeholders.
    -   `POST /generate/bulk`: Receives a template, data, and mappings. It generates all documents and returns them in a single `.zip` file.

## 3. Project Roadmap

This roadmap outlines the key phases to evolve the prototype into a robust, scalable, and user-friendly web application.

### Phase 1: Asynchronous Generation & Scalability

-   **Problem:** The current synchronous generation process can cause browser and server timeouts with large datasets (e.g., thousands of documents).
-   **Action Plan:**
    1.  **Integrate Task Queue:** Add Celery with Redis to the FastAPI backend to manage background tasks.
    2.  **Create Job Endpoint:** Convert `POST /generate/bulk` into `POST /jobs`. This endpoint will validate the request, create a `GenerationJob` record in the database with a "Queued" status, and return a `job_id` to the frontend immediately.
    3.  **Background Worker:** The generation logic will be executed by a Celery worker in the background.
    4.  **Status Polling:** Implement a `GET /jobs/{job_id}` endpoint. The frontend will use this to periodically check the job status (e.g., "Processing", "Completed", "Failed").
    5.  **Download Link:** Once the job is "Completed", the status endpoint will provide a secure URL to download the resulting ZIP file.

### Phase 2: Persistence & Data Management

-   **Problem:** The application is currently stateless. Templates, mappings, and generation history are lost after each session.
-   **Action Plan:**
    1.  **Database Setup:** Integrate a database with the backend. Use SQLite for simple local development and plan for PostgreSQL in production.
    2.  **Define Models:** Create database models for `Users`, `Templates` (storing file info and path), `ColumnMappings` (linking a template to a specific mapping configuration), and `GenerationJobs`.
    3.  **API Integration:** Modify the API endpoints to save, retrieve, and manage data from the database. For example, allow users to select a previously uploaded template.

### Phase 3: Enhanced User Experience & Features

-   **Problem:** The user interface is functional for the core workflow but lacks features for managing assets or tracking progress.
-   **Action Plan:**
    1.  **User Dashboard:** Create a central dashboard where users can view and manage their saved templates and see a history of their past generation jobs.
    2.  **Real-time Feedback:** Implement a progress bar or status indicator in the UI that updates based on the information from the `GET /jobs/{job_id}` endpoint.
    3.  **Saved Mappings:** Develop a UI for users to save, name, and reuse their column mappings for specific templates.
    4.  **PDF Generation:** Add an option to generate output as individual PDF files within the ZIP, or even a single consolidated PDF.

### Phase 4: Generic Rule Engine

-   **Problem:** The current system only supports direct 1-to-1 data mapping. It cannot handle conditional logic or data transformations, which is key to making it truly generic.
-   **Action Plan:**
    1.  **Rule Engine Integration:** Research and integrate a Python-based rules engine (e.g., `business-rules`, `durable_rules`, or a custom-built solution).
    2.  **Rule Definition UI:** Design and build a user-friendly interface for defining rules without code. For example:
        -   **Conditionals:** "Include paragraph X *only if* column `Amount` > 1000."
        -   **Formatting:** "Format column `Date` as `YYYY-MM-DD`."
        -   **Calculated Fields:** "Create a new placeholder `[Full_Name]` by combining `[First_Name]` and `[Last_Name]`."
    3.  **Backend Logic:** Modify the generation worker to process these rules for each row of data.

### Phase 5: Deployment & Production Readiness

-   **Problem:** The application is designed for local execution only.
-   **Action Plan:**
    1.  **Containerization:** Write `Dockerfile`s for the Next.js and FastAPI applications.
    2.  **Orchestration:** Create a `docker-compose.yml` file to simplify the setup of the frontend, backend, database, and Celery/Redis for local development.
    3.  **Cloud Deployment:** Prepare scripts and configurations for deployment to a cloud platform like Vercel (for Next.js) and Google Cloud Run or AWS Fargate (for the backend services).