"use client";

import { useState } from "react";
import SideNavBar from "@/components/admin/SideNavBar";
import { Menu } from "lucide-react";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  adminName?: string;
}

export default function AdminLayoutClient({ children, adminName }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-background flex font-body-md antialiased overflow-x-hidden">
      <SideNavBar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        adminName={adminName}
      />
      <div className="flex-1 flex flex-col min-h-screen md:ml-72 bg-background min-w-0 relative">
        {/* Floating Mobile Toggle Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-30 p-3 bg-surface-container border border-outline-variant rounded-xl text-primary-container shadow-lg hover:bg-surface-container-high transition-all active:scale-95"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <main className="flex-1 p-md md:p-lg lg:p-xl flex flex-col gap-lg overflow-y-auto min-w-0 pt-20 md:pt-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
