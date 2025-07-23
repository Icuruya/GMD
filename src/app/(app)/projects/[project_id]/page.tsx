"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, History, BarChart2 } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export default function ProjectHubPage() {
  const params = useParams();
  const projectId = params.project_id;
  const { selectedProjectName } = useProject();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Proyecto: {selectedProjectName || `ID ${projectId}`}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card para Generar Documentos */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Generar Documentos
            </CardTitle>
            <CardDescription>Sube tus plantillas y datos para generar nuevos documentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push(`/projects/${projectId}/templates`)} className="w-full">
              Ir a Generador
            </Button>
          </CardContent>
        </Card>

        {/* Card para Revisar Historial */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-6 w-6 text-primary" />
              Revisar Historial
            </CardTitle>
            <CardDescription>Consulta el historial de todos los trabajos de generación para este proyecto.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push(`/projects/${projectId}/dashboard`)} className="w-full">
              Ver Historial
            </Button>
          </CardContent>
        </Card>

        {/* Card para Revisar Estadísticas (Desactivado) */}
        <Card className="hover:shadow-lg transition-shadow bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <BarChart2 className="h-6 w-6 text-muted-foreground" />
              Revisar Estadísticas
            </CardTitle>
            <CardDescription>Analiza las métricas y el rendimiento de tus generaciones (Próximamente).</CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled className="w-full">
              Próximamente
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Aquí se puede añadir el visualizador de plantillas en el futuro */}
      <Card>
        <CardHeader>
          <CardTitle>Visualizador de Plantilla</CardTitle>
          <CardDescription>(Próximamente)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground">El visualizador de plantillas aparecerá aquí.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
