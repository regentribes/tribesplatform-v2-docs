# TribesPlatform v2

> AI-native operating system for regenerative neighborhoods.

> Last updated: 2026-05-23

## Quick Start

**New to the project?** Start with `EXECUTIVE-SUMMARY.md` — it covers what the platform is, all 14 modules, the three agents, and how it works. For a full index of every doc in the repo, see [`DOCS.md`](./DOCS.md).

## The Docs

Each document serves a different purpose. Read them in order.

| Document | What it's for |
|----------|---------------|
| [`DOCS.md`](./DOCS.md) | **Index of every README and explainer file** in the repo, grouped by location. Find anything fast. |
| `EXECUTIVE-SUMMARY.md` | **Start here.** Full platform overview — what it is, all 14 modules, 3 agents, user journey, development phases, tech stack. Broad and accessible. |
| `AiNSP_RnDev.md` | MycoNet as a service. SPARK/THRIVE business model, revenue streams, how the three agents work together, full approval flow. |
| `ARCHITECTURE.md` | Implementation blueprint — module specs, SQL schema, roadmap, tech stack decisions. For builders and engineers. |
| `techstack_AiNSP_RnDev.md` | Technical architecture — event-driven data flow, PostgreSQL LISTEN/NOTIFY, Telegram groups, Genesis↔MycoNet API, hosting decisions. |
| `CLAUDE.md` | Agent / new-engineer context — what's built, deployment, things NOT to do, common commands. |
| `log.md` | Project change log — tracks major decisions, module changes, architecture shifts over time. |
| [`web/CONTRIBUTING.md`](./web/CONTRIBUTING.md) | How to contribute to a single module without needing the whole codebase. |
| `README.md` | This file. Quick index and quick reference. |

## The 14 Modules

| # | Module | Purpose |
|---|--------|---------|
| 00 | MyCoNet Dashboard | Core team's real-time command center |
| 01 | Community Network | Profile discovery + AI matching |
| 02 | Neighborhood Directory | Live map of regenerative neighborhoods |
| 03 | Resources & Tools | Curated regenerative knowledge base |
| 04 | Blueprint | Guided planning wizard (SPARK → PROVE → BUILD → LIVE) |
| 05 | Join | Application and onboarding |
| 06 | Agreements | Digital contracts + Stripe payments |
| 07 | Operations | Projects, tasks, budgets |
| 08 | Contribution Tracking | Points, badges, reputation |
| 09 | Governance | AI-facilitated decisions and conflict resolution |
| 10 | Genesis Bot | Telegram bridge — DB change requests via chat |
| 11 | Quinn | Personal AI assistant per member |
| 12 | MycoNet Agent | Community brain — coordinates all agents and modules |
| 13 | Hive | Inter-community network layer |

## Three Agents

- **Quinn** (Module 11) — personal AI, daily reminders, routes member input
- **MycoNet** (Module 12) — community brain, pushes updates, maintains memory
- **Genesis** (Module 10) — Telegram bot, members request changes, leadership approves

## Links

- **Live Platform:** https://myconet.correa-oscar11.workers.dev

## Status

🟢 **v3.41 LIVE** — M00–M09 deployed on Cloudflare Workers as `myconet`. Recent: unified five-column Project Kanban with drag-and-drop, circles (5 pillars) on projects, agreement-acceptance auto-creates deliverables, admin users editor at `/admin/users`.
