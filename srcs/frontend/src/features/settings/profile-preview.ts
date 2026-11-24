export const DEFAULT_PROFILE = {
  displayName: 'Amine L.',
  username: 'amine',
  email: 'amine@atlas.ma',
  bio: 'I help teams organize their work and keep projects moving.',
  avatar: '',
}

export type ProfileSettings = typeof DEFAULT_PROFILE

const PROFILE_KEY = 'nexa-preview-profile'
const PROFILE_UPDATED = 'nexa-preview-profile-updated'

export function readProfile(): ProfileSettings {
  try {
    const saved = sessionStorage.getItem(PROFILE_KEY)
    return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

export function saveProfile(profile: ProfileSettings) {
  sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  window.dispatchEvent(new Event(PROFILE_UPDATED))
}

export function watchProfile(listener: (profile: ProfileSettings) => void) {
  const update = () => listener(readProfile())
  window.addEventListener(PROFILE_UPDATED, update)
  return () => window.removeEventListener(PROFILE_UPDATED, update)
}

export function profileInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('')
}
