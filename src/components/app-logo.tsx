import { FileStack } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <FileStack className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold font-headline text-foreground">
        GMD
      </span>
    </div>
  );
}
