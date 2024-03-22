import { MigrationInterface, QueryRunner } from 'typeorm';

export class New1711101638903 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DROP VIEW "test_task20240315"."thread_messages";

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
            F."mime",
            F."filename"
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
          R."utc_created_at" DESC;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DROP VIEW "test_task20240315"."thread_messages";

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
}
