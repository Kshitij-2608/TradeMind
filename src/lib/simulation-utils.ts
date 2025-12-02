import { ShipmentData } from "@/types/shipment";

export interface SimulationParams {
    shippingCostChange: number; // Percentage change (-50 to +50)
    dutyRateChange: number; // Percentage change (-20 to +20)
    demandChange: number; // Percentage change (-50 to +50)
    supplierPriceChange: number; // Percentage change (-20 to +20)
}

export interface SimulationResult {
    originalProfit: number;
    newProfit: number;
    profitChange: number; // Percentage
    impactBreakdown: {
        shippingImpact: number;
        dutyImpact: number;
        materialImpact: number;
        revenueImpact: number;
    };
    projectedRevenue: number;
    projectedCosts: number;
}

export function runSimulation(data: ShipmentData[], params: SimulationParams): SimulationResult {
    let originalTotalRevenue = 0;
    let originalTotalCost = 0;

    let newTotalRevenue = 0;
    let newTotalCost = 0;

    // Breakdown accumulators
    let totalShippingCost = 0;
    let totalDutyCost = 0;
    let totalMaterialCost = 0;

    data.forEach(item => {
        // Parse base values
        // Parse base values
        // Handle both uploaded D2D data and default mock data
        let value = Number(item.Value) || Number(item.assessable_value) || Number(item.Total_Value) || 0;

        // Fallback for default data which has Cost and Profit but no explicit Value
        if (value === 0 && (item.Cost || item.Profit)) {
            value = (Number(item.Cost) || 0) + (Number(item.Profit) || 0);
        }

        const duty = Number(item.Duty) || Number(item.duty_amount) || (value * 0.1); // Assume 10% if missing

        // Estimate cost structure (Mock assumptions since we don't have full cost breakdown)
        // Assume: 
        // - Material Cost = 60% of Value
        // - Shipping Cost = 10% of Value
        // - Duty = Actual Duty or 10%
        // - Margin = Remaining ~20%

        const baseMaterialCost = value * 0.6;
        const baseShippingCost = value * 0.1;
        const baseRevenue = value * 1.2; // Assume we sell at 20% markup on Assessable Value

        originalTotalCost += (baseMaterialCost + baseShippingCost + duty);
        originalTotalRevenue += baseRevenue;

        totalShippingCost += baseShippingCost;
        totalDutyCost += duty;
        totalMaterialCost += baseMaterialCost;

        // Apply Simulation Factors
        const newMaterialCost = baseMaterialCost * (1 + params.supplierPriceChange / 100);
        const newShippingCost = baseShippingCost * (1 + params.shippingCostChange / 100);
        const newDuty = duty * (1 + params.dutyRateChange / 100);

        // Demand change affects Revenue (Volume sold)
        // If demand drops, we sell less. If demand rises, we sell more.
        const newRevenue = baseRevenue * (1 + params.demandChange / 100);

        // Costs also scale with demand (if we sell more, we buy/ship more)
        const volumeFactor = (1 + params.demandChange / 100);

        newTotalCost += (newMaterialCost + newShippingCost + newDuty) * volumeFactor;
        newTotalRevenue += newRevenue;
    });

    const originalProfit = originalTotalRevenue - originalTotalCost;
    const newProfit = newTotalRevenue - newTotalCost;

    const profitChange = originalProfit !== 0
        ? ((newProfit - originalProfit) / Math.abs(originalProfit)) * 100
        : 0;

    return {
        originalProfit,
        newProfit,
        profitChange,
        impactBreakdown: {
            shippingImpact: totalShippingCost * (params.shippingCostChange / 100),
            dutyImpact: totalDutyCost * (params.dutyRateChange / 100),
            materialImpact: totalMaterialCost * (params.supplierPriceChange / 100),
            revenueImpact: newTotalRevenue - originalTotalRevenue
        },
        projectedRevenue: newTotalRevenue,
        projectedCosts: newTotalCost
    };
}
