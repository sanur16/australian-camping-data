import schoolHolidays2026 from "../data/school-holidays/2026.json";

export type SchoolHolidayPeriod = {
  start: string;
  end: string;
  name: string;
};

type AustralianState = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "NT" | "ACT";

const SCHOOL_HOLIDAYS_BY_YEAR: Record<number, Record<string, SchoolHolidayPeriod[]>> = {
  2026: schoolHolidays2026,
};

/**
 * Get school holiday periods for a given year and state.
 * Returns all states if no state specified.
 */
export function getSchoolHolidays(
  year: number,
  state?: AustralianState
): SchoolHolidayPeriod[] | Record<string, SchoolHolidayPeriod[]> {
  const data = SCHOOL_HOLIDAYS_BY_YEAR[year];
  if (!data) return state ? [] : {};
  if (!state) return data;
  return data[state] || [];
}

/**
 * Check if a date string (YYYY-MM-DD) falls within school holidays for a state.
 */
export function isSchoolHoliday(dateStr: string, state: AustralianState): boolean {
  const year = parseInt(dateStr.slice(0, 4), 10);
  const periods = getSchoolHolidays(year, state) as SchoolHolidayPeriod[];
  if (!Array.isArray(periods)) return false;
  return periods.some((p) => dateStr >= p.start && dateStr <= p.end);
}

/**
 * Get the current or next upcoming school holiday period for a state.
 */
export function getNextSchoolHoliday(
  dateStr: string,
  state: AustralianState
): SchoolHolidayPeriod | undefined {
  const year = parseInt(dateStr.slice(0, 4), 10);
  const periods = getSchoolHolidays(year, state) as SchoolHolidayPeriod[];
  if (!Array.isArray(periods)) return undefined;
  return periods.find((p) => p.end >= dateStr);
}

/** List of years with available school holiday data. */
export function getAvailableYears(): number[] {
  return Object.keys(SCHOOL_HOLIDAYS_BY_YEAR).map(Number).sort();
}

/** List of states with data for a given year. */
export function getAvailableStates(year: number): string[] {
  const data = SCHOOL_HOLIDAYS_BY_YEAR[year];
  if (!data) return [];
  return Object.keys(data).sort();
}
