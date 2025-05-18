import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1747589807617 implements MigrationInterface {
    name = 'HorizonMigration1747589807617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_3d615bab89d5d12ecc46cd9bdf" ON "steam_apps" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_3eae3751315eee7e7a6af11c32" ON "steam_apps" ("type") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3eae3751315eee7e7a6af11c32"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d615bab89d5d12ecc46cd9bdf"`);
    }

}
