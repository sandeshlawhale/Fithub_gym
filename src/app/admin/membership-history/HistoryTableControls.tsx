"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, X, Check } from "lucide-react";
import { useTableTransition } from "@/components/ui/table-transition";

interface PlanOption {
  id: string;
  name: string;
  memberType?: string;
}

interface HistoryTableControlsProps {
  plans: PlanOption[];
}

const STATUS_OPTIONS = [
  { value: "active", label: "Active", dot: "bg-green-500" },
  { value: "expiring_soon", label: "Expiring Soon", dot: "bg-orange-500" },
  { value: "upcoming", label: "Upcoming", dot: "bg-yellow-400" },
  { value: "expired", label: "Expired", dot: "bg-red-500" },
  { value: "expired_last_30_days", label: "Expired in Last 30 Days", dot: "bg-pink-500" },
];

/** Extract approximate duration in days from a plan name for sorting (shortest first). */
function planDurationDays(name: string): number {
  const n = name.toLowerCase();
  if (n.includes("daily")) return 1;
  if (n.includes("weekly")) return 7;
  if (n.includes("monthly")) return 30;
  if (n.includes("quarterly")) return 90;
  if (n.includes("half yearly") || n.includes("half-yearly")) return 180;
  if (n.includes("yearly") || n.includes("annual")) return 365;
  return 999; // unknown durations go last
}

function sortByDuration(plans: PlanOption[]): PlanOption[] {
  return [...plans].sort((a, b) => planDurationDays(a.name) - planDurationDays(b.name));
}

function FilterDropdown({
  trigger,
  children,
  isActive,
  align = "right",
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`h-10 px-sm flex items-center gap-xs rounded-lg border text-sm font-medium transition-colors cursor-pointer min-w-[110px] justify-between ${isActive
            ? "border-primary text-primary bg-primary/10"
            : "border-outline-variant text-on-surface bg-surface hover:bg-surface-container-high"
          }`}
      >
        {trigger}
        <ChevronDown
          className={`w-4 h-4 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute z-50 top-[calc(100%+6px)] min-w-[220px] bg-surface border border-outline-variant rounded-xl shadow-xl overflow-hidden left-0 ${align === "right" ? "md:left-auto md:right-0" : ""
            }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function HistoryTableControls({ plans }: HistoryTableControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startTransition } = useTableTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [planId, setPlanId] = useState(searchParams.get("planId") || "");

  const statusRef = useRef(status);
  const planIdRef = useRef(planId);
  statusRef.current = status;
  planIdRef.current = planId;

  const hasFilter = !!status || !!planId;

  const applyFilters = (newSearch: string, newStatus: string, newPlanId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (newSearch) params.set("search", newSearch); else params.delete("search");
    if (newStatus) params.set("status", newStatus); else params.delete("status");
    if (newPlanId) params.set("planId", newPlanId); else params.delete("planId");
    params.delete("dateRange");
    startTransition(() => router.push(`/admin/membership-history?${params.toString()}`));
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPlanId("");
    applyFilters("", "", "");
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters(search, statusRef.current, planIdRef.current);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);



  const selectedStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === status)?.label ?? "Status";
  const selectedPlanLabel =
    plans.find((p) => p.id === planId)?.name ?? "Plan";


  return (
    <div className="p-lg border-b border-outline-variant flex flex-col md:flex-row gap-md items-center justify-between bg-surface-container-lowest rounded-t-xl">
      {/* Search Input */}
      <div className="relative w-full md:w-80 h-10 flex items-center rounded-lg bg-surface border border-outline-variant focus-within:border-primary transition-colors">
        <Search className="text-on-surface-variant ml-sm w-5 h-5 shrink-0" />
        <input
          className="w-full h-full bg-transparent border-none text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-0 font-body-md text-sm px-sm"
          placeholder="Search member..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); applyFilters("", statusRef.current, planIdRef.current); }}
            className="mr-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-sm w-full md:w-auto justify-start md:justify-end">
        {/* Status Dropdown */}
        <FilterDropdown
          isActive={!!status}
          align="left"
          trigger={
            <span className="flex items-center gap-xs">
              {status && (
                <span
                  className={`w-2 h-2 rounded-full ${STATUS_OPTIONS.find((s) => s.value === status)?.dot ?? ""
                    }`}
                />
              )}
              {selectedStatusLabel}
            </span>
          }
        >
          {/* Label */}
          <div className="px-sm pt-sm pb-xs">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-xs">
              Membership Status
            </p>
          </div>
          <div className="pb-sm">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const newStatus = status === opt.value ? "" : opt.value;
                  setStatus(newStatus);
                  applyFilters(search, newStatus, planIdRef.current);
                }}
                className="w-full flex items-center gap-sm px-md py-sm text-sm text-on-surface hover:bg-surface-container-high transition-colors text-left"
              >
                <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                <span className="flex-1">{opt.label}</span>
                {status === opt.value && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </FilterDropdown>

        {/* Plan Dropdown — categorized into Single & Couple */}
        <FilterDropdown
          isActive={!!planId}
          trigger={
            <span className="truncate max-w-[120px]">{selectedPlanLabel}</span>
          }
        >
          <div className="px-sm pt-sm pb-xs">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-xs">
              Membership Plan
            </p>
          </div>
          <div className="pb-sm max-h-72 overflow-y-auto scrollbar-themed">
            {/* All Plans option */}
            <button
              type="button"
              onClick={() => {
                setPlanId("");
                applyFilters(search, statusRef.current, "");
              }}
              className="w-full flex items-center gap-sm px-md py-sm text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors text-left italic"
            >
              <span className="flex-1">All Plans</span>
              {!planId && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>

            {/* Single plans */}
            {plans.filter((p) => p.memberType === "SINGLE" || p.name.toLowerCase().includes("single")).length > 0 && (
              <>
                <div className="my-xs mx-md border-t border-outline-variant" />
                <div className="px-sm py-xs">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-xs">
                    Single
                  </p>
                </div>
                {sortByDuration(plans.filter((p) => p.memberType === "SINGLE" || p.name.toLowerCase().includes("single")))
                  .map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        const newPlan = planId === p.id ? "" : p.id;
                        setPlanId(newPlan);
                        applyFilters(search, statusRef.current, newPlan);
                      }}
                      className="w-full flex items-center gap-sm px-md py-sm text-sm text-on-surface hover:bg-surface-container-high transition-colors text-left"
                    >
                      <span className="flex-1">{p.name}</span>
                      {planId === p.id && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
              </>
            )}

            {/* Couple plans */}
            {plans.filter((p) => p.memberType === "COUPLE" || p.name.toLowerCase().includes("couple")).length > 0 && (
              <>
                <div className="my-xs mx-md border-t border-outline-variant" />
                <div className="px-sm py-xs">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-xs">
                    Couple
                  </p>
                </div>
                {sortByDuration(plans.filter((p) => p.memberType === "COUPLE" || p.name.toLowerCase().includes("couple")))
                  .map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        const newPlan = planId === p.id ? "" : p.id;
                        setPlanId(newPlan);
                        applyFilters(search, statusRef.current, newPlan);
                      }}
                      className="w-full flex items-center gap-sm px-md py-sm text-sm text-on-surface hover:bg-surface-container-high transition-colors text-left"
                    >
                      <span className="flex-1">{p.name}</span>
                      {planId === p.id && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
              </>
            )}

            {/* Other plans (neither single nor couple) */}
            {plans.filter(
              (p) =>
                p.memberType !== "SINGLE" &&
                p.memberType !== "COUPLE" &&
                !p.name.toLowerCase().includes("single") &&
                !p.name.toLowerCase().includes("couple")
            ).length > 0 && (
                <>
                  <div className="my-xs mx-md border-t border-outline-variant" />
                  <div className="px-sm py-xs">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-xs">
                      Other
                    </p>
                  </div>
                  {sortByDuration(plans.filter(
                    (p) =>
                      p.memberType !== "SINGLE" &&
                      p.memberType !== "COUPLE" &&
                      !p.name.toLowerCase().includes("single") &&
                      !p.name.toLowerCase().includes("couple")
                  ))
                    .map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          const newPlan = planId === p.id ? "" : p.id;
                          setPlanId(newPlan);
                          applyFilters(search, statusRef.current, newPlan);
                        }}
                        className="w-full flex items-center gap-sm px-md py-sm text-sm text-on-surface hover:bg-surface-container-high transition-colors text-left"
                      >
                        <span className="flex-1">{p.name}</span>
                        {planId === p.id && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    ))}
                </>
              )}
          </div>
        </FilterDropdown>


        {/* Red clear icon — only visible when a filter is active */}
        {hasFilter && (
          <button
            type="button"
            onClick={clearFilters}
            title="Clear all filters"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
