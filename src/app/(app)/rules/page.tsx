import PageHeader from '@/components/page-header';
import RuleBuilderClient from '@/components/rule-builder-client';
import { Button } from '@/components/ui/button';
import 'reactflow/dist/style.css';

export default function RulesPage() {
  return (
    <div className="flex flex-col h-screen">
      <PageHeader
        title="Visual Rule Builder"
        description="Define complex document assembly logic with a drag-and-drop interface."
      >
        <Button variant="outline">Import</Button>
        <Button>Save Rules</Button>
      </PageHeader>
      <main className="flex-1 overflow-hidden">
        <RuleBuilderClient />
      </main>
    </div>
  );
}
