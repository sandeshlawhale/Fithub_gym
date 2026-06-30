import Link from "next/link";
import { MemberService } from "@/services/member.service";
import { prisma } from "@/lib/prisma";
import MembersTableControls from "./MembersTableControls";
import MemberTableRow from "./MemberTableRow";

import {
  UserPlus,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  XCircle
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    planId?: string;
  }>;
}

import { Suspense } from "react";
import MembersLoading from "./loading";

export const unstable_instant = { prefetch: "static", unstable_disableValidation: true };

export default function MembersPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<MembersLoading />}>
      <MembersContent searchParams={searchParams} />
    </Suspense>
  );
}

async function MembersContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page || "1");
  const search = params.search || "";
  const status = params.status || "";
  const planId = params.planId || "";

  // 1. Fetch dynamic members
  const result = await MemberService.getMembers({
    page,
    limit: 10,
    search,
    status,
    planId,
  });

  // 2. Fetch active plans for dropdown
  const activePlans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
    select: { id: true, name: true, memberType: true },
  });

  // Pagination helpers
  const prevPage = page > 1 ? page - 1 : 1;
  const nextPage = page < result.totalPages ? page + 1 : result.totalPages;

  return (
    <div className="flex flex-col gap-lg w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="font-display text-4xl font-extrabold text-on-background uppercase tracking-tight">Members</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm max-w-2xl">
            Manage your Members, track membership statuses, and maintain peak performance.
          </p>
        </div>
        <Link
          href="/admin/members/new"
          prefetch={false}
          className="bg-primary-container text-on-primary-container font-label-md text-label-md font-bold px-lg py-md rounded-xl flex items-center gap-sm active:scale-95 transition-transform shrink-0 cursor-pointer hover:bg-primary"
        >
          <UserPlus className="w-[20px] h-[20px]" />
          Add Member
        </Link>
      </div>

      {/* Table Card Container */}
      <div className="bg-surface border border-outline-variant rounded-xl flex flex-col shadow-sm mt-md w-full max-w-full">
        {/* Table Toolbar controls */}
        <MembersTableControls plans={activePlans} />

        {/* Table Wrapper */}
        <div className={`overflow-x-auto w-full max-w-full ${result.totalPages <= 1 ? "rounded-b-xl" : ""}`}>
          <table className="w-full text-left border-collapse">
            {/* Sticky Header */}
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Member Name</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Contacts</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Plan Type</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Expires In</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-md text-sm bg-surface">
              {result.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-xl text-center text-on-surface-variant">
                    No members found matching the filters.
                  </td>
                </tr>
              ) : (
                result.data.map((member) => {
                  // Calculate remaining days for this member's current membership
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  let diffDays: number | null = null;
                  if (member.latestMembership?.endDate) {
                    const end = new Date(member.latestMembership.endDate);
                    end.setHours(0, 0, 0, 0);
                    const diffTime = end.getTime() - today.getTime();
                    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  }

                  return (
                    <MemberTableRow key={member.id} memberId={member.id}>
                      {/* Member Name with Avatar */}
                      <td className="py-md px-lg">
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center shrink-0 text-primary font-bold uppercase font-display">
                            {member.firstName.substring(0, 1)}{member.lastName.substring(0, 1)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-on-background font-semibold capitalize truncate">{member.name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contacts: Phone and Email */}
                      <td className="py-md px-lg">
                        <div className="flex flex-col gap-xs min-w-0">
                          <div className="text-on-background font-medium truncate">{member.phone}</div>
                          <div className="text-on-surface-variant text-xs truncate">{member.email || "No email"}</div>
                        </div>
                      </td>

                      {/* Plan Type */}
                      <td className="py-md px-lg">
                        <span className="text-on-background font-medium">{member.planName}</span>
                      </td>

                      {/* Expires In with dynamic alerts */}
                      <td className="py-md px-lg">
                        {diffDays === null ? (
                          <span className="text-secondary text-xs">-</span>
                        ) : diffDays < 0 ? (
                          <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full border text-xs font-semibold whitespace-nowrap border-error text-error bg-error/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                            Expired
                          </span>
                        ) : diffDays === 0 ? (
                          <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full border text-xs font-semibold whitespace-nowrap border-amber-500 text-amber-500 bg-amber-500/10 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Expires Today
                          </span>
                        ) : diffDays <= 5 ? (
                          <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full border text-xs font-semibold whitespace-nowrap border-yellow-500 text-yellow-500 bg-yellow-500/10 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                            {diffDays} {diffDays === 1 ? "day" : "days"} left
                          </span>
                        ) : (
                          <span className="text-white font-medium">
                            {diffDays} {diffDays === 1 ? "day" : "days"}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-md px-lg">
                        <span className={`inline-flex items-center gap-xs px-sm py-xs rounded-full border text-xs font-semibold whitespace-nowrap uppercase tracking-wider ${
                          member.status === "ACTIVE"
                            ? "border-primary text-primary bg-primary/10"
                            : member.status === "EXPIRING_SOON"
                              ? "border-amber-500 text-amber-500 bg-amber-500/10"
                              : member.status === "EXPIRED"
                                ? "border-error text-error bg-error/10"
                                : "border-outline-variant text-on-surface-variant bg-surface-container"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            member.status === "ACTIVE"
                              ? "bg-primary"
                              : member.status === "EXPIRING_SOON"
                                ? "bg-amber-500 animate-pulse"
                                : member.status === "EXPIRED"
                                  ? "bg-error"
                                  : "bg-on-surface-variant"
                          }`}></span>
                          {member.status === "EXPIRING_SOON" ? "EXPIRING SOON" : member.status === "UPCOMING" ? "COMING SOON" : member.status}
                        </span>
                      </td>
                    </MemberTableRow>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        {result.totalPages > 1 && (
          <div className="p-lg border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between rounded-b-xl">
            <p className="font-label-md text-label-md text-on-surface-variant">
              Showing <span className="text-on-background font-bold">{((page - 1) * 10) + 1}</span> to <span className="text-on-background font-bold">{Math.min(page * 10, result.total)}</span> of <span className="text-on-background font-bold">{result.total}</span> members
            </p>
            <div className="flex items-center gap-xs">
              <Link
                href={`/admin/members?page=${prevPage}&search=${search}&status=${status}&planId=${planId}`}
                prefetch={false}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors ${page === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
              >
                <ChevronLeft className="w-[18px] h-[18px]" />
              </Link>

              {Array.from({ length: result.totalPages }, (_, idx) => idx + 1).map((p) => {
                const isCurrent = p === page;
                return (
                  <Link
                    key={p}
                    href={`/admin/members?page=${p}&search=${search}&status=${status}&planId=${planId}`}
                    prefetch={false}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-label-md font-bold transition-colors ${isCurrent
                      ? "bg-primary-container text-on-primary-container"
                      : "border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                  >
                    {p}
                  </Link>
                );
              })}

              <Link
                href={`/admin/members?page=${nextPage}&search=${search}&status=${status}&planId=${planId}`}
                prefetch={false}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors ${page === result.totalPages ? "pointer-events-none opacity-50" : ""
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
