import { getEntityManager } from '~/server/db';
import { DbResume } from '~/server/db/entities/dbResume';
import { Resume } from '~/server/domain/resume/dto';

type Input = {
  userId: string;
};

type Output = Resume[];

export const userResumes = async ({ userId }: Input): Promise<Output> => {
  const resumeRepository = (await getEntityManager()).getRepository(DbResume);

  const dbResumes = await resumeRepository.findAll({
    where: {
      owner: userId,
    },
  });

  return dbResumes.map((dbResume) => {
    return new Resume({
      id: dbResume.id,
      owner: dbResume.owner.id,
      title: dbResume.title,
      createdAt: dbResume.createdAt,
      updatedAt: dbResume.updatedAt,
    });
  });
};
