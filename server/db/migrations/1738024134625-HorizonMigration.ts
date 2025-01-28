import { MigrationInterface, QueryRunner } from "typeorm";

export class HorizonMigration1738024134625 implements MigrationInterface {
    name = 'HorizonMigration1738024134625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_rights" DROP CONSTRAINT "FK_e0f78189a45cf9071e3747a1ee3"`);
        await queryRunner.query(`ALTER TABLE "role_rights" ADD CONSTRAINT "FK_e0f78189a45cf9071e3747a1ee3" FOREIGN KEY ("rightsId") REFERENCES "rights"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_rights" DROP CONSTRAINT "FK_e0f78189a45cf9071e3747a1ee3"`);
        await queryRunner.query(`ALTER TABLE "role_rights" ADD CONSTRAINT "FK_e0f78189a45cf9071e3747a1ee3" FOREIGN KEY ("rightsId") REFERENCES "rights"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
