import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1748640574969 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "steam_apps_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
