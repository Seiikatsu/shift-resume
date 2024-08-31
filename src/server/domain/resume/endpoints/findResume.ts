import { getEntityManager } from '~/server/db';
import { DbResume } from '~/server/db/entities/dbResume';
import { Resume } from '~/server/domain/resume/dto';

type Input = {
  userId: string;
  resumeId: string;
};

type Output = Resume | null;

export const findResume = async ({ userId, resumeId }: Input): Promise<Output> => {
  const resumeRepository = (await getEntityManager()).getRepository(DbResume);

  try {
    const dbResume = await resumeRepository.findOneOrFail({
      id: resumeId,
      owner: userId,
    });
    return new Resume({
      id: dbResume.id,
      title: dbResume.title,
      owner: dbResume.owner.id,
      createdAt: dbResume.createdAt,
      updatedAt: dbResume.updatedAt,
    });
  } catch {
    return null;
  }
};
