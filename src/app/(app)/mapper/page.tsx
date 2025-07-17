import PageHeader from '@/components/page-header';
import MapperClient from '@/components/mapper-client';

export default function MapperPage() {
  return (
    <>
      <PageHeader
        title="Intelligent Placeholder Mapper"
        description="Let AI semantically match your template placeholders with data source columns."
      />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <MapperClient />
      </main>
    </>
  );
}
