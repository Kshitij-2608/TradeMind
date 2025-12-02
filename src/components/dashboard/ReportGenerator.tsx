"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, Sparkles, Loader2 } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import ReactMarkdown from 'react-markdown';

interface ReportGeneratorProps {
    data: any[];
}

export default function ReportGenerator({ data }: ReportGeneratorProps) {
    const [focus, setFocus] = useState('');
    const [report, setReport] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateReport = async () => {
        if (!data || data.length === 0) {
            setError("No dataset available to generate report.");
            return;
        }

        setLoading(true);
        setError(null);
        setReport(null);

        try {
            const response = await fetch('/api/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ focus, data })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to generate report');
            }

            setReport(result.report);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = () => {
        if (!report) return;
        const blob = new Blob([report], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Trade_Report_${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="bg-card/50 backdrop-blur border-primary/20 relative overflow-hidden">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    AI Report Generator
                </CardTitle>
                <CardDescription>
                    Generate a professional trade analysis report based on your current dataset.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        Focus Area (Optional)
                    </label>
                    <Textarea
                        placeholder="e.g., Analyze the impact of rising shipping costs on profit margins..."
                        value={focus}
                        onChange={(e) => setFocus(e.target.value)}
                        className="bg-background/50 min-h-[80px]"
                    />
                </div>

                <Button
                    onClick={generateReport}
                    disabled={loading || !data || data.length === 0}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Analysis...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Report
                        </>
                    )}
                </Button>

                {error && (
                    <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                        {error}
                    </div>
                )}

                {report && (
                    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg text-primary">Generated Report</h3>
                            <Button variant="outline" size="sm" onClick={downloadReport}>
                                <Download className="mr-2 h-4 w-4" />
                                Download MD
                            </Button>
                        </div>
                        <div className="p-6 rounded-lg bg-background/80 border border-border max-h-[500px] overflow-y-auto prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{report}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
