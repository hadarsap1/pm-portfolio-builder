import Link from "next/link";
import Image from "next/image";
import React from "react";

export const metadata = {
  title: "PM Portfolio Builder — Ship your portfolio in minutes",
  description:
    "A guided wizard for Product Managers to build, preview, and deploy a polished portfolio site — no design skills required.",
};

const FEATURES = [
  {
    n: "01",
    title: "Guided 8-step wizard",
    body: "Walk through basics, experience, projects, impact metrics, and design. Each step updates the live preview.",
  },
  {
    n: "02",
    title: "AI content polish",
    body: "Paste your resume. Claude rewrites your bullets and writes a summary that doesn't sound like every other PM.",
  },
  {
    n: "03",
    title: "Three visual themes",
    body: "Minimal, Bold, Technical. One layout. One font style. Live preview. No infinite tweaking.",
  },
  {
    n: "04",
    title: "Impact metrics",
    body: "Revenue, users, retention. They render as stat cards and a bar chart, not just bullet points.",
  },
  {
    n: "05",
    title: "Export anywhere",
    body: "HTML, PDF, GitHub Pages, or Vercel. Your portfolio lives wherever you need it.",
  },
  {
    n: "06",
    title: "Auto-saved drafts",
    body: "LocalStorage persistence. Named snapshots. Nothing lost between sessions.",
  },
];

const STEPS = [
  { n: "01", label: "Tell us about you", detail: "Name, title, summary, contact links — the first of eight guided steps." },
  { n: "02", label: "Add your work", detail: "Roles, bullets, case studies, headline metrics, recommendations." },
  { n: "03", label: "Pick your style", detail: "Theme, layout, font, section order — the preview updates live." },
  { n: "04", label: "Export or deploy", detail: "HTML, PDF, GitHub Pages, or one-click Vercel." },
];

export default function Home(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ── Hero (amber) ── */}
      <section className="bg-primary text-primary-foreground">
        <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
          <span className="font-heading font-bold text-sm tracking-tight">PM Portfolio Builder</span>
          <div className="flex items-center gap-5">
            <Link
              href="/gallery"
              className="text-sm font-medium opacity-65 hover:opacity-100 transition-opacity"
            >
              Gallery
            </Link>
            <Link
              href="/builder"
              className="bg-primary-foreground text-primary px-4 py-1.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Start building →
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 pt-14 pb-20">
          <h1 className="font-heading text-[clamp(2.8rem,6.5vw,5rem)] font-extrabold leading-[0.93] tracking-tight max-w-4xl mb-8">
            Ship your portfolio<br />
            like you ship<br />
            a product.
          </h1>
          <p className="text-base opacity-72 max-w-lg mb-10 leading-relaxed">
            Guided wizard. AI-polished copy. Three visual themes. Exports to HTML, PDF, or GitHub Pages.
            No account, no designer.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/builder"
              className="bg-primary-foreground text-primary px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Build my portfolio →
            </Link>
            <Link
              href="/builder?demo=1"
              className="text-sm font-medium underline underline-offset-4 opacity-65 hover:opacity-100 transition-opacity"
            >
              Try the demo first
            </Link>
          </div>
          <p className="text-xs opacity-45 mt-5">
            No email. No account. Your data stays in your browser.
          </p>
        </div>
      </section>

      {/* ── Product preview ── */}
      <section className="bg-primary">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-t-lg border border-b-0 border-primary-foreground/10 bg-background overflow-hidden shadow-[0_-8px_40px_oklch(0_0_0/0.18)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-muted border-b border-border">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              <span className="ms-3 text-xs text-muted-foreground font-mono">
                pm-portfolio-builder.vercel.app/builder
              </span>
            </div>
            {/* Split pane */}
            <div className="flex divide-x divide-border">
              {/* Left: wizard panel */}
              <div className="w-[38%] p-7 bg-muted/25 space-y-4">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full"
                      style={{ background: i === 1 ? "var(--primary)" : "var(--border)" }}
                    />
                  ))}
                </div>
                <div className="h-3 w-28 rounded" style={{ background: "color-mix(in oklch, var(--primary) 25%, transparent)" }} />
                <div className="h-7 w-52 rounded" style={{ background: "color-mix(in oklch, var(--foreground) 10%, transparent)" }} />
                <div className="space-y-2 pt-1">
                  {[1, 0.8, 0.6].map((op, i) => (
                    <div
                      key={i}
                      className="h-3 rounded"
                      style={{
                        width: `${[100, 80, 62][i]}%`,
                        background: `color-mix(in oklch, var(--foreground) ${Math.round(op * 7)}%, transparent)`,
                      }}
                    />
                  ))}
                </div>
                <div className="pt-3">
                  <div className="h-8 w-36 rounded" style={{ background: "var(--primary)" }} />
                </div>
              </div>
              {/* Right: live preview */}
              <div className="w-[62%] p-9 bg-background">
                <Image
                  src="/landing-hero.png"
                  alt="PM portfolio preview — resume, metrics chart, and testimonials"
                  width={1408}
                  height={792}
                  priority
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-background border-t border-border py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-heading text-2xl font-bold mb-3 tracking-tight">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-muted-foreground text-sm mb-16 max-w-md">
            Six features. No fluff, no upsells, no account required until you're ready to deploy.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-16 gap-y-10">
            {FEATURES.map((f) => (
              <div key={f.n} className="flex gap-6">
                <span className="text-xs font-mono font-bold text-primary mt-0.5 w-6 shrink-0 tabular-nums">
                  {f.n}
                </span>
                <div>
                  <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-muted border-t border-border py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-heading text-2xl font-bold mb-16 tracking-tight">How it works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div
                  className="font-heading text-5xl font-extrabold mb-4 leading-none"
                  style={{ color: "color-mix(in oklch, var(--primary) 40%, transparent)" }}
                >
                  {s.n}
                </div>
                <h3 className="font-semibold text-sm mb-2">{s.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA (amber) ── */}
      <section className="bg-primary text-primary-foreground border-t border-primary-foreground/10 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-heading text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight max-w-xl mb-5 tracking-tight">
            Your work is good.<br />
            Your portfolio should match.
          </h2>
          <p className="opacity-65 text-sm mb-10 max-w-xs leading-relaxed">
            30 minutes. Guided. Opinionated. Done.
          </p>
          <Link
            href="/builder"
            className="inline-block bg-primary-foreground text-primary px-8 py-3.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Build my portfolio →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>PM Portfolio Builder · Built with Next.js, Claude AI, and Tailwind</p>
          <p>
            Your data stays in your browser.{" "}
            <a
              href="mailto:hadarsap@gmail.com?subject=PM Portfolio Builder feedback"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Send feedback
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
