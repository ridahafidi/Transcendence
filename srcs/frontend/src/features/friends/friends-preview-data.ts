export const PEOPLE = [
  { username: 'sara', name: 'Sara Benali', initials: 'SA', color: 'bg-primary', online: true },
  { username: 'youssef', name: 'Youssef K.', initials: 'YO', color: 'bg-info', online: true },
  { username: 'khalid', name: 'Khalid R.', initials: 'KH', color: 'bg-emerald-400', online: false },
  { username: 'hajar', name: 'Hajar M.', initials: 'HA', color: 'bg-danger', online: true },
  { username: 'noura', name: 'Noura S.', initials: 'NO', color: 'bg-primary', online: false },
  { username: 'rachid', name: 'Rachid T.', initials: 'RA', color: 'bg-info', online: true },
  { username: 'salma', name: 'Salma A.', initials: 'SL', color: 'bg-primary', online: true },
  { username: 'adam', name: 'Adam M.', initials: 'AD', color: 'bg-info', online: false },
  { username: 'lina', name: 'Lina R.', initials: 'LI', color: 'bg-danger', online: true },
]

export type Person = typeof PEOPLE[number]

const FRIENDS_KEY = 'nexa-preview-friends'

export function readFriends(): string[] {
  try {
    const saved = sessionStorage.getItem(FRIENDS_KEY)
    const usernames: unknown = saved ? JSON.parse(saved) : null
    if (Array.isArray(usernames)) {
      return PEOPLE.filter(({ username }) => usernames.includes(username)).map(({ username }) => username)
    }
  } catch {
    // Use sample friends when storage is unavailable.
  }
  return PEOPLE.slice(0, 6).map(({ username }) => username)
}

export function saveFriends(usernames: string[]) {
  sessionStorage.setItem(FRIENDS_KEY, JSON.stringify(usernames))
}

const REQUESTS_KEY = 'nexa-preview-friend-requests'

type Requests = { incoming: string[]; outgoing: string[] }

export function readRequests(): Requests {
  try {
    const saved = sessionStorage.getItem(REQUESTS_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // Use the sample request when storage is unavailable.
  }
  return { incoming: ['salma'], outgoing: [] }
}

export function saveRequests(requests: Requests) {
  sessionStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
}
