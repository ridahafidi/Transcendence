import { useState } from 'react'
import { initialMembers, initialWorkspaceTabs, MEMBER_NAMES } from './workspace-preview-data'
import { WorkspaceActivity, WorkspaceChat, WorkspaceFiles, WorkspaceMembers } from './WorkspaceTabs'

const VIEWS = ['Tasks', 'Chat', 'Files', 'Members', 'Activity'] as const

const STATUS_COLUMNS = ['To do', 'In progress', 'Done'] as const

type Task = {
  title: string
  status: typeof STATUS_COLUMNS[number]
  priority: 'High' | 'Medium' | 'Low'
  assignee: string
}

type Workspace = {
  id: number
  name: string
  description: string
  members: string[]
}

const PRIORITY_COLORS = {
  High: 'text-danger',
  Medium: 'text-primary',
  Low: 'text-emerald-400',
}

const SAMPLE_TASKS: Record<number, Task[]> = {
  6: [
    { title: 'Order supplies', status: 'To do', priority: 'High', assignee: 'SM' },
    { title: 'Clean freezer', status: 'To do', priority: 'Low', assignee: 'YK' },
    { title: 'Update menu prices', status: 'To do', priority: 'Medium', assignee: 'AL' },
    { title: 'Prep weekly menu', status: 'In progress', priority: 'High', assignee: 'SM' },
    { title: 'Inventory check', status: 'In progress', priority: 'Medium', assignee: 'YK' },
    { title: 'Train new cook', status: 'Done', priority: 'Medium', assignee: 'AL' },
    { title: 'Fix oven timer', status: 'Done', priority: 'Low', assignee: 'SM' },
  ],
  5: [
    { title: 'Update the floor plan', status: 'To do', priority: 'Medium', assignee: 'AL' },
    { title: 'Prepare the shift schedule', status: 'In progress', priority: 'High', assignee: 'SM' },
    { title: 'Review customer feedback', status: 'Done', priority: 'Low', assignee: 'YK' },
  ],
  4: [
    { title: 'Plan next month’s campaign', status: 'To do', priority: 'High', assignee: 'SM' },
    { title: 'Draft the social posts', status: 'In progress', priority: 'Medium', assignee: 'YK' },
  ],
  3: [
    { title: 'Review supplier invoices', status: 'To do', priority: 'High', assignee: 'AL' },
    { title: 'Prepare the monthly report', status: 'In progress', priority: 'Medium', assignee: 'SM' },
  ],
  2: [
    { title: 'Inspect kitchen equipment', status: 'To do', priority: 'Medium', assignee: 'YK' },
    { title: 'Replace the broken shelf', status: 'Done', priority: 'Low', assignee: 'AL' },
  ],
  1: [
    { title: 'Update the onboarding checklist', status: 'In progress', priority: 'Medium', assignee: 'SM' },
    { title: 'Schedule interviews', status: 'To do', priority: 'High', assignee: 'AL' },
  ],
}

export default function WorkspaceDetail({ workspace, search }: { workspace: Workspace; search: string }) {
  const [view, setView] = useState<typeof VIEWS[number]>('Tasks')
  const [members, setMembers] = useState(() => initialMembers(workspace.members))
  const [currentMember] = useState(() => members.find(({ role }) => role === 'Owner')?.name)
  const [tabs, setTabs] = useState(() => initialWorkspaceTabs(workspace.id === 6))

  function addActivity(text: string, detail: string) {
    setTabs((current) => ({ ...current, activity: [{ day: 'Today', text, detail }, ...current.activity] }))
  }
  const tasks = SAMPLE_TASKS[workspace.id] ?? []
  const query = search.trim().toLowerCase()
  const visibleTasks = tasks.filter(({ title, assignee }) =>
    `${title} ${MEMBER_NAMES[assignee]}`.toLowerCase().includes(query),
  )

  return (
    <main className="flex-1 space-y-5 px-4 py-5 sm:px-7">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <a href="/workspaces" className="text-sm text-muted hover:text-primary">← All workspaces</a>
          <h1 className="mt-2 text-2xl leading-tight font-semibold break-words uppercase">{workspace.name}</h1>
          <p className="mt-1 text-sm text-muted">{members.length} {members.length === 1 ? 'member' : 'members'} · Sample data</p>
          {workspace.description && <p className="mt-1 text-sm break-words text-muted">{workspace.description}</p>}
        </div>
        {view === 'Chat' && <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm text-background" onClick={() => setView('Members')}>View members</button>}
        {view === 'Activity' && <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm text-background" onClick={() => setView('Tasks')}>View tasks</button>}
      </header>

      <div className="flex flex-wrap gap-x-5 border-b border-foreground/15" role="group" aria-label="Workspace views">
        {VIEWS.map((label) => (
          <button key={label} type="button" aria-pressed={view === label} onClick={() => setView(label)} className="cursor-pointer border-b-2 border-transparent pb-2 text-sm text-muted hover:text-foreground aria-pressed:border-primary aria-pressed:text-primary">
            {label}
          </button>
        ))}
      </div>

      {view === 'Tasks' && (
        <div className="grid items-start gap-4 lg:grid-cols-3">
          {STATUS_COLUMNS.map((status) => {
            const columnTasks = visibleTasks.filter((task) => task.status === status)
            return (
              <section key={status} className="min-w-0 rounded-lg border border-foreground/10 bg-surface p-3">
                <h2 className="mb-3 flex items-center justify-between font-medium">
                  {status}
                  <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-muted">{columnTasks.length}</span>
                </h2>
                <ul className="grid gap-2" role="list">
                  {columnTasks.map(({ title, priority, assignee }) => (
                    <li key={title} className="rounded-md border border-foreground/10 bg-foreground/5 p-3">
                      <p className="text-sm">{title}</p>
                      <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs">
                        <span className={PRIORITY_COLORS[priority]}>{priority}</span>
                        <span className="text-muted">{MEMBER_NAMES[assignee]}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                {columnTasks.length === 0 && <p className="text-sm text-muted">No tasks to show.</p>}
              </section>
            )
          })}
        </div>
      )}

      {view === 'Chat' && (
        <WorkspaceChat name={workspace.name} description={workspace.description} memberCount={members.length} messages={tabs.messages} onFiles={() => setView('Files')} onSend={(message) => {
          setTabs((current) => ({ ...current, messages: [...current.messages, message] }))
          addActivity('You sent a message', 'Chat')
        }} />
      )}
      {view === 'Files' && (
        <WorkspaceFiles name={workspace.name} files={tabs.files} onUpload={(file) => {
          setTabs((current) => ({ ...current, files: [...current.files, file] }))
          addActivity(`You added ${file.name}`, 'File added in preview')
        }} />
      )}
      {view === 'Members' && (
        <WorkspaceMembers members={members} currentMember={currentMember} tasks={tasks} onChange={(nextMembers, activity) => {
          setMembers(nextMembers)
          addActivity(activity, 'Membership changed')
        }} />
      )}
      {view === 'Activity' && <WorkspaceActivity name={workspace.name} activity={tabs.activity} />}
    </main>
  )
}
