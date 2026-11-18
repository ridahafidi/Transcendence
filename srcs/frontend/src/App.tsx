const features = [
  { title: 'Workspaces and tasks', description: 'Kanban boards for every team' },
  { title: 'Real-time chat', description: 'Direct messages and channels' },
  { title: 'Files', description: 'Secure uploads with preview' },
  { title: 'Analytics and API', description: 'Insights and a public REST API' },
]

const previewBars = [44, 73, 56, 100, 69, 37, 86]

function App() {
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

export default App
