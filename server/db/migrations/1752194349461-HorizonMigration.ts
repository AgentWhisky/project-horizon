import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonMigration1752194349461 implements MigrationInterface {
  name = 'HorizonMigration1752194349461';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role_rights" DROP CONSTRAINT "FK_648bbcb774d36164d4b8f528681"`);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
    await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_1d901110a4054ea28efb1f3c374"`);

    // Rename expiresAt to expires_at if not already snake_case
    await queryRunner.query(`ALTER TABLE "refresh_token" RENAME COLUMN "expiresAt" TO "expires_at"`);

    // Convert all columns to TIMESTAMPTZ (timestamp with time zone)
    await queryRunner.query(`ALTER TABLE "rights" ALTER COLUMN "created_date" TYPE TIMESTAMPTZ USING "created_date"::timestamptz`);
    await queryRunner.query(`ALTER TABLE "rights" ALTER COLUMN "updated_date" TYPE TIMESTAMPTZ USING "updated_date"::timestamptz`);

    await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "created_date" TYPE TIMESTAMPTZ USING "created_date"::timestamptz`);
    await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "updated_date" TYPE TIMESTAMPTZ USING "updated_date"::timestamptz`);

    await queryRunner.query(`ALTER TABLE "refresh_token" ALTER COLUMN "created_date" TYPE TIMESTAMPTZ USING "created_date"::timestamptz`);
    await queryRunner.query(`ALTER TABLE "refresh_token" ALTER COLUMN "updated_date" TYPE TIMESTAMPTZ USING "updated_date"::timestamptz`);
    await queryRunner.query(`ALTER TABLE "refresh_token" ALTER COLUMN "expires_at" TYPE TIMESTAMPTZ USING "expires_at"::timestamptz`);

    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_date" TYPE TIMESTAMPTZ USING "created_date"::timestamptz`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_date" TYPE TIMESTAMPTZ USING "updated_date"::timestamptz`);

    await queryRunner.query(`ALTER TABLE "user_logs" ALTER COLUMN "created_date" TYPE TIMESTAMPTZ USING "created_date"::timestamptz`);
    await queryRunner.query(`ALTER TABLE "user_logs" ALTER COLUMN "updated_date" TYPE TIMESTAMPTZ USING "updated_date"::timestamptz`);

    await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "created_date" TYPE TIMESTAMPTZ USING "created_date"::timestamptz`);
    await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "updated_date" TYPE TIMESTAMPTZ USING "updated_date"::timestamptz`);

    await queryRunner.query(`ALTER TABLE "link_categories" ALTER COLUMN "created_date" TYPE TIMESTAMPTZ USING "created_date"::timestamptz`);
    await queryRunner.query(`ALTER TABLE "link_categories" ALTER COLUMN "updated_date" TYPE TIMESTAMPTZ USING "updated_date"::timestamptz`);

    await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "created_date" TYPE TIMESTAMPTZ USING "created_date"::timestamptz`);
    await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "updated_date" TYPE TIMESTAMPTZ USING "updated_date"::timestamptz`);

    await queryRunner.query(`ALTER TABLE "link_tags" ALTER COLUMN "created_date" TYPE TIMESTAMPTZ USING "created_date"::timestamptz`);
    await queryRunner.query(`ALTER TABLE "link_tags" ALTER COLUMN "updated_date" TYPE TIMESTAMPTZ USING "updated_date"::timestamptz`);

    // Re-add dropped constraints
    await queryRunner.query(
      `ALTER TABLE "role_rights" ADD CONSTRAINT "FK_648bbcb774d36164d4b8f528681" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_1d901110a4054ea28efb1f3c374" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_1d901110a4054ea28efb1f3c374"`);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
    await queryRunner.query(`ALTER TABLE "role_rights" DROP CONSTRAINT "FK_648bbcb774d36164d4b8f528681"`);
    await queryRunner.query(`ALTER TABLE "link_tags" DROP COLUMN "updated_date"`);
    await queryRunner.query(`ALTER TABLE "link_tags" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "link_tags" DROP COLUMN "created_date"`);
    await queryRunner.query(`ALTER TABLE "link_tags" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "updated_date"`);
    await queryRunner.query(`ALTER TABLE "links" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "created_date"`);
    await queryRunner.query(`ALTER TABLE "links" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "sort_key"`);
    await queryRunner.query(`ALTER TABLE "links" ADD "sort_key" character varying(12) NOT NULL DEFAULT 'zzz'`);
    await queryRunner.query(`ALTER TABLE "link_categories" DROP COLUMN "updated_date"`);
    await queryRunner.query(`ALTER TABLE "link_categories" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "link_categories" DROP COLUMN "created_date"`);
    await queryRunner.query(`ALTER TABLE "link_categories" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "updated_date"`);
    await queryRunner.query(`ALTER TABLE "settings" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "created_date"`);
    await queryRunner.query(`ALTER TABLE "settings" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user_logs" DROP COLUMN "updated_date"`);
    await queryRunner.query(`ALTER TABLE "user_logs" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user_logs" DROP COLUMN "created_date"`);
    await queryRunner.query(`ALTER TABLE "user_logs" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_date"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_date"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "updated_date"`);
    await queryRunner.query(`ALTER TABLE "refresh_token" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "created_date"`);
    await queryRunner.query(`ALTER TABLE "refresh_token" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updated_date"`);
    await queryRunner.query(`ALTER TABLE "roles" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "created_date"`);
    await queryRunner.query(`ALTER TABLE "roles" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "rights" DROP COLUMN "updated_date"`);
    await queryRunner.query(`ALTER TABLE "rights" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "rights" DROP COLUMN "created_date"`);
    await queryRunner.query(`ALTER TABLE "rights" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "expires_at"`);
    await queryRunner.query(`ALTER TABLE "refresh_token" ADD "expiresAt" TIMESTAMP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_1d901110a4054ea28efb1f3c374" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role_rights" ADD CONSTRAINT "FK_648bbcb774d36164d4b8f528681" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }
}
