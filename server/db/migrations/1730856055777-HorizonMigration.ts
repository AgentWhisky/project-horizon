import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1730856055777 implements MigrationInterface {
    name = 'HorizonMigration1730856055777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "library_link_entity" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "url" character varying(500) NOT NULL, "category" character varying(100) NOT NULL, "status" character(1) NOT NULL DEFAULT 'A', "tags" text, "thumbnail" character varying(500), "click_count" integer NOT NULL DEFAULT '0', "last_updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_09f2286e0ba43f863e48c0eab4d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "library_link_entity"`);
    }

}
