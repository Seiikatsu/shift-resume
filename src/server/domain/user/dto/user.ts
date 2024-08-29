import {Validated} from 'validated-extendable';
import {z} from 'zod';
import {countriesUnion} from '~/server/domain/common/dto/countries';
import {urlSchema} from '~/server/domain/common/dto/url';

/**
 * General user object.
 * Contains a base set of personal information which is used within a resume as default.
 */
export const userSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  // base64 encoded profile image
  picture: z.string().nullable(),
  firstname: z.string(),
  lastname: z.string(),

  birthday: z.string().date(),

  email: z.string().email(),
  phone: z.string().nullable(),

  nationality: countriesUnion.nullable(),

  address: z.object({
    street: z.string(),
    postalCode: z.string(),
    city: z.string(),
    country: countriesUnion,
  }),

  webUrl: urlSchema.nullable(),
});

export class User extends Validated(userSchema) {

}
