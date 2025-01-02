import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1733370360989 implements MigrationInterface {
    name = 'HorizonMigration1733370360989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "link_tags" ("id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, CONSTRAINT "PK_aaf1cfe913fc81bc4fc3427d106" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "link_categories" ("id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, "description" character varying(256) NOT NULL, CONSTRAINT "PK_619b06191827fe5d0af03b9d7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "links" ("id" SERIAL NOT NULL, "name" character varying(256) NOT NULL, "description" text NOT NULL, "url" character varying(256) NOT NULL, "status" character(1) NOT NULL DEFAULT 'A', "thumbnail" character varying(512), "click_count" integer NOT NULL DEFAULT '0', "last_updated" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" integer, CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "link_library_tags" ("linksId" integer NOT NULL, "linkTagsId" integer NOT NULL, CONSTRAINT "PK_47a1e2a5024e847f5ea869edc33" PRIMARY KEY ("linksId", "linkTagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aa0b96f5676e4a33ae9e1053e2" ON "link_library_tags" ("linksId") `);
        await queryRunner.query(`CREATE INDEX "IDX_74b2cbd12abbab10c96d940226" ON "link_library_tags" ("linkTagsId") `);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_e7d9cd6d4f033f1411d5f15a295" FOREIGN KEY ("categoryId") REFERENCES "link_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_aa0b96f5676e4a33ae9e1053e2f" FOREIGN KEY ("linksId") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_74b2cbd12abbab10c96d940226a" FOREIGN KEY ("linkTagsId") REFERENCES "link_tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_74b2cbd12abbab10c96d940226a"`);
        await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_aa0b96f5676e4a33ae9e1053e2f"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_e7d9cd6d4f033f1411d5f15a295"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74b2cbd12abbab10c96d940226"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aa0b96f5676e4a33ae9e1053e2"`);
        await queryRunner.query(`DROP TABLE "link_library_tags"`);
        await queryRunner.query(`DROP TABLE "links"`);
        await queryRunner.query(`DROP TABLE "link_categories"`);
        await queryRunner.query(`DROP TABLE "link_tags"`);
    }

}
