import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1748187424373 implements MigrationInterface {
    name = 'HorizonMigration1748187424373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_apps" ADD "is_adult" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_apps" DROP COLUMN "is_adult"`);
    }

}
