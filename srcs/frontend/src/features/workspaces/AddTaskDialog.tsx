import { useRef } from 'react'
import type { FormEvent } from 'react'
import { CONTROL, PRIMARY } from './workspace-styles'

const PRIORITIES = ['High', 'Medium', 'Low'] as const
export type TaskPriority = typeof PRIORITIES[number]
type TaskDraft = { title: string; description: string; priority: TaskPriority }

export default function AddTaskDialog({ onAdd }: { onAdd: (task: TaskDraft) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const form = useRef<HTMLFormElement>(null)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const title = String(fields.get('title') ?? '').trim()
    const description = String(fields.get('description') ?? '').trim()
    const priority = PRIORITIES.find((value) => value === fields.get('priority'))
    if (!title || !priority) return

    onAdd({ title, description, priority })
    dialog.current?.close()
  }

  return (
    <>
      <button type="button" className={`cursor-pointer ${PRIMARY}`} onClick={() => dialog.current?.showModal()}>Add task</button>
      <dialog
        ref={dialog}
        aria-labelledby="add-task-title"
        onClose={() => form.current?.reset()}
        className="m-auto w-11/12 max-w-md rounded-xl border border-foreground/15 bg-surface p-5 text-foreground backdrop:bg-black/60 sm:p-6"
      >
        <form ref={form} className="grid gap-4" onSubmit={submit}>
          <h2 id="add-task-title" className="text-xl font-semibold">Add task</h2>
          <label className="grid gap-1 text-sm">
            Task name
            <input name="title" required maxLength={100} pattern={'.*\\S.*'} className={CONTROL} />
          </label>
          <label className="grid gap-1 text-sm">
            Description
            <textarea name="description" rows={4} maxLength={1000} className={CONTROL} />
          </label>
          <label className="grid gap-1 text-sm">
            Priority
            <select name="priority" defaultValue="Medium" className={`${CONTROL} scheme-light [&>option]:bg-white [&>option]:text-black`}>
              {PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" className={`cursor-pointer ${CONTROL}`} onClick={() => dialog.current?.close()}>Cancel</button>
            <button type="submit" className={`cursor-pointer ${PRIMARY}`}>Create task</button>
          </div>
        </form>
      </dialog>
    </>
  )
}
