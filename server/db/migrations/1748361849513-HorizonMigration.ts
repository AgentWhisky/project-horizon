import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1748361849513 implements MigrationInterface {
    name = 'HorizonMigration1748361849513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // no-op: await queryRunner.query(`DROP INDEX "public"."idx_steam_games_sfw_covering"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // no-op: await queryRunner.query(`CREATE INDEX "idx_steam_games_sfw_covering" ON "steam_apps" ("appid", "categories", "header_image", "name", "short_description") WHERE (((type)::text = 'game'::text) AND (is_adult = false))`);
    }

}
