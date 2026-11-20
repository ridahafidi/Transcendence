import Button from "../components/Button"
const features = [
    { title: 'Workspaces and tasks', description: 'Kanban boards for every team' },
    { title: 'Real-time chat', description: 'Direct messages and channels' },
    { title: 'Files', description: 'Secure uploads with preview' },
    { title: 'Analytics and API', description: 'Insights and a public REST API' },
]

const previewBars = [44, 73, 56, 100, 69, 37, 86]

function LDashboard() {
    return (
        <div className="landing">
            <header className="site-header">
                <a className="wordmark" href="/">&#47;&#47; NEXA</a>
                <nav className="site-nav" aria-label="Main navigation">
                    <a href="#features">Features</a>
                    <a href="/developer">Developer</a>
                    <a className="action action-outline" href="/login">Log in</a>
                    <a className="action action-primary" href="/register">Get started</a>
                </nav>
            </header>

            <main className="landing-content">
                <section className="hero" aria-labelledby="landing-title">
                    <div className="hero-copy">
                        <h1 id="landing-title">
                            Simplified Systems,
                            <span>Superior Results.</span>
                        </h1>
                        <p>
                            Tasks, chat, files and analytics for small businesses, in one
                            real-time workspace your whole team can use at the same time.
                        </p>
                        <div className="hero-actions">
                            <a className="action action-primary" href="/register">Get started</a>
                            <a className="action action-secondary" href="/login">Continue with 42</a>
                        </div>
                    </div>

                    <figure className="dashboard-preview">
                        <figcaption>Dashboard preview</figcaption>
                        <div className="dashboard-content">
                            <div className="preview-chart" aria-hidden="true">
                                {previewBars.map((height) => (
                                    <span key={height} style={{ height: `${height}%` }} />
                                ))}
                            </div>
                            <dl className="preview-stats">
                                <div>
                                    <dt>Active</dt>
                                    <dd>128</dd>
                                </div>
                                <div>
                                    <dt>Done</dt>
                                    <dd>342</dd>
                                </div>
                            </dl>
                        </div>
                    </figure>
                </section>

                <ul className="feature-list" id="features" aria-label="Nexa features">
                    {features.map(({ title, description }) => (
                        <li key={title}>
                            <h2>{title}</h2>
                            <p>{description}</p>
                        </li>
                    ))}
                </ul>
            </main>

            <footer className="site-footer">
                <small>© 2026 Nexa</small>
                <nav aria-label="Legal">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                </nav>
            </footer>
        </div>
    )
}

function DashboardPreview() {
    return (
        <figure className="flex-1 border-1 border-foreground">
            <figcaption>Dashboard preview</figcaption>
            <div className="grid grid-cols-[2fr_1fr] align-end gap-auto">
                <div className="grid height-auto grid-cols[repeat(7,1fr)] align-items-end gap-auto">
                    {previewBars.map((height) => (
                        <span key={height} style={{ height: `${height}%` }} />
                    ))}
                </div>
                <dl className="grid gap-[0.65] px-0.6 py-0.75 border-5 bg-surface">
                    <div>
                        <dt>Active</dt>
                        <dd>128</dd>
                    </div>
                    <div>
                        <dt>Done</dt>
                        <dd>342</dd>
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
            <header className="h-fit bg-surface/50 flex items-center justify-between border-b-2 border-slate-800 px-6 py-4">
                <NavigationBar />
            </header>
            <main className="h- full flex-1 p-6">
                <div className="flex flex-row">
                    <section className="flex flex-col flex-1">
                        <h1 className="text-4xl">
                            Simplified Systems,<br />
                            <span className="text-primary">Superior Results.</span>
                        </h1>
                        <p>
                            Tasks, chat, files and analytics for small businesses, in one<br />
                            real-time workspace your whole team can use at the same time.
                        </p>
                        <div className="max-w-sm flex gap-2 align-center justify-center">
                            <Button className="flex-1">Continue with 42</Button>
                            <Button className="flex-1" variant="primary">Get Started</Button>
                        </div>
                    </section>

                    <DashboardPreview />
                </div>


                <section>
                    <ul className="grid grid-cols-4 gap-2 p-1">
                        {features.map(({ title, description }) => (
                            <li className="before:block before:size-4 before:border-primary before:bg-primary/20 \
                            before:border before:rounded-full before:content[''] border-1 border-foreground/20 \
                            rounded-md bg-surface p-4" key={title}>
                                <h2 className="text-md font-medium ml-3 mt-2">{title}</h2>
                                <p className="text-sm font-thin ml-3">{description}</p>
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
