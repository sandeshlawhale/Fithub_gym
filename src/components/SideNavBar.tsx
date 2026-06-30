"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Users, 
  History, 
  CreditCard, 
  Bell, 
  Settings, 
  LogOut, 
  X,
  Dumbbell,
  MessageSquare
} from "lucide-react";

interface SideNavBarProps {
  isOpen?: boolean;
  onClose?: () => void;
  adminName?: string;
}

export default function SideNavBar({ isOpen, onClose, adminName = "FitHub Admin" }: SideNavBarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Membership (History)", href: "/admin/membership-history", icon: History },
    { name: "Membership Plans", href: "/admin/membership-plans", icon: CreditCard },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    // { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];


  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`w-72 h-screen flex-col border-r border-outline-variant bg-surface-container fixed left-0 top-0 py-lg z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex`}>
        {/* Header */}
        <div className="px-lg pb-xl flex items-center justify-between gap-md">
          <div className="flex items-center gap-md">
            <div className="w-12 h-12 rounded-xl bg-surface border border-outline-variant flex items-center justify-center shrink-0">
              <Dumbbell className="w-6 h-6 text-primary-container" />
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold">FitHub Admin</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-xs">Unisex Fitness</p>
            </div>
          </div>
          {/* Close button for mobile */}
          {onClose && (
            <button className="md:hidden text-on-surface-variant hover:text-on-surface" onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-md flex flex-col gap-sm overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-md px-md py-sm rounded-lg transition-all duration-200 ease-in-out font-label-md text-label-md ${
                  isActive
                    ? "border-l-2 border-primary-container bg-surface-container-highest text-primary font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <Icon className={`w-[20px] h-[20px] ${isActive ? "text-primary" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Navigation */}
        <div className="px-md border-t border-outline-variant pt-md pb-md flex flex-col gap-sm">
          <div className="flex items-center gap-md px-md py-sm text-on-surface-variant font-label-md text-label-md">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-primary font-bold uppercase">
              {adminName.substring(0, 2)}
            </div>
            <div className="truncate">
              <p className="font-semibold text-on-surface">{adminName}</p>
              <p className="text-xs text-on-surface-variant truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-md px-md py-sm rounded-lg text-error hover:bg-surface-container-high transition-all duration-200 ease-in-out font-label-md text-label-md text-left"
          >
            <LogOut className="w-[20px] h-[20px]" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
