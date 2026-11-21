export default function ContinueWith42() {
  return (
    <div className="grid gap-1">
      <p className="text-center text-sm text-muted">or continue with</p>
      <a href="/api/auth/42" className="rounded-md border border-muted bg-surface px-2.5 py-1.5 text-center uppercase hover:bg-background">
        Continue with 42
      </a>
    </div>
  )
}
