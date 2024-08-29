import {logger} from '~/common/logger.server';
import {unknownCatchToPayload} from '~/common/unknownCatchToPayload';
import {getOrm} from '~/server/db/orm';

export const connectToDb = async () => {
  try {
    await getOrm();
    logger.info('Connected to database');
  } catch (e) {
    logger.error(unknownCatchToPayload(e, 'Failed to connect to database'));
    process.exit(-1);
  }
};

export const disconnectDb = async () => {
  const orm = await getOrm();
  await orm.close();
  logger.info('Disconnected from MongoDB');
};
