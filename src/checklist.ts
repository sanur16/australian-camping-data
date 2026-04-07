import checklistData from "../data/camping/checklist.json";

export type ChecklistCondition =
  | { type: "missingFacility"; facility: string }
  | { type: "hasSiteType"; siteType: string }
  | { type: "hasBestFor"; bestFor: string };

export type ChecklistItem = {
  name: string;
  essential: boolean;
  reason?: string;
};

export type ChecklistCategory = {
  name: string;
  items: ChecklistItem[];
};

type RawConditionalItem = {
  name: string;
  essential: boolean;
  reason?: string;
  condition: ChecklistCondition;
};

type RawCategory = {
  name: string;
  baseItems: ChecklistItem[];
  conditionalItems: RawConditionalItem[];
};

function evaluateCondition(
  condition: ChecklistCondition,
  facilities: string[],
  siteTypes: string[],
  bestFor: string[]
): boolean {
  switch (condition.type) {
    case "missingFacility":
      return !facilities.includes(condition.facility);
    case "hasSiteType":
      return siteTypes.includes(condition.siteType);
    case "hasBestFor":
      return bestFor.includes(condition.bestFor);
  }
}

/**
 * Generate a camping packing checklist based on campground attributes.
 *
 * @param facilities - Facilities available (e.g. "showers", "drinking water", "barbecue facilities")
 * @param siteTypes - Site types (e.g. "backpack", "car", "caravan")
 * @param bestFor - Activity tags (e.g. "fishing", "hiking", "4wd", "beach-lovers")
 * @returns Categorised checklist with items tailored to the campground
 */
export function resolveChecklist(
  facilities: string[],
  siteTypes: string[],
  bestFor: string[]
): ChecklistCategory[] {
  const categories = (checklistData as { categories: RawCategory[] }).categories;

  return categories
    .map((category) => {
      const conditionalMatches = category.conditionalItems.filter((item) =>
        evaluateCondition(item.condition, facilities, siteTypes, bestFor)
      );

      return {
        name: category.name,
        items: [
          ...category.baseItems,
          ...conditionalMatches.map((item) => ({
            name: item.name,
            essential: item.essential,
            ...(item.reason ? { reason: item.reason } : {}),
          })),
        ],
      };
    })
    .filter((category) => category.items.length > 0);
}

/**
 * Get all checklist categories with all items (no filtering).
 */
export function getAllChecklistItems(): ChecklistCategory[] {
  const categories = (checklistData as { categories: RawCategory[] }).categories;
  return categories.map((category) => ({
    name: category.name,
    items: [
      ...category.baseItems,
      ...category.conditionalItems.map((item) => ({
        name: item.name,
        essential: item.essential,
        ...(item.reason ? { reason: item.reason } : {}),
      })),
    ],
  }));
}
