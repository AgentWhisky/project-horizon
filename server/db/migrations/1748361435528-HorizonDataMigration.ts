import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1748361435528 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update index name
    await queryRunner.query(`
        ALTER INDEX IF EXISTS idx_steam_games_name_sfw_trgm
        RENAME TO idx_steam_games_name_nsfw_trgm;
    `);

    // Add new covering index
    await queryRunner.query(`
      CREATE INDEX idx_steam_games_sfw_covering
      ON steam_apps (appid DESC)
      INCLUDE (name, header_image, short_description, categories)
      WHERE type = 'game' AND is_adult = false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert index name
    await queryRunner.query(`
        ALTER INDEX IF EXISTS idx_steam_games_name_sfw_trgm
        RENAME TO idx_steam_games_name_nsfw_trgm;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_steam_games_sfw_covering;
    `);
  }
}
