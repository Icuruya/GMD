import re
import io
import json
import pandas as pd
import zipfile
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from docx import Document
from typing import Set, Dict, Any

# --- Regex para encontrar placeholders como [TEXTO] ---
PLACEHOLDER_REGEX = re.compile(r"\[(.*?)\]")

# --- Inicialización de la Aplicación FastAPI ---
app = FastAPI(
    title="Document Generation API",
    description="API para generar documentos a partir de plantillas .docx y datos.",
    version="0.1.0",
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

# --- Funciones de Lógica de Documentos ---

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

def replace_placeholders_in_doc(doc: Document, data: Dict[str, Any]):
    """Reemplaza los placeholders en un documento con los datos proporcionados."""
    for p in doc.paragraphs:
        for key, value in data.items():
            # Usamos una forma simple de reemplazo que funciona bien para la mayoría de los casos
            if f"[{key}]" in p.text:
                 p.text = p.text.replace(f"[{key}]", str(value))

    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    for key, value in data.items():
                        if f"[{key}]" in p.text:
                            p.text = p.text.replace(f"[{key}]", str(value))

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

@app.post("/generate/bulk", tags=["Generation"])
async def generate_bulk_documents(
    template_file: UploadFile = File(...),
    data_file: UploadFile = File(...),
    mappings_json: str = Form(...)
):
    """
    Genera múltiples documentos a partir de una plantilla, un archivo de datos (Excel/CSV)
    y un mapeo de columnas, y los devuelve como un archivo ZIP.
    """
    # --- 1. Cargar y Validar Entradas ---
    try:
        mappings = json.loads(mappings_json)
        template_content = await template_file.read()
        data_content = await data_file.read()
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="El formato de mappings_json no es válido.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error leyendo los archivos: {e}")

    # --- 2. Leer el archivo de datos con Pandas ---
    try:
        if data_file.filename.endswith('.xlsx'):
            df = pd.read_excel(io.BytesIO(data_content))
        elif data_file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(data_content))
        else:
            raise HTTPException(status_code=400, detail="El archivo de datos debe ser .xlsx o .csv")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error leyendo el archivo de datos: {e}")

    # --- 3. Generar Documentos y Comprimir en ZIP ---
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Iterar sobre cada fila del archivo de datos
        for index, row in df.iterrows():
            # Crear una nueva instancia de la plantilla para cada documento
            doc = Document(io.BytesIO(template_content))
            
            # Crear el diccionario de datos para esta fila usando los mapeos
            data_for_row = {}
            for placeholder, column_name in mappings.items():
                if column_name in df.columns:
                    data_for_row[placeholder] = row[column_name]
            
            # Reemplazar los placeholders
            replace_placeholders_in_doc(doc, data_for_row)
            
            # Guardar el documento generado en un buffer de memoria
            doc_buffer = io.BytesIO()
            doc.save(doc_buffer)
            doc_buffer.seek(0)
            
            # Añadir el documento al ZIP
            # Usamos el índice de la fila para un nombre de archivo único
            zip_file.writestr(f"documento_{index + 1}.docx", doc_buffer.getvalue())

    zip_buffer.seek(0)

    # --- 4. Devolver el ZIP para Descarga ---
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=documentos_generados.zip"}
    )


@app.get("/", tags=["Root"])
async def read_root():
    """Endpoint raíz para verificar que la API está funcionando."""
    return {"message": "Bienvenido a la API de Generación de Documentos. Visita /docs para la documentación."}

