import Link from "next/link";
import { MembershipService } from "@/services/membership.service";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HistoryTableControls from "./HistoryTableControls";
import ReceiptButton from "./ReceiptButton";
import ExportPDFButton from "./ExportPDFButton";


interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    planId?: string;
    dateRange?: string;
  }>;
}

import { Suspense } from "react";
import MembershipHistoryLoading from "./loading";

export const unstable_instant = { prefetch: "static", unstable_disableValidation: true };

export default function MembershipHistoryPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<MembershipHistoryLoading />}>
      <MembershipHistoryContent searchParams={searchParams} />
    </Suspense>
  );
}

async function MembershipHistoryContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page || "1");
  const search = params.search || "";
  const status = params.status || "";
  const planId = params.planId || "";
  const dateRange = params.dateRange || "all_time";

  const result = await MembershipService.getMembershipHistoryLog({
    page,
    limit: 10,
    search,
    status,
    planId,
    dateRange,
  });

  const activePlans = await prisma.membershipPlan.findMany({
    where: { isDeleted: false },
    select: { id: true, name: true, memberType: true },
  });

  const prevPage = page > 1 ? page - 1 : 1;
  const nextPage = page < result.totalPages ? page + 1 : result.totalPages;

  return (
    <div className="flex flex-col gap-lg w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-md w-full">
        <div>
          <h2 className="font-display text-4xl font-extrabold text-on-background uppercase tracking-tight">Membership History</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
            Audit log of all registered membership transactions, renewals, and fees.
          </p>
        </div>
        <div className="shrink-0 md:self-start">
          <ExportPDFButton search={search} status={status} planId={planId} dateRange={dateRange} plans={activePlans} />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface border border-outline-variant rounded-xl flex flex-col shadow-sm mt-md w-full max-w-full">
        {/* Table Header toolbar with filters */}
        <HistoryTableControls plans={activePlans} />

        {/* Table Wrapper */}
        <div className={`overflow-x-auto w-full max-w-full ${result.totalPages <= 1 ? "rounded-b-xl" : ""}`}>
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Date</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Member</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Plan Name</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Period</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Days to Expire</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Method</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Reg. Fee</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold text-right">Paid Amount</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-md text-sm bg-surface">
              {result.data.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-xl text-center text-on-surface-variant">
                    No transactions found matching the filters.
                  </td>
                </tr>
              ) : (
                result.data.map((log) => {
                  // Days to expire calculation
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const end = new Date(log.endDate);
                  end.setHours(0, 0, 0, 0);
                  
                  const diffTime = end.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="py-md px-lg text-on-surface-variant">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-md px-lg font-medium text-white">
                        <Link href={`/admin/members/${log.memberId}`} prefetch={false} className="hover:text-primary transition-colors">
                          {log.memberName}
                        </Link>
                      </td>
                      <td className="py-md px-lg text-on-surface">
                        {log.planName}
                      </td>
                      <td className="py-md px-lg text-on-surface-variant">
                        {new Date(log.startDate).toLocaleDateString()} to {new Date(log.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-md px-lg">
                        {diffDays < 0 ? (
                          <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full border text-xs font-semibold whitespace-nowrap border-error text-error bg-error/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                            Expired
                          </span>
                        ) : diffDays === 0 ? (
                          <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full border text-xs font-semibold whitespace-nowrap border-primary-container text-primary-container bg-primary-container/10 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                            Expires Today
                          </span>
                        ) : (
                          <span className="text-white">
                            {diffDays} {diffDays === 1 ? "day" : "days"}
                          </span>
                        )}
                      </td>
                      <td className="py-md px-lg text-on-surface-variant font-semibold">
                        {log.paymentMethod}
                      </td>
                      <td className="py-md px-lg text-on-surface-variant">
                        {log.registrationFee > 0 ? (
                          <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full border text-xs font-semibold whitespace-nowrap border-primary text-primary bg-primary/10">
                            ₹{log.registrationFee.toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span className="text-secondary text-xs">-</span>
                        )}
                      </td>
                      <td className="py-md px-lg text-right font-bold text-primary-container">
                        ₹{(log.amount + log.registrationFee).toLocaleString("en-IN")}
                      </td>
                      <td className="py-md px-lg text-right">
                        <ReceiptButton membershipId={log.id} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {result.totalPages > 1 && (
          <div className="p-lg border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between rounded-b-xl">
            <p className="font-label-md text-label-md text-on-surface-variant">
              Showing <span className="text-on-background font-bold">{((page - 1) * 10) + 1}</span> to <span className="text-on-background font-bold">{Math.min(page * 10, result.total)}</span> of <span className="text-on-background font-bold">{result.total}</span> transactions
            </p>
            <div className="flex items-center gap-xs">
              <Link
                href={`/admin/membership-history?page=${prevPage}&search=${search}&status=${status}&planId=${planId}&dateRange=${dateRange}`}
                prefetch={false}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors ${
                  page === 1 ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <ChevronLeft className="w-[18px] h-[18px]" />
              </Link>
              
              {Array.from({ length: result.totalPages }, (_, idx) => idx + 1).map((p) => {
                const isCurrent = p === page;
                return (
                  <Link
                    key={p}
                    href={`/admin/membership-history?page=${p}&search=${search}&status=${status}&planId=${planId}&dateRange=${dateRange}`}
                    prefetch={false}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-label-md font-bold transition-colors ${
                      isCurrent
                        ? "bg-primary-container text-on-primary-container"
                        : "border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}

              <Link
                href={`/admin/membership-history?page=${nextPage}&search=${search}&status=${status}&planId=${planId}&dateRange=${dateRange}`}
                prefetch={false}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors ${
                  page === result.totalPages ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <ChevronRight className="w-[18px] h-[18px]" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
