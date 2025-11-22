// schema/package.schema.ts
import { z } from 'zod';

// Pickup Location Schema
export const pickupLocationSchema = z.object({
  city: z.string()
    .min(1, 'Pickup city is required')
    .min(2, 'City name must be at least 2 characters'),
  place: z.string()
    .min(1, 'Pickup place is required')
    .min(2, 'Pickup place must be at least 2 characters'),
  time: z.string().min(1, 'Pickup time is required'),
  priceAdjustment: z.number()
    .min(-5000, 'Price adjustment cannot be less than -5000')
    .default(0),
});

// Itinerary Schema
export const itinerarySchema = z.object({
  day: z.number()
    .min(1, 'Itinerary day number is required')
    .min(1, 'Itinerary day must be at least 1'),
  title: z.string()
    .min(1, 'Itinerary title is required')
    .min(3, 'Itinerary title must be at least 3 characters'),
  description: z.string()
    .min(1, 'Itinerary description is required')
    .min(10, 'Itinerary description must be at least 10 characters'),
});

// Main Package Schema - Create
export const createPackageSchema = z.object({
  title: z.string()
    .min(1, 'Package title is required')
    .min(3, 'Package title must be at least 3 characters'),
  
  hotel: z.string().min(1, 'Hotel ID is required'),
  destination: z.string().min(1, 'Destination ID is required'),
  
  pickupLocations: z.array(pickupLocationSchema)
    .min(1, 'At least one pickup location is required'),
  
  durationDays: z.number()
    .min(1, 'Duration (in days) is required')
    .min(1, 'Duration must be at least 1 day'),
  
  shortDesc: z.string()
    .min(1, 'Short description is required')
    .min(10, 'Short description must be at least 10 characters'),
  
  description: z.string()
    .min(1, 'Full description is required')
    .min(20, 'Full description must be at least 20 characters'),
  
  itinerary: z.array(itinerarySchema)
    .min(1, 'Itinerary must include at least one day'),
  
  transportation: z.string().min(1, 'Transportation method is required'),
  
  egyptianPrice: z.number()
    .min(0.01, 'Egyptian Package price is required')
    .min(0, 'Egyptian Price must be a positive number'),
  
  childrenPrice: z.number()
    .min(0.01, 'Children Package price is required')
    .min(0, 'Children Price must be a positive number'),
  
  foreignerPrice: z.number()
    .min(0, 'Foreigner Price must be a positive number')
    .optional(),
  
  capacity: z.number()
    .min(1, 'Package capacity is required')
    .min(1, 'Capacity must be at least 1 seat'),
  
  departureDate: z.string().min(1, 'Departure date is required'),
  
  imageCover: z.any().refine(
    (val) => val instanceof File || typeof val === 'string', 
    'Cover image is required'
  ),
  images: z.array(z.any()).optional(),
});

// Update Schema - all fields optional
export const updatePackageSchema = createPackageSchema.partial();

// Types
export type PackageFormData = z.infer<typeof createPackageSchema>;
export type UpdatePackageFormData = z.infer<typeof updatePackageSchema>;