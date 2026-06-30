"use client";

import { useState, useEffect } from "react";
import { Building2, MessageSquare, Loader2, CheckCircle2, XCircle, X } from "lucide-react";
import { getSettingsAction, updateSettingsAction } from "@/features/settings/actions";

type Toast = { type: "success" | "error"; message: string } | null;

type Tab = "gym" | "whatsapp";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("gym");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Form states
  const [gymName, setGymName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine3, setAddressLine3] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [registrationFee, setRegistrationFee] = useState(200);
  const [expiryReminderDays, setExpiryReminderDays] = useState(5);
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialWhatsapp, setSocialWhatsapp] = useState("");
  const [socialGoogleMaps, setSocialGoogleMaps] = useState("");
  const [socialEmail, setSocialEmail] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappPhoneId, setWhatsappPhoneId] = useState("");
  const [whatsappToken, setWhatsappToken] = useState("");
  const [businessId, setBusinessId] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await getSettingsAction();
      if (res.error) {
        showToast("error", res.error);
      } else if (res.data) {
        const d = res.data;
        setGymName(d.gymName);
        setAddressLine1(d.addressLine1 || "");
        setAddressLine2(d.addressLine2 || "");
        setAddressLine3(d.addressLine3 || "");
        setPhoneNo(d.phoneNo || "");
        setRegistrationFee(d.registrationFee);
        setExpiryReminderDays(d.expiryReminderDays ?? 5);
        setSocialInstagram(d.socialInstagram || "");
        setSocialWhatsapp(d.socialWhatsapp || "");
        setSocialGoogleMaps(d.socialGoogleMaps || "");
        setSocialEmail(d.socialEmail || "");
        setTimezone(d.timezone);
        setWhatsappEnabled(d.whatsappEnabled);
        setWhatsappPhoneId(d.whatsappPhoneId || "");
        setWhatsappToken(d.whatsappToken || "");
        setBusinessId(d.businessId || "");
      }
    } catch (err: any) {
      showToast("error", err.message || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await updateSettingsAction({
        gymName,
        addressLine1,
        addressLine2,
        addressLine3,
        phoneNo,
        registrationFee,
        expiryReminderDays,
        socialInstagram: socialInstagram || null,
        socialWhatsapp: socialWhatsapp || null,
        socialGoogleMaps: socialGoogleMaps || null,
        socialEmail: socialEmail || null,
        timezone,
        whatsappEnabled,
        whatsappPhoneId: whatsappPhoneId || null,
        whatsappToken: whatsappToken || null,
        businessId: businessId || null,
      });

      console.log("[Settings] Server response:", res);

      if (res.error) {
        showToast("error", res.error);
      } else {
        showToast("success", "Settings saved successfully! All changes are now live.");
      }
    } catch (err: any) {
      console.error("[Settings] Client catch:", err);
      showToast("error", err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-lg w-full max-w-4xl mx-auto animate-pulse">
        {/* Header Skeleton */}
        <div>
          <div className="h-10 bg-[#181818] border border-[#323232] rounded-xl w-64 mb-sm"></div>
          <div className="h-5 bg-[#181818] border border-[#323232] rounded-lg w-full max-w-md"></div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex border-b border-[#323232] gap-sm mt-md pb-xs">
          <div className="h-10 bg-[#181818] border border-[#323232] rounded-lg w-36"></div>
          <div className="h-10 bg-[#181818] border border-[#323232] rounded-lg w-40"></div>
        </div>

        {/* Form Card Skeleton */}
        <div className="bg-[#181818] border border-[#323232] rounded-xl p-xl flex flex-col gap-md">
          <div className="h-6 bg-[#262626] rounded-md w-40 mb-md"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-xs">
              <div className="h-4 bg-[#262626] rounded-md w-24"></div>
              <div className="h-12 bg-[#262626] rounded-xl w-full"></div>
            </div>
          ))}
          <div className="h-12 bg-[#262626] rounded-xl w-32 mt-lg self-start"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg w-full max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="font-display text-4xl font-extrabold text-on-background uppercase tracking-tight">System Settings</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Configure gym preferences, contact details, fees, and integrations.</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-[#323232] gap-sm mt-md">
        <button
          type="button"
          onClick={() => setActiveTab("gym")}
          className={`flex items-center gap-xs pb-md px-md font-label-md text-sm cursor-pointer transition-colors border-b-2 ${activeTab === "gym"
            ? "border-primary text-primary font-bold"
            : "border-transparent text-secondary hover:text-white"
            }`}
        >
          <Building2 className="w-4 h-4" />
          General
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("whatsapp")}
          className={`flex items-center gap-xs pb-md px-md font-label-md text-sm cursor-pointer transition-colors border-b-2 ${activeTab === "whatsapp"
            ? "border-primary text-primary font-bold"
            : "border-transparent text-secondary hover:text-white"
            }`}
        >
          <MessageSquare className="w-4 h-4" />
          WhatsApp Integration
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md min-w-[320px] max-w-sm
            animate-[slideInRight_0.35s_cubic-bezier(0.16,1,0.3,1)_both]
            ${
              toast.type === "success"
                ? "bg-[#0d1f18]/95 border-[#10B981]/40 text-[#10B981]"
                : "bg-[#1f0d0d]/95 border-red-500/40 text-red-400"
            }`}
          style={{ boxShadow: toast.type === "success" ? "0 8px 32px rgba(16,185,129,0.15)" : "0 8px 32px rgba(239,68,68,0.15)" }}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">
              {toast.type === "success" ? "Changes Saved!" : "Save Failed"}
            </p>
            <p className="text-xs opacity-80 mt-0.5 leading-relaxed">{toast.message}</p>
            {/* Progress bar */}
            <div className={`mt-2 h-0.5 rounded-full ${
              toast.type === "success" ? "bg-[#10B981]/30" : "bg-red-500/30"
            }`}>
              <div
                className={`h-full rounded-full animate-[shrink_4s_linear_forwards] ${
                  toast.type === "success" ? "bg-[#10B981]" : "bg-red-500"
                }`}
              />
            </div>
          </div>
          <button
            onClick={() => setToast(null)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-[#181818] border border-[#323232] rounded-2xl p-lg md:p-xl flex flex-col gap-lg shadow-lg">
        {activeTab === "gym" ? (
          <div className="flex flex-col gap-xl">
            {/* 1st Section: Gym Info */}
            <div className="flex flex-col gap-md">
              <h3 className="text-primary font-display text-base font-bold uppercase tracking-wide border-b border-[#323232] pb-xs mb-sm">1. Gym Info</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs md:col-span-2">
                  <label className="input-label" htmlFor="gymName">Gym/Facility Name</label>
                  <input
                    id="gymName"
                    className="input-field h-[42px]"
                    type="text"
                    value={gymName}
                    onChange={(e) => setGymName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-xs md:col-span-2">
                  <label className="input-label" htmlFor="addressLine1">Address Line 1</label>
                  <input
                    id="addressLine1"
                    className="input-field h-[42px]"
                    type="text"
                    placeholder="e.g. Plot No. 6456, Ward No. 17, Opp. Govt. ITI"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="addressLine2">Address Line 2</label>
                  <input
                    id="addressLine2"
                    className="input-field h-[42px]"
                    type="text"
                    placeholder="e.g. Kalambha Road"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="addressLine3">Address Line 3 / City & Pin</label>
                  <input
                    id="addressLine3"
                    className="input-field h-[42px]"
                    type="text"
                    placeholder="e.g. Narkhed - 441304"
                    value={addressLine3}
                    onChange={(e) => setAddressLine3(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="phoneNo">Contact Phone Number</label>
                  <input
                    id="phoneNo"
                    className="input-field h-[42px]"
                    type="text"
                    placeholder="e.g. +91 87888 49529"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="timezone">Default Timezone</label>
                  <select
                    id="timezone"
                    className="input-field px-3 h-[42px] outline-none"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">Coordinated Universal Time (UTC)</option>
                    <option value="US/Eastern">US/Eastern (EST/EDT)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                  </select>
                  <p className="text-[11px] text-secondary">System-wide date conversions adapt to this zone.</p>
                </div>
              </div>
            </div>

            {/* 2nd Section: Membership Settings */}
            <div className="flex flex-col gap-md">
              <h3 className="text-primary font-display text-base font-bold uppercase tracking-wide border-b border-[#323232] pb-xs mb-sm">2. Membership Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="regFee">Default Registration Fee (₹)</label>
                  <input
                    id="regFee"
                    className="input-field h-[42px]"
                    type="number"
                    min={0}
                    value={registrationFee}
                    onChange={(e) => setRegistrationFee(Number(e.target.value))}
                    required
                  />
                  <p className="text-[11px] text-secondary">Fee charged only on new member registrations. Renewals are exempt.</p>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="expiryReminderDays">Expiry Reminder Days</label>
                  <input
                    id="expiryReminderDays"
                    className="input-field h-[42px]"
                    type="number"
                    min={1}
                    value={expiryReminderDays}
                    onChange={(e) => setExpiryReminderDays(Number(e.target.value))}
                    required
                  />
                  <p className="text-[11px] text-secondary">Days before membership expiration to display warnings and send alerts.</p>
                </div>
              </div>
            </div>

            {/* 3rd Section: Social Links */}
            <div className="flex flex-col gap-md">
              <h3 className="text-primary font-display text-base font-bold uppercase tracking-wide border-b border-[#323232] pb-xs mb-sm">3. Social Links & Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="socialInstagram">Instagram URL</label>
                  <input
                    id="socialInstagram"
                    className="input-field h-[42px]"
                    type="text"
                    placeholder="e.g. https://www.instagram.com/thefithubgym.narkhed"
                    value={socialInstagram}
                    onChange={(e) => setSocialInstagram(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="socialWhatsapp">WhatsApp URL/Number</label>
                  <input
                    id="socialWhatsapp"
                    className="input-field h-[42px]"
                    type="text"
                    placeholder="e.g. https://wa.me/918788849529"
                    value={socialWhatsapp}
                    onChange={(e) => setSocialWhatsapp(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="socialGoogleMaps">Google Maps Link</label>
                  <input
                    id="socialGoogleMaps"
                    className="input-field h-[42px]"
                    type="text"
                    placeholder="Google Maps Directions URL"
                    value={socialGoogleMaps}
                    onChange={(e) => setSocialGoogleMaps(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="input-label" htmlFor="socialEmail">Email Address</label>
                  <input
                    id="socialEmail"
                    className="input-field h-[42px]"
                    type="email"
                    placeholder="e.g. contact@fithub.com"
                    value={socialEmail}
                    onChange={(e) => setSocialEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-md">
            <div className="flex justify-between items-center border-b border-[#323232] pb-xs mb-md">
              <h3 className="text-white font-display text-lg font-bold uppercase tracking-wide">Meta Cloud Integration</h3>

              {/* Integration Switch Toggle */}
              <div className="flex items-center gap-xs">
                <span className="text-xs text-secondary">{whatsappEnabled ? "INTEGRATION ON" : "INTEGRATION OFF"}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappEnabled}
                    onChange={(e) => setWhatsappEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-secondary peer-checked:after:bg-primary after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>
            </div>

            <div className={`flex flex-col gap-md transition-opacity duration-200 ${whatsappEnabled ? "opacity-100" : "opacity-40"}`}>
              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="phoneId">WhatsApp Phone Number ID</label>
                <input
                  id="phoneId"
                  className="input-field h-[42px]"
                  type="text"
                  placeholder="e.g. 102938475612345"
                  value={whatsappPhoneId}
                  onChange={(e) => setWhatsappPhoneId(e.target.value)}
                  disabled={!whatsappEnabled}
                  required={whatsappEnabled}
                />
                <p className="text-[11px] text-secondary">Used in endpoint requests: graph.facebook.com/v19.0/&lt;phone_id&gt;/messages</p>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="bizId">WhatsApp Business Account ID</label>
                <input
                  id="bizId"
                  className="input-field h-[42px]"
                  type="text"
                  placeholder="e.g. 987654321098765"
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  disabled={!whatsappEnabled}
                  required={whatsappEnabled}
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="accessToken">Access Token (Permanent Bearer Token)</label>
                <input
                  id="accessToken"
                  className="input-field h-[42px]"
                  type="password"
                  placeholder="Paste Meta System User Access Token..."
                  value={whatsappToken}
                  onChange={(e) => setWhatsappToken(e.target.value)}
                  disabled={!whatsappEnabled}
                  required={whatsappEnabled}
                />
                <p className="text-[11px] text-secondary">Keep secure. Used as Authorization Bearer header.</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Action Buttons */}
        <div className="flex justify-end gap-md border-t border-[#323232] pt-lg mt-md">
          <button
            type="button"
            onClick={loadSettings}
            className="border border-[#323232] text-white px-lg py-sm rounded-xl hover:bg-[#181818] transition-colors text-xs font-semibold cursor-pointer"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-container text-on-primary-container px-lg py-sm rounded-xl hover:bg-primary transition-colors text-xs font-bold flex items-center gap-xs cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
