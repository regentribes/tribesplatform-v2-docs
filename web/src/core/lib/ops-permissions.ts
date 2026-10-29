/**
 * Who can move / edit a project, and the plain-language reason when they can't.
 *
 * Mirrors the `projects` UPDATE RLS policies:
 *   - admin can update any project
 *   - project_lead can update any project at the DB level, but the app limits
 *     them to projects they created or lead
 *   - circle_lead can update projects whose circle is in their lead_circles —
 *     and the new row must pass the same check, so they can't move a project
 *     into a circle they don't lead, or out of every circle
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import { isPillar, PILLAR_META, PILLARS, type Pillar } from './pillars'
import { ROLE_LABELS } from './roles'

export type PersonRef = { id: string; name: string; username: string | null }
export type CircleLeads = Record<Pillar, PersonRef[]>

export interface CircleDirectory {
  leads: CircleLeads
  admins: PersonRef[]
}

export interface PermissionNotice {
  title: string
  message: string
  /** The circle whose leads can help — shown under the message. */
  circle: Pillar | null
}

type ProjectRef = { circle?: string | null; created_by?: string | null; lead_user_id?: string | null }

export function circleLabel(circle: Pillar): string {
  const meta = PILLAR_META[circle]
  return `${meta.emoji} ${meta.label}`
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

function leadCircleList(leadCircles: string[]): string {
  return joinList(leadCircles.filter(isPillar).map(circleLabel))
}

export function canMoveProject(p: ProjectRef, userId: string | null, userRole: string, leadCircles: string[]): boolean {
  return projectEditBlock(p, userId, userRole, leadCircles) === null
}

/** null when the user may move/edit the project; otherwise why not. */
export function projectEditBlock(
  p: ProjectRef, userId: string | null, userRole: string, leadCircles: string[],
): PermissionNotice | null {
  const circle = isPillar(p.circle) ? p.circle : null
  const title = "You can't move this project"

  if (!userId) return { title, message: 'Sign in to move projects on the board.', circle }
  if (userRole === 'admin') return null

  if (userRole === 'project_lead') {
    if (p.created_by === userId || p.lead_user_id === userId) return null
    return { title, message: 'Project leads can only move projects they created or lead.', circle }
  }

  if (userRole === 'circle_lead') {
    if (circle && leadCircles.includes(circle)) return null
    if (!circle) {
      return { title, message: "This project isn't in a circle yet, so only an admin can move it.", circle: null }
    }
    const mine = leadCircleList(leadCircles)
    return {
      title,
      message: mine
        ? `This project is in ${circleLabel(circle)}. You're a lead in ${mine}, so you can only move projects in those circles.`
        : `This project is in ${circleLabel(circle)}. You haven't been assigned to lead any circle yet.`,
      circle,
    }
  }

  const role = ROLE_LABELS[userRole] ?? 'Explorer'
  return { title, message: `Only admins and circle leads can move projects. You're a ${role}.`, circle }
}

/** null when the user may put the project in `target`; otherwise why not. */
export function circleChangeBlock(
  target: Pillar | '', userRole: string, leadCircles: string[],
): PermissionNotice | null {
  if (userRole !== 'circle_lead') return null
  const title = "You can't change the circle"
  if (!target) {
    return { title, message: 'Only an admin can take a project out of its circle.', circle: null }
  }
  if (leadCircles.includes(target)) return null
  return {
    title,
    message: `You can't move this project into ${circleLabel(target)} because you're not a lead in that circle.`,
    circle: target,
  }
}

export async function fetchCircleDirectory(supabase: SupabaseClient): Promise<CircleDirectory> {
  const { data } = await supabase
    .from('user_profiles')
    .select('id, first_name, username, role, lead_circles')
    .in('role', ['admin', 'circle_lead'])
    .order('first_name')

  const leads = Object.fromEntries(PILLARS.map(p => [p, [] as PersonRef[]])) as CircleLeads
  const admins: PersonRef[] = []
  for (const row of data ?? []) {
    const person = { id: row.id, name: row.first_name ?? row.username ?? 'Member', username: row.username ?? null }
    if (row.role === 'admin') admins.push(person)
    // Only circle_lead counts as a lead at the DB level (see RLS note above)
    if (row.role === 'circle_lead') {
      for (const c of (row.lead_circles ?? []) as string[]) if (isPillar(c)) leads[c].push(person)
    }
  }
  return { leads, admins }
}
