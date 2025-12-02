"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Leaf,
    Search,
    LineChart,
    Globe2,
    FileText,
    LogOut,
    Settings,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        variant: 'default'
    },
    {
        title: 'Sustainability',
        href: '/dashboard/sustainability',
        icon: Leaf,
        variant: 'ghost'
    },
    {
        title: 'HS Classifier',
        href: '/dashboard/classification',
        icon: Search,
        variant: 'ghost'
    },
    {
        title: 'Simulator',
        href: '/dashboard/simulator',
        icon: LineChart,
        variant: 'ghost'
    },
    {
        title: 'Opportunities',
        href: '/dashboard/opportunities',
        icon: Globe2,
        variant: 'ghost'
    },
    {
        title: 'Documents',
        href: '/dashboard/documents',
        icon: FileText,
        variant: 'ghost'
    },
];

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <div className={cn(
            "pb-12 min-h-screen border-r bg-card/50 backdrop-blur-xl transition-all duration-300 relative",
            isCollapsed ? "w-16" : "w-64",
            className
        )}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    {/* Toggle Button */}
                    <div className="flex justify-end mb-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="h-8 w-8"
                        >
                            <Menu className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-1">
                        {sidebarItems.filter(item => item.title !== 'Documents').map((item) => (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start text-lg py-6", // Increased font size and padding
                                        pathname === item.href && "bg-primary/10 text-primary hover:bg-primary/20",
                                        isCollapsed ? "justify-center px-2" : "px-4"
                                    )}
                                    title={isCollapsed ? item.title : undefined}
                                >
                                    <item.icon className={cn("h-6 w-6", isCollapsed ? "mr-0" : "mr-3")} /> {/* Increased icon size and margin */}
                                    {!isCollapsed && item.title}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="px-3 py-2 mt-auto absolute bottom-4 w-full">
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-muted-foreground hover:text-destructive",
                                isCollapsed ? "justify-center px-2" : "px-4"
                            )}
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            title={isCollapsed ? "Sign Out" : undefined}
                        >
                            <LogOut className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                            {!isCollapsed && "Sign Out"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
