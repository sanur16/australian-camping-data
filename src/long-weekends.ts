import { getPublicHolidays, type PublicHoliday } from "./holidays";

export type LongWeekend = {
  startDate: string;
  endDate: string;
  nights: number;
  holidays: string[];
  /** Whether any part falls in school holidays */
  isSchoolHoliday: boolean;
};

type AustralianState = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "NT" | "ACT";

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
}

function isHoliday(dateStr: string, holidaySet: Set<string>): boolean {
  return holidaySet.has(dateStr);
}

function getHolidayName(dateStr: string, holidays: PublicHoliday[]): string | undefined {
  return holidays.find((h) => h.date === dateStr)?.name;
}

/**
 * Find all long weekends (3+ consecutive days off) in a given year for a state.
 * A long weekend is a Saturday-Sunday extended by adjacent public holidays.
 */
export function getLongWeekends(year: number, state?: AustralianState): LongWeekend[] {
  const holidays = getPublicHolidays(year, state);
  const holidayDates = new Set(holidays.map((h) => h.date));
  const results: LongWeekend[] = [];

  // Walk through every Saturday of the year
  const jan1 = new Date(year, 0, 1);
  // Find first Saturday
  let d = new Date(jan1);
  while (d.getDay() !== 6) d = addDays(d, 1);

  while (d.getFullYear() === year) {
    const sat = d;
    const sun = addDays(sat, 1);

    // Extend backward from Saturday (Friday, Thursday...)
    let start = sat;
    let prev = addDays(start, -1);
    while (isHoliday(toDateStr(prev), holidayDates)) {
      start = prev;
      prev = addDays(start, -1);
    }

    // Extend forward from Sunday (Monday, Tuesday...)
    let end = sun;
    let next = addDays(end, 1);
    while (isHoliday(toDateStr(next), holidayDates)) {
      end = next;
      next = addDays(end, 1);
    }

    const nights = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights >= 3) {
      const weekendHolidays: string[] = [];
      for (let i = new Date(start); i <= end; i = addDays(i, 1)) {
        const name = getHolidayName(toDateStr(i), holidays);
        if (name) weekendHolidays.push(name);
      }

      results.push({
        startDate: toDateStr(start),
        endDate: toDateStr(end),
        nights,
        holidays: weekendHolidays,
        isSchoolHoliday: false, // Caller can enrich with school holiday data
      });
    }

    // Next Saturday
    d = addDays(sat, 7);
  }

  return results;
}
