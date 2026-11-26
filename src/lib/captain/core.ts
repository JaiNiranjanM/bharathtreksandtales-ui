// Shared (browser + server) types and rules for trip batches, captains and expense claims.
// Pure functions only, so the access and money rules can be tested without Firebase.

export const EXPENSE_CATEGORIES = [
  { id: "transport", label: "Transport & fuel" },
  { id: "food", label: "Food & water" },
  { id: "stay", label: "Stay / rooms" },
  { id: "permits", label: "Permits & entry fees" },
  { id: "guide", label: "Guide / porter / jeep" },
  { id: "medical", label: "Medical / first aid" },
  { id: "other", label: "Other" },
] as const;

export const EXPENSE_CATEGORY_IDS = [
  "transport",
  "food",
  "stay",
  "permits",
  "guide",
  "medical",
  "other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORY_IDS)[number];

export const categoryLabel = (id: string) =>
  EXPENSE_CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const PAYMENT_METHODS = [
  { id: "cash", label: "Cash" },
  { id: "upi", label: "UPI" },
  { id: "bank", label: "Bank transfer" },
  { id: "other", label: "Other" },
] as const;

export interface CaptainDoc {
  uid: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: number;
}

/** One run (departure) of a trip. Captains, travellers and money belong to a batch. */
export interface BatchDoc {
  id: string;
  /** Optional link to a trip listed on the website. */
  tripId: string;
  tripTitle: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  captainUids: string[];
  notes: string;
  /** Random, unguessable code in the registration link (/join/<code>); null until BTT creates the link. */
  joinToken: string | null;
  /** Whether the registration link currently accepts new details. */
  joinOpen: boolean;
  /** Self-registered travellers still waiting for BTT to confirm them. */
  pendingCount: number;
  /** Set when BTT gives the captains access; cleared when BTT takes it back. */
  accessGrantedAt: number | null;
  settledAt: number | null;
  settleNote: string;
  createdAt: number;
  updatedAt: number;
}

/** admin: added by hand. csv: imported. website: booked on the trip page. link: filled in through the registration link. */
export type TravellerSource = "admin" | "csv" | "website" | "link";
export const SOURCE_LABEL: Record<TravellerSource, string> = {
  admin: "Added by BTT",
  csv: "Imported",
  website: "Website booking",
  link: "Registration link",
};

export interface TravellerDoc {
  id: string;
  source: TravellerSource;
  /** Self-registered travellers start as pending until BTT confirms; captains only see confirmed ones. */
  status: "pending" | "confirmed";
  /** Who made the booking (for website bookings), so BTT can reach them. */
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  /** Travellers submitted together share this id; the first 6 characters are the booking reference. */
  submissionId: string;
  name: string;
  phone: string;
  age: number | null;
  gender: string;
  pickupPoint: string;
  emergencyName: string;
  emergencyPhone: string;
  medicalNotes: string;
  notes: string;
  createdAt: number;
}

export interface AdvanceDoc {
  id: string;
  amount: number;
  date: string;
  method: "cash" | "upi" | "bank" | "other";
  note: string;
  createdAt: number;
}

export interface SettlementDoc {
  id: string;
  /** captain_to_btt: the captain handed back cash. btt_to_captain: BTT paid the captain. */
  direction: "captain_to_btt" | "btt_to_captain";
  amount: number;
  date: string;
  note: string;
  createdAt: number;
}

export interface BillRef {
  path: string;
  name: string;
  contentType: string;
  size: number;
}

export type ExpenseStatus = "pending" | "approved" | "rejected";

export interface ExpenseDoc {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  bills: BillRef[];
  status: ExpenseStatus;
  /** What BTT accepted; may be less than `amount`. */
  approvedAmount: number | null;
  adminNote: string;
  submittedBy: string;
  submittedByName: string;
  submittedAt: number;
  updatedAt: number;
  decidedAt: number | null;
}

/** An expense with short-lived download links for its bills (made on the server). */
export interface ExpenseView extends ExpenseDoc {
  billLinks: { name: string; url: string; contentType: string }[];
}

// ---------------------------------------------------------------- dates (India time)

const IST = "+05:30";
/** Traveller details lock this many days after the trip's last day. */
export const DETAILS_LOCK_DAYS = 2;
/** The admin screen suggests giving access this many days before departure. */
export const SUGGESTED_ACCESS_DAYS_BEFORE = 3;

export function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The last moment of a calendar day in India time. */
export const endOfDayIST = (date: string) => Date.parse(`${date}T23:59:59${IST}`);

export const detailsLockAt = (batch: Pick<BatchDoc, "endDate">) =>
  endOfDayIST(addDays(batch.endDate, DETAILS_LOCK_DAYS));

export const suggestedAccessDate = (batch: Pick<BatchDoc, "startDate">) =>
  addDays(batch.startDate, -SUGGESTED_ACCESS_DAYS_BEFORE);

/** "2026-12-05" -> "5 Dec 2026" */
export function prettyDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ---------------------------------------------------------------- access

export type AccessState = "not_granted" | "open" | "details_locked" | "settled";

/**
 * What an assigned captain may do with a batch right now.
 * - Traveller details: from when BTT gives access until 2 days after the trip, and never once settled.
 * - Expenses: from when BTT gives access until BTT marks the batch settled.
 */
export function computeAccess(
  batch: Pick<BatchDoc, "accessGrantedAt" | "endDate" | "settledAt">,
  now = Date.now()
) {
  const granted = Boolean(batch.accessGrantedAt);
  const settled = Boolean(batch.settledAt);
  const travellers = granted && !settled && now <= detailsLockAt(batch);
  const expenses = granted && !settled;
  const state: AccessState = settled
    ? "settled"
    : !granted
    ? "not_granted"
    : travellers
    ? "open"
    : "details_locked";
  return { granted, settled, travellers, expenses, state };
}

/** Whether the registration link currently accepts details: it must exist, be switched on, and the trip not be over. */
export function registrationOpen(
  batch: Pick<BatchDoc, "joinToken" | "joinOpen" | "endDate">,
  now = Date.now()
) {
  return Boolean(batch.joinToken && batch.joinOpen && now <= endOfDayIST(batch.endDate));
}

export const ACCESS_LABEL: Record<AccessState, string> = {
  not_granted: "Access not given yet",
  open: "Access open",
  details_locked: "Traveller details locked",
  settled: "Settled",
};

// ---------------------------------------------------------------- money

const round2 = (n: number) => Math.round(n * 100) / 100;
const sum = (nums: number[]) => round2(nums.reduce((a, b) => a + b, 0));

export interface MoneySummary {
  /** Cash and transfers BTT gave the captain for the trip. */
  totalAdvance: number;
  /** Everything the captain has submitted. */
  claimed: number;
  /** What BTT accepted so far. */
  approved: number;
  pending: number;
  rejected: number;
  /** Cash the captain already handed back. */
  returned: number;
  /** Amounts BTT already paid the captain after the trip. */
  paidOut: number;
  /**
   * advance - approved - returned + paidOut.
   * Positive: the captain still owes BTT. Negative: BTT still owes the captain. Zero: square.
   */
  outstanding: number;
  /** The same figure if every pending claim were approved in full. */
  outstandingIfAllApproved: number;
}

export function summarizeMoney(
  advances: Pick<AdvanceDoc, "amount">[],
  expenses: Pick<ExpenseDoc, "amount" | "status" | "approvedAmount">[],
  settlements: Pick<SettlementDoc, "direction" | "amount">[]
): MoneySummary {
  const totalAdvance = sum(advances.map((a) => a.amount));
  const claimed = sum(expenses.map((e) => e.amount));
  const approved = sum(
    expenses.filter((e) => e.status === "approved").map((e) => e.approvedAmount ?? e.amount)
  );
  const pending = sum(expenses.filter((e) => e.status === "pending").map((e) => e.amount));
  const rejected = sum(expenses.filter((e) => e.status === "rejected").map((e) => e.amount));
  const returned = sum(settlements.filter((s) => s.direction === "captain_to_btt").map((s) => s.amount));
  const paidOut = sum(settlements.filter((s) => s.direction === "btt_to_captain").map((s) => s.amount));
  return {
    totalAdvance,
    claimed,
    approved,
    pending,
    rejected,
    returned,
    paidOut,
    outstanding: round2(totalAdvance - approved - returned + paidOut),
    outstandingIfAllApproved: round2(totalAdvance - approved - pending - returned + paidOut),
  };
}

/** Plain-words version of the outstanding balance. */
export function balanceMessage(outstanding: number, inr: (n: number) => string) {
  if (Math.abs(outstanding) < 0.005) return { text: "All square. Nothing owed either way.", tone: "ok" as const };
  if (outstanding > 0) return { text: `Captain still owes BTT ${inr(outstanding)}`, tone: "owes" as const };
  return { text: `BTT still owes the captain ${inr(-outstanding)}`, tone: "due" as const };
}
