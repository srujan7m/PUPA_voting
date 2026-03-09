import { z } from 'zod';

export const voteSchema = z.object({
  teamId: z.number().int().positive('Invalid team ID'),
});

/** Formats Zod field errors into a single human-readable string. */
export function formatZodError(error: z.ZodError): string {
  return error.errors.map((e) => e.message).join(', ');
}
