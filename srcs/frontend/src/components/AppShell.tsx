import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { profileInitials, readProfile, watchProfile } from '../features/settings/profile-preview'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z' },
  { label: 'Workspaces', href: '/workspaces', icon: 'M3 8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z M8 7V4h8v3 M3 12h18' },
  { label: 'Messages', href: '/messages', icon: 'M21 11a9 9 0 0 1-9 9H8l-5 2 1.5-5A9 9 0 1 1 21 11z' },
  { label: 'Friends', href: '/friends', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M22 21v-2a4 4 0 0 0-3-3.9 M17 3.1a4 4 0 0 1 0 7.8' },
  { label: 'Files', icon: 'M6 2h8l5 5v15H6z M14 2v6h5' },
  { label: 'Analytics', icon: 'M4 21V11 M12 21V4 M20 21v-8' },
  { label: 'Developer', icon: 'm8 6-6 6 6 6 m8-12 6 6-6 6 M14 2l-4 20' },
  { label: 'Admin', icon: 'M12 2l9 4v6c0 4-4 8-9 10-5-2-9-6-9-10V6z m-4 10 3 3 5-5' },
  { label: 'Settings', href: '/settings', icon: 'm10 2-1 3-2 1-3-1-2 4 2 2v2l-2 2 2 4 3-1 2 1 1 3h4l1-3 2-1 3 1 2-4-2-2v-2l2-2-2-4-3 1-2-1-1-3z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' },
]

function SidebarIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          setIsOpen(false)
          button.current?.focus()
        }
      }}
    >
      <button
        ref={button}
        type="button"
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-controls="workspace-notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="grid size-8 cursor-pointer place-items-center rounded-md text-muted hover:bg-foreground/10 hover:text-foreground"
      >
        <SidebarIcon path="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4" />
      </button>
      <section
        id="workspace-notifications"
        aria-label="Notifications"
        hidden={!isOpen}
        className="absolute top-full right-0 z-10 mt-2 w-56 rounded-lg border border-foreground/15 bg-surface p-4 shadow-lg"
      >
        <h2 className="font-semibold">Notifications</h2>
        <p className="mt-1 text-sm text-muted">No notifications yet.</p>
      </section>
    </div>
  )
}

export default function AppShell({ activePage, search, children }: {
  activePage?: '/workspaces' | '/friends' | '/messages' | '/settings'
  search: ReactNode
  children: ReactNode
}) {
  const [profile, setProfile] = useState(readProfile)
  useEffect(() => watchProfile(setProfile), [])

  return (
    <div className="min-h-dvh bg-background md:grid md:grid-cols-[clamp(8rem,15vw,13rem)_minmax(0,1fr)]">
      <aside className="flex flex-col gap-4 border-b border-foreground/20 bg-surface/60 p-3 md:border-r md:border-b-0">
        <a href="/" className="px-3 text-xl font-medium">// NEXA</a>
        <nav aria-label="Workspace navigation" className="flex flex-wrap gap-1 text-sm md:grid">
          {NAV_ITEMS.map(({ label, icon, href }) => href ? (
            <a key={label} href={href} aria-current={activePage === href ? 'page' : undefined} className="flex items-center gap-2 rounded-md px-3 py-2 text-muted hover:text-foreground aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary">
              <SidebarIcon path={icon} />
              {label}
            </a>
          ) : (
            <span key={label} className="flex items-center gap-2 px-3 py-2 text-muted">
              <SidebarIcon path={icon} />
              {label}
            </span>
          ))}
        </nav>
        <div className="mt-auto hidden items-center gap-2 px-2 py-2 md:flex">
          <span className="grid size-8 place-items-center rounded-full bg-danger text-xs text-background" aria-hidden="true">{profileInitials(profile.displayName)}</span>
          <div className="text-sm leading-tight">{profile.displayName}<p className="text-xs text-muted">Admin</p></div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-foreground/20 px-4 py-3 sm:px-7">
          {search}
          <div className="flex shrink-0 items-center gap-3">
            <NotificationButton />
            <a href="/profile" className="grid size-8 shrink-0 place-items-center rounded-full bg-danger text-xs text-background hover:brightness-110" aria-label="My profile">
              {profile.avatar
                ? <img src={profile.avatar} alt="" className="size-full rounded-full object-cover" />
                : profileInitials(profile.displayName)}
            </a>
          </div>
        </header>
        {children}
        <footer className="p-4 text-center text-xs text-muted">© 2026 Nexa</footer>
      </div>
    </div>
  )
}
