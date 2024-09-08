import 'dotenv/config';
import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
    npm_package_version: z.string(),

    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),

    SESSION_STORAGE_SECRET: z.string(),

    LOKI_ENABLED: z.boolean().default(false),
    LOKI_HOST: z.string().optional(),
    LOKI_PORT: z.coerce.number().optional(),
    LOKI_AUTH_USER: z.string().optional(),
    LOKI_AUTH_PASSWORD: z.string().optional(),
  })
  .refine(
    ({ LOKI_ENABLED, LOKI_HOST, LOKI_PORT }) => {
      if (LOKI_ENABLED) {
        return LOKI_HOST !== undefined && LOKI_PORT !== undefined;
      }
      return true;
    },
    {
      message: 'LOKI_ENABLED is true but LOKI_HOST or LOKI_PORT is not set',
      path: ['LOKI_HOST', 'LOKI_PORT'],
    },
  )
  .transform(({ npm_package_version, ...rest }) => {
    return {
      ...rest,
      APP_VERSION: npm_package_version,
    };
  });

export const env = envSchema.parse(process.env);
