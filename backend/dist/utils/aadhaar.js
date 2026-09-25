"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAadhaar = isValidAadhaar;
exports.maskAadhaarLast4 = maskAadhaarLast4;
// Aadhaar format check: any 12-digit number (no Verhoeff checksum).
function isValidAadhaar(num) {
    return /^\d{12}$/.test(num);
}
function maskAadhaarLast4(last4) {
    if (!last4 || last4.length !== 4)
        return '****';
    return `XXXX-XXXX-${last4}`;
}
//# sourceMappingURL=aadhaar.js.map