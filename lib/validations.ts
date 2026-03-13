import { z } from 'zod';

export const voteSchema = z.object({
  teamIds: z
    .array(z.number().int().positive('Invalid team ID'))
    .length(1, 'You can vote for only one team.')
    .refine((ids) => new Set(ids).size === ids.length, 'Duplicate team selections are not allowed.'),
});

export const teamUpdateSchema = z.object({
  teamName: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  teamMembers: z.string().max(1000).optional(),
  stallImages: z.array(z.string().url().or(z.string().startsWith('/'))).max(5).optional(),
  editPin: z.string().min(4).max(64).optional(),
  currentPin: z.string().optional(),
});

/** Formats Zod field errors into a single human-readable string. */
export function formatZodError(error: z.ZodError): string {
  return error.errors.map((e) => e.message).join(', ');
}
