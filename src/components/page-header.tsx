import { type ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-4 p-4 md:p-6 lg:p-8">
        <div className="grid gap-1">
          <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
      <Separator />
    </>
  );
}
