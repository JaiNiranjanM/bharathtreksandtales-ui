// Aadhaar format check: any 12-digit number (no Verhoeff checksum).
export function isValidAadhaar(num: string): boolean {
  return /^\d{12}$/.test(num);
}
export function maskAadhaar(last4: string): string {
  return `XXXX-XXXX-${last4 || '****'}`;
}
