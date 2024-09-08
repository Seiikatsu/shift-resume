import { createLogger } from '@seiikatsu/logger';
import type { LoggerConfig } from '@seiikatsu/logger/dist/config';

import { env } from '~/common/env.server';

const lokiConfig: LoggerConfig['loki'] =
  env.LOKI_ENABLED && env.LOKI_HOST !== undefined
    ? {
        host: env.LOKI_HOST,
        auth:
          env.LOKI_AUTH_USER !== undefined && env.LOKI_AUTH_PASSWORD !== undefined
            ? {
                username: env.LOKI_AUTH_USER,
                password: env.LOKI_AUTH_PASSWORD,
              }
            : undefined,
      }
    : undefined;

export const logger = createLogger({
  serviceName: 'shift-resume',
  environment: env.NODE_ENV,
  serviceVersion: env.APP_VERSION,
  loki: lokiConfig,
});
