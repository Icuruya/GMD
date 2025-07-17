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
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/mapper', icon: ArrowRightLeft, label: 'AI Mapper' },
  { href: '/rules', icon: FileCog, label: 'Rule Builder' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card text-card-foreground">
      <div className="p-4">
        <AppLogo />
      </div>
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
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
