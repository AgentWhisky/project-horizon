import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1758726519051 implements MigrationInterface {
    name = 'HorizonMigration1758726519051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "dlc" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "dlc" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "packages" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "packages" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "content_descriptor_ids" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "content_descriptor_ids" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "developers" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "developers" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "publishers" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "publishers" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "categories" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "categories" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "genres" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "genres" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "screenshots" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "screenshots" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "movies" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "movies" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "achievements" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "achievements" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "package_groups" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "package_groups" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "demos" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "demos" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "demos" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "demos" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "package_groups" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "package_groups" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "achievements" SET DEFAULT '{"data": [], "total": 0}'`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "achievements" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "movies" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "movies" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "screenshots" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "screenshots" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "genres" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "genres" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "categories" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "categories" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "publishers" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "publishers" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "developers" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "developers" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "content_descriptor_ids" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "content_descriptor_ids" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "packages" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "packages" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "dlc" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "steam_apps" ALTER COLUMN "dlc" SET NOT NULL`);
    }

}
