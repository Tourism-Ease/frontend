import { z } from 'zod';

// ---------------------------
// Basic field validations
// ---------------------------
const nameSchema = z
  .string()
  .min(3, { message: 'Hotel name must be at least 3 characters.' })
  .max(100, { message: 'Hotel name cannot exceed 100 characters.' });

const descriptionSchema = z
  .string()
  .min(20, { message: 'Description must be at least 20 characters.' })
  .max(2000, { message: 'Description cannot exceed 2000 characters.' });

const starsSchema = z
  .number({ error: 'Stars must be a number.' })
  .min(1, { message: 'Stars must be at least 1.' })
  .max(5, { message: 'Stars cannot exceed 5.' });

// ---------------------------
// Address
// ---------------------------
const addressSchema = z.object({
  country: z.string().min(2, { message: 'Country is required.' }),
  city: z.string().min(2, { message: 'City is required.' }),
  street: z.string().optional(),
});

// ---------------------------
// Property Highlights
// ---------------------------
const propertyHighlightsSchema = z
  .array(z.string().min(1).max(50))
  .max(20, { message: 'Maximum 20 highlights allowed.' })
  .optional();

// ---------------------------
// Images
// ---------------------------
const imageFileSchema = z.instanceof(File); // for upload
const imagesFileArraySchema = z.array(imageFileSchema).max(5, { message: 'Maximum 5 images allowed.' }).optional();

// Cover image is required for creation
const imageCoverFileSchema = z.instanceof(File);

// ---------------------------
// Location (GeoJSON Point)
// ---------------------------
const locationSchema = z
  .object({
    type: z.literal('Point'),
    coordinates: z
      .tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)], {
        message: 'Coordinates must be [lng, lat] within valid ranges.',
      }),
  })
  .optional();

// ---------------------------
// Create & Update Schemas
// ---------------------------
export const createHotelSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  stars: starsSchema,
  address: addressSchema,
  propertyHighlights: propertyHighlightsSchema,
  // imageCover: imageCoverFileSchema,
  // images: imagesFileArraySchema,
  location: locationSchema,
});

export const updateHotelSchema = createHotelSchema
  .partial()
  .extend({
    // In update, cover image may be optional if not changed
    imageCover: imageCoverFileSchema.optional(),
  });

// ---------------------------
// TypeScript types
// ---------------------------
export type HotelFormData = z.infer<typeof createHotelSchema>;
export type UpdateHotelFormData = z.infer<typeof updateHotelSchema>;
