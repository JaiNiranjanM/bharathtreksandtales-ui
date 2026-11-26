import type { TravellerInput } from "./schemas";

/** Splits CSV text into rows of cells. Handles quoted cells, commas and line breaks inside quotes, and "" escapes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === "," || ch === "\t") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  rows.push(row);
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

type Field = keyof TravellerInput;

/** Header names people actually type, mapped to our fields. */
const ALIASES: Record<string, Field> = {
  name: "name",
  "full name": "name",
  traveller: "name",
  traveler: "name",
  phone: "phone",
  mobile: "phone",
  "phone number": "phone",
  "mobile number": "phone",
  age: "age",
  gender: "gender",
  sex: "gender",
  pickup: "pickupPoint",
  "pickup point": "pickupPoint",
  "pickup location": "pickupPoint",
  "boarding point": "pickupPoint",
  "emergency name": "emergencyName",
  "emergency contact": "emergencyName",
  "emergency contact name": "emergencyName",
  "emergency phone": "emergencyPhone",
  "emergency number": "emergencyPhone",
  "emergency contact phone": "emergencyPhone",
  "emergency contact number": "emergencyPhone",
  medical: "medicalNotes",
  "medical notes": "medicalNotes",
  "medical conditions": "medicalNotes",
  health: "medicalNotes",
  notes: "notes",
  note: "notes",
  remarks: "notes",
};

const normalizeHeader = (h: string) => h.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");

export interface CsvImportResult {
  rows: TravellerInput[];
  /** Problems worth showing, e.g. "Row 4: no name, skipped". */
  problems: string[];
  /** Header names we did not recognise (their columns are ignored). */
  ignoredColumns: string[];
}

export function travellersFromCsv(text: string): CsvImportResult {
  const table = parseCsv(text);
  if (table.length === 0) return { rows: [], problems: ["The file is empty."], ignoredColumns: [] };

  const header = table[0].map(normalizeHeader);
  const fields = header.map((h) => ALIASES[h] ?? null);
  const ignoredColumns = table[0].filter((_, i) => !fields[i] && table[0][i].trim() !== "");
  if (!fields.includes("name")) {
    return { rows: [], problems: ['The first row must be a header with a "Name" column.'], ignoredColumns };
  }

  const rows: TravellerInput[] = [];
  const problems: string[] = [];
  table.slice(1).forEach((cells, idx) => {
    const rec: Record<string, string> = {};
    fields.forEach((f, i) => {
      if (f) rec[f] = (cells[i] ?? "").trim();
    });
    if (!rec.name) {
      problems.push(`Row ${idx + 2}: no name, skipped.`);
      return;
    }
    let age: number | null = null;
    if (rec.age) {
      const n = Number(rec.age);
      if (Number.isInteger(n) && n >= 0 && n <= 120) age = n;
      else problems.push(`Row ${idx + 2} (${rec.name}): age "${rec.age}" ignored.`);
    }
    rows.push({
      name: rec.name,
      phone: rec.phone ?? "",
      age,
      gender: rec.gender ?? "",
      pickupPoint: rec.pickupPoint ?? "",
      emergencyName: rec.emergencyName ?? "",
      emergencyPhone: rec.emergencyPhone ?? "",
      medicalNotes: rec.medicalNotes ?? "",
      notes: rec.notes ?? "",
    });
  });
  return { rows, problems, ignoredColumns };
}

export const CSV_TEMPLATE =
  "Name,Phone,Age,Gender,Pickup point,Emergency contact name,Emergency contact phone,Medical notes,Notes\n" +
  'Asha Raman,9876543210,29,Female,Majestic,Ravi Raman,9876500000,,"Vegetarian, window seat"\n';
