import { useRef, useState } from 'react'
import AppShell from '../components/AppShell'

import { PEOPLE, readFriends, readRequests, saveFriends, saveRequests } from '../features/friends/friends-preview-data'
import type { Person } from '../features/friends/friends-preview-data'

const ACTION = 'cursor-pointer rounded-md border border-foreground/10 px-2.5 py-1.5 text-xs hover:bg-foreground/10'
const PRIMARY = 'cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background hover:brightness-110'

function PersonCard({ person, children }: { person: Person; children: React.ReactNode }) {
  return (
    <li className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-surface p-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className={`relative grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-background ${person.color}`} aria-hidden="true">
          {person.initials}
          <span className={`absolute right-0 bottom-0 size-2 rounded-full ring-2 ring-surface ${person.online ? 'bg-emerald-400' : 'bg-muted'}`} />
        </span>
        <div className="min-w-0">
          <a className="block truncate text-sm font-semibold hover:text-primary" href={`/users/${person.username}`}>{person.name}</a>
          <p className="text-xs text-muted">{person.online ? 'Online' : 'Offline'} · @{person.username}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </li>
  )
}

export default function FriendsPage() {
  const [search, setSearch] = useState(() => {
    const query = new URLSearchParams(window.location.search).get('q')?.trim()
    return query ? `@${query.replace(/^@/, '')}` : ''
  })
  const [view, setView] = useState<'friends' | 'requests'>('friends')
  const [friends, setFriends] = useState(readFriends)
  const [requests, setRequests] = useState(readRequests)
  const { incoming, outgoing } = requests
  const searchInput = useRef<HTMLInputElement>(null)
  const isUserSearch = search.trimStart().startsWith('@')
  const query = search.trim().replace(/^@/, '').trim().toLowerCase()
  const people = PEOPLE.filter((person) => {
    if (!person.username.includes(query) && !person.name.toLowerCase().includes(query)) return false
    if (isUserSearch) return query !== ''
    return view === 'friends' ? friends.includes(person.username) : incoming.includes(person.username) || outgoing.includes(person.username)
  })

  function updateFriends(usernames: string[]) {
    saveFriends(usernames)
    setFriends(usernames)
  }

  function updateRequests(next: typeof requests) {
    saveRequests(next)
    setRequests(next)
  }

  function beginUserSearch() {
    if (!isUserSearch) setSearch('@')
    searchInput.current?.focus()
  }

  return (
    <AppShell activePage="/friends" search={
      <input ref={searchInput} type="search" aria-label="Search friends or type @ to find a user" placeholder="Search friends or type @ to find a user…" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full max-w-sm rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm placeholder:text-muted" />
    }>
      <main className="flex-1 px-4 py-5 sm:px-7">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Friends</h1>
            <p className="text-sm text-muted">Your connections and requests</p>
          </div>
          <button type="button" className={PRIMARY} onClick={beginUserSearch}>+ Add friends</button>
        </header>

        <div className="mt-4 flex gap-4 border-b border-foreground/10" role="group" aria-label="Friends views">
          <button type="button" aria-pressed={!isUserSearch && view === 'friends'} onClick={() => { setView('friends'); setSearch('') }} className="cursor-pointer border-b-2 border-transparent px-2 py-2 text-sm text-muted aria-pressed:border-primary aria-pressed:text-primary">All friends ({friends.length})</button>
          <button type="button" aria-pressed={!isUserSearch && view === 'requests'} onClick={() => { setView('requests'); setSearch('') }} className="cursor-pointer border-b-2 border-transparent px-2 py-2 text-sm text-muted aria-pressed:border-primary aria-pressed:text-primary">Requests ({incoming.length + outgoing.length})</button>
        </div>

        {isUserSearch && <h2 className="mt-4 text-sm font-medium">User search <span className="text-muted">· Demo directory</span></h2>}
        {people.length === 0 && (
          <p className="mt-4 text-sm text-muted" role="status">
            {isUserSearch && !query ? 'Type a username after @.' : 'No matching people.'}
          </p>
        )}

        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3" role="list">
          {people.map((person) => {
            const { username } = person
            return (
              <PersonCard key={username} person={person}>
                {friends.includes(username) ? (
                  <>
                    <a href={`/messages?to=${encodeURIComponent(username)}`} className={ACTION}>Message</a>
                    <button type="button" className={`${ACTION} border-danger/50 text-danger`} onClick={() => updateFriends(friends.filter((id) => id !== username))}>Remove</button>
                  </>
                ) : incoming.includes(username) ? (
                  <button type="button" className={ACTION} onClick={() => {
                    updateFriends([...friends, username])
                    updateRequests({ ...requests, incoming: incoming.filter((id) => id !== username) })
                  }}>Accept</button>
                ) : outgoing.includes(username) ? (
                  <span className="text-xs text-muted">Request sent</span>
                ) : (
                  <button type="button" className={ACTION} onClick={() => updateRequests({ ...requests, outgoing: [...outgoing, username] })}>Send request</button>
                )}
              </PersonCard>
            )
          })}
        </ul>
      </main>
    </AppShell>
  )
}
