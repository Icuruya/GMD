"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function TemplateDetailPage() {
  const params = useParams();
  const templateId = params.id;
  const projectId = params.project_id; // Obtener project_id de los parámetros de la URL

  const [template, setTemplate] = useState<any>(null);
  const [mappings, setMappings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMappingDetails, setShowMappingDetails] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleViewMapping = (mapping: any) => {
    setSelectedMapping(mapping);
    setShowMappingDetails(true);
  };

  const handleCloseMappingDetails = () => {
    setShowMappingDetails(false);
    setSelectedMapping(null);
  };

  useEffect(() => {
    if (!templateId || !projectId) return; // Asegurarse de tener ambos IDs

    const fetchData = async () => {
      try {
        // Fetch template details
        const templateResponse = await fetch(`http://127.0.0.1:8000/templates/${templateId}`);
        if (!templateResponse.ok) {
          const errorData = await templateResponse.json();
          throw new Error(errorData.detail || "Error al cargar los detalles de la plantilla.");
        }
        const templateData = await templateResponse.json();
        setTemplate(templateData);

        // Fetch associated mappings
        const mappingsResponse = await fetch(`http://127.0.0.1:8000/templates/${templateId}/mappings`);
        if (!mappingsResponse.ok) {
          const errorData = await mappingsResponse.json();
          throw new Error(errorData.detail || "Error al cargar los mapeos de la plantilla.");
        }
        const mappingsData = await mappingsResponse.json();
        // Filtrar mapeos por project_id
        setMappings(mappingsData.filter((m: any) => m.project_id === parseInt(projectId as string)));

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [templateId, projectId]); // Dependencia de ambos IDs

  if (isLoading) {
    return <p>Cargando detalles de la plantilla...</p>;
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardHeader><CardTitle className="text-destructive">Error</CardTitle></CardHeader>
        <CardContent><p>{error}</p></CardContent>
      </Card>
    );
  }

  if (!template) {
    return <p>Plantilla no encontrada.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Detalles de la Plantilla: {template.name}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Plantilla</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>ID:</strong> {template.id}</p>
          <p><strong>Nombre:</strong> {template.name}</p>
          <p><strong>Fecha de Subida:</strong> {new Date(template.created_at).toLocaleString()}</p>
          <p><strong>Proyecto ID:</strong> {template.project_id}</p>
          {/* <p><strong>Ruta del Archivo:</strong> {template.file_path}</p> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mapeos Guardados para esta Plantilla</CardTitle>
          <CardDescription>Configuraciones de mapeo asociadas a esta plantilla.</CardDescription>
        </CardHeader>
        <CardContent>
          {mappings.length === 0 ? (
            <p>No hay mapeos guardados para esta plantilla aún.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre del Mapeo</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-medium">{mapping.id}</TableCell>
                    <TableCell>{mapping.name}</TableCell>
                    <TableCell>{new Date(mapping.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewMapping(mapping)}>
                        Ver Mapeo
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal para Ver Detalles del Mapeo */}
      <Dialog open={showMappingDetails} onOpenChange={setShowMappingDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles del Mapeo: {selectedMapping?.name}</DialogTitle>
            <DialogDescription>
              Aquí se muestra la configuración detallada del mapeo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedMapping && (
              <>
                <Input
                  placeholder="Buscar placeholder o columna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4"
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Placeholder</TableHead>
                    <TableHead>Columna Mapeada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(selectedMapping.mapping_data)
                      .filter(([placeholder, column]) =>
                        placeholder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        String(column).toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(([placeholder, column]) => (
                        <TableRow key={placeholder}>
                          <TableCell className="font-medium">[{placeholder}]</TableCell>
                          <TableCell>{String(column)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
          <Button onClick={handleCloseMappingDetails}>Cerrar</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
