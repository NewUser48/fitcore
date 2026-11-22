// Authentication & Phone Number Normalization Helpers

/**
 * Normalizes Indian phone numbers into strict E.164 format (+91XXXXXXXXXX)
 */
export function normalizeIndianPhoneNumber(input: string): {
  isValid: boolean;
  e164: string;
  formatted: string;
  error?: string;
} {
  if (!input) {
    return { isValid: false, e164: "", formatted: "", error: "Phone number is required." };
  }

  // Strip all non-digit characters except leading +
  const cleaned = input.trim().replace(/[^\d+]/g, "");

  let digits = cleaned;
  if (digits.startsWith("+91")) {
    digits = digits.slice(3);
  } else if (digits.startsWith("91") && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }

  // Valid Indian mobile number is exactly 10 digits starting with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (!indianMobileRegex.test(digits)) {
    return {
      isValid: false,
      e164: "",
      formatted: input,
      error: "Please enter a valid 10-digit Indian mobile number.",
    };
  }

  const e164 = `+91${digits}`;
  const formatted = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;

  return {
    isValid: true,
    e164,
    formatted,
  };
}

export function isValidIndianPhone(input: string): boolean {
  return normalizeIndianPhoneNumber(input).isValid;
}

export function normalizeIndianPhone(input: string): string {
  const res = normalizeIndianPhoneNumber(input);
  return res.isValid ? res.e164 : input;
}

/**
 * Generates an unguessable 12-character strong temporary password
 * for initial member handover.
 */
export function generateStrongPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%^&*";

  const getRandom = (chars: string) =>
    chars.charAt(Math.floor(Math.random() * chars.length));

  let password = [
    getRandom(upper),
    getRandom(lower),
    getRandom(digits),
    getRandom(symbols),
    getRandom(upper),
    getRandom(lower),
    getRandom(digits),
    getRandom(symbols),
    getRandom(upper),
    getRandom(lower),
    getRandom(digits),
    getRandom(lower),
  ];

  // Shuffle array
  return password.sort(() => Math.random() - 0.5).join("");
}
