import { z } from 'zod';

/**
 * Validating string to be a valid birthday with the format yyyy-MM-dd.
 */
export const iso8601DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
