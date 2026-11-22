import { useEffect } from 'react'
import PublicLayout from '../components/PublicLayout'

type Section = { id: string; title: string; text: string }

export default function LegalPage({ title, sections }: { title: string; sections: Section[] }) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title
    return () => { document.title = previousTitle }
  }, [title])

  return (
    <PublicLayout>
      <main className="mx-auto grid w-full max-w-7xl flex-1 items-start gap-6 px-4 py-8 sm:px-8 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10 md:py-10">
        <header className="md:col-start-2">
          <h1 className="text-3xl font-medium">{title}</h1>
          <p className="mt-2 text-sm text-muted">Last updated <time dateTime="2026-11">November 2026</time></p>
        </header>

        <nav aria-label="On this page" className="rounded-lg border border-foreground/15 bg-surface p-4 md:sticky md:top-6 md:col-start-1 md:row-start-2">
          <p className="mb-3 text-sm font-medium">On this page</p>
          <ul className="grid gap-1" role="list">
            {sections.map(({ id, title }) => (
              <li key={id}>
                <a href={`#${id}`} className="block rounded px-1 py-1 text-sm text-muted hover:text-primary">{title}</a>
              </li>
            ))}
          </ul>
        </nav>

        <article className="grid gap-5 pb-6 md:col-start-2 md:row-start-2">
          {sections.map(({ id, title, text }, index) => (
            <section key={id} id={id} className="scroll-mt-6">
              <h2 className="text-lg font-medium text-primary">{index + 1}. {title}</h2>
              <p className="mt-1 max-w-4xl text-sm leading-relaxed">{text}</p>
            </section>
          ))}
        </article>
      </main>
    </PublicLayout>
  )
}
