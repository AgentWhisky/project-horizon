import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1755548705255 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "rights" ("id", "name", "internal_name", "description") VALUES 
        (6, 'Manage Steam Insight', 'MANAGE_STEAM_INSIGHT', 'Allows monitoring and managing steam insight')
        ON CONFLICT ("id") DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "rights" WHERE "id" IN (6);`);
  }
}
