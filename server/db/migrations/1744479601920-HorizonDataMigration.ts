import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1744479601920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                INSERT INTO "rights" ("id", "name", "internalName", "description") VALUES 
                (5, 'Import Link Library', 'IMPORT_LINK_LIBRARY', 'Allows importing and rebuilding the link library')
                ON CONFLICT ("id") DO NOTHING;
              `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "rights" WHERE "id" = 5`);
  }
}
