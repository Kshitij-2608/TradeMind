"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database, FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SavedDatabasesPage() {
    // Placeholder data - in a real app, fetch this from your API
    const savedDatabases = [
        { id: 1, name: "Import Data 2024", records: 1250, date: "2024-03-15", type: "CSV Import" },
        { id: 2, name: "Q1 Export Analysis", records: 850, date: "2024-04-02", type: "Manual Entry" },
        { id: 3, name: "Electronics Sector", records: 3200, date: "2024-05-10", type: "API Sync" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Saved Databases</h1>
                <p className="text-muted-foreground">
                    Manage and access your previously uploaded and analyzed datasets.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedDatabases.map((db) => (
                    <Card key={db.id} className="bg-card/50 backdrop-blur border-primary/10 hover:border-primary/30 transition-all cursor-pointer group">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Database className="h-6 w-6" />
                                </div>
                                <Badge variant="outline">{db.type}</Badge>
                            </div>
                            <CardTitle className="mt-4">{db.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                {db.date}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                {db.records.toLocaleString()} records
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
