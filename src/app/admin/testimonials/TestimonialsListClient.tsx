"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { 
  Search, 
  Check, 
  Trash2, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  Loader2,
  X,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { approveTestimonialAction, deleteTestimonialAction, unapproveTestimonialAction } from "@/features/testimonials/actions";

interface Testimonial {
  id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  consent: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TestimonialsListClientProps {
  testimonials: Testimonial[];
  total: number;
  page: number;
  totalPages: number;
  search: string;
  filter: string;
}

export default function TestimonialsListClient({
  testimonials,
  total,
  page,
  totalPages,
  search: initialSearch,
  filter: initialFilter,
}: TestimonialsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState(initialFilter);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string>("");
  const [viewingTestimonial, setViewingTestimonial] = useState<Testimonial | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Helper to update search query parameters
  const updateQuery = (newSearch: string, newFilter: string, newPage: number) => {
    const params = new URLSearchParams(searchParams);
    
    if (newSearch) {
      params.set("search", newSearch);
    } else {
      params.delete("search");
    }
    
    if (newFilter && newFilter !== "all") {
      params.set("filter", newFilter);
    } else {
      params.delete("filter");
    }
    
    if (newPage > 1) {
      params.set("page", newPage.toString());
    } else {
      params.delete("page");
    }

    startTransition(() => {
      router.push(`/admin/testimonials?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery(search, filter, 1);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    updateQuery(search, newFilter, 1);
  };

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    setActionError(null);
    try {
      const res = await approveTestimonialAction(id);
      if (res?.error) {
        setActionError(res.error);
      }
    } catch (e) {
      setActionError("Failed to approve testimonial.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUnapprove = async (id: string) => {
    setActionLoadingId(id);
    setActionError(null);
    try {
      const res = await unapproveTestimonialAction(id);
      if (res?.error) {
        setActionError(res.error);
      }
    } catch (e) {
      setActionError("Failed to unapprove testimonial.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setActionLoadingId(deletingId);
    setActionError(null);
    try {
      const res = await deleteTestimonialAction(deletingId);
      if (res?.error) {
        setActionError(res.error);
      } else {
        setDeletingId(null);
      }
    } catch (e) {
      setActionError("Failed to delete testimonial.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return isoString;
    }
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return "??";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0]! + parts[parts.length - 1]![0]).toUpperCase();
  };

  // Pagination navigation helpers
  const prevPage = page > 1 ? page - 1 : 1;
  const nextPage = page < totalPages ? page + 1 : totalPages;

  return (
    <div className="flex flex-col gap-lg w-full relative">
      {/* Action Error Banner */}
      {actionError && (
        <div className="bg-error/10 border border-error/20 text-error rounded-xl p-4 text-sm font-semibold flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-error hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="font-display text-4xl font-extrabold text-on-background uppercase tracking-tight">
            Testimonials
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm max-w-2xl">
            Approve, moderate, and manage testimonials submitted by your gym members.
          </p>
        </div>
      </div>

      {/* Table Container Card */}
      <div className="bg-surface border border-outline-variant rounded-xl flex flex-col shadow-sm mt-md w-full max-w-full relative">
        
        {/* Table Toolbar controls */}
        <div className="p-lg border-b border-outline-variant flex flex-col md:flex-row justify-between items-stretch md:items-center gap-md">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  updateQuery("", filter, 1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Filter options */}
          <div className="flex bg-surface-container border border-outline-variant rounded-lg p-1 self-start md:self-auto">
            {["all", "pending", "approved"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => handleFilterChange(f)}
                className={cn(
                  "px-md py-1.5 rounded-md text-sm font-semibold capitalize active:scale-95 transition-all cursor-pointer",
                  filter === f
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Loading overlay for list updates */}
        {isPending && (
          <div className="absolute inset-0 bg-black/35 backdrop-blur-xs flex items-center justify-center z-40 rounded-xl">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        )}

        {/* Table Wrapper */}
        <div className={cn("overflow-x-auto w-full max-w-full", totalPages <= 1 && "rounded-b-xl")}>
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold w-[18%]">
                  Name
                </th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold w-[18%]">
                  Email
                </th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold w-[10%]">
                  Rating
                </th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold w-[30%]">
                  Review
                </th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold w-[12%]">
                  Submitted On
                </th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold w-[8%]">
                  Status
                </th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold text-right w-[8%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-md text-sm bg-surface">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-2xl text-center text-on-surface-variant font-medium">
                    No testimonials found.
                  </td>
                </tr>
              ) : (
                testimonials.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setViewingTestimonial(t)}
                    className="hover:bg-surface-container-lowest/30 transition-colors cursor-pointer"
                  >
                    {/* Name */}
                    <td className="py-md px-lg">
                      <div className="flex items-center gap-md">
                        <div className="w-9 h-9 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center shrink-0 text-primary font-bold uppercase font-display text-xs">
                          {getInitials(t.name)}
                        </div>
                        <div className="text-on-background font-semibold capitalize truncate max-w-[120px] md:max-w-[150px]" title={t.name}>
                          {t.name}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-md px-lg">
                      <div className="text-on-background truncate max-w-[150px]" title={t.email}>
                        {t.email}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-md px-lg">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-3.5 h-3.5",
                              star <= t.rating
                                ? "fill-primary text-primary"
                                : "text-[#2e2e2d] fill-none"
                            )}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Review text */}
                    <td className="py-md px-lg">
                      <p className="text-secondary line-clamp-3 leading-relaxed max-w-[320px] md:max-w-[420px]" title={t.review}>
                        {t.review}
                      </p>
                    </td>

                    {/* Submitted On */}
                    <td className="py-md px-lg whitespace-nowrap text-on-surface-variant">
                      {formatDate(t.createdAt)}
                    </td>

                    {/* Status badge */}
                    <td className="py-md px-lg">
                      <span
                        className={cn(
                          "inline-flex items-center gap-xs px-sm py-xs rounded-full border text-xs font-semibold whitespace-nowrap uppercase tracking-wider",
                          t.isApproved
                            ? "border-primary text-primary bg-primary/10"
                            : "border-amber-500 text-amber-500 bg-amber-500/10"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            t.isApproved ? "bg-primary" : "bg-amber-500"
                          )}
                        ></span>
                        {t.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-md px-lg text-right">
                      <div className="flex items-center justify-end gap-sm">
                        {/* Approve button (only for pending) */}
                        {!t.isApproved ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(t.id);
                            }}
                            disabled={actionLoadingId !== null}
                            className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                            title="Approve Testimonial"
                          >
                            {actionLoadingId === t.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          /* Unapprove button (only for approved) */
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnapprove(t.id);
                            }}
                            disabled={actionLoadingId !== null}
                            className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-500 flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                            title="Unapprove Testimonial"
                          >
                            {actionLoadingId === t.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        
                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingId(t.id);
                            setDeletingName(t.name);
                          }}
                          disabled={actionLoadingId !== null}
                          className="w-8 h-8 rounded-lg bg-error/10 border border-error/20 hover:bg-error/20 text-error flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                          title="Delete Testimonial"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        {totalPages > 1 && (
          <div className="p-lg border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between rounded-b-xl">
            <p className="font-label-md text-label-md text-on-surface-variant">
              Showing <span className="text-on-background font-bold">{((page - 1) * 10) + 1}</span> to{" "}
              <span className="text-on-background font-bold">{Math.min(page * 10, total)}</span> of{" "}
              <span className="text-on-background font-bold">{total}</span> testimonials
            </p>
            <div className="flex items-center gap-xs">
              <button
                onClick={() => updateQuery(search, filter, prevPage)}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="w-[18px] h-[18px]" />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => {
                const isCurrent = p === page;
                return (
                  <button
                    key={p}
                    onClick={() => updateQuery(search, filter, p)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-lg font-label-md font-bold transition-colors cursor-pointer",
                      isCurrent
                        ? "bg-primary-container text-on-primary-container"
                        : "border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                    )}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => updateQuery(search, filter, nextPage)}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronRight className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-error/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-error/10 border border-error/20 flex items-center justify-center text-error shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-extrabold text-white uppercase tracking-wide">
                  Delete Testimonial?
                </h3>
                <p className="text-on-surface-variant text-xs mt-1">
                  Submitted by <span className="text-white font-semibold">{deletingName}</span>
                </p>
              </div>
            </div>

            {/* Content */}
            <p className="text-secondary text-sm leading-relaxed mb-6">
              Are you sure you want to permanently delete this testimonial? This action cannot be undone and it will be removed from the website immediately if approved.
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeletingId(null);
                  setDeletingName("");
                }}
                disabled={actionLoadingId !== null}
                className="px-5 py-2.5 rounded-lg border border-outline-variant hover:bg-surface-container text-white font-label-md font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={actionLoadingId !== null}
                className="px-5 py-2.5 rounded-lg bg-error hover:bg-red-600 text-white font-label-md font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {actionLoadingId === deletingId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Very Minimal Viewing Modal */}
      {viewingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface border border-outline-variant rounded-2xl w-full max-w-md p-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close */}
            <button
              onClick={() => setViewingTestimonial(null)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Profile Info */}
            <div className="mb-md pr-8 flex flex-col gap-xs">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-4 h-4",
                      star <= viewingTestimonial.rating
                        ? "fill-primary text-primary"
                        : "text-[#2e2e2d] fill-none"
                    )}
                  />
                ))}
              </div>
              <h3 className="text-lg font-display font-extrabold text-white uppercase tracking-wide truncate">
                {viewingTestimonial.name}
              </h3>
              <p className="text-xs text-on-surface-variant leading-none">{viewingTestimonial.email}</p>
              <p className="text-[10px] text-on-surface-variant/70 mt-0.5">
                Submitted on {formatDate(viewingTestimonial.createdAt)}
              </p>
            </div>

            {/* Full review text */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-md mb-md max-h-56 overflow-y-auto scrollbar-themed">
              <p className="text-secondary text-sm leading-relaxed whitespace-pre-wrap italic">
                "{viewingTestimonial.review}"
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-md border-t border-outline-variant/20">
              <span
                className={cn(
                  "inline-flex items-center gap-xs px-sm py-xs rounded-full border text-[10px] font-bold uppercase tracking-wider",
                  viewingTestimonial.isApproved
                    ? "border-primary text-primary bg-primary/10"
                    : "border-amber-500 text-amber-500 bg-amber-500/10"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    viewingTestimonial.isApproved ? "bg-primary" : "bg-amber-500"
                  )}
                ></span>
                {viewingTestimonial.isApproved ? "Approved" : "Pending"}
              </span>

              <div className="flex items-center gap-2">
                {!viewingTestimonial.isApproved ? (
                  <button
                    onClick={async () => {
                      const id = viewingTestimonial.id;
                      setViewingTestimonial(null);
                      await handleApprove(id);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      const id = viewingTestimonial.id;
                      setViewingTestimonial(null);
                      await handleUnapprove(id);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-500 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Unapprove
                  </button>
                )}
                <button
                  onClick={() => {
                    const id = viewingTestimonial.id;
                    const name = viewingTestimonial.name;
                    setViewingTestimonial(null);
                    setDeletingId(id);
                    setDeletingName(name);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-error/10 border border-error/20 hover:bg-error/20 text-error text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
