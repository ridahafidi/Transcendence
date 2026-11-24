import { useRef, useState } from 'react'
import type { SharedFile } from './workspace-preview-data'
import { PANEL, PRIMARY } from './workspace-styles'

export function WorkspaceFiles({ name, files, onUpload }: {
  name: string; files: SharedFile[]; onUpload: (file: SharedFile) => void
}) {
  const picker = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  function addFile(file?: File) {
    if (!file) return
    if (!/\.(pdf|docx|png|jpe?g|gif|webp|avif)$/i.test(file.name) || file.size > 10 * 1024 * 1024) {
      setError('Choose a PDF, DOCX, or supported image up to 10 MB.')
      return
    }
    setError('')
    const size = file.size < 1024 * 1024
      ? `${Math.max(1, Math.round(file.size / 1024))} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    onUpload({ name: file.name, author: 'You', size, updated: 'Just now' })
  }

  return (
    <div className="grid gap-4">
      <section className={PANEL} onDragOver={(event) => event.preventDefault()} onDrop={(event) => {
        event.preventDefault()
        addFile(event.dataTransfer.files[0])
      }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-medium">Share files with the {name} team</h2>
            <p className="mt-1 text-sm text-muted">Drag and drop or choose a PDF, DOCX, or image up to 10 MB.</p>
          </div>
          <button type="button" className={PRIMARY} onClick={() => picker.current?.click()}>+ Upload file</button>
          <input ref={picker} type="file" accept=".pdf,.docx,.png,.jpg,.jpeg,.gif,.webp,.avif" hidden onChange={(event) => {
            addFile(event.target.files?.[0])
            event.target.value = ''
          }} />
        </div>
        {error && <p className="mt-2 text-sm text-danger" role="alert">{error}</p>}
      </section>
      <section className={PANEL}>
        <h2 className="mb-3 font-medium">Workspace files ({files.length})</h2>
        {files.length === 0 ? <p className="text-sm text-muted">No files yet.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-100 text-left text-sm">
              <thead className="text-xs uppercase text-muted">
                <tr><th className="pb-2">File name</th><th>Uploaded by</th><th>Size</th><th>Updated</th></tr>
              </thead>
              <tbody>
                {files.map(({ name, author, size, updated }, index) => (
                  <tr key={index} className="border-t border-foreground/10">
                    <td className="py-3 pr-3 wrap-anywhere">{name}</td><td className="text-muted">{author}</td><td className="text-muted">{size}</td><td className="text-muted">{updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
