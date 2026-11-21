import { useState } from 'react'
import { DashboardCharts } from '../features/dashboard/dashboard-charts'
import { DEMO_COMPLETION } from '../features/dashboard/dashboard-data'
import { useDashboard } from '../features/dashboard/use-dashboard'

const SECTIONS = ['Workspaces', 'Messages', 'Files', 'Analytics', 'Developer', 'Admin', 'Settings']
const RANGE_OPTIONS = [3, 30, 90] as const
const DAY = 86_400_000
const PANEL = 'rounded-xl border border-foreground/20 bg-surface/55 p-[clamp(0.5rem,1.5dvh,1rem)] md:[@media(max-height:680px)]:p-1.5'
const CONTROL = 'rounded-lg border border-foreground/20 px-3 py-1.5 text-sm md:[@media(max-height:680px)]:py-0.5'

function Dashboard() {
  const { data, connection } = useDashboard()
  const [range, setRange] = useState<number | 'custom'>(30)
  const [date, setDate] = useState('')
  const [search, setSearch] = useState('')
  const [demoError, setDemoError] = useState('')

  const today = new Date().toISOString().slice(0, 10)
  const customStart = date && date <= today ? date : today
  const start = range === 'custom'
    ? customStart
    : new Date(Date.parse(today) - (range - 1) * DAY).toISOString().slice(0, 10)
  const activity = data.activity.filter((item) => item.date.slice(0, 10) >= start)
  const query = search.trim().toLowerCase()
  const recent = activity.filter(({ text }) => text.toLowerCase().includes(query)).slice(0, 5)
  const tasks = data.tasks.filter(({ name }) => name.toLowerCase().includes(query))

  const days = Math.round((Date.parse(today) - Date.parse(start)) / DAY) + 1
  const bucketSize = Math.max(1, Math.ceil(days / 7))
  const points = Array.from({ length: Math.ceil(days / bucketSize) }, (_, index) => {
    const from = new Date(Date.parse(start) + index * bucketSize * DAY).toISOString().slice(0, 10)
    const to = new Date(Date.parse(from) + bucketSize * DAY).toISOString().slice(0, 10)
    const events = activity.filter(({ date }) => date.slice(0, 10) >= from && date.slice(0, 10) < to)
    return { label: from, activity: events.length, completed: events.filter(({ completion }) => completion).length }
  })

  const metrics = [
    { label: 'Active tasks', value: data.active, detail: 'Open tasks' },
    { label: 'Completed', value: data.completed, detail: 'Completed tasks' },
    { label: 'Online now', value: `${data.online} / ${data.members}`, detail: 'Workspace members' },
    { label: 'Overdue', value: data.overdue, detail: 'Needs attention' },
  ]

  async function recordDemoCompletion() {
    setDemoError('')
    try {
      const response = await fetch(DEMO_COMPLETION, { method: 'POST', headers: { 'X-Nexa-Demo': '1' } })
      if (!response.ok) throw new Error('Demo update failed')
    } catch {
      setDemoError('Could not send the demo update. Try again when the preview reconnects.')
    }
  }

  return (
    <div className="min-h-dvh bg-background font-sans md:grid md:grid-cols-[clamp(8rem,15vw,11rem)_minmax(0,1fr)]">
      <aside className="flex flex-col gap-4 border-b border-foreground/15 bg-surface/45 p-3 md:border-r md:border-b-0 print:hidden">
        <a href="/" className="px-2 text-2xl font-semibold">// NEXA</a>
        <nav aria-label="Workspace navigation" className="flex flex-wrap gap-1 text-sm md:grid">
          <a href="/dashboard" aria-current="page" className="rounded-md bg-primary/10 px-3 py-[clamp(0.25rem,1dvh,0.5rem)] text-primary">Dashboard</a>
          {SECTIONS.map((section) => (
            <span key={section} className="px-3 py-[clamp(0.25rem,1dvh,0.5rem)] text-muted" aria-disabled="true">{section}</span>
          ))}
        </nav>
        <div className="mt-auto hidden items-center gap-2 px-2 py-3 md:flex">
          <span className="grid size-8 place-items-center rounded-full bg-danger text-xs font-bold text-background">SM</span>
          <div className="text-sm leading-tight">Amine L.<p className="text-xs text-muted">Demo workspace</p></div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-foreground/15 px-4 py-[clamp(0.375rem,1.5dvh,0.75rem)] sm:px-6 md:[@media(max-height:680px)]:py-1 print:hidden">
          <input
            type="search"
            aria-label="Filter tasks and recent activity"
            placeholder="Search tasks and activity…"
            className="w-full max-w-xs rounded-lg border border-foreground/25 bg-background px-3 py-2 text-sm md:[@media(max-height:680px)]:py-1 placeholder:text-muted"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <a href="#recent-activity" className="shrink-0 text-sm text-muted hover:text-foreground">Recent activity</a>
        </header>

        <main className="flex w-full flex-1 flex-col justify-evenly gap-[clamp(0.375rem,1.5dvh,1rem)] px-4 py-[clamp(0.5rem,2dvh,1.25rem)] sm:px-6 md:[@media(max-height:680px)]:gap-1 md:[@media(max-height:680px)]:py-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold uppercase md:[@media(max-height:680px)]:text-xl">Dashboard</h1>
              <p className="flex items-center gap-2 text-sm text-muted md:[@media(max-height:680px)]:text-xs">
                Company health at a glance
                <span className={connection === 'Live demo' ? 'text-emerald-400' : 'text-muted'} role="status">● {connection}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 print:hidden">
              {import.meta.env.DEV && (
                <button type="button" onClick={recordDemoCompletion} disabled={connection !== 'Live demo' || data.active === 0} className={`${CONTROL} cursor-pointer bg-primary text-background disabled:cursor-not-allowed disabled:opacity-50`}>
                  Complete demo task
                </button>
              )}
              <button type="button" onClick={() => window.print()} className={`${CONTROL} cursor-pointer bg-surface`}>Export to PDF</button>
            </div>
          </div>

          {demoError && <p className="text-sm text-danger" role="alert">{demoError}</p>}

          <div className="flex flex-wrap justify-center gap-2" aria-label="Activity date range" role="group">
            {RANGE_OPTIONS.map((days) => (
              <button key={days} type="button" aria-pressed={range === days} onClick={() => setRange(days)} className={`${CONTROL} cursor-pointer bg-surface aria-pressed:bg-primary aria-pressed:text-background`}>
                {days} days
              </button>
            ))}
            <button type="button" aria-pressed={range === 'custom'} onClick={() => setRange('custom')} className={`${CONTROL} cursor-pointer bg-surface aria-pressed:bg-primary aria-pressed:text-background`}>Custom</button>
            {range === 'custom' && (
              <input type="date" aria-label="Activity start date" max={today} value={date} onChange={(event) => setDate(event.target.value)} className={`${CONTROL} scheme-dark`} />
            )}
          </div>

          <dl className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:gap-3">
            {metrics.map(({ label, value, detail }) => (
              <div key={label} className={PANEL}>
                <dt className="text-sm text-muted md:[@media(max-height:680px)]:text-xs">{label}</dt>
                <dd className="mt-1 text-[clamp(1.125rem,3dvh,1.5rem)] md:[@media(max-height:680px)]:mt-0 leading-tight">{value}</dd>
                <dd className={label === 'Overdue' ? 'text-xs text-danger' : 'text-xs text-muted'}>{detail}</dd>
              </div>
            ))}
          </dl>

          <DashboardCharts points={points} active={data.active} completed={data.completed} />

          <div className="grid gap-2 md:grid-cols-2 lg:gap-4">
            <section id="recent-activity" className={PANEL}>
              <h2 className="mb-2 font-medium md:[@media(max-height:680px)]:mb-0">Recent activity</h2>
              {recent.length === 0 && <p className="text-sm text-muted">No matching activity.</p>}
              <ul className="grid list-disc gap-1 pl-5 text-xs lg:text-sm marker:text-primary md:[@media(max-height:680px)]:gap-0">
                {recent.map(({ id, text }) => <li key={id}>{text}</li>)}
              </ul>
            </section>

            <section className={PANEL}>
              <h2 className="mb-2 font-medium md:[@media(max-height:680px)]:mb-0">My tasks</h2>
              {tasks.length === 0 && <p className="text-sm text-muted">No matching tasks.</p>}
              <ul className="grid gap-1 text-xs lg:text-sm md:[@media(max-height:680px)]:gap-0" role="list">
                {tasks.map(({ name, status, due }) => (
                  <li key={name} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 sm:gap-4">
                    <span>{name}</span>
                    <span className="rounded-full border border-foreground/15 bg-surface px-2 py-0.5 text-xs text-muted">{status}</span>
                    <span className="text-xs text-muted">Due {due}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <footer className="text-center text-xs text-muted">© 2026 Nexa</footer>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
