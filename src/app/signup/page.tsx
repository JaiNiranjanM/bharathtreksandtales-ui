"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, MapPin, Loader2, Compass, Store, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/services/authService";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { countries, getDialByCountryName } from "@/lib/countries";
import { isValidAadhaar } from "@/lib/aadhaar";

const roles: { id: "user" | "vendor" | "guide"; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; desc: string }[] = [
  { id: "user", label: "Traveller", icon: Compass, desc: "Book trips & explore" },
  { id: "vendor", label: "Vendor", icon: Store, desc: "List properties & services" },
  { id: "guide", label: "Guide", icon: Navigation, desc: "Lead groups & share expertise" },
];

const TRAVEL_INTERESTS = ["Treks & Hikes", "Temples & Yatras", "Camping", "Wildlife", "Heritage", "Beaches", "Couple Getaways", "Family Trips"];
const FITNESS_LEVELS = [
  { id: "beginner", label: "Beginner", desc: "Easy trails & short trips" },
  { id: "moderate", label: "Moderate", desc: "Full-day treks" },
  { id: "experienced", label: "Experienced", desc: "Multi-day & difficult" },
];
const BUSINESS_TYPES = [
  { id: "stay", label: "Stay" },
  { id: "transport", label: "Transport" },
  { id: "food", label: "Food" },
  { id: "activity", label: "Activity" },
  { id: "other", label: "Other" },
];
const LANGUAGES = ["English", "Hindi", "Tamil", "Kannada", "Telugu", "Malayalam", "Marathi", "Bengali"];
const SPECIALIZATIONS = ["Treks", "Temples & Yatras", "Wildlife", "Heritage", "Camping", "Photography"];

const inputCls = "w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] px-4 py-3 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60";
const labelCls = "mb-1.5 block text-sm font-medium text-[#14181f]";

function toggleList(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function splitRegions(raw: string): string[] {
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
        active ? "border-[#ea580c] bg-[#ea580c]/10 text-[#ea580c]" : "border-[#14181f]/10 text-[#14181f]/70 hover:border-[#14181f]/25"
      )}
    >
      {children}
    </button>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAppStore((s) => s.setAuth);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  // Step 1: role (role-first)
  const [role, setRole] = useState<"user" | "vendor" | "guide">("user");
  // Step 2: account
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Step 3: contact (shared)
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("+91");
  const [country, setCountry] = useState("India");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  // Step 3: traveller
  const [interests, setInterests] = useState<string[]>([]);
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  // Step 3: vendor
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [serviceRegions, setServiceRegions] = useState("");
  const [capacity, setCapacity] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [taxId, setTaxId] = useState("");
  // Step 3: guide
  const [yearsExperience, setYearsExperience] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [operatingRegions, setOperatingRegions] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleAccountNext(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setStep(3);
  }

  function handleCountryChange(name: string) {
    setCountry(name);
    setPhoneCode(getDialByCountryName(name));
  }

  function validateRoleFields(): string | null {
    if (role === "user") {
      if (interests.length === 0) return "Pick at least one travel interest.";
      if (!fitnessLevel) return "Select your fitness level.";
      if (!emergencyName.trim() || !emergencyPhone.trim()) return "Emergency contact name and phone are required.";
      return null;
    }
    if (role === "vendor") {
      if (!businessName.trim()) return "Business name is required.";
      if (!businessType) return "Select your business type.";
      const y = Number(yearsInBusiness);
      if (yearsInBusiness === "" || Number.isNaN(y) || y < 0) return "Enter valid years in business.";
      if (splitRegions(serviceRegions).length === 0) return "Add at least one service region (comma-separated).";
      const c = Number(capacity);
      if (capacity === "" || Number.isNaN(c) || c < 1) return "Enter a valid capacity (min 1).";
      if (taxId.trim().length < 4) return "Tax / registration ID is required (min 4 characters).";
      return null;
    }
    // guide
    const y = Number(yearsExperience);
    if (yearsExperience === "" || Number.isNaN(y) || y < 0) return "Enter valid years of experience.";
    if (languages.length === 0) return "Pick at least one language.";
    if (specializations.length === 0) return "Pick at least one specialization.";
    if (splitRegions(operatingRegions).length === 0) return "Add at least one operating region (comma-separated).";
    return null;
  }

  function buildProfileData(): Record<string, unknown> {
    if (role === "vendor") {
      return {
        businessName: businessName.trim(),
        businessType,
        yearsInBusiness: Number(yearsInBusiness),
        serviceRegions: splitRegions(serviceRegions),
        capacity: Number(capacity),
        priceRange: priceRange.trim(),
        taxId: taxId.trim(),
      };
    }
    if (role === "guide") {
      return {
        yearsExperience: Number(yearsExperience),
        languages,
        specializations,
        operatingRegions: splitRegions(operatingRegions),
      };
    }
    return {
      interests,
      fitnessLevel,
      medicalInfo: medicalInfo.trim(),
      emergencyName: emergencyName.trim(),
      emergencyPhone: emergencyPhone.trim(),
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (aadhaar.trim() && !isValidAadhaar(aadhaar.trim())) {
      setError("Invalid Aadhaar number — must be 12 digits.");
      return;
    }
    const roleError = validateRoleFields();
    if (roleError) {
      setError(roleError);
      return;
    }
    setLoading(true);

    try {
      const res = await registerUser({
        name, email, password, role,
        phone, phoneCode, location, country, bio,
        aadhaar: aadhaar.trim() || undefined,
        profileData: buildProfileData(),
      });
      setAuth(res.user, res.token);
      document.cookie = `btt_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const roleLabel = roles.find((r) => r.id === role)?.label ?? "Traveller";

  return (
    <div data-theme="light" className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-xl shadow-black/5 sm:p-10">
          {/* Step indicator */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className={cn("h-2 w-8 rounded-full", step === 1 ? "bg-[#ea580c]" : "bg-[#14181f]/15")} />
            <span className={cn("h-2 w-8 rounded-full", step === 2 ? "bg-[#ea580c]" : "bg-[#14181f]/15")} />
            <span className={cn("h-2 w-8 rounded-full", step === 3 ? "bg-[#ea580c]" : "bg-[#14181f]/15")} />
          </div>

          {step === 1 ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="font-heading text-3xl font-bold text-[#14181f]">Join the Journey</h1>
                <p className="mt-2 text-sm text-[#14181f]/60">How will you travel with us?</p>
              </div>

              <div className="space-y-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all cursor-pointer",
                      role === r.id ? "border-[#ea580c] bg-[#ea580c]/5" : "border-[#14181f]/10 hover:border-[#14181f]/20"
                    )}
                  >
                    <r.icon size={24} className={cn(role === r.id ? "text-[#ea580c]" : "text-[#14181f]/40")} />
                    <span>
                      <span className={cn("block text-sm font-semibold", role === r.id ? "text-[#ea580c]" : "text-[#14181f]")}>{r.label}</span>
                      <span className="block text-xs text-[#14181f]/50">{r.desc}</span>
                    </span>
                  </button>
                ))}
              </div>

              <Button type="button" variant="saffron" size="lg" className="mt-6 w-full" onClick={() => setStep(2)}>
                Continue as {roleLabel}
              </Button>
            </>
          ) : step === 2 ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="font-heading text-3xl font-bold text-[#14181f]">Create Account</h1>
                <p className="mt-2 text-sm text-[#14181f]/60">Signing up as <span className="font-medium text-[#ea580c]">{roleLabel}</span></p>
              </div>

              <form onSubmit={handleAccountNext} className="space-y-5">
                <div>
                  <label htmlFor="name" className={labelCls}>Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
                    <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                      className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={labelCls}>Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
                    <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                      className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className={labelCls}>Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
                    <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters"
                      className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60" />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelCls}>Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
                    <input id="confirmPassword" type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password"
                      className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60" />
                  </div>
                </div>

                {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

                <div className="flex gap-3">
                  <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" variant="saffron" size="lg" className="flex-1">
                    Continue
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h1 className="font-heading text-3xl font-bold text-[#14181f]">Complete Your Profile</h1>
                <p className="mt-2 text-sm text-[#14181f]/60">
                  {role === "user" && "Tell us how you love to travel"}
                  {role === "vendor" && "Tell us about your business"}
                  {role === "guide" && "Tell us about your guiding experience"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* ── Role-specific questions ── */}
                {role === "user" && (
                  <>
                    <div>
                      <label className={labelCls}>Travel interests <span className="font-normal text-[#14181f]/40">(pick at least one)</span></label>
                      <div className="flex flex-wrap gap-2">
                        {TRAVEL_INTERESTS.map((t) => (
                          <Chip key={t} active={interests.includes(t)} onClick={() => setInterests(toggleList(interests, t))}>{t}</Chip>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Fitness level</label>
                      <div className="grid grid-cols-3 gap-2">
                        {FITNESS_LEVELS.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setFitnessLevel(f.id)}
                            className={cn(
                              "rounded-xl border-2 p-2.5 text-center transition-all cursor-pointer",
                              fitnessLevel === f.id ? "border-[#ea580c] bg-[#ea580c]/5" : "border-[#14181f]/10 hover:border-[#14181f]/20"
                            )}
                          >
                            <span className={cn("block text-xs font-semibold", fitnessLevel === f.id ? "text-[#ea580c]" : "text-[#14181f]")}>{f.label}</span>
                            <span className="block text-[10px] text-[#14181f]/40">{f.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="medicalInfo" className={labelCls}>Medical conditions / allergies <span className="font-normal text-[#14181f]/40">(optional)</span></label>
                      <textarea id="medicalInfo" rows={2} value={medicalInfo} onChange={(e) => setMedicalInfo(e.target.value)} placeholder="Anything our trip leads should know..."
                        className={cn(inputCls, "resize-none")} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="emergencyName" className={labelCls}>Emergency contact</label>
                        <input id="emergencyName" type="text" required value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} placeholder="Name"
                          className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor="emergencyPhone" className={labelCls}>Emergency phone</label>
                        <input id="emergencyPhone" type="tel" required value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value.replace(/[^\d+ ]/g, "").slice(0, 15))} placeholder="+91 ..."
                          className={inputCls} />
                      </div>
                    </div>
                  </>
                )}

                {role === "vendor" && (
                  <>
                    <div>
                      <label htmlFor="businessName" className={labelCls}>Business name</label>
                      <input id="businessName" type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Misty Valley Homestay"
                        className={inputCls} />
                    </div>

                    <div>
                      <label className={labelCls}>Business type</label>
                      <div className="flex flex-wrap gap-2">
                        {BUSINESS_TYPES.map((b) => (
                          <Chip key={b.id} active={businessType === b.id} onClick={() => setBusinessType(b.id)}>{b.label}</Chip>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="yearsInBusiness" className={labelCls}>Years in business</label>
                        <input id="yearsInBusiness" type="number" required min={0} max={100} value={yearsInBusiness} onChange={(e) => setYearsInBusiness(e.target.value)} placeholder="e.g. 5"
                          className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor="capacity" className={labelCls}>Capacity <span className="font-normal text-[#14181f]/40">(rooms/seats)</span></label>
                        <input id="capacity" type="number" required min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="e.g. 20"
                          className={inputCls} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="serviceRegions" className={labelCls}>Service regions <span className="font-normal text-[#14181f]/40">(comma-separated)</span></label>
                      <input id="serviceRegions" type="text" required value={serviceRegions} onChange={(e) => setServiceRegions(e.target.value)} placeholder="e.g. Coorg, Chikmagalur"
                        className={inputCls} />
                    </div>

                    <div>
                      <label htmlFor="priceRange" className={labelCls}>Price range <span className="font-normal text-[#14181f]/40">(optional)</span></label>
                      <input id="priceRange" type="text" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder="e.g. ₹1500–₹3000 / night"
                        className={inputCls} />
                    </div>

                    <div>
                      <label htmlFor="taxId" className={labelCls}>Tax / registration ID <span className="font-normal text-[#14181f]/40">(GSTIN / PAN)</span></label>
                      <input id="taxId" type="text" required minLength={4} value={taxId} onChange={(e) => setTaxId(e.target.value)} placeholder="Required for verification"
                        className={inputCls} />
                    </div>
                  </>
                )}

                {role === "guide" && (
                  <>
                    <div>
                      <label htmlFor="yearsExperience" className={labelCls}>Years of guiding experience</label>
                      <input id="yearsExperience" type="number" required min={0} max={80} value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} placeholder="e.g. 4"
                        className={inputCls} />
                    </div>

                    <div>
                      <label className={labelCls}>Languages <span className="font-normal text-[#14181f]/40">(pick at least one)</span></label>
                      <div className="flex flex-wrap gap-2">
                        {LANGUAGES.map((l) => (
                          <Chip key={l} active={languages.includes(l)} onClick={() => setLanguages(toggleList(languages, l))}>{l}</Chip>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Specializations <span className="font-normal text-[#14181f]/40">(pick at least one)</span></label>
                      <div className="flex flex-wrap gap-2">
                        {SPECIALIZATIONS.map((s) => (
                          <Chip key={s} active={specializations.includes(s)} onClick={() => setSpecializations(toggleList(specializations, s))}>{s}</Chip>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="operatingRegions" className={labelCls}>Operating regions <span className="font-normal text-[#14181f]/40">(comma-separated)</span></label>
                      <input id="operatingRegions" type="text" required value={operatingRegions} onChange={(e) => setOperatingRegions(e.target.value)} placeholder="e.g. Western Ghats, Hampi"
                        className={inputCls} />
                    </div>
                  </>
                )}

                {/* ── Shared contact details ── */}
                <div className="border-t border-black/5 pt-5">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#14181f]/40">Contact details</p>

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="country" className={labelCls}>Country</label>
                      <select id="country" required value={country} onChange={(e) => handleCountryChange(e.target.value)}
                        className={inputCls}>
                        {countries.map((c) => (
                          <option key={c.code} value={c.name}>{c.flag} {c.name} ({c.dial})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="phone" className={labelCls}>Phone Number</label>
                      <div className="flex gap-2">
                        <select value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} aria-label="Country code"
                          className="w-28 shrink-0 rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] px-2 py-3 text-sm text-[#14181f] outline-none">
                          {countries.map((c) => (
                            <option key={c.code + c.dial} value={c.dial}>{c.flag} {c.dial}</option>
                          ))}
                        </select>
                        <div className="relative flex-1">
                          <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
                          <input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))} placeholder="Mobile number"
                            className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="aadhaar" className={labelCls}>
                        Aadhaar Number <span className="font-normal text-[#14181f]/40">(optional, India only)</span>
                      </label>
                      <input id="aadhaar" type="text" inputMode="numeric" value={aadhaar} onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="12-digit Aadhaar"
                        className={inputCls} />
                      {aadhaar && (
                        <p className={`mt-1 text-xs ${isValidAadhaar(aadhaar) ? "text-green-600" : "text-red-500"}`}>
                          {isValidAadhaar(aadhaar) ? "✓ Valid Aadhaar number" : "Must be 12 digits"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="location" className={labelCls}>City / Location</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
                        <input id="location" type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Chennai, Bangalore"
                          className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="bio" className={labelCls}>
                        {role === "user" && "Short Bio"}
                        {role === "vendor" && "Business description"}
                        {role === "guide" && "Guide bio"}
                      </label>
                      <textarea id="bio" required rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..."
                        className={cn(inputCls, "resize-none")} />
                    </div>
                  </div>
                </div>

                {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

                <div className="flex gap-3">
                  <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" variant="saffron" size="lg" className="flex-1" disabled={loading}>
                    {loading ? <Loader2 size={18} className="animate-spin" /> : "Create Account"}
                  </Button>
                </div>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-sm text-[#14181f]/50">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#ea580c] hover:text-[#f97316]">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
