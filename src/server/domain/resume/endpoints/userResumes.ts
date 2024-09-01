import { getEntityManager } from '~/server/db';
import { DbResume } from '~/server/db/entities/dbResume';
import type { ResumeMetadata } from '~/server/domain/resume/dto';
import { resumeMetadataSchema } from '~/server/domain/resume/dto';

type Input = {
  userId: string;
};

type Output = ResumeMetadata[];

export const userResumes = async ({ userId }: Input): Promise<Output> => {
  const resumeRepository = (await getEntityManager()).getRepository(DbResume);

  const dbResumes = await resumeRepository.findAll({
    where: {
      owner: userId,
    },
  });

  return dbResumes.map((dbResume) => {
    return resumeMetadataSchema.parse({
      id: dbResume.id,
      owner: dbResume.owner.id,
      title: dbResume.title,
      createdAt: dbResume.createdAt,
      updatedAt: dbResume.updatedAt,
    });
  });
};
