import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1738478352333 implements MigrationInterface {
    name = 'HorizonMigration1738478352333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdDate"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedBy" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdBy" integer`);
    }

}
