import * as path from 'node:path';

import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';

import { env } from '~/common/env.server';

const JS_BASE_DIR = path.join(process.cwd(), 'dist', 'server', 'db');
const TS_BASE_DIR = path.join(process.cwd(), 'src', 'server', 'db');

export default defineConfig({
  host: env.DB_HOST,
  port: env.DB_PORT,
  dbName: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,

  extensions: [SeedManager, Migrator],

  migrations: {
    path: path.join(JS_BASE_DIR, 'migrations'),
    pathTs: path.join(TS_BASE_DIR, 'migrations'),
    tableName: 'migrations',
  },
  seeder: {
    path: path.join(JS_BASE_DIR, 'seeders'),
    pathTs: path.join(TS_BASE_DIR, 'seeders'),
  },
  entities: [path.join(JS_BASE_DIR, 'entities/*.js')],
  entitiesTs: [path.join(TS_BASE_DIR, 'entities/*.ts')],

  debug: true, // false for production
});
