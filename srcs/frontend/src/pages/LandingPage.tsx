import { Menu, X, UsersRound, MessageCircleText, Files, ChartNoAxesCombined, type LucideIcon } from 'lucide-react'
import { Link, Outlet } from 'react-router'
import { Button } from '@/components'
import { useState } from 'react'

function NavigationBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Link className="text-2xl font-bold whitespace-nowrap" to="/">&#47;&#47; NEXA</Link>
      <Button className='md:hidden' onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </Button>

      <nav className={`${open ? 'flex' : 'hidden'} flex absolute top-full right-0 flex-col w-full gap-4 p-6 bg-surface \
        md:bg-transparent md:static md:max-w-md md:flex md:flex-row md:gap-4 md:items-center md:p-0`}
        onClick={() => setOpen(false)}>
        <Link className="md:text-center md:p-2" to="/features">Features</Link>
        <Link className="md:text-center md:p-2" to="/developer">Developer</Link>
        <Link className="flex-1 md:text-center md:rounded-md md:p-2 md:border md:border-foreground/50" to="/signin">Log in</Link>
        <Link className="flex-1 text-primary md:text-center md:rounded-md md:p-2 md:bg-primary md:text-surface" to="/signup">Get Started</Link>
      </nav>
    </>
  );
}

const PREVIEWBARS: number[] = [44, 73, 56, 100, 69, 37, 86]

function DashboardPreview({ className }: { className: string }) {
  return (
    <figure className={`${className} text-page bg-surface rounded-xl border border-foreground/20 p-10`}>
      <figcaption className="text-sm font-semibold uppercase tracking-wider text-page mb-5">
        Dashbooard preview
      </figcaption>

      <div className="h-full flex items-center justify-between gap-10">
        <div className="flex-1 grid grid-cols-7 gap-1 h-30 items-end">
          {PREVIEWBARS.map((height, index) => (
            <span
              key={index}
              style={{ height: `${height}%` }}
              className="w-full bg-primary transition-all hover:bg-primary/80 rounded-md"
            />
          ))}
        </div>

        <dl className="w-35 flex flex-col gap-2">
          <div className="bg-foreground/5 border border-foreground/6 rounded-sm pl-3 pr-20 py-3">
            <dt className="text-sm font-light">Active</dt>
            <dd className="text-md font-bold text-foreground">128</dd>
          </div>
          <div className="bg-foreground/5 border border-foreground/6 rounded-sm pl-3 pr-20 py-3">
            <dt className="text-sm font-light">Done</dt>
            <dd className="text-md font-bold text-foreground">342</dd>
          </div>
        </dl>
      </div>
    </figure>
  )
}

const FEATURES: { title: string, description: string, icon: LucideIcon }[] = [
  { title: 'Workspaces and tasks', description: 'Kanban boards for every team', icon: UsersRound },
  { title: 'Real-time chat', description: 'Direct messages and channels', icon: MessageCircleText },
  { title: 'Files', description: 'Secure uploads with preview', icon: Files },
  { title: 'Analytics and API', description: 'Insights and a public REST API', icon: ChartNoAxesCombined },
]

export function MainContent() {
  return (

    <main className="flex-1 flex flex-col p-6 gap-3">
      <div className="flex-1 flex flex-col gap-3 items-center md:flex-row">
        <section className="self-start md:self-center flex flex-col gap-3 md:flex-1">
          <h1 className="text-4xl font-bold tracking-tight">
            Simplified Systems,<br />
            <span className="text-primary">Superior Results.</span>
          </h1>
          <p className="text-page">
            Tasks, chat, files and analytics for small businesses, in one <br />
            real-time workspace your whole team can use at the same time.
          </p>
          <div className="flex gap-2 w-full max-w-md">
            <Link className="flex-1 font-medium bg-surface text-center p-2 rounded-md" href="/api/v1/auth/42">Continue with 42</Link>
            <Link className="flex-1 font-medium bg-primary text-surface text-center p-2 rounded-md" to="/signup">Get Started</Link>
          </div>
        </section>

        <DashboardPreview className="w-full max-w-lg flex-1" />
      </div>


      <section className="flex-1 flex flex-col">
        <ul className="flex-1 flex gap-3 px-2 scroll-px-2 overflow-x-auto snap-x overscroll-auto
         md:tall:flex-wrap md:tall:overflow-visible md:tall:px-0">
          {FEATURES.map(({ title, description, icon: Icon }) => (
            <li className="snap-start shrink-0 border-2 border-foreground/30 rounded-xl flex flex-col items-center justify-center px-3 bg-surface
            tall:basis-[45%] tall:grow md:tall:basis-auto" key={title}>
              <Icon size={35} />
              <h2 className="mt-5 text-md font-medium">{title}</h2>
              <p className="text-page text-sm font-thin">{description}</p>
            </li>
          ))}
        </ul>
      </section>
    </main >
  )
}


export function LandingPage() {
  return (
    <div className="h-screen flex flex-col">
      <header className="relative h-fit flex items-center justify-between border-b-2 border-foreground/20 bg-surface/50 px-6 py-3">
        <NavigationBar />
      </header>

      <Outlet />

      <footer className="flex flex-row items-center justify-between h-fit bg-surface/50 px-6 py-3">
        <small>© 2026 Nexa</small>
        <nav className="flex gap-2" aria-label="Legal">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </nav>
      </footer>
    </div >
  )
}
