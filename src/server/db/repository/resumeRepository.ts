import {EntityRepository} from '@mikro-orm/postgresql';
import {DbResume} from '~/server/db/entities/dbResume';

export class ResumeRepository extends EntityRepository<DbResume> {

}
