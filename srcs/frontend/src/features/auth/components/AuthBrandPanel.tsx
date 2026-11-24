interface Feature {
    title: string;
    text: string;
}

const features: Feature[] = [
    { title: "Secure", text: "Your data, our priority." },
    { title: "Fast", text: "Built for performance." },
    { title: "Reliable", text: "Always available." },
];

function AuthBrandPanel({ className }: { className: string }) {
    return (
        <aside
            className={className}
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
                        <p className="">{f.text}</p>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default AuthBrandPanel;