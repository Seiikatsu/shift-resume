import {Migration} from '@mikro-orm/migrations';

export class Migration20240829155956 extends Migration {

  override up() {
    this.addSql('create table "resumes" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "title" varchar(256) not null, "owner_id" uuid not null, constraint "resumes_pkey" primary key ("id"));');
    this.addSql('create index "resumes_title_index" on "resumes" ("title");');
    this.addSql('alter table "resumes" add constraint "resumes_title_unique" unique ("title");');

    this.addSql('alter table "resumes" add constraint "resumes_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');
  }

  override down() {
    this.addSql('drop table if exists "resumes" cascade;');
  }

}
