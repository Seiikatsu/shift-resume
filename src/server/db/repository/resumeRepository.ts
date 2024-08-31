import { EntityRepository } from '@mikro-orm/postgresql';

import type { DbResume } from '~/server/db/entities/dbResume';

export class ResumeRepository extends EntityRepository<DbResume> {}
