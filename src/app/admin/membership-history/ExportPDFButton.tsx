"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { getMembershipHistoryForExportAction } from "@/features/members/actions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PlanOption {
  id: string;
  name: string;
  memberType?: string;
}

interface ExportPDFButtonProps {
  search: string;
  status: string;
  planId: string;
  plans: PlanOption[];
}

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "expiring_soon", label: "Expiring Soon" },
  { value: "upcoming", label: "Upcoming" },
  { value: "expired", label: "Expired" },
  { value: "expired_last_30_days", label: "Expired in Last 30 Days" },
];

export default function ExportPDFButton({ search, status, planId, plans }: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const res = await getMembershipHistoryForExportAction({
        search,
        status,
        planId,
      });

      if (!res.success || !res.data) {
        alert(res.error || "Failed to fetch data for export.");
        return;
      }

      const logs = res.data;

      // 1. Initialize jsPDF in landscape mode
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const dateStr = `${day}-${month}-${year}`;

      // Set Document Properties for Preview/Download suggestion
      doc.setProperties({
        title: `membership-history-${dateStr}`,
      });

      // 2. Add Title & Header matching FitHub Gym style
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(15, 15, 15); // Dark gray/black
      doc.text("FITHUB GYM - MEMBERSHIP HISTORY", 14, 20);

      // Subtitle / Date
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${now.toLocaleString()}`, 14, 26);

      // 3. Document Filters section
      doc.setFontSize(10);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(50, 50, 50);
      doc.text("Applied Filters:", 14, 34);

      doc.setFont("Helvetica", "normal");
      let filterY = 38;
      
      const activeFiltersText: string[] = [];
      if (search) activeFiltersText.push(`Search: "${search}"`);
      if (status) {
        const label = STATUS_OPTIONS.find(s => s.value === status)?.label || status;
        activeFiltersText.push(`Status: ${label}`);
      }
      if (planId) {
        const label = plans.find(p => p.id === planId)?.name || planId;
        activeFiltersText.push(`Plan: ${label}`);
      }

      
      if (activeFiltersText.length === 0) {
        activeFiltersText.push("None (All records)");
      }

      doc.text(activeFiltersText.join("  |  "), 14, filterY);

      // Add a dividing line across the landscape width
      doc.setDrawColor(216, 195, 173); // --color-on-surface-variant equivalent style or outline variant
      doc.setLineWidth(0.5);
      doc.line(14, filterY + 4, 283, filterY + 4);

      // 4. Generate Table
      const headers = [
        ["Date", "Member", "Phone", "Email", "Partner Name", "Plan Name", "Period", "Days to Expire", "Method", "Reg. Fee", "Paid Amount"]
      ];

      const body = logs.map((log: any) => {
        // Days to expire calculation
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(log.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(log.endDate);
        end.setHours(0, 0, 0, 0);
        
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let daysToExpireStr = "";
        let statusText = "Active";
        
        if (diffDays < 0) {
          daysToExpireStr = "Expired";
          statusText = "Expired";
        } else if (diffDays === 0) {
          daysToExpireStr = "Expires Today";
          statusText = "Active";
        } else {
          daysToExpireStr = `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
          if (start > today) {
            statusText = "Upcoming";
          } else if (diffDays <= 5) {
            statusText = "Expiring Soon";
          } else {
            statusText = "Active";
          }
        }

        const logDateStr = new Date(log.createdAt).toLocaleDateString();
        const periodStr = `${start.toLocaleDateString()} to ${end.toLocaleDateString()}\nStatus: ${statusText}`;
        const regFeeStr = log.registrationFee > 0 ? `Rs. ${log.registrationFee.toLocaleString("en-IN")}` : "-";
        const paidAmountStr = `Rs. ${(log.amount + log.registrationFee).toLocaleString("en-IN")}`;

        return [
          logDateStr,
          log.memberName,
          log.memberPhone || "",
          log.memberEmail || "",
          log.partnerName || "-",
          log.planName,
          periodStr,
          daysToExpireStr,
          log.paymentMethod,
          regFeeStr,
          paidAmountStr,
        ];
      });

      autoTable(doc, {
        startY: filterY + 8,
        head: headers,
        body: body,
        theme: "striped",
        headStyles: {
          fillColor: [245, 158, 11], // --color-primary-container: #f59e0b (Amber/Orange accent)
          textColor: [97, 59, 0], // --color-on-primary-container: #613b00 (Dark brown/amber text)
          fontStyle: "bold",
          fontSize: 8,
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [50, 50, 50],
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
        columnStyles: {
          0: { cellWidth: 20 }, // Date
          1: { cellWidth: 28 }, // Member Name
          2: { cellWidth: 24 }, // Phone
          3: { cellWidth: 36 }, // Email
          4: { cellWidth: 28 }, // Partner Name
          5: { cellWidth: 24 }, // Plan Name
          6: { cellWidth: 36 }, // Period
          7: { cellWidth: 22 }, // Days to Expire
          8: { cellWidth: 16 }, // Method
          9: { cellWidth: 16 }, // Reg. Fee
          10: { cellWidth: 19 }, // Paid Amount
        },
        styles: {
          overflow: "linebreak",
          cellPadding: 2,
        },
      });

      // 5. Open Preview in a new tab
      const pdfBlob = doc.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, "_blank");

    } catch (err: any) {
      console.error("Failed to export PDF:", err);
      alert("Error occurred while exporting PDF: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExportPDF}
      disabled={isExporting}
      className="h-10 px-md flex items-center gap-xs rounded-lg border border-primary text-primary bg-primary/10 hover:bg-primary/20 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 font-bold text-sm"
    >
      <Download className="w-4 h-4" />
      {isExporting ? "Preparing Preview..." : "Export PDF"}
    </button>
  );
}
