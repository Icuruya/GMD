'use client'; // <-- ¡Importante! Añade esta línea al principio.

import { usePathname } from 'next/navigation'; // Importa el hook para leer la ruta
import AppSidebar from '@/components/app-sidebar';
import { ProjectProvider } from '@/context/ProjectContext'; // <-- Corregido el nombre del archivo

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Obtiene la ruta actual (ej. "/projects")

  // Lógica: Solo muestra la barra lateral si la ruta NO es la página principal de proyectos.
  const showSidebar = pathname !== '/projects';

  return (
    <ProjectProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Renderizado Condicional de la Barra Lateral */}
        {showSidebar && <AppSidebar />}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </ProjectProvider>
  );
}