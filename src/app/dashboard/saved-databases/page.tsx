"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database, FileText, Calendar, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SavedDatabasesPage() {
    const [savedDatabases, setSavedDatabases] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    const fetchDatabases = React.useCallback(async () => {
        try {
            const res = await fetch('/api/datasets');
            if (res.ok) {
                const data = await res.json();
                setSavedDatabases(data);
            }
        } catch (error) {
            console.error("Failed to fetch databases", error);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchDatabases();
    }, [fetchDatabases]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent card click
        if (!confirm("Are you sure you want to delete this dataset?")) return;

        try {
            const res = await fetch(`/api/datasets/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast({ title: "Dataset deleted" });
                fetchDatabases();
            } else {
                throw new Error("Failed to delete");
            }
        } catch (error) {
            toast({ title: "Error", description: "Could not delete dataset", variant: "destructive" });
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading saved databases...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Saved Databases</h1>
                <p className="text-muted-foreground">
                    Manage and access your previously uploaded and analyzed datasets.
                </p>
            </div>

            {savedDatabases.length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No saved databases found. Upload data in the Dashboard to save it here.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {savedDatabases.map((db) => (
                        <Card key={db.id} className="bg-card/50 backdrop-blur border-primary/10 hover:border-primary/30 transition-all cursor-pointer group relative">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Database className="h-6 w-6" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline">Uploaded</Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive hover:bg-destructive/10"
                                            onClick={(e) => handleDelete(e, db.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardTitle className="mt-4 truncate" title={db.name}>{db.name}</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(db.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileText className="h-4 w-4" />
                                    {db._count?.records?.toLocaleString() || 0} records
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
