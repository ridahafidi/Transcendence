import type { ReactNode } from 'react'

const ACTION = 'inline-flex min-h-10 items-center justify-center rounded-md border px-3.5 py-1.5 font-bold hover:brightness-110'
const PRIMARY_ACTION = `${ACTION} border-transparent bg-primary text-background`

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col scheme-dark [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-primary">
      <header className="flex flex-col gap-2 border-b border-foreground/15 bg-surface/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <a className="text-2xl font-bold whitespace-nowrap" href="/">&#47;&#47; NEXA</a>
        <nav className="flex flex-wrap items-center gap-3 text-sm" aria-label="Main navigation">
          <a className="inline-flex min-h-8 items-center hover:underline" href="/features">Features</a>
          <a className="inline-flex min-h-8 items-center hover:underline" href="/developer">Developer</a>
          <a className={`${ACTION} border-foreground/50 sm:min-w-31`} href="/login">Log in</a>
          <a className={`${PRIMARY_ACTION} sm:min-w-31`} href="/register">Get started</a>
        </nav>
      </header>

      {children}

      <footer className="flex items-center justify-between gap-4 border-t border-foreground/15 bg-surface/50 px-4 py-3 text-xs sm:px-8 lg:px-12">
        <small>© 2026 Nexa</small>
        <nav className="flex flex-wrap items-center gap-x-3" aria-label="Legal">
          <a className="inline-flex min-h-8 items-center hover:underline" href="/privacy">Privacy Policy</a>
          <a className="inline-flex min-h-8 items-center hover:underline" href="/terms">Terms of Service</a>
        </nav>
      </footer>
    </div>
  )
}
