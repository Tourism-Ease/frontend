import { z } from 'zod';

const nameSchema = z
  .string()
  .min(3, { message: 'Destination name must be at least 3 characters.' })
  .max(64, { message: 'Destination name cannot exceed 64 characters.' });

export const createDestinationSchema = z.object({
  name: nameSchema,
  country: z.string().min(2, { message: 'Country is required.' }),
  city: z.string().min(2, { message: 'City is required.' }),
  description: z.string().min(5, { message: 'Description is required.' }),
});

export const updateDestinationSchema = createDestinationSchema.partial();

export type DestinationFormData = z.infer<typeof createDestinationSchema>;
export type UpdateDestinationFormData = z.infer<typeof updateDestinationSchema>;
