import postcodes from "../data/postcodes/au-postcodes.json";

export type PostcodeEntry = {
  lat: number;
  lng: number;
};

const postcodeData = postcodes as Record<string, PostcodeEntry>;

/**
 * Look up coordinates for an Australian postcode.
 * Returns undefined if the postcode is not found.
 */
export function lookupPostcode(postcode: string): PostcodeEntry | undefined {
  const padded = postcode.padStart(4, "0");
  return postcodeData[padded];
}

/**
 * Get all postcodes as an array of [postcode, lat, lng] tuples.
 */
export function getAllPostcodes(): Array<[string, number, number]> {
  return Object.entries(postcodeData).map(([code, { lat, lng }]) => [code, lat, lng]);
}

/**
 * Total number of postcodes in the dataset.
 */
export function getPostcodeCount(): number {
  return Object.keys(postcodeData).length;
}
