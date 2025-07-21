import re
import io
import json
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from docx import Document
from typing import Set
from celery.result import AsyncResult

# --- Importar la instancia de Celery y la tarea ---
from celery_worker import celery_app, generate_documents_task

# --- Regex para encontrar placeholders como [TEXTO] ---
PLACEHOLDER_REGEX = re.compile(r"\[(.*?)\]")

# --- Inicialización de la Aplicación FastAPI ---
app = FastAPI(
    title="Document Generation API",
    description="API para generar documentos a partir de plantillas .docx y datos.",
    version="0.2.0", # Versión actualizada para reflejar la arquitectura asíncrona
)

# --- Configuración de CORS ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:9002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Funciones de Lógica de Documentos (solo la que se necesita aquí) ---

def find_placeholders_in_docx(doc: Document) -> Set[str]:
    """Analiza un documento y extrae todos los placeholders únicos."""
    placeholders = set()
    for p in doc.paragraphs:
        placeholders.update(PLACEHOLDER_REGEX.findall(p.text))
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    placeholders.update(PLACEHOLDER_REGEX.findall(p.text))
    return placeholders

# --- Endpoints de la API ---

@app.post("/templates/placeholders", tags=["Templates"])
async def get_template_placeholders(file: UploadFile = File(...)):
    """Sube una plantilla .docx y devuelve una lista de los placeholders encontrados."""
    if not file.filename.endswith('.docx'):
        raise HTTPException(status_code=400, detail="El archivo debe ser de tipo .docx")
    try:
        file_content = await file.read()
        document = Document(io.BytesIO(file_content))
        placeholders = find_placeholders_in_docx(document)
        return {"filename": file.filename, "placeholders": sorted(list(placeholders))}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando el archivo: {e}")

@app.post("/jobs", tags=["Jobs"])
async def create_generation_job(
    template_file: UploadFile = File(...),
    data_file: UploadFile = File(...),
    mappings_json: str = Form(...),
    num_rows_to_generate: int | None = Form(None)
):
    """
    Inicia un trabajo de generación de documentos asíncrono.
    Devuelve un ID de trabajo para el seguimiento.
    """
    try:
        mappings = json.loads(mappings_json)
        template_content = await template_file.read()
        data_content = await data_file.read()
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="El formato de mappings_json no es válido.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error leyendo los archivos de entrada: {e}")

    # Lanzar la tarea de Celery en segundo plano
    task = generate_documents_task.delay(
        template_content_bytes=template_content,
        data_content_bytes=data_content,
        data_filename=data_file.filename,
        mappings=mappings,
        num_rows_to_generate=num_rows_to_generate
    )

    return JSONResponse({"job_id": task.id}, status_code=202)

@app.get("/jobs/{job_id}", tags=["Jobs"])
async def get_job_status(job_id: str):
    """
    Consulta el estado de un trabajo de generación.
    """
    task_result = AsyncResult(job_id, app=celery_app)

    response = {
        "job_id": job_id,
        "status": task_result.status,
        "info": task_result.info
    }

    if task_result.successful():
        # Si la tarea se completó, el resultado es la ruta al archivo
        result_file = task_result.result.get('result')
        response['result_url'] = f"/jobs/{job_id}/download"
    
    return JSONResponse(response)

@app.get("/jobs/{job_id}/download", tags=["Jobs"])
async def download_job_result(job_id: str):
    """
    Descarga el archivo ZIP generado por un trabajo completado.
    """
    task_result = AsyncResult(job_id, app=celery_app)

    if not task_result.successful():
        raise HTTPException(status_code=404, detail="El trabajo no se ha completado o ha fallado.")

    result_file_path = task_result.result.get('result')
    file_type = task_result.result.get('file_type', 'zip') # Por defecto es zip

    if not result_file_path:
        raise HTTPException(status_code=404, detail="No se encontró el archivo de resultado.")

    media_type = "application/zip" if file_type == 'zip' else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    filename = f"documentos_{job_id}.zip" if file_type == 'zip' else f"documento_{job_id}.docx"

    return FileResponse(
        path=result_file_path,
        media_type=media_type,
        filename=filename
    )

@app.get("/", tags=["Root"])
async def read_root():
    """Endpoint raíz para verificar que la API está funcionando."""
    return {"message": "Bienvenido a la API de Generación de Documentos (v2 - Asíncrona)."}