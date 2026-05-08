# Superheroes Crossbox

Superheroes Crossbox is a custom single-page marketing website for a CrossFit gym in Keratsini, Athens. The project is built with Next.js App Router, React, TypeScript, and GSAP, and it focuses on a premium, high-energy presentation with bilingual content, smooth motion, and a clear booking flow.

The site is designed around one main conversion goal: help visitors understand the gym's identity, explore the services, and book their first visit through the embedded Cal.com scheduler.

## Project Goals

- Present the gym as a premium, superhero-inspired training brand.
- Keep the experience fast and simple by using a focused one-page structure.
- Support both Greek and English audiences through a shared locale system.
- Use motion and layered visuals to make the hero section feel alive without overwhelming the user.
- Drive visitors toward booking and contact actions.

## Tech Stack

- `Next.js 15` with the App Router
- `React 19`
- `TypeScript`
- `GSAP` for reveal animations and hero motion
- `CSS Modules` for component-scoped styling
- `app/globals.css` for global tokens, base styles, and accessibility rules
- `Cal.com` inline embed for booking

## High-Level Architecture

This codebase is intentionally small and centered around a single route.

- `app/layout.tsx`
  Defines the global HTML shell, loads Google fonts, and imports global styles.
- `app/page.tsx`
  Composes the entire homepage by rendering the provider, header, sections, footer, and the back-to-top button.
- `components/`
  Contains all UI building blocks and behavior for the landing page.
- `public/`
  Stores brand assets such as the logo and SVG mark.

The application uses a mixed rendering model:

- Server components are used for the page and layout shells.
- Client components are used where browser APIs, animation, state, or interactivity are required.

## Current File Structure

```text
.
|-- app/
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components/
|   |-- BackToTopButton.tsx
|   |-- CalBooking.tsx
|   |-- ContactSection.tsx
|   |-- GoogleAnalytics.tsx
|   |-- HeroSection.tsx
|   |-- LocaleProvider.tsx
|   |-- ServicesSection.tsx
|   |-- SiteFooter.tsx
|   |-- SiteHeader.tsx
|   `-- site.module.css
|-- lib/
|   `-- analytics.ts
|-- public/
|   |-- logo.png
|   `-- shcb-brandmark.svg
|-- next.config.ts
|-- package.json
|-- package-lock.json
|-- tsconfig.json
`-- README.md
```

## Page Composition

The homepage is assembled in `app/page.tsx` in this order:

1. `LocaleProvider`
2. `SiteHeader`
3. `HeroSection`
4. `ServicesSection`
5. `ContactSection`
6. `BackToTopButton`
7. `SiteFooter`

This means localization state is available to every visible section, and the entire experience stays within a single smooth-scrolling page.

## Component Breakdown

### `LocaleProvider.tsx`

This is the central content and locale layer for the app.

Responsibilities:

- Stores the active locale in React state.
- Exposes `locale`, `setLocale`, and `messages` through context.
- Updates `document.documentElement.lang` whenever the language changes.
- Contains the actual text content for both English and Greek.

Why it matters:

- All sections pull copy from one place instead of hardcoding strings in multiple components.
- The site can switch languages instantly without routing or page reloads.
- It keeps content structure consistent across the whole app.

### `SiteHeader.tsx`

The header is the primary navigation and entry point to the rest of the page.

Responsibilities:

- Renders the brand logo and title.
- Displays desktop navigation links to in-page anchors.
- Includes the locale switcher.
- Manages the mobile navigation dialog.
- Locks body scroll while the mobile menu is open.

Notable behavior:

- Uses the native `dialog` element for the mobile menu.
- Handles open, close, cancel, and cleanup states.
- Uses localized labels from the provider for accessibility and UI text.

### `HeroSection.tsx`

This is the visual centerpiece and main conversion section.

Responsibilities:

- Displays the main heading, supporting copy, booking CTA, and gym highlights.
- Renders the layered atmospheric background.
- Contains the compact booking card with the Cal embed.
- Runs the most advanced motion logic in the project.

Motion behavior:

- Uses GSAP for entry animation on first render.
- Uses `requestAnimationFrame` and pointer tracking for subtle parallax on larger screens.
- Adjusts motion intensity based on viewport size.
- Respects `prefers-reduced-motion`.

### `CalBooking.tsx`

This component handles the embedded booking experience.

Responsibilities:

- Loads the Cal.com embed script.
- Initializes a namespaced Cal embed.
- Mounts the booking interface into the page.
- Supports a `compact` mode so the booking UI can be reused in tighter layouts.

Why it matters:

- The booking flow is the key action on the site.
- Encapsulating the integration keeps third-party script logic out of the rest of the UI.

### `ServicesSection.tsx`

This section explains the training offerings.

Responsibilities:

- Reads localized service data from the provider.
- Renders a grid of service cards.
- Animates cards into view when they enter the viewport.

Animation behavior:

- Uses `IntersectionObserver` to trigger reveal animations only when needed.
- Uses GSAP to animate opacity, position, and scale.

### `ContactSection.tsx`

This section reinforces trust and provides practical next steps.

Responsibilities:

- Shows the gym's positioning and atmosphere copy.
- Displays address, Instagram, and directions links.
- Repeats important conversion actions for users who scroll past the hero.
- Reveals content on scroll using the same animation pattern as the services section.

### `BackToTopButton.tsx`

This is a small utility component added to improve long-page usability.

Responsibilities:

- Appears only after the user scrolls down.
- Scrolls smoothly back to the top of the page.
- Respects reduced-motion preferences.
- Uses a localized accessibility label.

### `SiteFooter.tsx`

The footer closes the experience with brand language and creator credit.

Responsibilities:

- Shows localized footer copy.
- Links to the credited Instagram account.

## Styling System

The visual design is split across two layers:

### `app/globals.css`

This file defines the foundation of the design system.

It includes:

- CSS custom properties for colors, spacing feel, shadows, and radii
- global typography setup
- body background gradients
- smooth scrolling
- focus-visible accessibility styling
- reduced-motion fallbacks

Important design tokens include:

- `--bg`, `--bg-soft`
- `--surface`, `--surface-strong`
- `--border`
- `--text`, `--muted`
- `--green`, `--green-soft`
- `--purple`, `--purple-soft`
- radius and shadow tokens

### `components/site.module.css`

This file contains nearly all component-level styling.

It covers:

- header and navigation
- hero layout and background effects
- buttons and pills
- cards and sections
- mobile navigation sheet
- contact area
- footer
- back-to-top button

Why this setup works:

- Global rules stay small and predictable.
- Most visual implementation remains local to the shared page components.
- The project keeps a strong design language without introducing a separate CSS framework.

## Localization Strategy

Localization is handled manually through the `LocaleProvider` instead of a dedicated i18n library.

Current locales:

- `en`
- `el`

How it works:

- All strings live in the `messages` object inside `LocaleProvider.tsx`.
- Components call `useLocale()` to access the active language and message set.
- The header toggles the locale.
- The document `lang` attribute is updated when the locale changes.

Benefits:

- Very simple for a small, marketing-focused site.
- Easy to reason about.
- No routing, translation file loading, or external i18n configuration needed.

Tradeoff:

- As content grows, this single-file message store may eventually become too large and may need to be split by section or locale.

## Motion and Interaction Design

Motion is a core part of the brand feel in this project, but it is used selectively.

Current animation patterns:

- Hero entrance animation with staggered reveal
- Pointer-based parallax in the hero on larger screens
- Scroll-triggered reveal animations in services and contact sections
- Hover transitions on buttons, cards, and links
- Smooth scroll behavior for anchor navigation and the back-to-top button

Accessibility considerations already included:

- `prefers-reduced-motion` is respected
- focus states are visible
- interactive labels are localized where relevant

## Booking Flow

The booking flow is central to the product experience.

How it works:

1. The hero section introduces the gym and presents the main CTA.
2. The compact booking card displays the embedded Cal.com scheduler.
3. Additional booking prompts appear in navigation and contact areas.
4. In-page anchors guide users back to booking from multiple touchpoints.

The current Cal configuration is initialized inside `CalBooking.tsx` using:

- namespace: `unleashyourinnerhero`
- booking link: `super-heroes-crossbox/unleashyourinnerhero`

## Assets

The `public/` directory contains the current static brand assets.

- `logo.png`
  Main logo used in the header and mobile menu.
- `shcb-brandmark.svg`
  Brand mark asset available for future use or alternate placements.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the site locally:

```text
http://localhost:3000
```

### Environment Variables

To enable Google Analytics 4, add this environment variable locally and in Netlify:

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

If the variable is missing, the analytics scripts and event tracking are skipped automatically.

## Production

Create a production build:

```bash
npm run build
```

Run the production server:

```bash
npm run start
```

## Scripts

- `npm run dev`
  Starts the local development server.
- `npm run build`
  Creates the production build.
- `npm run start`
  Runs the built app.
- `npm run lint`
  Runs the configured lint command.

## Configuration Notes

### `next.config.ts`

The Next.js config is intentionally minimal.

Current configuration:

- `reactStrictMode: true`

This is a good default for catching unsafe React patterns during development.

### Analytics

The project includes a GA4 integration using:

- `components/GoogleAnalytics.tsx` for the global GA script
- `lib/analytics.ts` for reusable event tracking

Tracked events currently include:

- `hero_cta_click`
- `contact_action_click`
- `locale_switch`
- `mobile_menu_open`
- `mobile_nav_click`

### Fonts

Defined in `app/layout.tsx` using `next/font/google`:

- `Inter` for body text
- `Space Grotesk` for display text

They are exposed through CSS variables:

- `--font-body`
- `--font-display`

## How the Pieces Fit Together

At runtime, the project flows like this:

1. `layout.tsx` creates the global shell and loads fonts/styles.
2. `page.tsx` assembles the homepage.
3. `LocaleProvider` supplies language content to the entire UI.
4. Shared components render each section of the page.
5. `site.module.css` and `globals.css` shape the visual system.
6. GSAP adds motion where it improves storytelling and emphasis.
7. Cal.com handles the booking interaction inside the hero card.

## Suggested Future Improvements

If the project grows, these would be sensible next steps:

- split locale messages into separate files for readability
- extract repeated animation logic into reusable hooks
- add a true lint setup if not already configured externally
- add analytics for CTA clicks and booking engagement
- move contact details and booking config into a central config object
- add tests for critical interactive behavior

## Summary

This project is a focused, design-led marketing site with a strong brand identity and a clear conversion goal. Its structure is intentionally compact: one route, a small set of reusable components, centralized localized content, a shared styling module, and a booking integration that supports the core business action.

That simplicity is one of the main strengths of the codebase. It is easy to navigate, easy to extend, and well suited for a polished promotional site with a single primary user journey.
