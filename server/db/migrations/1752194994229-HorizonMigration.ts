import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonMigration1752194994229 implements MigrationInterface {
  name = 'HorizonMigration1752194994229';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "sort_key" TYPE text`);
    await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "sort_key" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "sort_key"`);
    await queryRunner.query(`ALTER TABLE "links" ADD "sort_key" character varying(12) NOT NULL DEFAULT 'zzz'`);
  }
}
