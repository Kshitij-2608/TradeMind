"use client";

import React from 'react';
import PlotlyChart from './PlotlyChart';
import { ShipmentData } from '@/types/shipment';
import { prepareCurrencyImpactData } from '@/lib/chart-utils';

interface CurrencyImpactChartProps {
  data: ShipmentData[];
  loading?: boolean;
  error?: string | null;
}

export default function CurrencyImpactChart({ data, loading, error }: CurrencyImpactChartProps) {
  if (loading || error || !data || data.length === 0) {
    return (
      <PlotlyChart
        data={[]}
        layout={{}}
        loading={loading}
        error={error}
        title="5. Currency & Market Impact Assessment"
        description="Profitability and market impact across different currencies"
      />
    );
  }

  const currencyImpact = prepareCurrencyImpactData(data);
  const currencies = Object.keys(currencyImpact);

  const plotData = [
    {
      type: 'bar',
      x: currencies,
      y: currencies.map(c => currencyImpact[c].profit),
      name: 'Avg Profit',
      marker: { color: '#10b981' }
    },
    {
      type: 'scatter',
      mode: 'lines+markers',
      x: currencies,
      y: currencies.map(c => currencyImpact[c].marketImpact * 1000),
      name: 'Market Impact (scaled)',
      yaxis: 'y2',
      marker: { color: '#f59e0b' }
    }
  ];

  const layout = {
    title: 'Currency Impact on Profit & Market',
    xaxis: { title: 'Currency' },
    yaxis: { title: 'Average Profit' },
    yaxis2: {
      title: 'Market Impact Score',
      overlaying: 'y',
      side: 'right'
    }
  };

  return (
    <PlotlyChart
      data={plotData}
      layout={layout}
      title="5. Currency & Market Impact Assessment"
      description="Profitability and market impact across different currencies"
    />
  );
}
