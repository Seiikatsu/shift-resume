import { getOrm } from '~/server/db/orm';

export const getEntityManager = async () => {
  return (await getOrm()).em;
};
