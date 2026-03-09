/**
 * Team members data. Add new entries here to show them on the Meet The Team page
 * and create their profile page at /team/[slug].
 */
export interface TeamMember {
  /** URL slug used in /team/[slug] — use lowercase, hyphenated (e.g. jane-doe) */
  slug: string;
  name: string;
  role: string;
  /** Image URL — use a placeholder or path like /images/team/jane-doe.jpg */
  image: string;
  /** Short line for the team grid (optional) */
  tagline?: string;
  /** Full bio for the member's profile page */
  bio: string;
  contact: {
    email?: string;
    phone?: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    slug: "shervin-varshokar",
    name: "Shervin Varshokar",
    role: "Realtor®, Founding Partner",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80",
    tagline: "Residential sales and buyer representation across Toronto & GTA.",
    bio: "Alex has over a decade of experience in Toronto real estate, specializing in residential sales and buyer representation. He focuses on clear communication and data-driven pricing so clients can make confident decisions. Whether you're buying your first home or selling an investment property, Alex brings the same discipline and market knowledge to every transaction.",
    contact: {
      email: "alex@yorksell.com",
      phone: "(416) 555-0101",
    },
  },
  {
    slug: "pouya-ahmadi",
    name: "Pouya Ahmadi",
    role: "Realtor®, Founding Partner",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80",
    tagline: "Listing strategy, staging, and marketing for sellers.",
    bio: "Sarah leads listing strategy and presentation for Yorksell's seller clients. She works with professional photographers and stagers to showcase properties at their best and coordinates marketing so listings reach the right buyers. Her background in marketing and design helps sellers stand out in competitive markets across the GTA.",
    contact: {
      email: "sarah@yorksell.com",
      phone: "(416) 555-0102",
    },
  },
  {
    slug: "shervin-rezaei",
    name: "Shervin Rezaei",
    role: "Realtor®, Founding Partner",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80",
    tagline: "Investment properties and new development across the GTA.",
    bio: "James advises clients on investment properties and new development opportunities throughout the Greater Toronto Area. He keeps on top of market trends and zoning changes so investors can evaluate risk and upside clearly. From condos to land and new builds, James helps clients build and manage their real estate portfolios.",
    contact: {
      email: "james@yorksell.com",
      phone: "(416) 555-0103",
    },
  },
  {
    slug: "kerem-ersozoglu",
    name: "Kerem Ersozoglu",
    role: "Realtor®",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&h=400&q=80",
    tagline: "Client-focused advisory across Toronto & GTA.",
    bio: "Kerem combines a data-driven approach with practical on-the-ground experience to help clients buy, sell, and invest with confidence. He focuses on clear communication, thoughtful strategy, and long-term relationships so every client feels supported before, during, and after a transaction.",
    contact: {
      email: "kerem@yorksell.com",
      phone: "(416) 555-0104",
    },
  },
];

export function getTeamMember(slug: string): TeamMember | undefined {
  return teamMembers.find((m) => m.slug === slug);
}

export function getTeamMemberSlugs(): string[] {
  return teamMembers.map((m) => m.slug);
}
