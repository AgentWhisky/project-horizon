import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1748361435528 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new covering index
    await queryRunner.query(`
      CREATE INDEX idx_steam_games_sfw_covering
      ON steam_apps (appid DESC)
      INCLUDE (name, header_image, short_description, categories)
      WHERE type = 'game' AND is_adult = false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_steam_games_sfw_covering;
    `);
  }
}
