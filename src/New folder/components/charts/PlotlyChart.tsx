"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PlotlyChartProps {
  data: any[];
  layout: any;
  config?: any;
  loading?: boolean;
  error?: string | null;
  title: string;
  description?: string;
}

/**
 * Reusable Plotly chart wrapper component with loading and error states
 */
export default function PlotlyChart({
  data,
  layout,
  config,
  loading = false,
  error = null,
  title,
  description
}: PlotlyChartProps) {
  // Default config for better UX
  const defaultConfig: any = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    ...config
  };

  // Default layout with theme support
  const defaultLayout: any = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: 'hsl(var(--foreground))' },
    autosize: true,
    margin: { t: 40, r: 20, b: 60, l: 60 },
    ...layout
  };

  return (
    <Card className="relative bg-card border-border hover:shadow-lg transition-shadow">
      <GlowingEffect
        spread={35}
        glow={true}
        disabled={false}
        proximity={70}
        inactiveZone={0.3}
        borderWidth={2}
      />
      <CardHeader className="relative">
        <CardTitle className="text-sm font-semibold text-primary">{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="relative">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-[300px] w-full bg-muted" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : data && data.length > 0 ? (
          <div className="w-full h-[300px] overflow-hidden">
            {React.createElement(Plot as any, {
              data: data,
              layout: {
                ...defaultLayout,
                width: undefined, // Let CSS handle width
                height: undefined, // Let CSS handle height
              },
              config: defaultConfig,
              style: { width: '100%', height: '100%' },
              useResizeHandler: true
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
