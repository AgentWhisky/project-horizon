import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1730856168415 implements MigrationInterface {
    name = 'HorizonMigration1730856168415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "link_library" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "url" character varying(500) NOT NULL, "category" character varying(100) NOT NULL, "status" character(1) NOT NULL DEFAULT 'A', "tags" text, "thumbnail" character varying(500), "click_count" integer NOT NULL DEFAULT '0', "last_updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0a49969e3c280307a0172bfc08d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "link_library"`);
    }

}
