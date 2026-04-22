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
    author: "Justin Blackie",
    rating: 5,
    text: "I trust Yorksell Group to always provide the best service when it comes to real estate.",
    date: "2025",
  },
  {
    author: "Tom Lee",
    rating: 5,
    text: "Thank you Yorksell Team for finding and helping me close on my dream home",
    date: "2025",
  },
  {
    author: "Ali Az",
    rating: 5,
    text: "I had an excellent experience working with the Yorksell team. From start to finish, everything was handled with professionalism, transparency, and genuine care.",
    date: "2026",
  },
];
