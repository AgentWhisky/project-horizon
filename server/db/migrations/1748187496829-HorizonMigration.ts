import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1748187496829 implements MigrationInterface {
    name = 'HorizonMigration1748187496829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_79bbe5341c897467bca95fa4dd" ON "steam_apps" ("is_adult") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_79bbe5341c897467bca95fa4dd"`);
    }

}
