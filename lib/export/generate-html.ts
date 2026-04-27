import type { PortfolioData, DesignPreferences, StrategicFocus, SectionKey } from "@/lib/types/portfolio";

const DEFAULT_SECTION_ORDER: SectionKey[] = [
  "mission", "manifesto", "now",
  "metrics", "experience", "projects", "recommendations", "education", "skills",
  "passions",
];

// ── Accent colours ────────────────────────────────────────────────
interface ColorConfig {
  primary: string;
  light: string;
  badge: string;
  badgeText: string;
}

const COLORS: Record<string, ColorConfig> = {
  minimal: { primary: "#334155", light: "#f1f5f9", badge: "#e2e8f0", badgeText: "#334155" },
  bold: { primary: "#7c3aed", light: "#f5f3ff", badge: "#ede9fe", badgeText: "#5b21b6" },
  technical: { primary: "#059669", light: "#ecfdf5", badge: "#d1fae5", badgeText: "#065f46" },
};

function getColorConfig(design: DesignPreferences): ColorConfig {
  const base = COLORS[design.colorTheme] ?? COLORS["minimal"]!;
  return design.customAccentColor ? { ...base, primary: design.customAccentColor } : base;
}

// ── Safety ────────────────────────────────────────────────────────
function esc(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Section helpers ───────────────────────────────────────────────
function sectionHeading(text: string, color: string): string {
  return `<h2 style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${color};margin:0 0 12px">${esc(text)}</h2>`;
}

function badge(text: string, bg: string, fg: string): string {
  return `<span style="display:inline-block;background:${bg};color:${fg};border-radius:999px;padding:2px 10px;font-size:11px;font-weight:500;margin:2px">${esc(text)}</span>`;
}

// ── Sections ─────────────────────────────────────────────────────
function renderMetrics(
  portfolio: PortfolioData,
  c: ColorConfig
): string {
  if (!portfolio.globalMetrics.length) return "";
  const cards = portfolio.globalMetrics
    .map(
      (m) => `
      <div style="border:1px solid #e4e4e7;border-radius:12px;padding:16px;background:#fff;flex:1;min-width:120px">
        <div style="font-size:24px;font-weight:700;color:${c.primary};font-variant-numeric:tabular-nums">${esc(m.value || "—")}</div>
        <div style="font-size:11px;font-weight:500;color:#52525b;margin-top:2px">${esc(m.label || "")}</div>
        ${m.context ? `<div style="font-size:10px;color:#a1a1aa;margin-top:2px">${esc(m.context)}</div>` : ""}
      </div>`
    )
    .join("");
  return `<div style="display:flex;gap:12px;flex-wrap:wrap">${cards}</div>`;
}

function renderExperience(
  portfolio: PortfolioData,
  c: ColorConfig
): string {
  if (!portfolio.experience.length) return "";
  const items = portfolio.experience
    .map(
      (item, i) => `
      <div style="position:relative;padding-left:20px;${i < portfolio.experience.length - 1 ? "margin-bottom:28px" : ""}">
        <div style="position:absolute;left:0;top:6px;width:8px;height:8px;border-radius:50%;border:2px solid ${c.primary};background:#fff"></div>
        ${i < portfolio.experience.length - 1 ? `<div style="position:absolute;left:3px;top:14px;bottom:-28px;width:1px;background:#e4e4e7"></div>` : ""}
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
          <div>
            <div style="font-weight:600;color:#18181b;font-size:14px">${esc(item.role || "Role")}</div>
            <div style="font-size:12px;color:${c.primary};font-weight:500;margin-top:2px">${esc(item.company || "Company")}</div>
          </div>
          <div style="font-size:11px;color:#a1a1aa;white-space:nowrap;padding-top:2px">${esc([item.startDate, item.endDate].filter(Boolean).join(" — ") || "")}</div>
        </div>
        ${
          item.bullets.length
            ? `<ul style="margin:8px 0 0 0;padding:0;list-style:none">
            ${item.bullets
              .map(
                (b) =>
                  `<li style="font-size:12px;color:#52525b;line-height:1.6;display:flex;gap:8px;margin-bottom:4px">
                    <span style="color:${c.primary};margin-top:6px;flex-shrink:0">&#9679;</span>${esc(b)}
                  </li>`
              )
              .join("")}
          </ul>`
            : ""
        }
        ${
          item.metrics.length
            ? `<div style="margin-top:10px">${item.metrics.map((m) => badge(`${m.value} ${m.label}`, c.badge, c.badgeText)).join(" ")}</div>`
            : ""
        }
      </div>`
    )
    .join("");
  return items;
}

function renderSkills(
  portfolio: PortfolioData,
  c: ColorConfig
): string {
  if (!portfolio.skills.length) return "";
  return portfolio.skills
    .map(
      (cat) => `
      <div style="margin-bottom:12px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#a1a1aa;margin-bottom:6px">${esc(cat.label)}</div>
        <div>${cat.items.map((item) => badge(item, c.badge, c.badgeText)).join(" ")}</div>
      </div>`
    )
    .join("");
}

function renderProjects(
  portfolio: PortfolioData,
  c: ColorConfig
): string {
  if (!portfolio.projects?.length) return "";
  return portfolio.projects
    .map(
      (p) => `
      <div style="border:1px solid #e4e4e7;border-radius:12px;padding:20px;margin-bottom:16px;background:#fff">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px">
          <div>
            <div style="font-weight:600;color:#18181b;font-size:14px">${esc(p.title || "Project")}</div>
            <div style="font-size:12px;color:${c.primary};font-weight:500;margin-top:2px">${esc([p.company, p.duration].filter(Boolean).join(" · "))}</div>
          </div>
          ${p.link ? `<a href="${esc(p.link)}" style="font-size:11px;color:#a1a1aa;text-decoration:none;white-space:nowrap" target="_blank">Link ↗</a>` : ""}
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:${p.tags.length ? "14px" : "0"}">
          ${[
            { label: "Problem", text: p.problem },
            { label: "Solution", text: p.solution },
            { label: "Outcome", text: p.outcome },
          ]
            .filter((s) => s.text)
            .map(
              (s) => `
              <div>
                <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#a1a1aa;margin-bottom:4px">${esc(s.label)}</div>
                <div style="font-size:12px;color:#52525b;line-height:1.6">${esc(s.text)}</div>
              </div>`
            )
            .join("")}
        </div>
        ${p.tags.length ? `<div style="margin-top:14px">${p.tags.map((t) => badge(t, c.badge, c.badgeText)).join(" ")}</div>` : ""}
      </div>`
    )
    .join("");
}

// ── CSS ───────────────────────────────────────────────────────────
function buildCSS(): string {
  return `
    *,*::before,*::after{box-sizing:border-box}
    html{font-size:16px}
    body{margin:0;font-family:system-ui,-apple-system,sans-serif;color:#18181b;background:#fff;line-height:1.5;-webkit-font-smoothing:antialiased}
    @media print{body{background:#fff}.no-print{display:none}}
    @media(max-width:640px){.two-col{display:block!important}.sidebar{width:100%!important;border-right:none!important;border-bottom:1px solid #e4e4e7!important}}
  `.trim();
}

function renderEducation(
  portfolio: PortfolioData,
  c: ColorConfig
): string {
  const hasEdu = portfolio.education.length > 0;
  const hasCerts = portfolio.certifications?.length ?? 0 > 0;
  if (!hasEdu && !hasCerts) return "";

  const degrees = portfolio.education
    .map(
      (item) => `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:12px">
        <div>
          <div style="font-weight:600;color:#18181b;font-size:14px">${esc(
            item.degree && item.field ? `${item.degree}, ${item.field}` : item.degree || item.field || "Degree"
          )}</div>
          <div style="font-size:12px;color:${c.primary};font-weight:500;margin-top:2px">${esc(item.institution || "Institution")}</div>
        </div>
        ${item.year ? `<div style="font-size:11px;color:#a1a1aa;white-space:nowrap">${esc(item.year)}</div>` : ""}
      </div>`
    )
    .join("");

  const certs = (portfolio.certifications ?? [])
    .map(
      (cert) => `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:10px">
        <div>
          <div style="font-weight:600;color:#18181b;font-size:13px">${esc(cert.name || "Certification")}</div>
          <div style="font-size:12px;color:${c.primary};font-weight:500;margin-top:2px">${esc(cert.issuer || "")}${cert.credentialId ? esc(` · ${cert.credentialId}`) : ""}</div>
        </div>
        ${cert.year ? `<div style="font-size:11px;color:#a1a1aa;white-space:nowrap">${esc(cert.year)}</div>` : ""}
      </div>`
    )
    .join("");

  const certBlock = certs
    ? `<div style="margin-top:${hasEdu ? "16px" : "0"}">
        ${hasEdu ? `<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#a1a1aa;margin-bottom:8px">Certifications</div>` : ""}
        ${certs}
       </div>`
    : "";

  return degrees + certBlock;
}

function renderMission(portfolio: PortfolioData, c: ColorConfig): string {
  const m = portfolio.mission;
  if (!m || (!m.title && !m.body)) return "";
  const paragraphs = m.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 8px;font-size:14px;color:#52525b;line-height:1.65">${esc(p)}</p>`)
    .join("");
  const image = m.imageUrl
    ? `<img src="${esc(m.imageUrl)}" alt="" style="height:96px;width:96px;border-radius:8px;object-fit:cover;border:1px solid #e4e4e7;margin-right:20px;float:left" />`
    : "";
  const link = m.link
    ? `<a href="${esc(m.link)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:${c.primary};text-decoration:none;font-weight:500">Learn more ↗</a>`
    : "";
  return `
    <div style="overflow:hidden">
      ${image}
      ${m.title ? `<h3 style="margin:0 0 8px;font-size:15px;font-weight:600;color:#18181b">${esc(m.title)}</h3>` : ""}
      ${paragraphs}
      ${link}
    </div>`;
}

function renderManifesto(portfolio: PortfolioData, c: ColorConfig): string {
  const items = portfolio.manifesto ?? [];
  if (items.length === 0) return "";
  return `<ol style="margin:0;padding:0;list-style:none">${items
    .map(
      (item, i) => `
      <li style="display:flex;gap:16px;align-items:flex-start;margin-bottom:12px">
        <span style="font-size:24px;font-weight:700;color:${c.primary};line-height:1;font-variant-numeric:tabular-nums;width:32px;flex-shrink:0">${String(i + 1).padStart(2, "0")}</span>
        <div style="flex:1;min-width:0">
          <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#18181b;line-height:1.4">${esc(item.statement || "Untitled belief")}</p>
          ${item.detail ? `<p style="margin:0;font-size:12px;color:#71717a;line-height:1.5">${esc(item.detail)}</p>` : ""}
        </div>
      </li>`
    )
    .join("")}</ol>`;
}

function renderNow(portfolio: PortfolioData, c: ColorConfig): string {
  const items = portfolio.now ?? [];
  if (items.length === 0) return "";
  return items
    .map(
      (item) => `
      <div style="display:flex;gap:12px;align-items:baseline;margin-bottom:10px">
        <span style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:${c.primary};width:128px;flex-shrink:0">${esc(item.label || "Now")}</span>
        <p style="margin:0;font-size:14px;color:#3f3f46;flex:1;line-height:1.5">${esc(item.content)}</p>
      </div>`
    )
    .join("");
}

function renderPassions(portfolio: PortfolioData, c: ColorConfig): string {
  const items = portfolio.passions ?? [];
  if (items.length === 0) return "";
  return items
    .map((p) => {
      const paragraphs = (p.body || "")
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((para) => `<p style="margin:0 0 8px;font-size:14px;color:#52525b;line-height:1.6">${esc(para)}</p>`)
        .join("");
      const image = p.imageUrl
        ? `<img src="${esc(p.imageUrl)}" alt="" style="height:96px;width:96px;border-radius:8px;object-fit:cover;border:1px solid #e4e4e7;float:left;margin-right:16px" />`
        : "";
      const highlights = p.highlights.length
        ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${p.highlights
            .map(
              (h) =>
                `<span style="display:inline-block;border:1px solid #e4e4e7;background:#fafafa;border-radius:999px;padding:2px 10px;font-size:12px;color:#52525b">${esc(h)}</span>`
            )
            .join("")}</div>`
        : "";
      const link = p.link
        ? `<div style="margin-top:8px"><a href="${esc(p.link)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;font-weight:500;color:${c.primary};text-decoration:none">More ↗</a></div>`
        : "";
      return `
        <div style="margin-bottom:24px;overflow:hidden">
          ${image}
          <h3 style="margin:0 0 8px;font-size:15px;font-weight:600;color:#18181b">${esc(p.title || "Untitled")}</h3>
          ${paragraphs}
          ${highlights}
          ${link}
        </div>`;
    })
    .join("");
}

function renderRecommendations(
  portfolio: PortfolioData,
  c: ColorConfig
): string {
  const recs = portfolio.recommendations ?? [];
  if (recs.length === 0) return "";

  return recs
    .map((rec) => {
      const attribution = [rec.role, rec.company].filter(Boolean).join(", ");
      const linkedinAnchor = rec.linkedin
        ? `<a href="${esc(rec.linkedin)}" target="_blank" rel="noopener noreferrer" style="font-size:10px;color:#a1a1aa;text-decoration:none">LinkedIn ↗</a>`
        : "";
      return `
        <figure style="margin:0 0 16px;padding:14px 16px;border:1px solid #e4e4e7;background:#fafafa;border-radius:12px">
          <blockquote style="margin:0;font-size:13px;line-height:1.6;color:#3f3f46">
            <span style="color:#d4d4d8">“</span>${esc(rec.quote || "Quote pending")}<span style="color:#d4d4d8">”</span>
          </blockquote>
          <figcaption style="margin-top:10px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
            <div>
              <div style="font-size:12px;font-weight:600;color:#18181b">${esc(rec.name || "Recommender")}</div>
              ${attribution ? `<div style="font-size:11px;color:${c.primary};margin-top:2px">${esc(attribution)}</div>` : ""}
              ${rec.relationship ? `<div style="font-size:11px;color:#a1a1aa;margin-top:2px">${esc(rec.relationship)}</div>` : ""}
            </div>
            ${linkedinAnchor}
          </figcaption>
        </figure>`;
    })
    .join("");
}

// ── Main export ───────────────────────────────────────────────────
export function generatePortfolioHTML(
  portfolio: PortfolioData,
  design: DesignPreferences,
  strategy: StrategicFocus
): string {
  const c = getColorConfig(design);
  const { basicInfo } = portfolio;
  const sectionOrder = strategy.sectionOrder ?? DEFAULT_SECTION_ORDER;

  const showAll = strategy.emphasizedSections.length === 0;
  const show = (s: string) => showAll || strategy.emphasizedSections.includes(s as never);

  const contactItems = [
    basicInfo.email,
    basicInfo.location,
    basicInfo.linkedin,
    basicInfo.github,
  ].filter(Boolean);

  const contactHtml = contactItems.length
    ? `<div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:16px">
        ${contactItems.map((i) => `<span style="font-size:12px;color:#71717a">${esc(i as string)}</span>`).join("")}
      </div>`
    : "";

  const section = (heading: string, content: string) =>
    content.trim()
      ? `<section style="margin-bottom:36px">
          ${sectionHeading(heading, c.primary)}
          ${content}
         </section>`
      : "";

  // ── One-column ──────────────────────────────────────────────────
  if (design.layoutStyle === "one-column") {
    const body = `
      <div style="max-width:720px;margin:0 auto;padding:48px 32px">

        <!-- Hero -->
        <div style="border-bottom:1px solid #e4e4e7;padding-bottom:28px;margin-bottom:36px">
          ${basicInfo.avatarUrl ? `<img src="${esc(basicInfo.avatarUrl)}" alt="${esc(basicInfo.name || "")}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;margin-bottom:16px;border:2px solid #e4e4e7" />` : ""}
          <h1 style="font-size:32px;font-weight:700;letter-spacing:-.02em;color:${c.primary};margin:0">${esc(basicInfo.name || "Your Name")}</h1>
          <p style="font-size:16px;color:#71717a;font-weight:500;margin:4px 0 0">${esc(basicInfo.title || "")}</p>
          ${basicInfo.tagline ? `<p style="margin:12px 0 0;font-size:20px;font-weight:600;color:#18181b;line-height:1.35">${esc(basicInfo.tagline)}</p>` : ""}
          ${contactHtml}
          ${basicInfo.summary ? `<p style="margin-top:16px;font-size:14px;color:#52525b;line-height:1.7">${esc(basicInfo.summary)}</p>` : ""}
        </div>

        ${sectionOrder.map((key) => {
          if (key === "metrics") return show("metrics") ? section("By the Numbers", renderMetrics(portfolio, c)) : "";
          if (key === "experience") return show("experience") ? section("Experience", renderExperience(portfolio, c)) : "";
          if (key === "projects") return show("projects") ? section("Projects", renderProjects(portfolio, c)) : "";
          if (key === "education") return show("education") ? section("Education & Certifications", renderEducation(portfolio, c)) : "";
          if (key === "skills") return show("skills") ? section("Skills", renderSkills(portfolio, c)) : "";
          if (key === "recommendations") return show("recommendations") ? section("Recommendations", renderRecommendations(portfolio, c)) : "";
          if (key === "mission") return show("mission") ? section("What I care about", renderMission(portfolio, c)) : "";
          if (key === "manifesto") return show("manifesto") ? section("Manifesto", renderManifesto(portfolio, c)) : "";
          if (key === "now") return show("now") ? section("Now", renderNow(portfolio, c)) : "";
          if (key === "passions") return show("passions") ? section("What I do for love", renderPassions(portfolio, c)) : "";
          return "";
        }).join("")}
      </div>`;

    return buildDocument(basicInfo.name, body, undefined, basicInfo.summary || undefined, portfolio.portfolioId);
  }

  // ── Two-column ──────────────────────────────────────────────────
  const sidebar = `
    <aside class="sidebar" style="width:34%;flex-shrink:0;border-right:1px solid #e4e4e7;padding:40px 28px;background:#fafafa">
      ${basicInfo.avatarUrl ? `<img src="${esc(basicInfo.avatarUrl)}" alt="${esc(basicInfo.name || "")}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;margin-bottom:16px;border:2px solid #e4e4e7" />` : ""}
      <h1 style="font-size:22px;font-weight:700;letter-spacing:-.02em;color:${c.primary};margin:0">${esc(basicInfo.name || "Your Name")}</h1>
      <p style="font-size:13px;color:#71717a;font-weight:500;margin:4px 0 0">${esc(basicInfo.title || "")}</p>
      ${basicInfo.tagline ? `<p style="margin:10px 0 0;font-size:15px;font-weight:600;color:#18181b;line-height:1.4">${esc(basicInfo.tagline)}</p>` : ""}
      ${contactHtml}

      ${
        basicInfo.summary
          ? `<div style="margin-top:28px">
              ${sectionHeading("About", c.primary)}
              <p style="font-size:12px;color:#52525b;line-height:1.7;margin:0">${esc(basicInfo.summary)}</p>
             </div>`
          : ""
      }

      ${show("skills") && portfolio.skills.length ? `<div style="margin-top:28px">${sectionHeading("Skills", c.primary)}${renderSkills(portfolio, c)}</div>` : ""}
    </aside>`;

  const main = `
    <main style="flex:1;padding:40px 36px;overflow:hidden">
      ${show("metrics") && portfolio.globalMetrics.length ? section("Impact", renderMetrics(portfolio, c)) : ""}
      ${show("experience") && portfolio.experience.length ? section("Experience", renderExperience(portfolio, c)) : ""}
      ${show("manifesto") && portfolio.manifesto?.length ? section("Manifesto", renderManifesto(portfolio, c)) : ""}
      ${show("mission") && portfolio.mission && (portfolio.mission.title || portfolio.mission.body) ? section("What I care about", renderMission(portfolio, c)) : ""}
      ${show("now") && portfolio.now?.length ? section("Now", renderNow(portfolio, c)) : ""}
      ${show("projects") && portfolio.projects?.length ? section("Projects", renderProjects(portfolio, c)) : ""}
      ${show("recommendations") && portfolio.recommendations?.length ? section("Recommendations", renderRecommendations(portfolio, c)) : ""}
      ${show("education") && (portfolio.education.length || portfolio.certifications?.length) ? section("Education & Certifications", renderEducation(portfolio, c)) : ""}
      ${show("passions") && portfolio.passions?.length ? section("What I do for love", renderPassions(portfolio, c)) : ""}
    </main>`;

  const body = `<div class="two-col" style="display:flex;min-height:100vh">${sidebar}${main}</div>`;
  return buildDocument(basicInfo.name, body, undefined, basicInfo.summary || undefined, portfolio.portfolioId);
}

function buildDocument(name: string, body: string, title?: string, description?: string, portfolioId?: string): string {
  const pageTitle = esc(name || "PM Portfolio");
  const ogTitle = esc(title ?? (name ? `${name} — PM Portfolio` : "PM Portfolio"));
  const ogDesc = esc(description ?? "Product Manager portfolio built with PM Portfolio Builder.");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const analyticsScript = portfolioId && appUrl
    ? `<script>
(function(){
  var id="${esc(portfolioId)}";
  var url="${esc(appUrl)}/api/analytics/event";
  try{
    var data=JSON.stringify({id:id,referrer:document.referrer,ua:navigator.userAgent});
    if(navigator.sendBeacon){navigator.sendBeacon(url,new Blob([data],{type:"application/json"}))}
    else{fetch(url,{method:"POST",body:data,headers:{"Content-Type":"application/json"},keepalive:true}).catch(function(){})}
  }catch(e){}
})();
</script>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="${ogDesc}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${ogDesc}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${ogDesc}" />
  <style>${buildCSS()}</style>
</head>
<body>
${body}
${analyticsScript}
</body>
</html>`;
}
