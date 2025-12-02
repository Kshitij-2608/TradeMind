/**
 * Type definitions for the Import/Export Analysis Dashboard
 */

/**
 * Represents a single shipment record from the CSV data
 */
export interface ShipmentData {
  Date: string;
  Shipment_ID: string;
  Product: string;
  Quantity: number;
  Price_per_unit: number;
  Currency: string;
  Market_Impact_Score: number;
  Delay_in_days: number;
  Risk_Score: number;
  Profit: number;
  Cost: number;
  Anomaly: string;
}

/**
 * Configuration for Plotly charts
 */
export interface ChartConfig {
  data: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
  config?: Partial<Plotly.Config>;
}

/**
 * Filter options for the dashboard
 */
export interface FilterOptions {
  selectedProduct: string;
  selectedCurrency: string;
}

/**
 * Aggregated data for shipment trends
 */
export interface ShipmentTrendData {
  dates: string[];
  quantities: number[];
}

/**
 * Aggregated data for profitability analysis
 */
export interface ProfitabilityData {
  products: string[];
  profits: number[];
  costs: number[];
  revenues: number[];
}

/**
 * Aggregated data for seasonal demand
 */
export interface SeasonalDemandData {
  months: string[];
  quantities: number[];
}

/**
 * Data for delay vs risk scatter plot
 */
export interface DelayRiskData {
  delays: number[];
  risks: number[];
  products: string[];
  quantities: number[];
}

/**
 * Aggregated data for currency impact
 */
export interface CurrencyImpactData {
  currencies: string[];
  revenues: number[];
}

/**
 * Data for revenue forecasting
 */
export interface RevenueForecastData {
  historicalDates: string[];
  historicalRevenue: number[];
  forecastDates: string[];
  forecastRevenue: number[];
}

/**
 * Props for chart components
 */
export interface ChartComponentProps {
  data: ShipmentData[];
  loading?: boolean;
  error?: string | null;
}

/**
 * AI-generated chart response
 */
export interface AIChartResponse {
  data: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
}
