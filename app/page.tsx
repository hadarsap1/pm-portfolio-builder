import Link from "next/link";
import React from "react";

export const metadata = {
  title: "PM Portfolio Builder — Ship your portfolio in minutes",
  description:
    "A guided wizard for Product Managers to build, preview, and deploy a polished portfolio site — no design skills required.",
};

const FEATURES = [
  {
    icon: "⚡",
    title: "Guided 8-step wizard",
    body: "Walk through basics, experience, projects, education, skills, recommendations, strategy, and design. Every field updates your live preview instantly.",
  },
  {
    icon: "✦",
    title: "AI-powered content",
    body: "Paste your resume or job description — Claude rewrites your bullets and generates a punchy summary in seconds.",
  },
  {
    icon: "🎨",
    title: "Three visual themes",
    body: "Minimal, Bold, or Technical. Pick a layout (one or two column) and a font style. The preview updates live.",
  },
  {
    icon: "📊",
    title: "Impact dashboard",
    body: "Add headline metrics — revenue driven, users shipped, retention lifted. They render as stat cards and a bar chart.",
  },
  {
    icon: "📥",
    title: "Export anywhere",
    body: "Download a self-contained HTML file, generate a PDF via browser print, or deploy directly to GitHub Pages.",
  },
  {
    icon: "💾",
    title: "Auto-saved versions",
    body: "Your work persists in localStorage. Save named snapshots and switch between versions without losing anything.",
  },
];

const STEPS = [
  { n: "01", label: "Fill in your info", detail: "Name, title, summary, links — takes 3 minutes." },
  { n: "02", label: "Add your experience", detail: "Roles, companies, bullet points, and per-role metrics." },
  { n: "03", label: "Pick your style", detail: "Theme, layout, font — live preview updates as you click." },
  { n: "04", label: "Export or deploy", detail: "HTML file, PDF, or one-click GitHub Pages." },
];

export default function Home(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 max-w-6xl mx-auto">
        <span className="font-bold text-sm tracking-tight">PM Portfolio Builder</span>
        <div className="flex items-center gap-3">
          <Link
            href="/gallery"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="/builder"
            className="rounded-md bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Start building →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-4">
          For Product Managers
        </p>
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-5">
          Your portfolio,<br />
          <span className="text-zinc-400">shipped in minutes.</span>
        </h1>
        <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-8">
          A guided wizard that turns your experience into a polished PM portfolio —
          with AI suggestions, live preview, and one-click deployment.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/builder"
            className="rounded-md bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
          >
            Build my portfolio →
          </Link>
          <Link
            href="/builder?demo=1"
            className="rounded-md border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Try the demo →
          </Link>
        </div>
        <p className="text-xs text-zinc-400 mt-4">
          The demo loads a fully filled-out portfolio so you can poke around before signing up — no email required.
        </p>
      </section>

      {/* Preview strip */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-200">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            <span className="ms-2 text-xs text-zinc-400">PM Portfolio Builder — Split-screen editor</span>
          </div>
          <div className="flex divide-x divide-zinc-200 min-h-[200px]">
            <div className="w-[42%] p-6 space-y-3">
              <div className="h-3 w-24 bg-zinc-200 rounded animate-pulse" />
              <div className="h-8 w-48 bg-zinc-200 rounded animate-pulse" />
              <div className="h-3 w-full bg-zinc-100 rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-zinc-100 rounded animate-pulse" />
              <div className="h-3 w-3/5 bg-zinc-100 rounded animate-pulse" />
            </div>
            <div className="w-[58%] p-6 bg-white space-y-4">
              <div className="h-5 w-32 bg-zinc-900 rounded animate-pulse" />
              <div className="h-3 w-24 bg-zinc-200 rounded animate-pulse" />
              <div className="flex gap-2 mt-2">
                {[40, 32, 56].map((w) => (
                  <div key={w} className="h-8 rounded bg-zinc-100 animate-pulse" style={{ width: `${w}px` }} />
                ))}
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full bg-zinc-100 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-zinc-100 rounded animate-pulse" />
                <div className="h-3 w-4/6 bg-zinc-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-xl font-bold text-center mb-10">Everything you need, nothing you don't</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-zinc-100 p-5 hover:border-zinc-300 transition-colors">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-zinc-50 border-t border-zinc-100 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-xl font-bold text-center mb-12">How it works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="text-3xl font-extrabold text-zinc-200 mb-2">{s.n}</div>
                <h3 className="font-semibold text-sm mb-1">{s.label}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-extrabold mb-4">Ready to stand out?</h2>
        <p className="text-zinc-500 mb-8 text-sm">
          No account required. Your data stays in your browser until you choose to deploy.
        </p>
        <Link
          href="/builder"
          className="inline-block rounded-md bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
        >
          Build my portfolio — it's free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8 text-center text-xs text-zinc-400">
        <p>PM Portfolio Builder · Built with Next.js, Claude AI, and Tailwind</p>
      </footer>
    </main>
  );
}
