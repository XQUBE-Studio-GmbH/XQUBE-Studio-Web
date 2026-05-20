import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds drag-to-reorder support for portfolio items.
// The `portfolioOrder` array field on the `portfolio-page` global lets editors
// drag rows in the admin to control the display sequence on the portfolio page
// and homepage featured section.
//
// Two child tables are needed:
//   portfolio_page_portfolio_order          — main (published) rows
//   _portfolio_page_v_version_portfolio_order — version/draft rows
//
// Version child tables follow ERROR 22 pattern:
//   id serial PRIMARY KEY (not varchar) + _uuid varchar column.

export async function up({ db }: MigrateUpArgs): Promise<void> {

  // ── Main child table ──────────────────────────────────────────────────────

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "portfolio_page_portfolio_order" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "item_id"    integer
    );
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_page_portfolio_order_order_idx"     ON "portfolio_page_portfolio_order" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_page_portfolio_order_parent_id_idx" ON "portfolio_page_portfolio_order" USING btree ("_parent_id");`)

  // FK: _parent_id → portfolio_page.id
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_page_portfolio_order"
        ADD CONSTRAINT "portfolio_page_portfolio_order_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "portfolio_page"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // FK: item_id → portfolio.id
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "portfolio_page_portfolio_order"
        ADD CONSTRAINT "portfolio_page_portfolio_order_item_id_fk"
        FOREIGN KEY ("item_id") REFERENCES "portfolio"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── Version child table (ERROR 22: serial PK + _uuid) ────────────────────

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_portfolio_page_v_version_portfolio_order" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         serial PRIMARY KEY NOT NULL,
      "_uuid"      varchar,
      "item_id"    integer
    );
  `)

  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_portfolio_page_v_version_portfolio_order_order_idx"     ON "_portfolio_page_v_version_portfolio_order" USING btree ("_order");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_portfolio_page_v_version_portfolio_order_parent_id_idx" ON "_portfolio_page_v_version_portfolio_order" USING btree ("_parent_id");`)

  // FK: _parent_id → _portfolio_page_v.id
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_portfolio_page_v_version_portfolio_order"
        ADD CONSTRAINT "_portfolio_page_v_version_portfolio_order_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_portfolio_page_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // FK: item_id → portfolio.id
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_portfolio_page_v_version_portfolio_order"
        ADD CONSTRAINT "_portfolio_page_v_version_portfolio_order_item_id_fk"
        FOREIGN KEY ("item_id") REFERENCES "portfolio"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_portfolio_page_v_version_portfolio_order" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "portfolio_page_portfolio_order"             CASCADE;`)
}
