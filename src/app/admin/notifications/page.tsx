import Link from "next/link";
import { WhatsAppService } from "@/services/whatsapp.service";
import NotificationLogsControls from "./NotificationLogsControls";
import NewBroadcastButton from "./NewBroadcastButton";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare,
  FileText,
  Megaphone
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    type?: string;
  }>;
}

import { Suspense } from "react";
import NotificationsLoading from "./loading";

export const unstable_instant = { prefetch: "static", unstable_disableValidation: true };

export default function NotificationsPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<NotificationsLoading />}>
      <NotificationsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function NotificationsContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page || "1");
  const search = params.search || "";
  const type = params.type || "";

  // Fetch logs
  const result = await WhatsAppService.getLogs({
    page,
    limit: 10,
    search,
    type,
  });

  const prevPage = page > 1 ? page - 1 : 1;
  const nextPage = page < result.totalPages ? page + 1 : result.totalPages;

  return (
    <div className="flex flex-col gap-lg w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="font-display text-4xl font-extrabold text-on-background uppercase tracking-tight">WhatsApp Logs & Broadcasts</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm max-w-2xl">
            Monitor real-time communication receipts, automated expiry reminders, and broadcast announcements to gym members.
          </p>
        </div>
        <NewBroadcastButton />
      </div>

      {/* Table Container */}
      <div className="bg-surface border border-outline-variant rounded-xl flex flex-col shadow-sm mt-md overflow-hidden w-full max-w-full">
        {/* Controls */}
        <NotificationLogsControls />

        {/* Table Wrapper */}
        <div className="overflow-x-auto w-full max-w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-surface-container border-b border-[#323232]">
              <tr>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Recipient</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold w-[140px]">Type</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Message Preview</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold w-[140px]">Status</th>
                <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold w-[180px] text-right">Sent Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#323232] font-body-md text-sm bg-surface">
              {result.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-xl text-center text-on-surface-variant">
                    No notification logs found.
                  </td>
                </tr>
              ) : (
                result.data.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors">
                    {/* Recipient info */}
                    <td className="py-md px-lg">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{log.memberName}</span>
                        <span className="text-[#B3B3B3] text-xs">{log.memberPhone}</span>
                      </div>
                    </td>

                    {/* Notification Type */}
                    <td className="py-md px-lg">
                      {log.type === "RECEIPT" && (
                        <span className="inline-flex items-center gap-xs text-[11px] font-bold text-blue-400 bg-blue-500/10 px-sm py-[2px] rounded-full">
                          <FileText className="w-3.5 h-3.5" />
                          Receipt
                        </span>
                      )}
                      {log.type === "EXPIRY_REMINDER" && (
                        <span className="inline-flex items-center gap-xs text-[11px] font-bold text-orange-400 bg-orange-500/10 px-sm py-[2px] rounded-full">
                          <Clock className="w-3.5 h-3.5" />
                          Reminder
                        </span>
                      )}
                      {log.type === "BROADCAST" && (
                        <span className="inline-flex items-center gap-xs text-[11px] font-bold text-purple-400 bg-purple-500/10 px-sm py-[2px] rounded-full">
                          <Megaphone className="w-3.5 h-3.5" />
                          Broadcast
                        </span>
                      )}
                    </td>

                    {/* Message Preview */}
                    <td className="py-md px-lg text-secondary text-xs max-w-sm truncate" title={log.messagePreview}>
                      {log.messagePreview}
                    </td>

                    {/* Delivery Status */}
                    <td className="py-md px-lg">
                      {log.deliveryStatus === "SENT" && (
                        <span className="inline-flex items-center gap-xs text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-sm py-[2px] rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Sent
                        </span>
                      )}
                      {log.deliveryStatus === "DELIVERED" && (
                        <span className="inline-flex items-center gap-xs text-xs font-bold text-[#10B981] bg-[#10B981]/15 px-sm py-[2px] rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Delivered
                        </span>
                      )}
                      {log.deliveryStatus === "PENDING" && (
                        <span className="inline-flex items-center gap-xs text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-sm py-[2px] rounded-full">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          Pending
                        </span>
                      )}
                      {log.deliveryStatus === "FAILED" && (
                        <span className="inline-flex items-center gap-xs text-xs font-bold text-[#EF4444] bg-[#EF4444]/10 px-sm py-[2px] rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          Failed
                        </span>
                      )}
                    </td>

                    {/* Sent Time */}
                    <td className="py-md px-lg text-right text-xs text-secondary font-mono">
                      {new Date(log.sentAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {result.totalPages > 1 && (
          <div className="p-lg flex items-center justify-between border-t border-[#323232] bg-[#181818]">
            <span className="text-xs text-secondary">
              Page {result.page} of {result.totalPages} ({result.total} total logs)
            </span>
            <div className="flex gap-xs">
              <Link
                href={`/admin/notifications?page=${prevPage}&search=${encodeURIComponent(search)}&type=${type}`}
                prefetch={false}
                className={`w-[36px] h-[36px] border border-[#323232] rounded-lg flex items-center justify-center hover:bg-[#181818] transition-colors text-white ${
                  page <= 1 ? "pointer-events-none opacity-40" : ""
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <Link
                href={`/admin/notifications?page=${nextPage}&search=${encodeURIComponent(search)}&type=${type}`}
                prefetch={false}
                className={`w-[36px] h-[36px] border border-[#323232] rounded-lg flex items-center justify-center hover:bg-[#181818] transition-colors text-white ${
                  page >= result.totalPages ? "pointer-events-none opacity-40" : ""
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
