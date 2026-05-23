# Handoff: MyCoNet Portal Explainer + Module Layouts

Two deliverables in this bundle:

1. **Portal Explainer (`portal-explainer.html`)** — A hi-fi, interactive marketing/onboarding
   page that introduces new and prospective members to the MyCoNet portal and walks them
   through every module they'll touch as they progress from `explorer` → `joining` → `resident`.
   Intended as the public-facing or post-signup welcome page **before** members land on the
   dashboard.

2. **Module Layouts (`module-layouts.html`)** — A design canvas with 8 full-screen layouts,
   one per live + planned module (M00 Dashboard, M01 Network, M04 Blueprint, M05 Join,
   M06 Agreements, M07 Operations, M08 Contributions, M09 Governance). Each artboard is a
   pixel-precise 1280×860 spec of the actual module UI — these are what the explainer is
   pointing at and what your codebase should ultimately render.

---

## About the design files

The files in this bundle are **design references created in HTML/JSX** — a working prototype
that shows intended look, copy, and interactions. They are **not production code** to copy
verbatim.

Your task is to **recreate these designs inside `tribesplatform-v2/web`** using the existing
Next.js 16 App Router patterns, the design tokens already in `src/app/globals.css`, the
`MODULES` registry in `src/lib/modules.ts`, and the `MODULE_META` colors in
`src/lib/module-meta.ts`. The prototype was built specifically against those tokens — most
values will map 1:1.

Suggested target location:
```
web/src/app/welcome/page.tsx              (or /portal-explainer/page.tsx)
web/src/app/welcome/WelcomeClient.tsx     (the interactive client component)
web/src/app/welcome/welcome.module.css    (optional, scoped styles)
```

The page should be public (accessible without auth), but personalized once signed in — pull
the user's first name from `user_profiles` instead of the hard-coded "Maya".

---

## Fidelity

**High-fidelity.** Colors, spacing, typography, and interactions are final. Recreate
pixel-faithfully using the existing design tokens. The only liberty: where the prototype
uses hard-coded SVG check icons, swap in your icon library of choice if you have one.

---

## Page structure (top → bottom)

The page is a single long-scroll narrative with the following sections in order. Every
section uses `max-width: 1180px; margin: 0 auto; padding: 110px 28px 0;` except hero/closing.

1. **Sticky top bar** — Logo + community name + nav links + "Hi, {name} →" CTA
2. **Hero** — Headline, lead, two CTAs
3. **Clubhouse Preview** — Browser-chrome wrapped dashboard mockup (the heart of the page)
4. **M01 — Meet residents** — Section header (left) + interactive demo (right)
5. **M04 — Blueprint** — Section header (right) + animated demo (left) — `reverse` layout
6. **M05 — Join + values agreement** — Section header (left) + interactive checklist (right)
7. **M06 — Browse projects + make agreement** — Section header (right) + clickable project list (left) — `reverse`
8. **M07 — Operations / deliverables** — Section header (left) + stats + checklist (right)
9. **M08 — Contributions** — Section header (right) + points + log form (left) — `reverse`
10. **M09 — Governance** — Full-width: 4 layer cards in a 2×2 grid above a proposal vote bar
11. **Closing CTA** — Gradient box, two buttons, footnote
12. **Footer** — Single line, monospace

---

## Section-by-section details

### 1. Sticky top bar

- Position: `sticky; top: 0; z-index: 50`
- Background: `color-mix(in srgb, var(--background) 85%, transparent)` with `backdrop-filter: saturate(180%) blur(14px)`
- Border-bottom: `1px solid var(--border)`
- Inner container: `max-width: 1180px; padding: 14px 28px; display: flex; justify-content: space-between`

**Logo mark** — 28×28px rounded square (radius 8px) with a radial-gradient using the
community's `--primary` color, two small white circles inset to suggest mycelial nodes.

**Nav links** — 13px, pill-shaped (`border-radius: 999px`), `padding: 8px 12px`. Default
color `var(--ink-3)`, hover `background: var(--bg-2)`, current `color: var(--ink)`.

**CTA pill** — `background: var(--accent)`, white text, `padding: 9px 16px`, hover
`filter: brightness(1.1)`. Reads `Hi, {firstName} →`.

### 2. Hero

- Container: `padding: 80px 28px 40px`
- **Pill** — 11px monospace eyebrow with pulsing dot (`--accent` color, 1.6s ping animation)
- **Headline** — `clamp(40px, 6vw, 68px)`, `line-height: 1.02`, `letter-spacing: -0.025em`,
  `max-width: 14ch`. Two-line structure:
  - "Welcome, {name}."
  - "This is the [digital clubhouse] for a regenerative neighborhood being formed
    — [together]."
  - "digital clubhouse" gets a yellow underline-highlight effect (linear-gradient background
    at 65% offset using `color-mix(in srgb, var(--accent) 28%, transparent)`)
  - "together" colored `var(--accent)`
- **Lead** — 18px, `var(--ink-2)`, `max-width: 56ch`, `text-wrap: pretty`
- **CTA row** — Two buttons:
  - Primary: `background: var(--ink)`, `color: var(--bg)`, "Take the tour →"
  - Secondary: `background: var(--surface)`, `border: 1px solid var(--rule)`, "I'm ready to join"

### 3. Clubhouse Preview (the centerpiece)

Wrapped in `max-width: 1180px` with side padding. Container has:
- `border-radius: var(--radius-xl)` (18px)
- `box-shadow: var(--shadow-lg)` (`0 12px 36px rgba(0,0,0,.08), 0 4px 10px rgba(0,0,0,.04)`)
- Subtle radial gradient overlay at the top using `--accent` at 8% opacity

**Browser chrome** — `padding: 12px 16px`, `background: var(--bg-2)`. Three traffic-light dots
(red `#ef5f57`, yellow `#f7bd2e`, green `#28c93f`), then a pill-shaped URL bar reading
`🔒 greenhollow.myco.net/dashboard`.

**Body grid** — `grid-template-columns: 230px 1fr` (collapses to single column under 880px)

**Sidebar (`.ch-side`)**
- `background: var(--bg-2)`, `border-right: 1px solid var(--rule)`, `padding: 22px 14px`
- Top: 36px circular gradient avatar with white initials, member name, role label in monospace
- Nav sections: `Clubhouse` (M00, M01, M04, M05 — explorer-accessible) and `Once you're in`
  (M06, M07, M08, M09 — dimmed at `opacity: 0.5`)
- Each nav item has a 4×14px color swatch + monospace `M0X` + name

**Main pane (`.ch-main`)**
- Greeting + sub-copy
- 3×3 grid of module cards (`.ch-grid`, `grid-template-columns: repeat(3, 1fr); gap: 12px`)
- Each card: `border-top accent-bar` (3px, module color), monospace `M0X` tag, badge/arrow,
  title, description. Hover: `translateY(-2px); box-shadow: var(--shadow-md)`.

Card content list — see `CH_CARDS` array in `explainer-app.jsx`.

### 4. M01 — Meet residents

**Layout** — Split: left column section header, right column demo card.

**Section header pattern** (reused 7 times — extract as `<SectionHeader>` component):
- Eyebrow pill (mod number + label, color-mixed background)
- `<h2 class="section-h">` — `clamp(28px, 3.6vw, 42px)`, `max-width: 22ch`
- Lead paragraph — 16px, `var(--ink-2)`, `max-width: 60ch`
- "Why" list — 3 rows, each with circular `--accent-soft` check icon

**Demo card** — Standard `.demo` frame:
- `background: var(--surface)`, `border: 1px solid var(--rule)`, `border-radius: var(--radius-lg)` (12px)
- `box-shadow: var(--shadow-lg)`, `padding: 22px`
- Header row with module tag pill + title + meta count

**Neighbor card** — 4 stacked cards. Each:
- 48px circular avatar (module color background, white initials)
- Name + match score pill (`--m1` amber)
- Location/role line (11.5px, `var(--ink-3)`)
- Chips — green `+ offers`, blue `? seeks` (background `color-mix` at 10%)

Residents listed: Ana Whitewater (92%), Eli Tanaka (81%), Priya Mahesh (76%), Diego Solá (68%).

### 5. M04 — Blueprint

**Layout** — `reverse` split (demo left, header right).

**Phase tracker** — 4 cells side by side:
- SPARK: `.done` — light amber tint
- PROVE: `.active` — solid `--m4` with shadow
- BUILD, LIVE: default surface

**Pillar bars** — 5 rows of `grid: 92px 1fr 32px`:
- Label, animated progress bar, monospace score (e.g. `4.2/5`)
- Bar fills from 0% to actual percent over 1.2s when section scrolls into view
  (use `IntersectionObserver` with `threshold: 0.3`)
- Fill color: `var(--m4)`

Pillars: Ecology 4.2, Social 3.6, Economy 2.3, Hardware 2.8, Governance 3.4.

**Next-gate callout** — Soft `--m4` tinted background, 12px font:
> **Next gate:** Economy must reach 3.0 before BUILD phase unlocks. The team is looking for funding-strategy contributors.

### 6. M05 — Join + values agreement

**Layout** — Standard split (header left, demo right).

**5 value rows** — `<div class="value-row">` each with:
- 20×20px rounded checkbox (left, 6px radius)
- Title (13.5px, semibold) + description (12px, ink-3)
- Click anywhere on row to toggle

States:
- Unchecked: white background, gray border
- `.checked`: `background: color-mix(in srgb, var(--m5) 6%, var(--surface))`, green border,
  filled green box with white check
- Hover: green border tint

**Value statements** (exact copy):
1. "Care for the land before yield." — Decisions are tested against ecological impact first, profit second.
2. "Consent over consensus." — We seek no objections, not unanimous applause. Move forward if good enough for now.
3. "Show up, don't just sign up." — Logged contributions matter more than promises. Reputation is earned in the doing.
4. "Disagree out loud, decide in writing." — Bring the hard things to the circle. What we decide goes in the Blueprint.
5. "Leave it better." — Land, people, money — whatever you touch, leave it more alive than you found it.

**CTA button** at bottom — disabled until all 5 checked. Reads `Sign {n} more to continue`
or `Submit application →`.

State: `const [checked, setChecked] = useState([false, false, false, false, false])`

### 7. M06 — Browse projects + make agreement

**Layout** — `reverse` split.

**Project list** — 3 cards (`.proj-card`). Click to select. Selected card:
- `border-color: var(--m6)`
- `box-shadow: 0 0 0 3px color-mix(in srgb, var(--m6) 12%, transparent)`
- Expands to reveal `.agreement` form below the content

**Project card content**:
- Title row: project name + "● Open" pill (green) for open projects
- 12px description
- Needs chips (gray)

**Agreement form** — Dashed `--m6` border, soft `--m6` background:
- Field 1: "What I'll contribute" — textarea
- Field 2: "What I expect in return" — text input
- Submit button — solid `--m6`, white text

On submit: replace form with `<Check/> Submitted for review. The project lead will respond in 48h.`

Projects:
1. **Greywater wetlands install** (open) — needs Earthworks, Plumbing, 3 weekends
2. **Funding circle, round 2** — needs Network access, Pitch help, Legal review
3. **Onboarding new residents (Q3)** — needs Facilitation, Hospitality

### 8. M07 — Operations / deliverables

**Layout** — Standard split.

**Stat row** — 3 stats in `grid-template-columns: repeat(3, 1fr)`:
- Big monospace number (22px, `var(--m7)`)
- Tiny uppercase label (10.5px, ink-3)
- Values: `5 Active projects`, `12 Deliverables`, `40% Sprint complete`

**Deliverables list** — 5 rows, `grid: 22px 1fr 70px 80px`:
- 18×18 checkbox (filled `--m7` if done, white check)
- Name (line-through if done)
- Owner handle in monospace (`@ana`)
- Due date in monospace, right-aligned (`#d44` red if late)

Deliverables list — see `DELIVERABLES` array.

### 9. M08 — Contributions

**Layout** — `reverse` split.

**Points hero** — Gradient `--m8` block:
- Big monospace number (34px) of summed points (starts at 275)
- "Points this sprint" label
- "3 badges earned · Builder · Welcomer · Funder"
- 6 circle badges (3 earned at full opacity emoji, 3 locked at 30% opacity)
- Decorative offset circle in top-right for depth

**Log form** — `grid: 1fr 130px 100px` collapsing to single column on mobile:
- Text input for activity description
- Category select: Build / Care / Decide / Welcome / Fund
- Hours number input
- Submit button below (spans full width via `grid-column: 1 / -1`) — text dynamically
  shows "Log it · earn {hours × 20} pts"

On submit: prepend new row to log list with `when: 'Today'` and `pts: hours × 20`.

**Log list** — Alternating zebra rows (`nth-child(odd): var(--bg-2)`):
- Activity name | date (monospace) | `+{pts}` (monospace, `--m8`, right-aligned)

### 10. M09 — Governance

**Full-width layout** (no split).

**4 layer cards** — 2×2 grid (single column on mobile), each clickable:
- Layer 01: Consent (Sociocracy) — `☉`
- Layer 02: Democracy (Majority) — `☑`
- Layer 03: Meritocracy (Domain expert) — `△`
- Layer 04: AI-mediated facilitation — `◇`

Active layer: `border-color: var(--m9)`, ring shadow.

**Proposal panel** below — `.proposal`:
- Title: "Approve $24k for reed-bed wetland materials"
- Meta line: shows current decision mode (changes with selected layer), proposer, days left, vote count

**Vote bar** — 32px tall horizontal bar, three segments grow with flex:
- Green (yes/consent), amber (concern), red (object)
- Initial counts: 14 / 3 / 2 — user's vote adds 1 to chosen segment
- Transitions: `transition: flex 800ms cubic-bezier(.4,1,.4,1)`

**Vote buttons** — 3-column grid:
- "✓ I consent" / "⚠ I have a concern" / "✗ I object"
- Selected button: `background: var(--m9)`, white text

Selecting "concern" reveals a dashed-border explainer:
> **Concerns block nothing** — they go on the record and trigger a 24h check-in before final tally. The AI facilitator will summarize concerns to the proposer.

### 11. Closing CTA

- Container: `max-width: 920px`, `margin: 130px auto 80px`
- Box: `padding: 72px 36px`, `border-radius: var(--radius-xl)`
- Background: radial gradient overlay + `var(--bg-2)`
- Headline: `clamp(30px, 4.5vw, 46px)`, "Ready to step into the clubhouse, {name}?"
- Two CTAs + monospace footnote

### 12. Footer

Single line, centered, monospace, 11.5px, `var(--ink-4)`:
> MyCoNet · MyCommunityNetwork · Regenerative Neighborhood Framework · Open sourced by The Regen Tribe Collective

---

## State management

The page is mostly static rendering with a few isolated interactive areas:

```ts
// M04 Blueprint
const [animated, setAnimated] = useState(false); // triggers pillar bars on scroll-into-view

// M05 Join values
const [checked, setChecked] = useState([false, false, false, false, false]);

// M06 Agreements
const [pickedProject, setPickedProject] = useState(0);
const [contributionText, setContributionText] = useState('...');
const [expectationText, setExpectationText] = useState('...');
const [submitted, setSubmitted] = useState(false);

// M08 Contributions
const [draft, setDraft] = useState({ what:'', cat:'Build', hours:'' });
const [log, setLog] = useState(initialLog);
const total = log.reduce((s, r) => s + r.pts, 0);

// M09 Governance
const [layer, setLayer] = useState(0);
const [vote, setVote] = useState<null | 'yes' | 'concern' | 'no'>(null);
```

When the live app integrates this: `name` should come from
`useUser().user_metadata.first_name` or your equivalent — not the Tweaks panel. The
Tweaks panel can be dropped entirely in production.

---

## Design tokens — mapping to your codebase

Every token in the prototype maps directly to `web/src/app/globals.css`. No new tokens needed.

### Colors
| Prototype | globals.css | Hex (light) |
|---|---|---|
| `--bg`, `--background` | `var(--background)` | `hsl(0 0% 100%)` |
| `--bg-2` | `var(--bg-2)` | `hsl(0 0% 97%)` |
| `--bg-3` | `var(--bg-3)` | `hsl(0 0% 94%)` |
| `--surface` | `var(--surface)` | `hsl(0 0% 100%)` |
| `--ink` | `var(--ink)` | `hsl(0 0% 9%)` |
| `--ink-2` | `var(--ink-2)` | `hsl(0 0% 22%)` |
| `--ink-3` | `var(--ink-3)` | `hsl(0 0% 45%)` |
| `--ink-4` | `var(--ink-4)` | `hsl(0 0% 65%)` |
| `--rule` | `var(--rule)` | `hsl(0 0% 89%)` |
| `--accent` | `var(--accent-color)` | `hsl(142 76% 36%)` |
| `--accent-soft` | `var(--accent-soft)` | `hsl(142 50% 93%)` |

### Module colors (from `src/lib/modules.ts`)
| Token | Hex | Used by section |
|---|---|---|
| `--m1` | `#92400e` | M01 Network |
| `--m4` | `#ca8a04` | M04 Blueprint |
| `--m5` | `#15803d` | M05 Join |
| `--m6` | `#1d4ed8` | M06 Agreements |
| `--m7` | `#4338ca` | M07 Operations |
| `--m8` | `#7c3aed` | M08 Contributions |
| `--m9` | `#db2777` | M09 Governance |

These already exist in your `MODULES` array — pull from there rather than hard-coding.

### Typography
- Body: `'Open Sans'` (already loaded in `globals.css`) — weights 300/400/500/600/700/800
- Monospace: `'JetBrains Mono'` — add to your Google Fonts import in `globals.css`,
  or fall back to `var(--mono)` which is `Menlo, monospace` in your tokens

### Spacing scale (consistent with codebase)
- Inter-section: `padding-top: 110px`
- Card padding: `22px`
- Card gap: `12px`
- Side gutters: `28px`
- Max content width: `1180px`

### Radii
- Small: `8px` — chips, buttons, inputs
- Medium: `var(--radius-lg)` = `12px` — cards
- Large: `var(--radius-xl)` = `18px` — hero containers, closing box

### Shadows
- `--shadow-sm`: `0 1px 2px rgba(0,0,0,.04), 0 1px 1px rgba(0,0,0,.03)`
- `--shadow-md`: `0 4px 16px rgba(0,0,0,.06), 0 2px 4px rgba(0,0,0,.04)`
- `--shadow-lg`: `0 12px 36px rgba(0,0,0,.08), 0 4px 10px rgba(0,0,0,.04)`

### Animations
- Pill pulse: `1.6s ease-out infinite`
- Pillar bar fill: `1.2s cubic-bezier(.4, 1, .4, 1)`
- Vote bar segment flex: `800ms cubic-bezier(.4, 1, .4, 1)`
- Card hover lift: `transform 160ms`, `box-shadow 160ms`, `translateY(-2px)`
- Button hover lift: `transform 140ms`, `translateY(-1px)`

---

## Responsive breakpoints

Only one breakpoint matters: **880px** (matches your existing dashboard breakpoint):
- `.clubhouse-body` collapses 2-col → 1-col, sidebar moves above main
- `.ch-grid` collapses 3-col → 2-col
- All `.section-split` collapse to single column, gap reduces from 56px → 32px
- `.gov-layers` collapses 2-col → 1-col
- `.log-form` collapses to single column
- Deliverable rows hide owner + due date columns

---

## Assets

No external images. Avatar marks are CSS gradients with initials. The logo mark is pure CSS
(radial gradient + two pseudo-element circles). Icons are inline SVG (just `<Check>` and
`<Arrow>` — 2 total). Emoji are used for badges in M08 (🪨 🤝 💰 🌿 ⚖️ ✦) — substitute for
your icon system if you don't want emoji in the live app.

---

## Files in this bundle

### Portal Explainer
- `portal-explainer.html` — Entry point. Has CSS variables, fonts, the script tags, and the
  EDITMODE JSON block. **Most of the CSS you need lives here in the `<style>` block.**
- `explainer-app.jsx` — All React components, in order: `TopBar`, `Hero`, `ClubhousePreview`,
  `SectionHead`, `MeetSection`, `BlueprintSection`, `JoinSection`, `AgreementsSection`,
  `OpsSection`, `ContributionsSection`, `GovernanceSection`, `Closing`. Plus `PortalTweaks`
  and `App`.

### Module Layouts
- `module-layouts.html` — Entry point. Loads all the CSS (same token system as the explainer)
  and stitches together the design canvas + shell + 8 module layouts.
- `module-shell.jsx` — Shared chrome used by every module artboard: `TopBar`, `SideNav`,
  `PageHead`, `Avatar`, `PillarRadar` (SVG pentagon), `Pbar`, `Chip`, `StatusDot`, plus the
  `MODULES` registry. **Extract these as production components first** — they're reused 8×.
- `module-layouts-a.jsx` — `M00Dashboard`, `M01Network`, `M04Blueprint`, `M05Join`.
- `module-layouts-b.jsx` — `M06Agreements`, `M07Operations`, `M08Contributions`, `M09Governance`.
- `module-canvas.jsx` — Wraps everything in `<DesignCanvas>` with two sections (Clubhouse,
  Resident-only) and 8 `<DCArtboard>` cards at 1280×860 each.
- `design-canvas.jsx` — The design-tool canvas wrapper. **Discard this in production** —
  it's only for browsing the layouts in the design tool.

### Tooling (discard in production)
- `tweaks-panel.jsx` — Tweaks dev tooling (used by the explainer).
- `design-canvas.jsx` — Canvas wrapper (used by the layouts page).

Existing project files that should inform the build:
- `web/src/app/globals.css` — has all design tokens
- `web/src/lib/modules.ts` — module list + colors (source of truth)
- `web/src/lib/module-meta.ts` — module labels/descriptions
- `web/src/components/Nav.tsx` — existing nav component (match its styling/behavior)
- `web/src/app/page.tsx` — existing landing page (this explainer is a richer alternative)

---

---

## Module Layouts — detailed spec

The full-screen artboards in `module-layouts.html` are the **target UI** for each route in
the app. They share one app shell (sidebar nav + topbar) and a consistent set of atoms.

### Shared app shell (every module page)

| Region        | Size                              | Notes |
|---------------|-----------------------------------|-------|
| Topbar        | full width × 56px                 | Brand on left, ⌘K search center, bell + user pill right |
| Sidebar       | 220px × full height               | Two groups: "Clubhouse" (M00/M01/M04/M05) and "Once you're in" (M06/M07/M08/M09). Active item has white surface + shadow-sm. Bottom: dashed "You're an Explorer" callout pointing to M05. |
| Main content  | fills remaining space             | `padding: 26px 32px`. `<PageHead>` (eyebrow + title + sub + actions) + body. |

Build these once as `<AppShell>`, `<TopBar>`, `<SideNav>` and reuse across all module routes.

### Route map (target Next.js paths)

| Module | Route             | What the layout shows |
|--------|-------------------|----------------------|
| M00    | `/dashboard`      | Stats row (4 KPIs), 2-col body: module grid (left), activity feed + "next step" CTA (right) |
| M01    | `/network`        | Filter chips row, 3-col grid of resident cards with offers/seeks chips + match score |
| M04    | `/blueprint`      | 3-pane wizard: 240px phase/step nav, center editor, 280px right rail (radar + gate) |
| M05    | `/join`           | Centered max-width 880px container with 4-step stepper + values checklist |
| M06    | `/agreements`     | 2-col: open project list (left), proposal-form for selected project (right) |
| M07    | `/ops`            | 5 KPI stats + tabs + 4-col kanban (Backlog/In progress/Review/Done) |
| M08    | `/contributions`  | Gradient points hero + badge grid, then 2-col: log table + quick-log form |
| M09    | `/governance`     | 4 layer cards in a row, then 2-col: open-proposal list + selected-proposal detail |

### Per-module details

#### M00 · Dashboard

- **Stat cards** — 4 across. Each: monospace 26px value, uppercase 10px mono label, small
  green delta. Use these exact values in the demo content; pull from real data in prod:
  Members 38 (+4 wk), Blueprint readiness 3.3/5 (PROVE), Open projects 5 (2 need help),
  Open proposals 2 (awaiting your vote).
- **Module grid** — 8 cards in a 2-col grid, each with 3px top accent bar in module color.
  Locked modules dim to `opacity: 0.6` with "🔒 Resident" badge.
- **Activity feed** — Avatar (26px) + bolded actor + grayed verb + monospace timestamp.
- **Next-step card** — Soft `--m5` background, dashed M5 border, "Sign the values" CTA.

#### M01 · Community Network

- **Filter chip row** — Active filter (e.g. "All · 38") gets `--ink` background, white text.
- **Resident card** — 44px avatar + name + match pill, role line, monospace location with
  📍 prefix, bio paragraph, then two sub-sections: green `OFFERS` chips with `+` prefix
  and blue `SEEKS` chips with `?` prefix. Card footer: Message + View profile buttons.
- **Match pill** — `--m1` tinted, monospace. Used only when match is calculated (your own
  card has `match: null` and shows no pill).

#### M04 · Blueprint Wizard

- **Layout** — `grid-template-columns: 240px 1fr 280px`, full-height (no main padding).
- **Phase sidebar** — 4 phases (SPARK done, PROVE active, BUILD/LIVE locked), each with
  3-4 sub-steps. Steps have a 7px dot left of the label (green if done, ringed `--m4` if
  active, gray if todo).
- **Editor** — Section eyebrow ("PHASE 2 · PROVE · STEP 2.2"), 24px title, helper text,
  then a `<form>` in a card with: numeric input (capital required), textarea (sources),
  textarea (risks). Footer: prev step button + Save / "Mark complete" CTA.
- **Right rail** — Pentagon radar (5 vertices: Ecology, Social, Economy, Hardware,
  Governance, values 4.2/3.6/2.3/2.8/3.4 against scale of 5) + pillar bars below + tinted
  "Next gate" card.

The pentagon radar is a small **inline SVG**, see `PillarRadar` in `module-shell.jsx`. The
ring polygons + axis lines + filled data polygon + vertex dots + axis labels are all hand-
plotted — replace with `recharts`/`d3` in production if you prefer.

#### M05 · Join

- **Container** — `max-width: 880px; margin: 0 auto` for readability.
- **4-step stepper** — Circles with monospace step numbers, connected by a 2px progress
  rail that fills to 33% (1 of 3 segments done). Current step circle is white with `--m5`
  ring and shadow. Completed steps show a check.
- **Value rows** — Same pattern as the explainer's M05 demo (see above). The layout shows
  the state where 3 of 5 are signed and the CTA is disabled.

#### M06 · Agreements

- **Layout** — 2 columns at `1fr 1.05fr` so the right (form) is slightly wider.
- **Project card** — Avatar of project lead + title + monospace "by X · deadline Y" line.
  Selected card gets `--m6` border + ring shadow. "● OPEN" pill in `--m5`. Needs row uses
  blue `--m6` light chips with a small monospace "NEEDS" prefix label.
- **Proposal form** — Card with tinted `--m6` header showing the project being proposed
  for. Three fields: contribution textarea, expectations textarea, conditions input. Then
  an inline `ℹ` callout explaining the 48h review + auto-feed to M07/M08. Footer: Save
  draft + Send proposal.

#### M07 · Operations

- **5 stat cards** — Active 5, Deliverables 12, On track 4 (green), At risk 1 (amber),
  Sprint days left 11. Each stat card has uppercase mono label, big mono value, small delta.
- **Tabs** — Board / Timeline / Deliverables / Updates. Active tab gets 2px `--m7` underline.
- **Kanban** — 4 columns: Backlog 3, In progress 4, Review 1 (amber dot), Done 4 (green).
  Cards have a left 3px border in the source module's color (M01/M4/M5/M9). In-progress
  cards show a progress bar. Late cards show a `⚠` + red date.

#### M08 · Contributions

- **Points hero** — Gradient `--m8` block with monospace 48px point total, "Top 25% / Sprint
  12" subtitle, "Next badge at 500 pts" progress bar at 56% (assuming 280 of 500 — actual
  computed from log). Decorative offset white circles for depth.
- **Badge grid** — 6 circular badges (3 earned full opacity, 3 locked at 40% opacity).
  Earned: Builder 🪨, Welcomer 🤝, Funder 💰. Locked: Land tender 🌿, Mediator ⚖️, Founder ✦.
- **Log table** — 6 columns: Effort / Category / Hours / Verifier / When / Points. Category
  is a light-tinted chip in the matching module color. Points right-aligned in `--m8` mono.
- **Quick-log card** — Effort input, category select (Build/Care/Decide/Welcome/Fund),
  hours number, submit button. "Log · earn 100 pts" computed from `hours × 20`.

#### M09 · Governance

- **4 layer cards** — 1×4 grid (not 2×2 as in the explainer). Each card: layer number,
  layer name, description, "X open" count, "Selected ●" or "View" footer link. Active card
  (Consent in the spec) gets `--m9` border + ring.
- **Proposal list** (left, 320px) — 4 stacked cards with module-color status dot, "CONSENT"
  uppercase mono label, proposal title, monospace meta line. Selected card gets ring.
- **Proposal detail** (right) — Eyebrow + proposal title + meta. Body paragraph. Vote bar
  (30px tall, three segments: 14 yes / 3 concern / 2 object). Vote stats row below. Then
  a dashed-border "YOUR VOTE" card with 3 buttons (consent selected). Then a "DISCUSSION"
  thread with 3 comments — avatar + name + relative time + comment in tinted bubble.

### Production-ready component extraction

These atoms in `module-shell.jsx` should become first-class components in
`web/src/components/`:

```tsx
// components/AppShell.tsx
<AppShell active="04"> ... </AppShell>     // wraps TopBar + SideNav + main

// components/TopBar.tsx
<TopBar search="..." actions={...} />

// components/SideNav.tsx
<SideNav active={moduleNum} userRole="explorer" />  // drives locked/unlocked state

// components/PageHead.tsx
<PageHead mod="06" label="Agreements" color="var(--m6)" title="..." sub="..." actions={...} />

// components/Avatar.tsx
<Avatar name="Maya Reyes" bg="var(--m1)" size={36} />

// components/PillarRadar.tsx           // pure-SVG pentagon
<PillarRadar values={[4.2, 3.6, 2.3, 2.8, 3.4]} color="var(--m4)" size={210} />

// components/Pbar.tsx                  // 6px height, 5-max progress bar
<Pbar value={4.2} color="var(--m4)" />

// components/Chip.tsx
<Chip color="var(--m5)" light>+ Permaculture</Chip>
```

The `SideNav` should pull live data: locked-state from the user's `role` column, badge
counts from open governance proposals etc. Pass them as props rather than hard-coding.

### Role gating

The module layouts model the **resident** view (all modules unlocked). The sidebar already
shows the explorer-state dimming for M06/M07/M08/M09 — same pattern, just gate inside the
route component. Suggested HOC:

```tsx
function withRoleGate(Component, minRole: Role) {
  return (props) => {
    const { user } = useUser();
    if (rank(user.role) < rank(minRole)) return <RoleLockedPage required={minRole} />;
    return <Component {...props} />;
  };
}

export default withRoleGate(AgreementsPage, 'joining');
```

---

## Implementation suggestions

1. **Start from `web/src/app/page.tsx`** — that file already uses these tokens, so you can
   work in the same style.
2. **Extract `<SectionHeader>` and `<DemoCard>`** as shared components — they're used 7×.
3. **Wire `name` to Supabase** — replace the Tweaks-driven name with the logged-in user's
   first name. For unauthenticated visits, fall back to a generic "Welcome" / "you".
4. **Route**: probably `/welcome` for prospective members, then redirect to `/dashboard`
   once they sign in. Or make `/` show this for unauthenticated visitors and the dashboard
   for authenticated ones.
5. **No new DB tables needed** — this is pure marketing/explainer UI. All the demo data is
   hard-coded; in production some sections (M01 residents, M07 deliverables) could pull
   real data for an even more authentic feel.
6. **Accessibility** — add `aria-pressed` on the layer cards in M09, `aria-checked` on the
   value rows in M05 (already present), keyboard support on click-to-toggle interactions.
