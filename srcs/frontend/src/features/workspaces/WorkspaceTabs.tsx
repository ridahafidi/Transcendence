import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { MEMBER_NAMES } from './workspace-preview-data'
import type { Activity, Member, Message, SharedFile } from './workspace-preview-data'

const PANEL = 'rounded-lg border border-foreground/10 bg-surface p-4'
const CONTROL = 'rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm'
const PRIMARY = 'rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background hover:brightness-110'
const ROLE_SELECT = `${CONTROL} scheme-light [&>option]:bg-white [&>option]:text-black`

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
            <input id="workspace-member-name" name="member" required maxLength={80} aria-label="Username or email" placeholder="Username or email…" className={`${CONTROL} min-w-0 flex-1 basis-40`} />
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-120 text-left text-sm">
            <thead className="text-xs uppercase text-muted">
              <tr><th className="py-2">User</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {members.map(({ name, role, joined }) => (
                <tr key={name} className="border-t border-foreground/10">
                  <td className="py-2 pr-3">
                    <p>{name}</p>
                    {tasks.filter(({ assignee }) => MEMBER_NAMES[assignee] === name).map(({ title, status }) => (
                      <p key={title} className="text-xs text-muted">{title} · {status}</p>
                    ))}
                  </td>
                  <td className={role === 'Owner' ? 'text-primary' : 'text-muted'}>{role}</td>
                  <td className="text-muted">{joined}</td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export function WorkspaceChat({ name, description, memberCount, messages, onSend, onFiles }: {
  name: string; description: string; memberCount: number; messages: Message[]
  onSend: (message: Message) => void; onFiles: () => void
}) {
  const channel = name.toLowerCase().replace(/\s+/g, '-')
  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const text = String(new FormData(form).get('message')).trim()
    if (!text) return
    onSend({ author: 'You', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text })
    form.reset()
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(12rem,1fr)]">
      <section className={PANEL}>
        <h2 className="font-medium"># {channel}</h2>
        <p className="mt-1 border-b border-foreground/10 pb-3 text-xs text-muted">{memberCount} members · Workspace conversation</p>
        <ul className="my-4 grid max-h-80 gap-3 overflow-y-auto" aria-label="Chat messages" role="list">
          {messages.map(({ author, time, text }, index) => (
            <li key={index} className={author === 'You' ? 'ml-auto w-fit max-w-[85%]' : 'w-fit max-w-[85%]'}>
              <p className="mb-1 text-xs text-muted">{author} · {time}</p>
              <p className={`rounded-md px-3 py-2 text-sm wrap-anywhere ${author === 'You' ? 'bg-primary/10' : 'bg-foreground/5'}`}>{text}</p>
            </li>
          ))}
        </ul>
        <form className="flex gap-2" onSubmit={sendMessage}>
          <input name="message" required maxLength={1000} aria-label="Message" placeholder={`Message #${channel}…`} className={`${CONTROL} min-w-0 flex-1`} />
          <button className={PRIMARY}>Send</button>
        </form>
      </section>
      <aside className={PANEL}>
        <h2 className="font-medium">About this channel</h2>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
        <p className="mt-4 text-sm">Shared with all {memberCount} workspace members</p>
        <button type="button" className={`${CONTROL} mt-3 w-full`} onClick={onFiles}>View shared files</button>
      </aside>
    </div>
  )
}

export function WorkspaceFiles({ name, files, onUpload }: {
  name: string; files: SharedFile[]; onUpload: (file: SharedFile) => void
}) {
  const picker = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  function addFile(file?: File) {
    if (!file) return
    if (!/\.(pdf|docx|png|jpe?g|gif|webp|avif)$/i.test(file.name) || file.size > 10 * 1024 * 1024) {
      setError('Choose a PDF, DOCX, or supported image up to 10 MB.')
      return
    }
    setError('')
    const size = file.size < 1024 * 1024
      ? `${Math.max(1, Math.round(file.size / 1024))} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    onUpload({ name: file.name, author: 'You', size, updated: 'Just now' })
  }

  return (
    <div className="grid gap-4">
      <section className={PANEL} onDragOver={(event) => event.preventDefault()} onDrop={(event) => {
        event.preventDefault()
        addFile(event.dataTransfer.files[0])
      }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-medium">Share files with the {name} team</h2>
            <p className="mt-1 text-sm text-muted">Drag and drop or choose a PDF, DOCX, or image up to 10 MB.</p>
          </div>
          <button type="button" className={PRIMARY} onClick={() => picker.current?.click()}>+ Upload file</button>
          <input ref={picker} type="file" accept=".pdf,.docx,.png,.jpg,.jpeg,.gif,.webp,.avif" hidden onChange={(event) => {
            addFile(event.target.files?.[0])
            event.target.value = ''
          }} />
        </div>
        {error && <p className="mt-2 text-sm text-danger" role="alert">{error}</p>}
      </section>
      <section className={PANEL}>
        <h2 className="mb-3 font-medium">Workspace files ({files.length})</h2>
        {files.length === 0 ? <p className="text-sm text-muted">No files yet.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-100 text-left text-sm">
              <thead className="text-xs uppercase text-muted">
                <tr><th className="pb-2">File name</th><th>Uploaded by</th><th>Size</th><th>Updated</th></tr>
              </thead>
              <tbody>
                {files.map(({ name, author, size, updated }, index) => (
                  <tr key={index} className="border-t border-foreground/10">
                    <td className="py-3 pr-3 wrap-anywhere">{name}</td><td className="text-muted">{author}</td><td className="text-muted">{size}</td><td className="text-muted">{updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export function WorkspaceActivity({ name, activity }: { name: string; activity: Activity[] }) {
  return (
    <section className={PANEL}>
      <h2 className="mb-3 font-medium">Recent changes in {name}</h2>
      {activity.length === 0 && <p className="text-sm text-muted">No activity yet.</p>}
      <ul className="divide-y divide-foreground/10" role="list">
        {activity.map(({ day, text, detail }, index) => (
          <li key={index} className="grid grid-cols-[5rem_1fr] gap-2 py-3">
            <span className="text-xs uppercase text-primary">{activity[index - 1]?.day !== day && day}</span>
            <div><p className="text-sm wrap-anywhere">{text}</p><p className="mt-1 text-xs text-muted">{detail}</p></div>
          </li>
        ))}
      </ul>
    </section>
  )
}
