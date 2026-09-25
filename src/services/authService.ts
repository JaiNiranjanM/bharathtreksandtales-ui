import { apiFetch } from "./api";

export type UserRole = "user" | "vendor" | "guide" | "admin";

export interface TravellerProfileData {
  interests: string[];
  fitnessLevel: "beginner" | "moderate" | "experienced";
  medicalInfo?: string;
  emergencyName: string;
  emergencyPhone: string;
}

export interface VendorProfileData {
  businessName: string;
  businessType: "stay" | "transport" | "food" | "activity" | "other";
  yearsInBusiness: number;
  serviceRegions: string[];
  capacity: number;
  priceRange?: string;
  taxId: string;
}

export interface GuideProfileData {
  yearsExperience: number;
  languages: string[];
  specializations: string[];
  operatingRegions: string[];
}

export type ProfileData = TravellerProfileData | VendorProfileData | GuideProfileData;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  phoneCode?: string;
  country?: string;
  bio: string;
  avatar: string;
  location: string;
  profileCompleted: boolean;
  aadhaarLast4?: string;
  aadhaarVerified?: boolean;
  emailVerified?: boolean;
  pendingEmail?: string;
  profileData?: Record<string, unknown>;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "vendor" | "guide";
  phone?: string;
  phoneCode?: string;
  location?: string;
  country?: string;
  bio?: string;
  aadhaar?: string;
  profileData?: Record<string, unknown>;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getProfile(token: string): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateProfile(
  token: string,
  data: Partial<
    Pick<AuthUser, "role" | "phone" | "location" | "bio" | "avatar"> & {
      profileCompleted: boolean;
      phoneCode: string;
      country: string;
      email: string;
      aadhaar: string;
      profileData: Record<string, unknown>;
    }
  >
): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/auth/profile", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function verifyAadhaar(token: string, aadhaar: string): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/auth/verify-aadhaar", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ aadhaar }),
  });
}

export async function verifyEmail(token: string): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}
