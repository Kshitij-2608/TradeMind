"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { useTheme } from 'next-themes';
import { Sun, Moon, ChevronDown } from 'lucide-react';

/**
 * Dashboard header with user info and theme toggle
 */
export default function DashboardHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="relative bg-card/80 backdrop-blur-xl shadow-lg border-b border-border/50">
      <GlowingEffect
        spread={30}
        glow={true}
        disabled={false}
        proximity={80}
        inactiveZone={0.5}
        borderWidth={2}
        variant="default"
      />
      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                ImportExport
              </span>
              <span className="text-foreground ml-2">Dashboard</span>
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <Avatar className="ring-2 ring-primary/20">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-primary font-semibold">IS</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">Isha Sahasrabuddhe</p>
                <p className="text-xs text-muted-foreground">isha@example.com</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-full"
              suppressHydrationWarning
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            <span className="text-sm text-muted-foreground hidden lg:block">Last updated: 2 hours ago</span>
          </div>
        </div>
      </div>
    </header>
  );
}
