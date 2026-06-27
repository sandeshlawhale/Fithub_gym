"use client";

import { Menu, Bell, HelpCircle } from "lucide-react";
import Link from "next/link";

interface TopNavBarProps {
  onMenuClick: () => void;
  adminName?: string;
}

export default function TopNavBar({ onMenuClick, adminName = "Admin" }: TopNavBarProps) {
  return (
    <header className="w-full h-16 flex justify-between items-center px-lg sticky top-0 z-40 border-b border-outline-variant bg-surface">
      {/* Brand & Mobile toggle */}
      <div className="flex items-center gap-md">
        <button 
          className="md:hidden text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-headline-md text-headline-md font-extrabold text-primary-container tracking-tight uppercase">
          THE FITHUB
        </span>
        <span className="text-on-surface-variant font-label-md text-label-md ml-sm px-sm py-xs border border-outline-variant rounded-md bg-surface-container-lowest hidden sm:inline-block">
          Admin Panel
        </span>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-md">
        {/* <Link 
          href="/admin/notifications" 
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform"
        >
          <Bell className="w-5 h-5" />
        </Link> */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer active:scale-95 transition-transform hidden sm:flex">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="h-6 w-px bg-outline-variant mx-2 hidden sm:block"></div>
        <div className="flex items-center gap-sm">
          <span className="text-label-md hidden sm:block text-on-surface-variant">{adminName}</span>
          <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-primary font-bold uppercase text-xs">
            {adminName.substring(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
}
