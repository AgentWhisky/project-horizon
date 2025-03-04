import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1741036624328 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "rights" ("id", "name", "internalName", "description") VALUES 
            (1, 'View Dashboard', 'VIEW_DASHBOARD', 'Allows viewing the admin dashboard'),
            (2, 'Manage Users', 'MANAGE_USERS', 'Allows managing user accounts'),
            (3, 'Manage Roles', 'MANAGE_ROLES', 'Allows managing user roles'),
            (4, 'Manage Links', 'MANAGE_LINKS', 'Allows managing library links')
            ON CONFLICT ("id") DO NOTHING;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "rights" WHERE "id" IN (1, 2, 3, 4);`);
  }
}
