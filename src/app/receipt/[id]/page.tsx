import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { MembershipService } from "@/services/membership.service";
import ReceiptControls from "./ReceiptControls";
import { Dumbbell } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReceiptPage({ params }: PageProps) {
  const { id } = await params;
  const data = await MembershipService.getMembershipReceiptDetails(id);

  if (!data) {
    notFound();
  }

  const { member, membershipPlan, partner, receiptNo, ...membership } = data;

  // Format Dates
  const paymentDate = new Date(membership.createdAt);
  const formattedDate = paymentDate.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedTime = paymentDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const startDateFormatted = new Date(membership.startDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const endDateFormatted = new Date(membership.endDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Calculate duration
  let durationText = "";
  if (membershipPlan?.durationMonths) {
    durationText = `${membershipPlan.durationMonths} Month${membershipPlan.durationMonths > 1 ? "s" : ""}`;
  } else {
    const diffTime = Math.abs(
      new Date(membership.endDate).getTime() - new Date(membership.startDate).getTime()
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const approxMonths = Math.round(diffDays / 30.4);
    durationText = approxMonths > 0 ? `${approxMonths} Month${approxMonths > 1 ? "s" : ""}` : `${diffDays} Days`;
  }

  // Check Registration vs Renewal
  const isFirstTime = Number(membership.registrationFee) > 0;
  const transactionType = isFirstTime ? "First Time" : "Renewal";

  // Financial values
  const baseAmount = Number(membership.amount);
  const regFee = Number(membership.registrationFee);
  const totalAmount = baseAmount + regFee;

  // Sanitized WhatsApp Link construction
  const headerList = await headers();
  const host = headerList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const receiptLink = `${protocol}://${host}/receipt/${id}`;

  let whatsappPhone = member.phone.replace(/[^0-9]/g, "");
  if (whatsappPhone.length === 10) {
    whatsappPhone = "91" + whatsappPhone;
  }

  const whatsappMessage = `Hello ${member.firstName},\n\nThank you for choosing *The Fit Hub Gym*! Here is your payment receipt.\n\n*Receipt No:* ${receiptNo}\n*Plan:* ${membershipPlan?.name || membership.customPlanName || "Custom Plan"}\n*Amount Paid:* ₹${totalAmount.toLocaleString("en-IN")}\n*Validity:* ${startDateFormatted} to ${endDateFormatted}\n\n*View Receipt online:* ${receiptLink}\n\nStay consistent, stay fit! 💪🏼💥`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#131313] p-md flex flex-col justify-start items-center selection:bg-amber-100 print:bg-white print:p-0">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A5 portrait;
            margin: 8mm;
          }
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .receipt-box {
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background-color: white !important;
            color: black !important;
          }
          .divider-line {
            border-color: #000000 !important;
          }
        }
      `}} />

      {/* Action Controls - Hidden on Print */}
      <ReceiptControls whatsappUrl={whatsappUrl} />

      {/* A5 Receipt Page Card Container */}
      <div className="receipt-box w-full max-w-[148mm] min-h-[210mm] bg-white rounded-2xl border border-neutral-800 shadow-2xl p-lg flex flex-col justify-between text-[11px] font-sans antialiased text-neutral-800 print:border-none print:shadow-none">
        
        <div>
          {/* Gym Header */}
          <div className="text-center flex flex-col items-center gap-xs">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-amber-500 mb-xs">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight text-neutral-950 leading-none">The Fit Hub Gym</h1>
            <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-widest leading-none">Unisex Fitness Center</p>
            
            <div className="w-full my-sm border-t border-dashed border-neutral-300 divider-line" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950">Membership Payment Receipt</h2>
            <div className="w-full my-sm border-t border-dashed border-neutral-300 divider-line" />
          </div>

          {/* Receipt Info Section */}
          <div className="grid grid-cols-2 gap-sm my-md">
            <div className="flex flex-col gap-xs">
              <div className="flex items-center gap-xs">
                <span className="font-bold text-neutral-400 uppercase text-[8px]">Receipt No:</span>
                <span className="font-extrabold text-neutral-950 text-xs">{receiptNo}</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="font-bold text-neutral-400 uppercase text-[8px]">Payment Date:</span>
                <span className="font-medium text-neutral-950">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="font-bold text-neutral-400 uppercase text-[8px]">Payment Time:</span>
                <span className="font-medium text-neutral-950">{formattedTime}</span>
              </div>
            </div>
            
            {/* Gym Details */}
            <div className="text-right flex flex-col gap-2px justify-start text-[10px]">
              <span className="font-bold text-neutral-900">THE FITHUB GYM</span>
              <span className="text-neutral-500">123 Gym Street, Sector V, Salt Lake City, Kolkata - 700091</span>
              <span className="text-neutral-500">PH: +91 98765 43210</span>
              <span className="text-neutral-500">EMAIL: support@thefithubgym.com</span>
            </div>
          </div>

          <div className="w-full my-md border-t border-neutral-200 divider-line" />

          {/* Membership Details Section */}
          <div>
            <h3 className="font-bold text-neutral-950 text-xs uppercase mb-sm tracking-wide">Membership Details</h3>
            <div className="grid grid-cols-2 gap-x-md gap-y-sm text-neutral-700 bg-neutral-50 p-sm rounded-xl print:bg-transparent">
              
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-neutral-400 uppercase">Primary Member</span>
                <span className="font-extrabold text-neutral-900 text-xs">{member.firstName} {member.lastName}</span>
              </div>

              {partner && (
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-neutral-400 uppercase">Partner Member</span>
                  <span className="font-extrabold text-neutral-900 text-xs">{partner.firstName} {partner.lastName}</span>
                </div>
              )}

              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-neutral-400 uppercase">Contact Number</span>
                <span className="font-semibold text-neutral-900">{member.phone}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-neutral-400 uppercase">Email Address</span>
                <span className="font-semibold text-neutral-900 truncate">{member.email || "N/A"}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-neutral-400 uppercase">Membership Plan</span>
                <span className="font-semibold text-neutral-900">{membershipPlan?.name || membership.customPlanName || "Custom Plan"}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-neutral-400 uppercase">Plan Type / Duration</span>
                <span className="font-semibold text-neutral-900">{membershipPlan?.memberType || "SINGLE"} / {durationText}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-neutral-400 uppercase">Validity Period</span>
                <span className="font-bold text-neutral-900">{startDateFormatted} to {endDateFormatted}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-neutral-400 uppercase">Transaction Type</span>
                <span className="font-semibold text-neutral-900">{transactionType}</span>
              </div>

            </div>
          </div>

          <div className="w-full my-md border-t border-neutral-200 divider-line" />

          {/* Payment Details Section */}
          <div>
            <h3 className="font-bold text-neutral-950 text-xs uppercase mb-sm tracking-wide">Payment Summary</h3>
            <div className="flex flex-col gap-xs text-[10px]">
              <div className="flex justify-between items-center text-neutral-600">
                <span>Membership Fee:</span>
                <span className="font-semibold">₹{baseAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-600">
                <span>Registration Fee:</span>
                <span className="font-semibold">₹{regFee.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div className="w-full my-xs border-t border-neutral-200 divider-line" />
              
              <div className="flex justify-between items-center p-sm bg-neutral-900 text-white rounded-xl my-xs print:bg-neutral-100 print:text-black">
                <span className="font-bold text-xs uppercase text-amber-400 print:text-neutral-900">Total Amount Paid</span>
                <span className="font-black text-sm">₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="grid grid-cols-3 gap-xs text-[9px] mt-xs bg-neutral-100 p-sm rounded-lg border border-neutral-200 text-neutral-600 print:bg-transparent">
                <div className="flex flex-col items-center">
                  <span className="text-[7px] font-bold text-neutral-400 uppercase">Payment Mode</span>
                  <span className="font-extrabold text-neutral-800 uppercase mt-2px">{membership.paymentMethod}</span>
                </div>
                <div className="flex flex-col items-center border-x border-neutral-200">
                  <span className="text-[7px] font-bold text-neutral-400 uppercase">Reference No.</span>
                  <span className="font-semibold text-neutral-800 mt-2px truncate max-w-[80px]">{membership.paymentReference || "-"}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[7px] font-bold text-neutral-400 uppercase">Payment Status</span>
                  <span className="inline-flex items-center gap-2px px-sm py-[2px] rounded bg-green-100 text-green-800 text-[8px] font-bold uppercase mt-2px print:bg-transparent print:p-0">
                    Paid
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-lg">
          <div className="w-full my-sm border-t border-dashed border-neutral-300 divider-line" />
          <div className="text-center flex flex-col gap-2px">
            <p className="text-[10px] font-bold text-neutral-900">Thank you for choosing us!</p>
            <p className="text-[8px] font-extrabold text-amber-600 tracking-wider uppercase">Stay consistent, stay fit</p>
          </div>
        </div>

      </div>
    </div>
  );
}
