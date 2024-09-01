import { Migration } from '@mikro-orm/migrations';

export class Migration20240901092236 extends Migration {
  override up() {
    this.addSql(
      "create type \"resume_section_type\" as enum ('PERSONAL_INFORMATION', 'WORK_EXPERIENCE', 'CUSTOM');",
    );
    this.addSql(
      'create table "resume_sections" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "resume_id" uuid not null, "type" "resume_section_type" not null, "content" jsonb not null, constraint "resume_sections_pkey" primary key ("id"));',
    );

    this.addSql(
      'alter table "resume_sections" add constraint "resume_sections_resume_id_foreign" foreign key ("resume_id") references "resumes" ("id") on update cascade;',
    );
  }

  override down() {
    this.addSql('drop table if exists "resume_sections" cascade;');

    this.addSql('drop type "resume_section_type";');
  }
}
