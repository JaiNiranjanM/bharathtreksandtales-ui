// Country list with dial codes, India pinned first
export type CountryOption = { code: string; name: string; dial: string; flag: string };

const allCountries: CountryOption[] = [
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩' },
  { code: 'BH', name: 'Bahrain', dial: '+973', flag: '🇧🇭' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'KW', name: 'Kuwait', dial: '+965', flag: '🇰🇼' },
  { code: 'LK', name: 'Sri Lanka', dial: '+94', flag: '🇱🇰' },
  { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾' },
  { code: 'NP', name: 'Nepal', dial: '+977', flag: '🇳🇵' },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿' },
  { code: 'OM', name: 'Oman', dial: '+968', flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰' },
  { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬' },
  { code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
  // extend if needed
];

function sortCountries(list: CountryOption[]): CountryOption[] {
  const [india, ...rest] = list;
  const sorted = rest.sort((a, b) => a.name.localeCompare(b.name));
  return [india, ...sorted];
}

export const countries = sortCountries(allCountries);

export function getCountryByCode(code: string): CountryOption | undefined {
  return countries.find((c) => c.code === code);
}
export function getCountryByName(name: string): CountryOption | undefined {
  return countries.find((c) => c.name === name);
}
export function getDialByCountryName(name: string): string {
  return getCountryByName(name)?.dial ?? '+91';
}
