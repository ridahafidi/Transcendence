import AppShell from '../components/AppShell'
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
    <AppShell activePage="/workspaces" search={
      <input type="search" aria-label={workspace ? "Search tasks" : "Search workspace names and descriptions"} placeholder={workspace ? "Search tasks…" : "Search workspaces…"} value={search} onChange={(event) => setSearch(event.target.value)} className={`${CONTROL} w-full max-w-xs bg-background placeholder:text-muted`} />
    }>
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
    </AppShell>
  )
}
