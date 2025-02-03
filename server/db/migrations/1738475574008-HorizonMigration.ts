import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1738475574008 implements MigrationInterface {
    name = 'HorizonMigration1738475574008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "settings" ("id" SERIAL NOT NULL, "setting" character varying NOT NULL, "value" text NOT NULL, "createdBy" integer, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" integer, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c7a206507ccbe83fa29f3947892" UNIQUE ("setting"), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rights" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "rights" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`DROP TABLE "settings"`);
    }

}
