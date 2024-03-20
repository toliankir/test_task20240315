import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1709584269452 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "test_task20240315"."messages" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(64) NOT NULL,
      "email" VARCHAR(64) NOT NULL,
      "homepage" VARCHAR(256),
      "parent_message_id" INT,
      "text" TEXT NOT NULL,
      "utc_created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
    );

    CREATE TABLE IF NOT EXISTS "test_task20240315"."files" (
      "id" SERIAL PRIMARY KEY,
      "filename" VARCHAR(128) NOT NULL,
      "mime" VARCHAR(128) NOT NULL,
      "data" BYTEA NOT NULL,
      "message_id" INT NOT NULL,
      "utc_created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
    CONSTRAINT "fk__file_message" FOREIGN KEY ("message_id") REFERENCES "test_task20240315"."messages" ("id") ON DELETE CASCADE
    );

    CREATE VIEW "test_task20240315"."thread_messages" AS 
      WITH RECURSIVE R AS (
        SELECT 
          E1."id",
          E1."name",
          E1."email",
          E1."homepage",
          E1."parent_message_id",
          E1."text",
          E1."utc_created_at",
          E1."id"::VARCHAR AS "path",
          E1."id" AS "thread_id"
        FROM "test_task20240315"."messages" AS E1
        WHERE E1."parent_message_id" IS NULL
      UNION
        SELECT 
          E2."id",
          E2."name", 
          E2."email",
          E2."homepage",
          E2."parent_message_id",
          E2."text",
          E2."utc_created_at",
          R."path" || ',' || e2."id" AS "path",
          R."thread_id" AS "thread_id"
        FROM "test_task20240315"."messages" AS E2
        INNER JOIN R ON E2."parent_message_id" = R."id"
    )
    SELECT 
      R."id",
      R."name", 
      R."email",
      R."homepage",
      R."parent_message_id",
      R."text",
      R."utc_created_at",
      R."path",
      R."thread_id"
    FROM R
    ORDER BY 
      "path" ASC,
      "utc_created_at" DESC;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    DROP VIEW "test_task20240315"."thread_messages";
    DROP TABLE "test_task20240315"."files";
    DROP TABLE "test_task20240315"."messages";
    `);
  }
}
