const EARTH_RADIUS_KM = 6371;

/**
 * Calculate straight-line distance between two coordinates using the Haversine formula.
 *
 * @returns Distance in kilometres
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Estimate drive time from straight-line distance.
 * Applies a 1.3x road winding multiplier and assumes 70 km/h average speed
 * (typical for Australian regional roads).
 *
 * @returns Estimated drive time in minutes
 */
export function estimateDriveTimeMinutes(distanceKm: number): number {
  const roadDistance = distanceKm * 1.3;
  return (roadDistance / 70) * 60;
}
