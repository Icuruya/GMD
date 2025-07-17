'use client';

import { useState } from 'react';
import {
  suggestPlaceholderMappings,
  type SuggestPlaceholderMappingsOutput,
} from '@/ai/flows/suggest-placeholder-mappings';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { ArrowRight, BrainCircuit, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type MapperState = {
  loading: boolean;
  error: string | null;
  result: SuggestPlaceholderMappingsOutput | null;
};

export default function MapperClient() {
  const [placeholders, setPlaceholders] = useState('FirstName\nLastName\nStartDate\nJobTitle');
  const [columns, setColumns] = useState('employee_first_name\nemployee_last_name\nrole\nemail\nhire_date');
  const [state, setState] = useState<MapperState>({
    loading: false,
    error: null,
    result: null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ loading: true, error: null, result: null });

    const templatePlaceholders = placeholders.split('\n').filter(p => p.trim() !== '');
    const dataSourceColumns = columns.split('\n').filter(c => c.trim() !== '');

    if (templatePlaceholders.length === 0 || dataSourceColumns.length === 0) {
      setState({
        loading: false,
        error: 'Please provide at least one placeholder and one column.',
        result: null,
      });
      return;
    }

    try {
      const result = await suggestPlaceholderMappings({
        templatePlaceholders,
        dataSourceColumns,
      });
      setState({ loading: false, error: null, result });
    } catch (e: any) {
      setState({ loading: false, error: e.message || 'An unknown error occurred.', result: null });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Provide Inputs</CardTitle>
            <CardDescription>Enter your placeholders and columns, one per line.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="placeholders" className="font-semibold">Template Placeholders</Label>
                    <Textarea
                        id="placeholders"
                        value={placeholders}
                        onChange={(e) => setPlaceholders(e.target.value)}
                        rows={10}
                        placeholder="e.g.&#10;FirstName&#10;LastName"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="columns" className="font-semibold">Data Source Columns</Label>
                    <Textarea
                        id="columns"
                        value={columns}
                        onChange={(e) => setColumns(e.target.value)}
                        rows={10}
                        placeholder="e.g.&#10;employee_first_name&#10;employee_last_name"
                    />
                </div>
                <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" disabled={state.loading}>
                        {state.loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <BrainCircuit className="mr-2 h-4 w-4" />
                        )}
                        Suggest Mappings
                    </Button>
                </div>
            </form>
        </CardContent>
      </Card>

      {state.error && (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.result && (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Suggested Mappings</CardTitle>
                <CardDescription>AI-powered suggestions for your placeholder mappings.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Template Placeholder</TableHead>
                            <TableHead className="w-[50px] text-center"></TableHead>
                            <TableHead>Suggested Data Column</TableHead>
                            <TableHead className="text-right">Confidence Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {state.result.map((mapping, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{mapping.placeholder}</TableCell>
                                <TableCell className="text-center text-muted-foreground"><ArrowRight className="h-4 w-4" /></TableCell>
                                <TableCell className="font-medium">{mapping.suggestedColumn}</TableCell>
                                <TableCell className="text-right font-mono">
                                    {(mapping.confidenceScore * 100).toFixed(1)}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
