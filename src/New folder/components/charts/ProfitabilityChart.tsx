"use client";

import React from 'react';
import PlotlyChart from './PlotlyChart';
import { ShipmentData } from '@/types/shipment';
import { prepareProfitabilityData } from '@/lib/chart-utils';

interface ProfitabilityChartProps {
  data: ShipmentData[];
  loading?: boolean;
  error?: string | null;
}

export default function ProfitabilityChart({ data, loading, error }: ProfitabilityChartProps) {
  if (loading || error || !data || data.length === 0) {
    return (
      <PlotlyChart
        data={[]}
        layout={{}}
        loading={loading}
        error={error}
        title="2. Profitability & Cost Analysis"
        description="Revenue, cost, and profit margins by product category"
      />
    );
  }

  const profitabilityByProduct = prepareProfitabilityData(data);
  const products = Object.keys(profitabilityByProduct);

  const plotData = [
    {
      type: 'bar',
      x: products,
      y: products.map(p => profitabilityByProduct[p].revenue),
      name: 'Revenue',
      marker: { color: '#3b82f6' }
    },
    {
      type: 'bar',
      x: products,
      y: products.map(p => profitabilityByProduct[p].cost),
      name: 'Cost',
      marker: { color: '#ef4444' }
    },
    {
      type: 'bar',
      x: products,
      y: products.map(p => profitabilityByProduct[p].profit),
      name: 'Profit',
      marker: { color: '#10b981' }
    }
  ];

  const layout = {
    title: 'Revenue, Cost & Profit by Product',
    xaxis: { title: 'Product' },
    yaxis: { title: 'Amount' },
    barmode: 'group'
  };

  return (
    <PlotlyChart
      data={plotData}
      layout={layout}
      title="2. Profitability & Cost Analysis"
      description="Revenue, cost, and profit margins by product category"
    />
  );
}
