import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonMigration1756495488644 implements MigrationInterface {
  name = 'HorizonMigration1756495488644';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "steam_app_audit" ADD "update_history_id" integer NOT NULL`);
    await queryRunner.query(`CREATE INDEX "IDX_274e80b2a7b5a98e8243d48eaf" ON "steam_app_audit" ("update_history_id") `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX steam_app_update_running_unique ON steam_update_history ((update_status)) WHERE update_status = 'R'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_274e80b2a7b5a98e8243d48eaf"`);
    await queryRunner.query(`ALTER TABLE "steam_app_audit" DROP COLUMN "update_history_id"`);

    await queryRunner.query(`DROP INDEX steam_app_update_running_unique`);
  }
}
