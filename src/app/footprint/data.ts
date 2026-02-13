/**
 * Footprint point: a listing sold, purchased, or active by Yorksell in the GTA.
 * Replace or extend this data with your real transactions.
 */
export type FootprintPointType = "sold" | "purchased" | "active";

export interface FootprintPoint {
  id: string;
  type: FootprintPointType;
  lat: number;
  lng: number;
  address: string;
  city: string;
  price?: number;
  beds?: number;
  baths?: number;
  soldDate?: string; // e.g. "2024-11"
  mlsNumber?: string;
}

/** Sample GTA points — replace with your real transactions via API or static data. */
export const FOOTPRINT_POINTS: FootprintPoint[] = [
  // Sold
  { id: "1", type: "sold", lat: 43.6532, lng: -79.3832, address: "123 King St W", city: "Toronto", price: 1_250_000, beds: 2, baths: 2, soldDate: "2024-10" },
  { id: "2", type: "sold", lat: 43.6711, lng: -79.3932, address: "85 Avenue Rd", city: "Toronto", price: 2_100_000, beds: 3, baths: 3, soldDate: "2024-09" },
  { id: "3", type: "sold", lat: 43.6612, lng: -79.3211, address: "1002 Queen St E", city: "Toronto", price: 985_000, beds: 2, baths: 2, soldDate: "2024-08" },
  { id: "4", type: "sold", lat: 43.7614, lng: -79.4111, address: "4500 Yonge St", city: "North York", price: 1_450_000, beds: 2, baths: 2, soldDate: "2024-07" },
  { id: "5", type: "sold", lat: 43.589, lng: -79.6441, address: "2000 Credit Valley Rd", city: "Mississauga", price: 1_350_000, beds: 4, baths: 3, soldDate: "2024-06" },
  { id: "6", type: "sold", lat: 43.8828, lng: -79.4403, address: "15 Major Mackenzie Dr", city: "Richmond Hill", price: 1_890_000, beds: 4, baths: 4, soldDate: "2024-05" },
  // Purchased (buyer representation)
  { id: "7", type: "purchased", lat: 43.4675, lng: -79.6877, address: "250 Lakeshore Rd E", city: "Oakville", price: 1_650_000, beds: 3, baths: 3, soldDate: "2024-11" },
  { id: "8", type: "purchased", lat: 43.7315, lng: -79.7624, address: "55 Main St N", city: "Brampton", price: 920_000, beds: 3, baths: 2, soldDate: "2024-09" },
  { id: "9", type: "purchased", lat: 43.8561, lng: -79.337, address: "80 Bur Oak Ave", city: "Markham", price: 1_520_000, beds: 4, baths: 3, soldDate: "2024-08" },
  { id: "10", type: "purchased", lat: 43.8363, lng: -79.4982, address: "200 Bass Pro Mills Dr", city: "Vaughan", price: 1_180_000, beds: 3, baths: 3, soldDate: "2024-07" },
  // Active
  { id: "11", type: "active", lat: 43.7731, lng: -79.2579, address: "2500 Eglinton Ave E", city: "Scarborough", price: 899_000, beds: 3, baths: 2 },
  { id: "12", type: "active", lat: 43.6532, lng: -79.5672, address: "500 The Queensway", city: "Etobicoke", price: 1_295_000, beds: 2, baths: 2 },
  { id: "13", type: "active", lat: 43.682, lng: -79.345, address: "88 Broadview Ave", city: "Toronto", price: 1_150_000, beds: 3, baths: 2 },
];

/** GTA map center (Toronto) and default zoom. */
export const GTA_MAP_CENTER: [number, number] = [43.6532, -79.3832];
export const GTA_MAP_ZOOM = 10;

/** Aggregate stats from points — can be replaced with real API data. */
export function getFootprintStats(points: FootprintPoint[]) {
  const sold = points.filter((p) => p.type === "sold");
  const purchased = points.filter((p) => p.type === "purchased");
  const active = points.filter((p) => p.type === "active");
  const soldVolume = sold.reduce((sum, p) => sum + (p.price ?? 0), 0);
  const purchasedVolume = purchased.reduce((sum, p) => sum + (p.price ?? 0), 0);
  return {
    soldCount: sold.length,
    purchasedCount: purchased.length,
    activeCount: active.length,
    soldVolume,
    purchasedVolume,
    totalVolume: soldVolume + purchasedVolume,
  };
}
