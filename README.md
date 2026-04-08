# Australian Camping Data

Australian public holidays, school holidays, postcode geocoding, and camping checklist data — as JSON files and a typed npm package.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## What's included

| Dataset | Format | Records | Source |
|---------|--------|---------|--------|
| Public holidays (all states) | JSON | 2026–2027 | State government gazettes |
| School holiday periods | JSON | 2026, 8 states/territories | State education departments |
| Postcode geocoding | JSON, CSV | 3,174 postcodes | [matthewproctor/australianpostcodes](https://github.com/matthewproctor/australianpostcodes) (CC0) |
| Camping checklist | JSON | 9 categories, 50+ items | [CampWatch](https://www.campwatch.com.au) team |
| Haversine distance | TypeScript | — | — |
| Long weekend detection | TypeScript | — | — |

## Interactive tools

Try the data live at **[sanur16.github.io/australian-camping-data](https://sanur16.github.io/australian-camping-data)**:

- [Holiday & Long Weekend Calendar](https://sanur16.github.io/australian-camping-data/holidays.html) — public holidays, school holidays, and long weekends by state
- [Camping Checklist Builder](https://sanur16.github.io/australian-camping-data/checklist.html) — smart packing list that adapts to your campground

## Install

```bash
npm install @sanur/australian-camping-data
```

## Usage

```typescript
import {
  getPublicHolidays,
  isSchoolHoliday,
  lookupPostcode,
  resolveChecklist,
  haversineDistance,
  getLongWeekends,
} from '@sanur/australian-camping-data';

// Get NSW public holidays for 2026
const holidays = getPublicHolidays(2026, 'NSW');
// => [{ date: "2026-01-01", name: "New Year's Day", states: [] }, ...]

// Check if a date falls in school holidays
isSchoolHoliday('2026-07-05', 'NSW'); // true (winter holidays)

// Postcode geocoding
lookupPostcode('2000'); // { lat: -33.8688, lng: 151.2093 }

// Smart camping checklist (adapts to missing facilities)
const checklist = resolveChecklist(
  ['toilets', 'drinking water'],  // facilities available
  ['car'],                         // site types
  ['hiking']                       // activities
);

// Distance between two points
haversineDistance(-33.8688, 151.2093, -34.4248, 150.8931); // ~68.9 km

// Find long weekends
getLongWeekends(2026, 'NSW');
// => [{ startDate: "2026-04-03", endDate: "2026-04-06", nights: 3, holidays: ["Good Friday", ...] }, ...]
```

## Using raw JSON

You can import the JSON data directly without using the TypeScript helpers:

```typescript
import holidays from '@sanur/australian-camping-data/data/holidays/2026.json';
import schoolHolidays from '@sanur/australian-camping-data/data/school-holidays/2026.json';
import postcodes from '@sanur/australian-camping-data/data/postcodes/au-postcodes.json';
import checklist from '@sanur/australian-camping-data/data/camping/checklist.json';
```

CSV format is also available for postcodes: `data/postcodes/au-postcodes.csv`

## Data accuracy

- **Public holidays**: Sourced from state government gazettes. Covers national and state-specific holidays for all 8 states/territories.
- **School holidays**: Sourced from state education department term date publications. Dates may shift slightly — check official sources for final confirmation.
- **Postcodes**: Derived from [matthewproctor/australianpostcodes](https://github.com/matthewproctor/australianpostcodes) (CC0). Coordinates rounded to 4 decimal places (~11m precision).
- **Camping checklist**: Curated by the [CampWatch](https://www.campwatch.com.au) team based on experience across 1,000+ Australian campgrounds.

## Contributing

We welcome contributions:

- Public holiday or school holiday data for future years
- Additional state-specific holidays we may have missed
- Corrections to postcode coordinates
- Camping checklist improvements

Please open an issue or PR.

## About

This data is maintained by the team behind **[CampWatch](https://www.campwatch.com.au)** — a free campsite availability alert service for Australia. CampWatch monitors national park campgrounds and texts you when booked-out sites open up.

## License

MIT
