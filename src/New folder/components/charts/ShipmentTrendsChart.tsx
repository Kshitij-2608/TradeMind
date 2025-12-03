"use client";

import React from 'react';
import PlotlyChart from './PlotlyChart';
import { ShipmentData } from '@/types/shipment';
import { prepareShipmentTrendsData } from '@/lib/chart-utils';

interface ShipmentTrendsChartProps {
  data: ShipmentData[];
  loading?: boolean;
  error?: string | null;
}

export default function ShipmentTrendsChart({ data, loading, error }: ShipmentTrendsChartProps) {
  if (loading || error || !data || data.length === 0) {
    return (
      <PlotlyChart
        data={[]}
        layout={{}}
        loading={loading}
        error={error}
        title="1. Shipment Trend Analysis"
        description="Import and export patterns over time by product category"
      />
    );
  }

  const shipmentTrend = prepareShipmentTrendsData(data);

  const plotData = Object.keys(shipmentTrend).map(month => {
    const monthData = shipmentTrend[month];
    return {
      type: 'scatter',
      mode: 'lines+markers',
      name: month,
      x: Object.keys(monthData),
      y: Object.values(monthData),
      line: { width: 2 }
    };
  });

  const layout = {
    title: 'Monthly Shipment Volumes by Product',
    xaxis: { title: 'Product' },
    yaxis: { title: 'Quantity' },
    legend: { orientation: 'h', y: -0.2 }
  };

  return (
    <PlotlyChart
      data={plotData}
      layout={layout}
      title="1. Shipment Trend Analysis"
      description="Import and export patterns over time by product category"
    />
  );
}
