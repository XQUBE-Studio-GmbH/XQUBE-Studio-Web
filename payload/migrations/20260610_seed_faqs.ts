import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { randomUUID } from 'crypto'

// Seeds FAQ content for the About page (general FAQs) and all 6 live service pages.
// Must run after 20260610_faqs_collection which creates the faqs table.
// Queries service IDs by slug at runtime — no hardcoded UUIDs needed.

export const up = async ({ db }: MigrateUpArgs): Promise<void> => {
  // ── Fetch live service IDs by slug ────────────────────────────────────────
  const result = await db.execute(sql`SELECT id, slug FROM "services" WHERE slug IN ('environments','props','weapons','hard-surfaces','vr-assets','uefn-roblox');`)
  const rows = (result as any).rows as { id: string; slug: string }[]
  const svc: Record<string, string> = {}
  for (const row of rows) svc[row.slug] = row.id

  // ── General FAQs — WHAT WE DO ─────────────────────────────────────────────

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What does XQUBE Studio do?`},${`XQUBE Studio GmbH is a production-grade AAA game art studio based in Vienna, Austria, with production hubs in Dubai and Dhaka. We deliver environment art, props, weapons, vehicles, VR assets, and UEFN/Roblox content for game studios worldwide.`},${'general'},${'what-we-do'},${0},now(),now());`)

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What platforms and engines do you work with?`},${`We work across Unreal Engine 5 (including Nanite, Lumen, and UEFN), Unity, Godot, Roblox, and Meta Quest. We match your pipeline — your naming conventions, LOD specs, and delivery format — zero integration overhead.`},${'general'},${'what-we-do'},${1},now(),now());`)

  // ── General FAQs — OUR WORK ───────────────────────────────────────────────

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What kind of clients do you work with?`},${`We work with indie studios, mid-size publishers, AAA co-development teams, and XR/simulation companies. If you have a production-grade brief and need reliable execution at scale, we are a fit.`},${'general'},${'our-work'},${2},now(),now());`)

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`Can I see examples of your work?`},${`Yes — our portfolio is at artstation.com/xqubestudio. It covers environments, props, weapons, vehicles, VR assets, and UEFN islands across a range of styles and production scales.`},${'general'},${'our-work'},${3},now(),now());`)

  // ── General FAQs — WORKING TOGETHER ──────────────────────────────────────

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`How do I start a project with XQUBE Studio?`},${`The fastest route is a 30-minute scoping call via calendly.com/tanvirkhandlxqsmgs. Alternatively, use the scope form at /scope to send a detailed brief — we reply within 24 hours with a tailored proposal.`},${'general'},${'working-together'},${4},now(),now());`)

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What engagement models do you offer?`},${`Three models: project-based (fixed scope, fixed delivery), monthly retainer (dedicated capacity, flexible scope), and embedded team (our artists in your pipeline, your tools and standups). We can combine models within a single contract.`},${'general'},${'working-together'},${5},now(),now());`)

  // ── General FAQs — GETTING STARTED ───────────────────────────────────────

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`How quickly can you start?`},${`For smaller briefs we can start within 48-72 hours. For larger productions requiring team allocation, lead time is typically 1-2 weeks. Book a call at calendly.com/tanvirkhandlxqsmgs to confirm current availability.`},${'general'},${'getting-started'},${6},now(),now());`)

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`Do you offer a pilot asset or trial engagement?`},${`Yes. We offer a single-asset pilot: you pay a fixed fee for one representative asset, and if you proceed the fee is credited to Month 1 of your retainer. Zero obligation to continue.`},${'general'},${'getting-started'},${7},now(),now());`)

  // ── Environments — service-specific FAQs ─────────────────────────────────
  if (svc['environments']) {
    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What types of game environments do you produce?`},${`We produce all environment categories — open-world biomes, urban and architectural interiors, fantasy and sci-fi worlds, modular dungeon and facility sets, and photoreal environments for simulation. We work in both bespoke and modular kit styles.`},${'service-specific'},${svc['environments']},${'none'},${0},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`Can you deliver Nanite and Lumen-ready environments for UE5?`},${`Yes. Our standard UE5 deliverable is Nanite-enabled mesh with Lumen-compatible lighting setup and World Partition integration where required. We also deliver equivalent assets for Unity HDRP and URP.`},${'service-specific'},${svc['environments']},${'none'},${1},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What is your typical delivery format for environments?`},${`We deliver as a packaged UE5 project or Unity package (depending on your engine), plus source files — FBX, full-resolution textures, and Substance Painter .spp files — with naming conventions matching your pipeline spec.`},${'service-specific'},${svc['environments']},${'none'},${2},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`How long does environment production typically take?`},${`A single hero environment (1,000-4,000 sqm) takes 4-8 weeks depending on complexity. A full modular biome kit takes 10-16 weeks. We scope this precisely once we have your brief — use the form at /scope.`},${'service-specific'},${svc['environments']},${'none'},${3},now(),now());`)
  }

  // ── Props — service-specific FAQs ────────────────────────────────────────
  if (svc['props']) {
    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`Do you produce individual hero props or full prop libraries?`},${`Both. We work on single hero props for cinematics and key gameplay moments, and on 50-200+ prop libraries for entire game environments. Library work benefits from shared material sets and consistent LOD strategies.`},${'service-specific'},${svc['props']},${'none'},${0},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What LOD and polycount targets do you work to?`},${`We match your engine and platform targets exactly. For UE5 with Nanite, we deliver full-res mesh. For traditional LODs, we work to your LOD0-LOD3 polycount budget per prop class — using your own spec sheet if supplied.`},${'service-specific'},${svc['props']},${'none'},${1},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What file formats do you deliver props in?`},${`Standard delivery is FBX for mesh, PNG/TGA for textures (or packed channel textures per your spec), and Substance Painter .spp source files. We can also deliver as a UE5 or Unity package ready to drop into your project.`},${'service-specific'},${svc['props']},${'none'},${2},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`Can you produce 100+ props for a single production?`},${`Yes — scalable library production is a core part of our work. We use standardised pipelines, shared material sets, and parallel artist streams to maintain quality at volume. Send your brief via /scope to discuss your timeline.`},${'service-specific'},${svc['props']},${'none'},${3},now(),now());`)
  }

  // ── Weapons — service-specific FAQs ──────────────────────────────────────
  if (svc['weapons']) {
    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`Do your weapon models include first-person and third-person variants?`},${`Yes. We deliver both FPS and TPS meshes, optimised for their respective camera distances and animation rigs. Each variant shares a unified texture set unless your pipeline requires separate material instances.`},${'service-specific'},${svc['weapons']},${'none'},${0},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`Can you produce weapon customisation systems?`},${`Yes. We model weapons as modular attachment systems (barrel, stock, grip, optic, magazine), set up material parameter collections for skin and camo variants, and deliver a structured socket hierarchy compatible with your animation blueprint.`},${'service-specific'},${svc['weapons']},${'none'},${1},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What is the standard delivery format for weapons?`},${`FBX with separate mesh parts for attachment modularity, PNG/TGA or packed textures, Substance Painter .spp source files, and an optional UE5 or Unity project package. We match your naming convention and bone naming schema.`},${'service-specific'},${svc['weapons']},${'none'},${2},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What engines do you deliver weapon assets for?`},${`We deliver primarily for Unreal Engine 5 and Unity, but can package for any engine that accepts FBX with standard PBR textures (Godot, UEFN, etc.). We adapt to your pipeline requirements.`},${'service-specific'},${svc['weapons']},${'none'},${3},now(),now());`)
  }

  // ── Hard Surfaces — service-specific FAQs ────────────────────────────────
  if (svc['hard-surfaces']) {
    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What types of vehicles and hard-surface assets do you produce?`},${`We produce ground vehicles (military, civilian, futuristic), aircraft, spacecraft, sci-fi mechs, and industrial machinery. We cover full photoreal exteriors, detailed interiors where required, and destruction and LOD states.`},${'service-specific'},${svc['hard-surfaces']},${'none'},${0},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`Do you include LOD chains and destruction states with vehicle models?`},${`Yes. Every vehicle delivery includes a full LOD chain (LOD0-LOD3 minimum), physics-ready collision meshes, and optional pre-fractured destruction states using Chaos or equivalent. LOD budgets are agreed at brief stage.`},${'service-specific'},${svc['hard-surfaces']},${'none'},${1},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`How do you approach mechanical accuracy in hard-surface assets?`},${`We combine photoreference libraries, technical drawings, and orthographic references to achieve engineering-accurate proportions where required. For fictional designs we work from your concept art, with one round of feedback built into the schedule.`},${'service-specific'},${svc['hard-surfaces']},${'none'},${2},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`Can you handle both exterior and interior detail on complex vehicles?`},${`Yes. Full interior packages (cockpits, crew compartments, engine bays) are scoped explicitly as a separate deliverable. Interior meshes are built for in-game camera distances — gameplay-accurate, not scan-accurate.`},${'service-specific'},${svc['hard-surfaces']},${'none'},${3},now(),now());`)
  }

  // ── VR Assets — service-specific FAQs ────────────────────────────────────
  if (svc['vr-assets']) {
    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What makes your VR assets different from standard game assets?`},${`VR has strict performance budgets — draw calls, polycount, and texture memory all affect comfort and frame rate more critically than on flat screens. We design for these constraints from the first blockout: LOD-conscious topology, texture atlas strategies, and occlusion-ready scene structure.`},${'service-specific'},${svc['vr-assets']},${'none'},${0},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What VR platforms do you target?`},${`Meta Quest (standalone), PC VR (OpenXR / SteamVR), and PlayStation VR2. Each has different GPU budgets. We scope your target platform at brief stage and deliver assets within its specific draw call, triangle, and texture constraints.`},${'service-specific'},${svc['vr-assets']},${'none'},${1},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`Can you produce interaction-ready props for Meta Quest?`},${`Yes. We deliver props with physics colliders, grip point annotations, and interactable mesh states (default, grabbed, broken). We work in Unity XR Toolkit and Unreal VR templates depending on your framework.`},${'service-specific'},${svc['vr-assets']},${'none'},${2},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`How do you keep VR assets within performance budgets?`},${`We use texture atlases to minimise draw calls, hand-baked normal maps to reduce live geometry, and engine-specific LOD strategies (e.g. Quest's aggressive LOD distances). We work to your specific draw call and triangle budgets per scene.`},${'service-specific'},${svc['vr-assets']},${'none'},${3},now(),now());`)
  }

  // ── UEFN / Roblox — service-specific FAQs ────────────────────────────────
  if (svc['uefn-roblox']) {
    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`What types of UEFN islands do you build for Fortnite?`},${`We build creative islands across all categories — deathmatches, zone wars, roleplay maps, parkour courses, and narrative experiences. We handle environment art, prop placement, lighting, and Verse scripting for gameplay logic.`},${'service-specific'},${svc['uefn-roblox']},${'none'},${0},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`Have you shipped live Fortnite UEFN islands?`},${`Yes. We have shipped published UEFN islands. Ask us to share examples and live codes during a scoping call at calendly.com/tanvirkhandlxqsmgs.`},${'service-specific'},${svc['uefn-roblox']},${'none'},${1},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`Do you handle both art and scripting for Roblox experiences?`},${`Yes. Our Roblox team covers environment art, UI, and Luau scripting. We can take a project from concept to published experience, or work within an existing Roblox place you own.`},${'service-specific'},${svc['uefn-roblox']},${'none'},${2},now(),now());`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${randomUUID()},${`How do you manage performance budgets for UEFN and Roblox?`},${`UEFN has strict island memory limits and Roblox has client render limits — both require proactive asset budgeting. We use Nanite-lite meshes in UEFN and draw call optimisation in Roblox to stay within published Epic and Roblox performance guidelines.`},${'service-specific'},${svc['uefn-roblox']},${'none'},${3},now(),now());`)
  }
}

export const down = async ({ db }: MigrateDownArgs): Promise<void> => {
  await db.execute(sql`DELETE FROM "faqs" WHERE "category" = 'general';`)
  await db.execute(sql`DELETE FROM "faqs" WHERE "category" = 'service-specific';`)
}
