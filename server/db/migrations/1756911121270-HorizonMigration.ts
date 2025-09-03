import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1756911121270 implements MigrationInterface {
    name = 'HorizonMigration1756911121270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."steam_app_update_running_unique"`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ADD "events" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "update_status" SET DEFAULT 'R'`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "inserts_game" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "inserts_game" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "updates_game" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "updates_game" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "inserts_dlc" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "inserts_dlc" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "updates_dlc" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "updates_dlc" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "errors" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "errors" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "errors" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "errors" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "updates_dlc" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "updates_dlc" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "inserts_dlc" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "inserts_dlc" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "updates_game" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "updates_game" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "inserts_game" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "inserts_game" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "update_status" SET DEFAULT 'P'`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" DROP COLUMN "events"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "steam_app_update_running_unique" ON "steam_update_history" ("update_status") WHERE ((update_status)::text = 'R'::text)`);
    }

}
