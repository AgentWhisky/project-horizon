import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1741493869825 implements MigrationInterface {
    name = 'HorizonMigration1741493869825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_logs" RENAME COLUMN "active" TO "action"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_logs" RENAME COLUMN "action" TO "active"`);
    }

}
