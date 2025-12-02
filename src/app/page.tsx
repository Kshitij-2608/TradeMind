"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/dashboard/Hero";
import {
  Leaf,
  Search,
  LineChart,
  Globe2,
  FileText,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";

const features = [
  {
    title: "AI HS Code Classifier",
    description: "Instantly classify goods and optimize duties with advanced AI.",
    icon: Search,
  },
  {
    title: "Carbon Footprint Tracking",
    description: "Monitor and reduce your supply chain's environmental impact.",
    icon: Leaf,
  },
  {
    title: "Predictive Simulation",
    description: "Forecast scenarios and mitigate risks before they happen.",
    icon: LineChart,
  },
  {
    title: "Global Arbitrage",
    description: "Discover profitable market opportunities worldwide.",
    icon: Globe2,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Trade<span className="text-primary">Mind</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <Hero />
        </div>

        {/* Features Grid */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Everything you need to master global trade
              </h2>
              <p className="text-muted-foreground text-lg">
                From predictive analytics to sustainability tracking, our platform provides the competitive edge your business needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg group"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="bg-primary/5 rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 to-accent/10 opacity-50" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Ready to transform your supply chain?</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Join thousands of forward-thinking companies using TradeMind to optimize their import/export operations.
                </p>
                <Link href="/signup">
                  <Button size="lg" className="gap-2">
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-secondary/10">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 TradeMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
