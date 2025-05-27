import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1748358248504 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop old GIN index if it exists
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_steam_apps_name_trgm";
    `);

    // Recreate general name index
    await queryRunner.query(`
      CREATE INDEX idx_steam_apps_name_trgm
      ON steam_apps
      USING gin (LOWER(name) gin_trgm_ops);
    `);

    // Create name index for all games
    await queryRunner.query(`
      CREATE INDEX idx_steam_games_name_trgm
      ON steam_apps
      USING gin (LOWER(name) gin_trgm_ops)
      WHERE type = 'game';
    `);

    // Create name index for non-adult games
    await queryRunner.query(`
      CREATE INDEX idx_steam_games_name_nsfw_trgm
      ON steam_apps
      USING gin (LOWER(name) gin_trgm_ops)
      WHERE type = 'game' AND is_adult = false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_steam_games_name_nsfw_trgm`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_steam_games_name_trgm`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_steam_apps_name_trgm`);
  }
}
