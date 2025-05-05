import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1746485166325 implements MigrationInterface {
    name = 'HorizonMigration1746485166325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "steam_apps" ("appid" integer NOT NULL, "name" character varying NOT NULL, "last_modified" TIMESTAMP WITH TIME ZONE NOT NULL, "type" character varying NOT NULL, "required_age" integer, "is_free" boolean NOT NULL DEFAULT false, "recommendations_total" integer, "coming_soon" boolean, "release_date" character varying, "support_url" character varying, "support_email" character varying, "content_descriptor_notes" text, "dlc" integer array, "packages" integer array, "content_descriptor_ids" integer array, "developers" text array, "publishers" text array, "categories" text array, "genres" text array, "detailed_description" text, "about_the_game" text, "short_description" text, "supported_languages" text, "reviews" text, "legal_notice" text, "screenshots" jsonb, "movies" jsonb, "achievements" jsonb, "ratings" jsonb, "package_groups" jsonb, "demos" jsonb, "fullgame" jsonb, "header_image" text, "capsule_image" text, "capsule_imagev5" text, "website" text, "background_url" text, "background_raw_url" text, "pc_minimum" text, "pc_recommended" text, "mac_minimum" text, "mac_recommended" text, "linux_minimum" text, "linux_recommended" text, "supports_windows" boolean NOT NULL DEFAULT false, "supports_mac" boolean NOT NULL DEFAULT false, "supports_linux" boolean NOT NULL DEFAULT false, "currency" character varying, "initial_price" integer, "final_price" integer, "discount_percent" integer, "initial_formatted" character varying, "final_formatted" character varying, "metacritic_score" integer, "metacritic_url" character varying, "created_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d8e9e1a76265aad438f620caed0" PRIMARY KEY ("appid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "steam_apps"`);
    }

}
