import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonMigration1742831720133 implements MigrationInterface {
  name = 'HorizonMigration1742831720133';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "click_count"`);
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "last_updated"`);
    await queryRunner.query(`ALTER TABLE "link_tags" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "link_tags" ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "link_categories" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "link_categories" ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "links" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "links" ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "link_tags" DROP CONSTRAINT "UQ_4e78219466e135ddbb118721334"`);
    await queryRunner.query(`ALTER TABLE "link_tags" ALTER COLUMN "name" TYPE character varying(255)`);
    await queryRunner.query(`ALTER TABLE "link_tags" ADD CONSTRAINT "UQ_4e78219466e135ddbb118721334" UNIQUE ("name")`);
    await queryRunner.query(`ALTER TABLE "link_categories" DROP CONSTRAINT "UQ_f5c3ff35fcd7067dcadde521249"`);
    await queryRunner.query(`ALTER TABLE "link_categories" ALTER COLUMN "name" TYPE character varying(255)`);
    await queryRunner.query(`ALTER TABLE "link_categories" ADD CONSTRAINT "UQ_f5c3ff35fcd7067dcadde521249" UNIQUE ("name")`);
    await queryRunner.query(`ALTER TABLE "link_categories" ALTER COLUMN "description" TYPE character varying(255)`);
    await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "UQ_3f1ec0636d54a293469ea03f12c"`);
    await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "name" TYPE character varying(255)`);
    await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "UQ_3f1ec0636d54a293469ea03f12c" UNIQUE ("name")`);
    await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "description" TYPE character varying(255)`);
    await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "UQ_ff2e76673883ad4ea9f92fe32b8"`);
    await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "url" TYPE character varying(2048)`);
    await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "UQ_ff2e76673883ad4ea9f92fe32b8" UNIQUE ("url")`);
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "status"`);
    await queryRunner.query(`CREATE TYPE "public"."links_status_enum" AS ENUM('A', 'I')`);
    await queryRunner.query(`ALTER TABLE "links" ADD "status" "public"."links_status_enum" NOT NULL DEFAULT 'A'`);
    await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "thumbnail" TYPE character varying(2048)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "thumbnail"`);
    await queryRunner.query(`ALTER TABLE "links" ADD "thumbnail" character varying(512)`);
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."links_status_enum"`);
    await queryRunner.query(`ALTER TABLE "links" ADD "status" character NOT NULL DEFAULT 'A'`);
    await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "UQ_ff2e76673883ad4ea9f92fe32b8"`);
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "url"`);
    await queryRunner.query(`ALTER TABLE "links" ADD "url" character varying(256) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "UQ_ff2e76673883ad4ea9f92fe32b8" UNIQUE ("url")`);
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "links" ADD "description" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "UQ_3f1ec0636d54a293469ea03f12c"`);
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "links" ADD "name" character varying(256) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "UQ_3f1ec0636d54a293469ea03f12c" UNIQUE ("name")`);
    await queryRunner.query(`ALTER TABLE "link_categories" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "link_categories" ADD "description" character varying(256) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "link_categories" DROP CONSTRAINT "UQ_f5c3ff35fcd7067dcadde521249"`);
    await queryRunner.query(`ALTER TABLE "link_categories" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "link_categories" ADD "name" character varying(64) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "link_categories" ADD CONSTRAINT "UQ_f5c3ff35fcd7067dcadde521249" UNIQUE ("name")`);
    await queryRunner.query(`ALTER TABLE "link_tags" DROP CONSTRAINT "UQ_4e78219466e135ddbb118721334"`);
    await queryRunner.query(`ALTER TABLE "link_tags" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "link_tags" ADD "name" character varying(64) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "link_tags" ADD CONSTRAINT "UQ_4e78219466e135ddbb118721334" UNIQUE ("name")`);
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "updatedDate"`);
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "createdDate"`);
    await queryRunner.query(`ALTER TABLE "link_categories" DROP COLUMN "updatedDate"`);
    await queryRunner.query(`ALTER TABLE "link_categories" DROP COLUMN "createdDate"`);
    await queryRunner.query(`ALTER TABLE "link_tags" DROP COLUMN "updatedDate"`);
    await queryRunner.query(`ALTER TABLE "link_tags" DROP COLUMN "createdDate"`);
    await queryRunner.query(`ALTER TABLE "links" ADD "last_updated" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "links" ADD "click_count" integer NOT NULL DEFAULT '0'`);
  }
}
