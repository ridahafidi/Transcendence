import { useState } from 'react'
import type { FormEvent } from 'react'
import AppShell from '../components/AppShell'
import { PEOPLE, readFriends } from '../features/friends/friends-preview-data'
import type { Person } from '../features/friends/friends-preview-data'

type Message = { id: string; text: string; fromMe: boolean; sentAt?: number }
type Threads = Record<string, Message[]>

const SAMPLE_THREADS: Threads = {
  sara: [
    { id: 's1', text: 'Hi! Did you check the new schedule?', fromMe: false, sentAt: 6 },
    { id: 's2', text: 'Yes, looks good. Updating the tasks now.', fromMe: true, sentAt: 7 },
    { id: 's3', text: 'Perfect, see you at the meeting.', fromMe: false, sentAt: 8 },
  ],
  youssef: [{ id: 'y1', text: 'I sent the invoice.', fromMe: false, sentAt: 5 }],
  hajar: [{ id: 'h1', text: 'Thanks!', fromMe: false, sentAt: 4 }],
}

const THREADS_KEY = 'nexa-preview-direct-messages'
const INPUT = 'w-full rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm placeholder:text-muted'

function readThreads(): Threads {
  try {
    const saved = sessionStorage.getItem(THREADS_KEY)
    return saved ? JSON.parse(saved) : SAMPLE_THREADS
  } catch {
    return SAMPLE_THREADS
  }
}

function Avatar({ person }: { person: Person }) {
  return (
    <span className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-background ${person.color}`} aria-hidden="true">
      {person.initials}
    </span>
  )
}

export default function MessagesPage() {
  const [friends] = useState(readFriends)
  const [threads, setThreads] = useState(readThreads)
  const [search, setSearch] = useState('')
  const recentConversations = PEOPLE.filter(({ username }) => friends.includes(username))
    .sort((first, second) => lastMessageTime(second.username) - lastMessageTime(first.username))

  function lastMessageTime(username: string) {
    const latest = threads[username]?.at(-1)
    // Earlier preview messages were saved without timestamps.
    return latest?.sentAt ?? (latest ? 1 : 0)
  }

  const [recipient, setRecipient] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get('to')
    return requested && friends.includes(requested) ? requested : recentConversations.find(({ username }) => threads[username]?.length)?.username
  })
  const [draft, setDraft] = useState('')

  const currentPerson = PEOPLE.find(({ username }) => username === recipient)
  const messages = recipient ? threads[recipient] ?? [] : []
  const query = search.trim().toLowerCase()
  const conversations = recentConversations.filter(({ username, name }) =>
    (threads[username]?.length || recipient === username) &&
    `${name} ${username}`.toLowerCase().includes(query),
  )

  function selectConversation(username: string) {
    setRecipient(username)
    setDraft('')
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!recipient || !text) return

    const nextThreads = {
      ...threads,
      [recipient]: [...messages, { id: crypto.randomUUID(), text, fromMe: true, sentAt: Date.now() }],
    }
    sessionStorage.setItem(THREADS_KEY, JSON.stringify(nextThreads))
    setThreads(nextThreads)
    setDraft('')
  }

  return (
    <AppShell activePage="/messages" search={
      <input type="search" aria-label="Search conversations" placeholder="Search conversations…" className={`${INPUT} max-w-xs`} value={search} onChange={(event) => setSearch(event.target.value)} />
    }>
      <main className="flex flex-1 flex-col gap-4 px-4 py-5 sm:px-7">
        <header>
          <h1 className="text-2xl font-semibold">Messages</h1>
          <p className="text-sm text-muted">Direct messages with your friends</p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(12rem,1fr)_minmax(0,2.4fr)]">
          <aside aria-label="Conversations" className="rounded-lg border border-foreground/10 bg-surface p-3">
            <ul className="grid gap-1" role="list">
              {conversations.map((person) => {
                const lastMessage = threads[person.username]?.at(-1)
                return (
                  <li key={person.username}>
                    <button
                      type="button"
                      aria-pressed={recipient === person.username}
                      onClick={() => selectConversation(person.username)}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-md p-2 text-left hover:bg-foreground/5 aria-pressed:bg-primary/10"
                    >
                      <Avatar person={person} />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">{person.name}</span>
                        <span className="block truncate text-xs text-muted">{lastMessage?.text ?? 'New conversation'}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            {conversations.length === 0 && <p className="p-2 text-sm text-muted">No conversations found.</p>}
            <a href="/friends" className="mt-4 inline-block px-2 text-sm text-muted underline hover:text-primary">Start a chat from Friends</a>
          </aside>

          <section aria-label="Direct message thread" className="flex min-h-96 min-w-0 flex-col rounded-lg border border-foreground/10 bg-surface">
            {currentPerson ? (
              <>
                <header className="flex items-center gap-3 border-b border-foreground/10 p-4">
                  <Avatar person={currentPerson} />
                  <div>
                    <h2 className="font-medium"><a href={`/users/${currentPerson.username}`} className="hover:text-primary">{currentPerson.name}</a></h2>
                    <p className={currentPerson.online ? 'text-xs text-emerald-400' : 'text-xs text-muted'}>{currentPerson.online ? 'Online' : 'Offline'}</p>
                  </div>
                </header>

                <ul className="grid max-h-96 flex-1 content-start gap-3 overflow-y-auto p-4" aria-label="Messages" role="list">
                  {messages.map(({ id, text, fromMe }) => (
                    <li key={id} className={`w-fit max-w-[85%] rounded-md px-3 py-2 text-sm wrap-anywhere ${fromMe ? 'ml-auto bg-primary text-background' : 'bg-foreground/5'}`}>
                      <span className="sr-only">{fromMe ? 'You' : currentPerson.name}: </span>{text}
                    </li>
                  ))}
                  {messages.length === 0 && <li className="text-sm text-muted">No messages yet.</li>}
                </ul>

                <form className="flex gap-3 p-4" onSubmit={sendMessage}>
                  <input aria-label="Type a message" maxLength={1000} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a message…" className={`${INPUT} min-w-0`} />
                  <button type="submit" disabled={!draft.trim()} className="cursor-pointer rounded-md bg-primary px-4 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50">Send</button>
                </form>
              </>
            ) : (
              <p className="m-auto rounded p-4 text-center text-sm text-muted">Open a conversation or start one from Friends.</p>
            )}
          </section>
        </div>
      </main>
    </AppShell>
  )
}
