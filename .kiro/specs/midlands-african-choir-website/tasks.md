d# Implementation Plan: Midlands African Choir UK Website

## Overview

Build a professional, grant-ready static website using Astro 4.x and TailwindCSS 3.x. The implementation proceeds in layers: project scaffolding and design system first, then shared layout components, then page-by-page content, then interactive React islands, and finally the AWS Lambda backend. Each layer builds on the previous, ensuring no orphaned code.

## Tasks

- [x] 1. Scaffold project structure and configuration files
  - Initialise Astro project with `npm create astro@latest` using the minimal template
  - Add `@astrojs/react`, `@astrojs/tailwind`, `@astrojs/sitemap` integrations to `astro.config.mjs`
  - Set `output: 'static'` in `astro.config.mjs`
  - Create `tailwind.config.mjs` with the African palette (`terracotta`, `gold`, `forest`, `navy`, `cream`, `burgundy`), Playfair Display serif font stack, and Inter sans-serif font stack
  - Create `tsconfig.json` with strict TypeScript settings
  - Create `netlify.toml` with build command, publish directory (`dist`), and Node.js 20
  - Create `vercel.json` with `outputDirectory: "dist"`, `buildCommand`, and `framework: "astro"`
  - Create `.env.example` listing `PUBLIC_API_GATEWAY_URL`, `PUBLIC_BOOKING_API_URL`, `PUBLIC_S3_BASE_URL`, `PUBLIC_SITE_URL`
  - Create `.gitignore` excluding `node_modules/`, `dist/`, `.env`, `.env.*`
  - Create `src/styles/global.css` with Tailwind directives and Google Fonts imports for Playfair Display and Inter
  - Create `public/robots.txt` allowing all crawlers and referencing the sitemap URL
  - Create placeholder `public/impact-report.pdf`
  - Create `public/images/placeholders/` directory with placeholder SVG/WebP files: `hero-home.webp`, `hero-about.webp`, `hero-join.webp`, `hero-book.webp`, `hero-funding.webp`, `team-placeholder.svg`, `gallery-placeholder.webp`
  - Create `src/assets/logo.svg` (placeholder choir logo)
  - Create `src/assets/patterns/kente-divider.svg` and `src/assets/patterns/adinkra-accent.svg` (geometric SVG patterns)
  - _Requirements: 1.1, 1.2, 2.1, 2.3, 2.4, 14.1, 14.2, 14.5, 14.6_

- [x] 2. Define content collections and data models
  - [x] 2.1 Create `src/content/config.ts` with Zod schemas for `team` and `performances` collections
    - `team` schema: `name` (string), `role` (string), `bio` (string, max ~1050 chars), `image` (string, optional), `order` (number)
    - `performances` schema: `title` (string), `date` (coerce.date), `description` (string, max 300), `type` (enum `video`|`audio`), `youtubeId` (regex `/^[\w\-]{11}$/`, optional), `audioUrl` (url, startsWith `https://`, optional), `thumbnailUrl` (url, startsWith `https://`, optional)
    - Export `collections` object
    - _Requirements: 1.3, 6.2, 7.2, 13.7_

  - [ ]* 2.2 Write property test for content collection schema validation
    - **Property 8: Performances Are Sorted Descending by Date** (sorting logic test)
    - **Property 7: Team Members Are Sorted by Order Then Name**
    - **Validates: Requirements 6.7, 7.5**
    - Use fast-check to generate arbitrary arrays of team/performance entries and assert sort invariants

  - [x] 2.3 Create sample content entries
    - Create `src/content/team/01-director.md` and `src/content/team/02-conductor.md` with all required fields
    - Create `src/content/performances/2024-christmas-concert.md` (type: video) and `src/content/performances/2024-summer-festival.md` (type: audio) with all required fields
    - _Requirements: 1.3, 6.1, 7.1_

- [x] 3. Build shared layout and SEO components
  - [x] 3.1 Create `src/components/shared/SEOHead.astro`
    - Accept props: `title` (max 60 chars), `description` (max 160 chars), `ogImage` (optional), `canonical` (absolute URL)
    - Render `<title>`, `<meta name="description">`, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`), Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`), and `<link rel="canonical">`
    - _Requirements: 11.1, 11.7_

  - [ ]* 3.2 Write property test for SEO metadata completeness
    - **Property 11: Every Page Contains Complete SEO Metadata and Canonical Tag**
    - **Validates: Requirements 11.1, 11.7**
    - Parse built HTML pages in `dist/` and assert all required head tags are present with correct constraints

  - [x] 3.3 Create `src/components/shared/PatternDivider.astro`
    - Render the kente-divider or adinkra-accent SVG as a section divider
    - Accept optional `variant` prop to switch between patterns
    - _Requirements: 2.4, 5.6_

  - [x] 3.4 Create `src/components/shared/SectionHero.astro`
    - Accept props: `title`, `subtitle` (optional), `backgroundImage`
    - Render `<h1>` with serif font, background image with `loading="eager"` and `fetchpriority="high"`
    - _Requirements: 5.1, 8.1, 9.1, 10.1_

  - [x] 3.5 Create `src/components/layout/Footer.astro`
    - Render choir name, current calendar year as copyright year (via `new Date().getFullYear()`)
    - Render social media links for Facebook, Instagram, YouTube
    - Render contact email address
    - Use semantic `<footer>` element
    - _Requirements: 3.7, 11.2_

  - [ ]* 3.6 Write property test for footer completeness
    - **Property 4: Every Page Contains a Complete Footer**
    - **Validates: Requirements 3.7**
    - Parse built HTML pages and assert footer contains choir name, current year, three social links, and email

  - [x] 3.7 Create `src/components/layout/HamburgerMenu.tsx` (React island)
    - Accept props: `links: NavLink[]`, `currentPath: string`
    - State: `isOpen: boolean`
    - Toggle on hamburger button click; close on outside click (`mousedown` listener), `Escape` keydown, and nav link click
    - Render `aria-expanded` on button and `aria-hidden` on overlay
    - Minimum 44×44px tap target on hamburger button
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 2.5_

  - [x] 3.8 Create `src/components/layout/Header.astro`
    - Render logo (`src/assets/logo.svg`), site name, and desktop nav links (hidden on mobile, flex on `md:`)
    - Mount `HamburgerMenu` React island with `client:load`
    - Mark active page link with a visually distinct class (e.g. `font-bold` or `text-gold`) based on `Astro.url.pathname`
    - Use semantic `<header>` and `<nav>` elements
    - _Requirements: 3.1, 3.2, 3.3, 11.2_

  - [ ]* 3.9 Write property test for navigation completeness and active link
    - **Property 2: Every Page Contains Navigation Links to All Seven Pages**
    - **Property 3: Active Navigation Link Is Visually Distinct**
    - **Validates: Requirements 3.1, 3.2**
    - Parse built HTML pages and assert all seven nav hrefs are present; assert active link has a distinct class

  - [x] 3.10 Create `src/layouts/BaseLayout.astro`
    - Accept props: `title`, `description`, `ogImage` (optional), `canonicalPath`
    - Compose `SEOHead`, `Header`, `<main><slot /></main>`, `Footer`
    - Apply `bg-cream font-sans text-navy` body classes
    - _Requirements: 3.8, 11.2_

- [x] 4. Checkpoint — verify build and layout
  - Run `npm run build` and confirm `dist/` is produced without errors
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Build Home page components and page
  - [ ] 5.1 Create `src/components/home/Hero.astro`
    - Full-viewport hero with background image (`loading="eager"`, `fetchpriority="high"`)
    - Choir name as `<h1>` (serif font), tagline (≤15 words)
    - Two CTA buttons: link to `/performances` and `/join`
    - _Requirements: 4.1_

  - [ ] 5.2 Create `src/components/home/AboutSummary.astro`
    - 2–3 sentence summary paragraph and "Learn More" link to `/about`
    - _Requirements: 4.2_

  - [ ] 5.3 Create `src/components/performances/PerformanceCard.astro`
    - Accept props: `title`, `date`, `description`, `type`, `youtubeId?`, `audioUrl?`, `thumbnailUrl?`
    - `type === 'video'` + valid `youtubeId` → responsive YouTube iframe (`aspect-video`) with `thumbnailUrl` as poster
    - `type === 'audio'` + valid `audioUrl` → `<audio controls>` with fallback text "Your browser does not support audio playback."
    - Neither valid → "Coming Soon" label
    - _Requirements: 7.3, 7.4, 7.7, 13.6_

  - [ ] 5.4 Create `src/components/home/LatestPerformances.astro`
    - Fetch all performances via `getCollection('performances')`, sort descending by date, take first three
    - Render three `PerformanceCard` components
    - _Requirements: 4.3_

  - [ ]* 5.5 Write property test for latest performances selection
    - **Property 5: Latest Performances Displays the Three Most Recent Entries**
    - **Validates: Requirements 4.3**
    - Use fast-check to generate arrays of ≥3 performance entries and assert the three most recent are selected

  - [ ] 5.6 Create `src/components/home/JoinCTA.astro`
    - Background colour from African palette (e.g. `bg-terracotta`)
    - Button linking to `/join`
    - _Requirements: 4.4_

  - [ ] 5.7 Create `src/components/home/ImpactStats.astro`
    - Display at least three key figures (years active, members, events performed)
    - Each figure rendered at minimum `text-4xl` (≥2rem / 32px)
    - _Requirements: 4.5_

  - [ ] 5.8 Create `src/pages/index.astro` (Home page)
    - Compose `BaseLayout` with `Hero`, `AboutSummary`, `LatestPerformances`, `JoinCTA`, `ImpactStats`
    - Include `PatternDivider` between sections
    - Set unique SEO title (≤60 chars) and description (≤160 chars)
    - _Requirements: 4.1–4.6, 11.1_

  - [ ]* 5.9 Write property test for no inline colour styles
    - **Property 1: No Inline Colour Styles on Any Page**
    - **Validates: Requirements 2.2**
    - Parse all built HTML pages in `dist/` and assert no `style` attribute contains `background-color`, `color`, or `border-color`

  - [ ]* 5.10 Write property test for semantic HTML5 elements
    - **Property 12: Every Page Uses Semantic HTML5 Elements**
    - **Validates: Requirements 11.2**
    - Parse all built HTML pages and assert each contains `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`

- [ ] 6. Build About page components and page
  - [ ] 6.1 Create `src/components/about/OurStory.astro`
    - At least three paragraphs of placeholder body text (founding, growth, mission)
    - _Requirements: 5.2_

  - [ ] 6.2 Create `src/components/about/MissionValues.astro`
    - At least three core values as styled cards or list items with icons
    - _Requirements: 5.3_

  - [ ] 6.3 Create `src/components/about/CommunityPartnerships.astro`
    - At least three partner organisations as logo placeholders or named entries
    - _Requirements: 5.4_

  - [ ] 6.4 Create `src/components/about/Testimonials.astro`
    - At least two placeholder testimonial quotes attributed to named individuals with roles
    - _Requirements: 5.5_

  - [ ] 6.5 Create `src/pages/about.astro`
    - Compose `BaseLayout` with `SectionHero`, `OurStory`, `MissionValues`, `CommunityPartnerships`, `Testimonials`
    - Insert `PatternDivider` between each of the five content sections
    - Set unique SEO title and description
    - _Requirements: 5.1–5.6, 11.1_

- [ ] 7. Build Meet the Team page
  - [ ] 7.1 Create `src/components/team/TeamCard.astro`
    - Accept props matching the team content collection schema
    - Render photo `<img>` with `alt="Photo of [name]"` when image is provided (S3 URL → direct `src`; local path → build-time import from `src/assets/team/`)
    - Render grey silhouette SVG placeholder with `alt="Team member photo placeholder"` when image is absent
    - Render `loading="lazy"` and explicit `width`/`height` on all images
    - Render member name, role, and bio
    - _Requirements: 6.3, 6.4, 6.5, 6.6, 11.5, 13.4_

  - [ ]* 7.2 Write property test for team card rendering
    - **Property 6: Team Member Cards Render All Required Fields**
    - **Validates: Requirements 6.3, 6.6**
    - Use fast-check to generate valid team entries and assert rendered card contains name, role, bio, and correct image/placeholder

  - [ ] 7.3 Create `src/pages/team.astro`
    - Fetch all team members via `getCollection('team')`
    - Sort ascending by `order`, then alphabetically by `name` as tiebreaker
    - Render `TeamCard` for each member
    - Set unique SEO title and description
    - _Requirements: 6.1, 6.7, 11.1_

  - [ ]* 7.4 Write property test for team sort order
    - **Property 7: Team Members Are Sorted by Order Then Name**
    - **Validates: Requirements 6.7**
    - Use fast-check to generate arbitrary team arrays and assert sort invariant holds

- [ ] 8. Build Performances page with filter
  - [ ] 8.1 Create `src/components/performances/PerformanceFilter.tsx` (React island)
    - Accept prop: `performances: PerformanceEntry[]` (passed from Astro at build time)
    - State: `activeFilter: 'all' | 'video' | 'audio'`
    - Render filter toggle buttons (All, Video, Audio); active button visually distinct via African palette class
    - Render filtered `PerformanceCard` components without page reload
    - _Requirements: 7.6_

  - [ ] 8.2 Create `src/pages/performances.astro`
    - Fetch all performances via `getCollection('performances')`, sort descending by date
    - Pass sorted array to `PerformanceFilter` React island with `client:load`
    - Set unique SEO title and description
    - _Requirements: 7.1, 7.5, 11.1_

  - [ ]* 8.3 Write property test for performance sort order
    - **Property 8: Performances Are Sorted Descending by Date**
    - **Validates: Requirements 7.5**
    - Use fast-check to generate arbitrary performance arrays and assert descending date sort invariant

- [ ] 9. Build Join the Choir page and form
  - [ ] 9.1 Create `src/components/forms/JoinForm.tsx` (React island)
    - Fields: Full Name (text, max 100), Email (email), Phone (tel, optional), Voice Part (select), Previous Choir Experience (textarea, optional, max 500), How Did You Hear About Us (select)
    - Enforce character limits at point of input (maxLength attributes)
    - On submit: validate all required fields and email pattern `[^@]+@[^@]+\.[^@]+`; display inline error below each invalid field via `aria-describedby`; do not submit if invalid
    - On valid submit: POST JSON to `import.meta.env.PUBLIC_API_GATEWAY_URL`
    - On 200 response: replace form with success message
    - On non-200 or network error: display inline error above submit button; preserve field values
    - State: `FormState`, `SubmitStatus` (`idle` | `submitting` | `success` | `error`)
    - _Requirements: 8.2, 8.3, 8.4, 8.5, 8.6, 8.8_

  - [ ]* 9.2 Write property test for join form validation
    - **Property 9: Form Validation Rejects Invalid Input Without Submitting**
    - **Validates: Requirements 8.6, 8.8**
    - Use fast-check to generate invalid form states (empty required fields, invalid email, over-limit strings) and assert no network request is dispatched and at least one error message is shown

  - [ ] 9.3 Create `src/pages/join.astro`
    - Compose `BaseLayout` with `SectionHero`, `JoinForm` (client:load), and a "What to Expect" section (placeholder text for rehearsal schedule, location, membership process)
    - Set unique SEO title and description
    - _Requirements: 8.1, 8.7, 11.1_

- [ ] 10. Build Book Us page and form
  - [ ] 10.1 Create `src/components/forms/BookingForm.tsx` (React island)
    - Fields: Organisation/Name (text, max 100), Email (email), Phone (tel, required, regex `/^\+?[\d\s\-]{7,15}$/`), Event Type (select), Event Date (date, must be > today), Event Location (text, max 200), Expected Audience Size (select), Additional Requirements (textarea, optional, max 1000)
    - On submit: validate all required fields; email pattern; phone regex; event date > today; display general error at top of form if invalid; do not submit
    - On valid submit: POST JSON to `import.meta.env.PUBLIC_BOOKING_API_URL`
    - On 200 response: display confirmation message (response within 5 business days)
    - On non-200 or network error: display inline error above submit button; preserve field values
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 10.2 Write property test for booking form validation
    - **Property 10: Booking Form Validation Rejects Invalid Input Without Submitting**
    - **Validates: Requirements 9.6**
    - Use fast-check to generate invalid booking form states (empty fields, invalid email, invalid phone, past date) and assert no network request is dispatched and an error message is shown

  - [ ] 10.3 Create `src/components/book/WhyBookUs.astro`
    - At least three value propositions as styled cards with icons
    - _Requirements: 9.7_

  - [ ] 10.4 Create `src/components/book/PreviousClients.astro`
    - At least three entries as logo images or text names
    - _Requirements: 9.8_

  - [ ] 10.5 Create `src/pages/book.astro`
    - Compose `BaseLayout` with `SectionHero`, `BookingForm` (client:load), `WhyBookUs`, `PreviousClients`
    - Set unique SEO title and description
    - _Requirements: 9.1, 9.7, 9.8, 11.1_

- [ ] 11. Build Funding & Community Impact page
  - [ ] 11.1 Create `src/pages/funding.astro`
    - Compose `BaseLayout` with `SectionHero` (subtitle emphasising community impact)
    - "Impact Statistics" section: at least five metrics as prominent callout figures with labels (≤50 chars each)
    - "Our Work in the Community" section: at least three programme entries each with title, ≥30-word description, and placeholder image
    - "Funding Partners & Supporters" section: at least three entries as logo images or text names
    - "Download Our Impact Report" section: button linking to `/impact-report.pdf`
    - "Get in Touch for Funding Enquiries" section: `mailto:` link and 20–80 word invitation paragraph
    - "Testimonials from Partners" section: at least two quotes attributed to named sources with role/organisation
    - Set unique SEO title and description
    - _Requirements: 10.1–10.7, 11.1_

- [ ] 12. Checkpoint — full site build and smoke tests
  - Run `npm run build` and confirm all seven pages exist in `dist/`
  - Confirm `dist/sitemap.xml` lists all seven page URLs
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement image and media handling
  - [ ] 13.1 Audit all `<img>` elements across all pages and components
    - Ensure every `<img>` has explicit non-zero `width` and `height` attributes and a non-empty `alt` attribute
    - Ensure local images use Astro's `<Image>` component (outputs WebP with dimensions)
    - Ensure S3 URL images have `loading="lazy"` and explicit `width`/`height`
    - _Requirements: 11.5, 13.1, 13.4_

  - [ ]* 13.2 Write property test for image attributes
    - **Property 13: All Images Have Explicit Dimensions and Non-Empty Alt Text**
    - **Validates: Requirements 11.5**
    - Parse all built HTML pages and assert every `<img>` has `width > 0`, `height > 0`, and non-empty `alt`

- [ ] 14. Implement AWS Lambda form backend
  - [ ] 14.1 Create `lambda/handler.js`
    - Import `@aws-sdk/client-ses`; initialise `SESClient` with `eu-west-2` region
    - Handle OPTIONS preflight: return 200 with CORS headers
    - Parse JSON body; return 400 `{"status":"error","message":"Invalid JSON"}` on parse failure
    - Validate required fields (`name`, `email`, `message`); return 400 `{"status":"error","message":"Missing required fields"}` if any missing
    - Validate email pattern `/^[^@]+@[^@]+\.[^@]+$/`; return 400 `{"status":"error","message":"Invalid email address"}` if invalid
    - Send HTML email via SES with all submitted fields in a styled table
    - Return 200 `{"status":"success"}` on SES success or SES error (log error, swallow exception)
    - Set CORS `Access-Control-Allow-Origin` to allowed origins (`https://www.themidlandsafricanchoir.co.uk`, `http://localhost:4321`)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.7, 12.8_

  - [ ]* 14.2 Write property test for Lambda invalid request handling
    - **Property 14: Lambda Returns 400 for Any Invalid Request**
    - **Validates: Requirements 12.7, 12.8**
    - Use fast-check to generate requests with missing/invalid fields and assert 400 response with `{"status":"error"}` and no SES invocation

  - [ ]* 14.3 Write property test for Lambda valid request handling
    - **Property 15: Lambda Returns 200 for Any Valid Request**
    - **Validates: Requirements 12.3, 12.4**
    - Use fast-check to generate valid requests (non-empty name, valid email, non-empty message) and assert 200 `{"status":"success"}` regardless of SES mock outcome

  - [ ] 14.4 Create `lambda/package.json` with `@aws-sdk/client-ses` dependency (pinned version)
    - _Requirements: 12.6_

  - [ ] 14.5 Create `lambda/README.md` documenting Lambda deployment steps
    - Cover: IAM role setup, SES identity verification, environment variables (`CHOIR_EMAIL`, `AWS_REGION`), API Gateway route configuration, CORS settings, and deployment via AWS CLI or console
    - _Requirements: 12.6_

- [ ] 15. Write README.md and finalise documentation
  - [ ] 15.1 Create `README.md` at project root
    - Sections: Prerequisites, Installation, Development, Build, Deployment (Netlify and Vercel — connecting repo, build settings, env vars, custom domain), Custom Domain (CNAME and A record options), AWS S3 Media (bucket naming convention, folder structure `/team/`, `/performances/`, `/gallery/`, step-by-step for updating a content entry to reference a new S3 URL), AWS Lambda Forms
    - _Requirements: 1.5, 13.3, 14.3, 14.4_

- [ ] 16. Final checkpoint — full validation
  - Run `npm run build` and confirm zero errors
  - Run full test suite (`npx vitest --run`) and confirm all tests pass
  - Verify `dist/sitemap.xml` and `dist/robots.txt` are present
  - Verify `.env.example` lists every `import.meta.env` variable referenced in the codebase
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- All property-based tests use **fast-check** with a minimum of 100 iterations per property
- All unit/property tests use **Vitest** (native Astro/Vite ecosystem)
- Each task references specific requirements for traceability
- Checkpoints (tasks 4, 12, 16) ensure incremental validation at key milestones
- The Lambda backend is self-contained in `lambda/` and deployed independently of the Astro site
- All colour styling must use TailwindCSS utility classes — no inline `style` attributes for colours
- Images served from S3 URLs are rendered directly; broken image display is browser-handled (Req 13.5)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "3.1", "3.3", "3.4"] },
    { "id": 1, "tasks": ["2.2", "2.3", "3.5", "3.7"] },
    { "id": 2, "tasks": ["3.6", "3.8"] },
    { "id": 3, "tasks": ["3.9", "3.10"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3", "6.1", "6.2", "6.3", "6.4", "7.1", "8.1", "9.1", "10.1", "10.3", "10.4", "14.1", "14.4"] },
    { "id": 5, "tasks": ["5.4", "5.6", "5.7", "7.2", "8.2", "9.2", "10.2", "14.2", "14.3"] },
    { "id": 6, "tasks": ["5.5", "5.8", "7.3", "7.4", "8.3", "9.3", "10.5", "11.1", "14.5"] },
    { "id": 7, "tasks": ["5.9", "5.10", "13.1"] },
    { "id": 8, "tasks": ["3.2", "3.6", "13.2", "15.1"] }
  ]
}
```
