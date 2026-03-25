import { z } from "zod";

const LEAD_SOURCES = [
  "listing_contact",
  "contact_page",
  "home_cta",
  "buy_page",
  "sell_page",
  "property_management_page",
  "newsletter",
  "join_page",
] as const;

/** Flat metadata only — avoids arbitrary nested JSON (prototype / storage risks). */
const metadataValue = z.union([
  z.string().max(2000),
  z.number().finite(),
  z.boolean(),
]);

export const leadPostSchema = z
  .object({
    email: z.string().trim().min(1).max(320).email(),
    name: z.string().trim().max(200).optional(),
    phone: z.string().trim().max(40).optional(),
    message: z.string().trim().max(10_000).optional(),
    source: z.enum(LEAD_SOURCES).optional(),
    listingId: z.string().trim().max(80).optional(),
    listing_id: z.string().trim().max(80).optional(),
    mlsNumber: z.string().trim().max(32).optional(),
    mls_number: z.string().trim().max(32).optional(),
    metadata: z
      .record(z.string().max(64), metadataValue)
      .optional()
      .nullable()
      .refine((o) => o == null || Object.keys(o).length <= 40, { message: "metadata too large" }),
  })
  .strict();

export const signupSchema = z
  .object({
    email: z.string().trim().min(1).max(320).email(),
    password: z.string().min(8).max(4096),
    name: z.union([z.string().trim().max(200), z.null(), z.literal("")]).optional(),
  })
  .strict();

export const profilePatchSchema = z
  .object({
    name: z.union([z.string().trim().max(200), z.null(), z.literal("")]).optional(),
    phone: z.union([z.string().trim().max(40), z.null(), z.literal("")]).optional(),
    company: z.union([z.string().trim().max(200), z.null(), z.literal("")]).optional(),
    address: z.union([z.string().trim().max(500), z.null(), z.literal("")]).optional(),
    image: z
      .union([
        z.string().trim().min(1).max(2048).refine((s) => /^https?:\/\//i.test(s)),
        z.null(),
      ])
      .optional(),
  })
  .strict()
  .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(4096),
    newPassword: z.string().min(8).max(4096),
  })
  .strict();

export const deleteAccountSchema = z
  .object({
    password: z.string().min(1).max(4096),
  })
  .strict();

export const savedListingPostSchema = z
  .object({
    listingId: z.string().trim().max(80).optional(),
    listing_id: z.string().trim().max(80).optional(),
    mlsNumber: z.string().trim().max(32).optional(),
    mls_number: z.string().trim().max(32).optional(),
  })
  .strict();

export const adminSyncTriggerSchema = z
  .object({
    limit: z.number().int().min(1).max(5000).optional(),
    pages: z.number().int().min(1).max(50).optional(),
    dryRun: z.boolean().optional(),
    fetchDetails: z.boolean().optional(),
  })
  .strict();

export const mlsSyncSchedulePutSchema = z
  .object({
    enabled: z.boolean().optional(),
    time: z.string().max(8).regex(/^(\d{1,2}):(\d{2})$/).optional(),
    timezone: z.string().trim().min(1).max(120).optional(),
  })
  .strict();

export const adminAdminsPutSchema = z
  .object({
    additionalAdmins: z.array(z.string().trim().min(3).max(320).email()).max(200),
  })
  .strict();

export const adminFeaturedPutSchema = z
  .object({
    mlsNumbers: z.array(z.string().trim().min(1).max(32)).max(500),
  })
  .strict();

export const adminBlogCreateSchema = z
  .object({
    slug: z.string().trim().min(1).max(200),
    title: z.string().trim().min(1).max(300),
    excerpt: z.string().trim().min(1).max(2000),
    body: z.string().trim().min(1).max(500_000),
    coverImageUrl: z
      .union([
        z.string().trim().min(1).max(2048).refine((s) => /^https?:\/\//i.test(s)),
        z.null(),
        z.literal(""),
      ])
      .optional(),
    publishedAt: z.union([z.string().trim().max(40), z.null(), z.literal("")]).optional(),
  })
  .strict();

export const adminClientPostSchema = z
  .object({
    userId: z.string().trim().min(1).max(80),
    buyerClient: z.boolean().optional(),
    sellerClient: z.boolean().optional(),
    propertyManagementClient: z.boolean().optional(),
    showFiles: z.boolean().optional(),
    showStats: z.boolean().optional(),
    showNotes: z.boolean().optional(),
    showUpdates: z.boolean().optional(),
    statsJson: z.unknown().optional().nullable(),
  })
  .strict();

const footprintPointSchema = z
  .object({
    id: z.string().trim().max(80),
    type: z.enum(["sold", "purchased", "active"]),
    lat: z.number().finite().min(-90).max(90),
    lng: z.number().finite().min(-180).max(180),
    address: z.string().trim().max(500),
    city: z.string().trim().max(120),
    price: z.number().finite().nonnegative().optional(),
    beds: z.number().int().min(0).max(50).optional(),
    baths: z.number().min(0).max(50).optional(),
    soldDate: z.string().trim().max(40).optional(),
    mlsNumber: z.string().trim().max(32).optional(),
  })
  .strict();

const footprintOverridesSchema = z
  .object({
    soldCount: z.number().finite().nullable().optional(),
    purchasedCount: z.number().finite().nullable().optional(),
    activeCount: z.number().finite().nullable().optional(),
    soldVolume: z.number().finite().nullable().optional(),
    purchasedVolume: z.number().finite().nullable().optional(),
    totalVolume: z.number().finite().nullable().optional(),
  })
  .strict();

export const adminFootprintPutSchema = z
  .object({
    points: z.array(footprintPointSchema).max(2000),
    performanceOverrides: footprintOverridesSchema.optional().nullable(),
  })
  .strict();

export const adminBlogUpdateSchema = z
  .object({
    slug: z.string().trim().min(1).max(200).optional(),
    title: z.string().trim().min(1).max(300).optional(),
    excerpt: z.string().trim().min(1).max(2000).optional(),
    body: z.string().trim().min(1).max(500_000).optional(),
    coverImageUrl: z
      .union([
        z.string().trim().min(1).max(2048).refine((s) => /^https?:\/\//i.test(s)),
        z.null(),
      ])
      .optional(),
    publishedAt: z.union([z.string().trim().max(40), z.null(), z.literal("")]).optional(),
  })
  .strict()
  .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });

export const adminClientPatchSchema = z
  .object({
    buyerClient: z.boolean().optional(),
    sellerClient: z.boolean().optional(),
    propertyManagementClient: z.boolean().optional(),
    showFiles: z.boolean().optional(),
    showStats: z.boolean().optional(),
    showNotes: z.boolean().optional(),
    showUpdates: z.boolean().optional(),
    statsJson: z.unknown().optional().nullable(),
  })
  .strict()
  .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });

export const adminNotePostSchema = z
  .object({
    content: z.string().trim().min(1).max(50_000),
  })
  .strict();

export const adminFilePostSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    url: z.string().trim().min(1).max(2048).refine((s) => /^https?:\/\//i.test(s)),
  })
  .strict();

export const adminClientUpdatePostSchema = z
  .object({
    title: z.string().trim().min(1).max(300),
    content: z.string().trim().min(1).max(50_000),
  })
  .strict();

export const listingIdQuerySchema = z.object({
  listingId: z.string().trim().min(1).max(80),
});

export const photoQuerySchema = z
  .object({
    ddfId: z
      .string()
      .trim()
      .max(64)
      .regex(/^[A-Za-z0-9_.:-]+$/)
      .optional(),
    mlsNumber: z
      .string()
      .trim()
      .max(64)
      .regex(/^[A-Za-z0-9_.:-]+$/)
      .optional(),
  })
  .strict()
  .refine((o) => Boolean(o.ddfId || o.mlsNumber), { message: "ddfId or mlsNumber required" });
