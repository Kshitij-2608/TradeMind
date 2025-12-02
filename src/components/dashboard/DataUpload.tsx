"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Upload, FileSpreadsheet, Sparkles, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface DataUploadProps {
    onDataLoad: (data: any[]) => void;
}

export default function DataUpload({ onDataLoad }: DataUploadProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (!['csv', 'xlsx', 'xls'].includes(fileExt || '')) {
            toast({
                title: 'Invalid File',
                description: 'Please upload a CSV or Excel file',
                variant: 'destructive'
            });
            return;
        }

        setLoading(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                let data: any[] = [];

                if (fileExt === 'csv') {
                    // Parse CSV
                    const text = e.target?.result as string;
                    const rows = text.split('\n').filter(row => row.trim());
                    const headers = rows[0].split(',').map(h => h.trim());

                    data = rows.slice(1).map(row => {
                        const values = row.split(',');
                        const obj: any = {};
                        headers.forEach((header, index) => {
                            obj[header] = values[index]?.trim() || '';
                        });
                        return obj;
                    });
                } else {
                    // Parse Excel
                    const binaryStr = e.target?.result;
                    const workbook = XLSX.read(binaryStr, { type: 'binary' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    data = XLSX.utils.sheet_to_json(firstSheet);
                }

                onDataLoad(data);
                localStorage.setItem('shipmentData', JSON.stringify(data));
                toast({
                    title: 'Success',
                    description: `Loaded ${data.length} records from ${fileExt?.toUpperCase() || 'FILE'}`
                });
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to parse file',
                    variant: 'destructive'
                });
            } finally {
                setLoading(false);
            }
        };

        if (fileExt === 'csv') {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
        }
    }, [onDataLoad, toast]);

    const generateImportExportData = useCallback(() => {
        // Generate realistic import/export trade data matching D2D report structure
        const ports = ['JNPT', 'Mundra', 'Chennai', 'Kolkata', 'Visakhapatnam', 'Cochin', 'Mumbai Air', 'Delhi Air'];
        const portCodes: Record<string, string> = {
            'JNPT': 'INNSA1', 'Mundra': 'INMUN1', 'Chennai': 'INMAA1', 'Kolkata': 'INCCU1',
            'Visakhapatnam': 'INVTZ1', 'Cochin': 'INCOK1', 'Mumbai Air': 'INBOM4', 'Delhi Air': 'INDEL4'
        };
        const products = [
            'Polyethylene Terephthalate', 'PVC Resin', 'Carbon Black', 'Solar Modules', 'Lithium Ion Batteries',
            'Steel Coils', 'Aluminum Scrap', 'Raw Cotton', 'Palm Oil', 'Integrated Circuits',
            'Parts of Mobile Phones', 'Laptop Computers', 'Medical Devices', 'Pharmaceutical Ingredients'
        ];
        const importers = [
            'Reliance Industries Ltd', 'Tata Motors Ltd', 'Adani Enterprises', 'Vedanta Ltd', 'JSW Steel',
            'Samsung India Electronics', 'LG Electronics', 'Xiaomi Technology', 'Sun Pharma', 'Cipla Ltd'
        ];
        const chaNames = [
            'DHL Logistics', 'FedEx Express', 'Jeena & Company', 'Robinsons Cargo', 'Total Transport Systems',
            'Blue Dart Express', 'Schenker India', 'Kuehne + Nagel'
        ];
        const beTypes = ['Home Consumption', 'Warehouse', 'Ex-Bond'];
        const countries = ['China', 'USA', 'UAE', 'Saudi Arabia', 'Germany', 'South Korea', 'Japan', 'Indonesia'];

        const randomData = Array.from({ length: 100 }, (_, i) => {
            const port = ports[Math.floor(Math.random() * ports.length)];
            const product = products[Math.floor(Math.random() * products.length)];
            const importer = importers[Math.floor(Math.random() * importers.length)];
            const value = Math.floor(Math.random() * 10000000) + 500000;

            // Generate a random date within the last year
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 365));
            const dateStr = date.toISOString().split('T')[0];

            return {
                port: port,
                port_code: portCodes[port],
                be_no: Math.floor(Math.random() * 9000000) + 1000000,
                be_date: dateStr,
                be_type: beTypes[Math.floor(Math.random() * beTypes.length)],
                invoice_title: product,
                importer_name: importer,
                iec_br: Math.floor(Math.random() * 9000000000) + 1000000000,
                address: `Plot No ${Math.floor(Math.random() * 100)}, Industrial Area, ${port}`,
                country_of_origin: countries[Math.floor(Math.random() * countries.length)],
                cha_name: chaNames[Math.floor(Math.random() * chaNames.length)],
                assessable_value: value,
                duty_amount: Math.floor(value * (0.1 + Math.random() * 0.2)),
                // Aliases for compatibility with generic charts if any
                Product: product,
                Currency: 'INR',
                Total_Value: value,
                Date: dateStr
            };
        });

        onDataLoad(randomData);
        localStorage.setItem('shipmentData', JSON.stringify(randomData));
        toast({
            title: 'Success',
            description: 'Generated 100 realistic D2D import records'
        });
    }, [onDataLoad, toast]);

    return (
        <Card className="relative bg-card/50 backdrop-blur-xl border-primary/20 shadow-2xl overflow-hidden">
            <GlowingEffect
                spread={50}
                glow={true}
                disabled={false}
                proximity={100}
                inactiveZone={0.2}
                borderWidth={2}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

            <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3 text-2xl">
                    <Database className="h-6 w-6 text-primary animate-pulse" />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Data Source
                    </span>
                </CardTitle>
                <CardDescription className="text-base">
                    Upload your CSV/Excel file or generate sample import-export trade data
                </CardDescription>
            </CardHeader>

            <CardContent className="relative space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* File Upload - CSV & Excel */}
                    <label className="cursor-pointer group">
                        <div className="relative p-6 border-2 border-dashed border-primary/30 rounded-xl hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 bg-card/30">
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={loading}
                            />
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <Upload className="h-8 w-8 text-primary" />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-semibold text-foreground mb-1">Upload File</h3>
                                    <p className="text-sm text-muted-foreground">
                                        CSV, XLSX, or XLS
                                    </p>
                                </div>
                            </div>
                        </div>
                    </label>

                    {/* Generate Trade Data */}
                    <Button
                        onClick={generateImportExportData}
                        disabled={loading}
                        className="relative h-auto p-6 bg-gradient-to-br from-primary to-primary/80 hover:from-primary hover:to-accent transition-all duration-300 shadow-lg hover:shadow-primary/50 group"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                                <Sparkles className="h-8 w-8" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold mb-1">Generate Data</h3>
                                <p className="text-sm opacity-90">
                                    100 trade records
                                </p>
                            </div>
                        </div>
                    </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Import/Export trade data with shipments, values, countries, and more</span>
                </div>

                <div className="pt-4 border-t border-primary/10 space-y-3">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter dataset name (optional)"
                            className="bg-background/50"
                            id="dataset-name-input"
                        />
                        <Button
                            variant="outline"
                            className="whitespace-nowrap"
                            onClick={async () => {
                                const stored = localStorage.getItem('shipmentData');
                                if (!stored) {
                                    toast({ title: "No data to save", variant: "destructive" });
                                    return;
                                }

                                const nameInput = document.getElementById('dataset-name-input') as HTMLInputElement;
                                const customName = nameInput?.value?.trim();
                                const datasetName = customName || `Dataset ${new Date().toLocaleString()}`;

                                setLoading(true);
                                try {
                                    const data = JSON.parse(stored);
                                    const res = await fetch('/api/datasets/create', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            name: datasetName,
                                            records: data
                                        })
                                    });

                                    const result = await res.json();
                                    if (!res.ok) throw new Error(result.error);

                                    toast({ title: "Saved to Cloud", description: result.message });
                                    if (nameInput) nameInput.value = ''; // Clear input
                                } catch (e: any) {
                                    toast({
                                        title: "Save Failed",
                                        description: e.message || "Could not save to database",
                                        variant: "destructive"
                                    });
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                        >
                            <Database className="mr-2 h-4 w-4" />
                            Save to Cloud
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
