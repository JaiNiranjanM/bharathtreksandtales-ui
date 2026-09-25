// Aadhaar format check: any 12-digit number (no Verhoeff checksum).
export function isValidAadhaar(num: string): boolean {
  return /^\d{12}$/.test(num);
}

export function maskAadhaarLast4(last4: string): string {
  if (!last4 || last4.length !== 4) return '****';
  return `XXXX-XXXX-${last4}`;
}
