import { useState } from 'react'
import { useParams } from 'react-router'
import AppShell from '../components/AppShell'
import { PEOPLE, readFriends, readRequests, saveFriends, saveRequests } from '../features/friends/friends-preview-data'
import ErrorPage from './ErrorPage'
import { profileInitials, readProfile } from '../features/settings/profile-preview'

const MY_PROFILE = { username: 'amine', name: 'Amine L.', initials: 'AL', color: 'bg-primary', online: true }
const PANEL = 'rounded-xl border border-foreground/10 bg-surface p-4'
const ACTION = 'cursor-pointer rounded-md border border-foreground/10 bg-foreground/5 px-4 py-2 text-sm hover:bg-foreground/10'
const PRIMARY = 'cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background hover:brightness-110'

const PROFILES: Record<string, {
  bio: string
  tasksDone: number
  joined: string
  workspaces: { id: number; name: string; role: string }[]
}> = {
  amine: {
    bio: 'I help teams organize their work and keep projects moving.',
    tasksDone: 42,
    joined: 'January 2026',
    workspaces: [
      { id: 6, name: 'Kitchen', role: 'Owner' },
      { id: 5, name: 'Front of House', role: 'Owner' },
      { id: 3, name: 'Finance', role: 'Owner' },
    ],
  },
  sara: {
    bio: 'Operations manager. Loves organized workflows and good coffee.',
    tasksDone: 86,
    joined: 'February 2026',
    workspaces: [
      { id: 6, name: 'Kitchen', role: 'Manager' },
      { id: 5, name: 'Front of House', role: 'Manager' },
      { id: 3, name: 'Finance', role: 'Manager' },
    ],
  },
}

export default function ProfilePage() {
  const { username = MY_PROFILE.username } = useParams()
  const [ownSettings] = useState(readProfile)
  const [friends, setFriends] = useState(readFriends)
  const [requests, setRequests] = useState(readRequests)
  const isOwnProfile = username === MY_PROFILE.username
  const person = isOwnProfile
    ? { ...MY_PROFILE, username: ownSettings.username, name: ownSettings.displayName, initials: profileInitials(ownSettings.displayName) }
    : PEOPLE.find((user) => user.username === username)

  if (!person) return <ErrorPage code={404} />

  const profile = PROFILES[username]
  const isFriend = friends.includes(username)
  const incoming = requests.incoming.includes(username)
  const outgoing = requests.outgoing.includes(username)

  function updateFriends(next: string[]) {
    saveFriends(next)
    setFriends(next)
  }

  function updateRequests(next: typeof requests) {
    saveRequests(next)
    setRequests(next)
  }

  function clearIncomingRequest() {
    updateRequests({ ...requests, incoming: requests.incoming.filter((id) => id !== username) })
  }

  return (
    <AppShell search={
      <form action="/friends" className="w-full max-w-sm">
        <input name="q" type="search" required aria-label="Find a user" placeholder="Search people…" className="w-full rounded-md border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm placeholder:text-muted" />
      </form>
    }>
      <main className="flex-1 space-y-4 px-4 py-5 sm:px-7">
        <h1 className="text-2xl font-semibold">Profile</h1>

        <section className={`${PANEL} flex flex-wrap items-center justify-between gap-5 sm:p-6`} aria-labelledby="profile-name">
          <div className="flex items-center gap-4">
            <span className={`relative grid size-16 shrink-0 place-items-center rounded-full text-xl font-semibold text-background sm:size-20 ${person.color}`} aria-hidden="true">
              {isOwnProfile && ownSettings.avatar
                ? <img src={ownSettings.avatar} alt="" className="size-full rounded-full object-cover" />
                : person.initials}
              <span className={`absolute right-0 bottom-0 size-4 rounded-full ring-2 ring-surface ${person.online ? 'bg-emerald-400' : 'bg-muted'}`} />
            </span>
            <div>
              <h2 id="profile-name" className="text-2xl font-medium">{person.name}</h2>
              <p className="text-sm text-muted">@{person.username}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-info">{isOwnProfile ? 'Admin' : 'User'}</span>
                <span className={`rounded-full bg-foreground/5 px-2.5 py-1 ${person.online ? 'text-emerald-400' : 'text-muted'}`}>{person.online ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>

          {isOwnProfile && <a href="/settings" className={PRIMARY}>Edit profile</a>}
          {!isOwnProfile && (
            <div className="flex flex-wrap gap-2">
              {isFriend && (
                <>
                  <a href={`/messages?to=${encodeURIComponent(username)}`} className={PRIMARY}>Message</a>
                  <button type="button" className={ACTION} onClick={() => updateFriends(friends.filter((id) => id !== username))}>Remove friend</button>
                </>
              )}
              {!isFriend && incoming && (
                <>
                  <button type="button" className={PRIMARY} onClick={() => {
                    updateFriends([...friends, username])
                    clearIncomingRequest()
                  }}>Accept</button>
                  <button type="button" className={ACTION} onClick={clearIncomingRequest}>Decline</button>
                </>
              )}
              {!isFriend && outgoing && (
                <>
                  <span className="px-2 py-2 text-sm text-muted" role="status">Request sent</span>
                  <button type="button" className={ACTION} onClick={() => updateRequests({ ...requests, outgoing: requests.outgoing.filter((id) => id !== username) })}>Cancel</button>
                </>
              )}
              {!isFriend && !incoming && !outgoing && (
                <button type="button" className={PRIMARY} onClick={() => updateRequests({ ...requests, outgoing: [...requests.outgoing, username] })}>Add friend</button>
              )}
            </div>
          )}
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <section className={PANEL}>
            <h2 className="mb-2 font-medium">About</h2>
            <p className="text-sm text-muted">{(isOwnProfile ? ownSettings.bio : profile?.bio) || 'No bio yet.'}</p>
          </section>

          <section className={PANEL}>
            <h2 className="mb-2 font-medium">{isOwnProfile ? 'My workspaces' : 'Shared workspaces'}</h2>
            {profile ? (
              <ul className="grid gap-2 text-sm" role="list">
                {profile.workspaces.map(({ id, name, role }) => (
                  <li key={id} className="flex flex-wrap items-center justify-between gap-2">
                    <a className="hover:text-primary" href={`/workspaces/${id}`}>{name}</a>
                    <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-muted">{role}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted">No shared workspaces to show.</p>}
          </section>

          <section className={PANEL}>
            <h2 className="mb-2 font-medium">Stats</h2>
            {profile ? (
              <dl className="grid gap-2 text-sm">
                <div className="flex gap-1"><dt>Tasks done:</dt><dd>{profile.tasksDone}</dd></div>
                <div className="flex gap-1 text-muted"><dt>Joined:</dt><dd>{profile.joined}</dd></div>
                <div className="flex gap-1 text-muted"><dt>Last seen:</dt><dd>{person.online ? 'Now' : 'Offline'}</dd></div>
              </dl>
            ) : <p className="text-sm text-muted">No stats to show.</p>}
          </section>
        </div>
      </main>
    </AppShell>
  )
}
