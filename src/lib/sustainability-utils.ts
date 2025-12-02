import { ShipmentData } from "@/types/shipment";

// Approximate distances from various countries to India (in km)
const COUNTRY_DISTANCES: Record<string, number> = {
    'China': 5000,
    'USA': 14000,
    'UAE': 2500,
    'Germany': 7000,
    'UK': 7500,
    'Japan': 6000,
    'Singapore': 3500,
    'South Korea': 5500,
    'Saudi Arabia': 3000,
    'Indonesia': 4000,
    'Vietnam': 3500,
    'Thailand': 3000,
    'Malaysia': 3000,
    'Australia': 9000,
    'Brazil': 15000,
    'Canada': 13000,
    'France': 7500,
    'Italy': 6500,
    'Netherlands': 7000,
    'Russia': 5000,
    'Spain': 8000,
    'Turkey': 5000,
};

// Emission factors (kg CO2 per ton-km)
const EMISSION_FACTORS = {
    Sea: 0.01,
    Air: 0.50,
    Road: 0.10,
    Rail: 0.03
};

export interface SustainabilityMetrics {
    totalEmissions: number; // in tons
    emissionsByCountry: Record<string, number>;
    emissionsByProduct: Record<string, number>;
    greenScore: number; // 0-100
    potentialSavings: number; // tons CO2
}

export function calculateSustainabilityMetrics(data: ShipmentData[]): SustainabilityMetrics {
    let totalEmissions = 0;
    const emissionsByCountry: Record<string, number> = {};
    const emissionsByProduct: Record<string, number> = {};
    let totalDistance = 0;
    let totalWeight = 0;

    data.forEach(item => {
        const country = item.Country || item.country_of_origin || 'Unknown';
        const distance = COUNTRY_DISTANCES[country] || 5000; // Default to 5000km if unknown

        // Estimate weight: 
        // If 'Quantity' exists, assume 10kg per unit on average (very rough estimate)
        // Or if 'gross_weight' exists use that.
        // For this demo, let's assume Quantity * 10kg / 1000 to get tons.
        const quantity = Number(item.Quantity) || 100;
        const weightTons = (quantity * 10) / 1000;

        // Guess mode of transport:
        // If Port contains "Air", it's Air. Else Sea.
        const port = (item.Port || item.port || '').toLowerCase();
        const mode = port.includes('air') ? 'Air' : 'Sea';

        const factor = EMISSION_FACTORS[mode as keyof typeof EMISSION_FACTORS];
        const emissions = weightTons * distance * factor / 1000; // Result in tons CO2

        totalEmissions += emissions;
        totalDistance += distance;
        totalWeight += weightTons;

        // Aggregations
        emissionsByCountry[country] = (emissionsByCountry[country] || 0) + emissions;
        const product = item.Product || item.invoice_title || 'Unknown';
        emissionsByProduct[product] = (emissionsByProduct[product] || 0) + emissions;
    });

    // Calculate Green Score (Mock logic)
    // Lower emissions per ton-km is better.
    // Benchmark: 0.02 (Mostly Sea). 
    // Actual: Total Emissions / (Total Weight * Total Distance) * 1000
    const averageFactor = totalWeight > 0 ? (totalEmissions * 1000) / (totalWeight * (totalDistance / data.length)) : 0.05;

    // Score: 100 - (Average Factor / Benchmark * 50)
    // If factor is 0.01 (Sea), Score ~ 75. If 0.5 (Air), Score ~ 0.
    let greenScore = Math.max(0, Math.min(100, 100 - (averageFactor / 0.02 * 20)));

    // Potential Savings: If all Air shipments went by Sea
    // This is just a rough "What if"
    const potentialSavings = totalEmissions * 0.3; // Assume 30% optimization possible

    return {
        totalEmissions: Number(totalEmissions.toFixed(2)),
        emissionsByCountry,
        emissionsByProduct,
        greenScore: Math.round(greenScore),
        potentialSavings: Number(potentialSavings.toFixed(2))
    };
}
