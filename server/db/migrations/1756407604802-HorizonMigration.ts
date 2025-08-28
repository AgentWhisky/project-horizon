import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1756407604802 implements MigrationInterface {
    name = 'HorizonMigration1756407604802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."steam_update_history_update_type_enum" AS ENUM('F', 'I')`);
        await queryRunner.query(`CREATE TABLE "steam_update_history" ("id" SERIAL NOT NULL, "update_type" "public"."steam_update_history_update_type_enum" NOT NULL DEFAULT 'F', "update_status" character varying NOT NULL DEFAULT 'P', "start_time" TIMESTAMP WITH TIME ZONE NOT NULL, "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, "inserts_game" integer NOT NULL DEFAULT '0', "updates_game" integer NOT NULL DEFAULT '0', "inserts_dlc" integer NOT NULL DEFAULT '0', "updates_dlc" integer NOT NULL DEFAULT '0', "errors" integer NOT NULL DEFAULT '0', "notes" text NOT NULL, "created_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_57ce5350d4e32a059668370636e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dba115fe50576b3500c2b7759f" ON "steam_update_history" ("update_type") `);
        await queryRunner.query(`CREATE INDEX "IDX_a111b17f723403f9afed2ec804" ON "steam_update_history" ("update_status") `);
        await queryRunner.query(`CREATE TYPE "public"."steam_app_audit_change_type_enum" AS ENUM('I', 'U', 'D')`);
        await queryRunner.query(`CREATE TABLE "steam_app_audit" ("id" SERIAL NOT NULL, "appid" integer NOT NULL, "change_type" "public"."steam_app_audit_change_type_enum" NOT NULL, "changes" jsonb NOT NULL, "created_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_4c0c151bb95bf73d87d3c6093ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_37ee92027ca597d035bd27b1cb" ON "steam_app_audit" ("appid") `);
        await queryRunner.query(`ALTER TABLE "steam_apps" ADD "validation_failed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steam_apps" DROP COLUMN "validation_failed"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37ee92027ca597d035bd27b1cb"`);
        await queryRunner.query(`DROP TABLE "steam_app_audit"`);
        await queryRunner.query(`DROP TYPE "public"."steam_app_audit_change_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a111b17f723403f9afed2ec804"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dba115fe50576b3500c2b7759f"`);
        await queryRunner.query(`DROP TABLE "steam_update_history"`);
        await queryRunner.query(`DROP TYPE "public"."steam_update_history_update_type_enum"`);
    }

}
