"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Activity, RefreshCw } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { loadShipmentData } from "@/lib/data-loader";
import { runSimulation, SimulationResult } from "@/lib/simulation-utils";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';

// Dynamic import for Plotly
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function SimulatorPage() {
    const [data, setData] = useState<any[]>([]);
    const [params, setParams] = useState({
        shippingCostChange: 0,
        dutyRateChange: 0,
        demandChange: 0,
        supplierPriceChange: 0
    });
    const [result, setResult] = useState<SimulationResult | null>(null);

    useEffect(() => {
        const loadedData = loadShipmentData();
        setData(loadedData);
        // Initial run
        setResult(runSimulation(loadedData, {
            shippingCostChange: 0,
            dutyRateChange: 0,
            demandChange: 0,
            supplierPriceChange: 0
        }));
    }, []);

    // Re-run simulation when params change
    useEffect(() => {
        if (data.length > 0) {
            setResult(runSimulation(data, params));
        }
    }, [params, data]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            notation: "compact"
        }).format(val);
    };

    const resetSimulation = () => {
        setParams({
            shippingCostChange: 0,
            dutyRateChange: 0,
            demandChange: 0,
            supplierPriceChange: 0
        });
    };

    const chartData = useMemo(() => {
        if (!result) return [];
        return [
            {
                x: ['Original Profit', 'Projected Profit'],
                y: [result.originalProfit, result.newProfit],
                type: 'bar' as const,
                marker: {
                    color: [
                        '#64748b', // Slate 500
                        result.newProfit >= result.originalProfit ? '#10b981' : '#ef4444' // Green or Red
                    ]
                },
                text: [formatCurrency(result.originalProfit), formatCurrency(result.newProfit)],
                textposition: 'auto',
            }
        ];
    }, [result]);

    if (!result) return <div className="p-8 text-center">Loading simulator...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Supply Chain Simulator</h1>
                    <Button variant="outline" onClick={resetSimulation} size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                </div>
                <p className="text-muted-foreground">
                    Adjust market variables to forecast their impact on your bottom line.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Controls Panel */}
                <Card className="lg:col-span-1 bg-card/50 backdrop-blur border-primary/20 h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Variables
                        </CardTitle>
                        <CardDescription>Drag sliders to simulate changes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Shipping Costs</label>
                                <Badge variant={params.shippingCostChange > 0 ? "destructive" : "secondary"}>
                                    {params.shippingCostChange > 0 ? '+' : ''}{params.shippingCostChange}%
                                </Badge>
                            </div>
                            <Slider
                                value={[params.shippingCostChange]}
                                min={-50}
                                max={50}
                                step={5}
                                onValueChange={(val) => setParams(p => ({ ...p, shippingCostChange: val[0] }))}
                                className="py-2"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Duty Rates</label>
                                <Badge variant={params.dutyRateChange > 0 ? "destructive" : "secondary"}>
                                    {params.dutyRateChange > 0 ? '+' : ''}{params.dutyRateChange}%
                                </Badge>
                            </div>
                            <Slider
                                value={[params.dutyRateChange]}
                                min={-20}
                                max={20}
                                step={1}
                                onValueChange={(val) => setParams(p => ({ ...p, dutyRateChange: val[0] }))}
                                className="py-2"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Market Demand</label>
                                <Badge variant={params.demandChange < 0 ? "destructive" : "default"} className={params.demandChange > 0 ? "bg-green-500 hover:bg-green-600" : ""}>
                                    {params.demandChange > 0 ? '+' : ''}{params.demandChange}%
                                </Badge>
                            </div>
                            <Slider
                                value={[params.demandChange]}
                                min={-50}
                                max={50}
                                step={5}
                                onValueChange={(val) => setParams(p => ({ ...p, demandChange: val[0] }))}
                                className="py-2"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Supplier Prices</label>
                                <Badge variant={params.supplierPriceChange > 0 ? "destructive" : "secondary"}>
                                    {params.supplierPriceChange > 0 ? '+' : ''}{params.supplierPriceChange}%
                                </Badge>
                            </div>
                            <Slider
                                value={[params.supplierPriceChange]}
                                min={-20}
                                max={20}
                                step={1}
                                onValueChange={(val) => setParams(p => ({ ...p, supplierPriceChange: val[0] }))}
                                className="py-2"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Results Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Key Metrics Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="bg-card/50 backdrop-blur border-primary/10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Projected Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(result.projectedRevenue)}</div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    {params.demandChange !== 0 && (
                                        <span className={params.demandChange > 0 ? "text-green-500" : "text-red-500"}>
                                            {params.demandChange > 0 ? '+' : ''}{params.demandChange}% volume
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 backdrop-blur border-primary/10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Projected Costs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(result.projectedCosts)}</div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    Includes duties & shipping
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={`backdrop-blur border-primary/10 ${result.newProfit >= result.originalProfit ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-foreground">Net Profit Impact</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${result.newProfit >= result.originalProfit ? 'text-green-500' : 'text-red-500'}`}>
                                    {formatCurrency(result.newProfit)}
                                </div>
                                <div className="flex items-center text-sm font-medium mt-1">
                                    {result.profitChange > 0 ? <TrendingUp className="h-3 w-3 mr-1 text-green-500" /> : <TrendingDown className="h-3 w-3 mr-1 text-red-500" />}
                                    <span className={result.profitChange >= 0 ? "text-green-500" : "text-red-500"}>
                                        {result.profitChange > 0 ? '+' : ''}{result.profitChange.toFixed(1)}%
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart */}
                    <Card className="bg-card/50 backdrop-blur relative overflow-hidden border-primary/10">
                        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
                        <CardHeader>
                            <CardTitle>Profit Forecast</CardTitle>
                            <CardDescription>Comparison of current vs. simulated profit margins.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                {React.createElement(Plot as any, {
                                    data: chartData,
                                    layout: {
                                        paper_bgcolor: 'rgba(0,0,0,0)',
                                        plot_bgcolor: 'rgba(0,0,0,0)',
                                        font: { color: '#888' },
                                        margin: { t: 20, b: 40, l: 60, r: 20 },
                                        xaxis: { showgrid: false },
                                        yaxis: { showgrid: true, gridcolor: '#333' },
                                        bargap: 0.5
                                    },
                                    style: { width: '100%', height: '100%' },
                                    config: { displayModeBar: false, responsive: true },
                                    useResizeHandler: true
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
