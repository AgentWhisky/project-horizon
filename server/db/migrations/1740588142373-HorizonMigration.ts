import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1740588142373 implements MigrationInterface {
    name = 'HorizonMigration1740588142373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_74b2cbd12abbab10c96d940226a"`);
        await queryRunner.query(`CREATE TABLE "user_logs" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "active" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_773dbba6ad8ad2cdecfef243953" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rights" ("id" SERIAL NOT NULL, "name" character varying(30) NOT NULL, "internalName" character varying(30) NOT NULL, "description" text NOT NULL, "createdBy" integer, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" integer, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5e0a1183cb807bf9a0f311a8852" UNIQUE ("name"), CONSTRAINT "UQ_31ab7eb10b3125046057c9cc191" UNIQUE ("internalName"), CONSTRAINT "PK_afafc4832726585c98fff471fea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying(30) NOT NULL, "description" text NOT NULL, "createdBy" integer, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" integer, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("jti" character varying NOT NULL, "token" text NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_e532a5fe469da358494917ce2bf" PRIMARY KEY ("jti"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(30), "active" boolean NOT NULL DEFAULT true, "lastLogin" TIMESTAMP, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `);
        await queryRunner.query(`CREATE TABLE "link_categories" ("id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, "description" character varying(256) NOT NULL, CONSTRAINT "UQ_f5c3ff35fcd7067dcadde521249" UNIQUE ("name"), CONSTRAINT "PK_619b06191827fe5d0af03b9d7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_rights" ("rolesId" integer NOT NULL, "rightsId" integer NOT NULL, CONSTRAINT "PK_bdece9ebe12cd9e3d01c8c247a4" PRIMARY KEY ("rolesId", "rightsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4c7f20007b36e3485272b853c2" ON "role_rights" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e0f78189a45cf9071e3747a1ee" ON "role_rights" ("rightsId") `);
        await queryRunner.query(`CREATE TABLE "user_roles" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_38ffcfb865fc628fa337d9a0d4f" PRIMARY KEY ("usersId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_99b019339f52c63ae615358738" ON "user_roles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_13380e7efec83468d73fc37938" ON "user_roles" ("rolesId") `);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "link_tags" ADD CONSTRAINT "UQ_4e78219466e135ddbb118721334" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "UQ_3f1ec0636d54a293469ea03f12c" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "UQ_ff2e76673883ad4ea9f92fe32b8" UNIQUE ("url")`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_e7d9cd6d4f033f1411d5f15a295" FOREIGN KEY ("categoryId") REFERENCES "link_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_rights" ADD CONSTRAINT "FK_4c7f20007b36e3485272b853c2d" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_rights" ADD CONSTRAINT "FK_e0f78189a45cf9071e3747a1ee3" FOREIGN KEY ("rightsId") REFERENCES "rights"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_99b019339f52c63ae6153587380" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_13380e7efec83468d73fc37938e" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_74b2cbd12abbab10c96d940226a" FOREIGN KEY ("linkTagsId") REFERENCES "link_tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_74b2cbd12abbab10c96d940226a"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_13380e7efec83468d73fc37938e"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_99b019339f52c63ae6153587380"`);
        await queryRunner.query(`ALTER TABLE "role_rights" DROP CONSTRAINT "FK_e0f78189a45cf9071e3747a1ee3"`);
        await queryRunner.query(`ALTER TABLE "role_rights" DROP CONSTRAINT "FK_4c7f20007b36e3485272b853c2d"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_e7d9cd6d4f033f1411d5f15a295"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "UQ_ff2e76673883ad4ea9f92fe32b8"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "UQ_3f1ec0636d54a293469ea03f12c"`);
        await queryRunner.query(`ALTER TABLE "link_tags" DROP CONSTRAINT "UQ_4e78219466e135ddbb118721334"`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "category" character varying(32) NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_13380e7efec83468d73fc37938"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_99b019339f52c63ae615358738"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e0f78189a45cf9071e3747a1ee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c7f20007b36e3485272b853c2"`);
        await queryRunner.query(`DROP TABLE "role_rights"`);
        await queryRunner.query(`DROP TABLE "link_categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "rights"`);
        await queryRunner.query(`DROP TABLE "user_logs"`);
        await queryRunner.query(`ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_74b2cbd12abbab10c96d940226a" FOREIGN KEY ("linkTagsId") REFERENCES "link_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
