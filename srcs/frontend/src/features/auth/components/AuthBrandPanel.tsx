import SignInPage from "./SignInPage";
import Button from "../components/Button";
interface Feature {
    title: string;
    text: string;
}

const features: Feature[] = [
    { title: "Secure", text: "Your data, our priority." },
    { title: "Fast", text: "Built for performance." },
    { title: "Reliable", text: "Always available." },
];

function MainPage() {
    return (
        <div className="h-screen grid grid-cols-1 md:grid-cols-2">
            {/* REGISTRATION FORM */}
            <div className="flex items-center justify-center">
                <div className="flex flex-col w-full max-w-md gap-4 bg-surface text-foreground p-6 rounded-xl shadow-[8px_8px_0_0_#c9ccd8]">
                    <div role="tablist" className="flex rounded-md bg-background p-1">
                        <Button key="login" role="tab" variant="tab" aria-selected="true" className="flex-1">Login</Button>
                        <Button key="signup" role="tab" variant="tab" className="flex-1">Sign up</Button>
                    </div>
                    <SignInPage ></SignInPage>
                </div>
            </div>

            {/* DESIGN */}
            <aside
                className="relative hidden flex-col justify-center px-12 text-foreground md:flex"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(90deg, transparent 0 5%, rgba(255,255,255,0.07) 5% 10%), linear-gradient(90deg, #1e2f50, #090e19)",
                }}>
                <span className="absolute left-12 top-10 text-sm font-bold">// spaceio</span>
                <h2 className="text-5xl font-bold leading-tight">
                    Simplified Systems,
                    <br />
                    <span className="text-primary">Superior Results.</span>
                </h2>
                <ul className="mt-10 grid max-w-lg grid-cols-3 gap-6">
                    {features.map((f) => (
                        <li key={f.title} className="flex flex-col gap-1">
                            <span className="mb-2 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                            <h3 className="text-sm font-semibold">{f.title}</h3>
                            <p className="text-xs text-muted">{f.text}</p>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    )
}

export default MainPage;