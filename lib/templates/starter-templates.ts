import type {
  PortfolioData,
  DesignPreferences,
  StrategicFocus,
} from "@/lib/types/portfolio";

export interface StarterTemplate {
  id: string;
  name: string;
  tagline: string;
  description: string;
  portfolio: Omit<PortfolioData, "portfolioId">;
  design: DesignPreferences;
  strategy: StrategicFocus;
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "growth-pm",
    name: "Growth PM",
    tagline: "Scale what works",
    description: "Metrics-heavy, A/B testing, retention & activation funnels. Perfect for consumer or PLG companies.",
    design: {
      colorTheme: "bold",
      layoutStyle: "two-column",
      fontStyle: "modern",
    },
    strategy: {
      superpower: "growth",
      emphasizedSections: ["metrics", "experience"],
      toneKeywords: ["data-driven", "growth-focused", "experimentation", "cross-functional"],
      sectionOrder: ["metrics", "experience", "projects", "skills", "education"],
    },
    portfolio: {
      basicInfo: {
        name: "",
        title: "Senior Product Manager, Growth",
        email: "",
        linkedin: "",
        github: "",
        location: "",
        summary:
          "Growth-focused PM with a track record of driving measurable improvements across activation, retention, and revenue. Expert at designing and running A/B experiments, reading funnels, and shipping fast.",
      },
      globalMetrics: [
        { id: "m1", label: "Revenue Impact", value: "$4.2M", context: "Incremental ARR, FY2024" },
        { id: "m2", label: "Retention Lift", value: "+18%", context: "D30 retention, post-onboarding redesign" },
        { id: "m3", label: "Experiments Run", value: "47", context: "In the last 12 months" },
        { id: "m4", label: "Activation Rate", value: "68%", context: "Up from 41% at start of role" },
      ],
      experience: [
        {
          id: "e1",
          company: "Example Co",
          role: "Senior PM, Growth",
          startDate: "Jan 2022",
          endDate: "Present",
          bullets: [
            "Redesigned onboarding flow, increasing D7 retention by 18% and activation by 27 percentage points",
            "Led cross-functional squad of 6 to ship referral program that drove $1.2M in incremental ARR",
            "Built experimentation framework now used by 3 product teams, running 47 A/B tests per year",
            "Reduced churn by 12% by identifying top 3 early-warning signals and launching proactive nudges",
          ],
          metrics: [
            { id: "em1", label: "D7 Retention", value: "+18%" },
            { id: "em2", label: "Activation", value: "+27pp" },
          ],
        },
        {
          id: "e2",
          company: "Previous Corp",
          role: "Product Manager",
          startDate: "Jun 2020",
          endDate: "Dec 2021",
          bullets: [
            "Owned checkout funnel; reduced cart abandonment by 15% through progressive disclosure redesign",
            "Partnered with data science to build real-time propensity model driving personalised upsells",
            "Shipped weekly email digest feature that increased MAU engagement by 9%",
          ],
          metrics: [
            { id: "em3", label: "Cart Abandonment", value: "-15%" },
          ],
        },
      ],
      projects: [
        {
          id: "p1",
          title: "Onboarding Funnel Overhaul",
          company: "Example Co",
          duration: "Q1–Q2 2023",
          problem: "New users churned within 3 days due to a confusing 12-step onboarding with no personalisation.",
          solution: "Led discovery with 30 user interviews, redesigned to a 4-step adaptive flow, and ran 6 A/B tests to optimise each step.",
          outcome: "Activation rate rose from 41% to 68%, D30 retention improved 18%, and support tickets dropped 22%.",
          link: "",
          tags: ["Onboarding", "A/B Testing", "Retention", "User Research"],
        },
      ],
      education: [
        {
          id: "ed1",
          institution: "Your University",
          degree: "B.Sc.",
          field: "Statistics / Computer Science",
          year: "2020",
        },
      ],
      certifications: [],
      recommendations: [
        {
          id: "r1",
          name: "Jamie Chen",
          role: "VP of Product",
          company: "Example Co",
          relationship: "Manager, 2022–present",
          quote: "One of the few PMs I've worked with who can hold both the experiment-velocity bar and the strategic narrative at the same time. They moved our retention numbers more in 12 months than the prior team did in three years.",
        },
        {
          id: "r2",
          name: "Priya Patel",
          role: "Staff Engineer",
          company: "Example Co",
          relationship: "Tech lead, growth squad",
          quote: "Specs are tight, hypotheses are explicit, and they actually look at the data after launch. Best PM partnership I've had.",
        },
      ],
      skills: [
        { id: "s1", label: "Growth & Analytics", items: ["A/B Testing", "Funnel Analysis", "Cohort Analysis", "SQL", "Amplitude", "Mixpanel"] },
        { id: "s2", label: "Product", items: ["Roadmapping", "Prioritisation", "User Research", "PRDs"] },
        { id: "s3", label: "Tools", items: ["Figma", "Jira", "dbt", "Looker"] },
      ],
      mission: {
        title: "Compounding small wins",
        body: "I run experimentation programs because I believe most growth comes from a long sequence of disciplined small bets — not one heroic launch. The PMs and engineers I work with should leave knowing how to read a funnel, design a clean test, and write a sharp post-mortem.",
        link: "",
      },
      manifesto: [
        { id: "mf1", statement: "Customer pain beats roadmap commitment.", detail: "If the data says we're wrong, we're wrong — even mid-quarter." },
        { id: "mf2", statement: "Ship the smallest version that proves the hypothesis.", detail: "Then keep going only if the metric moves." },
        { id: "mf3", statement: "Velocity is a feature, not a goal.", detail: "Speed without learning is just churn." },
      ],
      now: [
        { id: "n1", label: "Currently focused on", content: "Building a north-star metric framework for our self-serve funnel." },
        { id: "n2", label: "Reading", content: "\"Working in Public\" — Nadia Eghbal." },
      ],
      passions: [
        {
          id: "ps1",
          title: "Trail running",
          body: "Most of my best product ideas show up between mile six and mile ten. I run twice a week with a small group, race once a year, and journal every long run.",
          highlights: ["Tel Aviv half-marathon 2024", "Pacific Crest 50K 2023"],
        },
      ],
    },
  },
  {
    id: "zero-to-one",
    name: "Zero-to-One",
    tagline: "Build from blank",
    description: "Founder-mode PM who ships 0→1 products. Case-study driven, strong on discovery and first principles.",
    design: {
      colorTheme: "minimal",
      layoutStyle: "one-column",
      fontStyle: "modern",
    },
    strategy: {
      superpower: "zero-to-one",
      emphasizedSections: ["projects", "experience"],
      toneKeywords: ["builder", "first-principles", "shipped", "founder-mode"],
      sectionOrder: ["experience", "projects", "metrics", "skills", "education"],
    },
    portfolio: {
      basicInfo: {
        name: "",
        title: "Product Manager — 0→1 Builder",
        email: "",
        linkedin: "",
        github: "",
        location: "",
        summary:
          "Product builder with a bias for action. Shipped 3 products from zero users to first paying customers. Comfortable operating in ambiguity, running lean discovery, and making high-conviction bets.",
      },
      globalMetrics: [
        { id: "m1", label: "Products Launched", value: "3", context: "0 → 1, end-to-end ownership" },
        { id: "m2", label: "Time to First Revenue", value: "6 wks", context: "Average across new product launches" },
        { id: "m3", label: "Customer Interviews", value: "200+", context: "Conducted in last 2 years" },
      ],
      experience: [
        {
          id: "e1",
          company: "Startup Co",
          role: "Lead Product Manager",
          startDate: "Mar 2022",
          endDate: "Present",
          bullets: [
            "Founded and shipped core product from idea to 500 paying customers in 9 months",
            "Ran 200+ customer interviews to identify the ICP and define the initial MVP scope",
            "Designed and built V1 pricing model that achieved 22% month-on-month revenue growth",
            "Hired and led a 4-person cross-functional pod through two major pivots",
          ],
          metrics: [
            { id: "em1", label: "Paying Customers", value: "500" },
            { id: "em2", label: "MoM Revenue", value: "+22%" },
          ],
        },
        {
          id: "e2",
          company: "Scale-up Inc",
          role: "Product Manager",
          startDate: "Jan 2020",
          endDate: "Feb 2022",
          bullets: [
            "Owned new market expansion; launched product in 2 new verticals contributing 30% of ARR",
            "Built self-serve onboarding reducing sales-assisted time-to-value from 6 weeks to 5 days",
            "Defined roadmap and led engineering team through 3 major milestones on time and in scope",
          ],
          metrics: [
            { id: "em3", label: "New Vertical ARR", value: "30%" },
          ],
        },
      ],
      projects: [
        {
          id: "p1",
          title: "Self-Serve API Marketplace",
          company: "Startup Co",
          duration: "Q3 2023",
          problem: "Developers were waiting 2 weeks for a sales demo before they could evaluate the product, killing conversion.",
          solution: "Defined scope, ran 30 dev interviews, designed and shipped a self-serve sandbox with instant API keys in 6 weeks.",
          outcome: "Developer sign-up to first API call dropped from 14 days to under 2 hours. Top-of-funnel conversion improved 40%.",
          link: "",
          tags: ["Developer Experience", "Self-Serve", "0→1", "API"],
        },
      ],
      education: [
        {
          id: "ed1",
          institution: "Your University",
          degree: "B.Sc.",
          field: "Engineering / Design",
          year: "2019",
        },
      ],
      certifications: [],
      recommendations: [
        {
          id: "r1",
          name: "Sam Okafor",
          role: "Founder & CEO",
          company: "Stealth Startup",
          relationship: "Founding PM partner",
          quote: "Took an idea from a Notion doc to a paying customer in eight weeks. The kind of operator who'd rather ship and learn than write the perfect PRD.",
        },
      ],
      skills: [
        { id: "s1", label: "Discovery & Research", items: ["Customer Interviews", "Jobs-to-be-Done", "Prototyping", "Usability Testing"] },
        { id: "s2", label: "Product", items: ["MVP Scoping", "Roadmapping", "Pricing Strategy", "Go-to-Market"] },
        { id: "s3", label: "Tools", items: ["Figma", "Notion", "Linear", "Framer"] },
      ],
      mission: {
        title: "Helping early founders ship",
        body: "I mentor pre-seed founders pro bono — three a quarter, no paperwork. Mostly product / pricing / first-customer questions. The best ones teach me more than I teach them.",
        link: "",
      },
      manifesto: [
        { id: "mf1", statement: "Talk to ten users before you write line one of code.", detail: "Five if you're tired. Never zero." },
        { id: "mf2", statement: "Pricing is a product decision, not a finance one.", detail: "It tells your buyer what you actually believe you're worth." },
      ],
      now: [
        { id: "n1", label: "Currently focused on", content: "Validating a niche workflow tool with 20 design ops leads." },
      ],
      passions: [
        {
          id: "ps1",
          title: "Sourdough",
          body: "I bake every Sunday. The starter is older than my eldest kid. I've learned more about iteration from a stiff dough than from any framework.",
          highlights: [],
        },
      ],
    },
  },
  {
    id: "technical-pm",
    name: "Technical PM",
    tagline: "Speak eng fluently",
    description: "Platform, API, or infrastructure PM with engineering background. Strong on spec-writing and system thinking.",
    design: {
      colorTheme: "technical",
      layoutStyle: "two-column",
      fontStyle: "technical",
    },
    strategy: {
      superpower: "technical",
      emphasizedSections: ["experience", "skills", "projects"],
      toneKeywords: ["systems-thinking", "technical", "platform", "developer-focused"],
      sectionOrder: ["experience", "projects", "metrics", "skills", "education"],
    },
    portfolio: {
      basicInfo: {
        name: "",
        title: "Technical Product Manager",
        email: "",
        linkedin: "",
        github: "",
        location: "",
        summary:
          "Technical PM with an engineering background. Deep experience building developer platforms, internal tools, and data infrastructure products. Comfortable reviewing PRs, writing technical specs, and working directly in the codebase.",
      },
      globalMetrics: [
        { id: "m1", label: "API Latency Reduced", value: "60%", context: "P99, after platform redesign" },
        { id: "m2", label: "Eng Velocity", value: "+35%", context: "Deploy frequency after CI/CD overhaul" },
        { id: "m3", label: "Developer Adoption", value: "3× ", context: "Internal SDK usage YoY" },
      ],
      experience: [
        {
          id: "e1",
          company: "Platform Co",
          role: "Technical Product Manager",
          startDate: "Feb 2021",
          endDate: "Present",
          bullets: [
            "Led redesign of core API gateway, reducing P99 latency by 60% and improving reliability to 99.98% uptime",
            "Defined and shipped internal developer platform adopted by 12 engineering teams within 6 months",
            "Wrote detailed technical specs for 3 major integrations with zero rework post-implementation",
            "Partnered with security to deliver SOC 2 Type II certification, unblocking 5 enterprise deals",
          ],
          metrics: [
            { id: "em1", label: "Latency", value: "-60%" },
            { id: "em2", label: "Uptime", value: "99.98%" },
          ],
        },
        {
          id: "e2",
          company: "Data Infra Startup",
          role: "Product Manager",
          startDate: "Aug 2019",
          endDate: "Jan 2021",
          bullets: [
            "Owned data pipeline product; reduced ingestion costs by 40% through columnar storage migration",
            "Built self-serve schema management UI reducing data eng dependency for analysts by 70%",
            "Launched real-time alerting feature that became top revenue driver in first 6 months",
          ],
          metrics: [
            { id: "em3", label: "Ingestion Cost", value: "-40%" },
          ],
        },
      ],
      projects: [
        {
          id: "p1",
          title: "Internal Developer Platform",
          company: "Platform Co",
          duration: "Q1–Q3 2022",
          problem: "12 engineering teams each maintained their own CI/CD pipelines, infrastructure configs, and deployment tooling, causing inconsistent practices and slow onboarding.",
          solution: "Defined platform vision with EM and staff engineers, ran 40 eng interviews, built unified IDP with golden path templates, self-serve provisioning, and centralised observability.",
          outcome: "Deployment frequency increased 35%, new service onboarding time dropped from 3 weeks to 2 days, adopted by all 12 teams within 6 months.",
          link: "",
          tags: ["Platform", "Developer Experience", "Infrastructure", "IDP"],
        },
      ],
      education: [
        {
          id: "ed1",
          institution: "Your University",
          degree: "B.Sc.",
          field: "Computer Science",
          year: "2019",
        },
      ],
      certifications: [],
      recommendations: [
        {
          id: "r1",
          name: "Marcus Lin",
          role: "Director of Engineering",
          company: "Example Platform",
          relationship: "Engineering counterpart",
          quote: "Reads code, asks better questions than half the engineers in the room, and can hold a 12-month platform roadmap in their head. Rare combination.",
        },
      ],
      skills: [
        { id: "s1", label: "Technical", items: ["REST APIs", "GraphQL", "SQL", "Python", "System Design", "Data Pipelines"] },
        { id: "s2", label: "Product", items: ["Technical Specs", "Roadmapping", "Developer Experience", "Platform Strategy"] },
        { id: "s3", label: "Tools", items: ["GitHub", "Datadog", "Terraform", "Linear", "Postman"] },
      ],
      mission: {
        title: "Open-source platform tooling",
        body: "I maintain a small library that makes it easier to wire OpenAPI specs into typed clients. About 40 weekly downloads — but the issues people open are some of the best product feedback I get.",
        link: "",
      },
      manifesto: [
        { id: "mf1", statement: "If your roadmap can't survive a code review, it's not a roadmap.", detail: "Specs that ignore the codebase produce theatre, not software." },
        { id: "mf2", statement: "Developer experience is a customer experience problem.", detail: "Internal users churn too — they just do it more politely." },
      ],
      now: [
        { id: "n1", label: "Building", content: "A typed wrapper for our internal events API." },
        { id: "n2", label: "Reading", content: "\"Designing Data-Intensive Applications\" — Martin Kleppmann." },
      ],
      passions: [
        {
          id: "ps1",
          title: "Mechanical keyboards",
          body: "Three custom builds and counting. Lubed Holy Pandas, Tofu60 case, FR4 plate. The hobby teaches you that small choices compound — same as code.",
          highlights: ["Tofu60 / Holy Pandas", "Bakeneko 60 / Boba U4Ts"],
        },
      ],
    },
  },
  {
    id: "enterprise-pm",
    name: "B2B Enterprise",
    tagline: "Win deals, keep customers",
    description: "Enterprise / B2B PM skilled at multi-stakeholder alignment, sales partnership, and long-horizon roadmaps.",
    design: {
      colorTheme: "minimal",
      layoutStyle: "two-column",
      fontStyle: "classic",
    },
    strategy: {
      superpower: "growth",
      emphasizedSections: ["experience", "metrics"],
      toneKeywords: ["stakeholder-management", "enterprise", "strategic", "customer-centric"],
      sectionOrder: ["metrics", "experience", "projects", "recommendations", "education", "skills"],
    },
    portfolio: {
      basicInfo: {
        name: "",
        title: "Senior Product Manager — Enterprise",
        email: "",
        linkedin: "",
        github: "",
        location: "",
        summary:
          "Enterprise PM with deep experience in complex B2B buying cycles. Skilled at translating customer feedback into roadmap decisions, partnering with sales and CS, and shipping features that close deals and reduce churn.",
      },
      globalMetrics: [
        { id: "m1", label: "ARR Influenced", value: "$8.5M", context: "Deals unblocked by product features" },
        { id: "m2", label: "NPS Improvement", value: "+22pts", context: "Enterprise segment, FY2024" },
        { id: "m3", label: "Churn Reduction", value: "31%", context: "Enterprise tier, post-onboarding overhaul" },
        { id: "m4", label: "Customer Interviews", value: "150+", context: "Enterprise accounts in past 18 months" },
      ],
      experience: [
        {
          id: "e1",
          company: "SaaS Co",
          role: "Senior Product Manager, Enterprise",
          startDate: "May 2021",
          endDate: "Present",
          bullets: [
            "Built SSO + SCIM provisioning features that directly unblocked $3.2M in enterprise deals",
            "Redesigned admin controls and permissions model based on 60 enterprise customer interviews",
            "Led quarterly business reviews with top 10 accounts, reducing churn by 31% year over year",
            "Partnered with sales on deal desk calls, translating product gaps into a phased roadmap used in RFPs",
          ],
          metrics: [
            { id: "em1", label: "Deals Unblocked", value: "$3.2M" },
            { id: "em2", label: "Churn", value: "-31%" },
          ],
        },
        {
          id: "e2",
          company: "B2B Platform Inc",
          role: "Product Manager",
          startDate: "Sep 2019",
          endDate: "Apr 2021",
          bullets: [
            "Owned multi-tenant architecture redesign enabling white-label offering for 3 channel partners",
            "Built audit logging and compliance features required for customers in regulated industries",
            "Managed backlog prioritisation across 4 customer tiers, balancing enterprise asks with platform health",
          ],
          metrics: [],
        },
      ],
      projects: [
        {
          id: "p1",
          title: "Enterprise Admin & Permissions Overhaul",
          company: "SaaS Co",
          duration: "Q2–Q4 2023",
          problem: "Enterprise admins had no granular control over user permissions, creating security objections in deals and blocking procurement sign-off at regulated-industry customers.",
          solution: "Ran 60 discovery calls with IT admins and CISOs, defined a role-based access control model, collaborated with engineering on a 3-sprint delivery plan, shipped with comprehensive audit logging.",
          outcome: "Feature directly unblocked 7 enterprise deals worth $2.1M ARR. Customer-reported security concerns dropped from 40% to 8% of support tickets.",
          link: "",
          tags: ["Enterprise", "Security", "RBAC", "Compliance"],
        },
      ],
      education: [
        {
          id: "ed1",
          institution: "Your University",
          degree: "MBA",
          field: "Strategy & Operations",
          year: "2019",
        },
      ],
      certifications: [],
      recommendations: [
        {
          id: "r1",
          name: "Elena Rossi",
          role: "Chief Customer Officer",
          company: "Example Enterprise Co",
          relationship: "Cross-functional partner",
          quote: "When our top accounts say a feature is a deal-breaker, this PM is the one I want sequencing the response. Calm, structured, and accountable to the outcome — not the ticket.",
        },
      ],
      skills: [
        { id: "s1", label: "Enterprise Product", items: ["RBAC", "SSO/SAML", "Audit Logging", "Multi-tenancy", "Compliance"] },
        { id: "s2", label: "Strategy", items: ["Roadmapping", "Stakeholder Management", "QBRs", "Pricing", "RFP Response"] },
        { id: "s3", label: "Tools", items: ["Salesforce", "Gainsight", "ProductBoard", "Figma", "Jira"] },
      ],
      mission: {
        title: "Coaching first-time enterprise PMs",
        body: "I run a quarterly cohort for PMs moving from consumer into enterprise. Half the curriculum is unlearning — the other half is learning to love a slow, paperwork-heavy buying process.",
        link: "",
      },
      manifesto: [
        { id: "mf1", statement: "Sales isn't the customer. The end-user is.", detail: "But sales has the relationship — earn their trust before you fight them." },
        { id: "mf2", statement: "Compliance isn't a tax. It's a feature for the buyer who matters most.", detail: "The CISO outranks every roadmap input you have." },
      ],
      now: [
        { id: "n1", label: "Currently focused on", content: "Shipping our SOC 2 Type II readiness program." },
      ],
      passions: [
        {
          id: "ps1",
          title: "Choral singing",
          body: "I sing tenor in a community chamber choir. Two performances a year, weekly rehearsals. Listening to forty other voices and finding your own line is a useful skill in enterprise stakeholder meetings.",
          highlights: ["Brahms Requiem 2023", "Britten Ceremony of Carols 2024"],
        },
      ],
    },
  },
];
