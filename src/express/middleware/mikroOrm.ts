import { RequestContext } from '@mikro-orm/postgresql';
import type { NextFunction, Request, Response } from 'express';

import { logger } from '~/common/logger.server';
import { unknownCatchToPayload } from '~/common/unknownCatchToPayload';
import { getEntityManager } from '~/server/db';

const bindEntityManager = async (_req: Request, res: Response, next: NextFunction) => {
  async function nextWrapper() {
    // important to get the entity manager from the request context
    const localEm = RequestContext.getEntityManager();
    if (localEm === undefined) {
      // should not happen
      throw new Error(`Entity manager not found in request context`);
    }

    // start transaction manually as it seems like .transactional is not made for this use case
    await localEm.begin();
    next();
  }

  const em = await getEntityManager();
  // use provided utility to initiate a new entity manager for the current request
  await RequestContext.create(em, nextWrapper);

  res.on('error', () => {
    const localEm = RequestContext.getEntityManager();
    if (localEm !== undefined) {
      // ensure to rollback failed transactions so they are closed
      localEm.rollback().catch((error: unknown) => {
        logger.error(unknownCatchToPayload(error, 'Could not rollback transaction'));
      });
    }
  });

  res.on('finish', () => {
    const localEm = RequestContext.getEntityManager();
    if (localEm !== undefined) {
      // commit transactions at request end so everything that happened in the request is persisted
      localEm.commit().catch((error: unknown) => {
        logger.error(unknownCatchToPayload(error, 'Could not commit transaction'));
      });
    }
  });
};

export const mikroOrmMiddleware = (req: Request, res: Response, next: NextFunction) => {
  bindEntityManager(req, res, next).catch((error: unknown) => {
    logger.error(
      unknownCatchToPayload(error, 'Could not attach entity manager to request context'),
    );
    res.status(500).send({ error: 'Internal Server Error' });
  });
};
