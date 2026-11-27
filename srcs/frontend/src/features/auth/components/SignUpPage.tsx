import * as z from 'zod';
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Input } from '@/components';
import { type RegisterInput, registerSchema } from '@/schemas';
import { useAuth } from '../context/useAuth';
import { authApi, parseApiError } from '../api/auth.api';

type FieldErrors = Partial<Record<keyof RegisterInput, string[]>>;

function SignUpPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setServerError(null);
        const formData = new FormData(e.currentTarget);
        const result = registerSchema.safeParse(Object.fromEntries(formData));
        if (!result.success) {
            setErrors(z.flattenError(result.error).fieldErrors);
            return;
        }
        // Optional: require Terms checkbox before submitting
        if (formData.get('terms') !== 'on') {
            setServerError('You must agree to the Terms of Service and PrivacyPolicy.');
            return;
        }
        setErrors({});
        setIsSubmitting(true);
        try {
            const { username, email, password } = result.data; // omit `confirm`
            await register({ username, email, password });
            navigate('/dashboard', { replace: true });
        }
        catch (err) {
            const apiErr = parseApiError(err);
            setErrors(apiErr.fieldErrors as FieldErrors);
            setServerError(apiErr.message);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (
        <>
            <h1 className="mt-5 leading-6 text-3xl font-extrabold">
                Create <span className="text-primary">account</span>
            </h1>
            <p className="mb-5 leading-6 text-page">Create a new account today</p>
            <form noValidate className="my-4 flex flex-col gap-3" onSubmit={handleSubmit}>
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    autoComplete="email"
                    errors={errors.email}/>
                <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    autoComplete="username"
                    errors={errors.username}/>
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    errors={errors.password}/>
                <Input
                    type="password"
                    name="confirm"
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    errors={errors.confirm}/>
                {serverError && (
                    <p className="rounded-md border border-danger/40 bg-danger/10 p-2
                        text-sm text-danger">
                        {serverError}
                    </p>
                )}
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Sign up'}
                </Button>
                <div className="flex items-center justify-between">
                    <label className="flex gap-2 cursor-pointer items-center">
                        <input
                            type="checkbox"
                            name="terms"
                            className="h-4 w-4 accent-primary"
                        />
                        I agree to the{' '}
                        <a href="/terms" className="text-primary hover:underline">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                        </a>
                    </label>
                </div>
            </form>
            <p className="text-center text-page">or continue with</p>
            <Button
                variant="secondary"
                className="w-full"
                onClick={() => authApi.start42OAuth()}
            >
                Continue with 42
            </Button>
        </>
    );
}
    export default SignUpPage;