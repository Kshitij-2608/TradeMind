"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { X } from 'lucide-react';

interface FilterPanelProps {
  products: string[];
  currencies: string[];
  selectedProduct: string;
  selectedCurrency: string;
  onProductChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
}

/**
 * Filter controls for products and currencies
 */
export default function FilterPanel({
  products,
  currencies,
  selectedProduct,
  selectedCurrency,
  onProductChange,
  onCurrencyChange
}: FilterPanelProps) {
  const handleClearFilters = () => {
    onProductChange('All');
    onCurrencyChange('All');
  };

  return (
    <div className="relative bg-card rounded-xl p-6 mb-8 shadow-lg border border-border">
      <GlowingEffect
        spread={35}
        glow={true}
        disabled={false}
        proximity={70}
        inactiveZone={0.4}
        borderWidth={2}
      />
      <div className="flex items-center justify-between mb-4 relative">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        {(selectedProduct !== 'All' || selectedCurrency !== 'All') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="space-y-2">
          <Label htmlFor="product-select" className="text-sm font-medium text-foreground">
            Product
          </Label>
          <Select value={selectedProduct} onValueChange={onProductChange}>
            <SelectTrigger id="product-select" className="bg-background border-input text-foreground">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Products</SelectItem>
              {products.map((product, index) => (
                <SelectItem key={`${product}-${index}`} value={product}>
                  {product}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency-select" className="text-sm font-medium text-foreground">
            Currency
          </Label>
          <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
            <SelectTrigger id="currency-select" className="bg-background border-input text-foreground">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Currencies</SelectItem>
              {currencies.map((currency, index) => (
                <SelectItem key={`${currency}-${index}`} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
