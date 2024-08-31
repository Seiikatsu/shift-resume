import { Migration } from '@mikro-orm/migrations';

export class Migration20240829151022 extends Migration {

  override up(): void {
    this.addSql('create table "users" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "title" varchar(256) null, "firstname" varchar(256) not null, "lastname" varchar(256) not null, "birthday" varchar(256) not null, "nationality" varchar(256) null, "phone" varchar(256) null, "email" varchar(256) not null, "street_name" varchar(256) not null, "postal_code" varchar(256) not null, "city" varchar(256) not null, "country" varchar(256) not null, constraint "users_pkey" primary key ("id"));');
    this.addSql('create index "users_email_index" on "users" ("email");');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
  }

  override down(): void {
    this.addSql('drop table if exists "users" cascade;');
  }

}
