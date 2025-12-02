"use client";

import React, { useMemo } from 'react';
import PlotlyChart from './PlotlyChart';
import { prepareImportsByPort, ImportRecord } from '@/lib/import-chart-utils';

interface ImportsByPortChartProps {
    data: ImportRecord[];
    loading?: boolean;
    error?: string | null;
}

export default function ImportsByPortChart({ data, loading, error }: ImportsByPortChartProps) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const portData = prepareImportsByPort(data);

        return [{
            type: 'bar' as const,
            x: portData.map(([port]) => port),
            y: portData.map(([, count]) => count),
            marker: {
                color: '#84A98C', // Sage Green
                opacity: 0.9,
                line: {
                    color: '#52796F',
                    width: 1
                }
            },
            hovertemplate: '<b>%{x}</b><br>Imports: %{y}<extra></extra>'
        }];
    }, [data]);

    const layout = useMemo(() => ({
        title: {
            text: 'Top Ports by Import Volume',
            font: { family: 'Inter, sans-serif', size: 18, color: '#2F3E46' }
        },
        xaxis: {
            title: { text: 'Port', font: { family: 'Inter, sans-serif', color: '#52796F' } },
            tickangle: -45,
            tickfont: { family: 'Inter, sans-serif', color: '#52796F' }
        },
        yaxis: {
            title: { text: 'Number of Imports', font: { family: 'Inter, sans-serif', color: '#52796F' } },
            tickfont: { family: 'Inter, sans-serif', color: '#52796F' },
            gridcolor: '#CAD2C5'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        hovermode: 'closest' as const,
        margin: { t: 40, r: 20, b: 80, l: 60 }
    }), []);

    return (
        <PlotlyChart
            data={chartData}
            layout={layout}
            title="Imports by Port"
            description="Distribution of imports across different ports"
            loading={loading}
            error={error}
        />
    );
}
