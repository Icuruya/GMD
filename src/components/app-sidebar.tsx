'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, FileText, LayoutDashboard, FolderKanban } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';

const AppSidebar = () => {
  const pathname = usePathname();
  // Obtenemos los datos correctos del contexto, tal como se definen en tu archivo
  const { selectedProjectId, selectedProjectName } = useProject();

  // Si el ID o el Nombre del proyecto no están disponibles, no renderizamos NADA.
  // Esto previene el error "Cannot read properties of null".
  if (!selectedProjectId || !selectedProjectName) {
    return null;
  }

  // Los enlaces se construyen usando el ID del proyecto seleccionado
  const navItems = [
    { href: `/projects/${selectedProjectId}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/projects/${selectedProjectId}/generate`, label: 'Generate', icon: FileText },
    { href: `/projects/${selectedProjectId}/templates/manage`, label: 'Manage Templates', icon: FolderKanban },
    // { href: '#', label: 'AI Mapper', icon: Bot }, // Comentado
    // { href: '#', label: 'Rule Builder', icon: SlidersHorizontal }, // Comentado
    { href: '#', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-white dark:border-gray-800 dark:bg-gray-950 p-4 flex flex-col">
      <div className="p-2 mb-4">
        {/* Mostramos el nombre del proyecto activo */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate" title={selectedProjectName}>
          {selectedProjectName}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Project Workspace</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith(item.href)
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AppSidebar;