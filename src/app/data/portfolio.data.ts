/**
 * Single source of truth for all portfolio copy and content.
 * Ported from the Claude Design export (Claude-portfolio-design/Portfolio.dc.html, Resume.dc.html).
 */

export interface NavItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Stack' },
  { id: 'proof', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

export const PERSON = {
  name: 'R V Nitesh Kumar',
  role: 'Forward Deployed Engineer',
  location: 'Chennai, India',
  email: 'nitesh20rv@gmail.com',
  employer: 'Peninsular Research Operation',
  linkedin: { url: 'https://linkedin.com/in/rvnitesh', handle: 'in/rvnitesh' },
  github: { url: 'https://github.com/BeingAnProgrammer', handle: 'BeingAnProgrammer' },
  medium: { url: 'https://medium.com/@rvnitesh', handle: '@rvnitesh' },
  siteUrl: 'https://rvnk.in',
};

export interface ArchStep {
  title: string;
  detail: string;
}

export interface ProjectOutcome {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  featured: boolean;
  ptype?: 'Company Project' | 'Personal Project';
  url?: string;
  num: string;
  title: string;
  /** CSS color (hex or oklch) used as this project's accent throughout its card and case study. */
  accent: string;
  kind: string;
  /** One-line summary shown in the "Also built" minor list (non-featured projects only). */
  line?: string;
  oneliner: string;
  role: string;
  context: string;
  core: string;
  problem: string;
  product: string;
  contrib: string[];
  arch: ArchStep[];
  tech: string[];
  outcomes: ProjectOutcome[];
  note: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'agentic',
    featured: true,
    ptype: 'Company Project',
    url: 'https://www.datamocha.in/',
    num: '01',
    title: 'DataMocha & Agentic AI Studio',
    accent: '#F50',
    kind: 'Enterprise SaaS platform & AI agent studio',
    oneliner:
      'A configurable enterprise platform, and the multi-tenant studio where organisations build, configure and deploy their own AI agents.',
    role: 'Architect & full-stack engineer',
    context: 'Peninsular Research Operation',
    core: 'Angular · .NET · MongoDB · Azure OpenAI · Pinecone · MinIO',
    problem:
      'Business domains each needed their own dashboards, forms and approval workflows — without a bespoke build every time. On top of that, every team wanted an assistant that understood its own documents, and enterprise buyers needed tenant isolation, control over which model sees what, and freedom from single-cloud lock-in.',
    product:
      'DataMocha: dynamic dashboards, form builders, workflow management, analytics, reporting and RBAC, with a multi-tenant reseller and client layer. Agentic AI Studio: teams define an agent’s instructions, knowledge sources, LLM provider and tools; the platform handles ingestion, embeddings and retrieval, and serves a streaming chat with document-grounded answers.',
    contrib: [
      'Architected and developed DataMocha’s configurable platform — dashboards, form builders, workflows, analytics, reporting and role-based access control.',
      'Architected and developed the multi-tenant AI agent platform on Azure OpenAI and external LLM providers.',
      'Implemented the RAG knowledge-retrieval system: document chunking, vector embeddings, Pinecone indexing and semantic search, with automated ingestion and secure storage on Azure Blob.',
      'Engineered the chat experience: file uploads, conversation history, streaming responses and document Q&A; REST APIs and orchestration services with .NET, MongoDB and Azure.',
      'Built agents for Financial Analysis, CFO Insights, RFP Evaluation, Sales Forecasting and Meeting Intelligence.',
      'Led the object-storage migration from Azure Blob Storage to MinIO using a Factory Pattern and S3-compatible architecture, enabling cloud-agnostic deployments.',
      'Engineered MongoDB aggregation pipelines, dynamic query generation and indexing strategies that significantly improved reporting on large datasets.',
      'Built the multi-tenant reseller & client management system: licence provisioning, approval workflows, access management, usage tracking.',
      'Reduced application build size by over 24% through lazy loading, dynamic imports, dependency rationalisation and bundle optimisation.',
    ],
    arch: [
      { title: 'Tenant & reseller layer', detail: 'Licences, onboarding, RBAC, usage tracking' },
      { title: 'Form builder & workflow engine', detail: 'Configurable per business domain' },
      { title: 'Agent configuration', detail: 'Instructions, knowledge sources, provider, tools' },
      { title: 'Document ingestion', detail: 'Uploads into object storage' },
      { title: 'Storage abstraction', detail: 'Factory Pattern → Azure Blob / MinIO (S3-compatible)' },
      { title: 'Chunking & embeddings', detail: 'Documents split and vectorised' },
      { title: 'Pinecone index', detail: 'Tenant-scoped vector storage and semantic search' },
      { title: 'LLM orchestration', detail: 'Azure OpenAI or external providers + tool calls' },
      { title: 'MongoDB', detail: 'Aggregation pipelines, dynamic queries, indexing' },
      { title: 'Angular frontend', detail: 'Dashboards, drill-down analytics, streaming chat — lazy-loaded' },
    ],
    tech: [
      'Angular', 'TypeScript', 'RxJS', 'C#', '.NET', 'ASP.NET Core Web API', 'MongoDB',
      'Azure OpenAI', 'External LLM providers', 'RAG', 'Vector embeddings', 'Pinecone',
      'Semantic search', 'Azure Blob Storage', 'MinIO', 'S3-compatible', 'Factory Pattern',
      'RBAC', 'Multi-tenancy', 'Streaming',
    ],
    outcomes: [
      { value: '>24%', label: 'reduction in application build size, with faster initial load' },
      { value: '5', label: 'specialised AI agents delivered on the platform' },
      { value: 'Cloud-agnostic', label: 'object storage moved off single-vendor lock-in' },
      { value: 'Kaizen', label: 'Katalyst Award for product improvements to feedback & decision-making' },
    ],
    note: 'Figures from resume. Architecture abstracted; no client data or internal configuration shown.',
  },
  {
    id: 'koriva',
    featured: true,
    ptype: 'Personal Project',
    url: 'https://koriva.rvnk.in/',
    num: '02',
    title: 'Koriva',
    accent: 'oklch(0.62 0.15 300)',
    kind: 'AI meeting intelligence & commitment platform',
    oneliner: 'From “who said they’d do that?” to a searchable record of every decision, action and commitment.',
    role: 'Full-stack & AI engineering',
    context: 'Product · meeting intelligence',
    core: 'OpenAI · RAG · Pinecone',
    problem:
      'Decisions and promises made in meetings evaporate. Notes are partial, action items live in someone’s head, and there is no way to ask what was agreed across dozens of calls.',
    product:
      'Koriva connects to Zoom, Microsoft Teams and Google Meet, captures the conversation and turns it into minutes of meeting, action items and tracked commitments — with an intelligence layer and AI search across every meeting. Dashboard, Commitments, Intelligence, Action Items, Analytics and scheduling sit in one workspace.',
    contrib: [
      'Worked on the pipeline from captured conversation to structured output: transcription, MOM generation, action items and commitments.',
      'Built RAG-based AI search over meeting history with OpenAI and Pinecone.',
      'Contributed to the product surfaces — dashboard, commitments, intelligence, analytics and meeting workflows.',
    ],
    arch: [
      { title: 'Meeting platforms', detail: 'Zoom · Microsoft Teams · Google Meet' },
      { title: 'Audio / video capture', detail: 'Conversation recorded per meeting' },
      { title: 'Transcription', detail: 'Speech to speaker-attributed text' },
      { title: 'LLM processing', detail: 'OpenAI summarisation and extraction' },
      { title: 'MOM · Commitments · Actions', detail: 'Structured, owned, trackable' },
      { title: 'Vector storage', detail: 'Meeting knowledge in Pinecone' },
      { title: 'RAG / AI search', detail: 'Ask across every meeting' },
      { title: 'Workspace', detail: 'Dashboard, Intelligence, Analytics' },
    ],
    tech: ['OpenAI', 'RAG', 'Pinecone', 'Embeddings', 'AI transcription', 'Zoom', 'Microsoft Teams', 'Google Meet', 'Meeting workflows'],
    outcomes: [
      { value: '3', label: 'meeting platforms connected — Zoom, Teams, Meet' },
      { value: 'Conversation → record', label: 'minutes, action items and commitments generated from each call' },
      { value: 'Searchable', label: 'AI search across the full meeting history' },
    ],
    note: 'No usage metrics are published for this product; UI shown is a recreated concept.',
  },
  {
    id: 'anydoc',
    featured: true,
    ptype: 'Personal Project',
    url: 'https://anydocllm.rvnk.in',
    num: '03',
    title: 'AnyDoc LLM',
    accent: 'oklch(0.62 0.13 80)',
    kind: 'Client-side document intelligence & conversion',
    oneliner: 'Drop in a PDF, Word or Excel file; get clean, LLM-ready Markdown — without the file ever leaving your browser.',
    role: 'Design & build',
    context: 'Independent project · developer tooling',
    core: 'Angular · WebAssembly',
    problem:
      'Feeding documents to LLMs means converting them to text first — and most converters upload your files to someone else’s server. For sensitive documents, that’s a non-starter.',
    product:
      'A browser-based converter built on Firecrawl’s AnyDoc WASM and PDF Inspector WASM. PDF and DOCX become structured Markdown, spreadsheets are processed in place, and a live preview shows exactly what an LLM will see before export.',
    contrib: [
      'Designed the upload → parse → transform → preview → export flow.',
      'Integrated Firecrawl AnyDoc WASM and PDF Inspector WASM into an Angular app for fully local processing.',
      'Built PDF → Markdown, DOCX → Markdown and Excel processing with a live Markdown preview.',
    ],
    arch: [
      { title: 'File in browser', detail: 'PDF · DOCX · XLSX' },
      { title: 'WASM parsers', detail: 'Firecrawl AnyDoc · PDF Inspector' },
      { title: 'Transform', detail: 'Structure mapped to Markdown' },
      { title: 'Preview', detail: 'Rendered Markdown, side by side' },
      { title: 'Export', detail: 'Download or copy — nothing uploaded' },
    ],
    tech: ['Angular', 'TypeScript', 'WebAssembly', 'Firecrawl AnyDoc WASM', 'PDF Inspector WASM', 'Markdown'],
    outcomes: [
      { value: 'Local', label: 'conversion runs in the browser — privacy by design' },
      { value: '3 formats', label: 'PDF, DOCX and Excel into one Markdown output' },
    ],
    note: 'Independent project; no usage metrics claimed.',
  },
  {
    id: 'farmbuddy',
    featured: true,
    ptype: 'Company Project',
    num: '04',
    title: 'FarmBuddy',
    accent: 'oklch(0.62 0.14 150)',
    kind: 'Satellite intelligence platform',
    oneliner: 'Region-level crop and land intelligence from Sentinel-2 imagery, built for the Government of Odisha.',
    role: 'Geospatial APIs & map visualisation',
    context: 'Government of Odisha',
    core: 'MongoDB 2dsphere · GeoJSON',
    problem:
      'Satellite imagery holds answers about crop health, water and land use — but only if you can query millions of data points by arbitrary region, fast enough for people to explore.',
    product:
      'A geospatial analytics platform built on Sentinel-2 imagery and four indices — NDVI, NDWI, NDBI and NDMI. Stakeholders draw a polygon on a map and get region-wise analysis, spatial filtering and location intelligence.',
    contrib: [
      'Developed the analytics platform around Sentinel-2 imagery and the NDVI, NDWI, NDBI and NDMI indices.',
      'Engineered high-performance geospatial APIs with MongoDB 2dsphere indexing, aggregation pipelines and polygon-based spatial queries over millions of data points.',
      'Built interactive GeoJSON map modules for region-wise analysis and custom polygon selection.',
      'Optimised large-scale spatial processing and retrieval, enabling real-time analytics for government stakeholders.',
    ],
    arch: [
      { title: 'Sentinel-2 imagery', detail: 'Multispectral satellite data' },
      { title: 'Index computation', detail: 'NDVI · NDWI · NDBI · NDMI' },
      { title: 'MongoDB + 2dsphere', detail: 'Spatially indexed data points' },
      { title: 'Polygon queries', detail: '$geoWithin + aggregation pipelines' },
      { title: 'Geospatial APIs', detail: 'Region-wise, filterable' },
      { title: 'GeoJSON map', detail: 'Custom polygon selection' },
      { title: 'Stakeholder insight', detail: 'Crop, water and land conditions' },
    ],
    tech: ['Sentinel-2', 'NDVI', 'NDWI', 'NDBI', 'NDMI', 'MongoDB', '2dsphere indexing', 'Aggregation pipelines', 'GeoJSON', 'Spatial queries'],
    outcomes: [
      { value: '4', label: 'vegetation & land indices monitored' },
      { value: 'Millions', label: 'of satellite data points queried via polygon search' },
      { value: 'Real-time', label: 'satellite analytics for government stakeholders' },
    ],
    note: 'From resume. Map visuals are illustrative, not real project data.',
  },
  {
    id: 'openmetadata',
    featured: false,
    num: '05',
    title: 'OpenMetadata',
    accent: 'oklch(0.62 0.1 200)',
    kind: 'Open-source · data governance',
    line: 'Hands-on work customising and deploying the open-source metadata platform for data governance.',
    oneliner: 'Working with the open-source OpenMetadata platform to bring metadata discovery and governance to data teams.',
    role: 'Customisation & deployment',
    context: 'Open-source ecosystem',
    core: 'OpenMetadata',
    problem: 'As data spreads across services, teams lose track of what exists, who owns it and whether it can be trusted.',
    product: 'An OpenMetadata setup adapted for internal data-governance work — cataloguing sources and making metadata discoverable.',
    contrib: [
      'Worked hands-on with OpenMetadata as part of the data-governance toolset.',
      'Customised and deployed the platform for internal use.',
    ],
    arch: [
      { title: 'Data sources', detail: 'Databases and services' },
      { title: 'OpenMetadata', detail: 'Ingestion and catalogue' },
      { title: 'Deployment', detail: 'Configured for the team' },
      { title: 'Discovery & governance', detail: 'Ownership, lineage, trust' },
    ],
    tech: ['OpenMetadata', 'Docker', 'Data governance', 'Metadata'],
    outcomes: [{ value: 'Governance', label: 'part of the data-governance work recognised in Excellence awards' }],
    note: 'Scope kept to what the resume supports.',
  },
  {
    id: 'pragent',
    featured: false,
    num: '06',
    title: 'PR Intelligence Agent',
    accent: 'oklch(0.62 0.12 20)',
    kind: 'Developer productivity · AI',
    line: 'Azure DevOps webhooks into a FastAPI service that analyses pull requests with an LLM.',
    oneliner: 'An agent that reads pull requests as they open and gives reviewers an AI-assisted head start.',
    role: 'Design & build',
    context: 'Internal tooling',
    core: 'Azure DevOps · FastAPI · LLM',
    problem: 'Reviewers spend their first minutes on every PR just working out what changed and where to look.',
    product: 'Azure DevOps webhooks trigger a FastAPI service that gathers the change and runs automated, LLM-based analysis for reviewers.',
    contrib: [
      'Wired Azure DevOps webhooks to a FastAPI service.',
      'Built the automated PR analysis flow using an LLM.',
    ],
    arch: [
      { title: 'Pull request event', detail: 'Azure DevOps' },
      { title: 'Webhook', detail: 'Pushes event to service' },
      { title: 'FastAPI service', detail: 'Collects diff and context' },
      { title: 'LLM analysis', detail: 'Automated PR intelligence' },
      { title: 'Reviewer insight', detail: 'Faster, better-targeted review' },
    ],
    tech: ['Azure DevOps', 'Webhooks', 'FastAPI', 'Python', 'LLM'],
    outcomes: [{ value: 'Automated', label: 'analysis on each pull request' }],
    note: 'No productivity metrics claimed.',
  },
  {
    id: 'jelly',
    featured: false,
    num: '07',
    title: 'Jelly Notes',
    accent: 'oklch(0.62 0.13 330)',
    kind: 'Independent product · productivity',
    line: 'A modern note-taking app — an exercise in product thinking, UX and SEO-ready frontend.',
    oneliner: 'A modern note-taking app, built end to end as a product rather than a demo.',
    role: 'Product, design & frontend',
    context: 'Independent project',
    core: 'Modern web frontend',
    problem: 'Note apps are either heavy or bare. The interesting space is a tool that feels fast, calm and considered.',
    product: 'A note-taking and productivity web app focused on UX quality, frontend craft and discoverability through SEO.',
    contrib: ['Owned product thinking and UX.', 'Built the frontend and SEO foundations.'],
    arch: [],
    tech: ['Frontend engineering', 'UX', 'SEO', 'Web app'],
    outcomes: [{ value: 'Independent', label: 'designed and built end to end' }],
    note: 'Experiment; no metrics claimed.',
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
export const MINOR_PROJECTS = PROJECTS.filter((p) => !p.featured);

export interface StackItem {
  name: string;
  usedBy: string[];
}

export interface StackGroup {
  name: string;
  items: StackItem[];
}

export const STACK: StackGroup[] = [
  { name: 'Frontend', items: [
    { name: 'Angular', usedBy: ['agentic', 'anydoc', 'ecom'] },
    { name: 'TypeScript', usedBy: ['agentic', 'anydoc'] },
    { name: 'JavaScript', usedBy: ['ecom', 'focus'] },
    { name: 'RxJS', usedBy: ['agentic'] },
    { name: 'HTML / CSS', usedBy: ['agentic', 'anydoc', 'jelly', 'ecom'] },
  ]},
  { name: 'Backend', items: [
    { name: 'C#', usedBy: ['agentic', 'ecom'] },
    { name: '.NET', usedBy: ['agentic'] },
    { name: 'ASP.NET Core', usedBy: ['agentic', 'ecom'] },
    { name: 'Node.js', usedBy: ['focus'] },
    { name: 'REST APIs', usedBy: ['agentic', 'farmbuddy', 'ecom'] },
    { name: 'FastAPI', usedBy: ['pragent'] },
  ]},
  { name: 'AI', items: [
    { name: 'Azure OpenAI', usedBy: ['agentic'] },
    { name: 'RAG', usedBy: ['agentic', 'koriva'] },
    { name: 'Embeddings', usedBy: ['agentic', 'koriva'] },
    { name: 'Pinecone', usedBy: ['agentic', 'koriva'] },
    { name: 'LLM apps', usedBy: ['agentic', 'koriva', 'pragent'] },
    { name: 'Semantic search', usedBy: ['agentic', 'koriva'] },
  ]},
  { name: 'Data', items: [
    { name: 'MongoDB', usedBy: ['agentic', 'farmbuddy', 'ecom'] },
    { name: 'SQL / MySQL', usedBy: ['ecom'] },
    { name: 'Geospatial', usedBy: ['farmbuddy'] },
    { name: 'Aggregations', usedBy: ['agentic', 'farmbuddy'] },
  ]},
  { name: 'Cloud', items: [
    { name: 'Azure', usedBy: ['agentic'] },
    { name: 'Azure Blob', usedBy: ['agentic'] },
    { name: 'MinIO', usedBy: ['agentic'] },
    { name: 'Docker', usedBy: ['openmetadata'] },
    { name: 'Azure DevOps', usedBy: ['pragent'] },
    { name: 'CI/CD', usedBy: [] },
  ]},
  { name: 'Tools', items: [
    { name: 'Git / GitHub', usedBy: [] },
    { name: 'Postman', usedBy: [] },
    { name: 'N8N', usedBy: [] },
    { name: 'OpenMetadata', usedBy: ['openmetadata'] },
    { name: 'Redis', usedBy: [] },
  ]},
];

export const WORKS: { id: string; name: string }[] = [
  { id: 'agentic', name: 'DataMocha & Agentic AI Studio' },
  { id: 'koriva', name: 'Koriva' },
  { id: 'anydoc', name: 'AnyDoc LLM' },
  { id: 'farmbuddy', name: 'FarmBuddy' },
  { id: 'openmetadata', name: 'OpenMetadata' },
  { id: 'pragent', name: 'PR Intelligence Agent' },
  { id: 'jelly', name: 'Jelly Notes' },
  { id: 'ecom', name: 'E-commerce app (intern)' },
  { id: 'focus', name: 'Focus Research Labs' },
];

export const MARQUEE_ITEMS: string[] = [
  'Agentic AI Studio', 'RAG pipelines', 'Koriva', 'Azure OpenAI', 'DataMocha',
  'Pinecone', 'AnyDoc LLM', 'MongoDB 2dsphere', 'FarmBuddy', '.NET · Angular',
];

export interface AboutStep {
  num: string;
  title: string;
  detail: string;
}

export const ABOUT_STEPS: AboutStep[] = [
  { num: '01', title: 'Understand', detail: 'Find the actual problem, not the stated one.' },
  { num: '02', title: 'Design', detail: 'Shape the system and the data around it.' },
  { num: '03', title: 'Prototype', detail: 'Get something real in front of users fast.' },
  { num: '04', title: 'Integrate & deploy', detail: 'Wire it into the systems it has to live with.' },
  { num: '05', title: 'Iterate', detail: 'Debug, measure, refine with real feedback.' },
];

export const TRAJECTORY_ERAS: { period: string; label: string }[] = [
  { period: '2023', label: 'Web Development' },
  { period: '2023 — 24', label: 'Full Stack' },
  { period: '2024 —', label: 'AI Systems' },
  { period: 'NOW', label: 'Forward Deployed Engineering' },
];

export interface TimelineEntry {
  period: string;
  org: string;
  title: string;
  description?: string;
  bullets?: string[];
  current?: boolean;
  dotStyle: 'accent' | 'solid' | 'outline' | 'small';
}

export const HOME_TIMELINE: TimelineEntry[] = [
  {
    period: 'Current direction', org: 'Peninsular Research Operation · Chennai',
    title: 'Forward Deployed Engineer',
    description: 'Taking the systems work closer to the problem — working directly with stakeholders to turn ambiguous requirements into deployed, AI-powered software, then integrating, debugging and iterating in place.',
    current: true, dotStyle: 'accent',
  },
  {
    period: '03/2024 —', org: 'Peninsular Research Operation · Chennai',
    title: 'Software Development Engineer',
    bullets: [
      'Architected Agentic AI Studio, a multi-tenant agent platform on Azure OpenAI with a RAG pipeline over Pinecone; delivered 5 specialised agents.',
      'Led DataMocha’s move from Azure Blob to MinIO for cloud-agnostic storage, and cut the build size by over 24%.',
      'Built FarmBuddy’s geospatial APIs on MongoDB 2dsphere for millions of Sentinel-2 data points.',
    ],
    dotStyle: 'solid',
  },
  {
    period: '09/2023 — 02/2024', org: 'Peninsular Research Operation · Chennai',
    title: 'Software Development Intern',
    description: 'Delivered a full-stack e-commerce application — product management, authentication and purchasing — with Angular, ASP.NET Core, MySQL and MongoDB, responsive across desktop and mobile.',
    dotStyle: 'outline',
  },
  {
    period: '03/2023 — 08/2023', org: 'Focus Research Labs · Chennai',
    title: 'Web Developer',
    description: 'Built web applications with JavaScript, Node.js and Angular — UI polish, backend integration and application optimisation in an Agile team.',
    dotStyle: 'outline',
  },
  {
    period: '2020 — 2024', org: 'Sathyabama Institute of Science and Technology',
    title: 'B.Tech, Information Technology',
    description: 'CGPA 8.92',
    dotStyle: 'small',
  },
];

export interface MeetingQuote {
  who: string;
  time: string;
  pre: string;
  highlight: string;
  post: string;
  kind: string;
  card: string;
  meta: string;
}

export const MEETING_QUOTES: MeetingQuote[] = [
  { who: 'RN', time: '00:14:32', pre: 'Okay — ', highlight: 'I’ll send the revised proposal', post: ' by Friday.', kind: 'COMMITMENT', card: 'Send revised proposal', meta: 'Owner RN · due Friday' },
  { who: 'JM', time: '00:23:08', pre: 'Let’s ', highlight: 'move the pilot to the second week', post: '.', kind: 'DECISION', card: 'Pilot moves to week two', meta: 'Logged to meeting minutes' },
  { who: 'AK', time: '00:29:51', pre: 'Agreed — and ', highlight: 'loop in finance on costs', post: '.', kind: 'ACTION ITEM', card: 'Loop in finance on costs', meta: 'Owner AK · open' },
];

export interface SpectralIndex {
  name: string;
  desc: string;
  /** base oklch hue */
  hue: number;
  /** hue span added across the value range; 0 for a flat hue */
  span: number;
}

export const SPECTRAL_INDICES: SpectralIndex[] = [
  { name: 'NDVI', desc: 'vegetation', hue: 75, span: 70 },
  { name: 'NDWI', desc: 'water', hue: 235, span: 0 },
  { name: 'NDBI', desc: 'built-up', hue: 40, span: 0 },
  { name: 'NDMI', desc: 'moisture', hue: 195, span: 0 },
];

/** Polygon overlay drawn over the FarmBuddy 32x18 cell grid, in grid units. */
export const FARMBUDDY_POLYGON: [number, number][] = [
  [11, 6], [14, 3.8], [19.5, 4], [23, 6.6], [22.6, 10.4], [18.5, 12.4], [13, 11.6], [10.4, 9],
];

export const DATAMOCHA_AGENTS: { name: string; meta: string }[] = [
  { name: 'Databases', meta: 'live' },
  { name: 'Apps', meta: 'live' },
  { name: 'Cloud services', meta: 'live' },
  { name: 'Files', meta: 'sync' },
  { name: 'Data entry', meta: 'input' },
];

export const DATAMOCHA_PIPELINE: string[] = ['Integrate sources', 'Unified data hub', 'Visualise', 'AI insights', 'Forecast'];

/** Bar heights (%); the last 3 render as dashed "forecast" bars rather than filled. */
export const DATAMOCHA_BARS: number[] = [42, 58, 50, 71, 64, 80, 76, 88, 70, 84, 92, 96];

export const ANYDOC_STEPS: { label: string; tag: string }[] = [
  { label: 'Upload', tag: 'PDF · DOCX · XLSX' },
  { label: 'Parse', tag: 'WASM' },
  { label: 'Transform', tag: 'STRUCTURE' },
  { label: 'Preview', tag: 'LIVE' },
  { label: 'Export', tag: '.MD' },
];

// --- Resume-only content ---

export const RESUME_SUMMARY =
  'Results-driven Full Stack Developer with 2.5+ years of experience building scalable web applications using Angular, C#, .NET, Node.js, SQL and Azure. Skilled in responsive UIs, RESTful APIs, database management and cloud-based solutions in Agile environments.';

export interface ResumeProjectEntry {
  title: string;
  sub: string;
  points: string[];
}

export const RESUME_SDE_PROJECTS: ResumeProjectEntry[] = [
  {
    title: 'Agentic AI Studio', sub: 'Multi-tenant AI agent platform',
    points: [
      'Architected and developed a multi-tenant AI agent platform allowing organisations to build, manage and deploy custom AI assistants powered by Azure OpenAI and external LLM providers.',
      'Implemented a RAG-based knowledge retrieval system using document chunking, vector embeddings, Pinecone indexing and semantic search for context-aware responses.',
      'Built configurable agent capabilities: custom instructions, knowledge sources, LLM provider selection, conversation analytics and tool integrations.',
      'Developed a scalable document pipeline — automated ingestion, embedding generation, vector storage and secure knowledge management on Azure Blob Storage.',
      'Engineered a chat experience with file uploads, conversation history, streaming responses and document-based question answering.',
      'Designed RESTful APIs and backend orchestration services with .NET, MongoDB and Azure.',
      'Built AI agents for Financial Analysis, CFO Insights, RFP Evaluation, Sales Forecasting and Meeting Intelligence.',
    ],
  },
  {
    title: 'DataMocha', sub: 'Governance progress management platform',
    points: [
      'Architected and developed a configurable enterprise SaaS platform with dynamic dashboards, form builders, workflow management, analytics, reporting and role-based access control.',
      'Led migration of object storage from Azure Blob Storage to MinIO using a Factory Pattern and S3-compatible architecture, enabling cloud-agnostic deployments.',
      'Engineered complex MongoDB aggregation pipelines, dynamic query generation and indexing strategies, significantly improving reporting performance on large datasets.',
      'Built a multi-tenant reseller and client management system with licence provisioning, approval workflows, access management and usage tracking.',
      'Developed analytics modules: configurable charting, drill-down reporting, forecasting and real-time dashboard insights.',
      'Reduced application build size by over 24% through lazy loading, dynamic imports, dependency rationalisation and bundle optimisation.',
    ],
  },
  {
    title: 'FarmBuddy', sub: 'Satellite intelligence platform · Odisha Government',
    points: [
      'Developed a geospatial analytics platform using Sentinel-2 imagery and vegetation indices (NDVI, NDWI, NDBI, NDMI) to monitor agricultural and environmental conditions.',
      'Engineered high-performance geospatial APIs with MongoDB 2dsphere indexing, aggregation pipelines and polygon-based spatial queries across millions of satellite data points.',
      'Built interactive GeoJSON map visualisation modules for region-wise analysis, spatial filtering and custom polygon selection.',
      'Optimised large-scale spatial data processing and retrieval, enabling real-time satellite analytics for government stakeholders.',
    ],
  },
];

export interface ResumeExperience {
  title: string;
  period: string;
  org: string;
  bullets: string[];
}

export const RESUME_OTHER_EXPERIENCE: ResumeExperience[] = [
  {
    title: 'Software Development Intern', period: '09/2023 — 02/2024', org: 'Peninsular Research Operation · Chennai',
    bullets: [
      'Developed a full-stack e-commerce application using Angular, ASP.NET Core, MySQL and MongoDB, supporting product management, user authentication and online purchasing workflows.',
      'Designed responsive frontend components and integrated RESTful APIs for a seamless experience across desktop and mobile.',
      'Contributed to database design, backend development, debugging and deployment.',
    ],
  },
  {
    title: 'Web Developer', period: '03/2023 — 08/2023', org: 'Focus Research Labs · Semmanjeri, Chennai',
    bullets: [
      'Designed and developed web applications using JavaScript, Node.js and Angular.',
      'Built responsive, user-friendly interfaces while supporting backend integration, debugging and application optimisation.',
      'Collaborated with experienced developers in an Agile environment.',
    ],
  },
];

export interface SkillGroup {
  name: string;
  items: string[];
}

export const RESUME_SKILLS: SkillGroup[] = [
  { name: 'FRONTEND', items: ['TypeScript', 'JavaScript', 'Angular CLI', 'HTML', 'CSS', 'Bootstrap', 'Responsive Web Design', 'RxJS'] },
  { name: 'BACKEND', items: ['ASP.NET Core Web API', 'Entity Framework / EF Core', 'RESTful APIs', 'Auth & Authorization', 'Dependency Injection', 'LINQ', 'MVC Architecture', 'Node.js'] },
  { name: 'TOOLS', items: ['Docker', 'Postman', 'Git', 'Azure DevOps', 'N8N', 'MinIO', 'OpenMetadata', 'Redis'] },
  { name: 'CLOUD / DEVOPS', items: ['Azure Blob Storage', 'Azure Static Web Apps', 'Azure App Services', 'CI/CD basics', 'Deployment Management', 'GitHub / Azure DevOps'] },
];

export interface Certification {
  issuer: string;
  date: string;
  title: string;
  url?: string;
  subtitle?: string;
}

export const CERTIFICATIONS: Certification[] = [
  { issuer: 'MICROSOFT', date: '20 APR 2025', title: 'Azure AI Engineer Associate', url: 'https://learn.microsoft.com/en-gb/users/niteshkumar-6582/credentials/17cb1ba0eb27a1a8?ref=https%3A%2F%2Fwww.linkedin.com%2F' },
  { issuer: 'MICROSOFT', date: '21 JUN 2025', title: 'Fabric Data Engineer Associate', url: 'https://learn.microsoft.com/en-us/users/niteshkumar-6582/credentials/8958cddd3d661f73?ref=https%3A%2F%2Fwww.linkedin.com%2F' },
  { issuer: 'FUTURESKILLS PRIME · C-DAC · NIELIT', date: '', title: 'Cloud Computing Technology', subtitle: 'Ministry of Electronics & IT, India' },
];

export interface Award {
  tag: string;
  title: string;
  detail: string;
}

export const AWARDS: Award[] = [
  { tag: '9×', title: 'Recognition of Excellence Award', detail: 'Peninsular Research Operation — for contributions across DataMocha, Smart Agri Tech, Data Governance, UI/UX optimisation, performance engineering, audit compliance and enterprise feature delivery.' },
  { tag: 'KAIZEN', title: 'Kaizen Katalyst Award', detail: 'For product improvement initiatives that enhanced user feedback collection and decision-making in DataMocha.' },
  { tag: 'QUALITY', title: 'Deming Award', detail: 'For high-quality, customisable UI experiences that enhanced usability across enterprise applications.' },
];

// Home "Proof" section — the design words these differently from the resume.

export interface ProofCertification {
  top: [string, string];
  kicker: string;
  title: string;
  url?: string;
}

export const PROOF_CERTIFICATIONS: ProofCertification[] = [
  { top: ['MICROSOFT', 'APR 2025'], kicker: 'Microsoft Certified', title: 'Azure AI Engineer Associate', url: CERTIFICATIONS[0].url },
  { top: ['MICROSOFT', 'JUN 2025'], kicker: 'Microsoft Certified', title: 'Fabric Data Engineer Associate', url: CERTIFICATIONS[1].url },
  { top: ['FUTURESKILLS PRIME', 'C-DAC · NIELIT'], kicker: 'Ministry of Electronics & IT, India', title: 'Cloud Computing Technology' },
];

export const PROOF_AWARDS: Award[] = [
  { tag: '9', title: 'Recognition of Excellence', detail: 'Peninsular Research Operation — across DataMocha, Smart Agri Tech, data governance, UI/UX optimisation, performance engineering, audit compliance and enterprise feature delivery.' },
  { tag: 'PRODUCT IMPROVEMENT', title: 'Kaizen Katalyst Award', detail: 'For proposing improvements that sharpened feedback collection and decision-making in DataMocha.' },
  { tag: 'QUALITY', title: 'Deming Award', detail: 'For high-quality, customisable UI experiences that improved usability across enterprise applications.' },
];

export const EDUCATION = {
  degree: 'B.Tech, Information Technology',
  school: 'Sathyabama Institute of Science and Technology · Chennai · 2020 — 2024',
  cgpa: '8.92',
};

export const RESUME_TOC = [
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'awards', label: 'Awards' },
  { id: 'education', label: 'Education' },
];

export const RESUME_PDF_PATH = '/R_V_Nitesh_Kumar_Resume.pdf';
