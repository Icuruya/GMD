"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from 'xlsx';

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
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", templateFile);
    try {
      const response = await fetch("http://127.0.0.1:8000/templates/placeholders", {
        method: "POST",
        body: formData,
      });
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
        setDataHeaders(headers.map(String));
        const initialMappings: Record<string, string> = {};
        placeholders.forEach(p => {
            initialMappings[p] = "";
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
    if (!templateFile || !dataFile) {
        setError("Faltan el archivo de plantilla o el archivo de datos.");
        return;
    }
    
    // Validar que todos los placeholders estén mapeados
    const unmappedPlaceholders = Object.entries(mappings).filter(([_, value]) => !value);
    if (unmappedPlaceholders.length > 0) {
        setError(`Por favor, mapea todos los placeholders. Faltan: ${unmappedPlaceholders.map(([key]) => `[${key}]`).join(', ')}`);
        return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("template_file", templateFile);
    formData.append("data_file", dataFile);
    formData.append("mappings_json", JSON.stringify(mappings));

    try {
        const response = await fetch("http://127.0.0.1:8000/generate/bulk", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error en el servidor durante la generación.");
        }

        // Gestionar la descarga del archivo ZIP
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "documentos_generados.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const isGenerateButtonDisabled = () => {
    if (isLoading || !templateFile || !dataFile) return true;
    // Deshabilitar si algún placeholder no tiene un valor de columna asignado
    return Object.values(mappings).some(value => !value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Generador de Documentos</h1>
      
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
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerate} disabled={isGenerateButtonDisabled()}>
              {isLoading ? "Generando..." : "Generar Documentos"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
