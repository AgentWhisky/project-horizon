import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1757002640397 implements MigrationInterface {
    name = 'HorizonMigration1757002640397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_update_history" ADD "no_change_game" integer`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ADD "no_change_dlc" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_update_history" DROP COLUMN "no_change_dlc"`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" DROP COLUMN "no_change_game"`);
    }

}
