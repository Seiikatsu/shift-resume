import {DateTime} from 'luxon';

import {getEntityManager} from '~/server/db';
import {DbResume} from '~/server/db/entities/dbResume';

type Input = {
  userId: string;
}

type Output = {
  resumeId: string;
};

export const createResume = async ({userId}: Input): Promise<Output> => {
  const resumeRepository = (await getEntityManager()).getRepository(DbResume);

  const dbResume = resumeRepository.create({
    owner: userId,
    title: `Resume ${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}`,
  });

  return {
    resumeId: dbResume.id,
  };
};
