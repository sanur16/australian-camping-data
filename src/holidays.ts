import holidays2026 from "../data/holidays/2026.json";
import holidays2027 from "../data/holidays/2027.json";

export type PublicHoliday = {
  date: string;
  name: string;
  /** Empty array means national holiday. Otherwise, list of state codes. */
  states: string[];
};

type AustralianState = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "NT" | "ACT";

const HOLIDAYS_BY_YEAR: Record<number, PublicHoliday[]> = {
  2026: holidays2026,
  2027: holidays2027,
};

/**
 * Get public holidays for a given year, optionally filtered by state.
 * National holidays (states: []) are always included.
 */
export function getPublicHolidays(year: number, state?: AustralianState): PublicHoliday[] {
  const holidays = HOLIDAYS_BY_YEAR[year];
  if (!holidays) return [];
  if (!state) return holidays;
  return holidays.filter(
    (h) => h.states.length === 0 || h.states.includes(state)
  );
}

/**
 * Check if a given date string (YYYY-MM-DD) is a public holiday.
 */
export function isPublicHoliday(dateStr: string, state?: AustralianState): boolean {
  const year = parseInt(dateStr.slice(0, 4), 10);
  const holidays = getPublicHolidays(year, state);
  return holidays.some((h) => h.date === dateStr);
}

/**
 * Get the holiday name for a date, or undefined if not a holiday.
 */
export function getHolidayName(dateStr: string, state?: AustralianState): string | undefined {
  const year = parseInt(dateStr.slice(0, 4), 10);
  const holidays = getPublicHolidays(year, state);
  return holidays.find((h) => h.date === dateStr)?.name;
}

/** List of years with available holiday data. */
export function getAvailableYears(): number[] {
  return Object.keys(HOLIDAYS_BY_YEAR).map(Number).sort();
}
