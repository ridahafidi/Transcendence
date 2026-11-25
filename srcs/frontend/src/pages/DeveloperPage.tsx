import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import AppShell from '../components/AppShell'

type ApiKey = { id: string; name: string; masked: string; lastUsed: string }

const SAMPLE_KEYS: ApiKey[] = [
  { id: 'mobile', name: 'Mobile app', masked: 'nexa_demo_••••••a91f', lastUsed: '2 min ago' },
  { id: 'reporting', name: 'Reporting script', masked: 'nexa_demo_••••••7c20', lastUsed: '3 days ago' },
]

const ENDPOINTS = [
  ['GET', '/workspaces'],
  ['GET', '/tasks'],
  ['GET', '/tasks/{id}'],
  ['POST', '/tasks'],
  ['PUT', '/tasks/{id}'],
  ['DELETE', '/tasks/{id}'],
] as const

const METHOD_COLORS = {
  GET: 'text-emerald-400',
  POST: 'text-primary',
  PUT: 'text-info',
  DELETE: 'text-danger',
}

const PANEL = 'min-w-0 rounded-lg border border-foreground/15 bg-surface p-4'
const CONTROL = 'rounded-md border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm'
const PRIMARY = 'cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-background hover:brightness-110'
const STORAGE_KEY = 'nexa-preview-api-keys'

function readKeys(): ApiKey[] {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : SAMPLE_KEYS
  } catch {
    return SAMPLE_KEYS
  }
}

export default function DeveloperPage() {
  const [keys, setKeys] = useState(readKeys)
  const [newKey, setNewKey] = useState('')
  const [message, setMessage] = useState('')
  const dialog = useRef<HTMLDialogElement>(null)

  function updateKeys(nextKeys: ApiKey[]) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextKeys))
    setKeys(nextKeys)
  }

  function createKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = String(new FormData(event.currentTarget).get('name') ?? '').trim()
    if (!name) return

    const id = crypto.randomUUID()
    const key = `nexa_demo_${id.replaceAll('-', '')}`
    updateKeys([{ id, name, masked: `nexa_demo_••••••${key.slice(-4)}`, lastUsed: 'Never' }, ...keys])
    setNewKey(key)
    setMessage('')
  }

  function revokeKey(key: ApiKey) {
    if (!window.confirm(`Revoke “${key.name}”?`)) return
    updateKeys(keys.filter(({ id }) => id !== key.id))
    setMessage(`${key.name} revoked in this preview.`)
  }

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(newKey)
      setMessage('Preview key copied.')
    } catch {
      setMessage('Select and copy the key manually.')
    }
  }

  return (
    <AppShell activePage="/developer" search={
      <form action="/friends" className="w-full max-w-sm">
        <input name="q" type="search" required aria-label="Find a user" placeholder="Search people…" className={`w-full ${CONTROL} placeholder:text-muted`} />
      </form>
    }>
      <main className="flex-1 space-y-4 px-4 py-5 sm:px-7">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Developer</h1>
            <p className="text-sm text-muted">API keys and documentation · Preview</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => { setMessage(''); dialog.current?.showModal() }} className={PRIMARY}>+ Create key</button>
            <button type="button" disabled className={`${CONTROL} cursor-not-allowed text-muted`}>Swagger docs unavailable</button>
          </div>
        </header>

        <dl className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Requests today (sample)', value: '4,210' },
            { label: 'Planned rate limit', value: '100 / min' },
            { label: 'Active preview keys', value: keys.length },
          ].map(({ label, value }) => (
            <div key={label} className={PANEL}>
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="mt-1 text-2xl">{value}</dd>
            </div>
          ))}
        </dl>

        <section className={PANEL}>
          <h2 className="mb-2 font-medium">API keys</h2>
          <ul className="grid gap-2 md:gap-0" role="list">
            {keys.map((key) => (
              <li key={key.id} className="grid items-center gap-2 rounded-md border border-foreground/10 p-3 text-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(4rem,0.65fr)_auto] md:rounded-none md:border-x-0 md:border-b-0">
                <span className="wrap-anywhere">{key.name}</span>
                <code className="text-xs wrap-anywhere text-muted">{key.masked}</code>
                <span className="text-xs text-muted">Last used: {key.lastUsed}</span>
                <button type="button" className={`${CONTROL} justify-self-start cursor-pointer border-danger/50 text-danger`} aria-label={`Revoke ${key.name}`} onClick={() => revokeKey(key)}>Revoke</button>
              </li>
            ))}
          </ul>
          {keys.length === 0 && <p className="text-sm text-muted">No API keys yet.</p>}
          {message && !newKey && <p className="mt-2 text-sm text-muted" role="status">{message}</p>}
        </section>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
          <section className={PANEL}>
            <h2 className="mb-3 font-medium">Planned public API endpoints</h2>
            <ul className="grid gap-2" role="list">
              {ENDPOINTS.map(([method, path]) => (
                <li key={`${method} ${path}`} className="flex items-start gap-3 text-sm">
                  <span className={`w-16 shrink-0 rounded-full bg-foreground/5 px-2 py-1 text-center text-xs ${METHOD_COLORS[method]}`}>{method}</span>
                  <code className="min-w-0 py-1 text-xs wrap-anywhere">/api/public/v1{path}</code>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Swagger UI is planned at <code>/api/docs</code>.</p>
          </section>
          <section className={PANEL}>
            <h2 className="mb-3 font-medium">Planned API rules</h2>
            <ul className="grid gap-2 text-sm text-muted" role="list">
              <li>Send the key in the <code className="text-foreground">X-API-Key</code> header.</li>
              <li>The full key is shown once and stored on the server as a hash.</li>
              <li>Rate limits apply per key. Excess requests return HTTP 429.</li>
              <li>A key can only access data its owner can see. Revoked keys stop working immediately.</li>
            </ul>
          </section>
        </div>

        <dialog ref={dialog} onClose={() => { setNewKey(''); setMessage('') }} aria-labelledby="key-dialog-title" className="m-auto w-11/12 max-w-md rounded-xl border border-foreground/15 bg-surface p-5 text-foreground backdrop:bg-black/60">
          <h2 id="key-dialog-title" className="mb-3 text-xl font-semibold">{newKey ? 'Your preview key' : 'Create API key'}</h2>
          {newKey ? (
            <div className="grid gap-3">
              <p className="text-sm text-muted">Copy this key before closing. It works only as a preview value.</p>
              <code className={`${CONTROL} select-all wrap-anywhere`}>{newKey}</code>
              {message && <p className="text-sm text-muted" role="status">{message}</p>}
              <div className="flex justify-end gap-2">
                <button type="button" className={`${CONTROL} cursor-pointer`} onClick={() => dialog.current?.close()}>Done</button>
                <button type="button" className={PRIMARY} onClick={copyKey}>Copy key</button>
              </div>
            </div>
          ) : (
            <form className="grid gap-3" onSubmit={createKey}>
              <label className="grid gap-1 text-sm">Key name
                <input name="name" required maxLength={80} pattern={'.*\\S.*'} className={CONTROL} />
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" className={`${CONTROL} cursor-pointer`} onClick={() => dialog.current?.close()}>Cancel</button>
                <button type="submit" className={PRIMARY}>Create key</button>
              </div>
            </form>
          )}
        </dialog>
      </main>
    </AppShell>
  )
}
