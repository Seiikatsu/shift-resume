import { EntityRepository } from '@mikro-orm/postgresql';

import type { DbUser } from '~/server/db/entities/dbUser';

export class UserRepository extends EntityRepository<DbUser> {}
