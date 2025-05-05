import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1746409537135 implements MigrationInterface {
    name = 'HorizonMigration1746409537135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_apps" ADD "demos" jsonb`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ADD "fullgame" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_apps" DROP COLUMN "fullgame"`);
        await queryRunner.query(`ALTER TABLE "steam_apps" DROP COLUMN "demos"`);
    }

}
