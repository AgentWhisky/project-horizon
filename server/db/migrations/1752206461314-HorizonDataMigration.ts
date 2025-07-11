import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonDataMigration1752206461314 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Run query to build default sort keys
    await queryRunner.query(`
      WITH ordered_links AS (
        SELECT
          id,
          category_id,
          ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY id) AS rn
        FROM links
      )
      UPDATE links l
      SET sort_key = LPAD(TO_CHAR(ol.rn, 'FM9999'), 8, '0')
      FROM ordered_links ol
      WHERE l.id = ol.id;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
