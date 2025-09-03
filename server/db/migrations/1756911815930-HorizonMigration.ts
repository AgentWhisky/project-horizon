import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1756911815930 implements MigrationInterface {
    name = 'HorizonMigration1756911815930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "events" SET DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_update_history" ALTER COLUMN "events" DROP DEFAULT`);
        await queryRunner.query(`CREATE UNIQUE INDEX "steam_app_update_running_unique" ON "steam_update_history" ("update_status") WHERE ((update_status)::text = 'R'::text)`);
    }

}
