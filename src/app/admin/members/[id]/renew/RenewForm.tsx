"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { renewMembershipAction } from "@/features/members/actions";
import { PaymentMethod, MemberType } from "@prisma/client";
import { Check, ArrowLeft, Calendar, CreditCard } from "lucide-react";
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

  // Business Rule: Couple memberships only display couple plans, single memberships only single plans.
  const isCouple = !!member.coupleGroupId;
  const filteredPlans = plans.filter(p => p.memberType === (isCouple ? MemberType.COUPLE : MemberType.SINGLE));

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

  const onSubmit = async (data: any) => {
    setError(null);
    setLoading(true);

    try {
      const payload = {
        membershipPlanId: data.membershipPlanId || undefined,
        customPlanName: data.customPlanName || undefined,
        customPlanDuration: !data.membershipPlanId ? Number(data.customPlanDuration) : undefined,
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod,
        paymentReference: data.paymentReference || undefined,
        startDate: data.startDate,
        remarks: data.remarks || undefined,
      };

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
    <div className="max-w-2xl mx-auto flex flex-col gap-lg pb-xl">
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
          {isCouple && <span className="text-primary-container font-semibold"> (Couple plan renewal will apply to both linked members)</span>}
        </p>
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
