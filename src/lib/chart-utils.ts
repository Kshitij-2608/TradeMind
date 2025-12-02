/**
 * Chart data preparation utilities
 */

import { ShipmentData } from '@/types/shipment';

/**
 * Prepare data for shipment trends chart
 * Shows shipment volumes over time by product
 */
export function prepareShipmentTrendsData(data: ShipmentData[]) {
  const shipmentTrend: Record<string, Record<string, number>> = {};

  data.forEach(item => {
    if (!item.Date) return; // Skip if no date
    const month = item.Date.toString().substring(0, 7); // YYYY-MM
    if (!shipmentTrend[month]) {
      shipmentTrend[month] = {};
    }
    if (!shipmentTrend[month][item.Product]) {
      shipmentTrend[month][item.Product] = 0;
    }
    shipmentTrend[month][item.Product] += item.Quantity || 0;
  });

  return shipmentTrend;
}

/**
 * Prepare data for profitability analysis chart
 * Shows revenue, cost, and profit by product
 */
export function prepareProfitabilityData(data: ShipmentData[]) {
  const profitabilityByProduct: Record<string, { profit: number; cost: number; revenue: number }> = {};

  data.forEach(item => {
    if (!profitabilityByProduct[item.Product]) {
      profitabilityByProduct[item.Product] = { profit: 0, cost: 0, revenue: 0 };
    }
    const revenue = (item.Quantity || 0) * (item.Price_per_unit || 0);
    profitabilityByProduct[item.Product].profit += item.Profit || 0;
    profitabilityByProduct[item.Product].cost += item.Cost || 0;
    profitabilityByProduct[item.Product].revenue += revenue;
  });

  return profitabilityByProduct;
}

/**
 * Prepare data for seasonal demand chart
 * Shows demand patterns across months
 */
export function prepareSeasonalDemandData(data: ShipmentData[]) {
  const seasonalDemand: Record<string, number> = {};

  data.forEach(item => {
    if (!item.Date) return; // Skip if no date
    const month = item.Date.toString().substring(5, 7); // MM
    if (!seasonalDemand[month]) {
      seasonalDemand[month] = 0;
    }
    seasonalDemand[month] += item.Quantity || 0;
  });

  return seasonalDemand;
}

/**
 * Prepare data for delay vs risk scatter plot
 * Shows relationship between delays and risk scores
 */
export function prepareDelayRiskData(data: ShipmentData[]) {
  const delayRiskByProduct: Record<string, { delay: number; risk: number; count: number }> = {};

  data.forEach(item => {
    if (!delayRiskByProduct[item.Product]) {
      delayRiskByProduct[item.Product] = { delay: 0, risk: 0, count: 0 };
    }
    delayRiskByProduct[item.Product].delay += item.Delay_in_days || 0;
    delayRiskByProduct[item.Product].risk += Number(item.Risk_Score) || 0;
    delayRiskByProduct[item.Product].count += 1;
  });

  // Calculate averages
  Object.keys(delayRiskByProduct).forEach(product => {
    delayRiskByProduct[product].delay /= delayRiskByProduct[product].count;
    delayRiskByProduct[product].risk /= delayRiskByProduct[product].count;
  });

  return delayRiskByProduct;
}

/**
 * Prepare data for currency impact chart
 * Shows profit and market impact by currency
 */
export function prepareCurrencyImpactData(data: ShipmentData[]) {
  const currencyImpact: Record<string, { profit: number; marketImpact: number; count: number }> = {};

  data.forEach(item => {
    if (!currencyImpact[item.Currency]) {
      currencyImpact[item.Currency] = { profit: 0, marketImpact: 0, count: 0 };
    }
    currencyImpact[item.Currency].profit += item.Profit || 0;
    currencyImpact[item.Currency].marketImpact += Number(item.Market_Impact_Score) || 0;
    currencyImpact[item.Currency].count += 1;
  });

  // Calculate averages
  Object.keys(currencyImpact).forEach(currency => {
    currencyImpact[currency].profit /= currencyImpact[currency].count;
    currencyImpact[currency].marketImpact /= currencyImpact[currency].count;
  });

  return currencyImpact;
}

/**
 * Simple linear regression for forecasting
 */
function linearRegression(x: number[], y: number[]): { slope: number; intercept: number } {
  const n = x.length;
  const xSum = x.reduce((sum, val) => sum + val, 0);
  const ySum = y.reduce((sum, val) => sum + val, 0);
  const xySum = x.reduce((sum, val, i) => sum + (val * y[i]), 0);
  const xSquareSum = x.reduce((sum, val) => sum + (val * val), 0);

  const slope = (n * xySum - xSum * ySum) / (n * xSquareSum - xSum * xSum);
  const intercept = (ySum - slope * xSum) / n;

  return { slope, intercept };
}

/**
 * Prepare data for revenue forecast chart
 * Uses linear regression to predict future revenue
 */
export function prepareRevenueForecastData(data: ShipmentData[]) {
  const monthlyRevenue: Record<string, number> = {};

  data.forEach(item => {
    if (!item.Date) return; // Skip if no date
    const month = item.Date.toString().substring(0, 7); // YYYY-MM
    if (!monthlyRevenue[month]) {
      monthlyRevenue[month] = 0;
    }
    const revenue = (item.Quantity || 0) * (item.Price_per_unit || 0);
    monthlyRevenue[month] += revenue;
  });

  // Prepare data for regression
  const months = Object.keys(monthlyRevenue).sort();
  if (months.length === 0) {
    return {
      monthlyRevenue: {},
      months: [],
      revenues: [],
      forecastMonths: [],
      forecastRevenues: []
    };
  }

  const revenues = months.map(month => monthlyRevenue[month]);
  const indices = months.map((_, i) => i);

  // Calculate trend
  const { slope, intercept } = linearRegression(indices, revenues);

  // Generate forecast for next 3 months
  const n = months.length;
  const forecastMonths: string[] = [];
  const forecastRevenues: number[] = [];
  const lastMonth = new Date(months[n - 1] + '-01');

  for (let i = 1; i <= 3; i++) {
    const forecastDate = new Date(lastMonth);
    forecastDate.setMonth(forecastDate.getMonth() + i);
    const forecastMonth = forecastDate.toISOString().substring(0, 7);
    forecastMonths.push(forecastMonth);

    const forecastRevenue = slope * (n + i - 1) + intercept;
    forecastRevenues.push(forecastRevenue);
  }

  return {
    monthlyRevenue,
    months,
    revenues,
    forecastMonths,
    forecastRevenues
  };
}

/**
 * Prepare all chart data at once
 * Useful for initial dashboard load
 */
export function prepareChartData(data: ShipmentData[]) {
  return {
    shipmentTrend: prepareShipmentTrendsData(data),
    profitabilityByProduct: prepareProfitabilityData(data),
    seasonalDemand: prepareSeasonalDemandData(data),
    delayRiskByProduct: prepareDelayRiskData(data),
    currencyImpact: prepareCurrencyImpactData(data),
    forecast: prepareRevenueForecastData(data)
  };
}

/**
 * Helper function to group data by a specific field
 */
export function groupBy<T>(data: T[], key: keyof T): Record<string, T[]> {
  return data.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Helper function to calculate sum of a numeric field
 */
export function sumBy<T>(data: T[], key: keyof T): number {
  return data.reduce((sum, item) => sum + Number(item[key] || 0), 0);
}

/**
 * Helper function to calculate average of a numeric field
 */
export function averageBy<T>(data: T[], key: keyof T): number {
  if (data.length === 0) return 0;
  return sumBy(data, key) / data.length;
}
