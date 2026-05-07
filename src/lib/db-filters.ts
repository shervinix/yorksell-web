import type { Prisma } from "@prisma/client";

export const hasRealData: Prisma.ListingWhereInput = {
  OR: [
    { mlsNumber: { not: null } },
    { addressLine: { not: null } },
    { city: { not: null } },
    { price: { not: null } },
  ],
};
