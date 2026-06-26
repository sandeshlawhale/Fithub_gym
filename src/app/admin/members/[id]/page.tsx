import Link from "next/link";
import { notFound } from "next/navigation";
import { MemberService } from "@/services/member.service";
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
  FileText
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function MemberDetailPage({ params }: PageProps) {
  const { id } = await params;
  const member = await MemberService.getMemberById(id);

  if (!member) {
    notFound();
  }

  const latestMembership = member.latestMembership;
  const partner = member.coupleGroup?.members[0] || null;

  return (
    <div className="flex flex-col gap-lg w-full pb-xl">
      {/* Back & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <Link
          href="/admin/members"
          className="text-on-surface-variant hover:text-on-surface flex items-center gap-xs font-label-md text-sm self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Members
        </Link>
        <div className="flex gap-sm self-end sm:self-auto">
          <Link
            href={`/admin/members/${member.id}/renew`}
            className="bg-primary-container text-on-primary-container font-bold rounded-xl px-lg py-3 hover:bg-primary transition-all font-label-md text-sm flex items-center gap-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Renew Membership
          </Link>
          <Link
            href={`/admin/members/${member.id}/edit`}
            className="border border-[#323232] text-white hover:bg-surface-container-high font-bold rounded-xl px-lg py-3 transition-colors font-label-md text-sm flex items-center gap-xs"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Link>
          {/* <DeleteMemberButton memberId={member.id} memberName={member.name} /> */}
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Left Column: Member Card & Profile Details (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-lg">
          {/* Profile Overview Card */}

          {/* Detailed Info Card */}
          <div className="bg-[#181818] border border-[#323232] rounded-xl p-xl flex flex-col gap-lg">
            <h3 className="font-headline-md text-lg font-bold text-white border-b border-[#323232] pb-sm">
              Personal Information
            </h3>

            <div className="flex flex-col md:flex-row gap-lg items-center md:items-start text-center md:text-left relative">
              <div className="w-20 h-20 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-primary font-bold text-3xl uppercase shrink-0">
                {member.firstName.substring(0, 1)}{member.lastName.substring(0, 1)}
              </div>

              <div className="flex-grow flex flex-col gap-xs">
                <span className={`inline-flex items-center gap-xs px-sm py-xs rounded-full border text-xs font-semibold self-center md:self-start ${member.status === "ACTIVE"
                  ? "border-primary text-primary bg-primary/10"
                  : member.status === "UPCOMING"
                    ? "border-primary-container text-primary-container bg-primary-container/10"
                    : member.status === "EXPIRED"
                      ? "border-error text-error bg-error/10"
                      : "border-outline-variant text-on-surface-variant bg-surface-container"
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${member.status === "ACTIVE"
                    ? "bg-primary"
                    : member.status === "UPCOMING"
                      ? "bg-primary-container"
                      : member.status === "EXPIRED"
                        ? "bg-error"
                        : "bg-on-surface-variant"
                    }`}></span>
                  {member.status}
                </span>
                <h1 className="text-3xl font-extrabold text-white mt-xs capitalize">{member.name}</h1>
                {/* <p className="text-on-surface-variant text-sm">Member ID: {member.id}</p> */}
                <p className="text-on-surface-variant text-sm">Join Date: {new Date(member.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="flex flex-col gap-xs">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Phone Number</span>
                <span className="text-white text-sm flex items-center gap-xs">
                  <Phone className="w-4 h-4 text-primary-container" />
                  {member.phone}
                </span>
              </div>

              <div className="flex flex-col gap-xs">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Email Address</span>
                <span className="text-white text-sm flex items-center gap-xs">
                  <Mail className="w-4 h-4 text-primary-container" />
                  {member.email || "Not Provided"}
                </span>
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
                <span className="text-white text-sm flex items-center gap-xs">
                  <Calendar className="w-4 h-4 text-primary-container" />
                  {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : "Not Provided"}
                </span>
              </div>

              <div className="flex flex-col gap-xs md:col-span-2">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Address</span>
                <span className="text-white text-sm flex items-center gap-xs">
                  <MapPin className="w-4 h-4 text-primary-container" />
                  {member.address || "Not Provided"}
                </span>
              </div>
            </div>
          </div>

          {/* Emergency Info Card */}
          <div className="bg-[#181818] border border-[#323232] rounded-xl p-xl flex flex-col gap-lg">
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
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Health / Internal Notes</span>
                <p className="text-secondary text-sm bg-surface-container p-sm rounded-lg border border-outline-variant mt-xs min-h-[50px] whitespace-pre-line">
                  {member.notes || "No internal notes recorded."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active plan details & Membership History (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-lg">
          {/* Active Plan Summary Card */}
          <div className="bg-[#181818] border border-[#323232] rounded-xl p-xl flex flex-col gap-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <CreditCard className="w-12 h-12 text-[#F59E0B]/20" />
            </div>
            <span className="text-xs text-primary-container font-semibold uppercase tracking-widest">Active Membership</span>

            {latestMembership ? (
              <div className="flex flex-col gap-md mt-sm">
                <h2 className="text-2xl font-bold text-white">
                  {latestMembership.membershipPlan?.name || latestMembership.customPlanName || "Custom Plan"}
                </h2>
                <div className="border-t border-[#323232] pt-md grid grid-cols-2 gap-sm">
                  <div>
                    <span className="text-xs text-on-surface-variant uppercase">Start Date</span>
                    <p className="text-white font-medium text-sm mt-xs">{new Date(latestMembership.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface-variant uppercase">Expiry Date</span>
                    <p className="text-primary font-bold text-sm mt-xs">{new Date(latestMembership.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="border-t border-[#323232] pt-md flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">Amount Paid:</span>
                  <span className="text-lg font-bold text-white">₹{Number(latestMembership.amount).toLocaleString("en-IN")}</span>
                </div>
              </div>
            ) : (
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
                  className="text-primary font-label-md text-xs hover:underline mt-sm self-start"
                >
                  View Partner Profile
                </Link>
              </div>
            </div>
          )}

          {/* Membership History Log */}
          <div className="bg-[#181818] border border-[#323232] rounded-xl p-xl flex flex-col gap-md">
            <h3 className="font-headline-md text-base font-bold text-white flex items-center gap-xs">
              <History className="w-5 h-5 text-primary" />
              Membership History
            </h3>

            <div className="flex flex-col gap-sm max-h-[350px] overflow-y-auto mt-sm pr-xs">
              {member.memberships.length === 0 ? (
                <p className="text-secondary text-sm text-center py-lg">No membership history available.</p>
              ) : (
                member.memberships.map((h) => (
                  <div key={h.id} className="bg-surface-container border border-outline-variant p-sm rounded-lg flex flex-col gap-xs">
                    <div className="flex justify-between items-start">
                      <span className="text-white font-bold text-sm truncate max-w-[150px]">
                        {h.membershipPlan?.name || h.customPlanName || "Custom Plan"}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${h.status === "ACTIVE"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : h.status === "UPCOMING"
                          ? "bg-primary-container/10 text-primary-container border-primary-container/20"
                          : "bg-error/10 text-error border-error/20"
                        }`}>
                        {h.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-on-surface-variant mt-sm">
                      <span>{new Date(h.startDate).toLocaleDateString()} to {new Date(h.endDate).toLocaleDateString()}</span>
                      <span className="font-semibold text-white">₹{Number(h.amount).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
