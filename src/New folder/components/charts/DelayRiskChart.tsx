"use client";

import React from 'react';
import PlotlyChart from './PlotlyChart';
import { ShipmentData } from '@/types/shipment';
import { prepareDelayRiskData } from '@/lib/chart-utils';

interface DelayRiskChartProps {
  data: ShipmentData[];
  loading?: boolean;
  error?: string | null;
}

export default function DelayRiskChart({ data, loading, error }: DelayRiskChartProps) {
  if (loading || error || !data || data.length === 0) {
    return (
      <PlotlyChart
        data={[]}
        layout={{}}
        loading={loading}
        error={error}
        title="4. Delay & Risk Analysis"
        description="Correlation between shipment delays and risk scores"
      />
    );
  }

  const delayRiskByProduct = prepareDelayRiskData(data);
  const products = Object.keys(delayRiskByProduct);

  const plotData = [{
    type: 'scatter',
    mode: 'markers',
    x: products.map(p => delayRiskByProduct[p].delay),
    y: products.map(p => delayRiskByProduct[p].risk),
    text: products,
    marker: {
      size: 12,
      color: products.map((_, i) => i),
      colorscale: 'Viridis'
    }
  }];

  const layout = {
    title: 'Delay vs Risk Score by Product',
    xaxis: { title: 'Average Delay (days)' },
    yaxis: { title: 'Average Risk Score' }
  };

  return (
    <PlotlyChart
      data={plotData}
      layout={layout}
      title="4. Delay & Risk Analysis"
      description="Correlation between shipment delays and risk scores"
    />
  );
}
