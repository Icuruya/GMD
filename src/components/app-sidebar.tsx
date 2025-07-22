'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  ArrowRightLeft,
  FileCog,
  Settings,
  LogOut,
  UserCircle,
  FileText,
  FolderOpen,
  FolderDot
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useProject } from '@/context/ProjectContext';

const navItems = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/templates', icon: FileText, label: 'Generate' },
  { href: '/templates/manage', icon: FileText, label: 'Manage Templates' },
  { href: '/mapper', icon: ArrowRightLeft, label: 'AI Mapper' },
  { href: '/rules', icon: FileCog, label: 'Rule Builder' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { selectedProjectId, selectedProjectName } = useProject();

  const getHref = (baseHref: string) => {
    if (selectedProjectId) {
      return `/projects/${selectedProjectId}${baseHref}`;
    } else if (baseHref === '/projects') {
      return baseHref;
    } else {
      return '/projects'; // Redirigir a la página de proyectos si no hay uno seleccionado
    }
  };

  const isLinkActive = (baseHref: string) => {
    if (selectedProjectId) {
      return pathname === `/projects/${selectedProjectId}${baseHref}`;
    } else {
      return pathname === baseHref;
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card text-card-foreground">
      <div className="p-4">
        <AppLogo />
      </div>
      <nav className="flex-1 px-4 py-2">
        {selectedProjectId && selectedProjectName && (
          <div className="mb-4 p-2 bg-primary/10 rounded-md flex items-center gap-2">
            <FolderDot className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">{selectedProjectName}</span>
          </div>
        )}
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={getHref(item.href)}>
                <Button
                  variant={isLinkActive(item.href) ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  disabled={!selectedProjectId && item.href !== '/projects'}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <Separator className="my-2" />
        <div className="flex items-center gap-3 py-2">
            <UserCircle className="h-8 w-8 text-muted-foreground" />
            <div className='flex-1'>
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-muted-foreground">user@gmd.com</p>
            </div>
            <Button variant="ghost" size="icon" asChild>
                <Link href="/"><LogOut className="h-4 w-4" /></Link>
            </Button>
        </div>
      </div>
    </aside>
  );
}
