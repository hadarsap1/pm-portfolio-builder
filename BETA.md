# Beta launch checklist

What you actually need to do to get this in front of real users. Honest version: 80% of the work is shipped, 20% is operational glue.

---

## TL;DR — minimum viable beta

1. Push to GitHub (1 min)
2. Connect repo to Vercel (3 min)
3. Set 5 env vars in Vercel project settings (10 min)
4. Add a domain or use the auto-generated `*.vercel.app` URL
5. Send the link to 5 PM friends with a clear one-line ask

You can be live in under 30 minutes if you skip the optional polish below.

---

## 1. Required environment variables

Set these in **Vercel → Settings → Environment Variables**. Values come from `.env.example` — that file documents where to get each.

### Required for core features

| Variable | What it unlocks | Without it |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Absolute URLs in OG/Twitter cards, analytics beacon in exported HTML | OG cards say "localhost", analytics broken |
| `ANTHROPIC_API_KEY` | All AI features (bullet polish, summary gen, voice polish, JD tailor, cover letter, scorer, interview prep) | All `✦` buttons hide cleanly. Wizard still works. |
| `GEMINI_API_KEY` | "Make it bespoke" hero illustration + per-passion mood images | The bespoke panel shows but the button errors with "503 — requires GEMINI_API_KEY" |

### Required only if you enable deploy-from-the-app

| Variable | Source |
|---|---|
| `AUTH_GITHUB_ID` + `AUTH_GITHUB_SECRET` | https://github.com/settings/applications/new — set callback to `https://YOUR-DOMAIN/api/auth/callback` |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `VERCEL_TOKEN` | https://vercel.com/account/tokens |

If you skip these, the "Deploy to GitHub Pages" / "Deploy to Vercel" buttons in the header just don't work — the rest of the app is fine.

---

## 2. Known limitations that will bite at scale

These all work for ≤10 users on a single Vercel instance. Above that, address them:

### Public gallery resets on cold start
- **Where**: `lib/server/gallery-store.ts`
- **Why**: in-process `Map`, hung off `globalThis`. Survives Turbopack workers in dev but Vercel Lambda recycles every ~15 min of inactivity.
- **Fix when ready**: swap the three exported functions (`listGallery`, `upsertGalleryEntry`, `removeGalleryEntry`) to read/write Vercel KV. About 30 lines of code. Tutorial: https://vercel.com/docs/storage/vercel-kv/quickstart
- **For beta**: fine. Tell users "the gallery is ephemeral right now."

### Analytics events also reset on cold start
- **Where**: `lib/server/analytics-store.ts`
- Same pattern as gallery. Same fix.

### Rate limits are per-instance, not global
- **Where**: `lib/server/rate-limit.ts`
- 20/min per IP for `/api/ai`, 8/min for `/api/ai/bespoke`. Generous.
- **Fix when ready**: swap to Upstash Redis if/when you outgrow.

### localStorage cap can break for power users
- **Where**: bespoke imagery + project screenshots all base64 in localStorage
- 5MB on Safari, 10MB elsewhere. Hit by users with bespoke imagery + multiple project screenshots.
- **Mitigation already shipped**: store wraps `setItem` with a `QuotaExceededError` catch + `pm-portfolio:quota-exceeded` window event. Console-warns the user.
- **No further action needed for beta** — just be aware.

### Share URL has a practical ~16KB ceiling
- Some servers (Cloudflare, certain gateways) reject longer URLs.
- Bespoke imagery, avatar uploads, and project screenshots are stripped from the share payload (they live only in the user's local copy + exported HTML).
- A user with very long mission/manifesto/passion text could still push past 16KB. Untested edge case.

---

## 3. Pre-beta polish I'd do (1–2 hours)

Order by impact:

1. **Add a real favicon + apple-touch-icon** — `public/favicon.ico` is still the Next.js default. Replace with something branded. Easiest: take the landing-hero image, square it, run through realfavicongenerator.net.

2. **Set `metadataBase`** in `app/layout.tsx` — eliminates the build warning about OG image resolution falling back to localhost.

3. **Test on a real iPhone** — the mobile menu and wizard are responsive but I haven't driven them on actual hardware. 5 minutes via Safari → Develop → iPhone simulator at minimum.

4. **Add a privacy note on the landing page** — one line: "Your data stays in your browser unless you choose to share." Currently it's implicit; users will ask.

5. **Wire a simple feedback link** — a `mailto:` or Tally form in the footer. You want beta feedback in one place, not Slack DMs.

---

## 4. Recruitment script

What to send to your first 5 testers:

> Hey — I'm beta-testing a PM portfolio builder I've been working on. It's voice-first (your tagline + manifesto + what you actually care about) instead of "pour your CV in here." Takes ~10 min.
>
> One ask: when you're done, share the URL with me + tell me the moment that felt either magical or dumb. That's the feedback I need.
>
> Link: https://YOUR-VERCEL-URL/builder

Choose 5 PMs with **different superpowers** (one growth, one zero-to-one, one technical, one enterprise, one wild card). The 4 templates correspond to those — you'll learn which template/voice combinations land.

---

## 5. What to monitor in week one

- **`/api/ai` 429 rate** in Vercel logs → are users hitting the 20/min cap by accident?
- **`/api/ai/bespoke` error rate** → Gemini quota or content-policy refusals
- **Gallery POST 400 rate** → catching shareUrl validation failures (someone trying to deploy off-domain?)
- **`pm-portfolio:quota-exceeded` events** — there's no telemetry for this client-side. Add one in `lib/store/portfolio-store.ts` if you want to know it's happening.
- **Conversion**: of users who land on `/builder`, how many reach the completion screen? Add a simple Plausible / Vercel Analytics tag.

---

## 6. The 4 things I would NOT do before beta

- ❌ Build user accounts. The "your data lives in your browser" framing is honest and removes friction.
- ❌ Move the gallery to KV. The current ephemeral behavior is a feature — keeps the gallery tidy.
- ❌ Add payment / freemium gates. Beta is for learning, not monetizing.
- ❌ Polish the terminal theme further. Half your users won't pick it; ship it as-is.

---

## 7. If something breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| OG cards show "PM Portfolio" not the real name | `NEXT_PUBLIC_APP_URL` unset or `metadataBase` not configured | Set the env var; add `metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!)` to `app/layout.tsx`'s metadata export |
| All `✦` AI buttons missing | `ANTHROPIC_API_KEY` unset | Set in Vercel env, redeploy |
| "Make it bespoke" returns 503 | `GEMINI_API_KEY` unset | Set in Vercel env, redeploy |
| Gallery is empty after a few hours | Vercel cold start cleared the in-process map | Expected. Document or move to KV |
| Share link too long error | User has a lot of voice content | Truncate or move to a server-stored share scheme. Not blocking for beta. |
| Hydration mismatch warning in console | Likely Zustand persist hydrating after first paint | Already handled by `useHydrated` in components that read store. If it appears in a new component, wrap reads with the hook. |

---

## 8. Where to find help in the codebase

- **Adding a new section type**: pattern is in `lib/types/portfolio.ts` (type) → `lib/store/portfolio-store.ts` (CRUD + persist migration) → `components/portfolio/XSection.tsx` (render) → `components/wizard/steps/StepX.tsx` (input UI) → wire into `PreviewShell`, `ShareRenderer`, `lib/export/generate-html.ts`, `Step3Strategy` reorderer.
- **Adding a new AI operation**: extend the union in `app/api/ai/route.ts`, write a prompt builder, handle the request. Existing operations (polish-voice, generate-summary, score-portfolio) are the templates.
- **Tweaking motion**: all primitives in `components/portfolio/motion/`. Tune `Reveal` viewport amount + ease there. `Stagger` step timing controls all sequenced reveals.
- **Tweaking bespoke prompts**: `app/api/ai/bespoke/route.ts` has `buildHeroPrompt` + `buildPassionPrompt` + `STYLE_BASELINE`. The whole visual direction is configured there.

Good luck.
