import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1746831979811 implements MigrationInterface {
    name = 'HorizonMigration1746831979811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_update_logs" ADD "created_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" ADD "updated_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" ALTER COLUMN "success_count" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" ALTER COLUMN "failure_count" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_update_logs" ALTER COLUMN "failure_count" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" ALTER COLUMN "success_count" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" DROP COLUMN "updated_count"`);
        await queryRunner.query(`ALTER TABLE "steam_update_logs" DROP COLUMN "created_count"`);
    }

}
