import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1746980565512 implements MigrationInterface {
    name = 'HorizonMigration1746980565512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_update_logs" DROP COLUMN "created_count"`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" DROP COLUMN "updated_count"`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" ADD "created_game_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" ADD "created_dlc_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" ADD "updated_game_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" ADD "updated_dlc_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_update_logs" DROP COLUMN "updated_dlc_count"`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" DROP COLUMN "updated_game_count"`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" DROP COLUMN "created_dlc_count"`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" DROP COLUMN "created_game_count"`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" ADD "updated_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" ADD "created_count" integer NOT NULL DEFAULT '0'`);
    }

}
