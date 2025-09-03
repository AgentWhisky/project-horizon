import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1756911209378 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX steam_app_update_running_unique ON steam_update_history ((update_status)) WHERE update_status = 'R'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
