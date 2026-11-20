import Button from "../components/Button"

const features = [
    { title: 'Workspaces and tasks', description: 'Kanban boards for every team' },
    { title: 'Real-time chat', description: 'Direct messages and channels' },
    { title: 'Files', description: 'Secure uploads with preview' },
    { title: 'Analytics and API', description: 'Insights and a public REST API' },
]


const previewBars = [44, 73, 56, 100, 69, 37, 86]

function DashboardPreview({ className }: { className: string }) {
    return (
        <figure className={`${className} text-page`}>
            <figcaption className="text-xs font-semibold uppercase tracking-wider text-page">
                Dashboard preview
            </figcaption>

            <div className="flex items-center justify-between gap-2">
                <div className="grid grid-cols-7 gap-1 h-30 items-end flex-1">
                    {previewBars.map((height, index) => (
                        <span
                            key={index}
                            style={{ height: `${height}%` }}
                            className="w-full bg-primary transition-all hover:bg-primary/80"
                        />
                    ))}
                </div>

                <dl className="flex flex-col gap-2">
                    <div className="bg-foreground/5 border border-foreground/6 rounded-sm pl-3 pr-20 py-3">
                        <dt className="text-sm font-light">Active</dt>
                        <dd className="text-md font-bold text-foreground">128</dd>
                    </div>
                    <div className="bg-foreground/5 border border-foreground/6 rounded-sm pl-3 pr-20 py-3">
                        <dt className="text-sm font-light">Done</dt>
                        <dd className="text-md font-bold text-foreground">342</dd>
                    </div>
                </dl>
            </div>
        </figure>
    )
}

function NavigationBar() {
    return (
        <>
            <a className="text-2xl font-bold whitespace-nowrap" href="/">&#47;&#47; NEXA</a>
            <nav className="max-w-xl flex-1 flex gap-3">
                <Button className="flex-1">Features</Button>
                <Button className="flex-1">Developer</Button>
                <Button className="flex-1" variant="secondary">Log in</Button>
                <Button className="flex-1" variant="primary">Get Started</Button>
            </nav>
        </>
    );
}


function Dashboard() {
    return (
        <div className="h-screen flex flex-col">
            <header className="h-fit flex items-center justify-between border-b-2 border-foreground/20 bg-surface/50 px-8 py-4">
                <NavigationBar />
            </header>

            <main className="flex-1 flex flex-col justify-between p-6">
                <div className="flex-1 flex flex-row items-center gap-20">
                    <section className="flex-1 flex flex-col justify-center gap-4">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Simplified Systems,<br />
                            <span className="text-primary">Superior Results.</span>
                        </h1>
                        <p className="text-page">
                            Tasks, chat, files and analytics for small businesses, in one
                            real-time workspace your whole team can use at the same time.
                        </p>
                        <div className="max-w-sm flex gap-2 items-center">
                            <Button className="flex-1">Continue with 42</Button>
                            <Button className="flex-1" variant="primary">Get Started</Button>
                        </div>
                    </section>

                    <DashboardPreview className="flex-1 p-6 bg-surface rounded-xl border border-foreground/20" />
                </div>


                <section className="">
                    <ul className="grid grid-cols-4 gap-2 p-1">
                        {features.map(({ title, description }) => (
                            <li className="before:block before:size-4 before:border-primary before:bg-primary/20 \
                            before:border before:rounded-full before:content[''] border border-foreground/20 bg-surface px-5 py-10 rounded-xl" key={title}>
                                <h2 className="text-md font-medium ml-3 mt-2">{title}</h2>
                                <p className="text-page text-sm font-thin ml-3">{description}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            </main >

            <footer className="flex flex-row justify-between h-fit bg-surface/50 py-6 px-20">
                <small>© 2026 Nexa</small>
                <nav className="flex gap-2" aria-label="Legal">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                </nav>
            </footer>
        </div >
    )
}

export default Dashboard
