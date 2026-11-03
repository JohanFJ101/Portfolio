# Portfolio agent guide

Read this file before changing this repository. Keep it accurate as part of relevant changes; see "Maintain this guide" below. New explicit instructions from Johan take precedence over this guide.

## Project and scope

- Personal portfolio for **Johan Jagalur**. Production `main` shows only the small, tilting business card. Full expansion work is preserved separately on `dev/portfolio-expansion`; keep unfinished content out of production.
- Stack: vanilla HTML, CSS, and JavaScript ES modules, served and built by Vite 5 (`^5.4.21` in `package.json`). No React, TypeScript, application backend, database, or component framework currently exists here.
- Repository: `https://github.com/JohanFJ101/Portfolio`. Local working copy: `C:/Users/johan/Documents/Portfolio`; do not use the obsolete `Portfolio Website` path.
- Treat checked-out source as current implementation. Older chat notes, unused CSS, and historical commits are not proof that a feature is active. Do not claim deployed behavior without checking deployment.
- Keep changes small and scoped. Preserve pre-existing uncommitted work; never reset, overwrite, or clean unrelated files. Do not commit, push, or deploy unless asked.

## Start here

1. Read this guide, run `git status --short`, then inspect the files relevant to the request. Check `git diff` before editing so existing work is distinguishable from yours.
2. For UI changes, inspect the current card and both themes before making design decisions. Inspect expanded states only when working on the development branch. Clarify material design ambiguity; a question about design is not permission for a full redesign.
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
| `index.html` | Page markup, metadata, loader, theme button, card and contact/social links; loads CSS and JS. No unfinished section markup on main. |
| `src/main.js` | Pointer tilt, theme toggle, loader lifecycle. No expansion or route handlers on main. |
| `src/style.css` | Fonts, theme variables, texture, responsive card geometry, portrait layering, animation and focus states. |
| `src/Assets/portrait-cropped.png` | Development portrait asset retained in source; not referenced or bundled by production HTML. |
| `src/Assets/Portfolio Photo.png` | Original portrait source; retain unless explicitly asked to replace/remove it. |
| `public/assets/` | Anton font (`anton-regular.ttf`) and LinkedIn/GitHub image assets (`figma-image-2.png`, `figma-image-3.png`); referenced with `/assets/...`. |
| `package.json`, `package-lock.json` | Scripts and dependency declarations / locked dependency tree. |
| `IDEA.md` | Currently only a one-line request to develop the portfolio, not a detailed spec. |

Keep `src/Assets` capitalization exact for case-sensitive build hosts. Local font and image paths should keep working in development and production.

## Current behavior and contracts

### Production (`main`)

- **Card only. No expansion or unfinished content in production.** Clicking the card, Enter/Space, Escape, browser navigation, or loading `#/projects` must never expand it. Do not reintroduce expansion without explicit approval.
- Preserve the centered small card (up to 3.5in by 2in), contact links top-left, social links top-right, and name near bottom-left. Card itself is not an interactive control; links remain keyboard-accessible. No expansion ARIA attributes or card tab stop.
- Pointer tilt uses `requestAnimationFrame` and CSS custom properties; disabled for touch entry and reduced motion, reset on exit/cancel and reduced-motion changes.
- Default palette: bone white page **`#f9f6ee`**, dark card **`#0c0c0c`**, white card text. Preserve grain texture, Anton typography, responsive geometry, link focus styles, and reduced-motion behavior.
- Theme toggle updates `.dark-theme`, `aria-pressed`, accessible label, and `meta[name="theme-color"]`. Theme is currently in-memory only.
- Loader waits for window load, with a normal minimum display time of 350ms; reduced motion removes that minimum.
- About Me, Experience, placeholder biography, and portrait markup are removed from production HTML. Their assets and inactive CSS remain in the repository; do not restore them from older notes as incidental cleanup or a bug fix.

### Development flow (`dev/portfolio-expansion`)

- Full expansion implementation was preserved and pushed to `dev/portfolio-expansion` at `28fba87785387d922668ee0fea7d0a91108ec557` before removal from `main`. Continue unfinished portfolio work on that branch, not production.
- That branch includes the `#/projects` expansion route, About Me / Experience selection, portrait, background/Escape dismissal, focus restoration, and keyboard expansion. Its branch-local guide describes the flow.
- Retain its approved design: selected navigation shifts right with a left dot; role titles stay on one line, organization lines align left underneath, generous vertical spacing, and Experience sits farther right/lower on desktop without moving About Me/navigation.
- Do not merge unfinished development back into `main` without Johan's explicit approval. Check the active branch before following expansion-related historical skill/chat instructions.

## Content and privacy

Do not invent employment dates, titles, metrics, project outcomes, or contact details. Keep placeholder copy visibly identified until approved. Preserve existing contact links unless the request covers them; confirm sensitive contact changes before publication. Never put secrets, API keys, credentials, or private career documents in this guide or frontend assets.

Known existing issue: phone link uses masked `tel:+160****9057`, which does not match the displayed phone number. Confirm intended public value with Johan before fixing; do not silently infer or publish a replacement.

## Verification

For documentation-only changes, check accuracy against source, run `git diff --check`, and inspect final diff. Do not claim UI testing unless performed.

For code/UI changes:

1. Run `npm run build`; check actual result and new warnings. Preview built output when changing asset paths or deployment-sensitive behavior.
2. Check desktop/mobile card layout, contact/social placement, and both themes. Check browser console and missing assets.
3. Verify card clicks and Enter/Space do not expand, including direct `#/projects` loading and hash changes. Confirm no placeholder sections exist in the production DOM/build output.
4. Check tilt/reset, touch and reduced motion, link keyboard focus, and theme toggle ARIA/meta state. Wait for theme transitions before contrast checks.
5. Inspect `git diff --check` and scoped diff; report exact checks run and any unverified behavior. Keep one-off browser tooling outside project dependencies unless requested. If shared browser automation is locked, isolated Playwright with installed Edge (`channel: 'msedge'`) is an available fallback when tooling exists.

Development-branch pitfall: delayed transitions may not run when revealing elements previously set to `display: none`. Preserve expanded-state reveal animations there; this is not a reason to restore expansion on main.

## Maintain this guide

**Agents must update `AGENTS.md` in the same change when their work makes it inaccurate or adds durable context needed by a fresh chat.** This applies to changes in setup/commands, stack/dependencies, file ownership, routes/state contracts, interaction/accessibility behavior, approved design direction, asset paths, deployment, testing, or known limitations.

- Edit the relevant existing section; replace obsolete facts rather than appending contradictory notes. New explicit user corrections override older guidance; reconcile stale guidance wherever it appears here.
- Record current implementation separately from proposed work and unapproved copy. Verify facts from source, actual tool output, or explicit user direction; label anything unresolved.
- Capture reproducible pitfalls and their fix/check, not chat transcripts, session logs, timestamps, temporary tasks, transient working-tree status, or routine cosmetic changes.
- Keep this file self-contained for agents without Hermes memory or skills. Hermes agents should also keep reusable portfolio lessons in `portfolio-design-development`, but repo-specific context must remain here.
- Before finishing, ask: "Would a fresh agent following this guide use stale commands, assume removed behavior, or undo an approved choice?" Fix affected sections and mention the guide update in the final summary. If nothing durable changed, leave it unchanged.
