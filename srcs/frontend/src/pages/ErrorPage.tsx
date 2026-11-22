const ERROR_DETAILS = {
  403: {
    title: 'Access denied',
    description: 'Your role does not allow you to open this page. Private workspaces require membership.',
    secondaryLink: '/login',
    secondaryLabel: 'Go to login',
  },
  404: {
    title: 'Page not found',
    description: 'The page you are looking for may have moved or been removed.',
    secondaryLink: '/',
    secondaryLabel: 'Go home',
  },
}

export default function ErrorPage({ code }: { code: keyof typeof ERROR_DETAILS }) {
  const { title, description, secondaryLink, secondaryLabel } = ERROR_DETAILS[code]

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b border-foreground/10 bg-surface/35 px-5 py-3 sm:px-8">
        <a href="/" className="text-xl font-medium">// NEXA</a>
      </header>

      <main className="grid flex-1 place-items-center px-4 py-8 text-center">
        <section className="w-full max-w-lg" aria-labelledby="error-title">
          <p className="text-6xl leading-none text-primary sm:text-8xl">{code}</p>
          <h1 id="error-title" className="mt-5 text-2xl font-medium">{title}</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{description}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="/workspaces" className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-background hover:brightness-110">Go to workspaces</a>
            <a href={secondaryLink} className="rounded-md bg-surface px-5 py-2 text-sm hover:bg-foreground/10">{secondaryLabel}</a>
          </div>
        </section>
      </main>

      <footer className="px-4 py-4">
        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-3 text-xs text-muted">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
        </nav>
      </footer>
    </div>
  )
}
