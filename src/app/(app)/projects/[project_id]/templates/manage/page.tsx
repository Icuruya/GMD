"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from 'next/navigation';

export default function ManageTemplatesPage() {
  const params = useParams();
  const projectId = params.project_id;

  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchTemplates = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/projects/${projectId}/templates`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Error al cargar las plantillas.");
        }
        const data = await response.json();
        setTemplates(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [projectId]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestionar Plantillas</h1>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader><CardTitle className="text-destructive">Error</CardTitle></CardHeader>
          <CardContent><p>{error}</p></CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Plantillas Guardadas</CardTitle>
          <CardDescription>Aquí puedes ver y gestionar tus plantillas .docx guardadas.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando plantillas...</p>
          ) : templates.length === 0 ? (
            <p>No hay plantillas guardadas aún para este proyecto.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha de Subida</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.id}</TableCell>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{new Date(template.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/projects/${projectId}/templates/${template.id}`}>Ver Detalles</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
