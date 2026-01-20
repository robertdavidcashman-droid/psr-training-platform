"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background" data-testid="app-shell">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex min-w-0 flex-1 flex-col min-h-screen lg:min-h-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="flex-1" data-testid="main-content">
            <div className="w-full p-4 md:p-6 lg:px-8 lg:py-6 xl:px-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
