import { EntityRepository } from '@mikro-orm/postgresql';

import type { DbResumeSection } from '~/server/db/entities/DbResumeSection';

export class ResumeSectionRepository extends EntityRepository<DbResumeSection> {}
