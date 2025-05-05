import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1746415734136 implements MigrationInterface {
    name = 'HorizonMigration1746415734136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_apps" DROP COLUMN "release_date"`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ADD "release_date" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_apps" DROP COLUMN "release_date"`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ADD "release_date" character varying`);
    }

}
