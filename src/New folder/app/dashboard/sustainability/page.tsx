"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Leaf, TrendingDown, Wind, Ship, Loader2, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { loadShipmentData } from "@/lib/data-loader";
import { calculateSustainabilityMetrics, SustainabilityMetrics } from "@/lib/sustainability-utils";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';

// Dynamic import for Plotly
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function SustainabilityPage() {
    const [metrics, setMetrics] = useState<SustainabilityMetrics | null>(null);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loadingTips, setLoadingTips] = useState(false);

    useEffect(() => {
        const data = loadShipmentData();
        const calculated = calculateSustainabilityMetrics(data);
        setMetrics(calculated);
    }, []);

    const generateTips = async () => {
        if (!metrics) return;
        setLoadingTips(true);
        try {
            const res = await fetch('/api/generate-sustainability-tips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ metrics })
            });
            const data = await res.json();
            if (data.recommendations) {
                setRecommendations(data.recommendations);
            }
        } catch (error) {
            console.error("Failed to get tips", error);
        } finally {
            setLoadingTips(false);
        }
    };

    const chartData = useMemo(() => {
        if (!metrics) return [];
        const sortedCountries = Object.entries(metrics.emissionsByCountry)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        return [{
            type: 'pie' as const,
            labels: sortedCountries.map(([c]) => c),
            values: sortedCountries.map(([, v]) => v),
            hole: 0.4,
            marker: {
                colors: ['#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#264653']
            },
            textinfo: 'label+percent',
            textposition: 'outside',
            automargin: true
        }];
    }, [metrics]);

    if (!metrics) return <div className="p-8 text-center">Loading sustainability data...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Sustainability & ESG Scorecard</h1>
                <p className="text-muted-foreground">
                    Monitor your supply chain's carbon footprint and optimize for eco-friendly routes.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card/50 backdrop-blur border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total CO2 Emissions</CardTitle>
                        <Wind className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalEmissions} tons</div>
                        <p className="text-xs text-muted-foreground">Estimated based on transport mode</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Green Score</CardTitle>
                        <Leaf className={`h-4 w-4 ${metrics.greenScore > 70 ? 'text-green-500' : 'text-yellow-500'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.greenScore}/100</div>
                        <p className="text-xs text-muted-foreground">Efficiency Rating</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.potentialSavings} tons</div>
                        <p className="text-xs text-muted-foreground">If optimized</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Emitter</CardTitle>
                        <Ship className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold truncate">
                            {Object.entries(metrics.emissionsByCountry).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">Highest carbon footprint source</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-card/50 backdrop-blur relative overflow-hidden border-primary/10">
                    <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
                    <CardHeader>
                        <CardTitle>Emission Sources</CardTitle>
                        <CardDescription>CO2 emissions breakdown by country of origin.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            {React.createElement(Plot as any, {
                                data: chartData,
                                layout: {
                                    paper_bgcolor: 'rgba(0,0,0,0)',
                                    plot_bgcolor: 'rgba(0,0,0,0)',
                                    font: { color: '#888' },
                                    margin: { t: 0, b: 0, l: 0, r: 0 },
                                    showlegend: true,
                                    legend: { orientation: 'h', y: -0.1 }
                                },
                                style: { width: '100%', height: '100%' },
                                config: { displayModeBar: false, responsive: true },
                                useResizeHandler: true
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-card/50 backdrop-blur relative overflow-hidden border-primary/10">
                    <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Eco-Suggestions
                            <Button variant="ghost" size="sm" onClick={generateTips} disabled={loadingTips}>
                                {loadingTips ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-primary" />}
                            </Button>
                        </CardTitle>
                        <CardDescription>AI-driven recommendations to reduce impact.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recommendations.length > 0 ? (
                                recommendations.map((rec, i) => (
                                    <div key={i} className="flex items-start p-3 rounded-lg bg-background/40 border border-border/50 animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                                        <span className="flex h-2 w-2 translate-y-2 rounded-full bg-primary mr-3 shrink-0" />
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium leading-none">{rec.title}</p>
                                                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{rec.impact}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{rec.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    <Leaf className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                    <p>Click the sparkle icon to generate AI sustainability tips.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
