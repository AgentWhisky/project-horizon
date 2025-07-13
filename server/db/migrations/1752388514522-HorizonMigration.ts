import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1752388514522 implements MigrationInterface {
    name = 'HorizonMigration1752388514522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ADD "icon" character varying(2048) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "icon"`);
    }

}
