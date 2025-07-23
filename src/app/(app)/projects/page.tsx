"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useProject } from '@/context/ProjectContext';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { selectProject, selectedProjectId } = useProject();
  const router = useRouter();

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/projects");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al cargar los proyectos.");
      }
      const data = await response.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setError("El nombre del proyecto no puede estar vacío.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newProjectName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al crear el proyecto.");
      }
      setNewProjectName("");
      fetchProjects(); // Recargar la lista de proyectos
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestionar Proyectos</h1>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader><CardTitle className="text-destructive">Error</CardTitle></CardHeader>
          <CardContent><p>{error}</p></CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Proyecto</CardTitle>
          <CardDescription>Define un nombre para tu nuevo proyecto.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              id="new-project-name"
              placeholder="Nombre del Proyecto"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleCreateProject} disabled={isLoading || !newProjectName.trim()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Crear Proyecto
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mis Proyectos</CardTitle>
          <CardDescription>Aquí puedes ver todos tus proyectos.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando proyectos...</p>
          ) : projects.length === 0 ? (
            <p>No hay proyectos creados aún. ¡Crea uno para empezar!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>ID: {project.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      Creado el: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={selectedProjectId === project.id ? "secondary" : "default"}
                      onClick={() => {
                        selectProject(project.id, project.name);
                        router.push(`/projects/${project.id}`);
                      }}
                    >
                      {selectedProjectId === project.id ? "Seleccionado" : "Abrir Proyecto"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
