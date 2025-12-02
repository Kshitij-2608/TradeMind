"use client";

import React from 'react';
import ImportsByPortChart from '../charts/ImportsByPortChart';
import ImportsByProductChart from '../charts/ImportsByProductChart';
import ImportTimelineChart from '../charts/ImportTimelineChart';
import { ImportRecord } from '@/lib/import-chart-utils';

interface ChartsGridProps {
  data: any[];
  loading?: boolean;
  error?: string | null;
}

/**
 * Charts Grid optimized for D2D Import Report data
 * Shows: Ports, Products, Timeline
 */
export default function ChartsGrid({ data, loading, error }: ChartsGridProps) {
  // Convert data to ImportRecord type
  const importData = data as ImportRecord[];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ImportsByPortChart data={importData} loading={loading} error={error} />
      <ImportsByProductChart data={importData} loading={loading} error={error} />
      <div className="lg:col-span-2">
        <ImportTimelineChart data={importData} loading={loading} error={error} />
      </div>
    </div>
  );
}
