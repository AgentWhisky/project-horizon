import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1746667544401 implements MigrationInterface {
    name = 'HorizonMigration1746667544401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "steam_update_logs" ("id" SERIAL NOT NULL, "start_time" TIMESTAMP WITH TIME ZONE NOT NULL, "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, "success_count" integer NOT NULL, "failure_count" integer NOT NULL, "success_appids" integer array, "failure_appids" integer array, "notes" text, "created_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d52cd13f3b0f06a028c83f59ee9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "steam_update_logs"`);
    }

}
