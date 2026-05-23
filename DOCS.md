# Documentation Index

Every explainer / README file in this repo, with what it's for and who should read it. If you're looking for something specific, this is the map.

> Last updated: 2026-05-23 (v3.41)

---

## Root docs (read in this order if you're new)

| File | What it covers | Audience |
|------|----------------|----------|
| [`README.md`](./README.md) | Repo entry point — quick index, modules list, status. | Everyone, first read. |
| [`EXECUTIVE-SUMMARY.md`](./EXECUTIVE-SUMMARY.md) | Full platform overview — all 14 modules, 3 agents, user journey, dev phases. Broad and accessible. | Strategic / non-technical. |
| [`AiNSP_RnDev.md`](./AiNSP_RnDev.md) | MycoNet as a service — SPARK / THRIVE business model, revenue streams, agent flow. | Business / product. |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Implementation blueprint — module specs, SQL schema, roadmap, tech stack decisions. | Engineers. |
| [`techstack_AiNSP_RnDev.md`](./techstack_AiNSP_RnDev.md) | Technical architecture — event-driven flow, LISTEN/NOTIFY, hosting decisions. | Engineers. |
| [`EXECUTION-PLAN.md`](./EXECUTION-PLAN.md) | Project execution plan — milestones, sequencing. | Project leads. |
| [`CLEANUP.md`](./CLEANUP.md) | Historical refactor notes and dead-code removal logs. | Reference only. |
| [`CLAUDE.md`](./CLAUDE.md) | Coding-agent context — current architecture, what NOT to do, common commands. | AI coding agents + new engineers. |
| [`log.md`](./log.md) | Project change log — major decisions, module changes, version history. | Anyone wanting recent history. |
| [`DOCS.md`](./DOCS.md) | **This file.** | Everyone. |

---

## App-level docs

| File | What it covers |
|------|----------------|
| [`web/CONTRIBUTING.md`](./web/CONTRIBUTING.md) | How to contribute to a module without needing the whole codebase — quick start, project structure, role system, import conventions, deployment, PR style. |
| [`web/src/core/README.md`](./web/src/core/README.md) | Shared infrastructure — Supabase clients, role helpers, format helpers, pillars, project-status helpers, app shell. Imported by every module. |
| [`web/src/modules/README.md`](./web/src/modules/README.md) | Module folder index — one row per module with path, route, and one-liner. |

---

## Per-module READMEs

Each module is self-contained. Start with the module's README before touching its code.

| Module | Path | What it does |
|--------|------|-------------|
| **M00 Dashboard** | [`web/src/modules/m00-dashboard/README.md`](./web/src/modules/m00-dashboard/README.md) | Personal HUD — role badge, activity stats, quick links. |
| **M01 Network** | [`web/src/modules/m01-network/README.md`](./web/src/modules/m01-network/README.md) | Member directory with AI match scoring. |
| **M04 Blueprint** | [`web/src/modules/m04-blueprint/README.md`](./web/src/modules/m04-blueprint/README.md) | Community planning wizard grounded in RNF / Alchemy / RCOS / CLIPS, with AI scan. |
| **M05 Join** | [`web/src/modules/m05-join/README.md`](./web/src/modules/m05-join/README.md) | Onboarding flow, application, role roadmap. |
| **M06 Agreements** | [`web/src/modules/m06-agreements/README.md`](./web/src/modules/m06-agreements/README.md) | Collaboration proposals between members and projects. |
| **M07 Operations** | [`web/src/modules/m07-ops/README.md`](./web/src/modules/m07-ops/README.md) | Five-column Kanban for projects and deliverables, with drag-and-drop and the proposal-to-deliverable flow. |
| **M08 Contributions** | [`web/src/modules/m08-contributions/README.md`](./web/src/modules/m08-contributions/README.md) | Achievement badges and contribution history. |
| **M09 Governance** | [`web/src/modules/m09-governance/README.md`](./web/src/modules/m09-governance/README.md) | Proposals, voting, and decision layers. |
| **Home Portal** | [`web/src/modules/home/README.md`](./web/src/modules/home/README.md) | Public and member-facing community landing page. |
| **Admin** | [`web/src/modules/admin/README.md`](./web/src/modules/admin/README.md) | Admin-only user editor at `/admin/users` (role + lead_circles). |

---

## Archive (historical reference, not active code)

| File | What's there |
|------|--------------|
| [`archive/README.md`](./archive/README.md) | Maps old → new locations. |
| `archive/Modules/m1_comm_network/` | Original standalone Next.js v1 of the Community Network module (deployed to Vercel before the v2 consolidation). |
| `archive/Modules/m4_framework_wizard/` | Original standalone CDN-React framework wizard + the full source framework documents (RNF, RCOS, CLIPS, Community Alchemy Playbook). |
| `archive/Modules/design_handoff_portal_explainer/` | Design references for a future Welcome / Portal Explainer page. |
| `archive/Modules/MycoNetv1.0/` | v1 spec docs and attached assets. |

---

## Maintaining this index

Add a new row whenever you add a new top-level README or rename one. Keep entries one line — descriptions belong inside the file itself, not here.
