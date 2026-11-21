const PANEL = 'min-w-0 rounded-xl border border-foreground/20 bg-surface/55 p-[clamp(0.5rem,1.5dvh,1rem)] md:[@media(max-height:680px)]:p-1.5'
const GRID = 'flex h-[clamp(3.5rem,15dvh,10rem)] md:[@media(max-height:680px)]:h-[clamp(2rem,10dvh,4rem)] items-end gap-1.5 border-b border-foreground/15'

type Point = { label: string; activity: number; completed: number }

export function DashboardCharts({ points, active, completed }: {
  points: Point[]
  active: number
  completed: number
}) {
  const maxActivity = Math.max(1, ...points.map((point) => point.activity))
  const maxCompleted = Math.max(1, ...points.map((point) => point.completed))
  const line = points.map((point, index) => [
    points.length === 1 ? 50 : index * 100 / (points.length - 1),
    95 - point.completed / maxCompleted * 85,
  ])
  const inProgress = Math.round(active / 3)
  const toDo = active - inProgress
  const total = Math.max(1, toDo + inProgress + completed)
  const toDoEnd = toDo / total * 100
  const inProgressEnd = (toDo + inProgress) / total * 100
  const status = [
    { label: 'To do', count: toDo, color: 'bg-primary' },
    { label: 'In progress', count: inProgress, color: 'bg-info' },
    { label: 'Done', count: completed, color: 'bg-emerald-400' },
  ]

  return (
    <div className="grid gap-2 md:grid-cols-[1fr_1fr_0.72fr] lg:gap-4">
      <section className={PANEL}>
        <h2 className="mb-[clamp(0.25rem,1dvh,0.75rem)] font-medium">Team activity</h2>
        <div className={GRID}>
          {points.map(({ label, activity }) => (
            <div key={label} title={`${label}: ${activity} events`} className="flex h-full min-w-0 flex-1 items-end">
              <div className="w-full rounded-t bg-primary" style={{ height: `${activity / maxActivity * 100}%` }} />
            </div>
          ))}
        </div>
        <p className="mt-2 md:[@media(max-height:680px)]:mt-0.5 text-xs text-muted">{points.reduce((sum, point) => sum + point.activity, 0)} events in this range</p>
      </section>

      <section className={PANEL}>
        <h2 className="mb-[clamp(0.25rem,1dvh,0.75rem)] font-medium">Tasks completed</h2>
        <svg className="h-[clamp(3.5rem,15dvh,10rem)] md:[@media(max-height:680px)]:h-[clamp(2rem,10dvh,4rem)] w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {[20, 45, 70, 95].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} className="stroke-foreground/25" vectorEffect="non-scaling-stroke" />
          ))}
          <polyline points={line.map((point) => point.join(',')).join(' ')} className="fill-none stroke-info" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <p className="mt-2 md:[@media(max-height:680px)]:mt-0.5 text-xs text-muted">{points.reduce((sum, point) => sum + point.completed, 0)} tasks in this range</p>
      </section>

      <section className={PANEL}>
        <h2 className="mb-[clamp(0.25rem,1dvh,0.75rem)] font-medium">Tasks by status</h2>
        <div
          className="mx-auto grid size-[clamp(3.5rem,12dvh,8rem)] md:[@media(max-height:680px)]:size-[clamp(2rem,9dvh,3.5rem)] place-items-center rounded-full"
          style={{ background: `conic-gradient(var(--color-primary) ${toDoEnd}%, var(--color-info) 0 ${inProgressEnd}%, var(--color-emerald-400) 0)` }}
          aria-hidden="true"
        >
          <div className="size-[60%] rounded-full bg-surface" />
        </div>
        <ul className="mt-2 md:[@media(max-height:680px)]:mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-muted" role="list">
          {status.map(({ label, count, color }) => (
            <li key={label} className="flex items-center gap-2">
              <span className={`size-2 rounded-full ${color}`} aria-hidden="true" />
              {label} · {count}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
