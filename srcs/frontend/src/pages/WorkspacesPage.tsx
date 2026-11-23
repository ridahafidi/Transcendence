import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useParams } from 'react-router'
import WorkspaceDetail from '../features/workspaces/WorkspaceDetail'
import ErrorPage from './ErrorPage'

type Workspace = {
  id: number
  name: string
  description: string
  tasks: number
  progress: number
  members: string[]
}

const SAMPLE_WORKSPACES: Workspace[] = [
  { id: 6, name: 'Kitchen', description: 'Menu, stock and prep planning', tasks: 24, progress: 72, members: ['AL', 'SM', 'YK', 'KR', 'HM'] },
  { id: 5, name: 'Front of House', description: 'Service, shifts and customers', tasks: 16, progress: 72, members: ['SM', 'AL', 'YK'] },
  { id: 4, name: 'Marketing', description: 'Social media and promotions', tasks: 11, progress: 72, members: ['SM', 'AL', 'YK'] },
  { id: 3, name: 'Finance', description: 'Invoices and monthly reports', tasks: 8, progress: 72, members: ['SM', 'AL', 'YK'] },
  { id: 2, name: 'Maintenance', description: 'Equipment and repairs', tasks: 8, progress: 72, members: ['SM', 'AL', 'YK'] },
  { id: 1, name: 'HR', description: 'Hiring and onboarding', tasks: 8, progress: 72, members: ['SM', 'AL', 'YK'] },
]

const WORKSPACES_KEY = 'nexa-demo-workspaces'

function readWorkspaces(): Workspace[] {
  try {
    const saved = sessionStorage.getItem(WORKSPACES_KEY)
    return saved ? JSON.parse(saved) : SAMPLE_WORKSPACES
  } catch {
    return SAMPLE_WORKSPACES
  }
}

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z' },
  { label: 'Workspaces', icon: 'M3 8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z M8 7V4h8v3 M3 12h18' },
  { label: 'Messages', icon: 'M21 11a9 9 0 0 1-9 9H8l-5 2 1.5-5A9 9 0 1 1 21 11z' },
  { label: 'Files', icon: 'M6 2h8l5 5v15H6z M14 2v6h5' },
  { label: 'Analytics', icon: 'M4 21V11 M12 21V4 M20 21v-8' },
  { label: 'Developer', icon: 'm8 6-6 6 6 6 m8-12 6 6-6 6 M14 2l-4 20' },
  { label: 'Admin', icon: 'M12 2l9 4v6c0 4-4 8-9 10-5-2-9-6-9-10V6z m-4 10 3 3 5-5' },
  { label: 'Settings', icon: 'm10 2-1 3-2 1-3-1-2 4 2 2v2l-2 2 2 4 3-1 2 1 1 3h4l1-3 2-1 3 1 2-4-2-2v-2l2-2-2-4-3 1-2-1-1-3z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' },
]

function SidebarIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

const AVATAR_COLORS = ['bg-danger', 'bg-indigo-500', 'bg-orange-400']
const CONTROL = 'rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm text-foreground'
const PRIMARY = 'cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background hover:brightness-110'

function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const { id, name, description, tasks, progress, members } = workspace

  return (
    <li className="min-w-0">
      <a href={`/workspaces/${id}`} className="block h-full rounded-lg border border-foreground/10 bg-surface p-3 hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-primary sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="min-w-0 text-lg leading-tight wrap-anywhere">{name}</h2>
          <span className="shrink-0 rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-primary">
            {tasks} {tasks === 1 ? 'task' : 'tasks'}
          </span>
        </div>
        <p className="mt-2 truncate text-sm text-muted" title={description}>{description || 'No description'}</p>
        <div role="progressbar" aria-label={`${name} task progress`} aria-valuenow={progress} className="mt-3 h-1.5 rounded-full bg-foreground/5">
          <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <ul className="flex min-h-8 -space-x-2" aria-label="Workspace members" role="list">
            {members.map((member, index) => (
              <li key={member} className={`grid size-8 place-items-center rounded-full border border-surface text-xs text-background ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
                {member}
              </li>
            ))}
          </ul>
          <span className="text-xs text-muted">{progress}%</span>
        </div>
      </a>
    </li>
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

export default function WorkspacesPage() {
  const { workspaceId } = useParams()
  const [workspaces, setWorkspaces] = useState(readWorkspaces)
  const workspace = workspaces.find(({ id }) => String(id) === workspaceId)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('recent')
  const createDialog = useRef<HTMLDialogElement>(null)

  const query = search.trim().toLowerCase()
  const visibleWorkspaces = workspaces
    .filter(({ name, description, tasks }) => {
      const matchesSearch = `${name} ${description}`.toLowerCase().includes(query)
      const matchesFilter = filter === 'all' || (filter === 'with-tasks' ? tasks > 0 : tasks === 0)
      return matchesSearch && matchesFilter
    })
    .sort((first, second) => {
      if (sort === 'name') return first.name.localeCompare(second.name)
      if (sort === 'tasks') return second.tasks - first.tasks
      return second.id - first.id
    })

  function createWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const name = String(fields.get('name') ?? '').trim()
    const description = String(fields.get('description') ?? '').trim()

    if (!name) return

    const nextWorkspaces = [
      { id: Math.max(0, ...workspaces.map(({ id }) => id)) + 1, name, description, tasks: 0, progress: 0, members: ['SM'] },
      ...workspaces,
    ]
    sessionStorage.setItem(WORKSPACES_KEY, JSON.stringify(nextWorkspaces))
    setWorkspaces(nextWorkspaces)
    setSearch('')
    setFilter('all')
    setSort('recent')
    form.reset()
    createDialog.current?.close()
  }

  if (workspaceId && !workspace) return <ErrorPage code={404} />

  return (
    <div className="min-h-dvh bg-background md:grid md:grid-cols-[clamp(8rem,15vw,13rem)_minmax(0,1fr)]">
      <aside className="flex flex-col gap-4 border-b border-foreground/20 bg-surface/60 p-3 md:border-r md:border-b-0">
        <a href="/" className="px-3 text-xl font-medium">// NEXA</a>
        <nav aria-label="Workspace navigation" className="flex flex-wrap gap-1 text-sm md:grid">
          {NAV_ITEMS.map(({ label, icon }) => label === 'Workspaces' ? (
            <a key={label} href="/workspaces" aria-current="page" className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-primary">
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
          <span className="grid size-8 place-items-center rounded-full bg-danger text-xs text-background" aria-hidden="true">SM</span>
          <div className="text-sm leading-tight">Amine L.<p className="text-xs text-muted">Admin</p></div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-foreground/20 px-4 py-3 sm:px-7">
          <input type="search" aria-label={workspace ? "Search tasks" : "Search workspace names and descriptions"} placeholder={workspace ? "Search tasks…" : "Search workspaces…"} value={search} onChange={(event) => setSearch(event.target.value)} className={`${CONTROL} w-full max-w-xs bg-background placeholder:text-muted`} />
          <div className="flex shrink-0 items-center gap-3">
            <NotificationButton />
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-danger text-xs text-background" aria-label="Sample account">SM</span>
          </div>
        </header>

        {workspace ? (
          <WorkspaceDetail workspace={workspace} search={search} />
        ) : (
          <main className="flex flex-1 flex-col gap-[clamp(1.5rem,5dvh,3rem)] px-4 py-5 sm:px-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl leading-tight font-semibold uppercase">Workspaces</h1>
                <p className="text-sm text-muted">All workspaces you belong to</p>
              </div>
              <button className={PRIMARY} type="button" onClick={() => createDialog.current?.showModal()}>+ New workspace</button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <input type="search" aria-label="Filter workspace cards" placeholder="Search workspaces…" value={search} onChange={(event) => setSearch(event.target.value)} className={`${CONTROL} w-full sm:max-w-sm placeholder:text-muted`} />
              <div className="flex flex-wrap gap-3">
                <select aria-label="Filter by task count" value={filter} onChange={(event) => setFilter(event.target.value)} className={`${CONTROL} scheme-light [&>option]:bg-white [&>option]:text-black`}>
                  <option value="all">Filter: All</option>
                  <option value="with-tasks">With tasks</option>
                  <option value="without-tasks">Without tasks</option>
                </select>
                <select aria-label="Sort workspaces" value={sort} onChange={(event) => setSort(event.target.value)} className={`${CONTROL} scheme-light [&>option]:bg-white [&>option]:text-black`}>
                  <option value="recent">Sort: Recent</option>
                  <option value="name">Sort: Name</option>
                  <option value="tasks">Sort: Task count</option>
                </select>
              </div>
            </div>

            {visibleWorkspaces.length > 0 ? (
              <ul className="grid gap-3 min-[500px]:grid-cols-2 md:grid-cols-3 lg:gap-5" role="list">
                {visibleWorkspaces.map((workspace) => <WorkspaceCard key={workspace.id} workspace={workspace} />)}
              </ul>
            ) : (
              <p className="rounded-lg border border-foreground/10 bg-surface p-6 text-center text-muted" role="status">No workspaces match your search.</p>
            )}
          </main>
        )}
        <footer className="p-4 text-center text-xs text-muted">© 2026 Nexa</footer>
      </div>

      <dialog ref={createDialog} aria-labelledby="new-workspace-title" className="m-auto w-11/12 max-w-md rounded-xl border border-foreground/20 bg-surface p-5 text-foreground backdrop:bg-black/60">
        <form className="grid gap-4" onSubmit={createWorkspace}>
          <h2 id="new-workspace-title" className="text-xl font-semibold">New workspace</h2>
          <label className="grid gap-1 text-sm">
            Name
            <input name="name" required maxLength={80} pattern={'.*\\S.*'} className={CONTROL} />
          </label>
          <label className="grid gap-1 text-sm">
            Description
            <textarea name="description" rows={3} maxLength={240} className={CONTROL} />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" className={`${CONTROL} cursor-pointer`} onClick={() => createDialog.current?.close()}>Cancel</button>
            <button type="submit" className={PRIMARY}>Create workspace</button>
          </div>
        </form>
      </dialog>
    </div>
  )
}
