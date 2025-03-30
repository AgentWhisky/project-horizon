import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1743308524937 implements MigrationInterface {
    name = 'HorizonMigration1743308524937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "thumbnail"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ADD "thumbnail" character varying(2048)`);
    }

}
