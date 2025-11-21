// features/user/profile/schemas/profile.schema.ts
import * as z from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required (min 2)'),
  lastName: z.string().min(2, 'Last name is required (min 2)'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional().nullable(),
  avatar: z.any().optional().nullable(), // file or string
});

export type ProfileFormType = z.infer<typeof profileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 chars'),
  confirmPassword: z.string().min(6, 'Confirm password'),
}).refine((data) => data.currentPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;
