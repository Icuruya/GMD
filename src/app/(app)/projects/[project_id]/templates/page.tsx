"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from 'xlsx';
import { useRouter, useParams } from 'next/navigation'; // Importar useParams

// Componente principal de la página para gestionar plantillas
export default function TemplatesPage() {
  // --- Estados para el Flujo Completo ---
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [dataHeaders, setDataHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [numRowsToGenerate, setNumRowsToGenerate] = useState<number | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [jobResultUrl, setJobResultUrl] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [existingTemplates, setExistingTemplates] = useState<any[]>([]);
  const [savedMappings, setSavedMappings] = useState<any[]>([]);

  const router = useRouter();
  const params = useParams();
  const projectId = params.project_id; // Obtener project_id de los parámetros de la URL

  useEffect(() => {
    if (!projectId) { // Usar projectId de la URL
      setExistingTemplates([]);
      return;
    }

    const fetchTemplates = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/projects/${projectId}/templates`); // Usar projectId
        if (response.ok) {
          const data = await response.json();
          setExistingTemplates(data);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, [projectId]); // Dependencia de projectId

  // --- Manejadores ---

  const handleTemplateFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setTemplateFile(event.target.files[0]);
      setPlaceholders([]);
      setDataFile(null);
      setDataHeaders([]);
      setMappings({});
      setError(null);
    }
  };

  const handleDetectPlaceholders = async () => {
    if (!templateFile) {
      setError("Por favor, selecciona un archivo .docx de plantilla");
      return;
    }
    if (!projectId) { // Usar projectId
      setError("Error: ID de proyecto no encontrado en la URL."); // Mensaje más específico
      return;
    }
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", templateFile);
    formData.append("project_id", String(projectId)); // Usar projectId
    try {
      const response = await fetch("http://127.0.0.1:8000/templates", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ocurrió un error en el servidor");
      }
      const data = await response.json();
      setPlaceholders(data.placeholders || []);
      setTemplateId(data.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setDataFile(file);
    setError(null);
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const headers: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
        const stringHeaders = headers.map(String);
        setDataHeaders(stringHeaders);

        const initialMappings: Record<string, string> = {};
        placeholders.forEach(p => {
            const matchingHeader = stringHeaders.find(h => h.toLowerCase() === p.toLowerCase());
            initialMappings[p] = matchingHeader || "";
        });
        setMappings(initialMappings);
      } catch (err) {
        setError("No se pudo leer el archivo de datos. Asegúrate de que sea un Excel o CSV válido.");
        setDataHeaders([]);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        setError("Error al leer el archivo.");
        setIsLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  const handleMappingChange = (placeholder: string, header: string) => {
    setMappings(prev => ({ ...prev, [placeholder]: header }));
  };

  const handleGenerate = async () => {
    if ((!templateFile && templateId === null) || !dataFile || !projectId) { // Usar projectId
        setError("Faltan el archivo de plantilla, el archivo de datos o no hay un proyecto válido en la URL."); // Mensaje más específico
        return;
    }
    
    const unmappedPlaceholders = Object.entries(mappings).filter(([_, value]) => !value);
    if (unmappedPlaceholders.length > 0) {
        setError(`Por favor, mapea todos los placeholders. Faltan: ${unmappedPlaceholders.map(([key]) => `[${key}]`).join(', ')}`);
        return;
    }

    setIsLoading(true);
    setError(null);
    setJobId(null);
    setJobStatus(null);
    setJobResultUrl(null);

    const formData = new FormData();
    formData.append("template_id", String(templateId));
    formData.append("data_file", dataFile);
    formData.append("mappings_json", JSON.stringify(mappings));
    formData.append("project_id", String(projectId)); // Usar projectId
    if (numRowsToGenerate !== null) {
      formData.append("num_rows_to_generate", String(numRowsToGenerate));
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/jobs", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error en el servidor al iniciar la generación.");
        }

        const data = await response.json();
        setJobId(data.job_id);
        setJobStatus("PENDING");

        // Iniciar el polling para el estado del trabajo
        const pollStatus = async () => {
          if (!data.job_id) return;
          const statusResponse = await fetch(`http://127.0.0.1:8000/jobs/${data.job_id}`);
          const statusData = await statusResponse.json();
          setJobStatus(statusData.status);
          if (statusData.status === "SUCCESS") {
            setJobResultUrl(statusData.result_url);
            setIsLoading(false);
          } else if (statusData.status === "FAILURE") {
            setError(statusData.info?.status || "Error desconocido durante la generación.");
            setIsLoading(false);
          } else {
            setTimeout(pollStatus, 2000); // Reintentar en 2 segundos
          }
        };
        pollStatus();

    } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
    }
  };

  const isGenerateButtonDisabled = () => {
    if (isLoading || (!templateFile && templateId === null) || !dataFile || !projectId) return true; // Usar projectId
    // Deshabilitar si algún placeholder no tiene un valor de columna asignado
    return Object.values(mappings).some(value => !value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Generador de Documentos {projectId && `(${projectId})`}</h1> {/* Mostrar projectId en el título */}

      {!projectId ? ( // Usar projectId
        <Card className="border-blue-500 bg-blue-50/10">
          <CardHeader><CardTitle className="text-blue-700">Error de Proyecto</CardTitle></CardHeader>
          <CardContent>
            <p>No se ha especificado un proyecto válido en la URL. Por favor, selecciona un proyecto desde la página de proyectos.</p>
            <Button onClick={() => router.push('/projects')} className="mt-4">Ir a Proyectos</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* --- PASO 0: SELECCIONAR PLANTILLA EXISTENTE --- */}
          {existingTemplates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Paso 1: Elige una Plantilla</CardTitle>
                <CardDescription>
                  Selecciona una de tus plantillas guardadas o sube una nueva a continuación.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select onValueChange={async (value) => {
                  const templateId = parseInt(value);
                  setTemplateId(templateId);
                  setIsLoading(true);
                  try {
                    const response = await fetch(`http://127.0.0.1:8000/templates/${templateId}/placeholders`);
                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.detail || "Ocurrió un error en el servidor");
                    }
                    const data = await response.json();
                    setPlaceholders(data.placeholders || []);
                  } catch (err: any) {
                    setError(err.message);
                  } finally {
                    setIsLoading(false);
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una plantilla existente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {existingTemplates.map((template) => (
                      <SelectItem key={template.id} value={String(template.id)}>{template.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}
          
          {/* --- PASO 1: SUBIR PLANTILLA --- */}
          <Card>
            <CardHeader>
              <CardTitle>Paso 1: Sube tu Plantilla</CardTitle>
              <CardDescription>
                Selecciona un archivo .docx. El sistema detectará los campos como [NOMBRE].
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="template-file">Archivo .docx</Label>
                <Input id="template-file" type="file" accept=".docx" onChange={handleTemplateFileChange} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleDetectPlaceholders} disabled={!templateFile || isLoading}>
                {isLoading && placeholders.length === 0 ? "Analizando..." : "Analizar Placeholders"}
              </Button>
            </CardFooter>
          </Card>

          {error && (
            <Card className="border-destructive bg-destructive/10">
              <CardHeader><CardTitle className="text-destructive">Error</CardTitle></CardHeader>
              <CardContent><p>{error}</p></CardContent>
            </Card>
          )}

          {/* --- PASO 2: SUBIR DATOS --- */}
          {placeholders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Paso 2: Sube tus Datos</CardTitle>
                <CardDescription>
                  Sube el archivo Excel (.xlsx) o CSV con la información. La primera fila debe contener los encabezados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                    <div className="bg-muted text-muted-foreground rounded-md p-4 flex-1">
                        <h3 className="font-semibold mb-2">Placeholders Detectados:</h3>
                        <div className="flex flex-wrap gap-2">
                        {placeholders.map((p) => (
                            <span key={p} className="bg-background text-foreground rounded-md px-2 py-1 text-sm">
                            [{p}]
                            </span>
                        ))}
                        </div>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="data-file">Archivo de Datos (.xlsx, .csv)</Label>
                        <Input id="data-file" type="file" accept=".xlsx, .csv" onChange={handleDataFileChange} disabled={isLoading} />
                    </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- PASO 3: MAPEAR DATOS --- */}
          {dataHeaders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Paso 3: Mapea tus Datos</CardTitle>
                <CardDescription>
                  Asocia cada placeholder con la columna correspondiente de tu archivo de datos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {placeholders.map((p) => (
                  <div key={p} className="grid grid-cols-3 items-center gap-4">
                    <Label className="text-right">[{p}]</Label>
                    <div className="col-span-2">
                      <Select onValueChange={(value) => handleMappingChange(p, value)} value={mappings[p]}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una columna..." />
                        </SelectTrigger>
                        <SelectContent>
                          {dataHeaders.map((h) => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}

                {/* Sección para Guardar/Cargar Mapeos */}
                {templateId && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Mapeos Guardados</h3>
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Nombre del mapeo"
                        id="mapping-name"
                        className="flex-1"
                      />
                      <Button onClick={async () => {
                        const mappingName = (document.getElementById("mapping-name") as HTMLInputElement).value;
                        if (!mappingName) {
                          setError("Por favor, ingresa un nombre para el mapeo.");
                          return;
                        }
                        if (!templateId) {
                          setError("Selecciona una plantilla primero para guardar el mapeo.");
                          return;
                        }
                        if (!projectId) { // Validar projectId
                          setError("No hay un proyecto seleccionado para guardar el mapeo.");
                          return;
                        }
                        setIsLoading(true);
                        setError(null);
                        try {
                          const response = await fetch("http://127.0.0.1:8000/mappings", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              name: mappingName,
                              template_id: templateId,
                              mapping_data: mappings,
                              project_id: projectId // Enviar project_id
                            }),
                          });
                          if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.detail || "Error al guardar el mapeo.");
                          }
                          // Actualizar la lista de mapeos guardados
                          const updatedMappingsResponse = await fetch(`http://127.0.0.1:8000/templates/${templateId}/mappings`);
                          if (updatedMappingsResponse.ok) {
                            const updatedMappingsData = await updatedMappingsResponse.json();
                            setSavedMappings(updatedMappingsData);
                          }
                          alert("Mapeo guardado exitosamente!");
                        } catch (err: any) {
                          setError(err.message);
                        } finally {
                          setIsLoading(false);
                        }
                      }} disabled={isLoading || !templateId || Object.values(mappings).some(value => !value)}>
                        Guardar Mapeo
                      </Button>
                    </div>

                    {savedMappings.length > 0 && (
                      <Select onValueChange={(value) => {
                        const selectedMapping = savedMappings.find(m => m.id === parseInt(value));
                        if (selectedMapping) {
                          setMappings(selectedMapping.mapping_data);
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Cargar mapeo guardado..." />
                        </SelectTrigger>
                        <SelectContent>
                          {savedMappings.map((m) => (
                            <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col items-start gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="num-rows-to-generate">Número de filas a generar (opcional)</Label>
                  <Input
                    id="num-rows-to-generate"
                    type="number"
                    min="1"
                    placeholder="Todas las filas"
                    value={numRowsToGenerate === null ? '' : numRowsToGenerate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNumRowsToGenerate(value === '' ? null : parseInt(value));
                    }}
                    disabled={isLoading}
                  />
                </div>
                <Button onClick={handleGenerate} disabled={isGenerateButtonDisabled()}>
                  {isLoading ? "Generando..." : "Generar Documentos"}
                </Button>
              </CardFooter>
            </Card>
          )}

          {jobId && (
            <Card>
              <CardHeader>
                <CardTitle>Estado de la Generación</CardTitle>
                <CardDescription>
                  ID del Trabajo: {jobId}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Estado: {jobStatus}</p>
                {jobStatus === "PROGRESS" && jobStatus && (
                  <p>Progreso: {jobStatus}</p>
                )}
                {jobResultUrl && (
                  <Button asChild className="mt-4">
                    <a href={`http://127.0.0.1:8000${jobResultUrl}`} target="_blank" rel="noopener noreferrer">
                      Descargar Documentos
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
