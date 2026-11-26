import "server-only";
import { adminBucket } from "../firebase/admin";
import { BILL_TYPES, MAX_BILLS_PER_EXPENSE, MAX_BILL_BYTES } from "./schemas";
import type { BillRef } from "./core";

/** A problem with an uploaded bill that is safe to show to the captain. */
export class BillError extends Error {}

/** Works out the real file type from its first bytes, so a renamed file can't slip through. */
function sniffType(buf: Buffer): string | null {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }
  if (buf.length > 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") {
    return "image/webp";
  }
  if (buf.length > 5 && buf.subarray(0, 5).toString("ascii") === "%PDF-") return "application/pdf";
  return null;
}

export interface PreparedBill {
  name: string;
  type: string;
  buffer: Buffer;
}

/** Checks the uploaded files and reads them into memory. `alreadyAttached` counts bills kept from before. */
export async function prepareBills(files: File[], alreadyAttached = 0): Promise<PreparedBill[]> {
  if (files.length + alreadyAttached > MAX_BILLS_PER_EXPENSE) {
    throw new BillError(`You can attach up to ${MAX_BILLS_PER_EXPENSE} bills to one expense.`);
  }
  const prepared: PreparedBill[] = [];
  for (const file of files) {
    if (file.size > MAX_BILL_BYTES) {
      throw new BillError(`"${file.name}" is larger than ${MAX_BILL_BYTES / 1024 / 1024} MB.`);
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const type = sniffType(buffer);
    if (!type || !(BILL_TYPES as readonly string[]).includes(type)) {
      throw new BillError(`"${file.name}" isn't a photo (JPG, PNG, WebP) or a PDF.`);
    }
    prepared.push({ name: file.name.slice(-120), type, buffer });
  }
  return prepared;
}

const safeName = (name: string) => name.replace(/[^A-Za-z0-9._-]+/g, "_").slice(-80) || "bill";

export async function saveBills(batchId: string, expenseId: string, bills: PreparedBill[]): Promise<BillRef[]> {
  const bucket = adminBucket();
  return Promise.all(
    bills.map(async (bill, i) => {
      const path = `batches/${batchId}/bills/${expenseId}/${Date.now()}-${i}-${safeName(bill.name)}`;
      await bucket.file(path).save(bill.buffer, {
        contentType: bill.type,
        resumable: false,
        metadata: { cacheControl: "private, max-age=0" },
      });
      return { path, name: bill.name, contentType: bill.type, size: bill.buffer.length };
    })
  );
}

export async function deleteBillFiles(paths: string[]) {
  const bucket = adminBucket();
  await Promise.all(
    paths.map((p) =>
      bucket
        .file(p)
        .delete({ ignoreNotFound: true })
        .catch((err) => console.error("Could not delete bill file", p, err))
    )
  );
}
