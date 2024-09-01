import { z } from 'zod';

import { countriesUnion } from '~/server/domain/common/dto/countries';
import { iso8601DateSchema } from '~/server/domain/common/dto/iso8601Date';

export const workExperience = z.object({
  company: z.string(),
  title: z.string().optional(),

  city: z.string().optional(),
  country: countriesUnion.optional(),

  from: iso8601DateSchema.optional(),

  to: iso8601DateSchema.optional(),

  description: z.string().optional(),
});

export type WorkExperience = z.infer<typeof workExperience>;
