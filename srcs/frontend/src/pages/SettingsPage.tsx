import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import AppShell from '../components/AppShell'
import { prepareAvatar } from '../features/settings/prepare-avatar'
import { profileInitials, readProfile, saveProfile } from '../features/settings/profile-preview'

const TABS = ['Profile', 'Security', 'Linked accounts', 'Notifications'] as const
const PANEL = 'rounded-lg border border-foreground/10 bg-surface p-4 sm:p-5'
const INPUT = 'w-full rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm'
const SECONDARY = 'cursor-pointer rounded-md border border-foreground/10 bg-foreground/5 px-4 py-2 text-sm hover:bg-foreground/10'
const PRIMARY = 'cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50'

function ProfileSettingsForm() {
  const [draft, setDraft] = useState(readProfile)
  const [status, setStatus] = useState('')
  const [isReading, setIsReading] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  async function pickAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file || isReading) return

    setIsReading(true)
    setStatus('Preparing your avatar…')
    try {
      const avatar = await prepareAvatar(file)
      setDraft((previous) => ({ ...previous, avatar }))
      setStatus('Avatar ready. Select Save changes to apply it.')
    } catch {
      setStatus('This image could not be opened. Try another file or export it as JPEG, PNG, or WebP.')
    } finally {
      setIsReading(false)
    }
  }

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isReading) return

    const profile = {
      ...draft,
      displayName: draft.displayName.trim(),
      username: draft.username.trim(),
      email: draft.email.trim(),
      bio: draft.bio.trim(),
    }

    if (!profile.displayName || !profile.username) {
      setStatus('Enter a display name and username.')
      return
    }

    try {
      saveProfile(profile)
      setDraft(profile)
      setStatus('Profile saved in this browser tab.')
    } catch {
      setStatus('The profile could not be saved in this browser.')
    }
  }

  return (
    <form className="grid items-start gap-4 lg:grid-cols-[minmax(12rem,1fr)_minmax(0,2.2fr)]" onSubmit={submitProfile}>
      <section className={`${PANEL} flex flex-col items-center gap-4 py-8 text-center`} aria-label="Profile avatar">
        {draft.avatar ? (
          <img src={draft.avatar} alt="Profile avatar preview" className="size-24 rounded-full object-cover" />
        ) : (
          <span className="grid size-24 place-items-center rounded-full bg-danger text-2xl font-semibold text-background" aria-hidden="true">{profileInitials(draft.displayName)}</span>
        )}
        <button type="button" className={SECONDARY} disabled={isReading} onClick={() => fileInput.current?.click()}>Upload avatar</button>
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={pickAvatar} />
        <p className="text-xs text-muted">Photos are cropped to fit your avatar.</p>
        {draft.avatar && <button type="button" className="text-sm text-muted underline" disabled={isReading} onClick={() => { setDraft({ ...draft, avatar: '' }); setStatus('Select Save changes to remove your avatar.') }}>Remove avatar</button>}
      </section>

      <section className={`${PANEL} grid gap-4`} aria-label="Profile details">
        <label className="grid gap-1.5 text-sm text-muted">
          Display name
          <input className={`${INPUT} text-foreground`} required maxLength={80} value={draft.displayName} onChange={(event) => setDraft({ ...draft, displayName: event.target.value })} />
        </label>
        <label className="grid gap-1.5 text-sm text-muted">
          Username
          <input className={`${INPUT} text-foreground`} required maxLength={80} pattern={'\\p{L}+(?: \\p{L}+)?'} title="Use letters and at most one space between names." value={draft.username} onChange={(event) => setDraft({ ...draft, username: event.target.value })} />
        </label>
        <label className="grid gap-1.5 text-sm text-muted">
          Email
          <input className={`${INPUT} text-foreground`} type="email" required value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
        </label>
        <label className="grid gap-1.5 text-sm text-muted">
          Bio
          <textarea className={`${INPUT} text-foreground`} rows={3} maxLength={300} value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className={PRIMARY} disabled={isReading}>Save changes</button>
          <button type="button" className={SECONDARY} disabled={isReading} onClick={() => { setDraft(readProfile()); setStatus('') }}>Cancel</button>
        </div>
        {status && <p className="text-sm text-muted" role="status">{status}</p>}
      </section>
    </form>
  )
}

function LinkedAccounts() {
  return (
    <section className={PANEL}>
      <h2 className="font-medium">Linked accounts</h2>
      <div className="mt-3 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-info text-sm text-background" aria-hidden="true">42</span>
        <div>
          <p className="text-sm">42 Network</p>
          <p className="text-xs text-muted">Account linking requires a connected Nexa account.</p>
        </div>
      </div>
    </section>
  )
}

function SecuritySettings() {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="grid gap-4">
        <section className={PANEL}>
          <h2 className="font-medium">Change password</h2>
          <p id="password-settings-status" className="mt-1 text-sm text-muted">Password updates are unavailable in the preview.</p>
          <fieldset disabled aria-describedby="password-settings-status" className="mt-4 grid gap-3 opacity-60">
            {['Current password', 'New password', 'Confirm new password'].map((label) => (
              <label key={label} className="grid gap-1 text-sm text-muted">
                {label}
                <input type="password" className={INPUT} />
              </label>
            ))}
            <button type="button" className={`${PRIMARY} justify-self-start`}>Update password</button>
          </fieldset>
        </section>
        <LinkedAccounts />
      </div>

      <section className={PANEL}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-medium">Two-factor authentication (TOTP)</h2>
          <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-danger">Unavailable</span>
        </div>
        <p className="mt-4 text-sm text-muted">Your setup QR code and recovery codes will be available when two-factor setup is connected.</p>
        <label className="mt-4 grid max-w-60 gap-1 text-sm text-muted">
          Authenticator code
          <input disabled inputMode="numeric" placeholder="6-digit code" className={INPUT} />
        </label>
        <button type="button" disabled className={`${PRIMARY} mt-3`}>Verify and enable</button>
      </section>
    </div>
  )
}

function NotificationSettings() {
  return (
    <section className={PANEL}>
      <h2 className="font-medium">Notifications</h2>
      <p className="mt-1 text-sm text-muted">Notification preferences will be available when account settings are connected.</p>
    </section>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState<typeof TABS[number]>('Profile')

  return (
    <AppShell activePage="/settings" search={
      <form action="/friends" className="w-full max-w-sm">
        <input name="q" type="search" required aria-label="Find a user" placeholder="Search people…" className={INPUT} />
      </form>
    }>
      <main className="flex-1 space-y-5 px-4 py-5 sm:px-7">
        <header>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted">Manage your account</p>
        </header>
        <div className="flex flex-wrap gap-x-5 border-b border-foreground/15" role="group" aria-label="Settings views">
          {TABS.map((label) => (
            <button type="button" key={label} aria-pressed={tab === label} onClick={() => setTab(label)} className="cursor-pointer border-b-2 border-transparent py-2 text-sm text-muted hover:text-foreground aria-pressed:border-primary aria-pressed:text-primary">
              {label}
            </button>
          ))}
        </div>
        {tab === 'Profile' && <ProfileSettingsForm />}
        {tab === 'Security' && <SecuritySettings />}
        {tab === 'Linked accounts' && <LinkedAccounts />}
        {tab === 'Notifications' && <NotificationSettings />}
        <nav aria-label="Legal" className="flex gap-3 text-xs text-muted">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
        </nav>
      </main>
    </AppShell>
  )
}
