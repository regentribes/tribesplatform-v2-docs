# M06 — Agreements

Members propose collaboration on active community projects. They describe what they'll contribute and what they expect in return. Admins review and confirm or reject. The module also lets members propose brand-new projects.

## What users see here

- **My Agreements (default tab)** — a list of the user's own proposals, each showing project name, "Will contribute" / "Expects in return" panels, status badge, and submission date. Empty state links directly to Browse.
- **Browse & Propose (secondary tab)** — two-column layout: open projects on the left, proposal form on the right. Filter chips: Open, Mine, All.
- **+ Propose new project** — opens `NewProjectModal`; the project lands in the Ideas column of M07 Operations for admin activation.
- **Guests / Explorers** — can view the page but the proposal form shows a locked overlay with a CTA to join.

## Routes

| Route | File |
|-------|------|
| `/agreements` | `app/agreements/page.tsx` → `AgreementsClient` (members) or `AgreementsAdminClient` (admin) |
| `/agreements/[id]` | `app/agreements/[id]/page.tsx` → project-specific agreement detail |

## Files

| File | Purpose |
|------|---------|
| `AgreementsClient.tsx` | Two-tab layout: My Agreements (default) + Browse & Propose |
| `AgreementsAdminClient.tsx` | Admin review panel — list of all proposals with approve/reject controls |
| `AgreementFormFields.tsx` | Shared form primitives — `FormField`, `FocusInput`, `FocusTextarea` |
| `NewProjectModal.tsx` | Modal for proposing a new project (status: pending → admin activates in M07) |

## Database tables

| Table | Access |
|-------|--------|
| `collaboration_agreements` | Read/write — proposals (`work_description`, `expected_reward`, `conditions`, `status`) |
| `projects` | Read — project list for browsing; Write — new project proposals via `NewProjectModal` |
| `user_profiles` | Read — member names for admin view |

## Role gating

| Role | Experience |
|------|-----------|
| Guest | Can view the page; proposal form shows locked overlay with sign-up CTA |
| Explorer | Can view; form locked with "Complete M05 Join to unlock" overlay |
| Joining / Member+ | Can browse projects and submit proposals |
| circle_lead / admin | Sees `AgreementsAdminClient` instead — full review panel for all proposals |

## Agreement statuses

```
draft → pending → accepted → active → completed
                ↘ rejected
```

| Status | Meaning |
|--------|---------|
| `draft` | Saved but not submitted; can be edited and resubmitted |
| `pending` | Submitted, awaiting admin/lead review |
| `accepted` | Approved; collaborator should begin work |
| `active` | Work is underway |
| `completed` | Collaboration finished |
| `rejected` | Not accepted; user can submit a fresh proposal |

## Duplicate proposal handling

`collaboration_agreements` has a unique constraint on `(project_id, user_id)`. All writes use **upsert** with `onConflict: 'project_id,user_id'`. If an existing active proposal (pending/accepted/active/completed) exists, the form shows a status panel instead of a new form. Draft and rejected proposals allow resubmission.

## What happens when a proposal is accepted

1. The agreement's `status` flips to `accepted`.
2. A deliverable row is created in M07 Operations with `assignee_id` set to the proposer and `from_agreement_id` linking back.
3. Work moves through the M07 Kanban. The M06 view shows the agreement status for reference.

## How to work on this module

```bash
cd web && npm run dev
# http://localhost:3000/agreements
```

To add a new field to the proposal form:
1. Add it in `AgreementsClient.tsx` using `FormField` + `FocusInput` from `AgreementFormFields.tsx`
2. Add the column to `collaboration_agreements` via a Supabase migration
3. Update `AgreementsAdminClient.tsx` to display the new field in the review panel
