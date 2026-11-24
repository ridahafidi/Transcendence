import type { FormEvent } from 'react'
import type { Message } from './workspace-preview-data'
import { CONTROL, PANEL, PRIMARY } from './workspace-styles'

export function WorkspaceChat({ name, description, memberCount, messages, onSend, onFiles }: {
  name: string; description: string; memberCount: number; messages: Message[]
  onSend: (message: Message) => void; onFiles: () => void
}) {
  const channel = name.toLowerCase().replace(/\s+/g, '-')
  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const text = String(new FormData(form).get('message')).trim()
    if (!text) return
    onSend({ author: 'You', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text })
    form.reset()
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(12rem,1fr)]">
      <section className={PANEL}>
        <h2 className="font-medium"># {channel}</h2>
        <p className="mt-1 border-b border-foreground/10 pb-3 text-xs text-muted">{memberCount} members · Workspace conversation</p>
        <ul className="my-4 grid max-h-80 gap-3 overflow-y-auto" aria-label="Chat messages" role="list">
          {messages.map(({ author, time, text }, index) => (
            <li key={index} className={author === 'You' ? 'ml-auto w-fit max-w-[85%]' : 'w-fit max-w-[85%]'}>
              <p className="mb-1 text-xs text-muted">{author} · {time}</p>
              <p className={`rounded-md px-3 py-2 text-sm wrap-anywhere ${author === 'You' ? 'bg-primary/10' : 'bg-foreground/5'}`}>{text}</p>
            </li>
          ))}
        </ul>
        <form className="flex gap-2" onSubmit={sendMessage}>
          <input name="message" required maxLength={1000} aria-label="Message" placeholder={`Message #${channel}…`} className={`${CONTROL} min-w-0 flex-1`} />
          <button className={PRIMARY}>Send</button>
        </form>
      </section>
      <aside className={PANEL}>
        <h2 className="font-medium">About this channel</h2>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
        <p className="mt-4 text-sm">Shared with all {memberCount} workspace members</p>
        <button type="button" className={`${CONTROL} mt-3 w-full`} onClick={onFiles}>View shared files</button>
      </aside>
    </div>
  )
}
