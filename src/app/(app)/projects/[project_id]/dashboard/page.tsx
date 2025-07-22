"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useParams } from 'next/navigation';

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params.project_id;

  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/projects/${projectId}/jobs`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Error al cargar los trabajos.");
        }
        const data = await response.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [projectId]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard del Proyecto: {projectId}</h1>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader><CardTitle className="text-destructive">Error</CardTitle></CardHeader>
          <CardContent><p>{error}</p></CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Historial de Trabajos</CardTitle>
          <CardDescription>Revisa el estado y descarga los resultados de tus trabajos de generación.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando historial de trabajos...</p>
          ) : jobs.length === 0 ? (
            <p>No hay trabajos de generación registrados aún para este proyecto.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID del Trabajo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.id}</TableCell>
                    <TableCell>{job.status}</TableCell>
                    <TableCell>{new Date(job.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      {job.status === "SUCCESS" && job.result_file_path && (
                        <Button asChild size="sm">
                          <a href={`http://127.0.0.1:8000/jobs/${job.id}/download`} target="_blank" rel="noopener noreferrer">
                            Descargar
                          </a>
                        </Button>
                      )}
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
