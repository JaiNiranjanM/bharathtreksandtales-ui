"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, Mail, Globe, ShieldCheck, Loader2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProfile, verifyAadhaar, type UserRole } from "@/services/authService";
import { useAppStore } from "@/lib/store";
import { countries, getDialByCountryName } from "@/lib/countries";
import { isValidAadhaar, maskAadhaar } from "@/lib/aadhaar";
import { cn } from "@/lib/utils";

const roleOptions: { id: UserRole; label: string }[] = [
  { id: "user", label: "Traveller" },
  { id: "vendor", label: "Vendor" },
  { id: "guide", label: "Guide" },
];

export default function ProfilePage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const token = useAppStore((s) => s.token);
  const updateUser = useAppStore((s) => s.updateUser);

  const [role, setRole] = useState<UserRole>(user?.role ?? "user");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [phoneCode, setPhoneCode] = useState(user?.phoneCode ?? "+91");
  const [country, setCountry] = useState(user?.country ?? "India");
  const [location, setLocation] = useState(user?.location ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [aadhaar, setAadhaar] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aadhaarLoading, setAadhaarLoading] = useState(false);

  if (!user || !token) {
    return (
      <div data-theme="light" className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-sm text-[#14181f]/60">Please log in to view your profile.</p>
          <Link href="/login" className="mt-4 inline-block text-sm font-medium text-[#ea580c]">Sign in</Link>
        </div>
      </div>
    );
  }

  const roleLabel = roleOptions.find((r) => r.id === user.role)?.label ?? "Traveller";

  function handleCountryChange(name: string) {
    setCountry(name);
    setPhoneCode(getDialByCountryName(name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setSuccess(false);
    setLoading(true);

    try {
      const updated = await updateProfile(token!, { role, phone, phoneCode, country, location, bio, email });
      updateUser(updated);
      setEmail(updated.email);
      if (updated.pendingEmail) {
        setNotice(`Verification link sent to ${updated.pendingEmail}. Your email updates after verification (check server log for the token in dev).`);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyAadhaar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!isValidAadhaar(aadhaar.trim())) {
      setError("Invalid Aadhaar number — must be 12 digits.");
      return;
    }
    setAadhaarLoading(true);
    try {
      const updated = await verifyAadhaar(token!, aadhaar.trim());
      updateUser(updated);
      setAadhaar("");
      setNotice("Aadhaar verified successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aadhaar verification failed.");
    } finally {
      setAadhaarLoading(false);
    }
  }

  return (
    <div data-theme="light" className="flex min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-1.5 text-sm text-[#14181f]/50 hover:text-[#14181f] cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-xl shadow-black/5">
          {/* Profile header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ea580c]/10 text-[#ea580c]">
              <User size={28} />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-[#14181f]">{user.name}</h1>
              <p className="text-sm text-[#14181f]/50">{user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-[#ea580c]/10 px-2.5 py-0.5 text-xs font-medium text-[#ea580c]">
                {roleLabel}
              </span>
              {user.aadhaarVerified && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  <ShieldCheck size={12} /> Aadhaar verified
                </span>
              )}
            </div>
          </div>

          {user.pendingEmail && (
            <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Email change to <strong>{user.pendingEmail}</strong> is pending verification.
              Check your inbox (or server log in dev) for the token, then{" "}
              <Link href="/verify-email" className="font-medium underline">verify here</Link>.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#14181f]">Account Type</label>
              <div className="flex gap-2">
                {roleOptions.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={cn(
                      "rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all cursor-pointer",
                      role === r.id
                        ? "border-[#ea580c] bg-[#ea580c]/5 text-[#ea580c]"
                        : "border-[#14181f]/10 text-[#14181f]/60 hover:border-[#14181f]/20"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium text-[#14181f]">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
                <input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60" />
              </div>
              <p className="mt-1 text-xs text-[#14181f]/40">Changing email requires re-verification via link.</p>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="profile-country" className="mb-1.5 block text-sm font-medium text-[#14181f]">Country</label>
              <div className="relative">
                <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
                <select id="profile-country" value={country} onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60">
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>{c.flag} {c.name} ({c.dial})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="profile-phone" className="mb-1.5 block text-sm font-medium text-[#14181f]">Phone</label>
              <div className="flex gap-2">
                <select value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} aria-label="Country code"
                  className="w-28 shrink-0 rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] px-2 py-3 text-sm text-[#14181f] outline-none">
                  {countries.map((c) => (
                    <option key={c.code + c.dial} value={c.dial}>{c.flag} {c.dial}</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
                  <input id="profile-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))} placeholder="Mobile number"
                    className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="profile-location" className="mb-1.5 block text-sm font-medium text-[#14181f]">City / Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
                <input id="profile-location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Chennai"
                  className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60" />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="profile-bio" className="mb-1.5 block text-sm font-medium text-[#14181f]">Bio</label>
              <textarea id="profile-bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..."
                className="w-full resize-none rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] px-4 py-3 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60" />
            </div>

            {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
            {notice && <p className="rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-800">{notice}</p>}
            {success && <p className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-600">Profile updated successfully!</p>}

            <Button type="submit" variant="saffron" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
            </Button>
          </form>

          {/* Role-specific details (from signup) */}
          {user.profileData && Object.keys(user.profileData).length > 0 && (
            <div className="mt-8 border-t border-black/5 pt-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#14181f]">
                <User size={16} className="text-[#ea580c]" /> {roleLabel} Details
              </h2>
              <dl className="mt-3 space-y-2">
                {Object.entries(user.profileData).map(([k, v]) => (
                  <div key={k} className="flex gap-2 text-sm">
                    <dt className="w-36 shrink-0 font-medium capitalize text-[#14181f]/50">
                      {k.replace(/([A-Z])/g, " $1").trim()}
                    </dt>
                    <dd className="text-[#14181f]">{Array.isArray(v) ? v.join(", ") : String(v ?? "—")}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Aadhaar verification */}
          <div className="mt-8 border-t border-black/5 pt-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[#14181f]">
              <ShieldCheck size={16} className="text-[#ea580c]" /> Aadhaar Verification
            </h2>
            {user.aadhaarVerified ? (
              <p className="mt-2 text-sm text-green-700">
                Verified — {maskAadhaar(user.aadhaarLast4 ?? "")}
              </p>
            ) : (
              <form onSubmit={handleVerifyAadhaar} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input type="text" inputMode="numeric" value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  placeholder="12-digit Aadhaar number"
                  className="flex-1 rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] px-4 py-2.5 text-sm text-[#14181f] outline-none focus:border-[#ea580c]/60" />
                <Button type="submit" variant="outline" disabled={aadhaarLoading}>
                  {aadhaarLoading ? <Loader2 size={16} className="animate-spin" /> : "Verify"}
                </Button>
              </form>
            )}
            {aadhaar && !user.aadhaarVerified && (
              <p className={`mt-1 text-xs ${isValidAadhaar(aadhaar) ? "text-green-600" : "text-red-500"}`}>
                {isValidAadhaar(aadhaar) ? "✓ Valid Aadhaar number" : "Must be 12 digits"}
              </p>
            )}
            <p className="mt-1 text-xs text-[#14181f]/40">Validated locally as 12 digits; only a hash + last 4 digits are stored.</p>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap gap-2 border-t border-black/5 pt-6 text-sm">
            <Link href="/dashboard/bookings" className="rounded-full border border-[#14181f]/10 px-4 py-2 font-medium text-[#14181f]/70 hover:border-[#ea580c]/50 hover:text-[#ea580c]">My Bookings</Link>
            <Link href="/dashboard/orders" className="rounded-full border border-[#14181f]/10 px-4 py-2 font-medium text-[#14181f]/70 hover:border-[#ea580c]/50 hover:text-[#ea580c]">Orders & Invoices</Link>
            <Link href="/dashboard/wishlist" className="rounded-full border border-[#14181f]/10 px-4 py-2 font-medium text-[#14181f]/70 hover:border-[#ea580c]/50 hover:text-[#ea580c]">Wishlist</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
