import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1748374678358 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cleanup Indexes
    await queryRunner.query(`DROP INDEX IF EXISTS idx_steam_games_name_trgm;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_steam_games_name_sfw_trgm;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_steam_games_sfw_covering;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate Indexes
    await queryRunner.query(`
      CREATE INDEX idx_steam_games_name_trgm
      ON steam_apps
      USING gin (LOWER(name) gin_trgm_ops)
      WHERE type = 'game';
    `);

    await queryRunner.query(`
      CREATE INDEX idx_steam_games_name_sfw_trgm
      ON steam_apps
      USING gin (LOWER(name) gin_trgm_ops)
      WHERE type = 'game' AND is_adult = false;
    `);

    await queryRunner.query(`
      CREATE INDEX idx_steam_games_sfw_covering
      ON steam_apps (appid DESC)
      INCLUDE (name, header_image, short_description, categories)
      WHERE type = 'game' AND is_adult = false;
    `);
  }
}
