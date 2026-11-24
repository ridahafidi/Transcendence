import { Button, Input } from "@/components";

function SignInPage() {
    return (
        <>
            <h1 className="leading-6 text-3xl font-extrabold">Welcome <span className="text-primary">back</span></h1>
            <p className="leading-6 text-page">Sign in to your account</p>
            <form noValidate className="my-4 flex flex-col gap-3" >
                <Input type="email" name="login" placeholder="Login or email" autoComplete="username" />
                <Input type="password" name="password" placeholder="Password" autoComplete="current-password" errors={["weak password", "less than 8 characters"]} />
                <Button type="submit" variant="primary">Sign in</Button>
                <div className="flex items-center justify-between">
                    <label className="flex gap-2 cursor-pointer items-center whitespace-nowrap">
                        <Input type="checkbox" className="h-4 w-4 accent-primary" />keep me signed in
                    </label>
                    <a href="#" className="text-primary hover:underline">Forget your password?</a>
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

export default SignInPage;