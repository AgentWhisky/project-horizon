import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1748637123243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update existing steam_apps table to old
    await queryRunner.query(`
        ALTER TABLE steam_apps RENAME TO steam_apps_old;
    `);

    // Recreate steam_apps for partition
    await queryRunner.query(`
        CREATE TABLE "steam_apps" (
            "appid" integer NOT NULL,
            "name" character varying NOT NULL,
            "last_modified" TIMESTAMP WITH TIME ZONE NOT NULL,
            "type" character varying NOT NULL,
            "required_age" integer,
            "is_free" boolean NOT NULL DEFAULT false,
            "recommendations_total" integer,
            "coming_soon" boolean,
            "release_date" character varying,
            "support_url" character varying,
            "support_email" character varying,
            "content_descriptor_notes" text,
            "dlc" integer array,
            "packages" integer array,
            "content_descriptor_ids" integer array,
            "developers" text array,
            "publishers" text array,
            "categories" text array,
            "genres" text array,
            "detailed_description" text,
            "about_the_game" text,
            "short_description" text,
            "supported_languages" text,
            "reviews" text,
            "legal_notice" text,
            "screenshots" jsonb,
            "movies" jsonb,
            "achievements" jsonb,
            "ratings" jsonb,
            "package_groups" jsonb,
            "demos" jsonb,
            "fullgame" jsonb,
            "header_image" text,
            "capsule_image" text,
            "capsule_imagev5" text,
            "website" text,
            "background_url" text,
            "background_raw_url" text,
            "pc_minimum" text,
            "pc_recommended" text,
            "mac_minimum" text,
            "mac_recommended" text,
            "linux_minimum" text,
            "linux_recommended" text,
            "supports_windows" boolean NOT NULL DEFAULT false,
            "supports_mac" boolean NOT NULL DEFAULT false,
            "supports_linux" boolean NOT NULL DEFAULT false,
            "currency" character varying,
            "initial_price" integer,
            "final_price" integer,
            "discount_percent" integer,
            "initial_formatted" character varying,
            "final_formatted" character varying,
            "metacritic_score" integer,
            "metacritic_url" character varying,
            "is_adult" boolean NOT NULL DEFAULT false,
            "created_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_steam_apps_composite" PRIMARY KEY ("appid", "is_adult")
        ) PARTITION BY LIST ("is_adult");
    `);

    // Create Partitions
    await queryRunner.query(`
      CREATE TABLE steam_apps_sfw PARTITION OF steam_apps FOR VALUES IN (false);
    `);
    await queryRunner.query(`
      CREATE TABLE steam_apps_nsfw PARTITION OF steam_apps FOR VALUES IN (true);
    `);

    // Create GIN Indexes
    await queryRunner.query(`CREATE INDEX "IDX_steam_apps_sfw_name_trgm" ON "steam_apps_sfw" USING gin (LOWER("name") gin_trgm_ops)`);
    await queryRunner.query(`CREATE INDEX "IDX_steam_apps_nsfw_name_trgm" ON "steam_apps_nsfw" USING gin (LOWER("name") gin_trgm_ops)`);

    // Copy data from old to new partitioned table
    await queryRunner.query(`
        INSERT INTO steam_apps (
            appid, name, last_modified, type, required_age, is_free, recommendations_total, coming_soon, release_date,
            support_url, support_email, content_descriptor_notes, dlc, packages, content_descriptor_ids, developers, publishers,
            categories, genres, detailed_description, about_the_game, short_description, supported_languages, reviews,
            legal_notice, screenshots, movies, achievements, ratings, package_groups, demos, fullgame, header_image, capsule_image,
            capsule_imagev5, website, background_url, background_raw_url, pc_minimum, pc_recommended, mac_minimum,
            mac_recommended, linux_minimum, linux_recommended, supports_windows, supports_mac, supports_linux,
            currency, initial_price, final_price, discount_percent, initial_formatted, final_formatted,
            metacritic_score, metacritic_url, is_adult, created_date, updated_date
        )
        SELECT
            appid, name, last_modified, type, required_age, is_free, recommendations_total, coming_soon, release_date,
            support_url, support_email, content_descriptor_notes, dlc, packages, content_descriptor_ids, developers, publishers,
            categories, genres, detailed_description, about_the_game, short_description, supported_languages, reviews,
            legal_notice, screenshots, movies, achievements, ratings, package_groups, demos, fullgame, header_image, capsule_image,
            capsule_imagev5, website, background_url, background_raw_url, pc_minimum, pc_recommended, mac_minimum,
            mac_recommended, linux_minimum, linux_recommended, supports_windows, supports_mac, supports_linux,
            currency, initial_price, final_price, discount_percent, initial_formatted, final_formatted,
            metacritic_score, metacritic_url, is_adult, created_date, updated_date
        FROM steam_apps_old;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
