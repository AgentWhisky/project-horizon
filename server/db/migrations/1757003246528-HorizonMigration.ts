import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1757003246528 implements MigrationInterface {
    name = 'HorizonMigration1757003246528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_app_audit" ADD "notes" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_app_audit" DROP COLUMN "notes"`);
    }

}
