"use client";

import React from 'react';
import PlotlyChart from './PlotlyChart';
import { ShipmentData } from '@/types/shipment';
import { prepareSeasonalDemandData } from '@/lib/chart-utils';

interface SeasonalDemandChartProps {
  data: ShipmentData[];
  loading?: boolean;
  error?: string | null;
}

export default function SeasonalDemandChart({ data, loading, error }: SeasonalDemandChartProps) {
  if (loading || error || !data || data.length === 0) {
    return (
      <PlotlyChart
        data={[]}
        layout={{}}
        loading={loading}
        error={error}
        title="3. Seasonal Demand Prediction"
        description="Demand patterns across different months of the year"
      />
    );
  }

  const seasonalDemand = prepareSeasonalDemandData(data);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = Object.keys(seasonalDemand).sort();

  const plotData = [{
    type: 'bar',
    x: months.map(m => monthNames[parseInt(m) - 1]),
    y: months.map(m => seasonalDemand[m]),
    marker: { color: '#8b5cf6' }
  }];

  const layout = {
    title: 'Demand by Month',
    xaxis: { title: 'Month' },
    yaxis: { title: 'Total Quantity' }
  };

  return (
    <PlotlyChart
      data={plotData}
      layout={layout}
      title="3. Seasonal Demand Prediction"
      description="Demand patterns across different months of the year"
    />
  );
}
