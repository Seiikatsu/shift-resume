import {z} from 'zod';

export const urlSchema = z.object({
  label: z.string(),
  href: z.string().url(),
})
