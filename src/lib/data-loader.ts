/**
 * Data loader utility for importing and managing shipment data
 */

import { ShipmentData } from '@/types/shipment';

// Embedded CSV data - in production, this should be loaded from a database or external file
const CSV_DATA = `Date,Shipment_ID,Product,Quantity,Price_per_unit,Currency,Market_Impact_Score,Delay_in_days,Risk_Score,Profit,Cost,Anomaly
2024-01-01,SHP1000,Machinery,271,59.09,EUR,0.8,3,0.79,474.84,2712.76,0
2024-01-02,SHP1001,Chemicals,374,41.68,GBP,0.54,3,0.46,1416.59,1807.32,1
2024-01-03,SHP1002,Food,489,95.42,GBP,0.66,1,0.73,4367.86,1450.25,0
2024-01-04,SHP1003,Chemicals,381,73.9,INR,0.74,1,0.15,-997.34,1311.24,0
2024-01-05,SHP1004,Chemicals,359,118.81,EUR,0.52,2,0.85,4408.3,1615.13,0
2024-01-06,SHP1005,Textiles,56,20.16,USD,0.43,0,0.71,-77.16,3662.45,0
2024-01-07,SHP1006,Food,364,195.01,EUR,0.88,0,0.91,4940.52,771.74,0
2024-01-08,SHP1007,Food,320,197.31,INR,0.42,3,0.13,4729.08,3401.05,0
2024-01-09,SHP1008,Food,433,141.14,INR,0.46,1,0.59,1968.05,1721.12,0
2024-01-10,SHP1009,Chemicals,317,109.54,EUR,0.99,3,0.6,2076.32,2325.6,1
2024-01-11,SHP1010,Machinery,153,65.36,EUR,0.0,2,0.35,1889.3,3280.7,0
2024-01-12,SHP1011,Food,278,163.69,EUR,0.19,0,0.46,2812.66,3595.32,0
2024-01-13,SHP1012,Chemicals,379,138.52,GBP,0.38,0,0.04,-455.67,1706.73,0
2024-01-14,SHP1013,Textiles,133,36.71,USD,0.93,1,0.75,-804.29,2116.45,0
2024-01-15,SHP1014,Machinery,115,182.63,EUR,0.07,1,0.55,-653.78,1950.81,0
2024-01-16,SHP1015,Textiles,167,165.39,EUR,0.01,2,0.06,1666.19,546.38,0
2024-01-17,SHP1016,Machinery,156,190.21,EUR,0.05,2,0.68,653.29,1535.8,0
2024-01-18,SHP1017,Chemicals,154,146.52,INR,0.09,3,0.47,2732.24,2107.16,0
2024-01-19,SHP1018,Electronics,129,124.62,INR,0.04,3,0.03,4954.65,1938.83,0
2024-01-20,SHP1019,Machinery,328,86.56,GBP,0.48,0,0.97,1317.94,3026.75,0
2024-01-21,SHP1020,Textiles,284,186.88,USD,0.58,6,0.95,2443.05,1846.81,0
2024-01-22,SHP1021,Chemicals,101,173.88,GBP,0.27,1,0.51,1493.62,2212.82,0
2024-01-23,SHP1022,Machinery,67,13.82,USD,0.4,4,0.09,4083.63,2003.63,0
2024-01-24,SHP1023,Electronics,448,10.14,INR,0.09,0,0.75,4413.42,3092.19,0
2024-01-25,SHP1024,Electronics,355,78.41,INR,0.34,1,0.49,4264.13,3520.4,0
2024-01-26,SHP1025,Food,238,163.06,INR,0.52,6,0.3,4846.23,2361.61,0
2024-01-27,SHP1026,Food,483,197.52,GBP,0.73,2,0.49,-834.88,3263.01,0
2024-01-28,SHP1027,Textiles,126,34.33,EUR,0.0,2,0.52,4038.9,1538.75,0
2024-01-29,SHP1028,Machinery,327,120.86,EUR,0.47,2,0.56,3510.63,2394.79,0
2024-01-30,SHP1029,Machinery,288,79.27,INR,0.3,3,0.44,372.17,1708.3,0
2024-01-31,SHP1030,Food,136,194.13,EUR,0.85,0,0.61,4737.92,1949.7,0`;

// Cache for parsed data
let cachedData: ShipmentData[] | null = null;

/**
 * Parse CSV string into typed ShipmentData objects
 * @param csvString - CSV formatted string with header row
 * @returns Array of parsed shipment data
 */
function parseCSV(csvString: string): ShipmentData[] {
  const rows = csvString.trim().split('\n');
  const headers = rows[0].split(',');

  return rows.slice(1).map(row => {
    const values = row.split(',');
    const obj: any = {};

    headers.forEach((header, index) => {
      obj[header] = values[index];
    });

    // Convert numeric fields to proper types
    return {
      Date: obj.Date,
      Shipment_ID: obj.Shipment_ID,
      Product: obj.Product,
      Quantity: parseInt(obj.Quantity),
      Price_per_unit: parseFloat(obj.Price_per_unit),
      Currency: obj.Currency,
      Market_Impact_Score: parseFloat(obj.Market_Impact_Score),
      Delay_in_days: parseInt(obj.Delay_in_days),
      Risk_Score: parseFloat(obj.Risk_Score),
      Profit: parseFloat(obj.Profit),
      Cost: parseFloat(obj.Cost),
      Anomaly: obj.Anomaly,
    } as ShipmentData;
  });
}

/**
 * Load and parse shipment data with caching
 * @returns Array of shipment data objects
 */
export function loadShipmentData(): ShipmentData[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('shipmentData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse stored shipment data", e);
      }
    }
  }

  if (cachedData) {
    return cachedData;
  }

  try {
    cachedData = parseCSV(CSV_DATA);
    return cachedData;
  } catch (error) {
    console.error('Error loading shipment data:', error);
    return [];
  }
}

/**
 * Extract unique products from the dataset
 * @param data - Array of shipment data
 * @returns Array of unique product names
 */
export function getUniqueProducts(data: ShipmentData[]): string[] {
  return [...new Set(data.map(item => item.Product))].sort();
}

/**
 * Extract unique currencies from the dataset
 * @param data - Array of shipment data
 * @returns Array of unique currency codes
 */
export function getUniqueCurrencies(data: ShipmentData[]): string[] {
  return [...new Set(data.map(item => item.Currency))].sort();
}

/**
 * Clear the cached data (useful for testing or reloading)
 */
export function clearCache(): void {
  cachedData = null;
}
