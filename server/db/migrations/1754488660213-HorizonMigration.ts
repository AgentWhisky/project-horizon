import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1754488660213 implements MigrationInterface {
    name = 'HorizonMigration1754488660213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."links_contrast_background_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "links" ADD "contrast_background" "public"."links_contrast_background_enum" NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "contrast_background"`);
        await queryRunner.query(`DROP TYPE "public"."links_contrast_background_enum"`);
    }

}
