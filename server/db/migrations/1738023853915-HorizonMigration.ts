import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1738023853915 implements MigrationInterface {
    name = 'HorizonMigration1738023853915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastLogin" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLogin"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "active"`);
    }

}
