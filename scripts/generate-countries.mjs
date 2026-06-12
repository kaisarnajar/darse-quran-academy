import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = process.argv[2];
if (!sourcePath) {
  console.error("Usage: node scripts/generate-countries.mjs <path-to-json>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

function escapeString(value) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

const countries = data
  .filter((country) => country.iso?.["alpha-2"] && country.phone?.[0])
  .map((country) => {
    const dialCode = country.phone[0].replace(/\D/g, "");
    let length = Number(country.phoneLength) || 0;
    if (length <= 0) {
      length = 10;
    }
    if (length > 15) {
      length = 15;
    }

    return {
      code: country.iso["alpha-2"],
      name: country.name,
      dialCode,
      flag: country.emoji,
      localNumberMinLength: length,
      localNumberMaxLength: length,
    };
  })
  .filter((country) => country.dialCode.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

const indiaIndex = countries.findIndex((country) => country.code === "IN");
if (indiaIndex > 0) {
  const [india] = countries.splice(indiaIndex, 1);
  countries.unshift(india);
}

const countryLines = countries
  .map((country) => {
    return `  { code: "${country.code}", name: "${escapeString(country.name)}", dialCode: "${country.dialCode}", flag: "${country.flag}", localNumberMinLength: ${country.localNumberMinLength}, localNumberMaxLength: ${country.localNumberMaxLength} },`;
  })
  .join("\n");

const output = `export type ProfileCountry = {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  localNumberMinLength: number;
  localNumberMaxLength: number;
};

const COUNTRY_DATA: ProfileCountry[] = [
${countryLines}
];

export const PROFILE_COUNTRIES = COUNTRY_DATA;

export type ProfileCountryCode = (typeof PROFILE_COUNTRIES)[number]["code"];

export const DEFAULT_PROFILE_COUNTRY_CODE = "IN" satisfies ProfileCountryCode;

export const PROFILE_COUNTRY_CODES = PROFILE_COUNTRIES.map(
  (country) => country.code,
) as [ProfileCountryCode, ...ProfileCountryCode[]];

const PROFILE_COUNTRIES_BY_DIAL_CODE = [...PROFILE_COUNTRIES].sort(
  (left, right) => right.dialCode.length - left.dialCode.length,
);

export function getProfileCountry(code: string): ProfileCountry | undefined {
  return PROFILE_COUNTRIES.find((country) => country.code === code);
}

export function getProfileCountryOrDefault(code?: string | null): ProfileCountry {
  return getProfileCountry(code ?? "") ?? getProfileCountry(DEFAULT_PROFILE_COUNTRY_CODE)!;
}

export function formatProfileDialCode(dialCode: string): string {
  return \`+\${dialCode}\`;
}

export function isValidProfileLocalNumber(country: ProfileCountry, localNumber: string): boolean {
  const digits = localNumber.replace(/\\D/g, "");
  if (!/^\\d+$/.test(digits)) {
    return false;
  }
  return (
    digits.length >= country.localNumberMinLength && digits.length <= country.localNumberMaxLength
  );
}

export function parseStoredProfileWhatsApp(stored: string | null | undefined): {
  countryCode: string;
  localNumber: string;
} {
  const digits = (stored ?? "").replace(/\\D/g, "");
  const defaultCountry = getProfileCountryOrDefault();

  for (const country of PROFILE_COUNTRIES_BY_DIAL_CODE) {
    if (digits.startsWith(country.dialCode)) {
      const localNumber = digits
        .slice(country.dialCode.length)
        .slice(0, country.localNumberMaxLength);
      return {
        countryCode: country.code,
        localNumber,
      };
    }
  }

  return {
    countryCode: defaultCountry.code,
    localNumber: digits.slice(0, defaultCountry.localNumberMaxLength),
  };
}

export function buildStoredProfileWhatsApp(countryCode: string, localNumber: string): string {
  const country = getProfileCountryOrDefault(countryCode);
  return \`\${country.dialCode}\${localNumber.replace(/\\D/g, "")}\`;
}
`;

const outPath = path.join(__dirname, "..", "lib", "countries.ts");
fs.writeFileSync(outPath, output, "utf8");
console.log(`Wrote ${countries.length} countries to ${outPath}`);
