# Portfolio agent guide

Read this file before changing this repository. Keep it accurate as part of relevant changes; see "Maintain this guide" below. New explicit instructions from Johan take precedence over this guide.

## Project and scope

- Personal portfolio for **Johan Jagalur**. Signature interaction: a small, tilting business card expands into the portfolio. Extend that design, not a generic portfolio template.
- Stack: vanilla HTML, CSS, and JavaScript ES modules, served and built by Vite 5 (`^5.4.21` in `package.json`). No React, TypeScript, application backend, database, or component framework currently exists here.
- Repository: `https://github.com/JohanFJ101/Portfolio`. Local working copy: `C:/Users/johan/Documents/Portfolio`; do not use the obsolete `Portfolio Website` path.
- Treat checked-out source as current implementation. Older chat notes, unused CSS, and historical commits are not proof that a feature is active. Do not claim deployed behavior without checking deployment.
- Keep changes small and scoped. Preserve pre-existing uncommitted work; never reset, overwrite, or clean unrelated files. Do not commit, push, or deploy unless asked.

## Start here

1. Read this guide, run `git status --short`, then inspect the files relevant to the request. Check `git diff` before editing so existing work is distinguishable from yours.
2. For UI changes, inspect both collapsed and expanded states before making design decisions. Clarify material design ambiguity; a question about design is not permission for a full redesign.
3. Make the smallest working change in existing code. No framework migrations, dependencies, abstractions, formatting sweeps, or unrelated dead-code cleanup without a concrete need.
4. Run relevant checks below. Report changed files, verified behavior, and anything blocked or still awaiting approval. Build success alone does not verify visuals.

## Commands

Run from repository root with Node.js and npm. Node 24.9.0 / npm 11.6.0 built this checkout successfully; these are verified local versions, not pinned requirements.

```sh
npm ci
npm run dev -- --host 127.0.0.1
npm run build
npm run preview -- --host 127.0.0.1
```

- Use `npm ci` for a clean dependency install when needed, not for every edit. Preserve `package-lock.json`; dependency changes must be intentional.
- Development URL normally `http://localhost:5173`; preview normally `http://localhost:4173`. Read actual server output because Vite may choose another port. `.claude/launch.json` references port 5173.
- `npm run build` produces ignored `dist/`. Do not hand-edit generated output, `node_modules/`, or `.vercel/`.
- No automated test, lint, or typecheck scripts are currently defined. Do not invent successful results for commands that do not exist.
- Static build output is `dist/`. History mentions Vercel, but no checked-in hosting configuration establishes the current deployment target. Verify hosting before changing deployment settings.

### Windows shell caveat

If tools run through Git Bash/MSYS, use POSIX shell syntax, not PowerShell builtins. Native programs may require `C:/Users/johan/Documents/Portfolio` rather than `/c/Users/...` when MSYS argument conversion is disabled. For example:

```sh
git -C C:/Users/johan/Documents/Portfolio status --short
```

## File map

| Path | Purpose |
| --- | --- |
| `index.html` | Page markup, metadata, loader, theme button, card, contact/social links, section buttons and copy; loads CSS and JS. |
| `src/main.js` | Pointer tilt, hash-driven expansion, section selection, keyboard/dismissal behavior, theme toggle, loader lifecycle. |
| `src/style.css` | Fonts, theme variables, texture, responsive card geometry, portrait layering, animation and focus states. |
| `src/Assets/portrait-cropped.png` | Transparent portrait currently displayed. Vite bundles this asset referenced by HTML. |
| `src/Assets/Portfolio Photo.png` | Original portrait source; retain unless explicitly asked to replace/remove it. |
| `public/assets/` | Anton font (`anton-regular.ttf`) and LinkedIn/GitHub image assets (`figma-image-2.png`, `figma-image-3.png`); referenced with `/assets/...`. |
| `package.json`, `package-lock.json` | Scripts and dependency declarations / locked dependency tree. |
| `IDEA.md` | Currently only a one-line request to develop the portfolio, not a detailed spec. |

Keep `src/Assets` capitalization exact for case-sensitive build hosts. Local font and image paths should keep working in development and production.

## Current behavior and contracts

### Card, routing, and controls

- Collapsed card is centered, sized up to 3.5in by 2in, with contact links top-left, social links top-right, and name near bottom-left. No "View projects" label or "Close ×" button.
- Pointer tilt uses `requestAnimationFrame` and CSS custom properties. Tilt is disabled while expanded, for touch entry, and with reduced motion; resets on pointer exit/cancel and expansion changes.
- Clicking non-link/button content while collapsed expands via **`#/projects`**. This historical route now opens About Me / Experience, not a projects carousel. Preserve direct loading, hash changes, and browser Back/Forward behavior unless route changes are explicitly requested.
- `setExpanded()` coordinates `.card-stage.is-expanded`, `body.card-expanded`, and card ARIA state. `renderRoute()` controls section visibility and defaults to About Me on expansion.
- Enter/Space on the collapsed card opens it. Escape closes it and restores card focus. Background outside the card closes it, except the theme toggle. Empty card/container areas currently matched in the click handler also close it; arbitrary text content does not universally dismiss it.
- Links and section buttons must retain their own actions, never toggle the card accidentally. Section selection updates `aria-current`, `.is-selected`, and panel `hidden` state. Selected About Me or Experience shifts right with a dot to its left, matching the Figma selected state; the unselected item has neither.

### Expanded layout and content

- About Me / Experience navigation stacks on the left; narrow, left-aligned Anton copy appears on the right. At widths up to 600px, sections stack into a single column.
- Experience content sits farther right and lower within the expanded card's right side on desktop; keep About Me and navigation positions unchanged. Mobile retains the stacked layout without that desktop offset.
- About Me starts with a separate **"Hello,"** paragraph. Biography is explicitly placeholder copy. Do not invent a finished biography or career claims.
- Experience markup currently lists **Full Stack Engineer — @Uday Digital, Ksana**, **IT Systems Support Engineer — @ASU, Fulton Schools of Engineering**, and **VP of Technology — @ASU, Startup Village**. Keep each role title on one line with responsive sizing, left-align organization lines under their titles, and keep generous spacing between entries. These are current displayed labels, not independently verified credentials. Do not silently replace them with older chat/skill descriptions (for example ASU EPICS); confirm substantive career changes with Johan.
- There is no active projects carousel in HTML/JS. Legacy `.projects-view`, `.project-detail`, and `.card-close` CSS remains. Do not restore that UI or remove unrelated legacy rules as incidental cleanup.

### Visual and motion constraints

- Default palette: bone white page **`#f9f6ee`**, dark card **`#0c0c0c`**, white card text. Dark theme reverses the page/card treatment. Retain grain texture and restrained business-card composition.
- Use existing CSS variables and Anton display typography. Body content is slightly smaller than navigation headings, constrained to short lines (`.section-content` currently `max-width: 25ch`). Preserve contact/social styling unless asked to change it.
- Card expands over 700ms. Section content and portrait reveal after expansion using the 940ms reveal animation. Preserve sequence, not an early flash during expansion.
- Transparent portrait is hidden when collapsed, appears bottom-left when expanded, and hides immediately on collapse. Keep portrait behind readable name text; current CSS uses `scale(0.37)` with mobile overrides. Treat requested numeric tweaks as bounded CSS edits, not a layout redesign.
- Theme toggle updates `.dark-theme`, `aria-pressed`, accessible label, and `meta[name="theme-color"]`. Theme is currently in-memory only; do not claim persistence or OS-theme synchronization.
- Loader waits for window load, with a normal minimum display time of 350ms; reduced motion removes that minimum. Preserve reduced-motion rules, visible focus, semantic controls, accessible names, and focus restoration.

## Content and privacy

Do not invent employment dates, titles, metrics, project outcomes, or contact details. Keep placeholder copy visibly identified until approved. Preserve existing contact links unless the request covers them; confirm sensitive contact changes before publication. Never put secrets, API keys, credentials, or private career documents in this guide or frontend assets.

Known existing issue: phone link uses masked `tel:+160****9057`, which does not match the displayed phone number. Confirm intended public value with Johan before fixing; do not silently infer or publish a replacement.

## Verification

For documentation-only changes, check accuracy against source, run `git diff --check`, and inspect final diff. Do not claim UI testing unless performed.

For code/UI changes:

1. Run `npm run build`; check actual result and any new warnings. Preview built output when changing asset paths or deployment-sensitive behavior.
2. Check desktop and mobile rendered states: collapsed/expanded card, portrait/name stacking, narrow copy, section overflow, contact/social placement, and both themes. Check browser console and missing assets.
3. Exercise click and Enter/Space expansion, direct `#/projects` loading, section switching, default About Me after reopening, Escape/focus restoration, background dismissal, and Back/Forward. Links, section buttons, and theme toggle must not dismiss the card.
4. Check reduced motion and keyboard focus. Wait for expansion/reveal and theme transitions before asserting visibility or contrast; verify actual panel content, not only selected-button styling.
5. Inspect `git diff --check` and scoped diff; report exact checks run and any unverified behavior. Keep one-off browser tooling outside project dependencies unless requested. If shared browser automation is locked, isolated Playwright with installed Edge (`channel: 'msedge'`) is an available fallback when tooling exists.

Pitfall: delayed transitions may not run when revealing elements previously set to `display: none`. Preserve or use expanded-state reveal animations and inspect computed visibility during and after expansion.

## Maintain this guide

**Agents must update `AGENTS.md` in the same change when their work makes it inaccurate or adds durable context needed by a fresh chat.** This applies to changes in setup/commands, stack/dependencies, file ownership, routes/state contracts, interaction/accessibility behavior, approved design direction, asset paths, deployment, testing, or known limitations.

- Edit the relevant existing section; replace obsolete facts rather than appending contradictory notes. New explicit user corrections override older guidance; reconcile stale guidance wherever it appears here.
- Record current implementation separately from proposed work and unapproved copy. Verify facts from source, actual tool output, or explicit user direction; label anything unresolved.
- Capture reproducible pitfalls and their fix/check, not chat transcripts, session logs, timestamps, temporary tasks, transient working-tree status, or routine cosmetic changes.
- Keep this file self-contained for agents without Hermes memory or skills. Hermes agents should also keep reusable portfolio lessons in `portfolio-design-development`, but repo-specific context must remain here.
- Before finishing, ask: "Would a fresh agent following this guide use stale commands, assume removed behavior, or undo an approved choice?" Fix affected sections and mention the guide update in the final summary. If nothing durable changed, leave it unchanged.
