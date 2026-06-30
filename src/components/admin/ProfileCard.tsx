"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronUp } from "lucide-react";
import { signOut } from "next-auth/react";

interface ProfileCardProps {
  adminName?: string;
}

export default function ProfileCard({ adminName = "FitHub Admin" }: ProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Dropup Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-[#1e1e1e] border border-outline-variant rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="px-md py-sm border-b border-outline-variant/50 bg-[#151515]">
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Account Action</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-md px-md py-md text-error hover:bg-surface-container-high transition-all duration-200 ease-in-out font-label-md text-label-md text-left cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Profile Card Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between gap-sm p-sm rounded-xl border transition-all duration-200 text-left select-none cursor-pointer ${
          isOpen
            ? "bg-surface-container-highest border-primary-container text-on-surface"
            : "bg-surface-container-high border-outline-variant text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
        }`}
      >
        <div className="flex items-center gap-md min-w-0">
          <div className="w-9 h-9 rounded-full bg-primary-container/10 border border-primary-container/20 flex items-center justify-center text-primary-container font-bold uppercase shrink-0">
            {adminName.substring(0, 2)}
          </div>
          <div className="truncate">
            <p className="font-semibold text-on-surface leading-tight truncate">{adminName}</p>
            <p className="text-[11px] text-on-surface-variant leading-none mt-1">Administrator</p>
          </div>
        </div>
        <ChevronUp className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-primary-container" : ""}`} />
      </button>
    </div>
  );
}
