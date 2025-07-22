"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProjectContextType {
  selectedProjectId: number | null;
  selectedProjectName: string | null;
  selectProject: (id: number, name: string) => void;
  clearProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedProjectName, setSelectedProjectName] = useState<string | null>(null);

  const selectProject = (id: number, name: string) => {
    setSelectedProjectId(id);
    setSelectedProjectName(name);
    // Opcional: Guardar en localStorage para persistencia entre sesiones
    localStorage.setItem('selectedProjectId', String(id));
    localStorage.setItem('selectedProjectName', name);
  };

  const clearProject = () => {
    setSelectedProjectId(null);
    setSelectedProjectName(null);
    localStorage.removeItem('selectedProjectId');
    localStorage.removeItem('selectedProjectName');
  };

  // Cargar desde localStorage al inicio
  useEffect(() => {
    const storedId = localStorage.getItem('selectedProjectId');
    const storedName = localStorage.getItem('selectedProjectName');
    if (storedId && storedName) {
      setSelectedProjectId(parseInt(storedId));
      setSelectedProjectName(storedName);
    }
  }, []);

  return (
    <ProjectContext.Provider value={{ selectedProjectId, selectedProjectName, selectProject, clearProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
