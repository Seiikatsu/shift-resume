import {FlushMode, MikroORM} from '@mikro-orm/postgresql';
import {env} from '~/common/env.server';

let orm: MikroORM | null = null;
export const getOrm = async () => {
  if (orm === null) {
    orm = await MikroORM.init({
      host: env.DB_HOST,
      port: env.DB_PORT,
      dbName: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,

      debug: env.NODE_ENV === 'development',
      flushMode: FlushMode.COMMIT,

      entities: ['./dist/server/db/entities/*.js'],
      entitiesTs: ['./src/server/db/entities/*.ts'],
    });
  }
  return orm;
};
