"use client";

import { useState, useEffect, useMemo } from "react";
import ChartsGrid from "@/components/dashboard/ChartsGrid";
import AIChartGenerator from "@/components/dashboard/AIChartGenerator";
import DataUpload from "@/components/dashboard/DataUpload";
import DatasetViewer from "@/components/dashboard/DatasetViewer";
import ReportGenerator from "@/components/dashboard/ReportGenerator";
import { loadShipmentData, getUniqueProducts, getUniqueCurrencies } from "@/lib/data-loader";
import { ShipmentData } from "@/types/shipment";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardPage() {
    // State management
    const [data, setData] = useState<ShipmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasCustomData, setHasCustomData] = useState(false);

    // Load default data on mount
    useEffect(() => {
        if (!hasCustomData) {
            try {
                setLoading(true);
                const shipmentData = loadShipmentData();
                setData(shipmentData);
                setError(null);
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        }
    }, [hasCustomData]);

    // Handle custom data upload
    const handleDataLoad = (customData: any[]) => {
        setData(customData);
        setHasCustomData(true);
        setLoading(false);
        setError(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your import/export activities and performance metrics.
                </p>
            </div>

            {/* Data Upload Section */}
            <DataUpload onDataLoad={handleDataLoad} />

            {/* Filter Panel Component */}
            {/* Dataset Viewer Component */}
            <DatasetViewer data={data} />

            {/* Charts Grid Component */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
                    <h2 className="text-2xl font-bold text-foreground">
                        Analytics Overview
                    </h2>
                </div>
                <ChartsGrid
                    data={data}
                    loading={loading}
                    error={error}
                />
            </div>

            {/* AI Chart Generator Component */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-accent to-primary rounded-full" />
                    <h2 className="text-2xl font-bold text-foreground">
                        AI-Powered Insights
                    </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AIChartGenerator data={data} />
                    <ReportGenerator data={data} />
                </div>
            </div>

            <Toaster />
        </div>
    );
}
