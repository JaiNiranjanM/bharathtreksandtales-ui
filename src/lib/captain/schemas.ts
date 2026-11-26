import { z } from "zod";
import { EXPENSE_CATEGORY_IDS } from "./core";

const s = z.string().trim();
const ymd = s.regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date");
const amount = z.number().positive("Enter an amount above 0").max(10_000_000, "Amount is too large");

export const captainInputSchema = z.object({
  name: s.min(2, "Enter the captain's name").max(80),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email")),
  phone: s.max(30).default(""),
});

export const batchInputSchema = z
  .object({
    tripId: s.max(60).default(""),
    tripTitle: s.min(3, "Enter the trip name").max(150),
    location: s.max(150).default(""),
    startDate: ymd,
    endDate: ymd,
    captainUids: z.array(z.string().min(1)).max(6).default([]),
    notes: s.max(1000).default(""),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "The last day can't be before the first day",
    path: ["endDate"],
  });

export const travellerSchema = z.object({
  name: s.min(1, "Name is required").max(120),
  phone: s.max(30).default(""),
  age: z.number().int().min(0).max(120).nullable().default(null),
  gender: s.max(20).default(""),
  pickupPoint: s.max(120).default(""),
  emergencyName: s.max(120).default(""),
  emergencyPhone: s.max(30).default(""),
  medicalNotes: s.max(1000).default(""),
  notes: s.max(1000).default(""),
});
export type TravellerInput = z.infer<typeof travellerSchema>;

export const advanceSchema = z.object({
  amount,
  date: ymd,
  method: z.enum(["cash", "upi", "bank", "other"]),
  note: s.max(300).default(""),
});

export const settlementSchema = z.object({
  direction: z.enum(["captain_to_btt", "btt_to_captain"]),
  amount,
  date: ymd,
  note: s.max(300).default(""),
});

export const expenseInputSchema = z.object({
  category: z.enum(EXPENSE_CATEGORY_IDS),
  description: s.min(2, "Say what the money was spent on").max(300),
  amount,
  date: ymd,
});

export const decisionSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  approvedAmount: amount.optional(),
  adminNote: s.max(300).default(""),
});

// ---- limits for bill uploads
export const MAX_BILLS_PER_EXPENSE = 4;
export const MAX_BILL_BYTES = 4 * 1024 * 1024;
export const BILL_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;

// ---- public registration (booking on the website, or the registration link)

export const MAX_PEOPLE_PER_SUBMISSION = 8;
export const MAX_TRAVELLERS_PER_BATCH = 400;

const phone = s.regex(/^[\d\s+()-]{8,20}$/, "Enter a valid phone number");

export const contactSchema = z.object({
  name: s.min(2, "Enter your name").max(120),
  phone,
  email: z.union([z.literal(""), z.string().trim().toLowerCase().pipe(z.email("Enter a valid email"))]).default(""),
});

const registrationBase = {
  travellers: z
    .array(travellerSchema)
    .min(1, "Add at least one traveller")
    .max(MAX_PEOPLE_PER_SUBMISSION, `You can register up to ${MAX_PEOPLE_PER_SUBMISSION} people at a time`),
  consent: z.boolean().refine((v) => v === true, "Please tick the box to agree before sending"),
  /** Honeypot: real people never see this field, so it must stay empty. */
  website: s.max(0).default(""),
};

export const joinSubmitSchema = z.object(registrationBase).refine(
  (d) => phone.safeParse(d.travellers[0].phone).success,
  { message: "Enter a phone number for the first traveller so BTT can reach you", path: ["travellers"] }
);

export const bookSubmitSchema = z.object({
  ...registrationBase,
  tripId: s.min(1).max(60),
  date: ymd,
  contact: contactSchema,
});
