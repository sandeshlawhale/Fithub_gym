"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { renewMembershipAction, searchMembersAction } from "@/features/members/actions";
import { PaymentMethod, MemberType, Gender } from "@prisma/client";
import { Check, ArrowLeft, Calendar, CreditCard, Heart, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Plan {
  id: string;
  name: string;
  memberType: MemberType;
  price: number;
  durationMonths: number;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  coupleGroupId?: string | null;
  partner?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
  latestMembership?: {
    endDate: Date;
  } | null;
}

interface RenewFormProps {
  member: Member;
  plans: Plan[];
}

export default function RenewForm({ member, plans }: RenewFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Selection of Single vs Couple renewal
  const [renewType, setRenewType] = useState<MemberType>(
    member.coupleGroupId ? MemberType.COUPLE : MemberType.SINGLE
  );

  // Partner options: 'previous', 'existing', 'new'
  const [partnerOption, setPartnerOption] = useState<"previous" | "existing" | "new">(
    member.partner ? "previous" : "existing"
  );

  // If linking an existing member as partner
  const [selectedPartner, setSelectedPartner] = useState<{ id: string; firstName: string; lastName: string; phone: string } | null>(
    member.partner || null
  );

  // Search autocomplete state for existing partner search
  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");
  const [partnerSearchResults, setPartnerSearchResults] = useState<any[]>([]);
  const [showPartnerSearchDropdown, setShowPartnerSearchDropdown] = useState(false);
  const [searchingPartner, setSearchingPartner] = useState(false);

  // Filter plans based on selected type
  const filteredPlans = plans.filter(p => p.memberType === renewType);

  // Determine logical default start date (day after current membership ends, or today)
  let defaultStartDate = new Date();
  if (member.latestMembership?.endDate) {
    const expiry = new Date(member.latestMembership.endDate);
    if (expiry >= defaultStartDate) {
      defaultStartDate = new Date(expiry);
      defaultStartDate.setDate(expiry.getDate() + 1);
    }
  }
  const defaultStartDateStr = defaultStartDate.toISOString().split("T")[0];

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      membershipPlanId: "",
      customPlanName: "",
      customPlanDuration: 1,
      amount: 0,
      paymentMethod: PaymentMethod.UPI as PaymentMethod,
      paymentReference: "",
      startDate: defaultStartDateStr,
      remarks: "",
      // New Partner fields
      partnerFirstName: "",
      partnerLastName: "",
      partnerPhone: "",
      partnerGender: Gender.FEMALE as Gender,
      partnerEmail: "",
      partnerAddress: "",
    }
  });

  const selectedPlanId = watch("membershipPlanId");
  const selectedStartDate = watch("startDate");

  const handlePlanChange = (planId: string) => {
    if (!planId) {
      setValue("amount", 0);
      return;
    }

    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setValue("amount", plan.price);
    }
  };

  const handlePartnerSearch = async (query: string) => {
    setPartnerSearchQuery(query);
    if (query.trim().length < 2) {
      setPartnerSearchResults([]);
      setShowPartnerSearchDropdown(false);
      return;
    }
    setSearchingPartner(true);
    try {
      const res = await searchMembersAction(query);
      if (res.success && res.data) {
        // Exclude the current member and current partner from search results
        const filtered = res.data.filter((m: any) => m.id !== member.id);
        setPartnerSearchResults(filtered);
        setShowPartnerSearchDropdown(true);
      }
    } catch (e) {
      console.error("Error searching members:", e);
    } finally {
      setSearchingPartner(false);
    }
  };

  const onSubmit = async (data: any) => {
    setError(null);
    setLoading(true);

    try {
      const payload: any = {
        renewType,
        membershipPlanId: data.membershipPlanId || undefined,
        customPlanName: data.customPlanName || undefined,
        customPlanDuration: !data.membershipPlanId ? Number(data.customPlanDuration) : undefined,
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod,
        paymentReference: data.paymentReference || undefined,
        startDate: data.startDate,
        remarks: data.remarks || undefined,
      };

      if (renewType === MemberType.COUPLE) {
        payload.partnerOption = partnerOption;
        if (partnerOption === "previous") {
          // Keep previous partner; backend knows previous partner from the couple group
        } else if (partnerOption === "existing") {
          if (!selectedPartner) {
            throw new Error("Please select an existing member as partner.");
          }
          payload.partnerMemberId = selectedPartner.id;
        } else if (partnerOption === "new") {
          payload.partnerDetails = {
            firstName: data.partnerFirstName,
            lastName: data.partnerLastName,
            phone: data.partnerPhone,
            gender: data.partnerGender,
            email: data.partnerEmail || undefined,
            address: data.partnerAddress || undefined,
          };
        }
      }

      const res = await renewMembershipAction(member.id, payload);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push(`/admin/members/${member.id}`), 1500);
      }
    } catch (e: any) {
      setError(e.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-lg pb-xl animate-fade-in">
      {/* Back Header */}
      <button 
        type="button" 
        onClick={() => router.back()}
        className="text-on-surface-variant hover:text-on-surface flex items-center gap-xs font-label-md text-sm self-start cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Member Profile
      </button>

      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-extrabold text-white uppercase tracking-tight">Renew Membership</h2>
        <p className="text-secondary text-sm">
          Create a new membership record for <span className="text-white font-bold">{member.firstName} {member.lastName}</span>.
        </p>
      </div>

      {/* Membership Type Selection Tabs */}
      <div className="flex border-b border-[#323232] w-full justify-start gap-4">
        <button
          type="button"
          onClick={() => {
            setRenewType(MemberType.SINGLE);
            setValue("membershipPlanId", "");
            setValue("amount", 0);
          }}
          className={`py-3 px-lg font-label-md text-sm font-bold border-b-2 cursor-pointer transition-colors ${
            renewType === MemberType.SINGLE ? "border-primary text-primary" : "border-transparent text-secondary hover:text-white"
          }`}
        >
          Renew as Single Member
        </button>
        <button
          type="button"
          onClick={() => {
            setRenewType(MemberType.COUPLE);
            setValue("membershipPlanId", "");
            setValue("amount", 0);
          }}
          className={`py-3 px-lg font-label-md text-sm font-bold border-b-2 cursor-pointer transition-colors ${
            renewType === MemberType.COUPLE ? "border-primary text-primary" : "border-transparent text-secondary hover:text-white"
          }`}
        >
          Renew as Couple Member
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-xl">
        {error && (
          <div className="bg-error-container/20 border border-error/30 text-error text-sm p-md rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-sm p-md rounded-xl flex items-center gap-sm">
            <Check className="w-5 h-5" />
            Membership renewed successfully! Redirecting...
          </div>
        )}

        {/* Partner Section (Only for Couple Renewal) */}
        {renewType === MemberType.COUPLE && (
          <section className="bg-[#181818] border border-[#323232] rounded-xl p-lg flex flex-col gap-md">
            <h3 className="font-headline-md text-lg font-bold text-white flex items-center gap-xs">
              <Heart className="w-5 h-5 text-primary animate-pulse" />
              Partner Configuration
            </h3>

            {/* Selection Options */}
            <div className="flex flex-wrap gap-2 border-b border-[#323232] pb-sm">
              {member.partner && (
                <button
                  type="button"
                  onClick={() => {
                    setPartnerOption("previous");
                    setSelectedPartner(member.partner || null);
                  }}
                  className={`px-md py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    partnerOption === "previous" ? "bg-primary/10 border-primary text-primary" : "border-[#323232] text-secondary hover:text-white"
                  }`}
                >
                  Use Previous Partner ({member.partner.firstName})
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setPartnerOption("existing");
                  if (partnerOption === "previous") setSelectedPartner(null);
                }}
                className={`px-md py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  partnerOption === "existing" ? "bg-primary/10 border-primary text-primary" : "border-[#323232] text-secondary hover:text-white"
                }`}
              >
                Choose Existing Member
              </button>
              <button
                type="button"
                onClick={() => setPartnerOption("new")}
                className={`px-md py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  partnerOption === "new" ? "bg-primary/10 border-primary text-primary" : "border-[#323232] text-secondary hover:text-white"
                }`}
              >
                Register New Member
              </button>
            </div>

            {/* PREVIOUS PARTNER */}
            {partnerOption === "previous" && member.partner && (
              <div className="p-md rounded-xl bg-surface-container border border-outline-variant flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-sm">{member.partner.firstName} {member.partner.lastName}</p>
                  <p className="text-xs text-secondary mt-xs">{member.partner.phone}</p>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-sm py-xs rounded-full border border-primary/20">
                  Linked (Payer Partner)
                </span>
              </div>
            )}

            {/* EXISTING MEMBER SEARCH */}
            {partnerOption === "existing" && (
              <div className="flex flex-col gap-sm">
                {selectedPartner ? (
                  <div className="p-md rounded-xl bg-surface-container border border-outline-variant flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-sm">{selectedPartner.firstName} {selectedPartner.lastName}</p>
                      <p className="text-xs text-secondary mt-xs">{selectedPartner.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPartner(null)}
                      className="text-xs text-error hover:underline cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <label className="input-label mb-xs">Search Partner Name or Phone</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="input-field h-[40px] text-sm py-2 pl-9"
                        placeholder="Type at least 2 characters to search..."
                        value={partnerSearchQuery}
                        onChange={(e) => handlePartnerSearch(e.target.value)}
                      />
                      <Search className="w-4 h-4 text-secondary absolute left-3 top-3" />
                      {partnerSearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setPartnerSearchQuery("");
                            setPartnerSearchResults([]);
                            setShowPartnerSearchDropdown(false);
                          }}
                          className="absolute right-3 top-3 text-secondary hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Results Dropdown */}
                    {showPartnerSearchDropdown && partnerSearchResults.length > 0 && (
                      <ul className="absolute z-50 w-full mt-xs bg-[#1f1f1f] border border-[#323232] rounded-xl overflow-hidden max-h-[200px] overflow-y-auto shadow-2xl">
                        {partnerSearchResults.map((p) => (
                          <li
                            key={p.id}
                            onClick={() => {
                              setSelectedPartner({ id: p.id, firstName: p.firstName, lastName: p.lastName, phone: p.phone });
                              setShowPartnerSearchDropdown(false);
                              setPartnerSearchQuery("");
                            }}
                            className="p-sm hover:bg-surface-container-high cursor-pointer border-b border-[#323232] last:border-0 flex items-center justify-between text-sm"
                          >
                            <div>
                              <span className="text-white font-bold">{p.firstName} {p.lastName}</span>
                              <span className="text-xs text-secondary ml-sm">({p.phone})</span>
                            </div>
                            <span className="text-xs text-primary font-semibold">Select</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {showPartnerSearchDropdown && partnerSearchResults.length === 0 && partnerSearchQuery.trim().length >= 2 && !searchingPartner && (
                      <div className="absolute z-50 w-full mt-xs bg-[#1f1f1f] border border-[#323232] rounded-xl p-md text-sm text-secondary shadow-2xl">
                        No members found matching "{partnerSearchQuery}".
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* NEW PARTNER DETAILS */}
            {partnerOption === "new" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md animate-fade-in border-t border-[#323232]/50 pt-sm">
                <div className="grid grid-cols-2 gap-sm md:col-span-2">
                  <div className="flex flex-col gap-xs">
                    <label className="input-label" htmlFor="partnerFirstName">Partner First Name</label>
                    <input className="input-field h-[40px] text-sm py-2" id="partnerFirstName" {...register("partnerFirstName", { required: partnerOption === "new" })} />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="input-label" htmlFor="partnerLastName">Partner Last Name</label>
                    <input className="input-field h-[40px] text-sm py-2" id="partnerLastName" {...register("partnerLastName", { required: partnerOption === "new" })} />
                  </div>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="partnerPhone">Partner Phone Number</label>
                  <input className="input-field h-[40px] text-sm py-2" id="partnerPhone" placeholder="+919876543211" {...register("partnerPhone", { required: partnerOption === "new" })} />
                </div>

                <div className="grid grid-cols-2 gap-sm">
                  <div className="flex flex-col gap-xs">
                    <label className="input-label" htmlFor="partnerGender">Partner Gender</label>
                    <Select
                      value={watch("partnerGender")}
                      onValueChange={(val) => setValue("partnerGender", val as Gender)}
                    >
                      <SelectTrigger className="h-[40px]">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                        <SelectItem value={Gender.MALE}>Male</SelectItem>
                        <SelectItem value={Gender.OTHER}>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-xs font-label-md">
                    <label className="input-label" htmlFor="partnerEmail">Partner Email</label>
                    <input className="input-field h-[40px] text-sm py-2" id="partnerEmail" type="email" placeholder="email@example.com" {...register("partnerEmail")} />
                  </div>
                </div>

                <div className="flex flex-col gap-xs md:col-span-2">
                  <label className="input-label" htmlFor="partnerAddress">Partner Street Address</label>
                  <input className="input-field h-[40px] text-sm py-2" id="partnerAddress" {...register("partnerAddress")} />
                </div>
              </div>
            )}
          </section>
        )}

        {/* Renewal Details section */}
        <section className="bg-[#181818] border border-[#323232] rounded-xl p-lg flex flex-col gap-md">
          <h3 className="font-headline-md text-lg font-bold text-white flex items-center gap-xs">
            <CreditCard className="w-5 h-5 text-primary" />
            Membership Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="flex flex-col gap-xs">
              <label className="input-label" htmlFor="membershipPlanId">Select Package Plan</label>
              <Select
                value={watch("membershipPlanId") || "custom"}
                onValueChange={(val) => {
                  const finalVal = val === "custom" ? "" : val;
                  setValue("membershipPlanId", finalVal);
                  handlePlanChange(finalVal);
                }}
              >
                <SelectTrigger className="h-[40px]">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">-- Custom Plan (No Template) --</SelectItem>
                  {filteredPlans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} (₹{Number(p.price).toLocaleString("en-IN")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!selectedPlanId && (
              <>
                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="customPlanName">Custom Plan Name</label>
                  <input 
                    className="input-field h-[40px] text-sm py-2" 
                    id="customPlanName" 
                    placeholder="e.g. Special Offer 2 Months" 
                    {...register("customPlanName")} 
                    required={!selectedPlanId}
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="customPlanDuration">Duration (Months)</label>
                  <input 
                    className="input-field h-[40px] text-sm py-2" 
                    id="customPlanDuration" 
                    type="number"
                    min={1}
                    placeholder="e.g. 1" 
                    {...register("customPlanDuration")} 
                    required={!selectedPlanId}
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-xs">
              <label className="input-label" htmlFor="amount">Renewal Price (₹)</label>
              <input 
                className="input-field h-[40px] text-sm py-2" 
                id="amount" 
                type="number" 
                readOnly={!!selectedPlanId}
                {...register("amount")}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md border-t border-[#323232] pt-md mt-sm">
            <div className="flex flex-col gap-xs">
              <label className="input-label" htmlFor="startDate">Start Date</label>
              <input className="input-field h-[40px] text-sm py-2" id="startDate" type="date" {...register("startDate")} required />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="input-label" htmlFor="paymentMethod">Payment Method</label>
              <Select
                value={watch("paymentMethod")}
                onValueChange={(val) => setValue("paymentMethod", val as PaymentMethod)}
              >
                <SelectTrigger className="h-[40px]">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentMethod.UPI}>UPI (GPay / PhonePe / Paytm)</SelectItem>
                  <SelectItem value={PaymentMethod.CASH}>Cash Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="input-label" htmlFor="paymentReference">Payment Reference / Transaction ID</label>
              <input className="input-field h-[40px] text-sm py-2" id="paymentReference" placeholder="e.g. UPI Ref Number" {...register("paymentReference")} />
            </div>

            <div className="flex flex-col gap-xs md:col-span-2">
              <label className="input-label" htmlFor="remarks">Remarks</label>
              <input className="input-field h-[40px] text-sm py-2" id="remarks" placeholder="Optional remarks" {...register("remarks")} />
            </div>
          </div>
        </section>

        {/* Submit Actions */}
        <div className="flex gap-md justify-end">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="border border-[#323232] text-white font-bold rounded-xl px-lg py-3 hover:bg-surface-container-high transition-colors font-label-md text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button 
            disabled={loading}
            className="bg-primary-container text-on-primary-container font-bold rounded-xl px-2xl py-3 hover:bg-primary transition-all font-label-md text-sm disabled:opacity-50 cursor-pointer"
            type="submit"
          >
            {loading ? "Renewing..." : "Submit Renewal"}
          </button>
        </div>
      </form>
    </div>
  );
}
