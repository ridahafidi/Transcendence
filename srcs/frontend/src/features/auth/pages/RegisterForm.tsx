import { useState } from 'react'
import type { FormEvent } from 'react'
import Button from '../../../components/Button'
import Input from '../../../components/Input'

import ContinueWith42 from '../components/ContinueWith42'

function meetsPasswordRules(password: string) {
  const characterTypes = [
    /\p{L}/u.test(password),
    /\p{N}/u.test(password),
    /[\p{P}\p{S}]/u.test(password),
  ].filter(Boolean).length

  return password.length >= 8 && characterTypes >= 2
}

export default function RegisterForm() {
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const meetsRules = meetsPasswordRules(password)
  const showPasswordError = password.length > 0 && !meetsRules

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const submittedPassword = String(fields.get('password') ?? '')

    if (!meetsPasswordRules(submittedPassword)) {
      setMessage('Use at least 8 characters and include at least two of these: letters, numbers, and symbols.')
      return
    }

    if (submittedPassword !== fields.get('confirmPassword')) {
      setMessage('Passwords must match.')
      return
    }

    setMessage('Account creation is not connected yet.')
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-medium">Create your <span className="text-primary">account</span></h1>
        <p className="text-sm text-muted">Get started with Nexa.</p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit} onChange={() => setMessage('')}>
        <div>
          <Input name="username" aria-label="Username" placeholder="Username" autoComplete="username" pattern={'\\p{L}+(?: \\p{L}+)?'} aria-describedby="username-hint" required />
          <p id="username-hint" className="mt-1 text-xs text-muted">Letters only, with one optional space between first and last name.</p>
        </div>
        <Input name="email" type="email" aria-label="Email" placeholder="Email" autoComplete="email" required />
        <div>
          <Input
            name="password"
            type="password"
            aria-label="Password"
            placeholder="Password"
            autoComplete="new-password"
            aria-describedby="password-hint"
            aria-invalid={showPasswordError || undefined}
            className="aria-invalid:border-danger"
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
          <div className="mt-3 grid gap-1">
            <p id="password-hint" className={showPasswordError ? 'text-xs text-danger' : 'text-xs text-muted'}>
              {meetsRules
                ? 'Password meets the requirements.'
                : 'At least 8 characters and two types: letters, numbers, or symbols.'}
            </p>
            <div className="h-1.5 rounded-full bg-info/10" aria-hidden="true">
              {password && (
                <div className={meetsRules ? 'h-full rounded-full bg-primary' : 'h-full w-1/3 rounded-full bg-danger'} />
              )}
            </div>
          </div>
        </div>
        <Input name="confirmPassword" type="password" aria-label="Confirm password" placeholder="Confirm password" autoComplete="new-password" required />

        <div className="flex items-start gap-2 text-sm text-muted">
          <input id="accept-terms" type="checkbox" className="mt-1 accent-primary" required />
          <span>
            <label htmlFor="accept-terms">I agree to the </label>
            <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
            {' and '}
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
          </span>
        </div>

        <Button type="submit" variant="primary">Register</Button>
      </form>

      <ContinueWith42 />
      <p className="text-sm text-primary empty:hidden" role="status">{message}</p>
    </>
  )
}
