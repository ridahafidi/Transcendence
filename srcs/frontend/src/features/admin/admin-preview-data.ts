export const ROLES = ['Admin', 'Moderator', 'User', 'Guest'] as const
export type Role = typeof ROLES[number]
export type AdminUser = { id: number; name: string; email: string; role: Role; active: boolean }

const USERS: AdminUser[] = [
  { id: 1, name: 'Amine L.', email: 'amine@atlas.ma', role: 'Admin', active: true },
  { id: 2, name: 'Sara Benali', email: 'sara@atlas.ma', role: 'Moderator', active: true },
  { id: 3, name: 'Youssef K.', email: 'youssef@atlas.ma', role: 'User', active: true },
  { id: 4, name: 'Khalid R.', email: 'khalid@atlas.ma', role: 'User', active: false },
  { id: 5, name: 'Guest 01', email: 'guest@atlas.ma', role: 'Guest', active: true },
  { id: 6, name: 'Hajar M.', email: 'hajar@atlas.ma', role: 'User', active: true },
]

const KEY = 'nexa-preview-admin'
type AdminPreview = { users: AdminUser[]; audit: { action: string; time: string }[] }
export const CURRENT_ADMIN = 1

export function readAdminPreview(): AdminPreview {
  try {
    const saved = sessionStorage.getItem(KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // Use the sample list when storage is unavailable.
  }
  return { users: USERS, audit: [] }
}

export function saveAdminPreview(data: AdminPreview) {
  sessionStorage.setItem(KEY, JSON.stringify(data))
}
