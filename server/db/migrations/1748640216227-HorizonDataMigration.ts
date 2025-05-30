import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1748640216227 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add B-tree index on 'name' to both partitions
    await queryRunner.query(`CREATE INDEX "IDX_steam_apps_sfw_name_btree" ON "steam_apps_sfw" ("name")`);
    await queryRunner.query(`CREATE INDEX "IDX_steam_apps_nsfw_name_btree" ON "steam_apps_nsfw" ("name")`);

    // Add B-tree index on 'type' to both partitions
    await queryRunner.query(`CREATE INDEX "IDX_steam_apps_sfw_type_btree" ON "steam_apps_sfw" ("type")`);
    await queryRunner.query(`CREATE INDEX "IDX_steam_apps_nsfw_type_btree" ON "steam_apps_nsfw" ("type")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_steam_apps_nsfw_type_btree"`);
    await queryRunner.query(`DROP INDEX "IDX_steam_apps_sfw_type_btree"`);
    await queryRunner.query(`DROP INDEX "IDX_steam_apps_nsfw_name_btree"`);
    await queryRunner.query(`DROP INDEX "IDX_steam_apps_sfw_name_btree"`);
  }
}
