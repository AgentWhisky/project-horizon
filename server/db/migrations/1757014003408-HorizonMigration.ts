import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1757014003408 implements MigrationInterface {
    name = 'HorizonMigration1757014003408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_apps" ADD "active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_apps" DROP COLUMN "active"`);
    }

}
