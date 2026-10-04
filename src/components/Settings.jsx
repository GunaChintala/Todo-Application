export default function Settings({ settings, setSettings, onReset, taskCount }) {
  return (
    <section className="page">
      <article className="card">
        <h3>Appearance</h3>
        <div className="toggle-row">
          <span>Theme</span>
          <div className="chip-row">
            {['light', 'dark'].map((theme) => (
              <button
                key={theme}
                className={settings.theme === theme ? 'btn primary' : 'btn ghost'}
                onClick={() => setSettings({ ...settings, theme })}
              >
                {theme === 'light' ? 'Light' : 'Dark'}
              </button>
            ))}
          </div>
        </div>
      </article>
      <article className="card">
        <h3>Data</h3>
        <p className="muted">
          {taskCount} tasks are saved in this browser via localStorage. You can restore the sample
          habits at any time.
        </p>
        <button className="btn danger" onClick={onReset}>
          Restore sample data
        </button>
      </article>
    </section>
  )
}
