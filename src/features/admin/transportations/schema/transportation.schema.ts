import { z } from 'zod';

export const createTransportationSchema = z.object({
  companyName: z
    .string()
    .min(2, { message: 'Company name must be at least 2 characters.' })
    .max(64, { message: 'Company name cannot exceed 64 characters.' }),
  type: z.enum(['bus', 'hiAce'], {
    message: 'Transportation type is required.',
  }),
  class: z.enum(['Economy', 'VIP']).optional(),
  description: z
    .string()
    .min(5, { message: 'Description must be at least 5 characters.' })
    .optional(),
});

export const updateTransportationSchema = createTransportationSchema.partial();

// Types
export type TransportationFormData = z.infer<typeof createTransportationSchema>;
export type UpdateTransportationFormData = z.infer<
  typeof updateTransportationSchema
>;
