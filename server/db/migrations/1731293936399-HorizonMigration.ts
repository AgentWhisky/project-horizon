import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1731293936399 implements MigrationInterface {
    name = 'HorizonMigration1731293936399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_ab4448b8bbdc23fec1b1bed1425"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab4448b8bbdc23fec1b1bed142"`);
        await queryRunner.query(`ALTER TABLE "link_library_tags" RENAME COLUMN "linkSId" TO "linksId"`);
        await queryRunner.query(`ALTER TABLE "link_library_tags" RENAME CONSTRAINT "PK_510286dec33764821cb7693b335" TO "PK_47a1e2a5024e847f5ea869edc33"`);
        await queryRunner.query(`CREATE TABLE "links" ("id" SERIAL NOT NULL, "name" character varying(256) NOT NULL, "description" text NOT NULL, "url" character varying(256) NOT NULL, "category" character varying(32) NOT NULL, "status" character(1) NOT NULL DEFAULT 'A', "thumbnail" character varying(512), "click_count" integer NOT NULL DEFAULT '0', "last_updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aa0b96f5676e4a33ae9e1053e2" ON "link_library_tags" ("linksId") `);
        await queryRunner.query(`ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_aa0b96f5676e4a33ae9e1053e2f" FOREIGN KEY ("linksId") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_aa0b96f5676e4a33ae9e1053e2f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aa0b96f5676e4a33ae9e1053e2"`);
        await queryRunner.query(`DROP TABLE "links"`);
        await queryRunner.query(`ALTER TABLE "link_library_tags" RENAME CONSTRAINT "PK_47a1e2a5024e847f5ea869edc33" TO "PK_510286dec33764821cb7693b335"`);
        await queryRunner.query(`ALTER TABLE "link_library_tags" RENAME COLUMN "linksId" TO "linkSId"`);
        await queryRunner.query(`CREATE INDEX "IDX_ab4448b8bbdc23fec1b1bed142" ON "link_library_tags" ("linkSId") `);
        await queryRunner.query(`ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_ab4448b8bbdc23fec1b1bed1425" FOREIGN KEY ("linkSId") REFERENCES "linkS"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
