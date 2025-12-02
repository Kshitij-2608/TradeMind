"use client";

import React, { useMemo } from 'react';
import PlotlyChart from './PlotlyChart';
import { prepareImportTimeline, ImportRecord } from '@/lib/import-chart-utils';

interface ImportTimelineChartProps {
    data: ImportRecord[];
    loading?: boolean;
    error?: string | null;
}

export default function ImportTimelineChart({ data, loading, error }: ImportTimelineChartProps) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const timelineData = prepareImportTimeline(data);
        const sortedDates = Object.keys(timelineData).sort();

        return [{
            type: 'scatter' as const,
            mode: 'lines+markers' as const,
            x: sortedDates,
            y: sortedDates.map(date => timelineData[date]),
            line: {
                color: '#3D405B', // Warm Charcoal
                width: 3,
                shape: 'spline' // Smooth curves
            },
            marker: {
                color: '#F2CC8F', // Oatmeal Beige/Gold
                size: 8,
                line: {
                    color: '#3D405B',
                    width: 2
                }
            },
            fill: 'tozeroy',
            fillcolor: 'rgba(61, 64, 91, 0.1)',
            hovertemplate: '<b>%{x}</b><br>Imports: %{y}<extra></extra>'
        }];
    }, [data]);

    const layout = useMemo(() => ({
        title: {
            text: 'Import Trends Over Time',
            font: { family: 'Inter, sans-serif', size: 18, color: '#2F3E46' }
        },
        xaxis: {
            title: { text: 'Month', font: { family: 'Inter, sans-serif', color: '#52796F' } },
            tickfont: { family: 'Inter, sans-serif', color: '#52796F' },
            gridcolor: '#CAD2C5'
        },
        yaxis: {
            title: { text: 'Number of Imports', font: { family: 'Inter, sans-serif', color: '#52796F' } },
            tickfont: { family: 'Inter, sans-serif', color: '#52796F' },
            gridcolor: '#CAD2C5'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        hovermode: 'closest' as const,
        margin: { t: 40, r: 20, b: 40, l: 60 }
    }), []);

    return (
        <PlotlyChart
            data={chartData}
            layout={layout}
            title="Import Timeline"
            description="Monthly import trends based on Bill of Entry dates"
            loading={loading}
            error={error}
        />
    );
}
