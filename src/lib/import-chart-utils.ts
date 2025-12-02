/**
 * D2D Import Report - Chart Data Preparation
 * Tailored for Indian Customs Import data structure
 */

export interface ImportRecord {
    invoice_title?: string;
    port?: string;
    port_code?: string;
    be_no?: string;  // Bill of Entry number
    be_date?: any;
    be_type?: string;
    iec_br?: string;
    importer_name?: string;
    address?: string;
    [key: string]: any; // Allow other fields
}

/**
 * Prepare data for imports by port
 */
export function prepareImportsByPort(data: ImportRecord[]) {
    const portData: Record<string, number> = {};

    data.forEach(item => {
        const port = item.port || item.port_code || 'Unknown';
        if (!portData[port]) {
            portData[port] = 0;
        }
        portData[port] += 1; // Count imports per port
    });

    return Object.entries(portData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10 ports
}

/**
 * Prepare data for imports by invoice title/product
 */
export function prepareImportsByProduct(data: ImportRecord[]) {
    const productData: Record<string, number> = {};

    data.forEach(item => {
        const product = item.invoice_title || 'Unknown Product';
        if (!productData[product]) {
            productData[product] = 0;
        }
        productData[product] += 1;
    });

    return Object.entries(productData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15); // Top 15 products
}

/**
 * Prepare data for BE (Bill of Entry) type distribution
 */
export function prepareByBEType(data: ImportRecord[]) {
    const beTypeData: Record<string, number> = {};

    data.forEach(item => {
        const beType = item.be_type || 'Unknown';
        if (!beTypeData[beType]) {
            beTypeData[beType] = 0;
        }
        beTypeData[beType] += 1;
    });

    return beTypeData;
}

/**
 * Prepare timeline data by BE date
 */
export function prepareImportTimeline(data: ImportRecord[]) {
    const timelineData: Record<string, number> = {};

    data.forEach(item => {
        if (!item.be_date) return;

        // Convert Excel date serial number to readable date
        let dateStr: string;
        if (typeof item.be_date === 'number') {
            const date = excelDateToJSDate(item.be_date);
            dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else {
            dateStr = String(item.be_date).substring(0, 7);
        }

        if (!timelineData[dateStr]) {
            timelineData[dateStr] = 0;
        }
        timelineData[dateStr] += 1;
    });

    return timelineData;
}

/**
 * Convert Excel date serial number to JavaScript Date
 */
function excelDateToJSDate(serial: number): Date {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
}

/**
 * Prepare data for importer analysis
 */
export function prepareByImporter(data: ImportRecord[]) {
    const importerData: Record<string, number> = {};

    data.forEach(item => {
        const importer = item.importer_name || item.iec_br || 'Unknown Importer';
        if (!importerData[importer]) {
            importerData[importer] = 0;
        }
        importerData[importer] += 1;
    });

    return Object.entries(importerData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10 importers
}

/**
 * Get summary statistics
 */
export function getImportSummary(data: ImportRecord[]) {
    const uniquePorts = new Set(data.map(item => item.port || item.port_code).filter(Boolean));
    const uniqueProducts = new Set(data.map(item => item.invoice_title).filter(Boolean));
    const uniqueImporters = new Set(data.map(item => item.importer_name || item.iec_br).filter(Boolean));

    return {
        totalRecords: data.length,
        uniquePorts: uniquePorts.size,
        uniqueProducts: uniqueProducts.size,
        uniqueImporters: uniqueImporters.size
    };
}
