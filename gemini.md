# Gemini Project Context

## Project Vision

The goal is to build a web platform for users to mass-generate documents. Users can upload their own Word templates (`.docx`), upload their data (from Excel/CSV), visually map the data columns to the template's placeholders, and generate a unique document for each row of data. The system should be generic and not tied to a specific document type.

## Current State: Functional Prototype

We have successfully built a functional local prototype that accomplishes the core workflow.

### Current Architecture

-   **Frontend:** A Next.js application.
    -   A new page has been created at `src/app/(app)/templates/page.tsx`.
    -   This page provides the full user interface for the generation workflow:
        1.  Upload a `.docx` template.
        2.  Upload an `.xlsx` or `.csv` data file.
        3.  Visually map template placeholders to data columns.
        4.  Trigger the generation process.
    -   It uses the `xlsx` library to parse data files directly in the browser.

-   **Backend:** A FastAPI server running in Python.
    -   Located in the `backend/` directory.
    -   Dependencies are managed in `backend/requirements.txt`.
    -   The main application logic is in `backend/main.py`.
    -   It exposes a REST API for the frontend to consume.

-   **API Endpoints Implemented:**
    -   `POST /templates/placeholders`: Receives a `.docx` file and returns a list of all found placeholders (e.g., `[NAME]`).
    -   `POST /generate/bulk`: Receives a template file, a data file, and a JSON object describing the mappings. It then:
        1.  Reads the data file using Pandas.
        2.  Iterates through each data row.
        3.  For each row, it fills the template with the corresponding data.
        4.  Adds the generated document to an in-memory ZIP archive.
        5.  Returns the final `.zip` file for download.

### Key Files in the Prototype

-   `gemini.md`: This file.
-   `backend/main.py`: The FastAPI application providing the backend API.
-   `backend/requirements.txt`: Python dependencies for the backend.
-   `src/app/(app)/templates/page.tsx`: The main React component for the user-facing workflow.
-   `package.json`: Node.js dependencies, now including the `xlsx` library.

## Next Steps & Future Improvements

The core functionality is in place. The next steps focus on making the application more robust, scalable, and user-friendly.

1.  **Asynchronous Generation & Scalability:**
    -   For large data files (as noted from the 12k row test), the current synchronous process can cause browser/server timeouts.
    -   **Action:** Refactor the generation process to be asynchronous. When a user starts a job, the API should immediately return a Job ID. The actual generation should happen in the background using a task queue (like Celery with Redis, or a cloud-native solution).
    -   The frontend would then poll a `GET /jobs/{job_id}` endpoint to check the status and provide a download link when ready.

2.  **Persistence and State Management:**
    -   Currently, templates and mappings are not saved.
    -   **Action:** Implement a database (e.g., SQLite for local development, PostgreSQL for production) to store:
        -   User accounts.
        -   Uploaded templates.
        -   Saved column mappings for specific templates.
        -   Generation job history.

3.  **Enhanced User Experience:**
    -   Allow users to save and manage their templates and mappings.
    -   Provide better feedback during the generation process (e.g., a progress bar).
    -   Add an option to generate individual PDFs instead of a ZIP of DOCX files.

4.  **Deployment:**
    -   Plan the deployment architecture (e.g., using Docker containers for the frontend and backend, deploying to a cloud provider).
