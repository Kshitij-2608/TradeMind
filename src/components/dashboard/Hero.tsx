"use client";

import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight-aceternity";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, BarChart3 } from "lucide-react";

export function Hero() {
    return (
        <Card className="w-full min-h-[600px] md:h-[700px] bg-card/95 backdrop-blur-sm relative overflow-hidden border-border/50 shadow-xl">
            {/* Subtle Spotlight Effect */}
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="url(#sage-gradient)"
            />

            {/* Subtle gradient definitions */}
            <svg className="absolute" width="0" height="0">
                <defs>
                    <linearGradient id="sage-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.05" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Subtle background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/8 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full p-8 md:p-12">
                {/* Left content */}
                <div className="flex flex-col justify-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit">
                        <TrendingUp className="h-4 w-4  text-primary" />
                        <span className="text-sm font-medium text-primary">Premium Analytics</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-foreground">
                            <span className="text-primary">
                                Import Export
                            </span>
                            <br />
                            <span className="text-foreground">
                                Dashboard
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed">
                            Sophisticated analytics with refined data visualization and intelligent insights
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all group"
                        >
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="border-border hover:bg-accent/10 hover:border-accent/50 hover:text-accent transition-all"
                        >
                            <BarChart3 className="mr-2 h-5 w-5" />
                            View Demo
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 pt-4">
                        <div>
                            <div className="text-3xl font-bold text-primary">100+</div>
                            <div className="text-sm text-muted-foreground">Data Points</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-accent">Real-time</div>
                            <div className="text-sm text-muted-foreground">Analytics</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-primary">AI-Powered</div>
                            <div className="text-sm text-muted-foreground">Insights</div>
                        </div>
                    </div>
                </div>

                {/* Right content - LARGER circles */}
                <div className="relative hidden lg:flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl

" />
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Much larger elegant circles */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="absolute w-96 h-96 rounded-full border-2 border-primary/30 animate-pulse" />
                            <div className="absolute w-72 h-72 rounded-full border-2 border-accent/30 animate-pulse" style={{ animationDelay: '300ms' }} />
                            <div className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm animate-pulse" style={{ animationDelay: '500ms' }} />
                            <div className="absolute text-center z-10">
                                <BarChart3 className="h-20 w-20 text-primary mx-auto mb-4" />
                                <p className="text-base text-muted-foreground font-semibold">Import Export Analytics</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
