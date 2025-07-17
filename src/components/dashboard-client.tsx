'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, FolderArchive, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const jobs = [
  { id: 1, name: 'Q4 Financial Report', initialProgress: 20, status: 'In Progress' },
  { id: 2, name: 'Marketing Onboarding Kit', initialProgress: 100, status: 'Completed' },
  { id: 3, name: 'Client Agreement Batch', initialProgress: 0, status: 'Failed' },
  { id: 4, name: 'Employee Handbook v3', initialProgress: 75, status: 'In Progress' },
];

const files = [
    { name: 'Financial_Template.docx', type: 'Template', date: '2023-10-26' },
    { name: 'Onboarding_Data.csv', type: 'Data Source', date: '2023-10-25' },
    { name: 'Q3_Report_2023.pdf', type: 'Generated', date: '2023-10-24' },
    { name: 'Client_Agreements.zip', type: 'Archive', date: '2023-10-22' },
];

export default function DashboardClient() {
    const [progressValues, setProgressValues] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        const initialProgress = jobs.reduce((acc, job) => {
            acc[job.id] = job.initialProgress;
            return acc;
        }, {} as { [key: number]: number });
        setProgressValues(initialProgress);

        const interval = setInterval(() => {
            setProgressValues(prev => {
                const newProgress = { ...prev };
                jobs.forEach(job => {
                    if (job.status === 'In Progress' && newProgress[job.id] < 100) {
                        newProgress[job.id] = Math.min(newProgress[job.id] + Math.random() * 5, 100);
                    }
                });
                return newProgress;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Completed': return 'default';
            case 'In Progress': return 'secondary';
            case 'Failed': return 'destructive';
            default: return 'outline';
        }
    };
    
    const getFileIcon = (type: string) => {
        switch (type) {
            case 'Template': return <FileText className="h-5 w-5 text-primary" />;
            case 'Data Source': return <FileText className="h-5 w-5 text-accent" />;
            case 'Generated': return <FileText className="h-5 w-5 text-green-600" />;
            case 'Archive': return <FolderArchive className="h-5 w-5 text-muted-foreground" />;
            default: return <FileText className="h-5 w-5 text-muted-foreground" />;
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Card className="xl:col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline">Active Jobs</CardTitle>
                    <CardDescription>Real-time progress of your document generation tasks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div key={job.id}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">{job.name}</span>
                                    <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
                                </div>
                                <Progress value={progressValues[job.id] || 0} />
                                <p className="text-xs text-muted-foreground mt-1 text-right">{Math.round(progressValues[job.id] || 0)}%</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="xl:col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline">File Management</CardTitle>
                    <CardDescription>Your uploaded templates and generated documents.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {files.map(file => (
                                <TableRow key={file.name}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        {getFileIcon(file.type)}
                                        {file.name}
                                    </TableCell>
                                    <TableCell><Badge variant="outline">{file.type}</Badge></TableCell>
                                    <TableCell>{file.date}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>Download</DropdownMenuItem>
                                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
