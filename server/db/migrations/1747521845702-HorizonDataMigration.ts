import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1747521845702 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Clear existing achievements data to handle migration
    await queryRunner.query(`
      UPDATE steam_apps
      SET achievements = NULL
      WHERE achievements IS NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
