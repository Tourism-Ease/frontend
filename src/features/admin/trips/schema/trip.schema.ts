import { z } from 'zod';

// ---------------------------
// Basic field validations
// ---------------------------
const titleSchema = z
  .string()
  .min(3, { message: 'Title must be at least 3 characters.' })
  .max(150, { message: 'Title cannot exceed 150 characters.' });

const overviewSchema = z
  .string()
  .min(20, { message: 'Overview must be at least 20 characters.' })
  .max(2000, { message: 'Overview cannot exceed 2000 characters.' });

// Prices
const priceSchema = z
  .number({ error: 'Price must be a number.' })
  .min(0, { message: 'Price cannot be negative.' });

// Duration
const durationSchema = z
  .string()
  .min(1, { message: 'Duration is required.' })
  .max(50);

// ---------------------------
// Highlights & What to Bring
// ---------------------------
const stringArraySchema = z
  .array(z.string().min(1).max(150))
  .max(30, { message: 'Maximum 30 entries allowed.' })
  .optional();

// ---------------------------
// Pickup
// ---------------------------
const pickUpSchema = z.object({
  time: z.string().min(1, { message: 'Pickup time is required.' }),
  place: z.string().min(1, { message: 'Pickup place is required.' }),
});

// ---------------------------
// Images (optional, if needed)
// ---------------------------
const imageFileSchema = z.instanceof(File);
const multipleImagesSchema = z.array(imageFileSchema).max(5).optional();
const imageCoverFileSchema = z.instanceof(File);

// ---------------------------
// Create Trip Schema
// ---------------------------
export const createTripSchema = z.object({
  title: titleSchema,
  destination: z.string().nonempty('Destination is required'),
  egyptianPrice: priceSchema,
  childrenPrice: priceSchema.optional(),
  foreignerPrice: priceSchema.optional(),

  duration: durationSchema,

  pickUp: pickUpSchema,

  overview: overviewSchema,

  highlights: stringArraySchema,
  whatToBring: stringArraySchema,

  // imageCover: imageCoverFileSchema, // uncomment if required
  // images: multipleImagesSchema,
});

// ---------------------------
// Update Trip Schema (Everything Optional)
// ---------------------------
export const updateTripSchema = createTripSchema.partial();

// ---------------------------
// Types
// ---------------------------
export type TripFormData = z.infer<typeof createTripSchema>;
export type UpdateTripFormData = z.infer<typeof updateTripSchema>;
