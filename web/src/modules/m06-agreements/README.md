# M06 — Agreements

Members propose collaboration on active community projects. They describe what they'll contribute and what they expect in return. Admins review and confirm or reject the agreement. The module also lets members propose new projects for admin activation.

## Routes

| Route | File |
|-------|------|
| `/agreements` | `app/agreements/page.tsx` → `AgreementsClient` (members) or admin view |
| `/agreements/[id]` | `app/agreements/[id]/page.tsx` → project-specific agreement detail |

## Files

| File | Purpose |
|------|---------|
| `AgreementsClient.tsx` | Two-column layout: project list on the left, proposal form on the right |
| `AgreementFormFields.tsx` | Shared form primitives — `FormField`, `FocusInput`, `FocusTextarea`, `inputStyle` |
| `NewProjectModal.tsx` | Self-contained modal for proposing a new project (goes to pending, admin activates) |

## Database tables

| Table | Access |
|-------|--------|
| `collaboration_agreements` | Read/write — proposals (`work_description`, `expected_reward`, `conditions`, `status`) |
| `projects` | Read — project list for the artboard; Write — new project proposals via `NewProjectModal` |
| `user_profiles` | Read — member names for admin view |

## Role gating

- **Explorer / Guest**: proposal form is locked with a CTA to join
- **Joining / Member / above**: can browse projects and submit proposals
- **circle_lead / admin**: sees the admin review panel in `app/agreements/page.tsx`

Role checks use `isCircleAdmin(role)` from `@/core/lib/roles`.

## Agreement statuses

```
draft → pending → accepted → active → completed
                ↘ rejected
```

- `draft` — saved but not submitted; can be resubmitted
- `pending` — submitted, waiting for review
- `accepted` — admin approved; collaborator should begin work
- `active` — work is underway
- `completed` — collaboration finished
- `rejected` — not accepted; user can resubmit a fresh proposal

## Duplicate proposal handling

The `collaboration_agreements` table has a unique constraint on `(project_id, user_id)`. All writes use **upsert** with `onConflict: 'project_id,user_id'`, so resubmitting on the same project updates the existing row rather than throwing a duplicate key error.

If an active (pending/accepted/active/completed) proposal already exists for the selected project, the form is replaced with a status panel showing the existing proposal's details. Draft and rejected proposals allow resubmission.

## Proposing a new project

The **"+ Propose new project"** button opens `NewProjectModal`, which inserts a `projects` row with `status: 'pending'` and an optional `circle` (one of the 5 pillars — see `@/core/lib/pillars`). It lands in the **Ideas** column on the M07 Operations Kanban, where an admin (or any user with permission) can drag it to **Backlog** to activate it.

## What happens when a proposal is accepted

Acceptance no longer just flips a status — it spawns work. Inside M07, when an admin or project creator drags a pending proposal from the project's **Ideas** column to **Backlog** (or clicks the **Accept →** button on the card):

1. The agreement's `status` flips to `'accepted'`.
2. A new row is inserted into `deliverables` with `title` derived from the agreement's `work_description`, `assignee_id` set to the proposer, and `from_agreement_id` linking back to the agreement.
3. From that point on, the work moves through the Kanban as a deliverable — see [M07's README](../m07-ops/README.md) for the Kanban flow.

This means the M06 "active collaborations" view is gone — accepted proposals show up as deliverables in M07. The acceptance is still recorded in `collaboration_agreements` for history.

## How to work on this module

```bash
cd web && npm run dev
# http://localhost:3000/agreements
```

To add a new field to the proposal form (e.g., "estimated hours"):
1. Add it to the form in `AgreementsClient.tsx` using `FormField` + `FocusInput` from `AgreementFormFields.tsx`
2. Add the column to `collaboration_agreements` via a Supabase migration
3. Update the admin review view in `app/agreements/page.tsx` to display the new field
