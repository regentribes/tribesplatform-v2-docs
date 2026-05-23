# MyCoNet v2 — Executive Summary

> Version: 3.01 | Date: 2026-05-21 | Status: ACTIVE — M00–M09 live

---

## What Is MyCoNet?

**MyCoNet** is a community operating system for regenerative neighborhoods — a single portal where a community can share its blueprint, onboard new members, manage active projects, create collaboration agreements, track contributions, and decide together.

**Current deployment:** A **single-community portal**. One community. One URL. All users are members or prospective members of the same project. The platform is not yet a multi-community marketplace — that comes in Phase 1. The vision is a modular ecosystem for 14 functional areas, from discovery to governance to AI coordination. The foundation is being built now.

---

## What's Live Today (Phase 0)

| Module | Status | What it does |
|---|---|---|
| M00 — Dashboard | ✅ Live | Personal home screen after login. Role-scoped view of all modules a member has access to. |
| M01 — Community Network | ✅ Live | Profiles, bio wizard, AI match scoring (values, skills, OCEAN, MBTI), discover page, offers/seeks. |
| M04 — Blueprint | ✅ Live | Shared community planning document. Admin uploads and edits. All members read. AI document scanning (MiniMax M2.7) fills fields from uploaded PDFs/docs. |
| M05 — Join | ✅ Live | Application form (questions set by admin in Blueprint step 1.4). Admin reviews submissions and accepts or declines. Accepted members get `joining` role. |
| M06 — Agreements | ✅ Live | Members with `joining` role or above propose collaboration on open projects — what they'll do and what they expect in return. Admin reviews, accepts, and tracks proposals through to completion. |
| M07 — Operations | ✅ Live | Admin creates and manages community projects, posts timeline updates, toggles open-for-collaborators status. |
| M08 — Contribution Tracking | ✅ Live | Achievements catalog. Profile Pioneer badge awarded at 100% profile completion. |
| M09 — Governance | ✅ Live | Proposals with 4 decision modes (Consent, Democracy, Meritocracy, AI). Consent/concern/object voting. Discussion threads. |
| M02 — Neighborhood Directory | 🔗 v1 link | Links out to v1 tribesplatform.app until v2 is built. |
| M03 — Resources & Tools | 🔗 v1 link | Links out to v1 tribesplatform.app until v2 is built. |
| M10–M13 | ⏳ Planned | See module table below. |

---

## Member Role Journey

Members progress through roles as they deepen their commitment to the community:

| Role | How you get it | What you can do |
|---|---|---|
| `explorer` | Creates account | View Blueprint (read-only), browse member profiles |
| `joining` | Join application accepted by admin | Everything above + submit collaboration proposals (M06) |
| `resident` | Manually assigned by admin | Everything above + full operations access, contribution tracking, governance |
| `circle_lead` | Assigned by admin | Resident access + can edit Blueprint sections for their circle |
| `project_lead` | Assigned by admin | Resident access + admin views for project management |
| `admin` | Assigned directly | Full access — edit Blueprint, manage roles, review all applications and agreements |

---

## The 14 Modules

| # | Module | Description | Status |
|---|---|---|---|
| 00 | MyCoNet Dashboard | Personal home screen — role-scoped view of every module a member has access to. Explorers see Blueprint and profiles. Admins see pending applications, agreements, and project stats. | ✅ Live |
| 01 | Community Network | Profile-based discovery with AI match scoring across values, skills, personality (OCEAN + MBTI), and archetypes. Offers and seeks exchange. | ✅ Live |
| 02 | Neighborhood Directory | Live map of regenerative neighborhoods — community profiles, posts, milestones, check-ins, guest book, events. | 🔗 v1 / Building |
| 03 | Resources & Tools | Curated, community-powered archive of regenerative resources and tools — smart-tagged by AI. | 🔗 v1 / Building |
| 04 | Blueprint | The Regenerative Neighborhood Wizard — shared community document covering SPARK → PROVE → BUILD → LIVE phases. Admin edits, all members read. AI document scanning fills fields. | ✅ Live |
| 05 | Join | Member application flow. Admin-configurable questions. Admin reviews submissions and accepts or declines. Accepted members gain access to M06. | ✅ Live |
| 06 | Agreements | Collaboration proposal system. Joining+ members browse open projects and submit proposals (what I'll do + what I expect). Admin reviews, accepts, and tracks through to completion. | ✅ Live |
| 07 | Operations | Community project management. Admin creates projects and posts timeline updates. Open projects surface in M06 for collaboration proposals. | ✅ Live |
| 08 | Contribution Tracking | Achievements catalog. Profile Pioneer badge awarded at 100% profile. Points and badges for contributions. | ✅ Live |
| 09 | Governance | Proposals with 4 decision modes (Consent ☉, Democracy ☑, Meritocracy △, AI ◇). Consent/concern/object voting (un-vote on re-click). Discussion threads per proposal. | ✅ Live |
| 10 | Genesis Bot | Telegram bot in the community group chat. Members request database changes; leadership approves in chat; MycoNet executes the write. | ⏳ Planned |
| 11 | Quinn | Personal AI guide per member — daily reminders, goal tracking, routing community info, helping each member participate at their best. | ⏳ Planned |
| 12 | MycoNet Agent | The community brain. Reads across all modules, connects the dots, pushes updates to leadership, runs the approval queue, keeps Genesis and Quinn informed. | ⏳ Planned |
| 13 | Hive | Inter-community layer — connecting neighborhoods into a living network for shared resources, collaboration, and mutual aid. | ⏳ Planned |

---

## How the Core Loop Works (Today)

```
ADMIN sets up community
  → Uploads governing documents to Blueprint (M04) — AI scans and fills fields
  → Sets join application questions in Blueprint step 1.4
  → Creates projects in Operations (M07)

NEW MEMBER signs up
  → Lands on Dashboard (M00) — sees Blueprint, member profiles, join prompt
  → Reads the community Blueprint (M04)
  → Submits join application (M05)

ADMIN reviews join application
  → Accepts → member gets 'joining' role
  → Member now sees collaboration proposals in Dashboard

JOINING MEMBER browses open projects (M06)
  → Submits proposal: what I'll do + what I expect in return

ADMIN reviews proposals (M06)
  → Accepts → Active → Completed
  → Project timeline updated in Operations (M07)
```

---

## Three Agents (Planned — Phase 4)

### Quinn — Personal AI (one per member)
Every member gets their own Quinn. It learns their goals, preferences, and community involvement — then proactively reminds, suggests, and helps them show up well.

### MycoNet — Community Brain (one per community)
The operating system layer for the whole community. Subscribes to every module event, maintains community memory, pushes real-time updates to leadership, and coordinates the approval queue.

### Genesis — Telegram Bridge (one per community)
The community's Telegram bot. Members interact with it in the Community Group to request changes, ask questions, and get confirmations. All requests require human approval before any database write.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL with Row Level Security |
| Hosting | Cloudflare Workers (via @opennextjs/cloudflare) |
| AI (Blueprint scanning) | MiniMax M2.7 |
| AI (future — Quinn, MycoNet, Governance) | Claude API (Anthropic) |
| Payments (planned) | Stripe |
| Telegram (planned) | node-telegram-bot-api |

---

## Development Phases

### Phase 0 — Single Community Portal ✅ Complete
One community. One portal. M00, M01, M04, M05, M06, M07 are live. Members progress from explorer → joining via the application flow. Admin manages everything through the same portal.

### Phase 0.5 — Member Experience + Governance ✅ Complete (v3.01)
M08 (contributions/achievements) and M09 (governance) live. AppShell with consistent top bar + side nav across all pages. Profile completion bar. Profile Pioneer badge at 100%. /home portal explainer.

### Phase 1 — Per-Community Rollout
Other regenerative projects adopt the platform. Each gets their own isolated portal — same codebase, same DB structure, scoped by `community_id`. Each community manages its own members, Blueprint, agreements, and operations independently.

### Phase 2 — Hive (Inter-Community Layer)
Once multiple communities are live, a shared container opens above the individual portals. Members can discover users and communities beyond their own project — cross-community discovery, shared resource libraries, mutual aid requests, inter-community collaboration. This is Module 13 (Hive).

### Phase 3 — Agent Stack
Genesis Bot (M10), Quinn personal AI (M11), MycoNet community brain (M12) — the intelligence layer that makes the platform feel alive and proactive.

---

## Service Model & Revenue

The platform follows a two-phase service model that maps to the community lifecycle.

### SPARK — Setup & Matching (community is still forming)

For communities with no land, no structures, no residents yet. Goal: find co-founders, create the blueprint, match with land, build, onboard first residents.

**Key modules:** M01, M02, M03, M04, M05, M06
**Exit condition:** First residents move in — community is "live"

| Revenue stream | Description |
|---|---|
| Resident Commission | Commission on residents who find the community through MycoNet and convert (invest or pay rent) |
| Setup & Onboarding Fee | One-time fee to set up the MycoNet portal and guide initial usage |
| MycoNet Pro | Agent-assisted premium — AI + human support for seamless onboarding |

### THRIVE — Operating System (community is live)

Operating system for running, growing, and governing the community. Always includes ongoing SPARK artifacts — new guest onboarding (M05) and new agreements (M06).

**Key modules:** M07, M08, M09, M10 (Genesis), M11 (Quinn), M12 (MycoNet), M13 (Hive)

| Revenue stream | Description |
|---|---|
| Platform Subscription | Monthly/annual fee for the MycoNet operating system |
| MycoNet Pro | Ongoing AI agent support for community management (cross-module push to leadership, 30-min heartbeat) |
| Hive Network Value | Communities benefit from aggregated learnings across the MycoNet network (M13) |

---

## Why This Platform Exists

Building a regenerative community is hard. You need to share your vision clearly, attract the right people, onboard them thoughtfully, run projects together, honor contributions, and make decisions collectively — all while the community is still forming.

Most tools are generic. None of them are built for the specific complexity of regenerative neighborhoods — where the goal is not just efficiency but regeneration, not just governance but ecological and social healing.

**MyCoNet is built for this.**

---

*Status: v3.01 live — M00–M09 deployed on Cloudflare Workers*
*Updated: 2026-05-23*
