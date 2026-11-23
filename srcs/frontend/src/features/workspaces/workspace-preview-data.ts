export const MEMBER_NAMES: Record<string, string> = {
  SM: 'Sara Benali', AL: 'Amine L.', YK: 'Youssef K.', KR: 'Khalid R.', HM: 'Hajar M.',
}

type Role = 'Owner' | 'Manager' | 'Member'
export type Member = { name: string; role: Role; joined: string }

const KITCHEN_MESSAGES = [
  { author: 'Sara Benali', time: '09:24', text: 'The weekly menu is ready. Can everyone review before prep?' },
  { author: 'Youssef K.', time: '09:28', text: 'I uploaded menu.pdf to the Files tab.' },
  { author: 'You', time: '09:31', text: 'Thanks! I’ll update the task board after reviewing.' },
]

const KITCHEN_FILES = [
  { name: 'menu.pdf', author: 'Youssef K.', size: '1.2 MB', updated: 'Today, 09:28' },
  { name: 'schedule.pdf', author: 'Sara Benali', size: '640 KB', updated: 'Yesterday' },
  { name: 'invoice.docx', author: 'Amine L.', size: '86 KB', updated: 'Nov 15, 2026' },
  { name: 'floorplan.png', author: 'Khalid R.', size: '1.8 MB', updated: 'Nov 12, 2026' },
]

const KITCHEN_ACTIVITY = [
  { day: 'Today', text: 'Sara Benali completed Inventory check', detail: '09:42 · Task updated' },
  { day: 'Today', text: 'Youssef K. uploaded menu.pdf', detail: '09:28 · File shared' },
  { day: 'Today', text: 'Amine L. assigned Order supplies to Sara Benali', detail: '09:15 · Assignee changed' },
  { day: 'Yesterday', text: 'Amine L. added Khalid R. to Kitchen', detail: '16:20 · Member added' },
  { day: 'Yesterday', text: 'Sara Benali moved Prep weekly menu to In progress', detail: '14:05 · Status changed' },
]

export function initialMembers(ids: string[]): Member[] {
  const owner = ids.includes('AL') ? 'AL' : ids[0]
  return ids.map((id, index) => ({
    name: MEMBER_NAMES[id] ?? id,
    role: id === owner ? 'Owner' : id === 'SM' ? 'Manager' : 'Member',
    joined: ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Jun 2026', 'Jun 2026'][index] ?? '2026',
  }))
}

export type Message = typeof KITCHEN_MESSAGES[number]
export type SharedFile = typeof KITCHEN_FILES[number]
export type Activity = typeof KITCHEN_ACTIVITY[number]

export function initialWorkspaceTabs(isKitchen: boolean) {
  return {
    messages: isKitchen ? KITCHEN_MESSAGES : [],
    files: isKitchen ? KITCHEN_FILES : [],
    activity: isKitchen ? KITCHEN_ACTIVITY : [],
  }
}
