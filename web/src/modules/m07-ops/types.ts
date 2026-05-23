/**
 * Shared types for the M07 Ops module.
 * All components in this module import from here.
 */

export interface Project {
  id: string
  title: string
  description: string | null
  status: string
  open_for_collaborators: boolean
  circle?: string | null
  needs?: string[] | string | null
  deadline?: string | null
  sprint_name?: string | null
  created_at: string
  updated_at?: string
  created_by?: string | null
  lead_user_id?: string | null
}

export type ProjectSummary = Pick<Project, 'id' | 'title'>

export interface Deliverable {
  id: string
  project_id: string
  title: string
  status: string
  due_date: string | null
  assignee_id: string | null
  progress: number | null
  assignee_username?: string | null
  from_agreement_id?: string | null
  user_profiles?: { first_name: string | null; username: string | null } | null
}

export interface ProjectUpdate {
  id: string
  project_id: string
  user_id?: string
  content: string
  created_at: string
  author_first_name?: string | null
  user_profiles?: { first_name: string | null; username: string | null } | null
}

/** Quirk: Supabase's generic types model many-to-one joins as arrays. We know at
 * runtime each row has at most one related user_profiles record, so module
 * components treat it as an object. Use `as unknown as T` at the page boundary
 * (server component) when handing data to consumers. */

export interface CollaborationAgreement {
  id: string
  work_description: string | null
  expected_reward: string | null
  conditions?: string | null
  status: string
  created_at?: string
  user_profiles?: { first_name: string | null; username: string | null } | null
}

export interface MyProposal {
  id: string
  work_description: string | null
  expected_reward: string | null
  conditions: string | null
  status: string
}
