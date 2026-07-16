# Editorial Portfolio Redesign

**Date:** 2026-07-16  
**Status:** Approved for implementation

## Summary

Redesign the portfolio around a dark digital-design-magazine direction while preserving the existing header and hero visually. Add a short editorial loader before the hero, rebuild all post-hero sections on a Swiss-derived grid, introduce a data-ready Experience archive, retain and optimize the desktop 3D helix gallery, improve accessibility, and measurably reduce avoidable media, JavaScript, animation, and rendering costs.

The redesign prioritizes visual richness. Performance is a firm engineering guardrail, but not a requirement to remove signature visuals solely to maximize a Lighthouse score.

## Approved Direction

The approved visual direction is **Digital Design Magazine** with a **dark shell and off-white paper inserts**.

The system combines:

- A strict 12-column editorial grid
- Dense issue/index metadata
- Oversized sans-serif display typography
- Selective italic serif contrast
- Deep ink surfaces
- Warm paper inserts
- Sparse lime registration marks and actions
- Predominantly square editorial surfaces
- Deliberate asymmetry within a disciplined grid

## Goals

1. Add a premium loader before every full hero reveal.
2. Preserve the current header and hero appearance.
3. Make all content after the hero read as one coherent editorial publication.
4. Replace the missing Services navigation contract with Experience.
5. Prepare Experience content for later replacement with the user's CV.
6. Preserve the 3D gallery as a signature desktop interaction while reducing its cost.
7. Reduce initial hydration, image transfer, layout shift, and unnecessary continuous animation.
8. Improve keyboard, dialog, focus, contrast, and reduced-motion behavior.
9. Keep the design compatible with the current self-hosted VPS, nginx upload alias, PostgreSQL content, and PM2 deployment model.
10. Prefer pnpm 11 for package management while preserving the repository's dependency-safety rules.

## Non-goals

- Redesigning the visual composition of the hero
- Replacing the black/off-white/lime brand identity
- Removing the 3D gallery
- Migrating hosting to Vercel or another platform
- Inventing factual CV achievements before source data is provided
- Adding a broad new color palette
- Introducing an unrelated animation vocabulary
- Making every section continuously animated

## Hero Freeze Boundary

The fixed header and entire hero are a visual freeze boundary. Their output must remain visually unchanged across supported viewport sizes.

The freeze includes:

- Header layout, dimensions, logo treatment, and scroll transition
- Hero typography and font metrics
- Portrait placement and treatment
- Paper Shader settings
- Per-letter name transforms
- Diagonal lime marquee
- CTA placement and magnetic behavior
- Social and availability placement
- Existing black and lime values where they directly affect the hero
- Responsive geometry and breakpoints

Code may be extracted into focused components as long as visual-regression checks confirm equivalent output. Global token changes must not alter hero typography, spacing, animation timing, or geometry.

## Page Architecture

### 1. Editorial Loader

A lightweight full-screen loader appears once for each new document load: direct navigation, hard reload, or browser refresh. It does not replay for in-app anchor navigation, development-only React remounts, or a page restored intact from the browser back/forward cache.

Normal sequence:

1. Display a black editorial field with quiet grid coordinates and issue metadata.
2. Typeset `TRESH / NANDA` into opposing columns.
3. Advance an art-directed progress indicator tied to critical hero readiness.
4. Sweep a lime registration rule across the composition.
5. Clip or separate the loader vertically to reveal the unchanged hero.

Behavior:

- Normal reveal begins between 1.15 and 1.35 seconds after loader presentation.
- Critical readiness means the client has mounted, `document.fonts.ready` has resolved, and the hero portrait has either decoded successfully or reported an error.
- The Paper Shader may initialize behind the loader but is not a blocking signal; its existing static/fallback field prevents it from trapping the reveal.
- A hard 2.5-second safety timeout releases the loader even if fonts or portrait readiness never resolves. Late readiness after release is ignored.
- Below-the-fold images, Three.js, project media, and Experience data must not delay the reveal.
- Do not expose noisy raw network progress; map readiness into a controlled visual progression.
- Reduced motion renders a static title card and simple opacity transition with the same readiness and timeout rules.
- The loader must not become a second heavy graphics runtime.

### 2. Stack Index

Replace the current isolated decorative stack band with a compact editorial technology index.

Requirements:

- Present the stack as issue metadata or a technical index.
- Preserve optional scroll-velocity character without making the text unreadable.
- Fall back to a static wrapping list for reduced motion.
- Avoid a permanent animation loop when off-screen.
- Keep this chapter visually transitional between the unchanged hero and the publication shell.

### 3. Selected Works

Selected Works becomes a dark editorial chapter containing off-white project inserts.

Requirements:

- Use issue numbering, year, discipline, status, tags, and project links as structured metadata.
- Use strong rules, asymmetric image placement, and generous negative space.
- Keep the flat editorial representation as the canonical accessible content.
- Progressively enhance with the 3D helix only when the viewport is at least 1024px wide, the primary pointer is fine, reduced motion and data-saver are off, WebGL is available, at least one project exists, and—when the browser exposes device memory—the device reports at least 4 GB. Missing device-memory information does not by itself disable 3D.
- Re-evaluate viewport, pointer, reduced-motion, and visibility conditions without replacing accessible content during the transition.
- Both views must consume the same project data and open the same project modal.
- Reserve media geometry before image loading to prevent layout shift.
- Avoid generic rounded-card grids; paper inserts should be mostly square-edged.
- Retain the distinctive rounded treatment inside the existing 3D project surfaces.

### 4. Experience Archive

Replace all missing `Services` links and anchors with `Experience`.

Use a typed data model supporting:

- Company or organization
- Role
- Start and end dates
- Location or working mode
- Short description
- Selected responsibilities or outcomes
- Optional technologies
- Optional external link

Until the CV is provided:

- Keep development-only sample records isolated in one clearly named data file and mark them with an explicit placeholder flag.
- Never render sample employers, roles, dates, or achievements in production.
- Render the finished public section shell with an intentional `Full experience archive in preparation` holding state, a short non-factual profile line, and the final grid/rule treatment.
- Do not invent detailed achievements that could appear factual.
- Ensure replacing the holding state with CV content requires data changes rather than component restructuring.

Visual behavior:

- Chronological archive or index presentation
- Strong horizontal rules and issue markers
- Clear date and role scanning
- Optional restrained expansion for supporting detail
- Full keyboard and reduced-motion support

### 5. Profile and Contact

The closing chapter remains direct and action-oriented while adopting the dark magazine system.

Requirements:

- Preserve WhatsApp and email actions.
- Improve the hierarchy between profile, availability, contact action, social links, and back-to-top control.
- Use a dark shell with selective paper or lime inserts.
- Use one strong closing motion idea rather than many competing effects.
- Make clipboard state and link purpose clear to assistive technology.

## Visual System

### Grid

- Use a consistent 12-column grid for desktop editorial sections.
- Collapse deliberately for tablet and mobile rather than preserving desktop asymmetry at all costs.
- Allow display type and images to span or break grid columns intentionally.
- Align metadata, rules, captions, and section numbering to shared column lines.

### Color

Retain the current brand and refine it into explicit semantic roles:

- Hero black: preserve current value where required by the freeze boundary.
- Ink: primary publication background.
- Elevated ink: subtle dark layering.
- Warm paper: primary inserted surface.
- Muted paper: secondary inserted surface.
- Editorial gray: secondary text and rules.
- Lime: active state, registration mark, availability, progress, and primary action.

Lime must remain scarce enough to retain emphasis. Do not add a broad secondary brand palette.

### Typography

- Keep Inter and Playfair Display to protect hero metrics and maintain brand continuity.
- Use Inter Black or equivalent heavy weights for oversized publication headlines.
- Reserve italic Playfair for short expressive phrases.
- Use uppercase tracked metadata selectively.
- Keep metadata readable on mobile; do not pursue magazine density at the expense of legibility.
- Use tabular numerals where dates, counts, and issue numbers align.
- Do not rely on the currently undefined `.mono` class.
- Add a real monospaced font only if its value justifies additional loading and the hero remains unaffected.

### Surfaces

- Prefer rules, fields, sheets, and image crops over generic rounded cards.
- Paper inserts should be mostly square-edged.
- Use layering sparingly to avoid excessive compositing.
- Preserve the gallery's distinctive Apple-rounded 3D project masks.

## Motion System

Reuse the shared easing and spring vocabulary in `src/lib/motion.ts`.

Approved motion categories:

- Chapter-level page wipes or large masks
- Clipped line reveals for primary headlines
- Restrained character sequencing for selected display text
- Immediate or short fades for metadata
- Rule expansion and metadata shifts for Experience rows
- Controlled project-image crop and hover transitions
- One strong closing transition in the contact chapter
- Richer motion budget for the 3D gallery than for supporting sections

Avoid:

- Character-by-character animation on tiny metadata
- Independent easing definitions scattered across components
- Constant floating on every surface
- Multiple simultaneous pointer followers
- Large blurred layers used only for decoration
- Animating properties that trigger avoidable layout or paint work

Reduced-motion handling must explicitly cover:

- Loader
- Mobile menu
- Hero marquee
- Stack index
- Chapter reveals
- Project rows
- 3D gallery eligibility
- Modal transitions
- Hover and pointer effects

No content may remain hidden when JavaScript, WebGL, or animation initialization fails.

## Component Boundaries

Refactor the large page into focused units with clear responsibilities. Expected boundaries include:

- `PortfolioLoader`
- `PortfolioHeader`
- `HeroSection`
- `StackIndex`
- `WorksChapter`
- `ProjectGallery`
- `ExperienceChapter`
- `ContactChapter`
- `ProjectModal`

Principles:

- Keep static section framing server-renderable where practical.
- Use client boundaries only for real interaction or browser-only behavior.
- Preserve a single shared project data contract between flat and 3D galleries.
- Keep modal state and media paging isolated from unrelated page behavior.
- Do not perform unrelated application-wide refactors.

## Project Modal Accessibility

Retain current paging and keyboard shortcuts, then add:

- Initial focus placement
- Focus trapping
- Escape-to-close
- Focus restoration to the opening project
- Clear next/previous labels
- Appropriate disabled behavior at boundaries or documented wrap behavior
- Screen-reader-friendly project title and media position
- Background inertness while open
- Reduced-motion transitions

## Performance Design

### Hydration and JavaScript

- Remove the requirement to hydrate the entire public page as one client module.
- Isolate interactive islands.
- Keep static editorial framing in server components where practical.
- Defer expensive client modules until their section approaches the viewport or the browser is idle.
- Record before-and-after initial and lazy bundle measurements.

### Images

- Add explicit media dimensions or aspect ratios.
- Use responsive image sizing.
- Lazy-load below-the-fold project media.
- Use asynchronous decoding where appropriate.
- Avoid eagerly loading all flat-gallery media before desktop enhancement chooses 3D.
- Generate or serve smaller variants for card and texture usage.
- Keep runtime `/uploads/` URLs compatible with nginx and the existing CMS.
- Avoid decoding oversized source images when a much smaller display size is sufficient.
- Preserve a safe fallback if an image is missing or invalid.

### 3D Gallery

Preserve the existing helix concept and interaction while optimizing it.

Mandatory optimization behavior:

- Do not request the Three.js/R3F chunk before the Works chapter is within approximately one viewport of entry, unless an idle callback fires after the hero has settled.
- Do not eagerly request both full-size flat images and full-size WebGL textures. A chosen presentation may request one purpose-sized rendition per visible project; browser cache reuse is allowed.
- Cap gallery texture renditions at a 1600px longest edge unless a measured visual comparison demonstrates that a smaller cap is sufficient.
- Reduce the blur shader from its current 25 texture samples to no more than 9 samples, or replace it with a cheaper equivalent that passes side-by-side visual review.
- Stop gallery frame callbacks while the Works chapter is outside the viewport. When visible but settled, use demand rendering or an equivalent invalidation strategy so an idle gallery does not sustain a continuous 60fps loop.
- Limit per-card frame updates to cards whose transform or interaction state is changing.
- Cap canvas DPR at 1.5; allow a lower adaptive cap on devices that miss frame targets.
- Use the explicit eligibility rules defined in Selected Works for mobile, reduced-motion, data-saver, no-WebGL, coarse-pointer, and low-memory fallbacks.
- Reserve equivalent section geometry before enhancement so the flat-to-3D upgrade produces no user-visible layout jump.
- Record before-and-after evidence for chunk request timing, duplicate project requests, texture dimensions, off-screen frame activity, idle frame activity, and DPR.

### Animation Runtime

- Cancel the Lenis animation frame during cleanup.
- Prevent simultaneous full-cost operation of cursor effects, marquees, shader, and 3D canvas when sections are not visible.
- Prefer transforms and opacity.
- Reduce broad backdrop blur and large composited translucent surfaces.
- Ensure observers, animation frames, and listeners are removed on cleanup.

### Loader Scope

- Only client mount, font readiness, and hero portrait decode/error may affect loader release.
- Project images, shader completion, and 3D code must not block the hero.
- The loader releases normally between 1.15 and 1.35 seconds when ready, and unconditionally at 2.5 seconds.
- The loader must be lightweight enough that its branding benefit does not harm initial responsiveness.

## Package Management and Dependency Safety

The user explicitly authorized using pnpm for this existing project. Migrate the repository to **pnpm 11** during implementation, subject to these safeguards:

- Preserve exact dependency versions; do not introduce `^`, `~`, or `latest` ranges.
- Preserve supply-chain protections equivalent to the current `.npmrc` behavior.
- Add the exact pnpm version through the `packageManager` field.
- Use pnpm's build-script allowlisting rather than globally enabling dependency lifecycle scripts.
- Inspect lockfile and script changes before accepting them.
- Do not add a dependency solely for effects already achievable with the current stack.
- Check Socket.dev before adding any new package.
- Verify registry signatures or available package integrity controls after dependency changes.
- Remove npm-specific lock state only after the pnpm install succeeds and the replacement lockfile is verified.

## Accessibility

- Replace broken Services anchors with Experience.
- Preserve logical heading order independent of visual size.
- Keep small metadata at readable sizes.
- Provide visible focus states on black, paper, and lime surfaces.
- Maintain contrast for all semantic text and controls.
- Hide decorative issue numbers, rules, grid coordinates, and registration marks from assistive technology.
- Keep loader announcements minimal.
- Ensure content remains available without animation or WebGL.
- Preserve keyboard operation for projects and modal navigation.
- Avoid globally hiding useful browser affordances where it harms navigation or discoverability.

## Failure Handling

- Database failure continues to degrade without crashing the public page.
- Missing project media displays a designed fallback.
- Failed WebGL initialization retains editorial project rows.
- Failed dynamic import retains editorial project rows.
- Failed loader readiness releases unconditionally at the 2.5-second safety timeout.
- Clipboard failure leaves the email readable and offers a non-deceptive state.
- Temporary Experience data remains isolated and obvious to maintainers.

## Validation Strategy

### Automated checks

- Production build
- ESLint
- TypeScript validation through the build or a dedicated check
- Existing package integrity and dependency-safety checks
- Focused component or interaction tests where tooling is introduced

### Browser verification

Exercise the complete flow:

1. Full load
2. Editorial loader
3. Hero reveal
4. Hero visual comparison
5. Stack index
6. Works chapter
7. Flat-to-3D eligibility and upgrade
8. Drag, scroll, and project selection
9. Project modal paging and focus behavior
10. Experience archive
11. Contact actions
12. Back-to-top navigation

Verify at:

- Small mobile
- Large mobile
- Tablet
- Laptop
- Wide desktop
- Reduced motion
- Keyboard-only navigation
- WebGL disabled or unavailable

### Performance evidence

Record before-and-after evidence for:

- Initial JavaScript
- Lazy 3D JavaScript
- Project image transfer
- Duplicate image requests
- Layout shift during gallery upgrade
- Off-screen animation and render activity
- Mobile Lighthouse and Core Web Vitals indicators

There is no fixed 90+ Lighthouse requirement. Regressions must still be justified, and avoidable costs must be addressed without removing the approved signature visuals by default.

## Completion Criteria

The work is complete when:

- The header and hero are visually unchanged.
- Every new document load receives the hybrid editorial loader; ready loads reveal between 1.15 and 1.35 seconds, and all loads release by 2.5 seconds.
- The post-hero page is a coherent dark digital magazine with paper inserts.
- Experience replaces Services, renders the approved non-factual holding state, and is ready for CV data replacement.
- The 3D helix remains recognizable and interactive on eligible devices.
- The 3D chunk is deferred, gallery frame callbacks stop off-screen, settled scenes do not sustain a continuous frame loop, canvas DPR is capped at 1.5, and the blur path uses no more than 9 texture samples or a verified cheaper equivalent.
- Flat and reduced-motion paths preserve all project content.
- Purpose-sized media prevent eager duplicate full-size flat and texture requests, with before-and-after network evidence recorded.
- Initial hydration is reduced through clearer server/client boundaries.
- The modal has complete focus behavior.
- Build, lint, responsive, reduced-motion, keyboard, and real-browser checks pass.
- The implementation remains compatible with the self-hosted VPS and nginx `/uploads/` arrangement.
- The project uses pnpm 11 with exact versions and hardened dependency-script handling.
