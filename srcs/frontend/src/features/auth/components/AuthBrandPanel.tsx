import LoginForm from '../pages/LoginForm'
import RegisterForm from '../pages/RegisterForm'

const FEATURES = [
  { title: 'Secure', description: 'Your data, our priority.' },
  { title: 'Fast', description: 'Built for performance.' },
  { title: 'Reliable', description: 'Always available.' },
]

const AUTH_LINKS = [
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' },
]

function AuthBrandPanel({ isRegister }: { isRegister: boolean }) {
  const currentPage = isRegister ? '/register' : '/login'

  return (
    <main className="grid min-h-dvh font-sans md:grid-cols-2">
      <section className="grid grid-rows-[auto_1fr_auto] justify-items-center gap-4 bg-foreground px-4 py-4 sm:px-8">
        <a href="/" className="justify-self-start text-xl font-semibold text-background md:hidden">// NEXA</a>
        <div className="row-start-2 grid w-full max-w-125 gap-6 self-center rounded-2xl bg-[#2e3443] p-5 sm:p-8">
          <nav aria-label="Account" className="grid grid-cols-2 gap-2 rounded-xl bg-background/55 p-2">
            {AUTH_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                aria-current={currentPage === href ? 'page' : undefined}
                className="rounded-lg px-3 py-2.5 text-center text-sm font-semibold uppercase hover:bg-background/70 aria-[current=page]:bg-background"
              >
                {label}
              </a>
            ))}
          </nav>

          {isRegister ? <RegisterForm /> : <LoginForm />}

          {isRegister ? (
            <p className="text-center text-sm text-muted">
              Already have an account? <a href="/login" className="hover:text-foreground hover:underline">Log in</a>
            </p>
          ) : (
            <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted">
              <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>
              <a href="/terms" className="underline hover:text-foreground">Terms of Service</a>
            </nav>
          )}
        </div>
        <small className="row-start-3 text-xs text-background">© 2026 Nexa</small>
      </section>

      <aside className="relative hidden items-center bg-background px-[clamp(2rem,6vw,7rem)] py-20 md:flex">
        <a href="/" className="absolute top-10 left-10 text-3xl font-medium">// NEXA</a>
        <div className="w-full">
          <h2 className="text-[clamp(2rem,3vw,2.75rem)] leading-snug font-medium">
            Simplified Systems,
            <span className="block text-primary">Superior Results.</span>
          </h2>
          <ul className="mt-12 grid grid-cols-3 gap-3 lg:gap-6" role="list">
            {FEATURES.map(({ title, description }) => (
              <li key={title}>
                <span className="block size-1.5 rounded-full bg-primary" aria-hidden="true" />
                <h3 className="mt-1 leading-tight">{title}</h3>
                <p className="text-sm leading-tight text-muted">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </main>
  )
}

export default AuthBrandPanel
