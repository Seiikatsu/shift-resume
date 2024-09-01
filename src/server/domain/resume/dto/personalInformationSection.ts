import { z } from 'zod';

import { countriesUnion } from '~/server/domain/common/dto/countries';

export const personalInformationSection = z.object({
  avatar: z.string().base64().optional(),
  showAvatar: z.boolean().optional(),

  title: z.string().optional(),

  firstname: z.string().optional(),
  lastname: z.string().optional(),

  birthday: z.string().date().optional(),

  description: z.string().optional(),

  email: z.string().email().optional(),
  phone: z.string().optional(),

  nationality: countriesUnion.optional(),

  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: countriesUnion.optional(),

  webUrl: z.string().optional(),
});

export type PersonalInformationSection = z.infer<typeof personalInformationSection>;
