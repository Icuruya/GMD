import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import DashboardClient from '@/components/dashboard-client';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Welcome back! Here's an overview of your projects.">
        <Button>
          <UploadCloud className="mr-2 h-4 w-4" />
          New Job
        </Button>
      </PageHeader>
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <DashboardClient />
      </main>
    </>
  );
}
