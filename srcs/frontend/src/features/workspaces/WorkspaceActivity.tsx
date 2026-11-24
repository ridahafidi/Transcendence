import type { Activity } from './workspace-preview-data'
import { PANEL } from './workspace-styles'

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
