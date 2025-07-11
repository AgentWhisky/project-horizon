import { MigrationInterface, QueryRunner } from 'typeorm';

export class HorizonMigration1752193898267 implements MigrationInterface {
  name = 'HorizonMigration1752193898267';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);
    await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_e7d9cd6d4f033f1411d5f15a295"`);
    await queryRunner.query(`ALTER TABLE "role_rights" DROP CONSTRAINT "FK_4c7f20007b36e3485272b853c2d"`);
    await queryRunner.query(`ALTER TABLE "role_rights" DROP CONSTRAINT "FK_e0f78189a45cf9071e3747a1ee3"`);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_99b019339f52c63ae6153587380"`);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_13380e7efec83468d73fc37938e"`);
    await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_aa0b96f5676e4a33ae9e1053e2f"`);
    await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_74b2cbd12abbab10c96d940226a"`);

    // Drop legacy indexes
    await queryRunner.query(`DROP INDEX "public"."IDX_4c7f20007b36e3485272b853c2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e0f78189a45cf9071e3747a1ee"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_99b019339f52c63ae615358738"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_13380e7efec83468d73fc37938"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_aa0b96f5676e4a33ae9e1053e2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_74b2cbd12abbab10c96d940226"`);

    // Rename timestamp and relation columns (preserving data)
    await queryRunner.query(`ALTER TABLE "rights" RENAME COLUMN "internalName" TO "internal_name"`);
    await queryRunner.query(`ALTER TABLE "rights" RENAME COLUMN "createdDate" TO "created_date"`);
    await queryRunner.query(`ALTER TABLE "rights" RENAME COLUMN "updatedDate" TO "updated_date"`);

    await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "createdDate" TO "created_date"`);
    await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "updatedDate" TO "updated_date"`);

    await queryRunner.query(`ALTER TABLE "refresh_token" RENAME COLUMN "createdDate" TO "created_date"`);
    await queryRunner.query(`ALTER TABLE "refresh_token" RENAME COLUMN "updatedDate" TO "updated_date"`);
    await queryRunner.query(`ALTER TABLE "refresh_token" RENAME COLUMN "userId" TO "user_id"`);

    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "lastLogin" TO "last_login"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "createdDate" TO "created_date"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "updatedDate" TO "updated_date"`);

    await queryRunner.query(`ALTER TABLE "user_logs" RENAME COLUMN "userId" TO "user_id"`);
    await queryRunner.query(`ALTER TABLE "user_logs" RENAME COLUMN "createdDate" TO "created_date"`);
    await queryRunner.query(`ALTER TABLE "user_logs" RENAME COLUMN "updatedDate" TO "updated_date"`);

    await queryRunner.query(`ALTER TABLE "settings" RENAME COLUMN "createdDate" TO "created_date"`);
    await queryRunner.query(`ALTER TABLE "settings" RENAME COLUMN "updatedDate" TO "updated_date"`);

    await queryRunner.query(`ALTER TABLE "link_tags" RENAME COLUMN "createdDate" TO "created_date"`);
    await queryRunner.query(`ALTER TABLE "link_tags" RENAME COLUMN "updatedDate" TO "updated_date"`);

    await queryRunner.query(`ALTER TABLE "link_categories" RENAME COLUMN "createdDate" TO "created_date"`);
    await queryRunner.query(`ALTER TABLE "link_categories" RENAME COLUMN "updatedDate" TO "updated_date"`);

    await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "categoryId" TO "category_id"`);
    await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "sortKey" TO "sort_key"`);
    await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "createdDate" TO "created_date"`);
    await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "updatedDate" TO "updated_date"`);

    // Join table columns → rename for snake_case
    await queryRunner.query(`ALTER TABLE "role_rights" RENAME COLUMN "rolesId" TO "role_id"`);
    await queryRunner.query(`ALTER TABLE "role_rights" RENAME COLUMN "rightsId" TO "right_id"`);

    await queryRunner.query(`ALTER TABLE "user_roles" RENAME COLUMN "usersId" TO "user_id"`);
    await queryRunner.query(`ALTER TABLE "user_roles" RENAME COLUMN "rolesId" TO "role_id"`);

    await queryRunner.query(`ALTER TABLE "link_library_tags" RENAME COLUMN "linksId" TO "link_id"`);
    await queryRunner.query(`ALTER TABLE "link_library_tags" RENAME COLUMN "linkTagsId" TO "tag_id"`);

    // Drop and recreate constraints with correct column names
    await queryRunner.query(`ALTER TABLE "rights" DROP CONSTRAINT "UQ_31ab7eb10b3125046057c9cc191"`);
    await queryRunner.query(`ALTER TABLE "rights" ADD CONSTRAINT "UQ_bbb0c2a7de78ac0833919df6227" UNIQUE ("internal_name")`);

    // Fix primary keys for join tables
    await queryRunner.query(`ALTER TABLE "role_rights" DROP CONSTRAINT "PK_bdece9ebe12cd9e3d01c8c247a4"`);
    await queryRunner.query(
      `ALTER TABLE "role_rights" ADD CONSTRAINT "PK_c45276f6621c7222d198bd011de" PRIMARY KEY ("role_id", "right_id")`
    );

    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_38ffcfb865fc628fa337d9a0d4f"`);
    await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id")`);

    await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "PK_47a1e2a5024e847f5ea869edc33"`);
    await queryRunner.query(
      `ALTER TABLE "link_library_tags" ADD CONSTRAINT "PK_2a2b1624333994651039d2b7ec7" PRIMARY KEY ("link_id", "tag_id")`
    );

    // Recreate indexes for join tables
    await queryRunner.query(`CREATE INDEX "IDX_648bbcb774d36164d4b8f52868" ON "role_rights" ("role_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_29c3593e94f3bcc59f6123054d" ON "role_rights" ("right_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_1d901110a4054ea28efb1f3c37" ON "link_library_tags" ("link_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_c84e9f5f4964c9ada0e916b1a6" ON "link_library_tags" ("tag_id")`);

    // Recreate foreign keys
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "links" ADD CONSTRAINT "FK_42692729856abf63f8081f29394" FOREIGN KEY ("category_id") REFERENCES "link_categories"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "role_rights" ADD CONSTRAINT "FK_648bbcb774d36164d4b8f528681" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "role_rights" ADD CONSTRAINT "FK_29c3593e94f3bcc59f6123054da" FOREIGN KEY ("right_id") REFERENCES "rights"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_1d901110a4054ea28efb1f3c374" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_c84e9f5f4964c9ada0e916b1a63" FOREIGN KEY ("tag_id") REFERENCES "link_tags"("id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_c84e9f5f4964c9ada0e916b1a63"`);
    await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "FK_1d901110a4054ea28efb1f3c374"`);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
    await queryRunner.query(`ALTER TABLE "role_rights" DROP CONSTRAINT "FK_29c3593e94f3bcc59f6123054da"`);
    await queryRunner.query(`ALTER TABLE "role_rights" DROP CONSTRAINT "FK_648bbcb774d36164d4b8f528681"`);
    await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_42692729856abf63f8081f29394"`);
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4"`);

    // Drop indexes
    await queryRunner.query(`DROP INDEX "public"."IDX_c84e9f5f4964c9ada0e916b1a6"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1d901110a4054ea28efb1f3c37"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_29c3593e94f3bcc59f6123054d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_648bbcb774d36164d4b8f52868"`);

    // Restore primary keys
    await queryRunner.query(`ALTER TABLE "link_library_tags" DROP CONSTRAINT "PK_2a2b1624333994651039d2b7ec7"`);
    await queryRunner.query(
      `ALTER TABLE "link_library_tags" ADD CONSTRAINT "PK_47a1e2a5024e847f5ea869edc33" PRIMARY KEY ("linksId", "linkTagsId")`
    );

    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_23ed6f04fe43066df08379fd034"`);
    await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "PK_38ffcfb865fc628fa337d9a0d4f" PRIMARY KEY ("usersId", "rolesId")`);

    await queryRunner.query(`ALTER TABLE "role_rights" DROP CONSTRAINT "PK_c45276f6621c7222d198bd011de"`);
    await queryRunner.query(
      `ALTER TABLE "role_rights" ADD CONSTRAINT "PK_bdece9ebe12cd9e3d01c8c247a4" PRIMARY KEY ("rolesId", "rightsId")`
    );

    // Drop modified constraint
    await queryRunner.query(`ALTER TABLE "rights" DROP CONSTRAINT "UQ_bbb0c2a7de78ac0833919df6227"`);
    await queryRunner.query(`ALTER TABLE "rights" ADD CONSTRAINT "UQ_31ab7eb10b3125046057c9cc191" UNIQUE ("internalName")`);

    // Rename join columns back to camelCase
    await queryRunner.query(`ALTER TABLE "link_library_tags" RENAME COLUMN "tag_id" TO "linkTagsId"`);
    await queryRunner.query(`ALTER TABLE "link_library_tags" RENAME COLUMN "link_id" TO "linksId"`);

    await queryRunner.query(`ALTER TABLE "user_roles" RENAME COLUMN "role_id" TO "rolesId"`);
    await queryRunner.query(`ALTER TABLE "user_roles" RENAME COLUMN "user_id" TO "usersId"`);

    await queryRunner.query(`ALTER TABLE "role_rights" RENAME COLUMN "right_id" TO "rightsId"`);
    await queryRunner.query(`ALTER TABLE "role_rights" RENAME COLUMN "role_id" TO "rolesId"`);

    // Rename core entity columns back to camelCase
    await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "updated_date" TO "updatedDate"`);
    await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "created_date" TO "createdDate"`);
    await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "sort_key" TO "sortKey"`);
    await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "category_id" TO "categoryId"`);

    await queryRunner.query(`ALTER TABLE "link_categories" RENAME COLUMN "updated_date" TO "updatedDate"`);
    await queryRunner.query(`ALTER TABLE "link_categories" RENAME COLUMN "created_date" TO "createdDate"`);

    await queryRunner.query(`ALTER TABLE "link_tags" RENAME COLUMN "updated_date" TO "updatedDate"`);
    await queryRunner.query(`ALTER TABLE "link_tags" RENAME COLUMN "created_date" TO "createdDate"`);

    await queryRunner.query(`ALTER TABLE "settings" RENAME COLUMN "updated_date" TO "updatedDate"`);
    await queryRunner.query(`ALTER TABLE "settings" RENAME COLUMN "created_date" TO "createdDate"`);

    await queryRunner.query(`ALTER TABLE "user_logs" RENAME COLUMN "updated_date" TO "updatedDate"`);
    await queryRunner.query(`ALTER TABLE "user_logs" RENAME COLUMN "created_date" TO "createdDate"`);
    await queryRunner.query(`ALTER TABLE "user_logs" RENAME COLUMN "user_id" TO "userId"`);

    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "updated_date" TO "updatedDate"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "created_date" TO "createdDate"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "last_login" TO "lastLogin"`);

    await queryRunner.query(`ALTER TABLE "refresh_token" RENAME COLUMN "user_id" TO "userId"`);
    await queryRunner.query(`ALTER TABLE "refresh_token" RENAME COLUMN "updated_date" TO "updatedDate"`);
    await queryRunner.query(`ALTER TABLE "refresh_token" RENAME COLUMN "created_date" TO "createdDate"`);

    await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "updated_date" TO "updatedDate"`);
    await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "created_date" TO "createdDate"`);

    await queryRunner.query(`ALTER TABLE "rights" RENAME COLUMN "updated_date" TO "updatedDate"`);
    await queryRunner.query(`ALTER TABLE "rights" RENAME COLUMN "created_date" TO "createdDate"`);
    await queryRunner.query(`ALTER TABLE "rights" RENAME COLUMN "internal_name" TO "internalName"`);

    // Recreate original indexes
    await queryRunner.query(`CREATE INDEX "IDX_74b2cbd12abbab10c96d940226" ON "link_library_tags" ("linkTagsId")`);
    await queryRunner.query(`CREATE INDEX "IDX_aa0b96f5676e4a33ae9e1053e2" ON "link_library_tags" ("linksId")`);
    await queryRunner.query(`CREATE INDEX "IDX_13380e7efec83468d73fc37938" ON "user_roles" ("rolesId")`);
    await queryRunner.query(`CREATE INDEX "IDX_99b019339f52c63ae615358738" ON "user_roles" ("usersId")`);
    await queryRunner.query(`CREATE INDEX "IDX_e0f78189a45cf9071e3747a1ee" ON "role_rights" ("rightsId")`);
    await queryRunner.query(`CREATE INDEX "IDX_4c7f20007b36e3485272b853c2" ON "role_rights" ("rolesId")`);

    // Recreate original foreign keys
    await queryRunner.query(
      `ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_74b2cbd12abbab10c96d940226a" FOREIGN KEY ("linkTagsId") REFERENCES "link_tags"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "link_library_tags" ADD CONSTRAINT "FK_aa0b96f5676e4a33ae9e1053e2f" FOREIGN KEY ("linksId") REFERENCES "links"("id") ON DELETE CASCADE`
    );

    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_13380e7efec83468d73fc37938e" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_99b019339f52c63ae6153587380" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE`
    );

    await queryRunner.query(
      `ALTER TABLE "role_rights" ADD CONSTRAINT "FK_e0f78189a45cf9071e3747a1ee3" FOREIGN KEY ("rightsId") REFERENCES "rights"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "role_rights" ADD CONSTRAINT "FK_4c7f20007b36e3485272b853c2d" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE`
    );

    await queryRunner.query(
      `ALTER TABLE "links" ADD CONSTRAINT "FK_e7d9cd6d4f033f1411d5f15a295" FOREIGN KEY ("categoryId") REFERENCES "link_categories"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE`
    );
  }
}
