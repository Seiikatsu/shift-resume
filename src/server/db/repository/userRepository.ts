import {EntityRepository} from '@mikro-orm/postgresql';
import {DbUser} from '~/server/db/entities/dbUser';

export class UserRepository extends EntityRepository<DbUser> {

}
