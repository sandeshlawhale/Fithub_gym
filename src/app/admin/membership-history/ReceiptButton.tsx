"use client";

import { Receipt } from "lucide-react";

interface ReceiptButtonProps {
  membershipId: string;
}

export default function ReceiptButton({ membershipId }: ReceiptButtonProps) {
  const openReceiptPopup = () => {
    const width = 600;
    const height = 800;
    
    // Center the popup window on screen
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      `/receipt/${membershipId}`,
      `receipt-${membershipId}`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,menubar=no`
    );
  };

  return (
    <button
      onClick={openReceiptPopup}
      className="inline-flex items-center gap-xs px-sm py-xs text-xs font-semibold rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary bg-surface-container-low hover:bg-surface-container-high transition-all cursor-pointer"
      title="View & Download Receipt"
    >
      <Receipt className="w-3.5 h-3.5" />
      Receipt
    </button>
  );
}
