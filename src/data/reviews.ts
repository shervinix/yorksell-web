/**
 * Google reviews to show on the homepage.
 * Replace these with real snippets from your Google Business profile.
 * Keep text concise for cards; full reviews can be read on Google.
 */
export interface Review {
  author: string;
  rating: number;
  text: string;
  date?: string;
}

/** Link to your Google Business profile (for "See all reviews"). */
export const GOOGLE_REVIEWS_URL = "https://share.google/O3eUmuRh96SXqN4qo";

export const REVIEWS: Review[] = [
  {
    author: "Sarah M.",
    rating: 5,
    text: "Professional, responsive, and made our first home purchase smooth. Would recommend to anyone in the GTA.",
    date: "2024",
  },
  {
    author: "James K.",
    rating: 5,
    text: "Got us over asking in a tough market. Clear communication from listing to closing. Very pleased.",
    date: "2024",
  },
  {
    author: "Priya L.",
    rating: 5,
    text: "They helped us find the right condo and negotiated a great deal. Felt supported the whole way.",
    date: "2024",
  },
];
