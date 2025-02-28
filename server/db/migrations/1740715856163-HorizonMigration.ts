import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1740715856163 implements MigrationInterface {
    name = 'HorizonMigration1740715856163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rights" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "rights" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updatedBy"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ADD "updatedBy" integer`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "createdBy" integer`);
        await queryRunner.query(`ALTER TABLE "rights" ADD "updatedBy" integer`);
        await queryRunner.query(`ALTER TABLE "rights" ADD "createdBy" integer`);
    }

}
