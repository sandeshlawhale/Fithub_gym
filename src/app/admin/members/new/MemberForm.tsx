"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createSingleMemberAction, createCoupleMemberAction, searchMembersAction } from "@/features/members/actions";
import { Gender, PaymentMethod, MemberType } from "@prisma/client";
import { Plus, Trash, Check, User, ArrowRight, ArrowLeft, Search, X } from "lucide-react";
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

interface MemberFormProps {
  plans: Plan[];
}

export default function MemberForm({ plans }: MemberFormProps) {
  const router = useRouter();
  const [memberType, setMemberType] = useState<MemberType>(MemberType.SINGLE);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // State for linking existing members
  const [existingMemberId, setExistingMemberId] = useState<string | null>(null);
  const [existingPartnerId, setExistingPartnerId] = useState<string | null>(null);

  // Search autocomplete states
  const [primarySearchQuery, setPrimarySearchQuery] = useState("");
  const [primarySearchResults, setPrimarySearchResults] = useState<any[]>([]);
  const [showPrimarySearchDropdown, setShowPrimarySearchDropdown] = useState(false);
  const [searchingPrimary, setSearchingPrimary] = useState(false);

  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");
  const [partnerSearchResults, setPartnerSearchResults] = useState<any[]>([]);
  const [showPartnerSearchDropdown, setShowPartnerSearchDropdown] = useState(false);
  const [searchingPartner, setSearchingPartner] = useState(false);

  // Filter plans based on selected type
  const availablePlans = plans.filter(p => p.memberType === memberType);

  // Form setup
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: Gender.MALE as Gender,
      email: "",
      dateOfBirth: "",
      address: "",
      emergencyContact: "",
      emergencyPhone: "",
      notes: "",

      // Partner fields (for Couple)
      partnerFirstName: "",
      partnerLastName: "",
      partnerPhone: "",
      partnerGender: Gender.FEMALE as Gender,
      partnerEmail: "",
      partnerDateOfBirth: "",
      partnerAddress: "",

      // Membership details
      membershipPlanId: "",
      customPlanName: "",
      amount: 0,
      registrationFee: 200, // Default fee
      paymentMethod: PaymentMethod.UPI as PaymentMethod,
      paymentReference: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      remarks: "",
    }
  });

  const selectedPlanId = watch("membershipPlanId");
  const selectedStartDate = watch("startDate");

  // Handle plan change to set default price & calculate end date
  const handlePlanChange = (planId: string) => {
    if (!planId) {
      setValue("amount", 0);
      setValue("endDate", "");
      return;
    }

    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setValue("amount", plan.price);

      // Calculate end date based on duration
      if (selectedStartDate) {
        const start = new Date(selectedStartDate);
        start.setMonth(start.getMonth() + plan.durationMonths);
        setValue("endDate", start.toISOString().split("T")[0]);
      }
    }
  };

  const handlePrimarySearch = async (query: string) => {
    setPrimarySearchQuery(query);
    if (query.trim().length < 2) {
      setPrimarySearchResults([]);
      setShowPrimarySearchDropdown(false);
      return;
    }
    setSearchingPrimary(true);
    try {
      const res = await searchMembersAction(query);
      if (res.success && res.data) {
        // Exclude partner if already linked
        const filtered = res.data.filter((m: any) => m.id !== existingPartnerId);
        setPrimarySearchResults(filtered);
        setShowPrimarySearchDropdown(true);
      }
    } catch (e) {
      console.error("Error searching primary member:", e);
    } finally {
      setSearchingPrimary(false);
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
        // Exclude primary if already linked
        const filtered = res.data.filter((m: any) => m.id !== existingMemberId);
        setPartnerSearchResults(filtered);
        setShowPartnerSearchDropdown(true);
      }
    } catch (e) {
      console.error("Error searching partner member:", e);
    } finally {
      setSearchingPartner(false);
    }
  };

  const linkPrimaryMember = (member: any) => {
    setExistingMemberId(member.id);
    setValue("firstName", member.firstName);
    setValue("lastName", member.lastName);
    setValue("phone", member.phone);
    setValue("gender", member.gender);
    setValue("email", member.email || "");
    setValue("dateOfBirth", member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : "");
    setValue("address", member.address || "");
    if (member.emergencyContact) setValue("emergencyContact", member.emergencyContact);
    if (member.emergencyPhone) setValue("emergencyPhone", member.emergencyPhone);
    if (member.notes) setValue("notes", member.notes);
    
    setPrimarySearchQuery("");
    setShowPrimarySearchDropdown(false);
  };

  const unlinkPrimaryMember = () => {
    setExistingMemberId(null);
    setValue("firstName", "");
    setValue("lastName", "");
    setValue("phone", "");
    setValue("gender", Gender.MALE);
    setValue("email", "");
    setValue("dateOfBirth", "");
    setValue("address", "");
  };

  const linkPartnerMember = (member: any) => {
    setExistingPartnerId(member.id);
    setValue("partnerFirstName", member.firstName);
    setValue("partnerLastName", member.lastName);
    setValue("partnerPhone", member.phone);
    setValue("partnerGender", member.gender);
    setValue("partnerEmail", member.email || "");
    setValue("partnerDateOfBirth", member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : "");
    setValue("partnerAddress", member.address || "");
    
    setPartnerSearchQuery("");
    setShowPartnerSearchDropdown(false);
  };

  const unlinkPartnerMember = () => {
    setExistingPartnerId(null);
    setValue("partnerFirstName", "");
    setValue("partnerLastName", "");
    setValue("partnerPhone", "");
    setValue("partnerGender", Gender.FEMALE);
    setValue("partnerEmail", "");
    setValue("partnerDateOfBirth", "");
    setValue("partnerAddress", "");
  };

  const onSubmit = async (data: any) => {
    setError(null);
    setLoading(true);

    try {
      if (memberType === MemberType.SINGLE) {
        const payload = {
          existingMemberId: existingMemberId || undefined,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          gender: data.gender,
          email: data.email || undefined,
          dateOfBirth: data.dateOfBirth || undefined,
          address: data.address || undefined,
          emergencyContact: data.emergencyContact || undefined,
          emergencyPhone: data.emergencyPhone || undefined,
          notes: data.notes || undefined,
          membershipPlanId: data.membershipPlanId || undefined,
          customPlanName: data.customPlanName || undefined,
          amount: Number(data.amount),
          registrationFee: Number(data.registrationFee),
          paymentMethod: data.paymentMethod,
          paymentReference: data.paymentReference || undefined,
          startDate: data.startDate,
          endDate: data.endDate,
          remarks: data.remarks || undefined,
        };

        const res = await createSingleMemberAction(payload);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess(true);
          setTimeout(() => router.push("/admin/members"), 1500);
        }
      } else {
        const payload = {
          existingMemberId: existingMemberId || undefined,
          existingPartnerId: existingPartnerId || undefined,
          memberOne: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            gender: data.gender,
            email: data.email || undefined,
            dateOfBirth: data.dateOfBirth || undefined,
            address: data.address || undefined,
          },
          memberTwo: {
            firstName: data.partnerFirstName,
            lastName: data.partnerLastName,
            phone: data.partnerPhone,
            gender: data.partnerGender,
            email: data.partnerEmail || undefined,
            dateOfBirth: data.partnerDateOfBirth || undefined,
            address: data.partnerAddress || undefined,
          },
          emergencyContact: data.emergencyContact || undefined,
          emergencyPhone: data.emergencyPhone || undefined,
          notes: data.notes || undefined,
          membershipPlanId: data.membershipPlanId || undefined,
          customPlanName: data.customPlanName || undefined,
          amount: Number(data.amount),
          registrationFee: Number(data.registrationFee),
          paymentMethod: data.paymentMethod,
          paymentReference: data.paymentReference || undefined,
          startDate: data.startDate,
          endDate: data.endDate,
          remarks: data.remarks || undefined,
        };

        const res = await createCoupleMemberAction(payload);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess(true);
          setTimeout(() => router.push("/admin/members"), 1500);
        }
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-lg pb-xl animate-fade-in">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer inline-flex items-center gap-1 text-xs text-secondary hover:text-white transition-colors mb-2"
        >
          <ArrowLeft size={13} />
          Back To Members
        </button>
        <h2 className="font-display text-3xl font-extrabold text-white uppercase tracking-tight">Register New Member</h2>
        <p className="text-secondary text-sm">Add a new single member or a couple membership to the system.</p>
      </div>

      {/* Member Type Selection Tabs */}
      <div className="flex border-b border-[#323232] w-full justify-start gap-4">
        <button
          type="button"
          onClick={() => {
            setMemberType(MemberType.SINGLE);
            setValue("membershipPlanId", "");
            setValue("amount", 0);
            setValue("endDate", "");
            unlinkPrimaryMember();
          }}
          className={`py-3 px-lg font-label-md text-sm font-bold border-b-2 cursor-pointer transition-colors ${memberType === MemberType.SINGLE ? "border-primary text-primary" : "border-transparent text-secondary hover:text-white"
            }`}
        >
          Single Member
        </button>
        <button
          type="button"
          onClick={() => {
            setMemberType(MemberType.COUPLE);
            setValue("membershipPlanId", "");
            setValue("amount", 0);
            setValue("endDate", "");
            unlinkPrimaryMember();
            unlinkPartnerMember();
          }}
          className={`py-3 px-lg font-label-md text-sm font-bold border-b-2 cursor-pointer transition-colors ${memberType === MemberType.COUPLE ? "border-primary text-primary" : "border-transparent text-secondary hover:text-white"
            }`}
        >
          Couple Membership
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
            Registration saved successfully! Redirecting...
          </div>
        )}

        {/* SECTION 1: Member Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {/* Primary Member */}
          <section className="bg-[#181818] border border-[#323232] rounded-xl p-lg flex flex-col gap-md">
            <h3 className="font-headline-md text-lg font-bold text-white flex items-center gap-xs">
              <User className="w-5 h-5 text-primary" />
              {memberType === MemberType.COUPLE ? "Primary Member Details" : "Member Details"}
            </h3>

            {/* Search autocomplete input */}
            <div className="relative">
              <label className="input-label mb-xs">Search Existing Member (Autofill)</label>
              <div className="relative">
                <input
                  type="text"
                  className="input-field h-[36px] text-xs py-1.5 pl-8"
                  placeholder="Type name or phone to search..."
                  value={primarySearchQuery}
                  onChange={(e) => handlePrimarySearch(e.target.value)}
                />
                <Search className="w-3.5 h-3.5 text-secondary absolute left-2.5 top-2.5" />
                {primarySearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setPrimarySearchQuery("");
                      setPrimarySearchResults([]);
                      setShowPrimarySearchDropdown(false);
                    }}
                    className="absolute right-2.5 top-2.5 text-secondary hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showPrimarySearchDropdown && primarySearchResults.length > 0 && (
                <ul className="absolute z-50 w-full mt-xs bg-[#1f1f1f] border border-[#323232] rounded-xl overflow-hidden max-h-[180px] overflow-y-auto shadow-2xl">
                  {primarySearchResults.map((m) => (
                    <li
                      key={m.id}
                      onClick={() => linkPrimaryMember(m)}
                      className="p-sm hover:bg-surface-container-high cursor-pointer border-b border-[#323232] last:border-0 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="text-white font-bold">{m.firstName} {m.lastName}</span>
                        <span className="text-xs text-secondary ml-sm">({m.phone})</span>
                      </div>
                      <span className="text-xs text-primary font-semibold">Select</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {existingMemberId && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-xs flex items-center justify-between text-xs text-primary font-semibold mt-xs">
                <span>Linked to existing member profile.</span>
                <button
                  type="button"
                  onClick={unlinkPrimaryMember}
                  className="text-error hover:underline cursor-pointer font-bold"
                >
                  Unlink
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-sm border-t border-[#323232]/50 pt-sm mt-xs">
              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="firstName">First Name</label>
                <input className="input-field h-[40px] text-sm py-2" id="firstName" {...register("firstName")} required />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="lastName">Last Name</label>
                <input className="input-field h-[40px] text-sm py-2" id="lastName" {...register("lastName")} required />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="input-label" htmlFor="phone">Phone Number</label>
              <input className="input-field h-[40px] text-sm py-2" id="phone" placeholder="+919876543210" {...register("phone")} required />
            </div>

            <div className="grid grid-cols-2 gap-sm">
              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="gender">Gender</label>
                <Select
                  value={watch("gender")}
                  onValueChange={(val) => setValue("gender", val as Gender)}
                >
                  <SelectTrigger className="h-[40px]">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Gender.MALE}>Male</SelectItem>
                    <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                    <SelectItem value={Gender.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="dateOfBirth">Date of Birth</label>
                <input className="input-field h-[40px] text-sm py-2 [color-scheme:dark]" id="dateOfBirth" type="date" {...register("dateOfBirth")} />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="input-label" htmlFor="email">Email Address</label>
              <input className="input-field h-[40px] text-sm py-2" id="email" type="email" placeholder="email@example.com" {...register("email")} />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="input-label" htmlFor="address">Street Address</label>
              <input className="input-field h-[40px] text-sm py-2" id="address" {...register("address")} />
            </div>
          </section>

          {/* Secondary Member (Only for Couple) */}
          {memberType === MemberType.COUPLE && (
            <section className="bg-[#181818] border border-[#323232] rounded-xl p-lg flex flex-col gap-md animate-fade-in">
              <h3 className="font-headline-md text-lg font-bold text-white flex items-center gap-xs">
                <User className="w-5 h-5 text-primary" />
                Partner Details
              </h3>

              {/* Search autocomplete input for partner */}
              <div className="relative">
                <label className="input-label mb-xs">Search Existing Member (Autofill)</label>
                <div className="relative">
                  <input
                    type="text"
                    className="input-field h-[36px] text-xs py-1.5 pl-8"
                    placeholder="Type name or phone to search..."
                    value={partnerSearchQuery}
                    onChange={(e) => handlePartnerSearch(e.target.value)}
                  />
                  <Search className="w-3.5 h-3.5 text-secondary absolute left-2.5 top-2.5" />
                  {partnerSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setPartnerSearchQuery("");
                        setPartnerSearchResults([]);
                        setShowPartnerSearchDropdown(false);
                      }}
                      className="absolute right-2.5 top-2.5 text-secondary hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Autocomplete Dropdown */}
                {showPartnerSearchDropdown && partnerSearchResults.length > 0 && (
                  <ul className="absolute z-50 w-full mt-xs bg-[#1f1f1f] border border-[#323232] rounded-xl overflow-hidden max-h-[180px] overflow-y-auto shadow-2xl">
                    {partnerSearchResults.map((m) => (
                      <li
                        key={m.id}
                        onClick={() => linkPartnerMember(m)}
                        className="p-sm hover:bg-surface-container-high cursor-pointer border-b border-[#323232] last:border-0 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="text-white font-bold">{m.firstName} {m.lastName}</span>
                          <span className="text-xs text-secondary ml-sm">({m.phone})</span>
                        </div>
                        <span className="text-xs text-primary font-semibold">Select</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {existingPartnerId && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-xs flex items-center justify-between text-xs text-primary font-semibold mt-xs">
                  <span>Linked to existing partner profile.</span>
                  <button
                    type="button"
                    onClick={unlinkPartnerMember}
                    className="text-error hover:underline cursor-pointer font-bold"
                  >
                    Unlink
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-sm border-t border-[#323232]/50 pt-sm mt-xs">
                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="partnerFirstName">First Name</label>
                  <input className="input-field h-[40px] text-sm py-2" id="partnerFirstName" {...register("partnerFirstName")} required />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="partnerLastName">Last Name</label>
                  <input className="input-field h-[40px] text-sm py-2" id="partnerLastName" {...register("partnerLastName")} required />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="partnerPhone">Phone Number</label>
                <input className="input-field h-[40px] text-sm py-2" id="partnerPhone" placeholder="+919876543211" {...register("partnerPhone")} required />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="partnerGender">Gender</label>
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
                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="partnerDateOfBirth">Date of Birth</label>
                  <input className="input-field h-[40px] text-sm py-2 [color-scheme:dark]" id="partnerDateOfBirth" type="date" {...register("partnerDateOfBirth")} />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="partnerEmail">Email Address</label>
                <input className="input-field h-[40px] text-sm py-2" id="partnerEmail" type="email" placeholder="partner@example.com" {...register("partnerEmail")} />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="partnerAddress">Street Address</label>
                <input className="input-field h-[40px] text-sm py-2" id="partnerAddress" {...register("partnerAddress")} />
              </div>
            </section>
          )}
        </div>

        {/* SECTION 2: Emergency Contact & Notes */}
        <section className="bg-[#181818] border border-[#323232] rounded-xl p-lg grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="flex flex-col gap-md">
            <h3 className="font-headline-md text-base font-bold text-white">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-sm">
              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="emergencyContact">Contact Name</label>
                <input className="input-field h-[40px] text-sm py-2" id="emergencyContact" {...register("emergencyContact")} />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="emergencyPhone">Contact Phone</label>
                <input className="input-field h-[40px] text-sm py-2" id="emergencyPhone" {...register("emergencyPhone")} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-xs">
            <h3 className="font-headline-md text-base font-bold text-white mb-xs">Internal Notes</h3>
            <textarea
              className="bg-[#181818] border border-[#323232] rounded-xl p-3 text-white placeholder:text-secondary focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-body-md text-sm resize-none flex-grow"
              id="notes"
              placeholder="Health conditions, weight goals, references..."
              {...register("notes")}
            />
          </div>
        </section>

        {/* SECTION 3: Membership Details */}
        <section className="bg-[#181818] border border-[#323232] rounded-xl p-lg flex flex-col gap-md">
          <h3 className="font-headline-md text-lg font-bold text-white">Membership Package</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
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
                  {availablePlans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} (₹{Number(p.price).toLocaleString("en-IN")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!selectedPlanId && (
              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="customPlanName">Custom Plan Name</label>
                <input className="input-field h-[40px] text-sm py-2" id="customPlanName" placeholder="e.g. Special Offer 2 Months" {...register("customPlanName")} />
              </div>
            )}

            <div className="flex flex-col gap-xs">
              <label className="input-label" htmlFor="amount">Plan Price (₹)</label>
              <input
                className="input-field h-[40px] text-sm py-2"
                id="amount"
                type="number"
                readOnly={!!selectedPlanId}
                {...register("amount")}
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="input-label" htmlFor="registrationFee">Registration Fee (₹)</label>
              <input className="input-field h-[40px] text-sm py-2" id="registrationFee" type="number" {...register("registrationFee")} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md border-t border-[#323232] pt-md mt-sm">
            <div className="flex flex-col gap-xs">
              <label className="input-label" htmlFor="startDate">Start Date</label>
              <input
                className="input-field h-[40px] text-sm py-2 [color-scheme:dark]"
                id="startDate"
                type="date"
                {...register("startDate")}
                onChange={(e) => {
                  setValue("startDate", e.target.value);
                  const planId = watch("membershipPlanId");
                  if (planId) {
                    const plan = plans.find(p => p.id === planId);
                    if (plan && e.target.value) {
                      const start = new Date(e.target.value);
                      start.setMonth(start.getMonth() + plan.durationMonths);
                      setValue("endDate", start.toISOString().split("T")[0]);
                    }
                  }
                }}
              />
            </div>

            {/* endDate computed automatically — not shown in UI */}
            <input type="hidden" {...register("endDate")} />

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
              <input className="input-field h-[40px] text-sm py-2" id="remarks" placeholder="Optional purchase notes" {...register("remarks")} />
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
            {loading ? "Registering..." : "Submit Registration"}
          </button>
        </div>
      </form>
    </div>
  );
}
