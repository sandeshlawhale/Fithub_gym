"use client";

import { useState, useEffect } from "react";
import { Building2, Coins, MessageSquare, ShieldCheck, Loader2 } from "lucide-react";
import { getSettingsAction, updateSettingsAction } from "@/features/settings/actions";

type Tab = "gym" | "whatsapp";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("gym");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [gymName, setGymName] = useState("");
  const [registrationFee, setRegistrationFee] = useState(200);
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
    setError(null);
    try {
      const res = await getSettingsAction();
      if (res.error) {
        setError(res.error);
      } else if (res.data) {
        const d = res.data;
        setGymName(d.gymName);
        setRegistrationFee(d.registrationFee);
        setTimezone(d.timezone);
        setWhatsappEnabled(d.whatsappEnabled);
        setWhatsappPhoneId(d.whatsappPhoneId || "");
        setWhatsappToken(d.whatsappToken || "");
        setBusinessId(d.businessId || "");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const res = await updateSettingsAction({
        gymName,
        registrationFee,
        timezone,
        whatsappEnabled,
        whatsappPhoneId: whatsappPhoneId || null,
        whatsappToken: whatsappToken || null,
        businessId: businessId || null,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[500px]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-secondary text-sm mt-md font-body-md">Loading settings panel...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg w-full max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="font-display text-4xl font-extrabold text-on-background uppercase tracking-tight">System Settings</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Configure gym preferences, fees, and communication integrations.</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-[#323232] gap-sm mt-md">
        <button
          onClick={() => setActiveTab("gym")}
          className={`flex items-center gap-xs pb-md px-md font-label-md text-sm cursor-pointer transition-colors border-b-2 ${activeTab === "gym"
            ? "border-primary text-primary font-bold"
            : "border-transparent text-secondary hover:text-white"
            }`}
        >
          <Building2 className="w-4 h-4" />
          Gym Configuration
        </button>
        <button
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

      {/* Status Messages */}
      {error && (
        <div className="bg-error-container/20 border border-error/30 text-error text-xs p-sm rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-success-container/10 border border-[#10B981]/30 text-[#10B981] text-xs p-sm rounded-lg flex items-center gap-xs">
          <ShieldCheck className="w-4 h-4" />
          Settings successfully saved!
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-[#181818] border border-[#323232] rounded-2xl p-lg md:p-xl flex flex-col gap-lg shadow-lg">
        {activeTab === "gym" ? (
          <div className="flex flex-col gap-md">
            <div>
              <h3 className="text-white font-display text-lg font-bold uppercase tracking-wide border-b border-[#323232] pb-xs mb-md">General Info</h3>
            </div>

            <div className="flex flex-col gap-xs">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="flex flex-col gap-xs">
                <label className="input-label" htmlFor="regFee">Default Registration Fee (₹)</label>
                <div className="relative flex items-center">
                  {/* <Coins className="absolute left-3 w-4 h-4 text-secondary" /> */}
                  <input
                    id="regFee"
                    className="input-field h-[42px]"
                    type="number"
                    min={0}
                    value={registrationFee}
                    onChange={(e) => setRegistrationFee(Number(e.target.value))}
                    required
                  />
                </div>
                <p className="text-[11px] text-secondary">Fee charged only on new member registrations. Renewals are exempt.</p>
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
              "Save Settings"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
