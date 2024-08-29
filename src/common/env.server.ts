import 'dotenv/config';
import {z} from 'zod';

const envSchema = z.object({
  NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
  npm_package_version: z.string(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  SESSION_STORAGE_SECRET: z.string(),
})
  .transform(({npm_package_version, ...rest}) => {
    return {
      ...rest,
      VERSION: npm_package_version,
    }
  });

export const env = envSchema.parse(process.env);
