"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle2, AlertCircle } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function ClassificationPage() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<null | {
        hs_code: string;
        title: string;
        duty_rate: string;
        gst_rate: string;
        reasoning: string;
        compliance_notes?: string;
    }>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/classify-hs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: query })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to classify product');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">AI HS Code Classifier</h1>
                <p className="text-muted-foreground">
                    Instantly classify goods and find the optimal Harmonized System codes for India.
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                <Card className="bg-card/50 backdrop-blur relative overflow-hidden border-primary/20">
                    <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
                    <CardHeader>
                        <CardTitle>Product Description</CardTitle>
                        <CardDescription>Describe your item in plain English (e.g., "Cotton t-shirt with printed logo")</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter product description..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="bg-background/50 h-12 text-lg"
                                    disabled={loading}
                                />
                                <Button type="submit" disabled={loading || !query} className="h-12 px-6">
                                    {loading ? "Analyzing..." : <Search className="h-5 w-5" />}
                                </Button>
                            </div>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </form>
                    </CardContent>
                </Card>

                {result && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Main Result Card */}
                        <Card className="bg-primary/5 border-primary/20 overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <CheckCircle2 className="h-32 w-32 text-primary" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl text-primary">HS Code: {result.hs_code}</CardTitle>
                                <CardDescription className="text-lg font-medium text-foreground/80">{result.title}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Basic Customs Duty</p>
                                    <p className="text-2xl font-bold">{result.duty_rate}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">IGST Rate</p>
                                    <p className="text-2xl font-bold">{result.gst_rate}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-card/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-accent" />
                                        Reasoning
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">{result.reasoning}</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        Compliance Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {result.compliance_notes || "No specific restrictions found for standard import."}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
