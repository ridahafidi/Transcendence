import PublicLayout from '../components/PublicLayout'
import { Outlet } from 'react-router'

const FEATURES = [
  { title: 'Workspaces and tasks', description: 'Kanban boards for every team' },
  { title: 'Real-time chat', description: 'Direct messages and channels' },
  { title: 'Files', description: 'Secure uploads with preview' },
  { title: 'Analytics and API', description: 'Insights and a public REST API' },
]

const PREVIEW_BARS = ['h-[44%]', 'h-[73%]', 'h-[56%]', 'h-full', 'h-[69%]', 'h-[37%]', 'h-[86%]']
const PREVIEW_STATS = [
  { label: 'Active', value: 128 },
  { label: 'Done', value: 342 },
]

const ACTION = 'inline-flex min-h-10 items-center justify-center rounded-md border px-3.5 py-1.5 font-bold hover:brightness-110'
const PRIMARY_ACTION = `${ACTION} border-transparent bg-primary text-background`

function DashboardPreview() {
  return (
    <figure className="rounded-lg border border-foreground/15 bg-surface p-3 sm:p-5 lg:p-8 [@media(max-width:767px)_and_(max-height:760px)]:hidden [@media(max-height:600px)]:p-3 [@media(max-height:440px)]:hidden">
      <figcaption className="mb-3 text-sm text-muted">Dashboard preview</figcaption>
      <div className="grid grid-cols-[2fr_1fr] items-end gap-3 sm:gap-6">
        <div className="grid h-[clamp(5rem,20dvh,10rem)] grid-cols-7 grid-rows-1 items-end gap-1 sm:gap-2" aria-hidden="true">
          {PREVIEW_BARS.map((height) => (
            <span key={height} className={`rounded-t-sm bg-primary ${height}`} />
          ))}
        </div>
        <dl className="grid gap-2.5">
          {PREVIEW_STATS.map(({ label, value }) => (
            <div key={label} className="rounded-md bg-foreground/5 px-3 py-[clamp(0.25rem,1.4dvh,0.625rem)]">
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="text-lg leading-tight">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </figure>
  )
}

export function LandingPage() {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  )
}

export function MainContent() {
  return (
    <main className="mx-auto flex w-full max-w-296 flex-1 flex-col justify-evenly gap-[clamp(0.75rem,4dvh,3rem)] px-4 py-[clamp(0.75rem,4dvh,3rem)] sm:px-8 lg:px-16 [@media(max-height:440px)]:gap-2 [@media(max-height:440px)]:py-2">
      <section className="grid items-center gap-[clamp(0.75rem,4dvh,4rem)] md:grid-cols-[1fr_1.05fr] [@media(max-height:440px)]:grid-cols-1" aria-labelledby="landing-title">
        <div>
          <h1 className="text-[clamp(1.75rem,min(4vw,7dvh),3rem)] leading-[1.1] font-bold" id="landing-title">
            Simplified Systems,
            <span className="block text-primary">Superior Results.</span>
          </h1>
          <p className="mt-[clamp(0.5rem,2dvh,1rem)] mb-[clamp(0.75rem,3dvh,1.5rem)] max-w-104 text-muted">
            Tasks, chat, files and analytics for small businesses, in one
            real-time workspace your whole team can use at the same time.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <a className={`${PRIMARY_ACTION} min-w-31`} href="/register">Get started</a>
            <a className={`${ACTION} min-w-31 border-foreground/15 bg-surface`} href="/login">Continue with 42</a>
          </div>
        </div>

        <DashboardPreview />
      </section>

      <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 lg:gap-8 sm:[@media(max-height:440px)]:grid-cols-4" id="features" aria-label="Nexa features" role="list">
        {FEATURES.map(({ title, description }) => (
          <li key={title} className="rounded-lg border border-foreground/15 bg-surface px-3 py-[clamp(0.5rem,2.5dvh,1.25rem)] sm:px-5">
            <span className="mb-2 hidden size-4.5 [@media(min-height:760px)]:block rounded-full border border-primary/40 bg-primary/10" aria-hidden="true" />
            <h2 className="text-[0.95rem] font-bold">{title}</h2>
            <p className="text-sm text-muted">{description}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
