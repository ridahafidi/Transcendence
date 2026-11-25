import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import AppShell from '../components/AppShell'
import { CURRENT_ADMIN, ROLES, readAdminPreview, saveAdminPreview } from '../features/admin/admin-preview-data'
import type { AdminUser, Role } from '../features/admin/admin-preview-data'
import { profileInitials } from '../features/settings/profile-preview'

const TABS = ['Users', 'Roles & permissions', 'Workspaces', 'Audit log'] as const
const PAGE_SIZE = 5
const PANEL = 'min-w-0 rounded-lg border border-foreground/10 bg-surface p-4'
const CONTROL = 'rounded-md border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm'
const SELECT = `${CONTROL} scheme-light [&>option]:bg-white [&>option]:text-black`
const ACTION = `${CONTROL} cursor-pointer hover:bg-foreground/10`
const PRIMARY = 'cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-background hover:brightness-110'
const COLUMNS = 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(4rem,.6fr)_minmax(4rem,.6fr)_minmax(0,1.2fr)]'

const ROLE_DETAILS = {
  Admin: 'Manage users, roles, and account status.',
  Moderator: 'View users and manage allowed moderation actions.',
  User: 'Use workspaces and collaborate according to workspace permissions.',
  Guest: 'Use only the areas explicitly shared with them.',
}

export default function AdminPage() {
  const [data, setData] = useState(readAdminPreview)
  const [tab, setTab] = useState<typeof TABS[number]>('Users')
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState<AdminUser>()
  const [error, setError] = useState('')
  const dialog = useRef<HTMLDialogElement>(null)
  const form = useRef<HTMLFormElement>(null)
  const { users, audit } = data
  const filter = query.trim().toLowerCase()
  const matches = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(filter) &&
    (role === 'all' || user.role === role) &&
    (status === 'all' || user.active === (status === 'active')),
  )
  const lastPage = Math.max(0, Math.ceil(matches.length / PAGE_SIZE) - 1)
  const currentPage = Math.min(page, lastPage)

  function updateUsers(next: AdminUser[], action: string) {
    const updated = { users: next, audit: [{ action, time: new Date().toLocaleString() }, ...audit] }
    saveAdminPreview(updated)
    setData(updated)
  }

  function openForm(user?: AdminUser) {
    setEditing(user)
    setError('')
    dialog.current?.showModal()
  }

  function submitUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const name = String(fields.get('name') ?? '').trim()
    const email = String(fields.get('email') ?? '').trim().toLowerCase()
    const nextRole: Role = editing?.id === CURRENT_ADMIN
      ? editing.role
      : ROLES.find((item) => item === fields.get('role')) ?? 'User'
    if (!name || !email) return
    if (users.some((user) => user.email.toLowerCase() === email && user.id !== editing?.id)) {
      setError('A user already has this email.')
      return
    }

    if (editing) {
      updateUsers(users.map((user) => user.id === editing.id ? { ...user, name, email, role: nextRole } : user), `Edited ${name}`)
    } else {
      const id = Math.max(0, ...users.map((user) => user.id)) + 1
      updateUsers([{ id, name, email, role: nextRole, active: true }, ...users], `Added ${name}`)
      setQuery('')
      setRole('all')
      setStatus('all')
      setPage(0)
    }
    dialog.current?.close()
  }

  function toggleUser(user: AdminUser) {
    if (user.id === CURRENT_ADMIN) return
    updateUsers(users.map((item) => item.id === user.id ? { ...item, active: !item.active } : item), `${user.active ? 'Disabled' : 'Enabled'} ${user.name}`)
  }

  function deleteUser(user: AdminUser) {
    if (user.id === CURRENT_ADMIN || !window.confirm(`Delete ${user.name} from this preview?`)) return
    updateUsers(users.filter(({ id }) => id !== user.id), `Deleted ${user.name}`)
  }

  return (
    <AppShell activePage="/admin/users" search={
      <input type="search" aria-label="Search users" placeholder="Search users…" value={query} onChange={(event) => { setQuery(event.target.value); setTab('Users'); setPage(0) }} className={`w-full max-w-sm ${CONTROL} placeholder:text-muted`} />
    }>
      <main className="flex-1 space-y-4 px-4 py-5 sm:px-7">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Admin — {tab}</h1>
            <p className="text-sm text-muted">Manage users and roles · Preview</p>
          </div>
          {tab === 'Users' && <button type="button" className={PRIMARY} onClick={() => openForm()}>+ Add user</button>}
        </header>

        <div className="flex flex-wrap gap-x-4 border-b border-foreground/15" role="group" aria-label="Admin views">
          {TABS.map((name) => (
            <button key={name} type="button" aria-pressed={tab === name} onClick={() => setTab(name)} className="cursor-pointer border-b-2 border-transparent py-2 text-sm text-muted aria-pressed:border-primary aria-pressed:text-primary">{name}</button>
          ))}
        </div>

        {tab === 'Users' && (
          <>
            <div className="flex flex-wrap gap-2">
              <input type="search" aria-label="Filter users" placeholder="Search users…" value={query} onChange={(event) => { setQuery(event.target.value); setPage(0) }} className={`${CONTROL} w-full max-w-xs placeholder:text-muted`} />
              <select aria-label="Filter by role" className={SELECT} value={role} onChange={(event) => { setRole(event.target.value); setPage(0) }}>
                <option value="all">All roles</option>
                {ROLES.map((name) => <option key={name}>{name}</option>)}
              </select>
              <select aria-label="Filter by status" className={SELECT} value={status} onChange={(event) => { setStatus(event.target.value); setPage(0) }}>
                <option value="all">All statuses</option><option value="active">Active</option><option value="disabled">Disabled</option>
              </select>
            </div>

            <section className={PANEL} aria-label="User management">
              <div className={`hidden gap-2 px-3 pb-2 text-xs uppercase text-muted lg:grid ${COLUMNS}`} aria-hidden="true">
                <span>User</span><span>Email</span><span>Role</span><span>Status</span><span>Actions</span>
              </div>
              <ul className="grid gap-2 lg:gap-0" role="list">
                {matches.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE).map((user) => (
                  <li key={user.id} className={`grid min-w-0 items-center gap-2 rounded-md border border-foreground/10 p-3 text-sm sm:grid-cols-2 lg:rounded-none lg:border-x-0 lg:border-b-0 ${COLUMNS}`}>
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs text-background" aria-hidden="true">{profileInitials(user.name)}</span>
                      <span className="wrap-anywhere">{user.name}</span>
                    </span>
                    <span className="text-muted wrap-anywhere">{user.email}</span>
                    <span className="w-fit rounded-full bg-foreground/5 px-2 py-1 text-xs text-info"><span className="sr-only">Role: </span>{user.role}</span>
                    <span className={user.active ? 'text-emerald-400' : 'text-danger'}><span className="sr-only">Status: </span>{user.active ? 'Active' : 'Disabled'}</span>
                    <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-1">
                      <button type="button" onClick={() => openForm(user)} aria-label={`Edit ${user.name}`} className={ACTION}>Edit</button>
                      {user.id !== CURRENT_ADMIN && (
                        <>
                          <button type="button" onClick={() => toggleUser(user)} aria-label={`${user.active ? 'Disable' : 'Enable'} ${user.name}`} className={`${ACTION} text-primary`}>{user.active ? 'Disable' : 'Enable'}</button>
                          <button type="button" onClick={() => deleteUser(user)} aria-label={`Delete ${user.name}`} className={`${ACTION} text-danger`}>Delete</button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {!matches.length && <p className="text-sm text-muted">No users match your filters.</p>}
            </section>

            {lastPage > 0 && (
              <div className="flex items-center justify-end gap-2 text-sm">
                <button type="button" className={`${ACTION} disabled:opacity-50`} disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</button>
                <span className="text-muted">{currentPage + 1} / {lastPage + 1}</span>
                <button type="button" className={`${ACTION} disabled:opacity-50`} disabled={currentPage === lastPage} onClick={() => setPage(currentPage + 1)}>Next</button>
              </div>
            )}
          </>
        )}

        {tab === 'Roles & permissions' && (
          <dl className={`${PANEL} grid gap-3 sm:grid-cols-2`}>
            {ROLES.map((name) => (
              <div key={name} className="rounded-md bg-foreground/5 p-3">
                <dt className="font-medium text-primary">{name}</dt>
                <dd className="mt-1 text-sm text-muted">{ROLE_DETAILS[name]}</dd>
              </div>
            ))}
          </dl>
        )}

        {tab === 'Workspaces' && (
          <section className={PANEL}>
            <h2 className="mb-2 font-medium">Workspace access</h2>
            <p className="mb-3 text-sm text-muted">Open a workspace and choose Members to manage its workspace roles in the preview.</p>
            <a href="/workspaces" className={`${PRIMARY} inline-block`}>Open workspaces</a>
          </section>
        )}

        {tab === 'Audit log' && (
          <section className={PANEL}>
            <h2 className="mb-2 font-medium">Recent admin actions</h2>
            {audit.length === 0 && <p className="text-sm text-muted">No changes in this preview yet.</p>}
            <ul className="divide-y divide-foreground/10" role="list">
              {audit.map(({ action, time }, index) => (
                <li key={index} className="flex flex-wrap justify-between gap-2 py-2 text-sm">
                  <span className="wrap-anywhere">{action}</span><span className="text-xs text-muted">{time}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <dialog ref={dialog} onClose={() => { setEditing(undefined); setError(''); form.current?.reset() }} aria-labelledby="admin-user-title" className="m-auto w-11/12 max-w-md rounded-xl border border-foreground/15 bg-surface p-5 text-foreground backdrop:bg-black/60">
          <form ref={form} key={editing?.id ?? 'new'} className="grid gap-3" onSubmit={submitUser}>
            <h2 id="admin-user-title" className="text-xl font-semibold">{editing ? 'Edit user' : 'Add user'}</h2>
            <label className="grid gap-1 text-sm">Name <input name="name" required maxLength={80} pattern={'.*\\S.*'} defaultValue={editing?.name} className={CONTROL} /></label>
            <label className="grid gap-1 text-sm">Email <input name="email" type="email" required defaultValue={editing?.email} className={CONTROL} /></label>
            <label className="grid gap-1 text-sm">Role
              <select name="role" defaultValue={editing?.role ?? 'User'} disabled={editing?.id === CURRENT_ADMIN} className={SELECT}>
                {ROLES.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            {error && <p className="text-sm text-danger" role="alert">{error}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" className={ACTION} onClick={() => dialog.current?.close()}>Cancel</button>
              <button type="submit" className={PRIMARY}>{editing ? 'Save changes' : 'Add user'}</button>
            </div>
          </form>
        </dialog>
      </main>
    </AppShell>
  )
}
