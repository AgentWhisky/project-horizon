import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1748362655107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update index name
    await queryRunner.query(`
        ALTER INDEX IF EXISTS idx_steam_games_name_nsfw_trgm
        RENAME TO idx_steam_games_name_sfw_trgm;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert index name
    await queryRunner.query(`
        ALTER INDEX IF EXISTS idx_steam_games_name_nsfw_trgm
        RENAME TO idx_steam_games_name_sfw_trgm;
    `);
  }
}
