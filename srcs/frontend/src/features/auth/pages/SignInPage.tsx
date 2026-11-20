import Input from "../../../components/Input";
import Button from "../../../components/Button";

function SignInPage() {
    return (
        <>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-extrabold">Welcome <span className="text-primary">back</span></h1>
                <p className="text-sm text-muted">Sign in to your account</p>
            </div>
            <form className="flex flex-col gap-4">
                <Input type="text" name="login" placeholder="Login or email" autoComplete="username" />
                <Input type="password" name="password" placeholder="Password" autoComplete="current-password" />
                <Button type="submit" variant="primary">Sign in</Button>
                <div className="flex items-center justify-between text-xs">
                    <label className="flex gap-2 cursor-pointer items-center whitespace-nowrap text-muted">
                        <Input type="checkbox" className="h-4 w-4 accent-primary" />keep me signed in
                    </label>
                    <a href="#" className="text-primary hover:underline">Forget your password?</a>
                </div>
            </form>
            <p className="text-center text-sm text-muted">or continue with</p>
            <Button variant="info">Continue with 42</Button>
            <p className="text-center text-xs text-muted">
                By continuing, you agree to our{" "}
                <a href="#" className="hover:text-foreground underline">Privacy Policy</a>
                {" and "}
                <a href="#" className="hover:text-foreground underline">Terms of Service</a>
            </p>
        </>
    )
}

export default SignInPage;