"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FilterPanel from "@/components/dashboard/FilterPanel";
import ChartsGrid from "@/components/dashboard/ChartsGrid";
import AIChartGenerator from "@/components/dashboard/AIChartGenerator";
import { loadShipmentData, getUniqueProducts, getUniqueCurrencies } from "@/lib/data-loader";
import { ShipmentData } from "@/types/shipment";
import { Toaster } from "@/components/ui/toaster";

/**
 * Main Dashboard Page - Refactored
 * 
 * This is the clean orchestrator version that uses modular components.
 * All heavy logic has been moved to utilities and individual components.
 */
export default function ImportExportDashboard() {
  // State management
  const [data, setData] = useState<ShipmentData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [selectedCurrency, setSelectedCurrency] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    try {
      setLoading(true);
      const shipmentData = loadShipmentData();
      setData(shipmentData);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized unique values for filters
  const products = useMemo(() => getUniqueProducts(data), [data]);
  const currencies = useMemo(() => getUniqueCurrencies(data), [data]);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const productMatch = selectedProduct === 'All' || item.Product === selectedProduct;
      const currencyMatch = selectedCurrency === 'All' || item.Currency === selectedCurrency;
      return productMatch && currencyMatch;
    });
  }, [data, selectedProduct, selectedCurrency]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Header Component */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          {/* Filter Panel Component */}
          <FilterPanel
            products={products}
            currencies={currencies}
            selectedProduct={selectedProduct}
            selectedCurrency={selectedCurrency}
            onProductChange={setSelectedProduct}
            onCurrencyChange={setSelectedCurrency}
          />

          {/* Charts Grid Component */}
          <div className="mb-12">
            <ChartsGrid 
              data={filteredData} 
              loading={loading} 
              error={error} 
            />
          </div>

          {/* AI Chart Generator Component */}
          <div className="mb-12">
            <AIChartGenerator data={filteredData} />
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
