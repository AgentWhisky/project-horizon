import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1747597753399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
    await queryRunner.query(`CREATE INDEX "IDX_steam_apps_name_trgm" ON "steam_apps" USING gin (LOWER("name") gin_trgm_ops)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_steam_apps_name_trgm"`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS pg_trgm`);
  }
}
