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
    CONSTRAINT "uq__file_message" UNIQUE ("filename", "message_id"),
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
        E1."id" AS "thread_id",
        F."mime",
    F."filename"
      FROM "test_task20240315"."messages" AS E1
      LEFT JOIN "test_task20240315"."files" AS F ON F."message_id" = E1."id"
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
        R."thread_id" AS "thread_id",		  
        F."filename",
        F."mime"
      FROM "test_task20240315"."messages" AS E2
        LEFT JOIN "test_task20240315"."files" AS F ON F."message_id" = E2."id"
        INNER JOIN R ON E2."parent_message_id" = R."id"
    )
    SELECT 
      R."id",
      R."name", 
      R."email",
      R."homepage",
      R."parent_message_id",
      R."text",
      R."path",
      R."thread_id",
      R."utc_created_at",
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'filename', R."filename",
            'mime', R."mime"
        )) FILTER (WHERE R."filename" IS NOT NULL), '[]') AS "files"
    FROM R
      GROUP BY
      R."id",
      R."name", 
      R."email",
      R."homepage",
      R."parent_message_id",
      R."text",
      R."path",
      R."thread_id",
      R."utc_created_at"
    ORDER BY 
      R."path" ASC,
      R."utc_created_at" DESC;
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
