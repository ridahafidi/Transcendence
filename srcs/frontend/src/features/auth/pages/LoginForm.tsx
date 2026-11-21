import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../../../components/Button'
import Input from '../../../components/Input'

import ContinueWith42 from '../components/ContinueWith42'

export default function LoginForm() {
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('Sign-in is not connected yet.')
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-medium">Welcome <span className="text-primary">back</span></h1>
        <p className="text-sm text-muted">Sign in to continue to your account</p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit} onChange={() => setMessage('')}>
        <Input name="login" aria-label="Login or email" placeholder="Login or email" autoComplete="username" required />
        <Input name="password" type="password" aria-label="Password" placeholder="Password" autoComplete="current-password" required />
        <Button type="submit" variant="primary">Sign in</Button>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <label className="flex items-center gap-1.5 text-muted">
            <input name="rememberMe" type="checkbox" className="accent-primary" />
            Keep me signed in
          </label>
          <button type="button" className="cursor-pointer text-primary hover:underline" onClick={() => setMessage('Password reset is not available yet.')}>
            Forgot your password?
          </button>
        </div>
      </form>

      <ContinueWith42 />
      <p className="text-sm text-primary empty:hidden" role="status">{message}</p>
    </>
  )
}
