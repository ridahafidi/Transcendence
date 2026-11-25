import { useState } from 'react'
import AppShell from '../components/AppShell'

const DAY = 86_400_000
const PERIODS = [7, 30, 90] as const
const PANEL = 'min-w-0 rounded-lg border border-foreground/10 bg-surface p-4'
const CONTROL = 'rounded-md border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-sm scheme-dark'
const USERS = [
  { name: 'Sara', initials: 'SA', color: 'bg-primary', weight: 4 },
  { name: 'Youssef', initials: 'YO', color: 'bg-info', weight: 3 },
  { name: 'Khalid', initials: 'KH', color: 'bg-emerald-400', weight: 2 },
  { name: 'Hajar', initials: 'HA', color: 'bg-danger', weight: 2 },
]
const dateKey = (date: number) => new Date(date).toISOString().slice(0, 10)

function createSampleActivity() {
  const today = Date.now()
  return Array.from({ length: 90 }, (_, index) => ({
    date: dateKey(today - (89 - index) * DAY),
    logins: 12 + (index * 17 % 24),
    messages: 75 + (index * 23 % 160),
    tasks: 22 + (index * 11 % 49),
    files: 8 + (index * 7 % 22),
    activeUsers: Array.from({ length: 12 + (index * 7 % 8) }, (_, user) => (user + index) % 22),
  }))
}

function ActivityCharts({ days }: { days: ReturnType<typeof createSampleActivity> }) {
  const signInMax = Math.max(1, ...days.map(({ logins }) => logins))
  const messageMax = Math.max(1, ...days.map(({ messages }) => messages))
  const points = days.map(({ messages }, index) => ({
    x: days.length === 1 ? 50 : (index / Math.max(1, days.length - 1)) * 100,
    y: 95 - messages / messageMax * 85,
  }))

  return (
    <>
      <section className={PANEL}>
        <h2 className="mb-3 font-medium">Logins per day</h2>
        <div className="flex h-40 items-end gap-0.5 border-b sm:gap-1 border-foreground/15">
          {days.map(({ date, logins }) => (
            <div key={date} className="min-w-0 flex-1 rounded-t bg-primary" title={`${date}: ${logins} logins`} style={{ height: `${logins / signInMax * 100}%` }} />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted"><span>{days[0]?.date}</span><span>{days.at(-1)?.date}</span></div>
      </section>

      <section className={PANEL}>
        <h2 className="mb-3 font-medium">Messages per day</h2>
        <svg className="h-32 w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`Daily message counts, highest day ${messageMax}`}>
          {[20, 45, 70, 95].map((y) => <line key={y} x1="0" y1={y} x2="100" y2={y} className="stroke-foreground/15" vectorEffect="non-scaling-stroke" />)}
          {points.length === 1
            ? <circle cx={points[0].x} cy={points[0].y} r="2" className="fill-info" />
            : <polyline points={points.map(({ x, y }) => `${x},${y}`).join(' ')} className="fill-none stroke-info" strokeWidth="2" vectorEffect="non-scaling-stroke" />}
        </svg>
        <div className="mt-2 flex justify-between text-xs text-muted"><span>{days[0]?.date}</span><span>{days.at(-1)?.date}</span></div>
      </section>
    </>
  )
}

export default function AnalyticsPage() {
  const [data] = useState(createSampleActivity)
  const [period, setPeriod] = useState<number | 'custom'>(7)
  const today = data.at(-1)!.date
  const earliest = data[0].date
  const [from, setFrom] = useState(data.at(-7)!.date)
  const [to, setTo] = useState(today)

  const days = period === 'custom'
    ? data.filter(({ date }) => from && to && date >= from && date <= to)
    : data.slice(-period)
  const activeCount = new Set(days.flatMap(({ activeUsers }) => activeUsers)).size
  const messages = days.reduce((total, day) => total + day.messages, 0)
  const tasks = days.reduce((total, day) => total + day.tasks, 0)
  const files = days.reduce((total, day) => total + day.files, 0)
  const metrics = [
    { label: 'Active users', value: activeCount },
    { label: 'Messages sent', value: messages },
    { label: 'Tasks completed', value: tasks },
  ]
  const activity = [
    { label: 'Tasks', value: tasks, color: 'bg-primary' },
    { label: 'Messages', value: messages, color: 'bg-info' },
    { label: 'Files', value: files, color: 'bg-emerald-400' },
  ]
  const maximum = Math.max(1, tasks, messages, files)
  const logins = days.reduce((total, day) => total + day.logins, 0)
  const totalWeight = USERS.reduce((total, user) => total + user.weight, 0)

  return (
    <AppShell activePage="/analytics" search={
      <form action="/friends" className="w-full max-w-sm">
        <input name="q" type="search" required aria-label="Find a user" placeholder="Search people…" className={`w-full ${CONTROL} placeholder:text-muted`} />
      </form>
    }>
      <main className="flex-1 space-y-4 px-4 py-5 sm:px-7">
        <header>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted">User activity insights · Sample data</p>
        </header>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Analytics date range">
          {PERIODS.map((days) => (
            <button type="button" key={days} aria-pressed={period === days} onClick={() => setPeriod(days)} className={`${CONTROL} cursor-pointer aria-pressed:bg-primary aria-pressed:text-background`}>{days} days</button>
          ))}
          <button type="button" aria-pressed={period === 'custom'} onClick={() => setPeriod('custom')} className={`${CONTROL} cursor-pointer aria-pressed:bg-primary aria-pressed:text-background`}>Custom</button>
        </div>
        {period === 'custom' && (
          <div className="flex flex-wrap gap-3">
            <label className="grid gap-1 text-sm text-muted">From <input type="date" min={earliest} max={to} value={from} onChange={(event) => setFrom(event.target.value)} className={CONTROL} /></label>
            <label className="grid gap-1 text-sm text-muted">To <input type="date" min={from} max={today} value={to} onChange={(event) => setTo(event.target.value)} className={CONTROL} /></label>
          </div>
        )}

        <dl className="grid gap-3 sm:grid-cols-3">
          {metrics.map(({ label, value }) => (
            <div key={label} className={PANEL}>
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="mt-1 text-2xl font-medium">{value.toLocaleString()}</dd>
            </div>
          ))}
        </dl>

        {days.length ? (
          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="grid gap-4"><ActivityCharts days={days} /></div>
            <div className="grid gap-4">
              <section className={PANEL}>
                <h2 className="mb-3 font-medium">Most active users</h2>
                <ul className="grid gap-2" role="list">
                  {USERS.map(({ name, initials, color, weight }) => (
                    <li key={name} className="flex items-center gap-3 text-sm">
                      <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs text-background ${color}`} aria-hidden="true">{initials}</span>
                      <span>{name}</span>
                      <span className="ml-auto text-primary">{Math.round(logins * weight / totalWeight)}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className={PANEL}>
                <h2 className="mb-3 font-medium">Activity by type</h2>
                <ul className="grid gap-3 text-sm" role="list">
                  {activity.map(({ label, value, color }) => (
                    <li key={label} className="grid grid-cols-[5rem_minmax(0,1fr)_auto] items-center gap-2">
                      <span>{label}</span>
                      <span className="h-2 rounded-full bg-foreground/5" aria-hidden="true">
                        <span className={`block h-full rounded-full ${color}`} style={{ width: `${value / maximum * 100}%` }} />
                      </span>
                      <span className="text-xs text-muted">{value.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        ) : <p className={PANEL} role="status">No activity in that date range.</p>}
      </main>
    </AppShell>
  )
}
