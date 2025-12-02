"use client";

import React, { useMemo } from 'react';
import PlotlyChart from './PlotlyChart';
import { prepareImportsByProduct, ImportRecord } from '@/lib/import-chart-utils';

interface ImportsByProductChartProps {
    data: ImportRecord[];
    loading?: boolean;
    error?: string | null;
}

export default function ImportsByProductChart({ data, loading, error }: ImportsByProductChartProps) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const productData = prepareImportsByProduct(data);

        return [{
            type: 'bar' as const,
            y: productData.map(([product]) => product.length > 30 ? product.substring(0, 30) + '...' : product),
            x: productData.map(([, count]) => count),
            orientation: 'h' as const,
            marker: {
                color: '#E07A5F', // Muted Rust
                opacity: 0.9,
                line: {
                    color: '#3D405B',
                    width: 1
                }
            },
            hovertemplate: '<b>%{y}</b><br>Count: %{x}<extra></extra>'
        }];
    }, [data]);

    const layout = useMemo(() => ({
        title: {
            text: 'Top Products/Invoice Titles',
            font: { family: 'Inter, sans-serif', size: 18, color: '#2F3E46' }
        },
        xaxis: {
            title: { text: 'Number of Imports', font: { family: 'Inter, sans-serif', color: '#52796F' } },
            tickfont: { family: 'Inter, sans-serif', color: '#52796F' },
            gridcolor: '#CAD2C5'
        },
        yaxis: {
            automargin: true,
            tickfont: { family: 'Inter, sans-serif', size: 11, color: '#2F3E46' }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        hovermode: 'closest' as const,
        height: 500,
        margin: { t: 40, r: 20, b: 40, l: 150 }
    }), []);

    return (
        <PlotlyChart
            data={chartData}
            layout={layout}
            title="Imports by Product"
            description="Top products by import frequency"
            loading={loading}
            error={error}
        />
    );
}
