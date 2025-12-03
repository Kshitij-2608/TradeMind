import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <div className="flex">
                <aside className="hidden lg:block h-screen sticky top-0 z-30">
                    <Sidebar />
                </aside>
                <div className="flex flex-col min-h-screen flex-1 w-0">
                    <Header />
                    <main className="flex-1 p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
