import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Replaces all FAQ content with the v2 spec.
// Deletes all existing rows then inserts 38 entries with deterministic IDs.
// ON CONFLICT (id) DO NOTHING guards against concurrent cold-start execution.
//
// ID scheme:
//   00000000-gen1-4faq-8000-00000000000N  general (About page, N = 1–8)
//   00000000-env1-4faq-8000-00000000000N  environments (N = 1–5)
//   00000000-prp1-4faq-8000-00000000000N  props        (N = 1–5)
//   00000000-wpn1-4faq-8000-00000000000N  weapons      (N = 1–5)
//   00000000-hds1-4faq-8000-00000000000N  hard-surfaces (N = 1–5)
//   00000000-vra1-4faq-8000-00000000000N  vr-assets    (N = 1–5)
//   00000000-uef1-4faq-8000-00000000000N  uefn-roblox  (N = 1–5)

export const up = async ({ db }: MigrateUpArgs): Promise<void> => {
  await db.execute(sql`DELETE FROM "faqs";`)

  const result = await db.execute(sql`SELECT id, slug FROM "services" WHERE slug IN ('environments','props','weapons','hard-surfaces','vr-assets','uefn-roblox');`)
  const rows = (result as any).rows as { id: string; slug: string }[]
  const svc: Record<string, string> = {}
  for (const row of rows) svc[row.slug] = row.id

  // ── General FAQs — WORKING TOGETHER (Q1–Q6) ───────────────────────────────

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${'00000000-gen1-4faq-8000-000000000001'},${`How do you ensure assets match our art direction?`},${`We work from your reference package, existing asset library, and art bible. Before production scales we submit a style validation asset — one hero piece built to your exact visual direction. Production only continues after your Art Director has signed off. If the first asset isn't right, we rebuild it before moving forward.`},${'general'},${'working-together'},${1},now(),now()) ON CONFLICT (id) DO NOTHING;`)

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${'00000000-gen1-4faq-8000-000000000002'},${`How do reviews and feedback work?`},${`Each sprint cycle includes a structured feedback round. You review progress at agreed milestones, feedback is actioned within 24 hours, and we iterate until the asset meets your spec. We adapt to your existing review tools — Jira, Trello, Asana, or Slack. Your workflow, not ours.`},${'general'},${'working-together'},${2},now(),now()) ON CONFLICT (id) DO NOTHING;`)

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${'00000000-gen1-4faq-8000-000000000003'},${`How do you maintain quality across large asset batches?`},${`Every deliverable goes through an internal Art Director review before it leaves the studio. We check against your brief, reference, and technical spec — naming conventions, poly budgets, LOD specs, texture resolution. Lead artist approval is required on every asset. Nothing ships without it.`},${'general'},${'working-together'},${3},now(),now()) ON CONFLICT (id) DO NOTHING;`)

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${'00000000-gen1-4faq-8000-000000000004'},${`Can you work inside our existing pipeline?`},${`Yes. We onboard to your stack from day one — Perforce, Git LFS, Jira, ShotGrid, Slack, or Microsoft Teams. We follow your naming conventions, file structures, and delivery formats exactly. Zero integration overhead on your end.`},${'general'},${'working-together'},${4},now(),now()) ON CONFLICT (id) DO NOTHING;`)

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${'00000000-gen1-4faq-8000-000000000005'},${`Can you scale a team during production?`},${`Yes. We scale up or down per milestone — no long-term headcount commitment required. Our Dhaka production hub supports rapid scaling across environment art, hard surface, props, weapons, and VR disciplines. Share your production timeline at xqubestudio.com/scope and we'll confirm capacity on the call.`},${'general'},${'working-together'},${5},now(),now()) ON CONFLICT (id) DO NOTHING;`)

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${'00000000-gen1-4faq-8000-000000000006'},${`What time zones do you support?`},${`Vienna, Dubai, and Dhaka span nine time zones. While your team wraps for the day, ours is already into the next sprint. This gives EU and North American studios a continuous production cycle — 30–50% faster delivery across 80+ clients as a result.`},${'general'},${'working-together'},${6},now(),now()) ON CONFLICT (id) DO NOTHING;`)

  // ── General FAQs — GETTING STARTED (Q7–Q8) ───────────────────────────────

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${'00000000-gen1-4faq-8000-000000000007'},${`Do you sign NDAs?`},${`Yes, standard practice. Mention it when you scope your project at xqubestudio.com/scope or on the discovery call — we handle it before work begins.`},${'general'},${'getting-started'},${7},now(),now()) ON CONFLICT (id) DO NOTHING;`)

  await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","faq_group","order","updated_at","created_at") VALUES (${'00000000-gen1-4faq-8000-000000000008'},${`Who owns the intellectual property?`},${`Full IP transfer on completion. Everything we produce is yours — no licensing, no usage restrictions. XQube Studio GmbH is registered in Vienna, Austria. Contracts are clear under EU law.`},${'general'},${'getting-started'},${8},now(),now()) ON CONFLICT (id) DO NOTHING;`)

  // ── Environments (5 questions) ────────────────────────────────────────────
  if (svc['environments']) {
    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-env1-4faq-8000-000000000001'},${`How do you approach modular environment production?`},${`We design modular kits around your gameplay and reuse requirements first — not aesthetics. Tileables, trim sheets, and hero pieces are planned together so the kit scales without visual repetition. You get a library that a level designer can build with, not just a set of pretty assets.`},${'service-specific'},${svc['environments']},${'none'},${1},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-env1-4faq-8000-000000000002'},${`Can you match the visual style of our existing environment assets?`},${`Yes. We work from your existing asset library, style guide, and engine scene files before production begins. A style validation set is submitted first — one modular kit or hero piece built to your exact spec. Scaling only happens after your Art Director approves the direction.`},${'service-specific'},${svc['environments']},${'none'},${2},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-env1-4faq-8000-000000000003'},${`How do you handle engine-side setup — lighting, materials, post-processing?`},${`We deliver environments engine-ready — master materials, instanced variants, LODs, collision, and lightmap UVs all set up to your spec. If you need a fully lit and post-processed scene we handle that too. Deliverable scope is agreed in the brief.`},${'service-specific'},${svc['environments']},${'none'},${3},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-env1-4faq-8000-000000000004'},${`What's your process for large open-world or level-scale environments?`},${`We break large environments into modular production sprints — each sprint delivers a complete, reviewable section. You never wait until the end to see the full picture. Progress is visible at every milestone.`},${'service-specific'},${svc['environments']},${'none'},${4},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-env1-4faq-8000-000000000005'},${`How do you ensure performance targets are met?`},${`Draw call budgets, texture memory limits, and LOD chains are defined at the brief stage — not bolted on at the end. Every asset is profiled before delivery. If something doesn't hit your performance targets it gets fixed before it leaves the studio.`},${'service-specific'},${svc['environments']},${'none'},${5},now(),now()) ON CONFLICT (id) DO NOTHING;`)
  }

  // ── Props (5 questions) ───────────────────────────────────────────────────
  if (svc['props']) {
    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-prp1-4faq-8000-000000000001'},${`Can you handle both hero props and large background library production?`},${`Yes. We produce hero interactive assets and full background dressing libraries — often within the same engagement. Production pipelines are separated so hero quality doesn't slow down batch output and batch production doesn't lower hero standards.`},${'service-specific'},${svc['props']},${'none'},${1},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-prp1-4faq-8000-000000000002'},${`How do you maintain visual consistency across large prop libraries?`},${`We build a style guide and material library at the start of every prop engagement. All artists working on the batch work from the same reference, same material instances, and same texture resolution targets. Internal Art Director review before every delivery.`},${'service-specific'},${svc['props']},${'none'},${2},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-prp1-4faq-8000-000000000003'},${`Can you deliver physics, collision, and destruction variants?`},${`Yes. Physics setup, collision meshes, and destruction state variants are part of our standard prop pipeline. Specify in your brief what you need and it's scoped accordingly — nothing is assumed.`},${'service-specific'},${svc['props']},${'none'},${3},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-prp1-4faq-8000-000000000004'},${`What's your process for props that need to match existing in-game assets?`},${`Send us your existing assets and we reverse-engineer the style — poly density, UV layout, texture approach, material setup. Style validation prop submitted first. Production scales after approval.`},${'service-specific'},${svc['props']},${'none'},${4},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-prp1-4faq-8000-000000000005'},${`How do you handle naming conventions and folder structure?`},${`We follow yours exactly. Send us your naming convention doc and pipeline spec before production starts and we'll comply from the first asset. If you don't have one we can recommend a standard and document it for the engagement.`},${'service-specific'},${svc['props']},${'none'},${5},now(),now()) ON CONFLICT (id) DO NOTHING;`)
  }

  // ── Weapons (5 questions) ─────────────────────────────────────────────────
  if (svc['weapons']) {
    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-wpn1-4faq-8000-000000000001'},${`Can you match our existing weapon technical specifications?`},${`Yes. Poly budgets, UV layouts, texture resolution, LOD counts, and attachment socket placement — all followed to your spec. Send us your technical requirements doc and we build to it from day one.`},${'service-specific'},${svc['weapons']},${'none'},${1},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-wpn1-4faq-8000-000000000002'},${`Do you produce first-person and third-person LOD sets?`},${`Yes, both. First-person and third-person meshes have different poly budgets and silhouette requirements — we treat them as separate deliverables with their own review milestones. Attachment points and animation sockets included.`},${'service-specific'},${svc['weapons']},${'none'},${2},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-wpn1-4faq-8000-000000000003'},${`Can you work from concept art or reference images only?`},${`Yes. Concept art, photo reference, technical drawings, or a combination — we work from whatever you provide. If reference is sparse we'll flag gaps before production starts rather than guess and revise later.`},${'service-specific'},${svc['weapons']},${'none'},${3},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-wpn1-4faq-8000-000000000004'},${`How do you handle material variation and wear states?`},${`Wear, damage, and material variation are scoped at the brief stage. We use a layered Substance approach — clean, worn, and battle-damaged states built from the same master material so variants don't multiply your texture memory footprint.`},${'service-specific'},${svc['weapons']},${'none'},${4},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-wpn1-4faq-8000-000000000005'},${`What's your quality control process for weapons specifically?`},${`Every weapon goes through silhouette review, technical spec check, and in-engine integration test before delivery. We check first-person feel, third-person readability, and attachment point accuracy. Your AD gets a delivery report with each asset.`},${'service-specific'},${svc['weapons']},${'none'},${5},now(),now()) ON CONFLICT (id) DO NOTHING;`)
  }

  // ── Hard Surfaces (5 questions) ───────────────────────────────────────────
  if (svc['hard-surfaces']) {
    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-hds1-4faq-8000-000000000001'},${`Can you work from concept art, technical drawings, or photo references?`},${`Yes — all three. Concept art, orthographic technical drawings, manufacturer spec sheets, or photo reference. The more reference you provide the less iteration. If reference is incomplete we'll identify gaps before production starts.`},${'service-specific'},${svc['hard-surfaces']},${'none'},${1},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-hds1-4faq-8000-000000000002'},${`How do you handle hero vehicles versus background vehicle libraries?`},${`Hero vehicles get the full high-poly-to-low-poly pipeline with full PBR texture sets, multiple LODs, and damage variants. Background vehicles are produced at a lower poly budget with shared material instances to keep memory footprint manageable. Both can run in parallel.`},${'service-specific'},${svc['hard-surfaces']},${'none'},${2},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-hds1-4faq-8000-000000000003'},${`Do you produce damage and destruction state variants?`},${`Yes. Damage states, destruction variants, and modular component breakdowns are part of our hard surface pipeline. Scope them in your brief and they're produced alongside the base asset — not as a separate engagement.`},${'service-specific'},${svc['hard-surfaces']},${'none'},${3},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-hds1-4faq-8000-000000000004'},${`Can you handle both civilian and military vehicle specifications?`},${`Yes. We've produced civilian automotive assets for BMW and INDG and military assets across multiple client engagements. Material accuracy — paint, metal, glass, rubber — is treated differently for each category and referenced against real-world data.`},${'service-specific'},${svc['hard-surfaces']},${'none'},${4},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-hds1-4faq-8000-000000000005'},${`How do you ensure structural accuracy on complex machinery?`},${`We reference manufacturer data, technical documentation, and real-world photography at the blocking stage. A structural review is built into the pipeline before high-poly sculpting begins — catching proportion or accuracy issues early rather than after hours of detail work.`},${'service-specific'},${svc['hard-surfaces']},${'none'},${5},now(),now()) ON CONFLICT (id) DO NOTHING;`)
  }

  // ── VR Assets (5 questions) ───────────────────────────────────────────────
  if (svc['vr-assets']) {
    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-vra1-4faq-8000-000000000001'},${`Do you optimise separately for standalone VR and PC VR?`},${`Yes. Standalone VR (Meta Quest 2, 3, Pro) has significantly tighter poly, draw call, and texture budgets than PC VR (SteamVR, OpenXR). We produce separate LOD chains and texture sets for each target where needed — not a single asset stretched across both.`},${'service-specific'},${svc['vr-assets']},${'none'},${1},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-vra1-4faq-8000-000000000002'},${`How do you handle interaction-ready asset preparation?`},${`Grab points, physics colliders, and interaction anchors are set up to your XR framework spec — Unreal XR, Unity XRI, or custom. We work from your interaction system documentation so assets integrate without rework on your end.`},${'service-specific'},${svc['vr-assets']},${'none'},${2},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-vra1-4faq-8000-000000000003'},${`What's your process for hitting draw call and memory budgets?`},${`Budgets are defined at the brief stage, not the delivery stage. Every asset is profiled against your target hardware spec during production. If something is over budget it gets optimised before it leaves the studio — not flagged as a known issue on delivery.`},${'service-specific'},${svc['vr-assets']},${'none'},${3},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-vra1-4faq-8000-000000000004'},${`Can you produce assets for both new and existing VR projects?`},${`Yes. For new projects we establish the style and technical baseline from your brief. For existing projects we match your current asset library — poly density, material approach, texture resolution — before producing anything new.`},${'service-specific'},${svc['vr-assets']},${'none'},${4},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-vra1-4faq-8000-000000000005'},${`Have you shipped VR assets on commercial titles?`},${`Yes. Our team has produced VR assets across commercial projects for Meta Quest and PC VR platforms. Additional details including NDA-protected work are available on a discovery call. Book at calendly.com/tanvirkhandlxqsmgs.`},${'service-specific'},${svc['vr-assets']},${'none'},${5},now(),now()) ON CONFLICT (id) DO NOTHING;`)
  }

  // ── UEFN & Roblox (5 questions) ───────────────────────────────────────────
  if (svc['uefn-roblox']) {
    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-uef1-4faq-8000-000000000001'},${`What types of UEFN experiences do you focus on?`},${`We focus primarily on multiplayer, progression-driven, social, branded, and roleplay-oriented UEFN experiences. We've shipped a live Fortnite Creative island with Fresh TV, broadcast globally. We don't take on every brief — we focus on experiences where we can deliver the full pipeline end to end.`},${'service-specific'},${svc['uefn-roblox']},${'none'},${1},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-uef1-4faq-8000-000000000002'},${`Can you handle both art production and scripting on UEFN projects?`},${`Yes. UEFN island art production and Verse scripting are handled by the same team — game mechanics, UI, devices, and multiplayer systems. You don't need a separate developer to implement what we design.`},${'service-specific'},${svc['uefn-roblox']},${'none'},${2},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-uef1-4faq-8000-000000000003'},${`Can you handle both art and Lua scripting on Roblox projects?`},${`Yes. Roblox experience development covers art, Lua scripting, game systems, monetisation (game passes, developer products), and leaderboards. Full platform publish handled on our end.`},${'service-specific'},${svc['uefn-roblox']},${'none'},${3},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-uef1-4faq-8000-000000000004'},${`How do you handle platform-specific technical constraints on UEFN and Roblox?`},${`UEFN and Roblox both have strict asset budget, scripting, and platform compliance requirements. We build to those constraints from the brief stage — not as a final optimisation pass. Platform compliance is part of our internal review before any publish.`},${'service-specific'},${svc['uefn-roblox']},${'none'},${4},now(),now()) ON CONFLICT (id) DO NOTHING;`)

    await db.execute(sql`INSERT INTO "faqs" ("id","question","answer","category","service_id","faq_group","order","updated_at","created_at") VALUES (${'00000000-uef1-4faq-8000-000000000005'},${`Do you handle post-launch support and live operations?`},${`Yes. Post-launch patches, content updates, seasonal events, and live operation support are available as part of our ongoing engagement model. Scope it in your brief or discuss it on the discovery call at calendly.com/tanvirkhandlxqsmgs.`},${'service-specific'},${svc['uefn-roblox']},${'none'},${5},now(),now()) ON CONFLICT (id) DO NOTHING;`)
  }
}

export const down = async ({ db }: MigrateDownArgs): Promise<void> => {
  await db.execute(sql`DELETE FROM "faqs";`)
}
