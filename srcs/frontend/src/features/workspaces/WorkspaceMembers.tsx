import { useState } from 'react'
import type { FormEvent } from 'react'
import { MEMBER_NAMES } from './workspace-preview-data'
import type { Member } from './workspace-preview-data'
import { CONTROL, PANEL, PRIMARY } from './workspace-styles'

const ROLE_SELECT = `${CONTROL} scheme-light [&>option]:bg-white [&>option]:text-black`

const MEMBER_COLUMNS = 'lg:grid-cols-[minmax(0,1.2fr)_minmax(4rem,0.45fr)_minmax(4.5rem,0.55fr)_minmax(0,1.65fr)]'

type Assignment = { title: string; status: string; assignee: string }

export function WorkspaceMembers({ members, currentMember, tasks, onChange }: {
  members: Member[]
  currentMember: string | undefined
  tasks: Assignment[]
  onChange: (members: Member[], activity: string) => void
}) {
  const [message, setMessage] = useState('')
  const currentRole = members.find(({ name }) => name === currentMember)?.role
  const isOwner = currentRole === 'Owner'
  const canManageMembers = isOwner || currentRole === 'Manager'

  function transferOwnership(name: string) {
    if (!isOwner || name === currentMember || !members.some((member) => member.name === name)) return
    if (!window.confirm(`Transfer ownership to ${name}? You will become a Member.`)) return

    const nextMembers: Member[] = members.map((member) => {
      if (member.name === name) return { ...member, role: 'Owner' }
      if (member.role === 'Owner') return { ...member, role: 'Member' }
      return member
    })
    onChange(nextMembers, `You transferred ownership to ${name}`)
  }

  function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canManageMembers) return
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('member')).trim()
    if (!name) return
    if (members.some((member) => member.name.toLowerCase() === name.toLowerCase())) {
      setMessage('This member is already in the workspace.')
      return
    }
    const role = isOwner && data.get('role') === 'Manager' ? 'Manager' : 'Member'
    onChange([...members, { name, role, joined: 'Today' }], `You added ${name}`)
    form.reset()
    setMessage('')
  }

  return (
    <div className="grid gap-4">
      {canManageMembers && (
        <form id="add-workspace-member" className={PANEL} onSubmit={addMember}>
          <h2 className="mb-2 font-medium">Add a member</h2>
          <div className="flex flex-wrap gap-2">
            <input id="workspace-member-name" name="member" required maxLength={80} aria-label="Username or email" placeholder="Username or email…" className={`${CONTROL} min-w-0 flex-1 basis-full sm:basis-40`} />
            <select name="role" aria-label="New member role" className={ROLE_SELECT}>
              <option value="Member">Role: Member</option>
              {isOwner && <option value="Manager">Role: Manager</option>}
            </select>
            <button className={PRIMARY}>Add member</button>
          </div>
          {message && <p className="mt-2 text-sm text-danger" role="alert">{message}</p>}
        </form>
      )}

      <section className={PANEL}>
        <h2 className="mb-2 font-medium">Members ({members.length})</h2>
        <p className="mb-3 text-sm text-muted">Managers help manage members. The owner appoints managers and can transfer ownership.</p>
        <div className={`hidden gap-3 px-3 pb-2 text-xs uppercase text-muted lg:grid ${MEMBER_COLUMNS}`} aria-hidden="true">
          <span>User</span>
          <span>Role</span>
          <span>Joined</span>
          <span>Actions</span>
        </div>
        <ul className="grid min-w-0 gap-2 lg:gap-0" aria-label="Workspace members" role="list">
          {members.map(({ name, role, joined }) => (
            <li key={name} className={`grid min-w-0 gap-3 rounded-md border border-foreground/10 p-3 sm:grid-cols-[minmax(0,1fr)_auto] lg:rounded-none lg:border-x-0 lg:border-b-0 ${MEMBER_COLUMNS}`}>
              <div className="min-w-0 wrap-anywhere">
                <p className="font-medium">{name}</p>
                {tasks.filter(({ assignee }) => MEMBER_NAMES[assignee] === name).map(({ title, status }) => (
                  <p key={title} className="text-xs text-muted">{title} · {status}</p>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm sm:flex-col lg:contents">
                <p className={role === 'Owner' ? 'text-primary' : 'text-muted'}>
                  <span className="sr-only">Role: </span>{role}
                </p>
                <p className="text-muted"><span className="lg:sr-only">Joined </span>{joined}</p>
              </div>
              <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                {role === 'Owner' && <span className="text-xs text-muted">Workspace owner</span>}
                {role !== 'Owner' && (
                  <div className="flex flex-wrap items-center gap-2 py-1">
                    {isOwner && (
                      <>
                        <select aria-label={`Role for ${name}`} value={role} className={ROLE_SELECT} onChange={(event) => {
                          const nextRole = event.target.value === 'Manager' ? 'Manager' : 'Member'
                          onChange(members.map((member) => member.name === name ? { ...member, role: nextRole } : member), `You changed ${name}’s role to ${nextRole}`)
                        }}>
                          <option value="Member">Member</option>
                          <option value="Manager">Manager</option>
                        </select>
                        <button type="button" className={CONTROL} onClick={() => transferOwnership(name)}>Transfer ownership</button>
                      </>
                    )}
                    {(isOwner || (canManageMembers && role === 'Member')) && (
                      <button type="button" className={CONTROL} onClick={() => onChange(members.filter((member) => member.name !== name), `You removed ${name}`)}>Remove</button>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
