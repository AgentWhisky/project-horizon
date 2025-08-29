import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1756501288829 implements MigrationInterface {
    name = 'HorizonMigration1756501288829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "end_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "notes" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "notes" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "end_time" SET NOT NULL`);
    }

}
