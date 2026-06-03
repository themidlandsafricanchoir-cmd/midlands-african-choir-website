# Design Document: Midlands African Choir UK Website

## Overview

The Midlands African Choir UK website is a statically generated site built with **Astro** and **TailwindCSS**. It serves as the choir's primary digital presence — showcasing performances, enabling community engagement, supporting membership recruitment, and facilitating event bookings.

The site is designed to be:
- **Static-first**: All pages are pre-rendered at build time; no server-side rendering at runtime
- **Mobile-first**: Responsive layouts built with TailwindCSS breakpoints, minimum 44×44px tap targets
- **Performance-optimised**: Lighthouse 90+ on key pages, WebP images, lazy loading, minimal JS
- **Grant-ready**: Professional design, impact statistics, and downloadable impact report
- **AWS-backed**: S3 for media, Lambda + API Gateway + SES for form handling

### Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Static site generator | Astro 4.x | Islands architecture — ships zero JS by default; React components only where interactivity is needed |
| Styling | TailwindCSS 3.x | Utility-first; custom palette via `tailwind.config.mjs`; no runtime CSS |
| Interactive components | React 18 | Hamburger menu, filter UI, and form components require client-side state |
| Content management | Astro Content Collections | Type-safe, Zod-validated structured data for team and performances |
| Media storage | AWS S3 | Scalable, cost-effective object storage for images and audio |
| Form backend | AWS Lambda + API Gateway + SES | Serverless form processing with email delivery |
| Hosting | Netlify (primary) / Vercel (alternative) | Free tier, global CDN, Git-based CI/CD |
| Language | TypeScript | Type safety across Astro components and content schemas |

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                         │
│                                                                 │
│  Static HTML/CSS/JS (Astro Islands)                             │
│  React components hydrated client-side:                         │
│    - HamburgerMenu                                              │
│    - PerformanceFilter                                          │
│    - JoinForm / BookingForm                                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Netlify / Vercel CDN (Static Hosting)              │
│                                                                 │
│  dist/ (pre-built static files)                                 │
│  - HTML pages                                                   │
│  - CSS bundle                                                   │
│  - JS bundles (React islands only)                              │
│  - public/ assets (sitemap, robots.txt, placeholders)           │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Build time
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Astro Build System                           │
│                                                                 │
│  src/pages/        → HTML pages                                 │
│  src/content/      → Content Collections (Zod-validated)        │
│  src/components/   → Astro + React components                   │
│  src/layouts/      → BaseLayout                                 │
│  src/assets/       → Local images (processed to WebP)           │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Runtime (form submissions)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AWS Infrastructure                           │
│                                                                 │
│  API Gateway (HTTPS POST /contact, /booking)                    │
│       │                                                         │
│       ▼                                                         │
│  Lambda (handler.js) — validates, formats, sends email          │
│       │                                                         │
│       ▼                                                         │
│  SES — delivers HTML email to choir inbox                       │
│                                                                 │
│  S3 — media assets (images, audio)                              │
│    /team/          → team member photos                         │
│    /performances/  → audio recordings                           │
│    /gallery/       → choir event photos                         │
└─────────────────────────────────────────────────────────────────┘
```

### Build Pipeline

```
npm run build
    │
    ├── Astro reads src/content/config.ts (Zod schema validation)
    │       └── Fails fast if any content entry violates schema
    │
    ├── Astro processes src/pages/ → HTML files in dist/
    │       └── Inlines critical CSS, defers non-critical
    │
    ├── Astro processes src/assets/ → WebP images with width/height
    │
    ├── @astrojs/sitemap generates public/sitemap.xml
    │
    └── TailwindCSS purges unused classes → minimal CSS bundle
```

---

## Components and Interfaces

### File Structure

```
midlands-african-choir-website/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── netlify.toml
├── vercel.json
├── .env.example
├── .gitignore
├── README.md
│
├── public/
│   ├── robots.txt
│   ├── sitemap.xml                    (generated by @astrojs/sitemap)
│   ├── impact-report.pdf              (placeholder)
│   └── images/
│       └── placeholders/
│           ├── hero-home.webp
│           ├── hero-about.webp
│           ├── hero-join.webp
│           ├── hero-book.webp
│           ├── hero-funding.webp
│           ├── team-placeholder.svg
│           └── gallery-placeholder.webp
│
├── src/
│   ├── assets/
│   │   ├── logo.svg
│   │   ├── patterns/
│   │   │   ├── kente-divider.svg
│   │   │   └── adinkra-accent.svg
│   │   └── team/                      (local team member photos)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── HamburgerMenu.tsx      (React island)
│   │   ├── home/
│   │   │   ├── Hero.astro
│   │   │   ├── AboutSummary.astro
│   │   │   ├── LatestPerformances.astro
│   │   │   ├── JoinCTA.astro
│   │   │   └── ImpactStats.astro
│   │   ├── about/
│   │   │   ├── OurStory.astro
│   │   │   ├── MissionValues.astro
│   │   │   ├── CommunityPartnerships.astro
│   │   │   └── Testimonials.astro
│   │   ├── team/
│   │   │   └── TeamCard.astro
│   │   ├── performances/
│   │   │   ├── PerformanceCard.astro
│   │   │   └── PerformanceFilter.tsx  (React island)
│   │   ├── forms/
│   │   │   ├── JoinForm.tsx           (React island)
│   │   │   └── BookingForm.tsx        (React island)
│   │   └── shared/
│   │       ├── PatternDivider.astro
│   │       ├── SectionHero.astro
│   │       └── SEOHead.astro
│   │
│   ├── content/
│   │   ├── config.ts                  (Zod schemas)
│   │   ├── team/
│   │   │   ├── 01-director.md
│   │   │   └── 02-conductor.md
│   │   └── performances/
│   │       ├── 2024-christmas-concert.md
│   │       └── 2024-summer-festival.md
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro                (Home)
│   │   ├── about.astro
│   │   ├── team.astro
│   │   ├── performances.astro
│   │   ├── join.astro
│   │   ├── book.astro
│   │   └── funding.astro
│   │
│   └── styles/
│       └── global.css                 (Tailwind directives + font imports)
│
└── lambda/
    ├── handler.js
    ├── package.json
    └── README.md
```

### Component Hierarchy

```
BaseLayout.astro
├── SEOHead.astro          (slot: head metadata)
├── Header.astro
│   └── HamburgerMenu.tsx  (client:load — React island)
├── <slot />               (page content)
└── Footer.astro

index.astro (Home)
├── BaseLayout
│   ├── Hero.astro
│   ├── AboutSummary.astro
│   ├── LatestPerformances.astro
│   │   └── PerformanceCard.astro (×3)
│   ├── JoinCTA.astro
│   └── ImpactStats.astro

performances.astro
├── BaseLayout
│   ├── SectionHero.astro
│   ├── PerformanceFilter.tsx  (client:load — React island)
│   └── PerformanceCard.astro (×n, passed as props to filter)

team.astro
├── BaseLayout
│   └── TeamCard.astro (×n, sorted by order then name)

join.astro
├── BaseLayout
│   ├── SectionHero.astro
│   ├── JoinForm.tsx           (client:load — React island)
│   └── WhatToExpect.astro

book.astro
├── BaseLayout
│   ├── SectionHero.astro
│   ├── BookingForm.tsx        (client:load — React island)
│   ├── WhyBookUs.astro
│   └── PreviousClients.astro
```

### Key Component Designs

#### BaseLayout.astro

```astro
---
interface Props {
  title: string;           // page title (max 60 chars)
  description: string;     // meta description (max 160 chars)
  ogImage?: string;        // absolute URL, min 1200×630px
  canonicalPath: string;   // e.g. "/about"
}
const { title, description, ogImage, canonicalPath } = Astro.props;
const siteUrl = 'https://www.themidlandsafricanchoir.co.uk';
const canonical = `${siteUrl}${canonicalPath}`;
---
<html lang="en">
  <head>
    <SEOHead {title} {description} {ogImage} {canonical} />
  </head>
  <body class="bg-cream font-sans text-navy">
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

#### Header.astro

The header renders the logo, site name, and desktop nav links. On mobile it renders the hamburger button and mounts the `HamburgerMenu` React island.

```astro
---
const navLinks = [
  { href: '/',           label: 'Home' },
  { href: '/about',      label: 'About' },
  { href: '/team',       label: 'Meet the Team' },
  { href: '/performances', label: 'Performances' },
  { href: '/join',       label: 'Join the Choir' },
  { href: '/book',       label: 'Book Us' },
  { href: '/funding',    label: 'Funding & Community Impact' },
];
const currentPath = Astro.url.pathname;
---
<header class="sticky top-0 z-50 bg-navy text-cream shadow-md">
  <!-- Logo + site name -->
  <!-- Desktop nav: hidden on mobile, flex on md+ -->
  <!-- Mobile: HamburgerMenu React island -->
  <HamburgerMenu links={navLinks} currentPath={currentPath} client:load />
</header>
```

#### HamburgerMenu.tsx (React Island)

```typescript
interface NavLink { href: string; label: string; }
interface Props {
  links: NavLink[];
  currentPath: string;
}
```

State: `isOpen: boolean`

Behaviour:
- Toggle `isOpen` on hamburger button click
- Close on outside click (via `useEffect` with `mousedown` listener on `document`)
- Close on `Escape` keydown (via `useEffect` with `keydown` listener)
- Close on nav link click
- Renders `aria-expanded` on the button and `aria-hidden` on the overlay

#### PerformanceCard.astro

```astro
---
interface Props {
  title: string;
  date: Date;
  description: string;
  type: 'video' | 'audio';
  youtubeId?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
}
---
```

Rendering logic:
- `type === 'video'` and valid `youtubeId` → responsive YouTube iframe (`aspect-video`)
- `type === 'audio'` and valid `audioUrl` → `<audio controls>` with fallback text
- Neither valid → "Coming Soon" label

#### JoinForm.tsx (React Island)

```typescript
interface FormState {
  fullName: string;        // max 100 chars
  email: string;           // pattern: [^@]+@[^@]+\.[^@]+
  phone: string;           // optional
  voicePart: 'Soprano' | 'Alto' | 'Tenor' | 'Bass' | 'Unsure';
  experience: string;      // optional, max 500 chars
  hearAboutUs: 'Social Media' | 'Friend/Family' | 'Event' | 'Other';
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
```

Validation runs on submit (not on change) to avoid premature error messages. Each invalid field gets an error message rendered directly below it via `aria-describedby`.

#### BookingForm.tsx (React Island)

```typescript
interface FormState {
  orgName: string;         // max 100 chars
  email: string;
  phone: string;           // 7–15 digits, optional spaces/hyphens/leading +
  eventType: 'Wedding' | 'Corporate' | 'Festival' | 'Community' | 'Religious' | 'Other';
  eventDate: string;       // ISO date string, must be > today
  eventLocation: string;   // max 200 chars
  audienceSize: 'Under 50' | '50–200' | '200–500' | '500+';
  additionalRequirements: string; // optional, max 1000 chars
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
```

Phone validation regex: `/^\+?[\d\s\-]{7,15}$/`

Date validation: `new Date(eventDate) > new Date()` (at least 1 day in the future)

#### PerformanceFilter.tsx (React Island)

```typescript
type FilterType = 'all' | 'video' | 'audio';

interface Props {
  performances: PerformanceEntry[];  // passed from Astro at build time
}
```

State: `activeFilter: FilterType`

Renders all `PerformanceCard` components client-side, filtering by `type`. The active filter button is visually distinguished via a different background colour from the African palette.

---

## Data Models

### Content Collection: `team`

Defined in `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const teamCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name:  z.string(),
    role:  z.string(),
    bio:   z.string().max(150 * 7), // ~150 words × avg 7 chars/word
    image: z.string().optional(),   // https:// URL or local path
    order: z.number(),
  }),
});
```

**Sorting**: Entries are sorted ascending by `order`, then alphabetically by `name` as a tiebreaker. This is applied in `team.astro` after `getCollection('team')`.

**Image resolution logic** (in `TeamCard.astro`):
```
if image starts with 'https://' → render <img src={image} loading="lazy" />
else if image is a non-empty local path → import from src/assets/team/ at build time
else → render grey silhouette SVG placeholder
```

### Content Collection: `performances`

```typescript
const performancesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title:        z.string(),
    date:         z.coerce.date(),
    description:  z.string().max(300),
    type:         z.enum(['video', 'audio']),
    youtubeId:    z.string().regex(/^[\w\-]{11}$/).optional(),
    audioUrl:     z.string().url().startsWith('https://').optional(),
    thumbnailUrl: z.string().url().startsWith('https://').optional(),
  }),
});

export const collections = {
  team: teamCollection,
  performances: performancesCollection,
};
```

**Sorting**: Entries are sorted descending by `date` (most recent first) in `performances.astro`.

### Environment Variables

Defined in `.env.example`:

```
# AWS API Gateway endpoint for form submissions
PUBLIC_API_GATEWAY_URL=https://your-api-id.execute-api.eu-west-2.amazonaws.com/prod

# AWS API Gateway endpoint for booking form (may be same or different)
PUBLIC_BOOKING_API_URL=https://your-api-id.execute-api.eu-west-2.amazonaws.com/prod/booking

# S3 bucket base URL for media assets
PUBLIC_S3_BASE_URL=https://your-bucket.s3.eu-west-2.amazonaws.com

# Site URL (used for canonical tags and OG metadata)
PUBLIC_SITE_URL=https://www.themidlandsafricanchoir.co.uk
```

All variables prefixed `PUBLIC_` are exposed to client-side code via `import.meta.env`.

### TailwindCSS Custom Palette

Defined in `tailwind.config.mjs`:

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terracotta: '#C1440E',
        gold:       '#D4A017',
        forest:     '#2D6A4F',
        navy:       '#1A1A2E',
        cream:      '#FAF3E0',
        burgundy:   '#6B2737',
      },
      fontFamily: {
        serif:  ['"Playfair Display"', 'Georgia', 'serif'],
        sans:   ['"Inter"', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

---

## AWS Infrastructure Design

### Overview

```
Browser
  │  POST /contact  (JSON)
  │  POST /booking  (JSON)
  ▼
API Gateway (HTTP API)
  ├── POST /contact  → Lambda (contact handler)
  └── POST /booking  → Lambda (booking handler)
                          │
                          ▼
                        SES
                    (HTML email to choir inbox)
```

A single Lambda function handles both endpoints via path-based routing, or two separate Lambda functions can be deployed — one per form type. The single-function approach is recommended to reduce operational overhead.

### API Gateway Configuration

- **Type**: HTTP API (not REST API) — lower cost, built-in CORS support
- **Stage**: `prod`
- **Routes**:
  - `POST /contact` → Lambda integration
  - `POST /booking` → Lambda integration
- **CORS configuration**:
  ```json
  {
    "allowOrigins": [
      "https://www.themidlandsafricanchoir.co.uk",
      "http://localhost:4321"
    ],
    "allowMethods": ["POST", "OPTIONS"],
    "allowHeaders": ["Content-Type"],
    "maxAge": 86400
  }
  ```

### Lambda Function Design

**Runtime**: Node.js 20.x  
**Handler**: `handler.js` → `exports.handler`  
**IAM permissions**: `ses:SendEmail` on the choir's verified SES identity

```javascript
// lambda/handler.js

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({ region: process.env.AWS_REGION || 'eu-west-2' });

const REQUIRED_FIELDS = ['name', 'email', 'message'];
const EMAIL_PATTERN = /^[^@]+@[^@]+\.[^@]+$/;
const CHOIR_EMAIL = process.env.CHOIR_EMAIL;

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': getAllowedOrigin(event),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return respond(400, { status: 'error', message: 'Invalid JSON' }, corsHeaders);
  }

  // Validate required fields
  const missing = REQUIRED_FIELDS.filter(f => !body[f]);
  if (missing.length > 0) {
    return respond(400, { status: 'error', message: 'Missing required fields' }, corsHeaders);
  }

  // Validate email
  if (!EMAIL_PATTERN.test(body.email)) {
    return respond(400, { status: 'error', message: 'Invalid email address' }, corsHeaders);
  }

  // Send email via SES (errors are swallowed — client gets 200)
  try {
    await ses.send(new SendEmailCommand(buildEmailParams(body)));
  } catch (err) {
    console.error('SES error:', err);
    // Per requirement 12.4: return 200 even on SES failure
  }

  return respond(200, { status: 'success' }, corsHeaders);
};
```

**Environment variables** (Lambda):
- `CHOIR_EMAIL` — verified SES destination address
- `AWS_REGION` — defaults to `eu-west-2`

### SES Configuration

- **Region**: `eu-west-2` (London)
- **Identity**: Verified domain `themidlandsafricanchoir.co.uk` (preferred) or verified email address
- **From address**: `noreply@themidlandsafricanchoir.co.uk`
- **Email format**: HTML with all submitted fields rendered in a styled table

### S3 Bucket Structure

```
s3://midlands-african-choir-media/
├── team/
│   ├── director.webp
│   └── conductor.webp
├── performances/
│   ├── christmas-2024.mp3
│   └── summer-festival-2024.mp3
└── gallery/
    ├── event-2024-01.webp
    └── event-2024-02.webp
```

**Bucket policy**: Public read on all objects (static media serving). No write access from the website.

---

## Deployment Architecture

### Netlify (Primary)

`netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel (Alternative)

`vercel.json`:
```json
{
  "outputDirectory": "dist",
  "buildCommand": "npm run build",
  "framework": "astro"
}
```

### CI/CD Flow

```
Git push to main
      │
      ▼
Netlify/Vercel detects push
      │
      ▼
npm run build (with env vars injected from platform dashboard)
      │
      ├── Schema validation (fails fast on bad content)
      │
      └── dist/ deployed to CDN edge nodes globally
```

### Environment Variable Management

- Development: `.env` file (gitignored)
- Production: Set via Netlify/Vercel dashboard
- `.env.example` documents all required variables with placeholder values

---

## Error Handling

### Form Submission Errors

| Scenario | Client behaviour | Lambda behaviour |
|---|---|---|
| Required field empty | Inline validation error below field; form not submitted | N/A |
| Invalid email format | Inline validation error below email field; form not submitted | Returns 400 |
| Network error / timeout | Inline error above submit button; fields preserved | N/A |
| API Gateway 4xx | Inline error above submit button; fields preserved | Returns 400 |
| API Gateway 5xx | Inline error above submit button; fields preserved | Returns 500 |
| SES failure | Success shown to user (per Req 12.4) | Logs error; returns 200 |

### Content Collection Errors

- Invalid schema at build time → Astro build fails with a descriptive Zod error
- Missing required field → Build fails; developer must fix content entry
- Invalid `youtubeId` format → Build fails (Zod regex validation)

### Image Loading Errors

- S3 URL unreachable → Browser renders broken image icon (out of scope per Req 13.5)
- Local asset missing → Astro build fails with import error

### Navigation Errors

- 404 pages → Netlify/Vercel serve a default 404 page (can be customised with `src/pages/404.astro`)

---

## Testing Strategy

### Unit Tests

Use **Vitest** (native Astro/Vite ecosystem) for:
- Lambda handler validation logic (pure functions)
- Form validation utility functions
- Content collection sorting logic (team sort, performance sort)
- `youtubeId` regex validation
- Phone number regex validation
- Email pattern validation

### Property-Based Tests

Use **fast-check** (TypeScript-native PBT library) for the correctness properties defined below. Each property test runs a minimum of **100 iterations**.

Tag format for each test: `// Feature: midlands-african-choir-website, Property N: <property_text>`

### Integration Tests

- Lambda handler end-to-end with a mocked SES client (1–3 examples per scenario)
- API Gateway CORS headers (verify allowed origins)

### Smoke Tests

- Astro build completes without errors (`npm run build`)
- All seven pages exist in `dist/`
- `sitemap.xml` lists all seven page URLs

### Accessibility

- Manual testing with VoiceOver (macOS) and NVDA (Windows)
- Automated axe-core scan via `@axe-core/playwright` on key pages
- All interactive elements have accessible names and ARIA attributes

### Performance

- Lighthouse CI on production build for Home, Performances, and Meet the Team pages
- Target: Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90


---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: No Inline Colour Styles on Any Page

*For any* built HTML page in the `dist/` directory, no HTML element on that page should have an inline `style` attribute that sets `background-color`, `color`, or `border-color`. All colour styling must be applied exclusively via TailwindCSS utility classes.

**Validates: Requirements 2.2**

---

### Property 2: Every Page Contains Navigation Links to All Seven Pages

*For any* built HTML page in the `dist/` directory, the navigation header should contain anchor elements linking to all seven pages: Home (`/`), About (`/about`), Meet the Team (`/team`), Performances (`/performances`), Join the Choir (`/join`), Book Us (`/book`), and Funding & Community Impact (`/funding`).

**Validates: Requirements 3.1**

---

### Property 3: Active Navigation Link Is Visually Distinct

*For any* built HTML page, the navigation link corresponding to the current page should have a CSS class or attribute that differs from the inactive navigation links in at least one of: `font-weight`, `text-decoration`, or `color`-related class.

**Validates: Requirements 3.2**

---

### Property 4: Every Page Contains a Complete Footer

*For any* built HTML page in the `dist/` directory, the `<footer>` element should contain the choir name, the current calendar year as the copyright year, links to Facebook, Instagram, and YouTube, and a contact email address.

**Validates: Requirements 3.7**

---

### Property 5: Latest Performances Displays the Three Most Recent Entries

*For any* array of performance entries (with at least three entries), the Latest Performances section on the Home page should display exactly the three entries with the most recent dates, and no entry with an older date should appear in place of a more recent one.

**Validates: Requirements 4.3**

---

### Property 6: Team Member Cards Render All Required Fields

*For any* valid team member content collection entry (with `name`, `role`, `bio`, and `order` fields), the rendered team card should contain the member's name, role, bio text, and either: a photo `<img>` with `alt` text of "Photo of [name]" (when an image is provided), or a silhouette SVG placeholder with `alt` text of "Team member photo placeholder" (when no image is provided).

**Validates: Requirements 6.3, 6.6**

---

### Property 7: Team Members Are Sorted by Order Then Name

*For any* array of team member entries, the sorted display order should be ascending by the `order` field; for any two entries sharing the same `order` value, the entry whose `name` comes first alphabetically should appear first.

**Validates: Requirements 6.7**

---

### Property 8: Performances Are Sorted Descending by Date

*For any* array of performance entries, the sorted display order should be descending by `date` — that is, for any two adjacent entries in the rendered list, the first entry's date should be greater than or equal to the second entry's date.

**Validates: Requirements 7.5**

---

### Property 9: Form Validation Rejects Invalid Input Without Submitting

*For any* Join the Choir form submission where at least one required field is empty, the `email` field does not match the pattern `[^@]+@[^@]+\.[^@]+`, or any field value exceeds its character limit (Full Name > 100 chars, Previous Choir Experience > 500 chars), the form should not dispatch a network request and should display at least one validation error message.

**Validates: Requirements 8.6, 8.8**

---

### Property 10: Booking Form Validation Rejects Invalid Input Without Submitting

*For any* Book Us form submission where at least one required field is empty, the `email` field is invalid, the `phone` field does not match the pattern `/^\+?[\d\s\-]{7,15}$/`, or the `eventDate` is not at least one day in the future, the form should not dispatch a network request and should display an error message.

**Validates: Requirements 9.6**

---

### Property 11: Every Page Contains Complete SEO Metadata and Canonical Tag

*For any* built HTML page in the `dist/` directory, the `<head>` element should contain: a `<title>` tag with content of 60 characters or fewer, a `<meta name="description">` tag with content of 160 characters or fewer, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`), Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`), and a `<link rel="canonical">` tag pointing to the page's absolute URL on `https://www.themidlandsafricanchoir.co.uk`.

**Validates: Requirements 11.1, 11.7**

---

### Property 12: Every Page Uses Semantic HTML5 Elements

*For any* built HTML page in the `dist/` directory, the page should contain at minimum one each of: `<header>`, `<nav>`, `<main>`, `<section>`, and `<footer>` elements.

**Validates: Requirements 11.2**

---

### Property 13: All Images Have Explicit Dimensions and Non-Empty Alt Text

*For any* `<img>` element on any built HTML page, the element should have a `width` attribute with a value greater than zero, a `height` attribute with a value greater than zero, and a non-empty `alt` attribute.

**Validates: Requirements 11.5**

---

### Property 14: Lambda Returns 400 for Any Invalid Request

*For any* request to the Lambda handler where the JSON body is missing one or more of the required fields (`name`, `email`, `message`), or where the `email` field does not match the pattern `[^@]+@[^@]+\.[^@]+`, the Lambda should return an HTTP 400 response with a JSON body containing `{"status": "error"}` and should not invoke SES.

**Validates: Requirements 12.7, 12.8**

---

### Property 15: Lambda Returns 200 for Any Valid Request

*For any* request to the Lambda handler where the JSON body is parseable and contains non-empty `name`, `email` (matching `[^@]+@[^@]+\.[^@]+`), and `message` fields, the Lambda should return an HTTP 200 response with a JSON body of `{"status": "success"}` — regardless of whether SES succeeds or fails.

**Validates: Requirements 12.3, 12.4**
