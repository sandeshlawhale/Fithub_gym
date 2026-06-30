"use client";

import { useState, useEffect } from "react";
import { createPlanAction, togglePlanAction, deletePlanAction, updatePlanAction } from "@/features/plans/actions";
import { MemberType } from "@prisma/client";
import { Plus, ToggleLeft, ToggleRight, Trash2, X, Pencil } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  memberType: MemberType;
  price: any; // Decimal
  durationMonths: number;
  isActive: boolean;
  description: string | null;
}

interface PlansListClientProps {
  plans: Plan[];
}

export default function PlansListClient({ plans }: PlansListClientProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setShowAddModal(true);
    }
  }, [searchParams]);

  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Split plans
  const singlePlans = plans.filter(p => p.memberType === MemberType.SINGLE);
  const couplePlans = plans.filter(p => p.memberType === MemberType.COUPLE);

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<MemberType>(MemberType.SINGLE);
  const [duration, setDuration] = useState(1);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const handleEditClick = (plan: Plan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setType(plan.memberType);
    setDuration(plan.durationMonths);
    setPrice(Number(plan.price));
    setDescription(plan.description || "");
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingPlan(null);
    setName("");
    setType(MemberType.SINGLE);
    setDuration(1);
    setPrice(0);
    setDescription("");
    setError(null);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (editingPlan) {
        const res = await updatePlanAction(editingPlan.id, {
          name,
          memberType: type,
          durationMonths: duration,
          price,
          description,
        });

        if (res.error) {
          setError(res.error);
        } else {
          handleCloseModal();
        }
      } else {
        const res = await createPlanAction({
          name,
          memberType: type,
          durationMonths: duration,
          price,
          description,
        });

        if (res.error) {
          setError(res.error);
        } else {
          handleCloseModal();
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    if (confirm(`Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this plan?`)) {
      const res = await togglePlanAction(id, !currentStatus);
      if (res.error) alert(res.error);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (confirm("Are you sure you want to archive this plan? It will be soft-deleted and hidden from registration options.")) {
      const res = await deletePlanAction(id);
      if (res.error) alert(res.error);
    }
  };

  return (
    <div className="flex flex-col gap-lg w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h2 className="font-display text-4xl font-extrabold text-on-background uppercase tracking-tight">Membership Plans</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Manage tiers, pricing, and access controls.</p>
        </div>
        <button
          onClick={() => {
            setEditingPlan(null);
            setShowAddModal(true);
          }}
          className="bg-primary-container text-on-primary-container font-label-md text-label-md font-bold px-lg py-sm rounded-xl flex items-center gap-sm hover:bg-primary transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add New Plan
        </button>
      </div>

      {/* Plans Section */}
      <div className="flex flex-col gap-xl">
        {/* Individual Plans */}
        <div>
          <h3 className="font-headline-md text-xl font-bold text-white pb-sm">Individual Plans</h3>
          <div className="bg-surface border border-outline-variant rounded-xl flex flex-col shadow-sm overflow-hidden w-full max-w-full">
            <div className="overflow-x-auto w-full max-w-full">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container border-b border-outline-variant">
                  <tr>
                    <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Name</th>
                    <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Duration</th>
                    <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Price</th>
                    <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold hidden md:table-cell">Description</th>
                    <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-body-md text-sm bg-surface">
                  {singlePlans.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-xl text-center text-on-surface-variant">
                        No individual plans configured.
                      </td>
                    </tr>
                  ) : (
                    singlePlans.map((plan) => (
                      <tr
                        key={plan.id}
                        className={`hover:bg-surface-container-lowest transition-colors ${!plan.isActive ? "opacity-60" : ""
                          }`}
                      >
                        <td className="py-md px-lg font-semibold text-white">
                          <div className="flex items-center gap-sm">
                            <span>{plan.name}</span>
                            {!plan.isActive && (
                              <span className="text-[10px] bg-error-container/20 text-error px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Inactive
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-md px-lg text-white">
                          {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'}
                        </td>
                        <td className="py-md px-lg text-white font-medium">
                          ₹{Number(plan.price).toLocaleString("en-IN")}
                        </td>
                        <td className="py-md px-lg text-secondary text-sm hidden md:table-cell max-w-xs truncate">
                          {plan.description || "No description provided."}
                        </td>
                        <td className="py-md px-lg text-right">
                          <div className="flex justify-end gap-sm items-center">
                            <button
                              onClick={() => handleEditClick(plan)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-highest text-on-surface hover:text-primary transition-colors cursor-pointer"
                              title="Edit Plan"
                            >
                              <Pencil className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => handleToggleActive(plan.id, plan.isActive)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-highest text-on-surface hover:text-primary transition-colors cursor-pointer"
                              title={plan.isActive ? "Deactivate" : "Activate"}
                            >
                              {plan.isActive ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5 text-secondary" />}
                            </button>
                            <button
                              onClick={() => handleDeletePlan(plan.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-highest text-on-surface hover:text-error transition-colors cursor-pointer"
                              title="Archive (Soft Delete)"
                            >
                              <Trash2 className="w-4 h-4 text-error" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Couple Plans */}
        <div>
          <h3 className="font-headline-md text-xl font-bold text-white pb-sm">Couple Plans</h3>
          <div className="bg-surface border border-outline-variant rounded-xl flex flex-col shadow-sm overflow-hidden w-full max-w-full">
            <div className="overflow-x-auto w-full max-w-full">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container border-b border-outline-variant">
                  <tr>
                    <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Name</th>
                    <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Duration</th>
                    <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Price</th>
                    <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold hidden md:table-cell">Description</th>
                    <th className="py-md px-lg font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-body-md text-sm bg-surface">
                  {couplePlans.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-xl text-center text-on-surface-variant">
                        No couple plans configured.
                      </td>
                    </tr>
                  ) : (
                    couplePlans.map((plan) => (
                      <tr
                        key={plan.id}
                        className={`hover:bg-surface-container-lowest transition-colors ${!plan.isActive ? "opacity-60" : ""
                          }`}
                      >
                        <td className="py-md px-lg font-semibold text-white">
                          <div className="flex items-center gap-sm">
                            <span>{plan.name}</span>
                            {!plan.isActive && (
                              <span className="text-[10px] bg-error-container/20 text-error px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Inactive
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-md px-lg text-white">
                          {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'}
                        </td>
                        <td className="py-md px-lg text-white font-medium">
                          ₹{Number(plan.price).toLocaleString("en-IN")}
                        </td>
                        <td className="py-md px-lg text-secondary text-sm hidden md:table-cell max-w-xs truncate">
                          {plan.description || "No description provided."}
                        </td>
                        <td className="py-md px-lg text-right">
                          <div className="flex justify-end gap-sm items-center">
                            <button
                              onClick={() => handleEditClick(plan)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-highest text-on-surface hover:text-primary transition-colors cursor-pointer"
                              title="Edit Plan"
                            >
                              <Pencil className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => handleToggleActive(plan.id, plan.isActive)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-highest text-on-surface hover:text-primary transition-colors cursor-pointer"
                              title={plan.isActive ? "Deactivate" : "Activate"}
                            >
                              {plan.isActive ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5 text-secondary" />}
                            </button>
                            <button
                              onClick={() => handleDeletePlan(plan.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-highest text-on-surface hover:text-error transition-colors cursor-pointer"
                              title="Archive (Soft Delete)"
                            >
                              <Trash2 className="w-4 h-4 text-error" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-md">
          <div className="bg-[#181818] border border-[#323232] rounded-xl p-lg md:p-xl w-full max-w-md relative flex flex-col gap-lg animate-fade-in">
            <button
              onClick={handleCloseModal}
              className="absolute top-md right-md text-on-surface-variant hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
                {editingPlan ? "Edit Plan" : "Create New Plan"}
              </h3>
              <p className="text-secondary text-sm mt-xs">
                {editingPlan ? "Update pricing tier details." : "Add a new pricing tier to the performance catalog."}
              </p>
            </div>

            {error && (
              <div className="bg-error-container/20 border border-error/30 text-error text-xs p-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSavePlan} className="flex flex-col gap-md">
              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="planName">Plan Name</label>
                <input
                  className="input-field h-[40px] text-sm py-2"
                  id="planName"
                  placeholder="e.g. Monthly Standard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="planType">Member Type</label>
                  <select
                    className="input-field h-[40px] text-sm py-2 px-3 outline-none"
                    id="planType"
                    value={type}
                    onChange={(e) => setType(e.target.value as MemberType)}
                  >
                    <option value={MemberType.SINGLE}>Single Member</option>
                    <option value={MemberType.COUPLE}>Couple Membership</option>
                  </select>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="planDuration">Duration (Months)</label>
                  <input
                    className="input-field h-[40px] text-sm py-2"
                    id="planDuration"
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="planPrice">Price (₹)</label>
                <input
                  className="input-field h-[40px] text-sm py-2"
                  id="planPrice"
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="planDesc">Description</label>
                <textarea
                  className="bg-[#181818] border border-[#323232] rounded-xl p-3 text-white placeholder:text-secondary focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-body-md text-sm resize-none h-20"
                  id="planDesc"
                  placeholder="Plan benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-on-primary-container font-bold py-3 rounded-xl hover:bg-primary transition-all font-label-md text-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? "Saving..." : editingPlan ? "Update Plan" : "Save Plan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
