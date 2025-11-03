export default function Page() {
  const stats = [
    { label: "Projects Active", value: "4" },
    { label: "AI Jobs Running", value: "132" },
    { label: "Conversion Rate", value: "4.7%" },
    { label: "Uptime (30 d)", value: "99.98%" },
  ];

  const projects = [
    { name: "NeoDOS", detail: "Sovereign OS kernel + policy core", progress: 68 },
    { name: "Lumos", detail: "Governance + oracle ledger", progress: 54 },
    { name: "GigGrow", detail: "Map-driven job network", progress: 41 },
    { name: "Trades & Sales", detail: "CNC + laser product line", progress: 37 },
  ];

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white grid place-items-center text-sm font-bold">
              ML
            </div>
            <div className="font-semibold tracking-tight">Morris Lane</div>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-sm text-zinc-600">
            <a href="#projects" className="hover:text-zinc-900">Projects</a>
            <a href="#updates" className="hover:text-zinc-900">Updates</a>
            <a href="#contact" className="hover:text-zinc-900">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Build Once. Verify Forever.
        </h1>
        <p className="mt-4 text-zinc-600 text-lg max-w-2xl">
          Veteran-built workshop of AI, CNC, and sovereign systems—rooted in Arkansas & Missouri.
        </p>
      </section>

      {/* KPI Cards */}
      <section className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4 px-4 pb-10">
        {stats.map((s) => (
          <div key={s.label} className="border rounded-xl p-4 text-center">
            <div className="text-xs text-zinc-500">{s.label}</div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.name} className="border rounded-xl p-4">
              <div className="flex justify-between">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-zinc-500">{p.progress}%</div>
              </div>
              <p className="text-sm text-zinc-600 mt-1">{p.detail}</p>
              <div className="mt-2 h-2 bg-zinc-100 rounded">
                <div
                  className="h-2 bg-zinc-900 rounded"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-600">
          <div>© {new Date().getFullYear()} Morris Lane LLC</div>
          <div className="flex gap-3">
            <span className="border rounded px-2 py-0.5">Veteran-Owned</span>
            <span className="border rounded px-2 py-0.5">Arkansas ▸ Missouri</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
