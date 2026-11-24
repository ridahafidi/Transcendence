import { useRef, useState } from 'react'
import { initialMembers, initialWorkspaceTabs, MEMBER_NAMES } from './workspace-preview-data'
import { WorkspaceActivity } from './WorkspaceActivity'
import { WorkspaceChat } from './WorkspaceChat'
import { WorkspaceFiles } from './WorkspaceFiles'
import { WorkspaceMembers } from './WorkspaceMembers'

const VIEWS = ['Tasks', 'Chat', 'Files', 'Members', 'Activity'] as const

const STATUS_COLUMNS = ['To do', 'In progress', 'Done'] as const

type Task = {
  title: string
  description: string
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
    { title: 'Order supplies', description: 'Check the stock list and order the supplies needed for this week’s kitchen prep.', status: 'To do', priority: 'High', assignee: 'SM' },
    { title: 'Clean freezer', description: 'Empty and sanitize the freezer, then put labeled items back in their assigned sections.', status: 'To do', priority: 'Low', assignee: 'YK' },
    { title: 'Update menu prices', description: 'Review ingredient costs and update the prices on the menu.', status: 'To do', priority: 'Medium', assignee: 'AL' },
    { title: 'Prep weekly menu', description: 'Draft the weekly menu and confirm ingredients and preparation times with the kitchen team.', status: 'In progress', priority: 'High', assignee: 'SM' },
    { title: 'Inventory check', description: 'Count the ingredients in storage and note any items that need to be reordered.', status: 'In progress', priority: 'Medium', assignee: 'YK' },
    { title: 'Train new cook', description: 'Walk the new cook through the prep stations, opening checklist, and safety procedures.', status: 'Done', priority: 'Medium', assignee: 'AL' },
    { title: 'Fix oven timer', description: 'Check the oven timer and test it after the repair.', status: 'Done', priority: 'Low', assignee: 'SM' },
  ],
  5: [
    { title: 'Update the floor plan', description: 'Review seating capacity and update the floor plan for the next service.', status: 'To do', priority: 'Medium', assignee: 'AL' },
    { title: 'Prepare the shift schedule', description: 'Confirm availability and publish the next shift schedule.', status: 'In progress', priority: 'High', assignee: 'SM' },
    { title: 'Review customer feedback', description: 'Read recent feedback and summarize the issues the team should address.', status: 'Done', priority: 'Low', assignee: 'YK' },
  ],
  4: [
    { title: 'Plan next month’s campaign', description: 'Set campaign goals and outline topics for next month.', status: 'To do', priority: 'High', assignee: 'SM' },
    { title: 'Draft the social posts', description: 'Write and prepare the posts for the upcoming campaign.', status: 'In progress', priority: 'Medium', assignee: 'YK' },
  ],
  3: [
    { title: 'Review supplier invoices', description: 'Match supplier invoices against orders and flag any differences.', status: 'To do', priority: 'High', assignee: 'AL' },
    { title: 'Prepare the monthly report', description: 'Summarize monthly spending, revenue, and outstanding payments.', status: 'In progress', priority: 'Medium', assignee: 'SM' },
  ],
  2: [
    { title: 'Inspect kitchen equipment', description: 'Inspect the kitchen equipment and record any maintenance needs.', status: 'To do', priority: 'Medium', assignee: 'YK' },
    { title: 'Replace the broken shelf', description: 'Replace the damaged shelf and check that it is secure.', status: 'Done', priority: 'Low', assignee: 'AL' },
  ],
  1: [
    { title: 'Update the onboarding checklist', description: 'Review the onboarding steps and update the resources for new hires.', status: 'In progress', priority: 'Medium', assignee: 'SM' },
    { title: 'Schedule interviews', description: 'Confirm availability with the hiring team and arrange interview times.', status: 'To do', priority: 'High', assignee: 'AL' },
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
  const [tasks, setTasks] = useState(() => SAMPLE_TASKS[workspace.id] ?? [])
  const [selectedTitle, setSelectedTitle] = useState<string>()
  const taskDialog = useRef<HTMLDialogElement>(null)
  const selectedTask = tasks.find(({ title }) => title === selectedTitle)
  const previousStatus = selectedTask?.status === 'Done' ? 'In progress' : 'To do'
  const nextStatus = selectedTask?.status === 'To do' ? 'In progress' : 'Done'

  function openTask(title: string) {
    setSelectedTitle(title)
    taskDialog.current?.showModal()
  }

  function moveTask(status: Task['status']) {
    if (!selectedTask || selectedTask.status === status) return
    setTasks((current) => current.map((task) =>
      task.title === selectedTask.title ? { ...task, status } : task,
    ))
    addActivity(`You moved ${selectedTask.title} to ${status}`, 'Task status changed')
  }

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
                    <li key={title}>
                      <button type="button" onClick={() => openTask(title)} className="w-full cursor-pointer rounded-md border border-foreground/10 bg-foreground/5 p-3 text-left hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-primary">
                        <span className="block text-sm">{title}</span>
                        <span className="mt-2 flex flex-wrap justify-between gap-2 text-xs">
                          <span className={PRIORITY_COLORS[priority]}>{priority}</span>
                          <span className="text-muted">{MEMBER_NAMES[assignee]}</span>
                        </span>
                      </button>
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
      <dialog ref={taskDialog} aria-labelledby="task-title" className="m-auto w-11/12 max-w-2xl rounded-xl border border-foreground/15 bg-surface p-5 text-foreground backdrop:bg-black/60 sm:p-6">
        {selectedTask && (
          <>
            <header className="mb-4 flex items-start justify-between gap-4">
              <h2 id="task-title" className="text-xl font-semibold">{selectedTask.title}</h2>
              <form method="dialog">
                <button className="cursor-pointer rounded-md px-2 py-1 text-sm text-muted hover:bg-foreground/10">Close</button>
              </form>
            </header>
            <p className="text-sm">{selectedTask.description}</p>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex gap-2"><dt className="text-muted">Assignee</dt><dd>{MEMBER_NAMES[selectedTask.assignee]}</dd></div>
              <div className="flex gap-2"><dt className="text-muted">Priority</dt><dd className={PRIORITY_COLORS[selectedTask.priority]}>{selectedTask.priority}</dd></div>
              <div className="flex gap-2"><dt className="text-muted">Status</dt><dd role="status">{selectedTask.status}</dd></div>
            </dl>

            <div className="mt-6 flex justify-between gap-3 border-t border-foreground/10 pt-4">
              <button type="button" onClick={() => moveTask(previousStatus)} disabled={selectedTask.status === previousStatus} className="cursor-pointer rounded-md border border-foreground/15 px-4 py-2 text-sm hover:bg-foreground/10 disabled:cursor-not-allowed disabled:opacity-50">
                Back to {previousStatus}
              </button>
              <button type="button" onClick={() => moveTask(nextStatus)} disabled={selectedTask.status === nextStatus} className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-background hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
                {selectedTask.status === nextStatus ? 'Done' : `Move to ${nextStatus}`}
              </button>
            </div>
          </>
        )}
      </dialog>

      {view === 'Activity' && <WorkspaceActivity name={workspace.name} activity={tabs.activity} />}
    </main>
  )
}
