import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1752195269447 implements MigrationInterface {
    name = 'HorizonMigration1752195269447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "sort_key" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "sort_key" SET DEFAULT 'zzz'`);
    }

}
