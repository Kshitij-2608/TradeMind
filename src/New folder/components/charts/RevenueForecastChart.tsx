"use client";

import React from 'react';
import PlotlyChart from './PlotlyChart';
import { ShipmentData } from '@/types/shipment';
import { prepareRevenueForecastData } from '@/lib/chart-utils';

interface RevenueForecastChartProps {
  data: ShipmentData[];
  loading?: boolean;
  error?: string | null;
}

export default function RevenueForecastChart({ data, loading, error }: RevenueForecastChartProps) {
  if (loading || error || !data || data.length === 0) {
    return (
      <PlotlyChart
        data={[]}
        layout={{}}
        loading={loading}
        error={error}
        title="6. Revenue Forecasting"
        description="Predicted revenue trends based on historical data using linear regression"
      />
    );
  }

  const forecastData = prepareRevenueForecastData(data);

  const plotData = [
    {
      type: 'scatter',
      mode: 'lines+markers',
      x: forecastData.months,
      y: forecastData.revenues,
      name: 'Historical Revenue',
      marker: { color: '#3b82f6' }
    },
    {
      type: 'scatter',
      mode: 'lines+markers',
      x: forecastData.forecastMonths,
      y: forecastData.forecastRevenues,
      name: 'Forecast',
      marker: { color: '#f59e0b' },
      line: { dash: 'dash' }
    }
  ];

  const layout = {
    title: 'Revenue Forecast (Next 3 Months)',
    xaxis: { title: 'Month' },
    yaxis: { title: 'Revenue' }
  };

  return (
    <PlotlyChart
      data={plotData}
      layout={layout}
      title="6. Revenue Forecasting"
      description="Predicted revenue trends based on historical data using linear regression"
    />
  );
}
