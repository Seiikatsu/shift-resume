import {createLogger} from '@seiikatsu/logger';

import {env} from '~/common/env.server';

export const logger = createLogger({
  serviceName: 'shift-resume',
  environment: env.NODE_ENV,
  serviceVersion: env.APP_VERSION,
});
