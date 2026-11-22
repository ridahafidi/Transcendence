import PublicLayout from '../../../components/PublicLayout'

export default function FortyTwoCallbackPage() {
  const error = new URLSearchParams(window.location.search).get('error')
  const title = error ? 'Could not sign in with 42' : 'Signing you in with 42…'
  const details = error === 'access_denied'
    ? '42 sign-in was cancelled. Return to login to try again.'
    : 'Nexa is connecting your 42 account.'

  return (
    <PublicLayout>
      <main className="grid flex-1 place-items-center px-4 py-8">
        <section aria-labelledby="callback-title" className="w-full max-w-lg rounded-xl bg-surface px-6 py-8 text-center sm:px-12 sm:py-10">
          <p className="text-5xl font-medium text-primary" aria-hidden="true">42</p>
          <h1 id="callback-title" className="mt-5 text-2xl font-medium">{title}</h1>
          <p className="mt-2 text-sm text-muted">{error && error !== 'access_denied' ? 'Return to login to try again.' : details}</p>

          {!error && (
            <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-foreground/10" aria-hidden="true">
              <div className="h-full w-1/2 rounded-full bg-primary motion-safe:animate-pulse" />
            </div>
          )}

          <a href="/login" className="mt-6 inline-block rounded text-sm text-muted underline hover:text-foreground">
            Return to login
          </a>
        </section>
      </main>
    </PublicLayout>
  )
}
