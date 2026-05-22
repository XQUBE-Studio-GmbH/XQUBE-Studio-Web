import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Converts "toolsUsed" on portfolio items from an array child table
// to a hasMany relationship stored in the standard Payload _rels table.
//
// Before: portfolio_tools_used (array child table)
//   _order, _parent_id, id (varchar UUID), tool_id
//
// After: portfolio_rels (_rels table for hasMany relationships on portfolio)
//   id (serial), order, parent_id, path, tools_id
//
// No data migration needed — portfolio_tools_used has 0 rows (field was
// created but never successfully populated due to the broken admin picker).
//
// Frontend access pattern also changes:
//   Before: item.toolsUsed[n].tool.name
//   After:  item.toolsUsed[n].name   (tool objects returned directly)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Drop the old array child table (empty — no data to migrate)
  await db.execute(sql`DROP TABLE IF EXISTS "portfolio_tools_used";`)

  // 2. Create the _rels table that Payload uses for hasMany relationships
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "portfolio_rels" (
      "id"        serial PRIMARY KEY NOT NULL,
      "order"     integer,
      "parent_id" integer NOT NULL,
      "path"      varchar NOT NULL,
      "tools_id"  integer
    );
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_rels_order_idx"    ON "portfolio_rels" USING btree ("order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_rels_parent_idx"   ON "portfolio_rels" USING btree ("parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_rels_path_idx"     ON "portfolio_rels" USING btree ("path");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_rels_tools_id_idx" ON "portfolio_rels" USING btree ("tools_id");`)

  // FK: parent_id → portfolio.id (cascade delete)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_rels"
        ADD CONSTRAINT "portfolio_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // FK: tools_id → tools.id (set null on tool deletion)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_rels"
        ADD CONSTRAINT "portfolio_rels_tools_fk"
        FOREIGN KEY ("tools_id") REFERENCES "public"."tools"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restore the old array child table (empty — no data to restore)
  await db.execute(sql`DROP TABLE IF EXISTS "portfolio_rels";`)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "portfolio_tools_used" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "tool_id"    integer
    );
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_tools_used_order_idx"  ON "portfolio_tools_used" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_tools_used_parent_idx" ON "portfolio_tools_used" USING btree ("_parent_id");`)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_tools_used"
        ADD CONSTRAINT "portfolio_tools_used_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_tools_used"
        ADD CONSTRAINT "portfolio_tools_used_tool_id_fk"
        FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
}
