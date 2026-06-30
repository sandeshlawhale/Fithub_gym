import Link from "next/link";
import { notFound } from "next/navigation";
import { MemberService } from "@/services/member.service";
import ReceiptButton from "@/app/admin/membership-history/ReceiptButton";
// import DeleteMemberButton from "./DeleteMemberButton";
import {
  ArrowLeft,
  Edit,
  Plus,
  Calendar,
  Phone,
  Mail,
  User,
  MapPin,
  History,
  CreditCard,
  Heart,
  CheckCircle,
  FileText,
  MessageSquare,
  Cake
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

import { Suspense } from "react";
import MemberDetailLoading from "./loading";

export const unstable_instant = { prefetch: "static", unstable_disableValidation: true };

export default function MemberDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<MemberDetailLoading />}>
      <MemberDetailContent params={params} />
    </Suspense>
  );
}

async function MemberDetailContent({ params }: PageProps) {
  const { id } = await params;
  const member = await MemberService.getMemberById(id);

  if (!member) {
    notFound();
  }

  const latestMembership = member.latestMembership;
  const partner = member.coupleGroup?.members[0] || null;

  const formatDate = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isBirthdayThisMonth = member.dateOfBirth ? (() => {
    const dob = new Date(member.dateOfBirth);
    const today = new Date();
    return dob.getMonth() === today.getMonth() && dob.getDate() >= today.getDate();
  })() : false;

  return (
    <div className="flex flex-col gap-lg w-full pb-xl">
      {/* Back & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <Link
          href="/admin/members"
          prefetch={false}
          className="text-on-surface-variant hover:text-on-surface flex items-center gap-xs font-label-md text-sm self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Members
        </Link>
        <div className="flex gap-sm self-end sm:self-auto">
          <Link
            href={`/admin/membership-history?search=${encodeURIComponent(member.phone)}`}
            prefetch={false}
            className="border border-[#323232] text-white hover:bg-surface-container-high font-bold rounded-xl px-lg py-3 transition-colors font-label-md text-sm flex items-center gap-xs cursor-pointer"
          >
            <History className="w-4 h-4" />
            History
          </Link>
          <Link
            href={`/admin/members/${member.id}/renew`}
            prefetch={false}
            className="bg-primary-container text-on-primary-container font-bold rounded-xl px-lg py-3 hover:bg-primary transition-all font-label-md text-sm flex items-center gap-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Renew Membership
          </Link>
          {/* <DeleteMemberButton memberId={member.id} memberName={member.name} /> */}
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Left Column: Member Card & Profile Details (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-lg">
          <div className="bg-[#181818] border border-[#323232] rounded-xl p-xl flex flex-col gap-lg">
            <div className="flex items-center justify-between border-b border-[#323232] pb-sm">
              <h3 className="font-headline-md text-lg font-bold text-white">
                Personal Information
              </h3>
              <Link
                href={`/admin/members/${member.id}/edit`}
                prefetch={false}
                className="text-primary hover:text-primary-container transition-colors font-label-md text-xs flex items-center gap-xs cursor-pointer font-bold"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Profile
              </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-lg items-center md:items-start text-center md:text-left relative">
              <div className="w-20 h-20 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-primary font-bold text-3xl uppercase shrink-0">
                {member.firstName.substring(0, 1)}{member.lastName.substring(0, 1)}
              </div>

              <div className="flex-grow flex flex-col gap-xs">
                <span className={`inline-flex items-center gap-xs px-sm py-xs rounded-full border text-xs font-semibold self-center md:self-start uppercase tracking-wider ${member.status === "ACTIVE"
                  ? "border-primary text-primary bg-primary/10"
                  : member.status === "EXPIRING_SOON"
                    ? "border-amber-500 text-amber-500 bg-amber-500/10"
                    : member.status === "EXPIRED"
                      ? "border-error text-error bg-error/10"
                      : "border-outline-variant text-on-surface-variant bg-surface-container"
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${member.status === "ACTIVE"
                    ? "bg-primary"
                    : member.status === "EXPIRING_SOON"
                      ? "bg-amber-500 animate-pulse"
                      : member.status === "EXPIRED"
                        ? "bg-error"
                        : "bg-on-surface-variant"
                    }`}></span>
                  {member.status === "EXPIRING_SOON" ? "EXPIRING SOON" : member.status === "UPCOMING" ? "COMING SOON" : member.status}
                </span>
                <h1 className="text-3xl font-extrabold text-white mt-xs capitalize">{member.name}</h1>
                {/* <p className="text-on-surface-variant text-sm">Member ID: {member.id}</p> */}
                <p className="text-on-surface-variant text-sm">Join Date: {new Date(member.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="flex flex-col gap-xs">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Phone Number</span>
                <div className="flex items-center gap-sm">
                  <span className="text-white text-sm flex items-center gap-xs">
                    <Phone className="w-4 h-4 text-primary-container" />
                    {member.phone}
                  </span>
                  <div className="flex items-center gap-xs">
                    <a
                      href={`tel:${member.phone}`}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface-container border border-outline-variant hover:bg-surface-container-high text-on-surface hover:text-white transition-colors cursor-pointer"
                      title="Call member"
                    >
                      <Phone className="w-3.5 h-3.5 text-primary" />
                    </a>
                    <a
                      href={member.phone.replace(/\D/g, '').length === 10 ? `https://wa.me/91${member.phone.replace(/\D/g, '')}` : `https://wa.me/${member.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 text-green-500 hover:text-green-400 transition-colors cursor-pointer"
                      title="WhatsApp message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Email Address</span>
                <div className="flex items-center gap-sm">
                  <span className="text-white text-sm flex items-center gap-xs">
                    <Mail className="w-4 h-4 text-primary-container" />
                    {member.email || "Not Provided"}
                  </span>
                  {member.email && (
                    <div className="flex items-center">
                      <a
                        href={`mailto:${member.email}`}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface-container border border-outline-variant hover:bg-surface-container-high text-on-surface hover:text-white transition-colors cursor-pointer"
                        title="Email member"
                      >
                        <Mail className="w-3.5 h-3.5 text-primary" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Gender</span>
                <span className="text-white text-sm flex items-center gap-xs">
                  <User className="w-4 h-4 text-primary-container" />
                  {member.gender}
                </span>
              </div>

              <div className="flex flex-col gap-xs">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Date of Birth</span>
                <div className="flex items-center gap-sm">
                  <span className="text-white text-sm flex items-center gap-xs">
                    <Calendar className="w-4 h-4 text-primary-container" />
                    {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : "Not Provided"}
                  </span>
                  {isBirthdayThisMonth && (
                    <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full border text-[10px] font-semibold whitespace-nowrap border-primary/30 text-primary bg-primary/10" title="Birthday this month!">
                      <Cake className="w-3 h-3 text-primary animate-pulse" />
                      Birthday this month
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-xs md:col-span-2">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Address</span>
                <span className="text-white text-sm flex items-center gap-xs">
                  <MapPin className="w-4 h-4 text-primary-container" />
                  {member.address || "Not Provided"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-lg">
              <h3 className="font-headline-md text-lg font-bold text-white border-b border-[#323232] pb-sm">
                Safety & Emergency
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="flex flex-col gap-xs">
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Emergency Contact</span>
                  <span className="text-white text-sm">{member.emergencyContact || "Not Provided"}</span>
                </div>

                <div className="flex flex-col gap-xs">
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Emergency Phone</span>
                  <span className="text-white text-sm">{member.emergencyPhone || "Not Provided"}</span>
                </div>

                <div className="flex flex-col gap-xs md:col-span-2">
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Internal Notes</span>
                  <p className="text-secondary text-sm bg-surface-container p-sm rounded-lg border border-outline-variant mt-xs min-h-[50px] whitespace-pre-line">
                    {member.notes || "No internal notes recorded."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active plan details & Couple group (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-lg">
          {/* Active Plan Summary Card */}
          <div className="bg-[#181818] border border-[#323232] rounded-xl p-xl flex flex-col gap-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <CreditCard className="w-12 h-12 text-[#F59E0B]/20" />
            </div>
            <span className="text-xs text-primary-container font-semibold uppercase tracking-widest">Membership</span>

            {latestMembership ? (() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const end = new Date(latestMembership.endDate);
              end.setHours(0, 0, 0, 0);
              const diffTime = end.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              return (
                <div className="flex flex-col gap-md mt-sm">
                  <h2 className="text-xl font-bold text-white border-b border-[#323232] pb-sm">
                    {latestMembership.membershipPlan?.name || latestMembership.customPlanName || "Custom Plan"}
                  </h2>

                  {/* Dates Section */}
                  <div className="grid grid-cols-2 gap-sm text-sm">
                    <div>
                      <span className="text-xs text-on-surface-variant uppercase font-semibold">Start Date</span>
                      <p className="text-white font-medium mt-xs">{formatDate(latestMembership.startDate)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant uppercase font-semibold">Expiry Date</span>
                      <p className="text-primary font-bold mt-xs">{formatDate(latestMembership.endDate)}</p>
                    </div>
                  </div>

                  {/* Remaining Days Warning/Status */}
                  {diffDays <= 5 ? (
                    <div className={`p-sm rounded-lg border text-xs font-semibold flex items-center gap-xs mt-sm ${diffDays < 0
                      ? "border-error text-error bg-error/10"
                      : diffDays === 0
                        ? "border-amber-500 text-amber-500 bg-amber-500/10 animate-pulse"
                        : "border-yellow-500 text-yellow-500 bg-yellow-500/10"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${diffDays < 0 ? "bg-error" : diffDays === 0 ? "bg-amber-500" : "bg-yellow-500"}`}></span>
                      {diffDays < 0
                        ? "Membership Expired"
                        : diffDays === 0
                          ? "Expires Today!"
                          : `Expires in ${diffDays} ${diffDays === 1 ? "day" : "days"}!`}
                    </div>
                  ) : (
                    <div className="p-sm rounded-lg border border-primary text-primary bg-primary/10 text-xs font-semibold flex items-center gap-xs mt-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {diffDays} days remaining
                    </div>
                  )}

                  {/* Details list styled like a receipt */}
                  <div className="border-t border-[#323232] pt-sm flex flex-col gap-xs text-sm">
                    <div className="flex justify-between items-center py-xs">
                      <span className="text-on-surface-variant">Plan Fee:</span>
                      <span className="text-white font-medium">₹{Number(latestMembership.amount).toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between items-center py-xs">
                      <span className="text-on-surface-variant">Registration Fee:</span>
                      <span className="text-white font-medium">₹{Number(latestMembership.registrationFee || 0).toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-dashed border-[#323232] py-sm mt-xs">
                      <span className="text-white font-semibold">Total Paid:</span>
                      <span className="text-xl font-extrabold text-primary">
                        ₹{(Number(latestMembership.amount) + Number(latestMembership.registrationFee || 0)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Metadata receipt footer */}
                  <div className="border-t border-[#323232] pt-md flex flex-col gap-sm text-xs text-on-surface-variant bg-surface-container/30 p-sm rounded-lg border border-outline-variant/30 text-[11px]">
                    <div className="flex justify-between">
                      <span>Payment Date:</span>
                      <span className="text-white font-medium">{formatDate(latestMembership.createdAt)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="text-white font-medium uppercase">{latestMembership.paymentMethod}</span>
                    </div>

                    {latestMembership.paymentReference && (
                      <div className="flex justify-between">
                        <span>Ref / Transaction ID:</span>
                        <span className="text-white font-medium truncate max-w-[180px]">{latestMembership.paymentReference}</span>
                      </div>
                    )}

                    {latestMembership.remarks && (
                      <div className="flex flex-col gap-xs mt-xs pt-xs border-t border-[#323232]/50">
                        <span className="font-semibold text-on-surface-variant">Remarks:</span>
                        <p className="text-white italic">{latestMembership.remarks}</p>
                      </div>
                    )}
                  </div>

                  {/* Receipt Action */}
                  <div className="flex justify-end pt-sm border-t border-[#323232]">
                    <ReceiptButton membershipId={latestMembership.id} />
                  </div>
                </div>
              );
            })() : (
              <p className="text-secondary text-sm mt-sm">No active memberships found. Register or renew membership to active account access.</p>
            )}
          </div>

          {/* Couple Group / Partner Card */}
          {partner && (
            <div className="bg-[#181818] border border-[#323232] rounded-xl p-xl flex flex-col gap-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Heart className="w-12 h-12 text-[#F59E0B]/20" />
              </div>
              <span className="text-xs text-primary-container font-semibold uppercase tracking-widest">Couple Group Partner</span>

              <div className="flex flex-col gap-sm mt-sm">
                <h3 className="text-lg font-bold text-white">{partner.firstName} {partner.lastName}</h3>
                <p className="text-secondary text-sm flex items-center gap-xs">
                  <Phone className="w-4 h-4" />
                  {partner.phone}
                </p>
                <Link
                  href={`/admin/members/${partner.id}`}
                  prefetch={false}
                  className="text-primary font-label-md text-xs hover:underline mt-sm self-start"
                >
                  View Partner Profile
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
