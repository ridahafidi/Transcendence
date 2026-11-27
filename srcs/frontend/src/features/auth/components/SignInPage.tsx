import * as z from 'zod';
import { type FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button, Input } from '@/components';
import { type LoginInput, loginSchema } from '@/schemas';
import { useAuth } from '../context/useAuth';
import { authApi, parseApiError } from '../api/auth.api';

type FieldErrors = Partial<Record<keyof LoginInput, string[]>>;

function SignInPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from =
        (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
        '/dashboard';

    const [errors, setErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerError(null);

        const formData = new FormData(e.currentTarget);
        const raw = {
            email: String(formData.get('email') ?? ''),
            password: String(formData.get('password') ?? ''),
            rememberMe: formData.get('rememberMe') === 'on',
        };

        const result = loginSchema.safeParse(raw);
        if (!result.success) {
            setErrors(z.flattenError(result.error).fieldErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);
        try {
            await login(result.data);
            navigate(from, { replace: true });
        } catch (err) {
            const apiErr = parseApiError(err);
            setErrors(apiErr.fieldErrors as FieldErrors);
            setServerError(apiErr.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h1 className="leading-6 text-3xl font-extrabold">
                Welcome <span className="text-primary">back</span>
            </h1>
            <p className="leading-6 text-page">Sign in to your account</p>

            <form noValidate className="my-4 flex flex-col gap-3" onSubmit={handleSubmit}>
                <Input type="email" name="email" placeholder="Email" autoComplete="username"
                errors={errors.email} />
                <Input type="password" name="password" placeholder="Password"
                autoComplete="current-password" errors={errors.password} />

                {serverError && (
                    <p className="rounded-md border border-danger/40 bg-danger/10 p-2 text-sm
                    text-danger">
                        {serverError}
                    </p>
                )}

                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>

                <div className="flex items-center justify-between">
                    <label className="flex gap-2 cursor-pointer items-center whitespace-nowrap">
                        <input type="checkbox" name="rememberMe" className="h-4 w-4
                        accent-primary" />
                        keep me signed in
                    </label>
                    <a href="#" className="text-primary hover:underline">Forgot your password?</a>
                </div>
            </form>

            <p className="text-center text-page">or continue with</p>
            <Button variant="secondary" className="w-full" onClick={() => authApi.start42OAuth()}>
                Continue with 42
            </Button>
            <p className="mt-8 text-center text-sm">
                By continuing, you agree to our{" "}
                <a href="#" className="hover:text-foreground underline">Privacy Policy</a>
                {" and "}
                <a href="#" className="hover:text-foreground underline">Terms of Service</a>
            </p>
        </>
    );
}

export default SignInPage;