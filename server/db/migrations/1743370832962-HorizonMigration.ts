import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1743370832962 implements MigrationInterface {
    name = 'HorizonMigration1743370832962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ADD "sortKey" character varying(12) NOT NULL DEFAULT 'zzz'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "sortKey"`);
    }

}
