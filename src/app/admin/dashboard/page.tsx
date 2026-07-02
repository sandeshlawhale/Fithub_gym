import Link from "next/link";
import { DashboardService } from "@/services/dashboard.service";
import { 
  Users, 
  UserCheck, 
  UserX, 
  DollarSign, 
  UserPlus, 
  MessageSquare, 
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from "lucide-react";

import { headers } from "next/headers";

import { Suspense } from "react";
import DashboardLoading from "./loading";

export const unstable_instant = { prefetch: "static", unstable_disableValidation: true };

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  await headers();
  const summary = await DashboardService.getSummary();
  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const statCards = [
    {
      title: "Active Members",
      value: summary.activeMembers.toLocaleString("en-IN"),
      icon: UserCheck,
      trend: "8% up",
      trendType: "up",
      color: "text-green-500",
      bg: "bg-green-500/10",
      href: "/admin/membership-history?status=active"
    },
    {
      title: "Expiring Soon",
      value: summary.expiringSoon.toLocaleString("en-IN"),
      icon: Calendar,
      trend: "5 days remaining",
      trendType: "warning",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/admin/membership-history?status=expiring_soon"
    },
    {
      title: "Expired",
      value: summary.expiredMembers.toLocaleString("en-IN"),
      icon: UserX,
      trend: "2% down",
      trendType: "down",
      color: "text-error",
      bg: "bg-error/10",
      href: "/admin/membership-history?status=expired"
    },
    {
      title: "Monthly Revenue",
      value: `₹${summary.monthlyRevenue.toLocaleString("en-IN")}`,
      icon: DollarSign,
      trend: "24% up",
      trendType: "up",
      color: "text-primary-container",
      bg: "bg-primary-container/10",
      href: "/admin/membership-history"
    }
  ];

  const chartData = (summary as any).chartData || [];
  const maxCount = Math.max(...chartData.map((d: any) => d.count), 0);
  
  const points = chartData.map((d: any, i: number) => {
    const x = 50 + i * 140;
    const y = maxCount > 0 ? 250 - (d.count / maxCount) * 200 : 250;
    return { x, y, month: d.month, count: d.count };
  });

  const linePath = points.length > 0 
    ? `M ${points[0].x},${points[0].y} ` + points.slice(1).map((p: any) => `L ${p.x},${p.y}`).join(' ')
    : '';
    
  const areaPath = points.length > 0 
    ? `M ${points[0].x},275 ` + points.map((p: any) => `L ${p.x},${p.y}`).join(' ') + ` L ${points[points.length-1].x},275 Z`
    : '';

  return (
    <div className="flex flex-col gap-lg w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface m-0 p-0">Overview</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Real-time performance metrics for The FitHub Gym.</p>
        </div>
        <div className="flex items-center gap-sm text-on-surface-variant font-label-sm text-label-sm bg-surface-container px-md py-sm rounded-lg border border-outline-variant self-start md:self-auto">
          <Calendar className="w-[18px] h-[18px] text-primary" />
          <span>Today, {todayStr}</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md md:gap-lg">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link 
              key={card.title} 
              href={card.href}
              prefetch={false}
              className="bg-[#181818] border border-[#323232] rounded-xl p-lg flex flex-col hover:border-outline-variant hover:bg-surface-container-high transition-all duration-200 group cursor-pointer active:scale-98"
            >
              <div className="flex justify-between items-start mb-md">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.color} ${card.bg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`font-label-sm text-label-sm flex items-center gap-xs px-sm py-xs rounded-md ${
                  card.trendType === "up" 
                    ? "text-primary-container bg-primary-container/10" 
                    : card.trendType === "warning"
                      ? "text-amber-500 bg-amber-500/10"
                      : "text-error bg-error/10"
                }`}>
                  {card.trendType === "up" ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : card.trendType === "warning" ? (
                    <Calendar className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {card.trend}
                </span>
              </div>
              <p className="font-label-sm text-label-sm text-[#B3B3B3] uppercase tracking-wider mb-xs">{card.title}</p>
              <h3 className="font-headline-md text-3xl font-extrabold text-[#FFFFFF] m-0">{card.value}</h3>
            </Link>
          );
        })}
      </div>

      {/* Charts & Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md md:gap-lg">
        {/* Main Chart Card */}
        <div className="bg-[#181818] border border-[#323232] rounded-xl p-lg col-span-1 lg:col-span-8 flex flex-col min-h-[350px]">
          <div className="flex justify-between items-center mb-lg">
            <div>
              <h3 className="font-headline-md text-xl font-bold text-[#FFFFFF] m-0">Member Growth</h3>
              <p className="font-label-sm text-label-sm text-[#B3B3B3] mt-xs">Last 6 Months Trend</p>
            </div>
            <button className="bg-transparent border border-[#323232] text-[#FFFFFF] px-md py-xs rounded-md text-label-sm font-label-sm hover:border-outline-variant transition-colors flex items-center gap-xs">
              This Year
            </button>
          </div>
          
          {/* SVG Line Chart */}
          <div className="flex-1 w-full relative min-h-[220px]">
            <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 800 320">
              <defs>
                <linearGradient id="gradient-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line className="stroke-[#323232] stroke-[1]" x1="50" x2="750" y1="50" y2="50"></line>
              <line className="stroke-[#323232] stroke-[1]" x1="50" x2="750" y1="116" y2="116"></line>
              <line className="stroke-[#323232] stroke-[1]" x1="50" x2="750" y1="183" y2="183"></line>
              <line className="stroke-[#323232] stroke-[1]" x1="50" x2="750" y1="250" y2="250"></line>
              
              {/* Data Path Area */}
              {areaPath && <path fill="url(#gradient-area)" d={areaPath}></path>}
              
              {/* Data Path Line */}
              {linePath && <path fill="none" stroke="#f59e0b" strokeWidth="3" d={linePath}></path>}
              
              {/* Data Points & Value labels */}
              {points.map((p: any, i: number) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} fill={i === points.length - 1 ? "#FFFFFF" : "#f59e0b"} r="5" stroke="#f59e0b" strokeWidth="2"></circle>
                  <text x={p.x} y={p.y - 12} fill="#FFFFFF" textAnchor="middle" className="text-[10px] font-sans font-bold">
                    {p.count}
                  </text>
                  {/* Month Label inside SVG */}
                  <text x={p.x} y="295" fill="#B3B3B3" textAnchor="middle" className="text-xs font-sans">
                    {p.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-md md:gap-lg">
          <div className="bg-[#181818] border border-[#323232] rounded-xl p-lg flex flex-col justify-between">
            <h3 className="font-headline-md text-lg font-bold text-[#FFFFFF] m-0 mb-md">Quick Actions</h3>
            <div className="flex flex-col gap-sm">
              <Link 
                href="/admin/members/new" 
                prefetch={false}
                className="w-full bg-[#F59E0B] text-[#0F0F0F] font-label-md text-label-md font-bold py-3 px-md rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-sm"
              >
                <UserPlus className="w-4 h-4" />
                Add Member
              </Link>
              <Link 
                href="/admin/membership-plans?new=true" 
                prefetch={false}
                className="w-full bg-transparent border border-[#323232] text-[#FFFFFF] font-label-md text-label-md py-3 px-md rounded-lg hover:border-outline-variant hover:bg-surface-container transition-colors flex items-center justify-center gap-sm"
              >
                <Plus className="w-4 h-4" />
                Add Plans
              </Link>
              <Link 
                href="/admin/membership-history" 
                prefetch={false}
                className="w-full bg-transparent border border-[#323232] text-[#FFFFFF] font-label-md text-label-md py-3 px-md rounded-lg hover:border-outline-variant hover:bg-surface-container transition-colors flex items-center justify-center gap-sm"
              >
                <Download className="w-4 h-4" />
                Export Report
              </Link>
              <Link 
                href="/admin/testimonials?filter=pending" 
                prefetch={false}
                className="w-full bg-transparent border border-[#323232] text-[#FFFFFF] font-label-md text-label-md py-3 px-md rounded-lg hover:border-outline-variant hover:bg-surface-container transition-colors flex items-center justify-center gap-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Approve Testimonials
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md md:gap-lg">
        {/* Recent Members */}
        <div className="bg-[#181818] border border-[#323232] rounded-xl overflow-hidden">
          <div className="p-lg border-b border-[#323232] flex justify-between items-center">
            <h3 className="font-headline-md text-lg font-bold text-[#FFFFFF] m-0">Recent Registrations</h3>
            <Link href="/admin/members" prefetch={false} className="text-primary font-label-sm text-label-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#131313]/50">
                  <th className="py-md px-lg font-label-sm text-xs text-[#B3B3B3] uppercase tracking-wider font-semibold border-b border-[#323232]">Member</th>
                  <th className="py-md px-lg font-label-sm text-xs text-[#B3B3B3] uppercase tracking-wider font-semibold border-b border-[#323232]">Plan</th>
                  <th className="py-md px-lg font-label-sm text-xs text-[#B3B3B3] uppercase tracking-wider font-semibold border-b border-[#323232]">Status</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-sm text-[#FFFFFF]">
                {summary.recentMembers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-lg text-center text-secondary">No members registered yet.</td>
                  </tr>
                ) : (
                  summary.recentMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-surface-container-low transition-colors border-b border-[#323232]/50 last:border-0">
                      <td className="py-md px-lg">
                        <div>
                          <p className="m-0 font-medium">{member.name}</p>
                          <p className="m-0 text-[#B3B3B3] text-xs">{member.phone}</p>
                        </div>
                      </td>
                      <td className="py-md px-lg text-secondary">{member.planName}</td>
                      <td className="py-md px-lg">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
                          member.status === "ACTIVE"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : member.status === "EXPIRING_SOON"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse"
                              : member.status === "EXPIRED"
                                ? "bg-error/10 text-error border-error/20"
                                : "bg-surface-container text-on-surface-variant border-outline-variant/30"
                        }`}>
                          {member.status === "EXPIRING_SOON" ? "EXPIRING SOON" : member.status === "UPCOMING" ? "COMING SOON" : member.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Renewals */}
        <div className="bg-[#181818] border border-[#323232] rounded-xl overflow-hidden">
          <div className="p-lg border-b border-[#323232] flex justify-between items-center">
            <h3 className="font-headline-md text-lg font-bold text-[#FFFFFF] m-0">Recent Transactions</h3>
            <Link href="/admin/membership-history" prefetch={false} className="text-primary font-label-sm text-label-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#131313]/50">
                  <th className="py-md px-lg font-label-sm text-xs text-[#B3B3B3] uppercase tracking-wider font-semibold border-b border-[#323232]">Member</th>
                  <th className="py-md px-lg font-label-sm text-xs text-[#B3B3B3] uppercase tracking-wider font-semibold border-b border-[#323232]">Plan Details</th>
                  <th className="py-md px-lg font-label-sm text-xs text-[#B3B3B3] uppercase tracking-wider font-semibold border-b border-[#323232] text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-sm text-[#FFFFFF]">
                {summary.recentRenewals.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-lg text-center text-secondary">No transactions found.</td>
                  </tr>
                ) : (
                  summary.recentRenewals.map((renewal) => (
                    <tr key={renewal.id} className="hover:bg-surface-container-low transition-colors border-b border-[#323232]/50 last:border-0">
                      <td className="py-md px-lg font-medium">{renewal.memberName}</td>
                      <td className="py-md px-lg text-secondary">{renewal.planName}</td>
                      <td className="py-md px-lg text-right font-bold text-primary-container">
                        ₹{renewal.amount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
