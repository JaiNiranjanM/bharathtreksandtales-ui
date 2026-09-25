"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialMap = exports.validCountries = void 0;
exports.isValidCountry = isValidCountry;
exports.dialForCountry = dialForCountry;
exports.validCountries = [
    'India', 'United Arab Emirates', 'Australia', 'Bangladesh', 'Bahrain', 'Canada', 'Germany', 'France', 'United Kingdom', 'Indonesia', 'Japan', 'Kuwait', 'Sri Lanka', 'Malaysia', 'Nepal', 'New Zealand', 'Oman', 'Pakistan', 'Qatar', 'Saudi Arabia', 'Singapore', 'Thailand', 'United States', 'South Africa'
];
exports.dialMap = {
    'India': '+91', 'United Arab Emirates': '+971', 'Australia': '+61', 'Bangladesh': '+880', 'Bahrain': '+973', 'Canada': '+1', 'Germany': '+49', 'France': '+33', 'United Kingdom': '+44', 'Indonesia': '+62', 'Japan': '+81', 'Kuwait': '+965', 'Sri Lanka': '+94', 'Malaysia': '+60', 'Nepal': '+977', 'New Zealand': '+64', 'Oman': '+968', 'Pakistan': '+92', 'Qatar': '+974', 'Saudi Arabia': '+966', 'Singapore': '+65', 'Thailand': '+66', 'United States': '+1', 'South Africa': '+27'
};
function isValidCountry(v) { return exports.validCountries.includes(v); }
function dialForCountry(v) { return exports.dialMap[v] ?? '+91'; }
//# sourceMappingURL=countries.js.map