import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1758575677832 implements MigrationInterface {
    name = 'HorizonMigration1758575677832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_update_history" DROP COLUMN "inserts_game"`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" DROP COLUMN "updates_game"`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" DROP COLUMN "inserts_dlc"`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" DROP COLUMN "updates_dlc"`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" DROP COLUMN "errors"`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" DROP COLUMN "no_change_game"`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" DROP COLUMN "no_change_dlc"`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ADD "stats" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_update_history" DROP COLUMN "stats"`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ADD "no_change_dlc" integer`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ADD "no_change_game" integer`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ADD "errors" integer`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ADD "updates_dlc" integer`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ADD "inserts_dlc" integer`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ADD "updates_game" integer`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ADD "inserts_game" integer`);
    }

}
