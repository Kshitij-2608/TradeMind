"use client";

import React, { useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DatasetViewerProps {
    data: any[];
}

export default function DatasetViewer({ data }: DatasetViewerProps) {
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <Card className="bg-card/50 backdrop-blur border-primary/10">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Dataset Explorer
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="dataset" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-2 px-4 bg-secondary/20 rounded-lg">
                            <span className="flex items-center gap-2 text-sm font-medium">
                                <FileText className="h-4 w-4" />
                                View Raw Data ({data.length} records)
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                            <div className="rounded-md border overflow-hidden bg-background/50">
                                <div className="overflow-x-auto max-h-[500px]">
                                    <Table>
                                        <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                            <TableRow>
                                                {columns.map((col) => (
                                                    <TableHead key={col} className="whitespace-nowrap font-semibold text-primary">
                                                        {col}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedData.map((row, i) => (
                                                <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                                                    {columns.map((col) => (
                                                        <TableCell key={`${i}-${col}`} className="whitespace-nowrap text-xs max-w-[200px] truncate">
                                                            {String(row[col] || '')}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-xs text-muted-foreground">
                                    Showing {((page - 1) * rowsPerPage) + 1} - {Math.min(page * rowsPerPage, data.length)} of {data.length}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="flex items-center text-sm font-medium min-w-[3rem] justify-center">
                                        {page} / {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
