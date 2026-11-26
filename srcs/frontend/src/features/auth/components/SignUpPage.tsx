import * as z from 'zod'
import { FormEvent, useState } from 'react'
import { Button, Input } from "@/components";
import { type RegisterInput, registerSchema } from "@repo/shared";

type Error = Partial<Record<keyof RegisterInput, string[]>>

export function SignUpPage() {
    const [errors, setErrors] = useState<Error>({})

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = registerSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)))
        if (!result.success) {
            setErrors(z.flattenError(result.error).fieldErrors)
            return
        }
        setErrors({})
    }

    return (
        <>
            <h1 className="mt-5 leading-6 text-3xl font-extrabold">Create <span className="text-primary">account</span></h1>
            <p className="mb-5 leading-6 text-page">create new account today</p>
            <form noValidate className="my-4 flex flex-col gap-3" onSubmit={handleSubmit} >
                <Input type="email" name="email" placeholder="Login or email" autoComplete="username" errors={errors.email} />
                <Input type="text" name="username" placeholder="Username" autoComplete="username" errors={errors.username} />
                <Input type="password" name="password" placeholder="Password" autoComplete="current-password" errors={errors.password} />
                <Input type="password" name="confirm" placeholder="Confirm" errors={errors.confirm} />
                <Button type="submit" variant="primary">Sign in</Button>
                <div className="flex items-center justify-between">
                    <label className="flex gap-2 cursor-pointer items-center whitespace-nowrap">
                        <Input type="checkbox" className="h-4 w-4 accent-primary" />I agree to the
                        <a href="#" className="text-primary hover:underline">Terms of Service</a>
                        and
                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </label>
                </div>
            </form>
            <p className="text-center text-page">or continue with</p>
            <Button variant="secondary" className="w-full">Continue with 42</Button>
            <p className="mt-8 text-center text-sm">
                By continuing, you agree to our{" "}
                <a href="#" className="hover:text-foreground underline">Privacy Policy</a>
                {" and "}
                <a href="#" className="hover:text-foreground underline">Terms of Service</a>
            </p>
        </>
    )
}
