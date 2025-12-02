"use client";

import React from 'react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Button } from '@/components/ui/button';
import { Bell, User, Globe2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Placeholder for left side content if needed, or just spacer */}
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex items-center gap-3">
                        <Globe2 className="h-10 w-10 text-primary" />
                        <h2 className="text-4xl font-bold tracking-tight text-foreground">
                            Trade<span className="text-primary">Mind</span>
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ModeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
                                    <AvatarFallback>TA</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Trade Analyst</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        demo@example.com
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <a href="/dashboard/saved-databases" className="cursor-pointer w-full">
                                    Saved Databases
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive cursor-pointer"
                                onClick={() => {
                                    // In a real app, you would use signOut() from next-auth/react here
                                    // Since we are in a client component, we can redirect or call the function
                                    window.location.href = '/login';
                                }}
                            >
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
