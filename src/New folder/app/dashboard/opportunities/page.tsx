"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, TrendingUp, ArrowRight, Loader2, MapPin, DollarSign } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { loadShipmentData, getUniqueProducts } from "@/lib/data-loader";
import { Button } from "@/components/ui/button";

interface Opportunity {
    country: string;
    flag: string;
    premium: string;
    reason: string;
    strategy: string;
}

interface ProductOpportunity {
    product: string;
    opportunities: Opportunity[];
}

export default function OpportunitiesPage() {
    const [loading, setLoading] = useState(false);
    const [opportunities, setOpportunities] = useState<ProductOpportunity[]>([]);
    const [topProducts, setTopProducts] = useState<string[]>([]);

    useEffect(() => {
        const data = loadShipmentData();
        // Get top 3 most frequent products to analyze
        const productCounts: Record<string, number> = {};
        data.forEach(item => {
            const p = item.Product || item.invoice_title || 'Unknown';
            productCounts[p] = (productCounts[p] || 0) + 1;
        });

        const sorted = Object.entries(productCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([p]) => p);

        setTopProducts(sorted);
    }, []);

    const findOpportunities = async () => {
        if (topProducts.length === 0) return;

        setLoading(true);
        try {
            const res = await fetch('/api/generate-opportunities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products: topProducts })
            });
            const data = await res.json();
            if (data.opportunities) {
                setOpportunities(data.opportunities);
            }
        } catch (error) {
            console.error("Failed to fetch opportunities", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch on load if we have products
    useEffect(() => {
        if (topProducts.length > 0 && opportunities.length === 0) {
            findOpportunities();
        }
    }, [topProducts]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Global Arbitrage Finder</h1>
                    <Button onClick={findOpportunities} disabled={loading || topProducts.length === 0}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
                        {loading ? "Scanning Markets..." : "Refresh Opportunities"}
                    </Button>
                </div>
                <p className="text-muted-foreground">
                    AI-driven discovery of high-demand international markets for your top products.
                </p>
            </div>

            {opportunities.length === 0 && !loading && (
                <div className="text-center py-20 bg-card/30 rounded-xl border border-dashed border-primary/20">
                    <Globe className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">No Opportunities Found Yet</h3>
                    <p className="text-muted-foreground mb-6">
                        We need some product data to analyze global markets.
                    </p>
                    <Button onClick={findOpportunities} disabled={topProducts.length === 0}>
                        Start Analysis
                    </Button>
                </div>
            )}

            <div className="grid gap-8">
                {opportunities.map((item, index) => (
                    <div key={index} className="space-y-4 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 150}ms` }}>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 bg-gradient-to-b from-primary to-accent rounded-full" />
                            <h2 className="text-xl font-semibold">{item.product}</h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {item.opportunities.map((opp, i) => (
                                <Card key={i} className="bg-card/50 backdrop-blur relative overflow-hidden border-primary/10 hover:border-primary/30 transition-colors group">
                                    <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl shadow-sm rounded-sm overflow-hidden">
                                                    {/* Simple flag fallback using emoji or code */}
                                                    <img
                                                        src={`https://flagcdn.com/24x18/${opp.flag.toLowerCase()}.png`}
                                                        alt={opp.country}
                                                        className="object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                                    />
                                                </span>
                                                <CardTitle className="text-lg">{opp.country}</CardTitle>
                                            </div>
                                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                                {opp.premium} Premium
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                                <p>{opp.reason}</p>
                                            </div>
                                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <ArrowRight className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                                                <p className="italic">"{opp.strategy}"</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
