"use client";

import React, { createContext, useContext, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TableTransitionContextType {
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
}

const TableTransitionContext = createContext<TableTransitionContextType | null>(null);

export function TableTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();

  return (
    <TableTransitionContext.Provider value={{ isPending, startTransition }}>
      {children}
    </TableTransitionContext.Provider>
  );
}

export function useTableTransition() {
  const context = useContext(TableTransitionContext);
  if (!context) {
    throw new Error("useTableTransition must be used within a TableTransitionProvider");
  }
  return context;
}

interface TableTransitionBodyProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export function TableTransitionBody({ children, fallback }: TableTransitionBodyProps) {
  const { isPending } = useTableTransition();
  return isPending ? <>{fallback}</> : <>{children}</>;
}

export function MembersSkeletonRows() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-outline-variant/30 animate-pulse bg-surface">
          <td className="py-md px-lg">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-full bg-surface-container-high shrink-0"></div>
              <div className="flex flex-col gap-xs">
                <div className="h-4 bg-surface-container-high rounded-md w-28"></div>
                <div className="h-3 bg-surface-container-high rounded-md w-16"></div>
              </div>
            </div>
          </td>
          <td className="py-md px-lg">
            <div className="flex flex-col gap-xs">
              <div className="h-4 bg-surface-container-high rounded-md w-24"></div>
              <div className="h-3 bg-surface-container-high rounded-md w-32"></div>
            </div>
          </td>
          <td className="py-md px-lg">
            <div className="h-4 bg-surface-container-high rounded-md w-24"></div>
          </td>
          <td className="py-md px-lg">
            <div className="h-6 bg-surface-container-high rounded-full w-20"></div>
          </td>
          <td className="py-md px-lg">
            <div className="h-6 bg-surface-container-high rounded-full w-24"></div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function HistorySkeletonRows() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-outline-variant/30 animate-pulse bg-surface">
          <td className="py-md px-lg">
            <div className="h-4 bg-surface-container-high rounded-md w-20"></div>
          </td>
          <td className="py-md px-lg">
            <div className="h-4 bg-surface-container-high rounded-md w-28"></div>
          </td>
          <td className="py-md px-lg">
            <div className="h-4 bg-surface-container-high rounded-md w-24"></div>
          </td>
          <td className="py-md px-lg">
            <div className="h-4 bg-surface-container-high rounded-md w-36"></div>
          </td>
          <td className="py-md px-lg">
            <div className="h-6 bg-surface-container-high rounded-full w-20"></div>
          </td>
          <td className="py-md px-lg">
            <div className="h-4 bg-surface-container-high rounded-md w-16"></div>
          </td>
          <td className="py-md px-lg">
            <div className="h-6 bg-surface-container-high rounded-full w-16"></div>
          </td>
          <td className="py-md px-lg text-right">
            <div className="h-4 bg-surface-container-high rounded-md w-20 ml-auto"></div>
          </td>
          <td className="py-md px-lg text-right">
            <div className="h-8 bg-surface-container-high rounded-md w-16 ml-auto"></div>
          </td>
        </tr>
      ))}
    </>
  );
}

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  baseUrl: string;
  searchParams: {
    search?: string;
    status?: string;
    planId?: string;
    [key: string]: string | undefined;
  };
  itemLabel?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  baseUrl,
  searchParams,
  itemLabel = "items",
}: TablePaginationProps) {
  const router = useRouter();
  const { startTransition } = useTableTransition();

  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;

  const buildUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val && key !== "page") {
        params.set(key, val);
      }
    });
    params.set("page", pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber === currentPage) return;
    const url = buildUrl(pageNumber);
    startTransition(() => {
      router.push(url);
    });
  };

  // Generate range using friendly pagination logic
  const range: (number | string)[] = [];
  const delta = 1;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      range.push(i);
    }
  } else {
    range.push(1);
    const left = currentPage - delta;
    const right = currentPage + delta;
    let start = Math.max(2, left);
    let end = Math.min(totalPages - 1, right);

    if (currentPage <= 3) {
      end = 4;
    }
    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
    }

    if (start > 2) {
      range.push("...");
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < totalPages - 1) {
      range.push("...");
    }

    range.push(totalPages);
  }

  const showingStart = (currentPage - 1) * itemsPerPage + 1;
  const showingEnd = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="p-lg border-t border-outline-variant bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-md rounded-b-xl">
      <p className="font-label-md text-label-md text-on-surface-variant">
        Showing <span className="text-on-background font-bold">{showingStart}</span> to{" "}
        <span className="text-on-background font-bold">{showingEnd}</span> of{" "}
        <span className="text-on-background font-bold">{totalItems}</span> {itemLabel}
      </p>
      <div className="flex items-center gap-xs">
        <button
          type="button"
          onClick={() => handlePageChange(prevPage)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronLeft className="w-[18px] h-[18px]" />
        </button>

        {range.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 h-8 flex items-center justify-center text-on-surface-variant text-sm font-medium"
              >
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isCurrent = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => handlePageChange(pageNum)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-label-md font-bold transition-colors cursor-pointer ${
                isCurrent
                  ? "bg-primary-container text-on-primary-container"
                  : "border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => handlePageChange(nextPage)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronRight className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}
