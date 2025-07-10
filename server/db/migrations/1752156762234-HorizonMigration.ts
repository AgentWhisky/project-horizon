import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1752156762234 implements MigrationInterface {
    name = 'HorizonMigration1752156762234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."links_status_enum"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "status" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."links_status_enum" AS ENUM('A', 'I')`);
        await queryRunner.query(`ALTER TABLE "links" ADD "status" "public"."links_status_enum" NOT NULL DEFAULT 'A'`);
    }

}
