import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1731293818615 implements MigrationInterface {
    name = 'HorizonMigration1731293818615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "link_tags" ("id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, CONSTRAINT "PK_aaf1cfe913fc81bc4fc3427d106" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "linkS" ("id" SERIAL NOT NULL, "name" character varying(256) NOT NULL, "description" text NOT NULL, "url" character varying(256) NOT NULL, "category" character varying(32) NOT NULL, "status" character(1) NOT NULL DEFAULT 'A', "thumbnail" character varying(512), "click_count" integer NOT NULL DEFAULT '0', "last_updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9509234efa7adc9ca6bf60e2997" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "link_library_tags" ("linkSId" integer NOT NULL, "linkTagsId" integer NOT NULL, CONSTRAINT "PK_510286dec33764821cb7693b335" PRIMARY KEY ("linkSId", "linkTagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ab4448b8bbdc23fec1b1bed142" ON "link_library_tags" ("linkSId") `);
        await queryRunner.query(`CREATE INDEX "IDX_74b2cbd12abbab10c96d940226" ON "link_library_tags" ("linkTagsId") `);
        await queryRunner.query(`ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_ab4448b8bbdc23fec1b1bed1425" FOREIGN KEY ("linkSId") REFERENCES "linkS"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_74b2cbd12abbab10c96d940226a" FOREIGN KEY ("linkTagsId") REFERENCES "link_tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_74b2cbd12abbab10c96d940226a"`);
        await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_ab4448b8bbdc23fec1b1bed1425"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74b2cbd12abbab10c96d940226"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab4448b8bbdc23fec1b1bed142"`);
        await queryRunner.query(`DROP TABLE "link_library_tags"`);
        await queryRunner.query(`DROP TABLE "linkS"`);
        await queryRunner.query(`DROP TABLE "link_tags"`);
    }

}
