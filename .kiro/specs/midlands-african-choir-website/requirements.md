# Requirements Document

## Introduction

The Midlands African Choir UK website is a professional, grant-ready static website built with Astro and TailwindCSS. It serves as the choir's primary digital presence — showcasing performances, enabling community engagement, supporting membership recruitment, and facilitating event bookings. The site must be mobile-first, visually striking with an African-inspired design language, fast-loading, and SEO-optimised. It will be hosted on Netlify or Vercel and use AWS services (S3, Lambda, API Gateway, SES) for media storage and form handling.

---

## Glossary

- **Site**: The complete Midlands African Choir UK static website
- **Astro**: The static site generator framework used to build the Site
- **TailwindCSS**: The utility-first CSS framework used for all styling
- **React_Component**: An interactive UI component written in React, embedded within Astro pages
- **Astro_Component**: A layout or presentational component written in `.astro` format
- **S3**: AWS Simple Storage Service used to host media assets (images, audio)
- **Lambda**: AWS Lambda function used to process contact and booking form submissions
- **API_Gateway**: AWS API Gateway endpoint that routes HTTP requests to Lambda
- **SES**: AWS Simple Email Service used to send email notifications from form submissions
- **Contact_Form**: The form on the Join the Choir and Book Us pages that submits to Lambda via API_Gateway
- **Hero**: The full-width banner section at the top of a page
- **Gallery**: A grid or masonry layout displaying choir member photos
- **Performance_Card**: A UI card component displaying a YouTube video embed or S3 audio player
- **SEO_Metadata**: HTML meta tags including title, description, Open Graph, and Twitter Card tags
- **African_Palette**: The custom TailwindCSS colour palette inspired by African art and textiles
- **Netlify**: The preferred static hosting platform for deployment
- **Vercel**: An alternative static hosting platform for deployment
- **CDN**: Content Delivery Network used by Netlify/Vercel to serve static assets globally

---

## Requirements

### Requirement 1: Project Structure and Build System

**User Story:** As a developer, I want a well-organised Astro project structure, so that the codebase is maintainable, scalable, and follows Astro conventions.

#### Acceptance Criteria

1. THE Site SHALL be scaffolded as an Astro project with the following top-level directories: `src/`, `public/`, and configuration files `astro.config.mjs`, `tailwind.config.mjs`, `package.json`, and `tsconfig.json`.
2. THE Site SHALL organise source files under `src/` with subdirectories: `pages/`, `components/`, `layouts/`, `assets/`, `content/`, and `styles/`.
3. THE Site SHALL include a `src/content/` directory using Astro Content Collections for structured data covering team members and performances.
4. WHEN the build command `npm run build` is executed, THE Astro build system SHALL produce a fully static output in the `dist/` directory; the `astro.config.mjs` file SHALL set `output: 'static'` to enforce this mode.
5. THE Site SHALL include a `README.md` at the project root containing the following sections: Prerequisites, Installation, Development, Build, Deployment (Netlify and Vercel), Custom Domain, AWS S3 Media, and AWS Lambda Forms.

---

### Requirement 2: African-Inspired Design System

**User Story:** As a visitor, I want a visually striking, culturally resonant design, so that the website reflects the choir's African heritage and professionalism.

#### Acceptance Criteria

1. THE Site SHALL use a custom TailwindCSS colour palette defined in `tailwind.config.mjs` containing at minimum: a deep terracotta (`#C1440E`), warm gold (`#D4A017`), forest green (`#2D6A4F`), midnight navy (`#1A1A2E`), cream white (`#FAF3E0`), and rich burgundy (`#6B2737`).
2. THE Site SHALL apply the African_Palette across all pages using Tailwind utility classes only; no HTML element on any page SHALL carry an inline `style` attribute that sets a background-color, color, or border-color value.
3. THE Site SHALL use a serif display font for all heading elements (`<h1>`–`<h4>`) and a sans-serif font for all body text, each with a CSS generic fallback stack (e.g. `serif` and `sans-serif` respectively).
4. THE Site SHALL include repeating or interlocking geometric pattern elements (SVG or CSS-based) used as section dividers or background accents on at least the Home and About pages.
5. WHEN viewed on a screen width below 768px, THE Site SHALL render all pages in a single-column layout with all interactive elements having a minimum rendered tap target size of 44×44px.
6. WHEN viewed on a screen width of exactly 768px, THE Site SHALL render the single-column mobile layout (mobile breakpoint takes precedence at the boundary).
7. WHEN viewed on a screen width above 768px, THE Site SHALL render layouts with at least two columns on pages that contain card grids or multi-item sections.

---

### Requirement 3: Navigation and Layout

**User Story:** As a visitor, I want clear, consistent navigation, so that I can find any page on the site within two clicks from any other page.

#### Acceptance Criteria

1. THE Site SHALL include a persistent navigation header on every page containing the choir logo, site name, and links to all seven pages: Home, About, Meet the Team, Performances, Join the Choir, Book Us, and Funding & Community Impact.
2. WHEN a visitor is on a given page, THE navigation header SHALL visually indicate the active page link by differing from inactive links in at least one measurable CSS attribute: font-weight, text-decoration, or color value.
3. WHEN the viewport width is below 768px, THE navigation header SHALL hide the page links from view and display a hamburger icon button; the hamburger menu SHALL be implemented as a React_Component.
4. WHEN the hamburger menu is open and the visitor taps or clicks outside the menu overlay, THE React_Component SHALL close the menu.
5. WHEN the hamburger menu is open and the visitor presses the Escape key, THE React_Component SHALL close the menu.
6. WHEN the hamburger menu is open and the visitor selects a navigation link, THE React_Component SHALL close the menu.
7. THE Site SHALL include a footer on every page containing the choir name, the current calendar year as the copyright year, social media links (Facebook, Instagram, YouTube), and a contact email address.
8. THE Site SHALL use a shared `BaseLayout` Astro_Component that wraps every page with the navigation header, footer, and SEO_Metadata slot.

---

### Requirement 4: Home Page

**User Story:** As a first-time visitor, I want an impactful home page, so that I immediately understand who the Midlands African Choir is and feel compelled to explore further.

#### Acceptance Criteria

1. THE Home Page SHALL include a full-viewport Hero section with a background image rendered with `loading="eager"` and `fetchpriority="high"`, the choir name as an `<h1>` heading, a tagline of no more than 15 words, and two call-to-action buttons linking to the Performances page and the Join the Choir page.
2. THE Home Page SHALL include an "About Us" summary section with a brief paragraph (2–3 sentences) and a "Learn More" link to the About page.
3. THE Home Page SHALL include a "Latest Performances" section displaying the three most recent Performance_Cards pulled from the performances content collection.
4. THE Home Page SHALL include a "Join Our Community" call-to-action section with a background colour from the African_Palette and a button linking to the Join the Choir page.
5. THE Home Page SHALL include a "Community Impact" statistics section displaying at least three key figures (e.g. years active, members, events performed) each rendered at a minimum font size of 2rem (32px).
6. WHEN the Home Page is loaded, THE Site SHALL render all content visible in a 1280×800 viewport without scrolling within the initial HTML payload, achieving a Cumulative Layout Shift (CLS) score of 0.1 or below as measured by Lighthouse on the production build.

---

### Requirement 5: About Page

**User Story:** As a visitor or grant assessor, I want a detailed About page, so that I can understand the choir's history, mission, values, and community role.

#### Acceptance Criteria

1. THE About Page SHALL include a Hero section with an `<h1>` page title and a choir group photograph placeholder.
2. THE About Page SHALL include a "Our Story" section with at least three paragraphs of placeholder body text describing the choir's founding, growth, and mission.
3. THE About Page SHALL include a "Our Mission & Values" section presenting at least three of the choir's core values as a styled list or card grid with icons.
4. THE About Page SHALL include a "Community Partnerships" section listing at least three organisations the choir works with, formatted as logo placeholders or named entries.
5. THE About Page SHALL include a "Testimonials" section with at least two placeholder testimonial quotes attributed to named individuals with roles.
6. THE About Page SHALL include repeating or interlocking geometric pattern elements as section dividers placed between each of the five content sections (Hero, Our Story, Mission & Values, Community Partnerships, Testimonials).

---

### Requirement 6: Meet the Team Page

**User Story:** As a visitor, I want to see the choir's leadership and members, so that I can connect with the people behind the choir.

#### Acceptance Criteria

1. THE Meet the Team Page SHALL display team member profiles sourced from an Astro Content Collection defined in `src/content/team/`.
2. THE content collection schema SHALL define the following fields for each team member entry: `name` (string, required), `role` (string, required), `bio` (string, max 150 words, required), `image` (string, optional — either an `https://` S3 URL or a local asset path), and `order` (number, required for display sorting).
3. THE Meet the Team Page SHALL render each team member as a card containing the member's photo with `alt` text of "Photo of [name]", the member's name, role, and bio.
4. WHEN a team member's `image` field contains a local asset path (not beginning with `https://`), THE Site SHALL serve the image from `src/assets/team/` at build time.
5. WHEN a team member's `image` field contains an `https://` S3 URL, THE Site SHALL render an `<img>` element with the S3 URL as `src` and `alt` text of "Photo of [name]".
6. WHEN a team member's `image` field is empty, null, or absent, THE Meet the Team Page SHALL display a grey silhouette SVG placeholder with `alt` text of "Team member photo placeholder".
7. THE Meet the Team Page SHALL sort and display team member cards in ascending order of the `order` field; where two entries share the same `order` value, they SHALL be sorted alphabetically by `name` as a tiebreaker.

---

### Requirement 7: Performances Page

**User Story:** As a visitor, I want to browse the choir's performances, so that I can watch videos and listen to audio recordings of their work.

#### Acceptance Criteria

1. THE Performances Page SHALL display performance entries sourced from an Astro Content Collection defined in `src/content/performances/`.
2. THE content collection schema SHALL define the following fields for each performance entry: `title` (string, required), `date` (date, required), `description` (string, max 300 characters, required), `type` (enum: `"video"` | `"audio"`, required), `youtubeId` (string of exactly 11 alphanumeric, hyphen, or underscore characters, optional), `audioUrl` (string beginning with `https://`, optional), and `thumbnailUrl` (string beginning with `https://`, optional).
3. WHEN a performance entry has `type: "video"` and a `youtubeId` matching the 11-character pattern, THE Performances Page SHALL render a Performance_Card containing a responsive YouTube iframe embed at `https://www.youtube.com/embed/{youtubeId}`, with the `thumbnailUrl` used as a poster image if present.
4. WHEN a performance entry has `type: "audio"` and an `audioUrl` beginning with `https://`, THE Performances Page SHALL render a Performance_Card containing an HTML5 `<audio>` element with the `controls` attribute, `src` set to the `audioUrl`, and a text fallback of "Your browser does not support audio playback."
5. THE Performances Page SHALL display performance entries sorted in descending order by `date` (most recent first).
6. THE Performances Page SHALL include a filter UI implemented as a React_Component allowing visitors to toggle between All, Video, and Audio entries without a page reload; the active filter SHALL be visually indicated.
7. IF a performance entry has no `youtubeId` matching the 11-character pattern and no `audioUrl` beginning with `https://`, THEN THE Performances Page SHALL render the Performance_Card without a media element and display a "Coming Soon" label.

---

### Requirement 8: Join the Choir Page

**User Story:** As a prospective member, I want to submit an expression of interest to join the choir, so that the choir can contact me about membership.

#### Acceptance Criteria

1. THE Join the Choir Page SHALL include a Hero section with an `<h1>` page title, a motivational paragraph, and a background image.
2. THE Join the Choir Page SHALL include a membership interest form implemented as a React_Component containing the following fields: Full Name (text, required, max 100 characters), Email Address (email, required), Phone Number (tel, optional), Voice Part (select: Soprano, Alto, Tenor, Bass, Unsure, required), Previous Choir Experience (textarea, optional, max 500 characters), and How Did You Hear About Us (select: Social Media, Friend/Family, Event, Other, required).
3. WHEN the visitor submits the form with all required fields completed and the Email Address field containing a syntactically valid email address (matching the pattern `[^@]+@[^@]+\.[^@]+`), THE React_Component SHALL send a POST request to the API_Gateway endpoint with the form data serialised as JSON.
4. WHEN the API_Gateway returns a 200 response, THE React_Component SHALL replace the form content with a success message confirming the submission was received and that the choir will be in touch.
5. IF the API_Gateway returns a non-200 response or a network error occurs, THEN THE React_Component SHALL display an inline error message above the submit button without clearing any form field values.
6. WHEN the visitor attempts to submit the form with a required field empty or the Email Address field containing an invalid email address, THE React_Component SHALL display a validation error message directly below each invalid field and SHALL NOT submit the form.
7. THE Join the Choir Page SHALL include a "What to Expect" section below the form describing the rehearsal schedule, location, and membership process as placeholder text.
8. THE Join the Choir Page form fields SHALL enforce the following character limits at the point of input: Full Name max 100 characters, Previous Choir Experience max 500 characters.

---

### Requirement 9: Book Us Page

**User Story:** As an event organiser, I want to submit a booking enquiry, so that I can request the choir to perform at my event.

#### Acceptance Criteria

1. THE Book Us Page SHALL include a Hero section with an `<h1>` page title and a background image of the choir performing.
2. THE Book Us Page SHALL include a booking enquiry form implemented as a React_Component containing the following fields: Organisation/Name (text, required, max 100 characters), Email Address (email, required), Phone Number (tel, required, 7–15 digits optionally separated by spaces, hyphens, or a leading plus sign), Event Type (select: Wedding, Corporate, Festival, Community, Religious, Other, required), Event Date (date picker, required, must be a future date at least 1 day after the current date), Event Location (text, required, max 200 characters), Expected Audience Size (select: Under 50, 50–200, 200–500, 500+, required), Additional Requirements (textarea, optional, max 1000 characters).
3. WHEN the visitor submits the form with all required fields completed and all field values valid, THE React_Component SHALL send a POST request to the API_Gateway endpoint with the form data serialised as JSON.
4. WHEN the API_Gateway returns a 200 response, THE React_Component SHALL display a confirmation message stating the enquiry was received and to expect a response within 5 business days.
5. IF the API_Gateway returns a non-200 response or a network error occurs, THEN THE React_Component SHALL display an inline error message above the submit button without clearing any form field values.
6. WHEN the visitor attempts to submit the form with a required field empty, an invalid email address, an invalid phone number, or an Event Date that is not a future date, THE React_Component SHALL display a general error message at the top of the form and SHALL NOT submit the form.
7. THE Book Us Page SHALL include a "Why Book Us" section with at least three value propositions presented as styled cards with icons.
8. THE Book Us Page SHALL include a "Previous Clients & Events" section with at least three entries, each displayed as either a visible logo image or a text name.

---

### Requirement 10: Funding & Community Impact Page

**User Story:** As a grant assessor or community partner, I want to see evidence of the choir's community impact, so that I can evaluate the choir's eligibility for funding or partnership.

#### Acceptance Criteria

1. THE Funding Page SHALL include a Hero section with an `<h1>` page title and a subtitle emphasising community impact.
2. THE Funding Page SHALL include an "Impact Statistics" section displaying at least five key metrics (e.g. years active, performances delivered, community members reached, schools visited, funds raised for charity), each rendered as a prominent callout figure with a descriptive label of no more than 50 characters.
3. THE Funding Page SHALL include a "Our Work in the Community" section with at least three entries describing specific community programmes or initiatives, each with a title, a description of at least 30 words, and a placeholder image.
4. THE Funding Page SHALL include a "Funding Partners & Supporters" section displaying at least three entries of current and past funders, each shown as either a visible logo image or a text name.
5. THE Funding Page SHALL include a "Download Our Impact Report" section with a button that links to a downloadable PDF placeholder asset.
6. THE Funding Page SHALL include a "Get in Touch for Funding Enquiries" section with a direct `mailto:` email link and a paragraph of 20–80 words inviting grant bodies to make contact.
7. THE Funding Page SHALL include a "Testimonials from Partners" section with at least two placeholder quotes, each attributed to a named source with their role or organisation.

---

### Requirement 11: SEO and Performance

**User Story:** As the choir administrator, I want the website to rank well in search engines and load quickly, so that new visitors can find the choir online and have a good experience.

#### Acceptance Criteria

1. EACH page SHALL include SEO_Metadata rendered in the `<head>` element containing: a unique `<title>` tag (max 60 characters), a `<meta name="description">` tag (max 160 characters), Open Graph tags (`og:title`, `og:description`, `og:image` with minimum dimensions of 1200×630px, `og:url`), and Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`).
2. THE Site SHALL use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) on every page.
3. THE Site SHALL include a `public/sitemap.xml` generated at build time by the `@astrojs/sitemap` integration listing all seven pages.
4. THE Site SHALL include a `public/robots.txt` file allowing all crawlers and referencing the sitemap URL.
5. WHEN images are rendered, THE Site SHALL output `<img>` elements in WebP format with explicit non-zero `width` and `height` attributes and a non-empty `alt` attribute.
6. THE Site SHALL achieve a Lighthouse Performance score of 90 or above on the Home Page, Performances Page, and Meet the Team Page when tested against the production build.
7. THE Site SHALL include a `<link rel="canonical">` tag on every page pointing to the page's absolute URL on `https://www.themidlandsafricanchoir.co.uk`.

---

### Requirement 12: AWS Lambda Contact Form Backend

**User Story:** As the choir administrator, I want form submissions to be delivered to my email inbox, so that I can respond to membership enquiries and booking requests promptly.

#### Acceptance Criteria

1. THE Lambda function SHALL accept POST requests from API_Gateway containing a JSON body; a request is considered valid when the body is parseable JSON and contains at minimum the fields `name` (string), `email` (string), and `message` (string).
2. WHEN a valid POST request is received, THE Lambda function SHALL use SES to send a formatted HTML email to the choir's designated inbox address containing all submitted form fields; the email is considered sent when SES returns a successful send response.
3. WHEN a valid POST request is received and SES returns a successful send response, THE Lambda function SHALL return an HTTP 200 response with a JSON body `{"status": "success"}`.
4. IF the SES send operation returns an error after a valid POST request is received, THEN THE Lambda function SHALL return an HTTP 200 response with a JSON body `{"status": "success"}` (the request itself was valid and the client should not retry).
5. THE API_Gateway SHALL be configured with CORS headers permitting requests originating from `https://www.themidlandsafricanchoir.co.uk` and `http://localhost:4321` on all responses.
6. THE Lambda function source code SHALL be provided in a `lambda/` directory at the project root with a `handler.js` file and a `README.md` documenting deployment steps.
7. WHEN the `email` field in the request body does not match the pattern `[^@]+@[^@]+\.[^@]+`, THE Lambda function SHALL return an HTTP 400 response with a JSON body `{"status": "error", "message": "Invalid email address"}` without invoking SES.
8. WHEN the request body is missing any of the required fields (`name`, `email`, or `message`), THE Lambda function SHALL return an HTTP 400 response with a JSON body `{"status": "error", "message": "Missing required fields"}` without invoking SES.

---

### Requirement 13: Media Asset Management

**User Story:** As the choir administrator, I want a clear system for managing photos, audio, and video assets, so that I can update the site's media without developer assistance.

#### Acceptance Criteria

1. THE Site SHALL support two media storage modes for images: local assets stored in `src/assets/` (processed at build time by Astro) and remote assets referenced by `https://` S3 URLs (rendered directly without build-time processing).
2. THE Site SHALL include a `public/images/placeholders/` directory containing placeholder SVG or WebP images for team member photos, hero backgrounds, and gallery images used during development.
3. THE Site SHALL include documentation in `README.md` describing the S3 bucket naming convention, the folder structure (`/team/`, `/performances/`, `/gallery/`), and the step-by-step process for updating a content collection entry to reference a new S3 URL.
4. WHEN an `https://` S3 image URL is used in a content collection entry, THE Site SHALL render the image with a `loading="lazy"` attribute and explicit `width` and `height` values each greater than zero.
5. WHEN an `https://` S3 image URL is unreachable at render time, THE Site SHALL render the image element with the S3 URL as `src`; broken image display is handled by the browser and is outside the scope of this requirement.
6. THE Performances Page SHALL render S3-hosted audio files using an HTML5 `<audio>` element with the `controls` attribute; audio files SHALL NOT be required to be stored in the repository.
7. THE Site SHALL include a `src/content/config.ts` file defining Zod schemas for the `team` and `performances` content collections; WHEN the build command is executed with a content entry that violates the schema, THE build SHALL fail with a type error.

---

### Requirement 14: Deployment and Hosting

**User Story:** As the choir administrator, I want the site deployed to a free static hosting platform with a custom domain, so that the site is publicly accessible at `themidlandsafricanchoir.co.uk`.

#### Acceptance Criteria

1. THE Site SHALL include a `netlify.toml` configuration file at the project root specifying the build command (`npm run build`), publish directory (`dist`), and Node.js version.
2. THE Site SHALL include a `vercel.json` configuration file at the project root as an alternative deployment configuration specifying the output directory (`dist`).
3. THE README.md SHALL include deployment instructions for both Netlify and Vercel each covering: connecting the Git repository, configuring build settings, setting environment variables, and adding a custom domain.
4. THE README.md SHALL include DNS configuration instructions for connecting the custom domain `themidlandsafricanchoir.co.uk` covering both CNAME and A record options as directed by the chosen hosting platform.
5. WHEN an environment variable is referenced via `import.meta.env` in the Astro source code, THE `.env.example` file at the project root SHALL include that variable name with a placeholder value; the `.env.example` file SHALL list every variable referenced via `import.meta.env` across the entire codebase.
6. THE Site SHALL include a `.gitignore` file excluding `node_modules/`, `dist/`, `.env`, and `.env.*` from version control.
