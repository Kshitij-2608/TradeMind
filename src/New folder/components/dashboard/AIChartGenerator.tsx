"use client";

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Sparkles, Loader2, Trash2 } from 'lucide-react';
import { ShipmentData } from '@/types/shipment';
import PlotlyChart from '../charts/PlotlyChart';
import { useToast } from '@/hooks/use-toast';

interface AIChartGeneratorProps {
  data: ShipmentData[];
}

/**
 * AI-powered chart generation component
 */
export default function AIChartGenerator({ data }: AIChartGeneratorProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartConfig, setChartConfig] = useState<any | null>(null);
  const { toast } = useToast();

  const generateChart = async () => {
    if (!description.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a description for the chart you want to generate',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/generate-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description,
          data: data
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result?.config) {
        setChartConfig(result.config);
        toast({
          title: 'Success',
          description: 'Chart generated successfully!'
        });
      } else {
        throw new Error('No config returned from API');
      }
    } catch (error) {
      console.error('Error generating chart:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate chart',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDescription('');
    setChartConfig(null);
  };

  return (
    <div className="space-y-6">
      <Card className="relative bg-card border-border shadow-md">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={75}
          inactiveZone={0.4}
          borderWidth={2}
        />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            AI Chart Generator
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Describe the chart you want to create and let AI generate it for you
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-4">
            <Textarea
              placeholder="Example: Show me a bar chart of total profit by product category"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-muted/50 border-input text-foreground min-h-[100px] focus:border-primary"
              disabled={loading}
            />
            <div className="flex gap-3">
              <Button
                onClick={generateChart}
                disabled={loading || !description.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Chart
                  </>
                )}
              </Button>
              {(description || chartConfig) && (
                <Button
                  onClick={handleClear}
                  variant="outline"
                  disabled={loading}
                  className="border-border text-foreground hover:bg-muted"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {chartConfig && (
        <PlotlyChart
          data={chartConfig.data || []}
          layout={chartConfig.layout || {}}
          title="AI Generated Chart"
          description="Custom visualization based on your description"
        />
      )}

      {!chartConfig && !loading && (
        <Card className="bg-card border-border">
          <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
            <div className="text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter a description above and click "Generate Chart" to create a custom visualization</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
